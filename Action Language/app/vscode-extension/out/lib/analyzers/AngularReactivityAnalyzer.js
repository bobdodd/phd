"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularReactivityAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class AngularReactivityAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'AngularReactivityAnalyzer';
        this.description = 'Detects accessibility issues in Angular-specific reactive patterns (ngModel, event bindings)';
    }
    analyze(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        const angularNodes = context.actionLanguageModel.nodes.filter(node => node.metadata?.framework === 'angular');
        if (angularNodes.length === 0) {
            return issues;
        }
        issues.push(...this.analyzeNgModel(angularNodes, context));
        issues.push(...this.analyzeEventBindings(angularNodes, context));
        issues.push(...this.analyzeFocusManagement(context.actionLanguageModel.nodes, context));
        return issues;
    }
    analyzeNgModel(nodes, context) {
        const issues = [];
        for (const node of nodes) {
            if (node.actionType === 'ariaStateChange' &&
                node.metadata?.directive === '[(ngModel)]') {
                if (this.isFileScopeOnly(context)) {
                    issues.push(this.createIssue('angular-ngmodel-no-label', 'warning', `Input with [(ngModel)] may lack accessible label. Verify aria-label, aria-labelledby, or associated <label> exists.`, node.location, ['4.1.2', '1.3.1'], context, {
                        fix: {
                            description: 'Add an accessible label to the input element',
                            code: `<input [(ngModel)]="name" aria-label="Name" />

<!-- OR with <label> -->
<label for="name-input">Name</label>
<input id="name-input" [(ngModel)]="name" />`,
                            location: node.location
                        }
                    }));
                }
            }
        }
        return issues;
    }
    analyzeEventBindings(nodes, context) {
        const issues = [];
        const elementMap = new Map();
        for (const node of nodes) {
            if (node.actionType === 'eventHandler' && node.metadata?.directive?.startsWith('(')) {
                const elementKey = node.element.id || node.element.selector || 'unknown';
                if (!elementMap.has(elementKey)) {
                    elementMap.set(elementKey, []);
                }
                elementMap.get(elementKey).push(node);
            }
        }
        for (const [_elementKey, elementNodes] of elementMap) {
            const hasClick = elementNodes.some(n => n.event === 'click');
            const hasKeyboard = elementNodes.some(n => n.event === 'keydown' || n.event === 'keyup' || n.event === 'keypress');
            if (hasClick && !hasKeyboard) {
                const clickNode = elementNodes.find(n => n.event === 'click');
                const tagName = clickNode.metadata?.tagName;
                const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
                if (!interactiveElements.includes(tagName?.toLowerCase() || '')) {
                    issues.push(this.createIssue('angular-click-no-keyboard', 'error', `Non-interactive element <${tagName}> with (click) lacks keyboard handler. Add (keydown) and role/tabindex.`, clickNode.location, ['2.1.1', '2.1.2'], context, {
                        fix: {
                            description: 'Add keyboard handler and proper ARIA role',
                            code: `<div role="button" tabindex="0" (click)="handleClick()" (keydown)="handleKeydown($event)">Click me</div>`,
                            location: clickNode.location
                        }
                    }));
                }
            }
        }
        return issues;
    }
    analyzeFocusManagement(nodes, context) {
        const issues = [];
        const focusActions = nodes.filter(node => node.actionType === 'focusChange' &&
            node.metadata?.framework === 'angular' &&
            node.metadata?.sourceSection === 'component');
        for (const focusAction of focusActions) {
            if (!focusAction.metadata?.hasCleanup) {
                issues.push(this.createIssue('angular-focus-no-cleanup', 'info', 'Focus management detected. Ensure focus is restored on component destroy using ngOnDestroy().', focusAction.location, ['2.4.3', '2.1.2'], context, {
                    fix: {
                        description: 'Add cleanup using ngOnDestroy to restore focus',
                        code: `private previousFocus: HTMLElement;

ngAfterViewInit() {
  this.previousFocus = document.activeElement as HTMLElement;
  this.element.nativeElement.focus();
}

ngOnDestroy() {
  this.previousFocus?.focus();
}`,
                        location: focusAction.location
                    }
                }));
            }
        }
        return issues;
    }
}
exports.AngularReactivityAnalyzer = AngularReactivityAnalyzer;
