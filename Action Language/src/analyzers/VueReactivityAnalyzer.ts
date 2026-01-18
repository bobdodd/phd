/**
 * Vue Reactivity Analyzer
 *
 * Detects accessibility issues in Vue-specific reactive patterns including:
 * - v-model directives without proper ARIA attributes
 * - @click or v-on:click event handlers without keyboard alternatives
 * - v-show/v-if directives affecting visibility without ARIA
 * - Dynamic class bindings (:class) without ARIA communication
 * - Ref-based focus management without cleanup
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): All functionality available via keyboard
 * - 2.1.2 No Keyboard Trap (Level A): Keyboard focus can be moved away
 * - 2.4.3 Focus Order (Level A): Focus order matches visual order
 * - 4.1.2 Name, Role, Value (Level A): ARIA attributes must reflect state
 * - 4.1.3 Status Messages (Level AA): Dynamic content needs announcements
 *
 * Why this matters:
 * - Vue's v-model creates two-way data binding that may bypass ARIA updates
 * - v-show/v-if can hide/show content without proper ARIA communication
 * - Dynamic class bindings can affect visibility without screen reader awareness
 * - Ref-based focus management can create focus traps
 */

import { Issue } from '../models/BaseModel';
import { extractVueDOM, VueMetadata } from '../parsers/VueDOMExtractor';

export interface VueReactivityIssue extends Issue {
  /** The Vue pattern that caused this issue */
  pattern: 'v-model' | 'v-on' | 'v-show' | 'v-if' | 'v-bind:class' | 'ref';

  /** Specific directive or code that triggered the issue */
  directive?: string;

  /** Recommended fix */
  fix: {
    description: string;
    code?: string;
  };
}

/**
 * Analyzer for detecting Vue reactivity accessibility issues.
 */
export class VueReactivityAnalyzer {
  /**
   * Analyze Vue component for reactivity accessibility issues.
   *
   * @param source - Vue component source code
   * @param sourceFile - Filename for error reporting
   * @returns Array of detected issues
   *
   * @example
   * ```typescript
   * const analyzer = new VueReactivityAnalyzer();
   * const issues = analyzer.analyze(`
   *   <template>
   *     <div @click="toggle">Toggle</div>
   *     <div v-show="isOpen">Content</div>
   *   </template>
   * `, 'Dropdown.vue');
   * ```
   */
  analyze(source: string, sourceFile: string): VueReactivityIssue[] {
    const issues: VueReactivityIssue[] = [];

    // Extract DOM structure
    const domModel = extractVueDOM(source, sourceFile);
    if (!domModel) return issues;

    // Analyze each element for Vue-specific issues
    const elements = domModel.getAllElements();

    for (const element of elements) {
      const metadata = element.metadata as VueMetadata;
      if (!metadata?.directives) continue;

      // Check v-model directives
      issues.push(...this.analyzeModelDirectives(element, metadata, source));

      // Check event handlers
      issues.push(...this.analyzeEventHandlers(element, metadata, source));

      // Check v-show/v-if directives
      issues.push(...this.analyzeVisibilityDirectives(element, metadata, source));

      // Check dynamic class bindings
      issues.push(...this.analyzeClassBindings(element, metadata, source));
    }

    // Check ref-based focus management
    issues.push(...this.analyzeRefFocusManagement(source, sourceFile));

    return issues;
  }

  /**
   * Analyze v-model directives for accessibility issues.
   */
  private analyzeModelDirectives(
    element: any,
    metadata: VueMetadata,
    _source: string
  ): VueReactivityIssue[] {
    const issues: VueReactivityIssue[] = [];

    if (!metadata.directives?.model) return issues;

    // Check for v-model without proper labeling
    const hasLabel = this.hasLabelOrAria(element);

    if (!hasLabel) {
      issues.push({
        type: 'vue-model-no-label',
        severity: 'error',
        message: 'Input with v-model lacks accessible label. Add aria-label, aria-labelledby, or associate with <label>.',
        confidence: {
          level: 'HIGH',
          reason: 'Vue v-model directive detected without ARIA labeling',
          treeCompleteness: 1.0,
        },
        locations: [element.location],
        wcagCriteria: ['4.1.2', '1.3.1'],
        pattern: 'v-model',
        directive: 'v-model',
        fix: {
          description: 'Add an accessible label to the input element',
          code: `<input v-model="name" aria-label="Name" />

<!-- OR with <label> -->
<label for="name-input">Name</label>
<input id="name-input" v-model="name" />`,
        },
      });
    }

    return issues;
  }

