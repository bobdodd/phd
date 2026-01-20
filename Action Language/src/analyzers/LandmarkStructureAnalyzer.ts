/**
 * Landmark Structure Analyzer
 *
 * Detects accessibility issues with landmark regions and page structure including:
 * - Missing main landmark
 * - Multiple main landmarks without unique labels
 * - Missing navigation landmarks
 * - Unlabeled landmarks (multiple of same type without distinguishing labels)
 * - Improper landmark nesting
 * - Redundant landmark roles on semantic HTML elements
 *
 * WCAG 2.1 Success Criteria:
 * - 1.3.1 Info and Relationships (Level A): Page structure must be programmatically determinable
 * - 2.4.1 Bypass Blocks (Level A): Landmarks enable navigation past repeated content
 * - 4.1.2 Name, Role, Value (Level A): Landmarks must have appropriate roles
 *
 * This analyzer works with DocumentModel to parse landmark elements from HTML.
 */

import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

/**
 * Represents a landmark region
 */
interface LandmarkInfo {
  element: DOMElement;
  type: string; // main, navigation, banner, contentinfo, complementary, search, region, form
  label?: string; // aria-label or aria-labelledby content
  isHidden: boolean;
  hasMultipleSiblings: boolean; // true if multiple landmarks of same type exist
}

/**
 * Mapping of HTML5 semantic elements to implicit ARIA landmark roles
 */
const IMPLICIT_LANDMARKS: Record<string, string> = {
  'main': 'main',
  'nav': 'navigation',
  'header': 'banner', // Only when not nested in article/section
  'footer': 'contentinfo', // Only when not nested in article/section
  'aside': 'complementary',
  'form': 'form', // Only if has accessible name
  'section': 'region' // Only if has accessible name
};

/**
 * Explicit ARIA landmark roles
 */
const LANDMARK_ROLES = [
  'main',
  'navigation',
  'banner',
  'contentinfo',
  'complementary',
  'search',
  'region',
  'form'
];

/**
 * Analyzer for detecting landmark structure accessibility issues.
 */
export class LandmarkStructureAnalyzer extends BaseAnalyzer {
  readonly name = 'LandmarkStructureAnalyzer';
  readonly description = 'Detects accessibility issues with landmark regions and page structure';

