/**
 * Angular Reactivity Analyzer
 *
 * Detects accessibility issues in Angular-specific reactive patterns including:
 * - [(ngModel)] bindings without proper ARIA attributes
 * - (click) event handlers without keyboard alternatives
 * - Focus management patterns
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): All functionality available via keyboard
 * - 4.1.2 Name, Role, Value (Level A): ARIA attributes must reflect state
 *
 * This analyzer works with ActionLanguageModel nodes created by AngularActionLanguageExtractor,
 * which parses both TypeScript component code and template directives.
 */

import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
import { ActionLanguageNode } from '../models/ActionLanguageModel';

/**
 * Analyzer for detecting Angular reactivity accessibility issues.
 */
export class AngularReactivityAnalyzer extends BaseAnalyzer {
  readonly name = 'AngularReactivityAnalyzer';
  readonly description = 'Detects accessibility issues in Angular-specific reactive patterns (ngModel, event bindings)';

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.actionLanguageModel) {
      return issues;
    }

    const angularNodes = context.actionLanguageModel.nodes.filter(
      node => node.metadata?.framework === 'angular'
    );

    if (angularNodes.length === 0) {
      return issues;
    }

    issues.push(...this.analyzeNgModel(angularNodes, context));
    issues.push(...this.analyzeEventBindings(angularNodes, context));
    issues.push(...this.analyzeFocusManagement(context.actionLanguageModel.nodes, context));

    return issues;
  }

  private analyzeNgModel(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    for (const node of nodes) {
      if (node.actionType === 'ariaStateChange' &&
          node.metadata?.directive === '[(ngModel)]') {
        if (this.isFileScopeOnly(context)) {
          issues.push(this.createIssue(
            'angular-ngmodel-no-label',
            'warning',
            `Input with [(ngModel)] may lack accessible label. Verify aria-label, aria-labelledby, or associated <label> exists.`,
            node.location,
            ['4.1.2', '1.3.1'],
            context,
            {
              fix: {
                description: 'Add an accessible label to the input element',
                code: `<input [(ngModel)]="name" aria-label="Name" />

<!-- OR with <label> -->
<label for="name-input">Name</label>
<input id="name-input" [(ngModel)]="name" />`,
                location: node.location
              }
            }
          ));
        }
      }
    }

    return issues;
  }

  private analyzeEventBindings(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    const elementMap = new Map<string, ActionLanguageNode[]>();

    for (const node of nodes) {
      if (node.actionType === 'eventHandler' && node.metadata?.directive?.startsWith('(')) {
        const elementKey = node.element.id || node.element.selector || 'unknown';
        if (!elementMap.has(elementKey)) {
          elementMap.set(elementKey, []);
        }
        elementMap.get(elementKey)!.push(node);
      }
    }

    for (const [_elementKey, elementNodes] of elementMap) {
      const hasClick = elementNodes.some(n => n.event === 'click');
      const hasKeyboard = elementNodes.some(n =>
        n.event === 'keydown' || n.event === 'keyup' || n.event === 'keypress'
      );

      if (hasClick && !hasKeyboard) {
        const clickNode = elementNodes.find(n => n.event === 'click')!;
        const tagName = clickNode.metadata?.tagName as string;
        const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];

        if (!interactiveElements.includes(tagName?.toLowerCase() || '')) {
          issues.push(this.createIssue(
            'angular-click-no-keyboard',
            'error',
            `Non-interactive element <${tagName}> with (click) lacks keyboard handler. Add (keydown) and role/tabindex.`,
            clickNode.location,
            ['2.1.1', '2.1.2'],
            context,
            {
              fix: {
                description: 'Add keyboard handler and proper ARIA role',
                code: `<div role="button" tabindex="0" (click)="handleClick()" (keydown)="handleKeydown($event)">Click me</div>`,
                location: clickNode.location
              }
            }
          ));
        }
      }
    }

    return issues;
  }

  private analyzeFocusManagement(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    const focusActions = nodes.filter(
      node => node.actionType === 'focusChange' &&
              node.metadata?.framework === 'angular' &&
              node.metadata?.sourceSection === 'component'
    );

    for (const focusAction of focusActions) {
      if (!focusAction.metadata?.hasCleanup) {
        issues.push(this.createIssue(
          'angular-focus-no-cleanup',
          'info',
          'Focus management detected. Ensure focus is restored on component destroy using ngOnDestroy().',
          focusAction.location,
          ['2.4.3', '2.1.2'],
          context,
          {
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
          }
        ));
      }
    }

    return issues;
  }
}