  /**
   * Analyze event handlers for keyboard accessibility.
   */
  private analyzeEventHandlers(
    element: any,
    metadata: VueMetadata,
    _source: string
  ): VueReactivityIssue[] {
    const issues: VueReactivityIssue[] = [];

    if (!metadata.directives?.on) return issues;

    const hasClick = metadata.directives.on.includes('click');
    const hasKeyboard = metadata.directives.on.some(event =>
      event === 'keydown' || event === 'keyup' || event === 'keypress'
    );

    // Check for @click without keyboard handler on non-interactive elements
    if (hasClick && !hasKeyboard && !this.isInteractiveElement(element.tagName)) {
      const hasRole = element.attributes.role;
      const hasTabIndex = element.attributes.tabindex !== undefined;

      if (!hasRole || !hasTabIndex) {
        issues.push({
          type: 'vue-click-no-keyboard',
          severity: 'error',
          message: 'Non-interactive element with @click lacks keyboard handler. Add @keydown and role/tabindex.',
          confidence: {
            level: 'HIGH',
            reason: 'Click handler without keyboard alternative',
            treeCompleteness: 1.0,
          },
          locations: [element.location],
          wcagCriteria: ['2.1.1', '2.1.2'],
          pattern: 'v-on',
          directive: '@click',
          fix: {
            description: 'Add keyboard handler and proper ARIA role',
            code: `<div
  role="button"
  tabindex="0"
  @click="handleClick"
  @keydown="(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }"
>
  Click me
</div>`,
          },
        });
      }
    }

    return issues;
  }

  /**
   * Analyze v-show and v-if directives for visibility changes without ARIA.
   */
  private analyzeVisibilityDirectives(
    element: any,
    metadata: VueMetadata,
    source: string
  ): VueReactivityIssue[] {
    const issues: VueReactivityIssue[] = [];

    const hasVisibilityDirective = metadata.directives?.show ||
                                    metadata.directives?.conditionals;

    if (!hasVisibilityDirective) return issues;

    const hasAriaHidden = element.attributes['aria-hidden'] !== undefined;
    const hasAriaExpanded = this.hasAriaExpandedInParent(element, source);

    if (!hasAriaHidden && !hasAriaExpanded) {
      const directive = metadata.directives?.show ? 'v-show' : 'v-if';

      issues.push({
        type: 'vue-visibility-no-aria',
        severity: 'warning',
        message: `${directive} directive affects visibility but lacks ARIA communication. Add aria-hidden or aria-expanded.`,
        confidence: {
          level: 'MEDIUM',
          reason: 'Visibility directive without ARIA attributes',
          treeCompleteness: 0.7,
        },
        locations: [element.location],
        wcagCriteria: ['4.1.2', '4.1.3'],
        pattern: directive === 'v-show' ? 'v-show' : 'v-if',
        directive,
        fix: {
          description: 'Add ARIA attributes to communicate visibility changes',
          code: `<!-- Option 1: Use aria-hidden with v-show -->
<div v-show="isOpen" :aria-hidden="!isOpen">
  Content
</div>

<!-- Option 2: Use aria-expanded on toggle button -->
<button :aria-expanded="isOpen" @click="toggle">
  Toggle
</button>
<div v-show="isOpen">
  Content
</div>`,
        },
      });
    }

    return issues;
  }

