/**
 * Alt Text Analyzer
 *
 * Detects accessibility issues with image alt text including:
 * - Missing alt attributes
 * - Alt text with only whitespace (not the same as alt="")
 * - Alt text containing URLs or file paths
 * - Alt text with file extensions
 * - Alt text containing HTML tags (common mistake)
 * - Alt text exceeding 150 characters
 * - Generic/non-descriptive alt text
 *
 * WCAG 2.1 Success Criteria:
 * - 1.1.1 Non-text Content (Level A): All images must have text alternatives
 *
 * IMPORTANT: alt="" (empty string) is CORRECT for decorative images and is NOT flagged.
 *
 * This analyzer works with DocumentModel to parse image elements from HTML.
 */

import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

/**
 * Represents an image with its alt text context
 */
interface ImageInfo {
  element: DOMElement;
  src?: string;
  alt?: string;
  hasAlt: boolean;
  isDecorative: boolean; // alt=""
  hasAriaLabel: boolean;
  hasAriaLabelledby: boolean;
  role?: string;
}

/**
 * Analyzer for detecting alt text accessibility issues.
 */
export class AltTextAnalyzer extends BaseAnalyzer {
  readonly name = 'AltTextAnalyzer';
  readonly description = 'Detects accessibility issues with image alt text';

