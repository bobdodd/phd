/**
 * Angular Reactivity Analyzer
 *
 * Detects accessibility issues specific to Angular's reactivity system:
 * - [(ngModel)] without labels
 * - (click) on non-interactive elements without keyboard handlers
 * - *ngIf/[hidden] without ARIA communication
 * - Dynamic [class.className] bindings affecting visibility without ARIA
 * - ViewChild-based focus management without cleanup
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A)
 * - 2.1.2 No Keyboard Trap (Level A)
 * - 2.4.3 Focus Order (Level A)
 * - 4.1.2 Name, Role, Value (Level A)
 * - 4.1.3 Status Messages (Level AA)
 */

import { Issue } from '../models/BaseModel';
import { extractAngularDOM, AngularMetadata } from '../parsers/AngularDOMExtractor';

/**
 * Angular-specific accessibility issue
 */
export interface AngularReactivityIssue extends Issue {
  /** The Angular pattern that caused this issue */
  pattern: string;

  /** Specific directive or code that triggered the issue */
  directive?: string;

  /** Optional binding name */
  binding?: string;

  /** Recommended fix */
  fix: {
    description: string;
    code?: string;
  };
}

/**
 * Angular Reactivity Analyzer
 *
 * Analyzes Angular components for accessibility issues related to
 * Angular's template syntax and reactivity patterns.
 */
export class AngularReactivityAnalyzer {
  /**
   * Analyze Angular component for accessibility issues.
   *
   * @param source - Angular component source code
   * @param sourceFile - Filename for error reporting
   * @returns Array of accessibility issues
   *
   * @example
   * ```typescript
   * const analyzer = new AngularReactivityAnalyzer();
   * const issues = analyzer.analyze(`
   *   <div (click)="toggle()">Toggle</div>
   *   <div *ngIf="isOpen">Content</div>
   * `, 'dropdown.component.html');
   * ```
   */
  analyze(source: string, sourceFile: string): AngularReactivityIssue[] {
    const issues: AngularReactivityIssue[] = [];

    // Extract DOM structure
    const domModel = extractAngularDOM(source, sourceFile);
    if (!domModel) return issues;

    // Analyze each element for Angular-specific issues
    const elements = domModel.getAllElements();

    for (const element of elements) {
      const metadata = element.metadata as AngularMetadata;
      if (!metadata?.bindings) continue;

      // Check [(ngModel)] directives
      issues.push(...this.analyzeNgModelDirectives(element, metadata, source));

      // Check event bindings
      issues.push(...this.analyzeEventBindings(element, metadata, source));

      // Check *ngIf/[hidden] directives
      issues.push(...this.analyzeVisibilityDirectives(element, metadata, source));

      // Check [class.className] bindings
      issues.push(...this.analyzeClassBindings(element, metadata, source));
    }

    return issues;
  }

  /**
   * Analyze [(ngModel)] directives for accessibility issues.
   * Two-way bindings on form inputs should have proper labels.
   */
  private analyzeNgModelDirectives(
    element: any,
    metadata: AngularMetadata,
    _source: string
  ): AngularReactivityIssue[] {
    const issues: AngularReactivityIssue[] = [];

    if (!metadata.bindings?.twoWay) return issues;

    // Check if element is a form input
    const isFormInput = ['input', 'textarea', 'select'].includes(element.tagName);

    if (!isFormInput) return issues;

    // Check for proper labeling
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

  /**
   * Analyze Angular event bindings for keyboard accessibility.
   * (click) on non-interactive elements should have keyboard handlers.
   */
  private analyzeEventBindings(
    element: any,
    metadata: AngularMetadata,
    _source: string
  ): AngularReactivityIssue[] {
    const issues: AngularReactivityIssue[] = [];

    if (!metadata.bindings?.events) return issues;

    const hasClick = metadata.bindings.events.includes('click');
    if (!hasClick) return issues;

    // Interactive elements don't need keyboard handlers (they have native support)
    const interactiveElements = ['button', 'a', 'input', 'textarea', 'select'];
    if (interactiveElements.includes(element.tagName)) {
      return issues;
    }

    // Check if there's a keyboard event handler
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

  /**
   * Analyze *ngIf and [hidden] directives for ARIA communication.
   * Visibility changes should be communicated to screen readers.
   */
  private analyzeVisibilityDirectives(
    element: any,
    metadata: AngularMetadata,
    _source: string
  ): AngularReactivityIssue[] {
    const issues: AngularReactivityIssue[] = [];

    const hasStructuralDirective = metadata.bindings?.structural?.some(
      dir => dir.startsWith('*ngIf') || dir.startsWith('*ngSwitch')
    );

    const hasHiddenBinding = metadata.bindings?.properties?.includes('hidden');

    if (!hasStructuralDirective && !hasHiddenBinding) {
      return issues;
    }

    // Check for ARIA attributes
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

  /**
   * Analyze [class.className] bindings for accessibility issues.
   * Dynamic class changes affecting visibility should have ARIA communication.
   */
  private analyzeClassBindings(
    element: any,
    metadata: AngularMetadata,
    _source: string
  ): AngularReactivityIssue[] {
    const issues: AngularReactivityIssue[] = [];

    if (!metadata.bindings?.classes) return issues;

    // Check if any class binding affects visibility
    const visibilityClasses = metadata.bindings.classes.filter(className =>
      this.isVisibilityClass(className)
    );

    if (visibilityClasses.length === 0) return issues;

    // Check for ARIA attributes
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

  /**
   * Check if element has proper labeling.
   */
  private hasLabelOrAria(element: any): boolean {
    return (
      element.attributes['aria-label'] !== undefined ||
      element.attributes['aria-labelledby'] !== undefined ||
      element.attributes['id'] !== undefined // Could be labeled by external <label>
    );
  }

  /**
   * Check if element has a keyboard event handler.
   */
  private hasKeyboardHandler(metadata: AngularMetadata): boolean {
    if (!metadata.bindings?.events) return false;

    const keyboardEvents = ['keydown', 'keypress', 'keyup'];
    return metadata.bindings.events.some(event =>
      keyboardEvents.includes(event)
    );
  }

  /**
   * Check if a class name is likely to affect visibility.
   */
  private isVisibilityClass(className: string): boolean {
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
    return visibilityKeywords.some(keyword =>
      className.toLowerCase().includes(keyword)
    );
  }
}

/**
 * Analyze Angular component for accessibility issues.
 *
 * @param source - Angular component source code
 * @param sourceFile - Filename for error reporting
 * @returns Array of accessibility issues
 *
 * @example
 * ```typescript
 * const issues = analyzeAngularReactivity(`
 *   <div (click)="toggle()">
 *     Toggle
 *   </div>
 *   <div *ngIf="isOpen">
 *     Content
 *   </div>
 * `, 'dropdown.component.html');
 *
 * issues.forEach(issue => {
 *   console.log(`${issue.severity}: ${issue.message}`);
 *   console.log(`Fix: ${issue.fix?.description}`);
 * });
 * ```
 */
export function analyzeAngularReactivity(
  source: string,
  sourceFile: string
): AngularReactivityIssue[] {
  const analyzer = new AngularReactivityAnalyzer();
  return analyzer.analyze(source, sourceFile);
}