  /**
   * Analyze dynamic class bindings for accessibility issues.
   */
  private analyzeClassBindings(
    element: any,
    metadata: VueMetadata,
    source: string
  ): VueReactivityIssue[] {
    const issues: VueReactivityIssue[] = [];

    if (!metadata.directives?.bindings?.includes('class')) return issues;

    // Check if class binding might affect visibility
    const classAttr = element.attributes[':class'] || element.attributes['v-bind:class'];
    if (!classAttr) return issues;

    // Look for visibility-related keywords in class binding
    const hasVisibilityKeywords = /hidden|visible|show|hide|open|closed|collapsed|expanded/i.test(classAttr);

    if (hasVisibilityKeywords) {
      const hasAriaHidden = element.attributes['aria-hidden'] !== undefined;
      const hasAriaExpanded = this.hasAriaExpandedInParent(element, source);

      if (!hasAriaHidden && !hasAriaExpanded) {
        issues.push({
          type: 'vue-class-binding-no-aria',
          severity: 'warning',
          message: 'Dynamic :class binding affects visibility but lacks ARIA communication. Add aria-hidden or aria-expanded.',
          confidence: {
            level: 'MEDIUM',
            reason: 'Class binding with visibility keywords but no ARIA',
            treeCompleteness: 0.6,
          },
          locations: [element.location],
          wcagCriteria: ['4.1.2', '4.1.3'],
          pattern: 'v-bind:class',
          directive: ':class',
          fix: {
            description: 'Add ARIA attributes to track visibility state',
            code: `<!-- Bind aria-hidden to the same condition -->
<div :class="{ hidden: !isOpen }" :aria-hidden="!isOpen">
  Content
</div>`,
          },
        });
      }
    }

    return issues;
  }

  /**
   * Analyze ref-based focus management for cleanup issues.
   */
  private analyzeRefFocusManagement(
    source: string,
    sourceFile: string
  ): VueReactivityIssue[] {
    const issues: VueReactivityIssue[] = [];

    // Check for $refs.*.focus() patterns
    const refFocusPattern = /\$refs\.\w+\.focus\(\)/g;
    const matches = source.matchAll(refFocusPattern);

    let hasMatch = false;
    for (const _match of matches) {
      hasMatch = true;
      break;
    }

    if (!hasMatch) return issues;

    // Check for cleanup in onBeforeUnmount or onUnmounted
    const hasCleanup = source.includes('onBeforeUnmount') ||
                       source.includes('onUnmounted') ||
                       source.includes('beforeUnmount') ||
                       source.includes('unmounted');

    if (!hasCleanup) {
      issues.push({
        type: 'vue-ref-focus-no-cleanup',
        severity: 'warning',
        message: 'Focus management using $refs lacks cleanup. Consider using onBeforeUnmount to restore focus.',
        confidence: {
          level: 'MEDIUM',
          reason: 'Ref-based focus() without lifecycle cleanup hooks',
          treeCompleteness: 0.6,
        },
        locations: [{
          file: sourceFile,
          line: 1,
          column: 0,
        }],
        wcagCriteria: ['2.4.3', '2.1.2'],
        pattern: 'ref',
        fix: {
          description: 'Store previous focus and restore on cleanup',
          code: `<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const inputRef = ref(null);
let previousFocus = null;

onMounted(() => {
  previousFocus = document.activeElement;
  inputRef.value?.focus();
});

onBeforeUnmount(() => {
  previousFocus?.focus();
});
</script>`,
        },
      });
    }

    return issues;
  }

  // Helper methods

  private hasLabelOrAria(element: any): boolean {
    return (
      element.attributes['aria-label'] ||
      element.attributes['aria-labelledby'] ||
      element.attributes.id // Could be referenced by a <label>
    );
  }

  private isInteractiveElement(tagName: string): boolean {
    const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
    return interactiveElements.includes(tagName.toLowerCase());
  }

  private hasAriaExpandedInParent(_element: any, source: string): boolean {
    // Simplified check: look for aria-expanded in the source
    return source.includes('aria-expanded') || source.includes(':aria-expanded');
  }
}

/**
 * Convenience function to analyze Vue component for reactivity issues.
 *
 * @param source - Vue component source code
 * @param sourceFile - Filename for error reporting
 * @returns Array of detected issues
 */
export function analyzeVueReactivity(
  source: string,
  sourceFile: string
): VueReactivityIssue[] {
  const analyzer = new VueReactivityAnalyzer();
  return analyzer.analyze(source, sourceFile);
}
