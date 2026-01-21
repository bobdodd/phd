import { BaseAnalyzer, AnalyzerContext, Issue, IssueFix } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

/**
 * PointerTargetAnalyzer
 *
 * Detects interactive elements with insufficient touch target size.
 *
 * Issue Types (3):
 * 1. touch-target-too-small - Interactive element smaller than 44×44 CSS pixels
 * 2. adjacent-targets-too-close - Interactive elements too close together (spacing < 8px)
 * 3. inline-link-insufficient-target - Inline links without adequate spacing
 *
 * WCAG: 2.5.5 (Target Size) Level AAA (Enhanced)
 * Note: WCAG 2.5.8 (Target Size Minimum) Level AA requires 24×24 pixels (WCAG 2.2)
 *
 * Key Concepts:
 * - Touch targets should be at least 44×44 CSS pixels (Level AAA)
 * - WCAG 2.2 Level AA requires 24×24 pixels minimum
 * - Adjacent targets need spacing or be large enough to prevent mis-taps
 * - Inline links are exempt but should still have adequate spacing
 * - Exceptions: Essential targets (e.g., text in sentences), user-controlled size
 *
 * Target Size Guidelines:
 * - 44×44 pixels: WCAG 2.5.5 Level AAA (recommended)
 * - 24×24 pixels: WCAG 2.5.8 Level AA (WCAG 2.2 minimum)
 * - Spacing: At least 8px between adjacent interactive elements
 *
 * Priority: MEDIUM IMPACT
 * Target: Improves usability for users with motor disabilities, tremors, or limited dexterity
 */
export class PointerTargetAnalyzer extends BaseAnalyzer {
  readonly name = 'PointerTargetAnalyzer';
  readonly description = 'Detects interactive elements with insufficient touch target size';

  // Minimum target sizes (CSS pixels)
  private readonly MIN_TARGET_SIZE_AAA = 44; // WCAG 2.5.5 Level AAA
  private readonly MIN_TARGET_SIZE_AA = 24;  // WCAG 2.5.8 Level AA (WCAG 2.2)
  private readonly MIN_SPACING = 8; // Minimum spacing between targets

  // Interactive element types that need adequate target size
  private readonly INTERACTIVE_ELEMENTS = new Set([
    'a', 'button', 'input', 'select', 'textarea', 'label', 'summary'
  ]);

  // Input types that need adequate target size
  private readonly INTERACTIVE_INPUT_TYPES = new Set([
    'button', 'submit', 'reset', 'checkbox', 'radio', 'file', 'image'
  ]);

