"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointerTargetAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class PointerTargetAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'PointerTargetAnalyzer';
        this.description = 'Detects interactive elements with insufficient touch target size';
        this.MIN_TARGET_SIZE_AAA = 44;
        this.MIN_TARGET_SIZE_AA = 24;
        this.MIN_SPACING = 8;
        this.INTERACTIVE_ELEMENTS = new Set([
            'a', 'button', 'input', 'select', 'textarea', 'label', 'summary'
        ]);
        this.INTERACTIVE_INPUT_TYPES = new Set([
            'button', 'submit', 'reset', 'checkbox', 'radio', 'file', 'image'
        ]);
        this.INTERACTIVE_ROLES = new Set([
            'button', 'link', 'checkbox', 'radio', 'switch', 'tab', 'menuitem',
            'option', 'gridcell', 'treeitem', 'slider', 'spinbutton'
        ]);
    }
    analyze(context) {
        const issues = [];
        if (!context.documentModel) {
            return issues;
        }
        const allElements = context.documentModel.getAllElements();
        const interactiveElements = this.findInteractiveElements(allElements);
        for (const element of interactiveElements) {
            issues.push(...this.checkTargetSize(element, context));
        }
        issues.push(...this.checkAdjacentTargetSpacing(interactiveElements, context));
        return issues;
    }
    findInteractiveElements(elements) {
        return elements.filter(el => this.isInteractiveElement(el));
    }
    isInteractiveElement(element) {
        if (this.INTERACTIVE_ELEMENTS.has(element.tagName)) {
            if (element.tagName === 'input') {
                const inputType = element.attributes.type?.toLowerCase() || 'text';
                return this.INTERACTIVE_INPUT_TYPES.has(inputType);
            }
            return true;
        }
        const role = element.attributes.role;
        if (role && this.INTERACTIVE_ROLES.has(role)) {
            return true;
        }
        if (element.attributes.onclick || element.attributes.onpointerdown ||
            element.attributes.ontouchstart) {
            return true;
        }
        return false;
    }
    checkTargetSize(element, context) {
        const issues = [];
        if (this.isHidden(element)) {
            return issues;
        }
        const width = this.extractDimension(element, 'width');
        const height = this.extractDimension(element, 'height');
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
                const fix = {
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
                issues.push(this.createIssue('touch-target-too-small', severity, message, element.location, isTooSmallAA ? ['2.5.8'] : ['2.5.5'], context, {
                    elementContext: context.documentModel?.getElementContext(element),
                    fix
                }));
            }
        }
        else {
            if (this.isLikelySmallTarget(element)) {
                const elementType = this.getElementType(element);
                const elementId = this.getElementIdentifier(element);
                const message = `Interactive ${elementType} "${elementId}" should have explicit minimum dimensions to ensure adequate touch target size. Consider setting min-width and min-height to at least 44×44 CSS pixels (Level AAA) or 24×24 pixels (Level AA, WCAG 2.2).`;
                const fix = {
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
                issues.push(this.createIssue('touch-target-too-small', 'info', message, element.location, ['2.5.5', '2.5.8'], context, {
                    elementContext: context.documentModel?.getElementContext(element),
                    fix
                }));
            }
        }
        return issues;
    }
    checkAdjacentTargetSpacing(elements, context) {
        const issues = [];
        for (let i = 0; i < elements.length - 1; i++) {
            const current = elements[i];
            const next = elements[i + 1];
            if (this.areSiblings(current, next)) {
                if (this.isInlineInteractive(current) && this.isInlineInteractive(next)) {
                    const hasSpacing = this.hasAdequateSpacing(current, next);
                    if (!hasSpacing) {
                        const message = `Adjacent interactive elements "${this.getElementIdentifier(current)}" and "${this.getElementIdentifier(next)}" may be too close together. Ensure at least ${this.MIN_SPACING}px spacing between touch targets to prevent accidental mis-taps. This is especially important for users with motor disabilities.`;
                        const fix = {
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
                        issues.push(this.createIssue('adjacent-targets-too-close', 'warning', message, current.location, ['2.5.5'], context, {
                            elementContext: context.documentModel?.getElementContext(current),
                            fix
                        }));
                    }
                }
            }
        }
        return issues;
    }
    extractDimension(element, dimension) {
        const style = element.attributes.style;
        if (style) {
            const match = style.match(new RegExp(`${dimension}\\s*:\\s*(\\d+)px`, 'i'));
            if (match) {
                return parseInt(match[1], 10);
            }
        }
        const attr = element.attributes[dimension];
        if (attr) {
            const num = parseInt(attr, 10);
            if (!isNaN(num)) {
                return num;
            }
        }
        return null;
    }
    isHidden(element) {
        if (element.attributes['aria-hidden'] === 'true')
            return true;
        const style = element.attributes.style;
        if (style) {
            if (/display\s*:\s*none/i.test(style))
                return true;
            if (/visibility\s*:\s*hidden/i.test(style))
                return true;
        }
        return false;
    }
    isLikelySmallTarget(element) {
        if (element.tagName === 'input') {
            const type = element.attributes.type?.toLowerCase();
            return type === 'checkbox' || type === 'radio' || type === 'button';
        }
        if (element.tagName === 'button') {
            const ariaLabel = element.attributes['aria-label'] || '';
            const className = element.attributes.class || '';
            if (ariaLabel && !element.textContent) {
                return true;
            }
            if (/icon|svg|fa-|material-icons/i.test(className)) {
                return true;
            }
        }
        return false;
    }
    getElementType(element) {
        const role = element.attributes.role;
        if (role)
            return role;
        if (element.tagName === 'input') {
            const type = element.attributes.type?.toLowerCase() || 'text';
            return `${type} input`;
        }
        return element.tagName;
    }
    getElementIdentifier(element) {
        return element.attributes.id ||
            element.attributes.name ||
            element.attributes['aria-label'] ||
            element.textContent?.slice(0, 30) ||
            element.tagName;
    }
    areSiblings(_el1, _el2) {
        return true;
    }
    isInlineInteractive(element) {
        if (element.tagName === 'a' || element.tagName === 'button') {
            return true;
        }
        const display = element.attributes.style?.match(/display\s*:\s*(inline|inline-block)/i);
        return !!display;
    }
    hasAdequateSpacing(el1, el2) {
        const el1Style = el1.attributes.style || '';
        const el2Style = el2.attributes.style || '';
        const el1Margin = el1Style.match(/margin(?:-right)?\s*:\s*(\d+)px/i);
        const el2Margin = el2Style.match(/margin(?:-left)?\s*:\s*(\d+)px/i);
        if (el1Margin && parseInt(el1Margin[1], 10) >= this.MIN_SPACING)
            return true;
        if (el2Margin && parseInt(el2Margin[1], 10) >= this.MIN_SPACING)
            return true;
        return false;
    }
}
exports.PointerTargetAnalyzer = PointerTargetAnalyzer;
