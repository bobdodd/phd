/**
 * Heading Structure Analyzer
 *
 * Detects accessibility issues in heading hierarchy and structure including:
 * - Empty headings
 * - Skipped heading levels (e.g., h1 followed by h3)
 * - Missing or multiple H1 elements
 * - Improper heading hierarchy
 * - aria-level without role
 * - Heading length issues
 *
 * WCAG 2.1 Success Criteria:
 * - 1.3.1 Info and Relationships (Level A): Heading hierarchy must be programmatically determinable
 * - 2.4.1 Bypass Blocks (Level A): Headings enable navigation
 * - 2.4.6 Headings and Labels (Level AA): Headings must be descriptive
 * - 2.4.10 Section Headings (Level AAA): Use headings to organize content
 *
 * This analyzer works with DocumentModel to parse heading elements from HTML.
 */

import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

/**
 * Represents a heading element with its level and context
 */
interface HeadingInfo {
  level: number;
  element: DOMElement;
  text: string;
  isEmpty: boolean;
  isHidden: boolean;
}

/**
 * Analyzer for detecting heading structure accessibility issues.
 */
export class HeadingStructureAnalyzer extends BaseAnalyzer {
  readonly name = 'HeadingStructureAnalyzer';
  readonly description = 'Detects accessibility issues in heading hierarchy and structure';

  // Configuration for heading length warnings
  private readonly MAX_HEADING_LENGTH = 60;
  private readonly NEAR_LIMIT_THRESHOLD = 40; // ~67% of max