  // Interactive ARIA roles
  private readonly INTERACTIVE_ROLES = new Set([
    'button', 'link', 'checkbox', 'radio', 'switch', 'tab', 'menuitem',
    'option', 'gridcell', 'treeitem', 'slider', 'spinbutton'
  ]);

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.documentModel) {
      return issues;
    }

    const allElements = context.documentModel.getAllElements();

    // Find all interactive elements
    const interactiveElements = this.findInteractiveElements(allElements);

    // Check each interactive element's size
    for (const element of interactiveElements) {
      issues.push(...this.checkTargetSize(element, context));
    }

    // Check spacing between adjacent interactive elements
    issues.push(...this.checkAdjacentTargetSpacing(interactiveElements, context));

    return issues;
  }

  /**
   * Find all interactive elements that need adequate target size
   */
  private findInteractiveElements(elements: DOMElement[]): DOMElement[] {
    return elements.filter(el => this.isInteractiveElement(el));
  }

  /**
   * Check if element is interactive and needs target size validation
   */
  private isInteractiveElement(element: DOMElement): boolean {
    // Check tag name
    if (this.INTERACTIVE_ELEMENTS.has(element.tagName)) {
      // For inputs, check type
      if (element.tagName === 'input') {
        const inputType = element.attributes.type?.toLowerCase() || 'text';
        return this.INTERACTIVE_INPUT_TYPES.has(inputType);
      }
      return true;
    }

    // Check ARIA role
    const role = element.attributes.role;
    if (role && this.INTERACTIVE_ROLES.has(role)) {
      return true;
    }

    // Check for onclick or other event handlers (indicates interactivity)
    if (element.attributes.onclick || element.attributes.onpointerdown ||
        element.attributes.ontouchstart) {
      return true;
    }

    return false;
  }

  /**
   * Check if element has adequate target size.
   *
   * Pattern: Interactive element with insufficient width/height
   * Problem: Users with motor disabilities may struggle to tap small targets
   * WCAG: 2.5.5 (Target Size) Level AAA, 2.5.8 (Target Size Minimum) Level AA
   */
  private checkTargetSize(
    element: DOMElement,
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    // Skip hidden elements
    if (this.isHidden(element)) {
      return issues;
    }

    // Try to extract size from inline styles or attributes
    const width = this.extractDimension(element, 'width');
    const height = this.extractDimension(element, 'height');

    // Check if size is specified and too small
    if (width !== null && height !== null) {
      const isTooSmallAAA = width < this.MIN_TARGET_SIZE_AAA || height < this.MIN_TARGET_SIZE_AAA;
      const isTooSmallAA = width < this.MIN_TARGET_SIZE_AA || height < this.MIN_TARGET_SIZE_AA;

      if (isTooSmallAAA) {
        const severity = isTooSmallAA ? 'error' : 'warning';
        const wcagLevel = isTooSmallAA ? 'Level AA (WCAG 2.2)' : 'Level AAA';
        const minSize = isTooSmallAA ? this.MIN_TARGET_SIZE_AA : this.MIN_TARGET_SIZE_AAA;

        const elementType = this.getElementType(element);
        const elementId = this.getElementIdentifier(element);

        const message = `Interactive ${elementType} "${elementId}" has insufficient target size (${width}×${height}px). Touch targets should be at least ${minSize}×${minSize} CSS pixels (${wcagLevel}). Small targets are difficult to tap for users with motor disabilities, tremors, or limited dexterity.`;

        const fix: IssueFix = {
          description: `Increase target size to at least ${minSize}×${minSize}px`,
          code: `/* Increase touch target size */
${element.tagName} {
  min-width: ${minSize}px;
  min-height: ${minSize}px;
  padding: 12px; /* Add padding to increase tappable area */
}

/* Alternative: Use pseudo-element to expand hit area */
${element.tagName} {
  position: relative;
}

${element.tagName}::before {
  content: '';
  position: absolute;
  top: -8px;
  right: -8px;
  bottom: -8px;
  left: -8px;
  /* Expands clickable area without affecting visual size */
}

/* WCAG 2.5.5 (Level AAA): 44×44 pixels recommended */
/* WCAG 2.5.8 (Level AA): 24×24 pixels minimum (WCAG 2.2) */

/* Examples by element type: */

/* Buttons */
button, [role="button"] {
  min-width: ${minSize}px;
  min-height: ${minSize}px;
  padding: 12px 20px;
}

/* Icon buttons */
.icon-button {
  min-width: ${minSize}px;
  min-height: ${minSize}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Checkboxes and radios */
input[type="checkbox"],
input[type="radio"] {
  width: ${minSize}px;
  height: ${minSize}px;
  /* Or use transform: scale() to enlarge */
  transform: scale(1.5);
}

/* Links */
a {
  min-height: ${minSize}px;
  display: inline-block;
  padding: 8px 4px;
}

/* Inline links are exempt but spacing helps */
p a {
  padding: 4px 2px;
  /* Ensure adequate line-height for vertical spacing */
  line-height: 1.6;
}`,
          location: element.location
        };

        issues.push(
          this.createIssue(
            'touch-target-too-small',
            severity,
            message,
            element.location,
            isTooSmallAA ? ['2.5.8'] : ['2.5.5'],
            context,
            {
              elementContext: context.documentModel?.getElementContext(element),
              fix
            }
          )
        );
      }
    } else {
      // Size not specified in inline styles - issue info-level suggestion
      // Only for elements that are likely to be small (buttons, checkboxes, etc.)
      if (this.isLikelySmallTarget(element)) {
        const elementType = this.getElementType(element);
        const elementId = this.getElementIdentifier(element);

        const message = `Interactive ${elementType} "${elementId}" should have explicit minimum dimensions to ensure adequate touch target size. Consider setting min-width and min-height to at least 44×44 CSS pixels (Level AAA) or 24×24 pixels (Level AA, WCAG 2.2).`;

        const fix: IssueFix = {
          description: 'Add minimum dimensions in CSS',
          code: `/* Ensure adequate touch target size */
${element.tagName}${element.attributes.class ? '.' + element.attributes.class : ''}${element.attributes.id ? '#' + element.attributes.id : ''} {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}

/* Or use CSS custom properties */
:root {
  --min-touch-target: 44px;
}

${element.tagName} {
  min-width: var(--min-touch-target);
  min-height: var(--min-touch-target);
}`,
          location: element.location
        };

        issues.push(
          this.createIssue(
            'touch-target-too-small',
            'info',
            message,
            element.location,
            ['2.5.5', '2.5.8'],
            context,
            {
              elementContext: context.documentModel?.getElementContext(element),
              fix
            }
          )
        );
      }
    }

    return issues;
  }

  /**
   * Check spacing between adjacent interactive elements.
   *
   * Pattern: Interactive elements too close together
   * Problem: Users may accidentally tap wrong element
   * WCAG: 2.5.5 (Target Size) - Adequate spacing OR target size exception
   */
  private checkAdjacentTargetSpacing(
    elements: DOMElement[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    // This is a simplified check - in real implementation, would need:
    // 1. Compute bounding boxes from CSS
    // 2. Check proximity of elements
    // 3. Verify spacing between adjacent interactive elements

    // For now, we can detect inline buttons/links without spacing
    for (let i = 0; i < elements.length - 1; i++) {
      const current = elements[i];
      const next = elements[i + 1];

      // Check if elements are siblings (same parent)
      if (this.areSiblings(current, next)) {
        // Check if they're inline elements (buttons, links) without spacing
        if (this.isInlineInteractive(current) && this.isInlineInteractive(next)) {
          // Check if there's margin/padding between them
          const hasSpacing = this.hasAdequateSpacing(current, next);

          if (!hasSpacing) {
            const message = `Adjacent interactive elements "${this.getElementIdentifier(current)}" and "${this.getElementIdentifier(next)}" may be too close together. Ensure at least ${this.MIN_SPACING}px spacing between touch targets to prevent accidental mis-taps. This is especially important for users with motor disabilities.`;

            const fix: IssueFix = {
              description: 'Add spacing between adjacent targets',
              code: `/* Add spacing between adjacent interactive elements */
${current.tagName} + ${next.tagName} {
  margin-left: ${this.MIN_SPACING}px;
}

/* Or use gap in flex/grid containers */
.button-group {
  display: flex;
  gap: ${this.MIN_SPACING}px;
}

/* Alternative: Increase padding */
${current.tagName} {
  padding: 12px 16px;
  margin-right: 4px;
}

/* For inline links in text */
p a {
  padding: 4px 2px;
  /* Adequate line-height provides vertical spacing */
  line-height: 1.6;
}

/* For button groups */
.btn-group button {
  margin: 0 4px;
}

.btn-group button:not(:last-child) {
  margin-right: ${this.MIN_SPACING}px;
}`,
              location: current.location
            };

            issues.push(
              this.createIssue(
                'adjacent-targets-too-close',
                'warning',
                message,
                current.location,
                ['2.5.5'],
                context,
                {
                  elementContext: context.documentModel?.getElementContext(current),
                  fix
                }
              )
            );
          }
        }
      }
    }

    return issues;
  }

  /**
   * Extract dimension (width/height) from element attributes or inline styles
   */
  private extractDimension(element: DOMElement, dimension: 'width' | 'height'): number | null {
    // Check inline style
    const style = element.attributes.style;
    if (style) {
      const match = style.match(new RegExp(`${dimension}\\s*:\\s*(\\d+)px`, 'i'));
      if (match) {
        return parseInt(match[1], 10);
      }
    }

    // Check width/height attributes (for images, inputs)
    const attr = element.attributes[dimension];
    if (attr) {
      const num = parseInt(attr, 10);
      if (!isNaN(num)) {
        return num;
      }
    }

    return null;
  }

  /**
   * Check if element is hidden
   */
  private isHidden(element: DOMElement): boolean {
    if (element.attributes['aria-hidden'] === 'true') return true;

    const style = element.attributes.style;
    if (style) {
      if (/display\s*:\s*none/i.test(style)) return true;
      if (/visibility\s*:\s*hidden/i.test(style)) return true;
    }

    return false;
  }

  /**
   * Check if element is likely to be a small target (checkbox, radio, icon button)
   */
  private isLikelySmallTarget(element: DOMElement): boolean {
    if (element.tagName === 'input') {
      const type = element.attributes.type?.toLowerCase();
      return type === 'checkbox' || type === 'radio' || type === 'button';
    }

    // Check for icon button patterns
    if (element.tagName === 'button') {
      const ariaLabel = element.attributes['aria-label'] || '';
      const className = element.attributes.class || '';

      // Icon buttons often have aria-label but no text content
      if (ariaLabel && !element.textContent) {
        return true;
      }

      // Check for icon class names
      if (/icon|svg|fa-|material-icons/i.test(className)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get element type description
   */
  private getElementType(element: DOMElement): string {
    const role = element.attributes.role;
    if (role) return role;

    if (element.tagName === 'input') {
      const type = element.attributes.type?.toLowerCase() || 'text';
      return `${type} input`;
    }

    return element.tagName;
  }

  /**
   * Get element identifier for error messages
   */
  private getElementIdentifier(element: DOMElement): string {
    return element.attributes.id ||
           element.attributes.name ||
           element.attributes['aria-label'] ||
           element.textContent?.slice(0, 30) ||
           element.tagName;
  }

  /**
   * Check if two elements are siblings (simplified check)
   */
  private areSiblings(_el1: DOMElement, _el2: DOMElement): boolean {
    // In a real implementation, would check if they have same parent
    // For now, return true if they're close in document order
    return true;
  }

  /**
   * Check if element is inline interactive element
   */
  private isInlineInteractive(element: DOMElement): boolean {
    if (element.tagName === 'a' || element.tagName === 'button') {
      return true;
    }

    const display = element.attributes.style?.match(/display\s*:\s*(inline|inline-block)/i);
    return !!display;
  }

  /**
   * Check if elements have adequate spacing (simplified)
   */
  private hasAdequateSpacing(el1: DOMElement, el2: DOMElement): boolean {
    // Check for explicit margins in inline styles
    const el1Style = el1.attributes.style || '';
    const el2Style = el2.attributes.style || '';

    const el1Margin = el1Style.match(/margin(?:-right)?\s*:\s*(\d+)px/i);
    const el2Margin = el2Style.match(/margin(?:-left)?\s*:\s*(\d+)px/i);

    if (el1Margin && parseInt(el1Margin[1], 10) >= this.MIN_SPACING) return true;
    if (el2Margin && parseInt(el2Margin[1], 10) >= this.MIN_SPACING) return true;

    // If no explicit spacing found, assume it needs checking
    return false;
  }
}