  /**
   * Analyze document for landmark structure issues.
   */
  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!this.supportsDocumentModel(context)) {
      return issues;
    }

    const landmarks = this.extractLandmarks(context);
    const visibleLandmarks = landmarks.filter(l => !l.isHidden);

    // Check for missing main landmark
    const mainLandmarks = visibleLandmarks.filter(l => l.type === 'main');
    if (mainLandmarks.length === 0) {
      // Use first element location or default
      const firstElement = context.documentModel?.getAllElements()[0];
      const location = firstElement?.location || { file: 'unknown', line: 1, column: 1 };

      issues.push(this.createIssue(
        'missing-main-landmark',
        'error',
        'Page is missing a main landmark. Add a <main> element or role="main" to identify the primary content area.',
        location,
        ['1.3.1', '2.4.1'],
        context,
        {
          fix: {
            description: 'Add main landmark to page',
            code: '<main>\n  <!-- Primary page content here -->\n</main>',
            location
          }
        }
      ));
    }

    // Check for multiple main landmarks without unique labels
    if (mainLandmarks.length > 1) {
      const unlabeledMains = mainLandmarks.filter(l => !l.label);
      if (unlabeledMains.length > 1) {
        for (const landmark of unlabeledMains) {
          issues.push(this.createIssue(
            'multiple-main-without-labels',
            'error',
            'Multiple main landmarks exist without unique labels. Each main landmark must have a unique aria-label or aria-labelledby.',
            landmark.element.location,
            ['1.3.1', '4.1.2'],
            context,
            {
              elementContext: this.getElementContext(context, landmark.element),
              fix: {
                description: 'Add unique label to main landmark',
                code: this.getElementHTML(landmark.element, { 'aria-label': 'Unique description' }),
                location: landmark.element.location
              }
            }
          ));
        }
      }
    }

    // Check for multiple landmarks of same type without labels
    const landmarksByType = this.groupLandmarksByType(visibleLandmarks);
    for (const [type, landmarksOfType] of Object.entries(landmarksByType)) {
      if (landmarksOfType.length > 1) {
        const unlabeled = landmarksOfType.filter(l => !l.label);
        if (unlabeled.length > 1 || (unlabeled.length === 1 && landmarksOfType.length > 1)) {
          for (const landmark of unlabeled) {
            const typeName = this.getLandmarkTypeName(type);
            issues.push(this.createIssue(
              'unlabeled-landmark',
              'warning',
              `Multiple ${typeName} landmarks exist but this one lacks a unique label. Add aria-label or aria-labelledby to distinguish it from other ${typeName} landmarks.`,
              landmark.element.location,
              ['1.3.1', '4.1.2'],
              context,
              {
                elementContext: this.getElementContext(context, landmark.element),
                fix: {
                  description: `Add unique label to ${typeName} landmark`,
                  code: this.getElementHTML(landmark.element, { 'aria-label': `Unique ${typeName} description` }),
                  location: landmark.element.location
                }
              }
            ));
          }
        }
      }
    }

    // Check for redundant roles on semantic HTML elements
    for (const landmark of landmarks) {
      const tagName = landmark.element.tagName.toLowerCase();
      const explicitRole = landmark.element.attributes.role;

      if (explicitRole && IMPLICIT_LANDMARKS[tagName]) {
        const implicitRole = this.getImplicitRole(landmark.element, context);
        if (explicitRole === implicitRole) {
          issues.push(this.createIssue(
            'redundant-landmark-role',
            'info',
            `Redundant role="${explicitRole}" on <${tagName}> element. The <${tagName}> element already has an implicit role of "${implicitRole}".`,
            landmark.element.location,
            ['4.1.2'],
            context,
            {
              elementContext: this.getElementContext(context, landmark.element),
              fix: {
                description: 'Remove redundant role attribute',
                code: this.getElementHTMLWithoutRole(landmark.element),
                location: landmark.element.location
              }
            }
          ));
        }
      }
    }

    // Check for form/section elements without accessible names
    for (const landmark of landmarks) {
      const tagName = landmark.element.tagName.toLowerCase();
      if ((tagName === 'section' || tagName === 'form') && !landmark.label) {
        // section without accessible name doesn't become a region landmark
        // form without accessible name doesn't become a form landmark
        if (tagName === 'section' && !landmark.element.attributes.role) {
          issues.push(this.createIssue(
            'section-without-label',
            'warning',
            '<section> element without accessible name will not be exposed as a landmark. Add aria-label or aria-labelledby, or use a different element.',
            landmark.element.location,
            ['1.3.1'],
            context,
            {
              elementContext: this.getElementContext(context, landmark.element),
              fix: {
                description: 'Add accessible name to section',
                code: this.getElementHTML(landmark.element, { 'aria-label': 'Section description' }),
                location: landmark.element.location
              }
            }
          ));
        }
      }
    }

    // Check for improper landmark nesting
    for (const landmark of landmarks) {
      const nestingIssue = this.checkLandmarkNesting(landmark, context);
      if (nestingIssue) {
        issues.push(nestingIssue);
      }
    }

    return issues;
  }

  /**
   * Extract all landmark elements from the document.
   */
  private extractLandmarks(context: AnalyzerContext): LandmarkInfo[] {
    const landmarks: LandmarkInfo[] = [];

    if (!context.documentModel) {
      return landmarks;
    }

    const allElements = context.documentModel.getAllElements();

    for (const element of allElements) {
      const tagName = element.tagName.toLowerCase();
      const explicitRole = element.attributes.role;
      let landmarkType: string | null = null;

      // Check for explicit ARIA landmark role
      if (explicitRole && LANDMARK_ROLES.includes(explicitRole)) {
        landmarkType = explicitRole;
      }
      // Check for implicit landmark from semantic HTML
      else if (IMPLICIT_LANDMARKS[tagName]) {
        const implicitRole = this.getImplicitRole(element, context);
        if (implicitRole) {
          landmarkType = implicitRole;
        }
      }

      if (landmarkType) {
        const label = this.getAccessibleName(element, context);
        const isHidden = this.isElementHidden(element, context);

        landmarks.push({
          element,
          type: landmarkType,
          label,
          isHidden,
          hasMultipleSiblings: false // Will be set later
        });
      }
    }

    // Mark landmarks that have multiple siblings of same type
    const typeGroups = this.groupLandmarksByType(landmarks.filter(l => !l.isHidden));
    for (const group of Object.values(typeGroups)) {
      if (group.length > 1) {
        group.forEach(l => l.hasMultipleSiblings = true);
      }
    }

    return landmarks;
  }

  /**
   * Get implicit ARIA role for semantic HTML element.
   */
  private getImplicitRole(element: DOMElement, context: AnalyzerContext): string | null {
    const tagName = element.tagName.toLowerCase();

    // main element always has role="main"
    if (tagName === 'main') return 'main';

    // nav element always has role="navigation"
    if (tagName === 'nav') return 'navigation';

    // aside element always has role="complementary"
    if (tagName === 'aside') return 'complementary';

    // header element has role="banner" only if not nested in article/section/aside
    if (tagName === 'header') {
      if (this.isNestedInSectioningContent(element)) {
        return null; // No landmark role when nested
      }
      return 'banner';
    }

    // footer element has role="contentinfo" only if not nested in article/section/aside
    if (tagName === 'footer') {
      if (this.isNestedInSectioningContent(element)) {
        return null; // No landmark role when nested
      }
      return 'contentinfo';
    }

    // section element has role="region" only if it has accessible name
    if (tagName === 'section') {
      const label = this.getAccessibleName(element, context);
      return label ? 'region' : null;
    }

    // form element has role="form" only if it has accessible name
    if (tagName === 'form') {
      const label = this.getAccessibleName(element, context);
      return label ? 'form' : null;
    }

    return null;
  }

  /**
   * Check if element is nested inside sectioning content (article, section, aside).
   */
  private isNestedInSectioningContent(element: DOMElement): boolean {
    const sectioningElements = ['article', 'section', 'aside', 'nav'];
    let parent = element.parent;

    while (parent) {
      if (sectioningElements.includes(parent.tagName.toLowerCase())) {
        return true;
      }
      parent = parent.parent;
    }

    return false;
  }

  /**
   * Get accessible name for element.
   */
  private getAccessibleName(element: DOMElement, context: AnalyzerContext): string | undefined {
    // Check aria-label
    const ariaLabel = element.attributes['aria-label'];
    if (ariaLabel) return ariaLabel;

    // Check aria-labelledby
    const labelledby = element.attributes['aria-labelledby'];
    if (labelledby && context.documentModel) {
      const allElements = context.documentModel.getAllElements();
      const referencedElement = allElements.find(el => el.attributes.id === labelledby);
      if (referencedElement) {
        return this.getElementText(referencedElement);
      }
    }

    return undefined;
  }

  /**
   * Get text content from element.
   */
  private getElementText(element: DOMElement): string {
    let text = '';
    for (const child of element.children) {
      if (child.nodeType === 'text') {
        text += child.textContent || '';
      } else if (child.nodeType === 'element') {
        text += this.getElementText(child as DOMElement);
      }
    }
    return text.trim();
  }

  /**
   * Group landmarks by type.
   */
  private groupLandmarksByType(landmarks: LandmarkInfo[]): Record<string, LandmarkInfo[]> {
    const groups: Record<string, LandmarkInfo[]> = {};
    for (const landmark of landmarks) {
      if (!groups[landmark.type]) {
        groups[landmark.type] = [];
      }
      groups[landmark.type].push(landmark);
    }
    return groups;
  }

  /**
   * Get human-readable landmark type name.
   */
  private getLandmarkTypeName(type: string): string {
    const names: Record<string, string> = {
      'main': 'main',
      'navigation': 'navigation',
      'banner': 'banner',
      'contentinfo': 'contentinfo',
      'complementary': 'complementary',
      'search': 'search',
      'region': 'region',
      'form': 'form'
    };
    return names[type] || type;
  }

  /**
   * Check for improper landmark nesting.
   */
  private checkLandmarkNesting(landmark: LandmarkInfo, context: AnalyzerContext): Issue | null {
    // Check if main is nested inside another landmark (not recommended)
    if (landmark.type === 'main') {
      let parent = landmark.element.parent;
      while (parent) {
        const parentRole = this.getImplicitRole(parent, context) || parent.attributes.role;
        if (parentRole && LANDMARK_ROLES.includes(parentRole) && parentRole !== 'main') {
          return this.createIssue(
            'main-nested-in-landmark',
            'warning',
            `Main landmark is nested inside a ${parentRole} landmark. This can cause navigation issues for screen reader users.`,
            landmark.element.location,
            ['1.3.1'],
            context,
            {
              elementContext: this.getElementContext(context, landmark.element)
            }
          );
        }
        parent = parent.parent;
      }
    }

    return null;
  }

  /**
   * Check if element is hidden.
   */
  private isElementHidden(element: DOMElement, context: AnalyzerContext): boolean {
    // Check aria-hidden
    if (element.attributes['aria-hidden'] === 'true') {
      return true;
    }

    // Check CSS display/visibility
    const elementContext = context.documentModel?.getElementContext(element);
    if (elementContext) {
      for (const cssRule of elementContext.cssRules) {
        if (cssRule.property === 'display' && cssRule.value === 'none') {
          return true;
        }
        if (cssRule.property === 'visibility' && cssRule.value === 'hidden') {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get element context for reporting.
   */
  private getElementContext(context: AnalyzerContext, element: DOMElement) {
    return context.documentModel?.getElementContext(element);
  }

  /**
   * Get HTML representation of element with attribute overrides.
   */
  private getElementHTML(element: DOMElement, attrOverrides?: Record<string, string>): string {
    const attrs = { ...element.attributes, ...attrOverrides };
    const attrString = Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `<${element.tagName}${attrString ? ' ' + attrString : ''}>`;
  }

  /**
   * Get HTML representation without role attribute.
   */
  private getElementHTMLWithoutRole(element: DOMElement): string {
    const attrs = { ...element.attributes };
    delete attrs.role;

    const attrString = Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `<${element.tagName}${attrString ? ' ' + attrString : ''}>`;
  }
}
