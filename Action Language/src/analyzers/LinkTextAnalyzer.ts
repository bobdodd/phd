/**
 * Link Text Analyzer
 *
 * Detects accessibility issues with link text quality and descriptiveness including:
 * - Generic link text ("click here", "read more", "learn more")
 * - Empty links without accessible names
 * - Links with only URLs as text
 * - Links with identical text pointing to different destinations
 * - Links that are too long
 * - Links with only images (must have alt text)
 *
 * WCAG 2.1 Success Criteria:
 * - 2.4.4 Link Purpose (In Context) (Level A): Link purpose must be determinable from link text or context
 * - 2.4.9 Link Purpose (Link Only) (Level AAA): Link purpose must be clear from link text alone
 * - 4.1.2 Name, Role, Value (Level A): Links must have accessible names
 *
 * This analyzer works with DocumentModel to parse link elements from HTML.
 */

import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

/**
 * Represents a link element with its context
 */
interface LinkInfo {
  element: DOMElement;
  text: string;
  href: string;
  hasAccessibleName: boolean;
  isHidden: boolean;
  hasImageOnly: boolean;
  imageAlt?: string;
}

/**
 * Generic link text patterns that are not descriptive
 */
const GENERIC_LINK_PATTERNS = [
  // Click here variations
  /^click\s+here$/i,
  /^click$/i,

  // Read more variations
  /^read\s+more$/i,
  /^more$/i,
  /^more\s+info$/i,
  /^more\s+information$/i,

  // Learn more variations
  /^learn\s+more$/i,

  // Here variations
  /^here$/i,

  // Link variations
  /^link$/i,
  /^this\s+link$/i,

  // Page variations
  /^page$/i,
  /^this\s+page$/i,

  // Download variations
  /^download$/i,

  // Continue variations
  /^continue$/i,
  /^continue\s+reading$/i,

  // View variations
  /^view$/i,
  /^view\s+more$/i,

  // Go variations
  /^go$/i,
  /^go\s+here$/i
];

/**
 * Analyzer for detecting link text accessibility issues.
 */
export class LinkTextAnalyzer extends BaseAnalyzer {
  readonly name = 'LinkTextAnalyzer';
  readonly description = 'Detects accessibility issues with link text quality and descriptiveness';

  private readonly MAX_LINK_LENGTH = 100;

