"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularReactivityAnalyzer = void 0;
exports.analyzeAngularReactivity = analyzeAngularReactivity;
const AngularDOMExtractor_1 = require("../parsers/AngularDOMExtractor");
class AngularReactivityAnalyzer {
    analyze(source, sourceFile) {
        const issues = [];
        const domModel = (0, AngularDOMExtractor_1.extractAngularDOM)(source, sourceFile);
        if (!domModel)
            return issues;
        const elements = domModel.getAllElements();
        for (const element of elements) {
            const metadata = element.metadata;
            if (!metadata?.bindings)
                continue;
            issues.push(...this.analyzeNgModelDirectives(element, metadata, source));
            issues.push(...this.analyzeEventBindings(element, metadata, source));
            issues.push(...this.analyzeVisibilityDirectives(element, metadata, source));
            issues.push(...this.analyzeClassBindings(element, metadata, source));
        }
        return issues;
    }
    analyzeNgModelDirectives(element, metadata, _source) {
        const issues = [];
        if (!metadata.bindings?.twoWay)
            return issues;
        const isFormInput = ['input', 'textarea', 'select'].includes(element.tagName);
        if (!isFormInput)
            return issues;
        const hasLabel = this.hasLabelOrAria(element);
        if (!hasLabel) {
            issues.push({
                type: 'angular-ngmodel-no-label',
                severity: 'error',
                message: 'Input with [(ngModel)] lacks accessible label. Add aria-label, aria-labelledby, or associate with <label>.',
                confidence: {
                    level: 'HIGH',
                    reason: 'Angular [(ngModel)] directive detected without ARIA labeling',
                    treeCompleteness: 1.0,
                },
                locations: [element.location],
                wcagCriteria: ['4.1.2', '1.3.1'],
                pattern: '[(ngModel)]',
                directive: '[(ngModel)]',
                fix: {
                    description: 'Add an accessible label to the input element',
                    code: `<input [(ngModel)]="name" aria-label="Name" />

<!-- OR with <label> -->
<label for="name-input">Name</label>
<input id="name-input" [(ngModel)]="name" />`
                }
            });
        }
        return issues;
    }
    analyzeEventBindings(element, metadata, _source) {
        const issues = [];
        if (!metadata.bindings?.events)
            return issues;
        const hasClick = metadata.bindings.events.includes('click');
        if (!hasClick)
            return issues;
        const interactiveElements = ['button', 'a', 'input', 'textarea', 'select'];
        if (interactiveElements.includes(element.tagName)) {
            return issues;
        }
        const hasKeyboardHandler = this.hasKeyboardHandler(metadata);
        if (!hasKeyboardHandler) {
            issues.push({
                type: 'angular-click-no-keyboard',
                severity: 'error',
                message: `Non-interactive element <${element.tagName}> with (click) lacks keyboard handler. Add (keydown) or (keypress) for keyboard accessibility.`,
                confidence: {
                    level: 'HIGH',
                    reason: 'Angular (click) binding without keyboard alternative on non-interactive element',
                    treeCompleteness: 1.0,
                },
                locations: [element.location],
                wcagCriteria: ['2.1.1', '2.1.2'],
                pattern: '(click)',
                directive: '(click)',
                fix: {
                    description: 'Add keyboard event handler and make element focusable',
                    code: `<${element.tagName}
  (click)="handleClick()"
  (keydown)="handleKeyDown($event)"
  tabindex="0"
  role="button"
>
  <!-- content -->
</${element.tagName}>`
                }
            });
        }
        return issues;
    }
    analyzeVisibilityDirectives(element, metadata, _source) {
        const issues = [];
        const hasStructuralDirective = metadata.bindings?.structural?.some(dir => dir.startsWith('*ngIf') || dir.startsWith('*ngSwitch'));
        const hasHiddenBinding = metadata.bindings?.properties?.includes('hidden');
        if (!hasStructuralDirective && !hasHiddenBinding) {
            return issues;
        }
        const hasAriaLive = element.attributes['aria-live'] !== undefined;
        const hasAriaRelevant = element.attributes['aria-relevant'] !== undefined;
        const hasRole = element.attributes['role'] !== undefined;
        if (!hasAriaLive && !hasAriaRelevant && !hasRole) {
            const directive = hasStructuralDirective ? '*ngIf' : '[hidden]';
            issues.push({
                type: 'angular-visibility-no-aria',
                severity: 'warning',
                message: `Element with ${directive} lacks ARIA communication. Add aria-live or role to announce visibility changes to screen readers.`,
                confidence: {
                    level: 'MEDIUM',
                    reason: `Angular ${directive} directive detected without ARIA attributes`,
                    treeCompleteness: 0.8,
                },
                locations: [element.location],
                wcagCriteria: ['4.1.2', '4.1.3'],
                pattern: directive,
                directive: directive,
                fix: {
                    description: 'Add ARIA attributes to communicate visibility changes',
                    code: hasStructuralDirective
                        ? `<div *ngIf="isVisible" aria-live="polite" role="status">
  <!-- content -->
</div>`
                        : `<div [hidden]="!isVisible" aria-live="polite" [attr.aria-hidden]="!isVisible">
  <!-- content -->
</div>`
                }
            });
        }
        return issues;
    }
    analyzeClassBindings(element, metadata, _source) {
        const issues = [];
        if (!metadata.bindings?.classes)
            return issues;
        const visibilityClasses = metadata.bindings.classes.filter(className => this.isVisibilityClass(className));
        if (visibilityClasses.length === 0)
            return issues;
        const hasAriaHidden = element.attributes['aria-hidden'] !== undefined;
        const hasAriaLive = element.attributes['aria-live'] !== undefined;
        if (!hasAriaHidden && !hasAriaLive) {
            issues.push({
                type: 'angular-class-binding-no-aria',
                severity: 'warning',
                message: `Dynamic class binding [class.${visibilityClasses[0]}] affects visibility without ARIA communication. Add aria-hidden or aria-live.`,
                confidence: {
                    level: 'MEDIUM',
                    reason: 'Angular class binding affecting visibility without ARIA attributes',
                    treeCompleteness: 0.7,
                },
                locations: [element.location],
                wcagCriteria: ['4.1.2', '4.1.3'],
                pattern: '[class.className]',
                binding: `[class.${visibilityClasses[0]}]`,
                fix: {
                    description: 'Add ARIA attributes to communicate visibility state',
                    code: `<div
  [class.${visibilityClasses[0]}]="condition"
  [attr.aria-hidden]="condition ? 'true' : 'false'"
>
  <!-- content -->
</div>`
                }
            });
        }
        return issues;
    }
    hasLabelOrAria(element) {
        return (element.attributes['aria-label'] !== undefined ||
            element.attributes['aria-labelledby'] !== undefined ||
            element.attributes['id'] !== undefined);
    }
    hasKeyboardHandler(metadata) {
        if (!metadata.bindings?.events)
            return false;
        const keyboardEvents = ['keydown', 'keypress', 'keyup'];
        return metadata.bindings.events.some(event => keyboardEvents.includes(event));
    }
    isVisibilityClass(className) {
        const visibilityKeywords = [
            'hidden',
            'visible',
            'show',
            'hide',
            'open',
            'closed',
            'collapsed',
            'expanded',
        ];
        return visibilityKeywords.some(keyword => className.toLowerCase().includes(keyword));
    }
}
exports.AngularReactivityAnalyzer = AngularReactivityAnalyzer;
function analyzeAngularReactivity(source, sourceFile) {
    const analyzer = new AngularReactivityAnalyzer();
    return analyzer.analyze(source, sourceFile);
}
//# sourceMappingURL=AngularReactivityAnalyzer.js.map