  /**
   * Analyze document for heading structure issues.
   */
  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!this.supportsDocumentModel(context)) {
      return issues;
    }

    // Detect if fragment contains a full page (html/body tags)
    // If so, upgrade to page scope for analysis
    let effectiveScope = context.scope;
    if (context.scope === 'file' && this.isFullPage(context)) {
      effectiveScope = 'page';
    }

    const headings = this.extractHeadings(context);

    if (headings.length === 0) {
      // No headings on page
      issues.push(this.createIssue(
        'no-headings-on-page',
        'error',
        'Page contains no heading elements. Headings provide structure and enable navigation for screen reader users.',
        { file: '', line: 1, column: 1 },
        ['1.3.1', '2.4.6'],
        context,
        {
          fix: {
            description: 'Add headings to structure your content',
            code: `<h1>Page Title</h1>
<h2>Main Section</h2>
<h3>Subsection</h3>`,
            location: { file: '', line: 1, column: 1 }
          }
        }
      ));
      // Don't return early - still need to check for aria-level issues
    } else {
      // Check for H1 issues using effective scope
      const contextWithEffectiveScope = { ...context, scope: effectiveScope };
      issues.push(...this.analyzeH1(headings, contextWithEffectiveScope));

      // Check heading hierarchy (skipped levels)
      issues.push(...this.analyzeHierarchy(headings, context));
    }

    // Check individual headings
    for (const heading of headings) {
      // Empty headings
      if (heading.isEmpty) {
        issues.push(this.createIssue(
          'empty-heading',
          'error',
          `Heading level ${heading.level} contains no text content. Screen readers will announce it as empty, causing confusion.`,
          heading.element.location,
          ['2.4.6', '1.3.1'],
          context,
          {
            fix: {
              description: 'Add descriptive text to the heading or remove it',
              code: `<h${heading.level}>Descriptive Section Title</h${heading.level}>`,
              location: heading.element.location
            }
          }
        ));
      }

      // Hidden headings
      if (heading.isHidden && !heading.isEmpty) {
        issues.push(this.createIssue(
          'hidden-heading',
          'warning',
          `Heading level ${heading.level} is hidden with display:none or visibility:hidden. Hidden headings may be read inconsistently by screen readers.`,
          heading.element.location,
          ['1.3.1'],
          context,
          {
            fix: {
              description: 'Make the heading visible or remove it',
              code: `<!-- Remove display:none/visibility:hidden -->
<h${heading.level}>${heading.text}</h${heading.level}>

<!-- OR use visually-hidden technique if needed for screen readers only -->
<h${heading.level} class="sr-only">${heading.text}</h${heading.level}>`,
              location: heading.element.location
            }
          }
        ));
      }

      // Heading length issues
      if (heading.text.length > this.MAX_HEADING_LENGTH) {
        issues.push(this.createIssue(
          'heading-too-long',
          'warning',
          `Heading level ${heading.level} is ${heading.text.length} characters long (recommended: <${this.MAX_HEADING_LENGTH}). Long headings are difficult to scan and navigate.`,
          heading.element.location,
          ['2.4.6'],
          context,
          {
            fix: {
              description: 'Shorten the heading to make it more concise',
              code: `<h${heading.level}>Concise Descriptive Title</h${heading.level}>

<!-- If more detail needed, use a paragraph: -->
<h${heading.level}>Section Title</h${heading.level}>
<p>Additional explanatory text can go here.</p>`,
              location: heading.element.location
            }
          }
        ));
      } else if (heading.text.length >= this.NEAR_LIMIT_THRESHOLD && heading.text.length <= this.MAX_HEADING_LENGTH) {
        issues.push(this.createIssue(
          'heading-near-length-limit',
          'info',
          `Heading level ${heading.level} is ${heading.text.length} characters long, approaching the recommended limit of ${this.MAX_HEADING_LENGTH}. Consider shortening for better scannability.`,
          heading.element.location,
          ['2.4.6'],
          context
        ));
      }
    }

    // Check for aria-level without role
    issues.push(...this.analyzeAriaLevel(context));

    return issues;
  }

  /**
   * Extract all heading elements from the document.
   */
  private extractHeadings(context: AnalyzerContext): HeadingInfo[] {
    const headings: HeadingInfo[] = [];
    const doc = context.documentModel!;

    // Get all elements from all DOM fragments
    const allElements = doc.getAllElements();

    for (const element of allElements) {
      const tagName = element.tagName.toLowerCase();

      // Check for h1-h6 elements
      if (/^h[1-6]$/.test(tagName)) {
        const level = parseInt(tagName[1], 10);
        headings.push({
          level,
          element,
          text: this.getElementText(element),
          isEmpty: this.isElementEmpty(element),
          isHidden: this.isElementHidden(element)
        });
      }
      // Check for role="heading" with aria-level
      else if (element.attributes['role'] === 'heading' && element.attributes['aria-level']) {
        const level = parseInt(element.attributes['aria-level'], 10);
        if (level >= 1 && level <= 6) {
          headings.push({
            level,
            element,
            text: this.getElementText(element),
            isEmpty: this.isElementEmpty(element),
            isHidden: this.isElementHidden(element)
          });
        }
      }
    }

    // Sort by document order (line number)
    headings.sort((a, b) => a.element.location.line - b.element.location.line);

    return headings;
  }

  /**
   * Analyze H1 presence and uniqueness.
   */
  private analyzeH1(headings: HeadingInfo[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    const h1Headings = headings.filter(h => h.level === 1 && !h.isEmpty);
    const isPageScope = context.scope === 'page' || context.scope === 'workspace';

    // Check for multiple H1s at any scope (can happen in fragments too)
    if (h1Headings.length > 1) {
      // Report a single issue for multiple H1 elements, located at the second H1
      issues.push(this.createIssue(
        'multiple-h1-headings',
        'warning',
        `Found ${h1Headings.length} H1 elements. There should be exactly one H1 per page representing the main topic.`,
        h1Headings[1].element.location,
        ['1.3.1'],
        context,
        {
          relatedLocations: h1Headings.map(h => h.element.location),
          fix: {
            description: 'Change additional H1 elements to H2 or lower',
            code: `<h1>Main Page Title</h1>
<!-- Change other H1s to appropriate levels: -->
<h2>Section Title</h2>
<h2>Another Section</h2>`,
            location: h1Headings[1].element.location
          }
        }
      ));
    }

    // Only check for missing H1 and page-start at page scope
    if (isPageScope) {
      if (h1Headings.length === 0) {
        // No H1 on page
        const firstHeading = headings[0];
        issues.push(this.createIssue(
          'no-h1-on-page',
          'error',
          'Page has headings but no H1 element. Every page should have exactly one H1 that describes the main content.',
          firstHeading ? firstHeading.element.location : { file: '', line: 1, column: 1 },
          ['1.3.1', '2.4.6'],
          context,
          {
            fix: {
              description: 'Add a single H1 element that describes the main content',
              code: `<h1>Page Title - Main Topic</h1>`,
              location: firstHeading ? firstHeading.element.location : { file: '', line: 1, column: 1 }
            }
          }
        ));
      }

      // Check if page starts with H1 (first heading should be H1)
      if (headings.length > 0 && headings[0].level !== 1 && !headings[0].isEmpty) {
        issues.push(this.createIssue(
          'page-doesnt-start-with-h1',
          'warning',
          `First heading on page is H${headings[0].level}, not H1. Pages should start with H1 as the main heading.`,
          headings[0].element.location,
          ['1.3.1', '2.4.6'],
          context,
          {
            fix: {
              description: 'Start the page with an H1 heading',
              code: `<h1>Page Title</h1>
<h2>First Section</h2>`,
              location: headings[0].element.location
            }
          }
        ));
      }
    }

    return issues;
  }

  /**
   * Analyze heading hierarchy for skipped levels.
   */
  private analyzeHierarchy(headings: HeadingInfo[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    let previousLevel = 0;

    // Filter out empty headings for hierarchy analysis
    const nonEmptyHeadings = headings.filter(h => !h.isEmpty);

    for (const heading of nonEmptyHeadings) {
      const level = heading.level;

      // Check for skipped levels (only when level increases)
      if (previousLevel > 0 && level > previousLevel + 1) {
        const skippedLevels = [];
        for (let i = previousLevel + 1; i < level; i++) {
          skippedLevels.push(`H${i}`);
        }

        issues.push(this.createIssue(
          'heading-levels-skipped',
          'error',
          `Heading level jumps from H${previousLevel} to H${level}, skipping ${skippedLevels.join(', ')}. Maintain sequential heading levels without skipping.`,
          heading.element.location,
          ['1.3.1'],
          context,
          {
            fix: {
              description: 'Adjust heading levels to maintain sequential hierarchy',
              code: `<!-- Correct hierarchy: -->
<h${previousLevel}>Previous Section</h${previousLevel}>
<h${previousLevel + 1}>Next Section</h${previousLevel + 1}>

<!-- Instead of skipping to: -->
<h${level}>This Section</h${level}>`,
              location: heading.element.location
            }
          }
        ));
      }

      previousLevel = level;
    }

    return issues;
  }

  /**
   * Check for aria-level without role attribute.
   */
  private analyzeAriaLevel(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    const doc = context.documentModel!;

    // Find elements with aria-level but NO role attribute
    const allElements = doc.getAllElements();
    for (const element of allElements) {
      if (element.attributes['aria-level'] && !element.attributes['role']) {
        const level = element.attributes['aria-level'];
        issues.push(this.createIssue(
          'aria-level-without-role',
          'error',
          `Element has aria-level="${level}" but no role attribute. Elements with aria-level must have role="heading".`,
          element.location,
          ['4.1.2'],
          context,
          {
            fix: {
              description: 'Add role="heading" to the element',
              code: `<div role="heading" aria-level="${level}">Section Title</div>

<!-- OR use semantic HTML: -->
<h${level}>Section Title</h${level}>`,
              location: element.location
            }
          }
        ));
      }
    }

    return issues;
  }

  /**
   * Get text content from an element.
   */
  private getElementText(element: DOMElement): string {
    // Try aria-label first
    if (element.attributes['aria-label']) {
      return element.attributes['aria-label'];
    }

    // Try aria-labelledby
    if (element.attributes['aria-labelledby']) {
      // In source code analysis, we can't easily resolve this
      // So we'll consider it as having text
      return '[aria-labelledby]';
    }

    // Get text from children
    let text = '';
    for (const child of element.children) {
      if (child.nodeType === 'text' && child.textContent) {
        text += child.textContent;
      }
    }

    return text.trim();
  }

  /**
   * Check if an element is empty (no text content).
   */
  private isElementEmpty(element: DOMElement): boolean {
    const text = this.getElementText(element);
    return !text || text.trim().length === 0;
  }

  /**
   * Check if an element is hidden via CSS.
   */
  private isElementHidden(element: DOMElement): boolean {
    // Check inline styles
    const style = element.attributes['style'];
    if (style) {
      if (/display\s*:\s*none/i.test(style) || /visibility\s*:\s*hidden/i.test(style)) {
        return true;
      }
    }

    // Check class names for common hidden patterns
    const className = element.attributes['class'];
    if (className) {
      if (/\b(hidden|hide|d-none|invisible)\b/.test(className)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if the document contains a full HTML page structure.
   * If it has <html> or <body> tags, treat it as a complete page.
   */
  private isFullPage(context: AnalyzerContext): boolean {
    const doc = context.documentModel!;
    const allElements = doc.getAllElements();

    for (const element of allElements) {
      const tagName = element.tagName.toLowerCase();
      if (tagName === 'html' || tagName === 'body') {
        return true;
      }
    }

    return false;
  }
}