  /**
   * Analyze document for link text issues.
   */
  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!this.supportsDocumentModel(context)) {
      return issues;
    }

    const links = this.extractLinks(context);
    const visibleLinks = links.filter(link => !link.isHidden);

    // Check each link
    for (const link of visibleLinks) {
      // Empty link text
      if (!link.hasAccessibleName && !link.text && !link.hasImageOnly) {
        issues.push(this.createIssue(
          'empty-link-text',
          'error',
          'Link has no accessible name or text content. Screen reader users will not know the link purpose.',
          link.element.location,
          ['2.4.4', '4.1.2'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(link.element),
            fix: {
              description: 'Add descriptive text or aria-label to link',
              code: `<a href="${link.href}" aria-label="Descriptive link purpose">Link text</a>`,
              location: link.element.location
            }
          }
        ));
        continue;
      }

      // Link with image only but no alt text
      if (link.hasImageOnly && !link.imageAlt) {
        issues.push(this.createIssue(
          'link-image-no-alt',
          'error',
          'Link contains only an image without alt text. Screen reader users will not know the link purpose.',
          link.element.location,
          ['2.4.4', '4.1.2'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(link.element),
            fix: {
              description: 'Add alt text to image',
              code: `<a href="${link.href}">
  <img src="..." alt="Descriptive link purpose">
</a>`,
              location: link.element.location
            }
          }
        ));
        continue;
      }

      // Get effective link text
      const linkText = link.text || link.imageAlt || '';

      // Generic link text
      if (this.isGenericLinkText(linkText)) {
        issues.push(this.createIssue(
          'generic-link-text',
          'warning',
          `Link text "${linkText}" is not descriptive. Screen reader users navigating by links will not understand the link purpose without surrounding context.`,
          link.element.location,
          ['2.4.4', '2.4.9'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(link.element),
            fix: {
              description: 'Use descriptive link text that explains the destination',
              code: `<a href="${link.href}">Descriptive link text that explains destination</a>`,
              location: link.element.location
            }
          }
        ));
      }

      // Link text is just a URL
      if (this.isUrlText(linkText)) {
        issues.push(this.createIssue(
          'link-url-as-text',
          'warning',
          `Link text is a URL: "${linkText}". Consider using descriptive text instead for better usability.`,
          link.element.location,
          ['2.4.4'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(link.element),
            fix: {
              description: 'Replace URL with descriptive link text',
              code: `<a href="${link.href}">Descriptive link text</a>`,
              location: link.element.location
            }
          }
        ));
      }

      // Link text too long
      if (linkText.length > this.MAX_LINK_LENGTH) {
        issues.push(this.createIssue(
          'link-text-too-long',
          'info',
          `Link text is ${linkText.length} characters (recommended maximum: ${this.MAX_LINK_LENGTH}). Consider making it more concise.`,
          link.element.location,
          ['2.4.4'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(link.element)
          }
        ));
      }
    }

    // Check for duplicate link text with different destinations
    const duplicates = this.findDuplicateLinkText(visibleLinks);
    for (const duplicate of duplicates) {
      issues.push(this.createIssue(
        'duplicate-link-text',
        'warning',
        `Multiple links have identical text "${duplicate.text}" but point to different destinations. Screen reader users may be confused about which link to follow.`,
        duplicate.elements[0].location,
        ['2.4.4', '2.4.9'],
        context,
        {
          elementContext: context.documentModel?.getElementContext(duplicate.elements[0]),
          fix: {
            description: 'Make each link text unique to distinguish destinations',
            code: `<a href="${duplicate.hrefs[0]}">Specific destination 1</a>
<a href="${duplicate.hrefs[1]}">Specific destination 2</a>`,
            location: duplicate.elements[0].location
          }
        }
      ));
    }

    return issues;
  }

  /**
   * Extract all links from the document.
   */
  private extractLinks(context: AnalyzerContext): LinkInfo[] {
    const links: LinkInfo[] = [];

    if (!context.documentModel) {
      return links;
    }

    const allElements = context.documentModel.getAllElements();

    // Find all <a> elements with href
    for (const element of allElements) {
      if (element.tagName.toLowerCase() === 'a' && element.attributes.href) {
        const href = element.attributes.href;

        // Skip anchors (internal page links starting with #)
        if (href.startsWith('#')) {
          continue;
        }

        const text = this.getTextContent(element);
        const hasAccessibleName = this.hasAccessibleName(element, context);
        const isHidden = this.isElementHidden(element, context);

        // Check if link contains only an image
        const { hasImageOnly, imageAlt } = this.checkImageOnly(element);

        links.push({
          element,
          text,
          href,
          hasAccessibleName,
          isHidden,
          hasImageOnly,
          imageAlt
        });
      }
    }

    return links;
  }

  /**
   * Check if link contains only an image.
   */
  private checkImageOnly(element: DOMElement): { hasImageOnly: boolean; imageAlt?: string } {
    // Check if element has only one child that is an img
    if (element.children.length === 1) {
      const child = element.children[0];
      if (child.nodeType === 'element') {
        const childElement = child as DOMElement;
        if (childElement.tagName.toLowerCase() === 'img') {
          return {
            hasImageOnly: true,
            imageAlt: childElement.attributes.alt
          };
        }
      }
    }

    return { hasImageOnly: false };
  }

  /**
   * Get text content from element, excluding script and style tags.
   */
  private getTextContent(element: DOMElement): string {
    let text = '';

    for (const child of element.children) {
      if (child.nodeType === 'text') {
        text += child.textContent || '';
      } else if (child.nodeType === 'element') {
        const childElement = child as DOMElement;
        const tagName = childElement.tagName.toLowerCase();

        // Skip script and style tags
        if (tagName === 'script' || tagName === 'style') {
          continue;
        }

        // Skip images (we handle those separately)
        if (tagName === 'img') {
          continue;
        }

        text += this.getTextContent(childElement);
      }
    }

    return text.trim();
  }

  /**
   * Check if element has accessible name (aria-label or aria-labelledby).
   */
  private hasAccessibleName(element: DOMElement, context: AnalyzerContext): boolean {
    // Check aria-label
    if (element.attributes['aria-label']) {
      return true;
    }

    // Check aria-labelledby
    if (element.attributes['aria-labelledby'] && context.documentModel) {
      const labelledby = element.attributes['aria-labelledby'];
      const allElements = context.documentModel.getAllElements();
      const referencedElement = allElements.find(el => el.attributes.id === labelledby);
      if (referencedElement) {
        return true;
      }
    }

    return false;
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
   * Check if link text matches generic patterns.
   */
  private isGenericLinkText(text: string): boolean {
    const trimmedText = text.trim();

    for (const pattern of GENERIC_LINK_PATTERNS) {
      if (pattern.test(trimmedText)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if text is a URL.
   */
  private isUrlText(text: string): boolean {
    const trimmedText = text.trim();

    // Check if text starts with http://, https://, www., or looks like a domain
    return (
      trimmedText.startsWith('http://') ||
      trimmedText.startsWith('https://') ||
      trimmedText.startsWith('www.') ||
      /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(trimmedText)
    );
  }

  /**
   * Find links with duplicate text but different destinations.
   */
  private findDuplicateLinkText(links: LinkInfo[]): Array<{ text: string; hrefs: string[]; elements: DOMElement[] }> {
    const duplicates: Array<{ text: string; hrefs: string[]; elements: DOMElement[] }> = [];
    const textMap = new Map<string, Array<{ href: string; element: DOMElement }>>();

    // Group links by text
    for (const link of links) {
      const effectiveText = link.text || link.imageAlt || '';

      if (!effectiveText) {
        continue;
      }

      if (!textMap.has(effectiveText)) {
        textMap.set(effectiveText, []);
      }

      textMap.get(effectiveText)!.push({ href: link.href, element: link.element });
    }

    // Find duplicates with different hrefs
    for (const [text, linkGroup] of textMap.entries()) {
      if (linkGroup.length > 1) {
        const uniqueHrefs = new Set(linkGroup.map(l => l.href));

        // Only report if there are different destinations
        if (uniqueHrefs.size > 1) {
          duplicates.push({
            text,
            hrefs: Array.from(uniqueHrefs),
            elements: linkGroup.map(l => l.element)
          });
        }
      }
    }

    return duplicates;
  }
}