  private readonly MAX_ALT_LENGTH = 150;
  private readonly GENERIC_ALT_TERMS = ['image', 'picture', 'photo', 'graphic', 'icon', 'img'];
  private readonly URL_PATTERN = /^https?:\/\//i;
  private readonly FILE_PATH_PATTERN = /^(\.\/|\.\.\/|\/)/;
  private readonly FILE_EXTENSION_PATTERN = /\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)$/i;
  private readonly HTML_TAG_PATTERN = /<[^>]+>/;

  /**
   * Analyze document for alt text issues.
   */
  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!this.supportsDocumentModel(context)) {
      return issues;
    }

    const images = this.extractImages(context);

    for (const image of images) {
      // Skip if hidden
      if (this.isElementHidden(image.element, context)) {
        continue;
      }

      // Skip if has role="presentation" or role="none" (explicitly decorative)
      if (image.role === 'presentation' || image.role === 'none') {
        continue;
      }

      // ERROR: Missing alt attribute entirely
      if (!image.hasAlt) {
        issues.push(this.createIssue(
          'missing-alt-attribute',
          'error',
          `Image is missing alt attribute. All images must have an alt attribute. Use alt="" for decorative images.`,
          image.element.location,
          ['1.1.1'],
          context,
          {
            elementContext: this.getElementContext(context, image.element),
            fix: {
              description: 'Add alt attribute to image',
              code: this.getElementHTML(image.element, { alt: 'Descriptive text' }),
              location: image.element.location
            }
          }
        ));
        continue; // Skip other checks if no alt attribute
      }

      const altText = image.alt || '';

      // alt="" is VALID for decorative images - do not flag
      if (image.isDecorative) {
        continue; // This is correct, move on
      }

      // ERROR: Alt with only whitespace (different from empty string)
      if (altText.trim().length === 0 && altText.length > 0) {
        issues.push(this.createIssue(
          'alt-only-whitespace',
          'error',
          `Image alt attribute contains only whitespace. Use alt="" for decorative images or provide descriptive text.`,
          image.element.location,
          ['1.1.1'],
          context,
          {
            elementContext: this.getElementContext(context, image.element),
            fix: {
              description: 'Replace with empty alt for decorative image or add description',
              code: this.getElementHTML(image.element, { alt: '' }),
              location: image.element.location
            }
          }
        ));
        continue;
      }

      // ERROR: Alt contains HTML tags
      if (this.HTML_TAG_PATTERN.test(altText)) {
        issues.push(this.createIssue(
          'alt-contains-html',
          'error',
          `Alt text contains HTML tags: "${altText}". Alt text is plain text only - HTML tags will be read aloud by screen readers.`,
          image.element.location,
          ['1.1.1'],
          context,
          {
            elementContext: this.getElementContext(context, image.element),
            fix: {
              description: 'Remove HTML tags from alt text',
              code: this.getElementHTML(image.element, {
                alt: altText.replace(/<[^>]+>/g, '')
              }),
              location: image.element.location
            }
          }
        ));
      }

      // ERROR: Alt contains URLs
      if (this.URL_PATTERN.test(altText)) {
        issues.push(this.createIssue(
          'alt-contains-url',
          'error',
          `Alt text contains URL: "${altText}". URLs are not descriptive for screen reader users. Describe what the image shows.`,
          image.element.location,
          ['1.1.1'],
          context,
          {
            elementContext: this.getElementContext(context, image.element),
            fix: {
              description: 'Replace URL with descriptive text',
              code: this.getElementHTML(image.element, { alt: 'Descriptive text' }),
              location: image.element.location
            }
          }
        ));
      }

      // ERROR: Alt contains file paths
      if (this.FILE_PATH_PATTERN.test(altText)) {
        issues.push(this.createIssue(
          'alt-contains-filepath',
          'error',
          `Alt text contains file path: "${altText}". File paths are not meaningful for screen reader users. Describe what the image shows.`,
          image.element.location,
          ['1.1.1'],
          context,
          {
            elementContext: this.getElementContext(context, image.element),
            fix: {
              description: 'Replace file path with descriptive text',
              code: this.getElementHTML(image.element, { alt: 'Descriptive text' }),
              location: image.element.location
            }
          }
        ));
      }

      // ERROR: Alt ends with file extension
      if (this.FILE_EXTENSION_PATTERN.test(altText)) {
        issues.push(this.createIssue(
          'alt-ends-with-extension',
          'error',
          `Alt text ends with file extension: "${altText}". Remove the file extension from alt text.`,
          image.element.location,
          ['1.1.1'],
          context,
          {
            elementContext: this.getElementContext(context, image.element),
            fix: {
              description: 'Remove file extension from alt text',
              code: this.getElementHTML(image.element, {
                alt: altText.replace(this.FILE_EXTENSION_PATTERN, '')
              }),
              location: image.element.location
            }
          }
        ));
      }

      // WARNING: Alt text exceeds 150 characters
      if (altText.length > this.MAX_ALT_LENGTH) {
        issues.push(this.createIssue(
          'alt-too-long',
          'warning',
          `Alt text is ${altText.length} characters (maximum recommended: ${this.MAX_ALT_LENGTH}). Consider using aria-describedby for longer descriptions.`,
          image.element.location,
          ['1.1.1'],
          context,
          {
            elementContext: this.getElementContext(context, image.element),
            fix: {
              description: 'Shorten alt text or use aria-describedby',
              code: `<img src="${image.src || '...'}" alt="Brief description" aria-describedby="detailed-description">\n<div id="detailed-description">\n  ${altText}\n</div>`,
              location: image.element.location
            }
          }
        ));
      }

      // WARNING: Generic/non-descriptive alt text
      const altLower = altText.toLowerCase().trim();
      if (this.GENERIC_ALT_TERMS.includes(altLower)) {
        issues.push(this.createIssue(
          'alt-generic',
          'warning',
          `Alt text "${altText}" is not descriptive. Describe what the image shows, not just that it is an image.`,
          image.element.location,
          ['1.1.1'],
          context,
          {
            elementContext: this.getElementContext(context, image.element),
            fix: {
              description: 'Provide descriptive alt text',
              code: this.getElementHTML(image.element, { alt: 'Descriptive text about the image content' }),
              location: image.element.location
            }
          }
        ));
      }
    }

    return issues;
  }

  /**
   * Extract all image elements from the document.
   */
  private extractImages(context: AnalyzerContext): ImageInfo[] {
    const images: ImageInfo[] = [];

    if (!context.documentModel) {
      return images;
    }

    const allElements = context.documentModel.getAllElements();
    const imageElements = allElements.filter(
      el => el.tagName.toLowerCase() === 'img'
    );

    for (const element of imageElements) {
      const src = element.attributes.src;
      const alt = element.attributes.alt;
      const hasAlt = 'alt' in element.attributes;
      const isDecorative = hasAlt && alt === ''; // alt="" is decorative
      const hasAriaLabel = !!element.attributes['aria-label'];
      const hasAriaLabelledby = !!element.attributes['aria-labelledby'];
      const role = element.attributes.role;

      images.push({
        element,
        src,
        alt,
        hasAlt,
        isDecorative,
        hasAriaLabel,
        hasAriaLabelledby,
        role
      });
    }

    return images;
  }

  /**
   * Check if an element is hidden via CSS or attributes.
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
   * Get HTML representation of an element with optional attribute overrides.
   */
  private getElementHTML(element: DOMElement, attrOverrides?: Record<string, string>): string {
    const attrs = { ...element.attributes, ...attrOverrides };
    const attrString = Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `<${element.tagName}${attrString ? ' ' + attrString : ''}>`;
  }
}
