/**
 * Svelte Reactivity Analyzer
 *
 * Detects accessibility issues in Svelte-specific reactive patterns including:
 * - bind: directives without proper ARIA attributes
 * - on: event handlers without keyboard alternatives
 * - Reactive statements ($:) managing focus without cleanup
 * - Class directives (class:) affecting visibility without ARIA
 * - Store subscriptions without proper announcements
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): All functionality available via keyboard
 * - 2.1.2 No Keyboard Trap (Level A): Keyboard focus can be moved away
 * - 2.4.3 Focus Order (Level A): Focus order matches visual order
 * - 4.1.2 Name, Role, Value (Level A): ARIA attributes must reflect state
 * - 4.1.3 Status Messages (Level AA): Dynamic content needs announcements
 *
 * Why this matters:
 * - Svelte's bind: creates two-way data binding that may bypass ARIA updates
 * - Reactive statements ($:) can modify DOM without screen reader awareness
 * - Class directives can hide/show content without proper ARIA communication
 * - Store updates don't automatically trigger screen reader announcements
 */

import { Issue } from '../models/BaseModel';
import { extractSvelteDOM, SvelteMetadata } from '../parsers/SvelteDOMExtractor';

export interface SvelteReactivityIssue extends Issue {
  /** The Svelte pattern that caused this issue */
  pattern: 'bind' | 'on' | 'reactive-statement' | 'class-directive' | 'store';

  /** Specific directive or code that triggered the issue */
  directive?: string;

  /** Recommended fix */
  fix: {
    description: string;
    code?: string;
  };
}

/**
 * Analyzer for detecting Svelte reactivity accessibility issues.
 */
export class SvelteReactivityAnalyzer {
  /**
   * Analyze Svelte component for reactivity accessibility issues.
   *
   * @param source - Svelte component source code
   * @param sourceFile - Filename for error reporting
   * @returns Array of detected issues
   *
   * @example
   * ```typescript
   * const analyzer = new SvelteReactivityAnalyzer();
   * const issues = analyzer.analyze(`
   *   <script>
   *     let isOpen = false;
   *   </script>
   *
   *   <button on:click={() => isOpen = !isOpen}>
   *     Toggle
   *   </button>
   *
   *   <div class:hidden={!isOpen}>
   *     Content
   *   </div>
   * `, 'Dropdown.svelte');
   * ```
   */
  analyze(source: string, sourceFile: string): SvelteReactivityIssue[] {
    const issues: SvelteReactivityIssue[] = [];

    // Extract DOM structure
    const domModel = extractSvelteDOM(source, sourceFile);
    if (!domModel) return issues;

    // Analyze each element for Svelte-specific issues
    const elements = domModel.getAllElements();

    for (const element of elements) {
      const metadata = element.metadata as SvelteMetadata;
      if (!metadata?.directives) continue;

      // Check bind: directives
      issues.push(...this.analyzeBindDirectives(element, metadata, source));

      // Check on: event handlers
      issues.push(...this.analyzeEventHandlers(element, metadata, source));

      // Check class: directives
      issues.push(...this.analyzeClassDirectives(element, metadata, source));
    }

    // Check reactive statements ($:)
    issues.push(...this.analyzeReactiveStatements(source, sourceFile));

    // Check store subscriptions
    issues.push(...this.analyzeStoreSubscriptions(source, sourceFile));

    return issues;
  }

  /**
   * Analyze bind: directives for accessibility issues.
   */
  private analyzeBindDirectives(
    element: any,
    metadata: SvelteMetadata,
    source: string
  ): SvelteReactivityIssue[] {
    const issues: SvelteReactivityIssue[] = [];

    if (!metadata.directives?.bind) return issues;

    for (const bindTarget of metadata.directives.bind) {
      // Check for bind:value without proper labeling
      if (bindTarget === 'value' || bindTarget === 'checked') {
        const hasLabel = this.hasLabelOrAria(element, source);

        if (!hasLabel) {
          issues.push({
            type: 'svelte-bind-no-label',
            severity: 'error',
            message: `Input with bind:${bindTarget} lacks accessible label. Add aria-label, aria-labelledby, or associate with <label>.`,
            confidence: {
              level: 'HIGH',
              reason: 'Svelte bind directive detected without ARIA labeling',
              treeCompleteness: 1.0,
            },
            locations: [element.location],
            wcagCriteria: ['4.1.2', '1.3.1'],
            pattern: 'bind',
            directive: `bind:${bindTarget}`,
            fix: {
              description: 'Add an accessible label to the input element',
              code: `<input bind:value={name} aria-label="Name" />

<!-- OR with <label> -->
<label for="name-input">Name</label>
<input id="name-input" bind:value={name} />`,
            },
          });
        }
      }

      // Check for bind:group without fieldset/legend
      if (bindTarget === 'group') {
        const inFieldset = this.isInFieldset(element);

        if (!inFieldset) {
          issues.push({
            type: 'svelte-bind-group-no-fieldset',
            severity: 'warning',
            message: 'Radio/checkbox group with bind:group should be wrapped in <fieldset> with <legend>.',
            confidence: {
              level: 'MEDIUM',
              reason: 'Svelte bind:group detected without fieldset wrapper',
              treeCompleteness: 0.8,
            },
            locations: [element.location],
            wcagCriteria: ['1.3.1', '3.3.2'],
            pattern: 'bind',
            directive: 'bind:group',
            fix: {
              description: 'Wrap related inputs in a fieldset with legend',
              code: `<fieldset>
  <legend>Choose your option</legend>
  <label><input type="radio" bind:group={selected} value="a" /> Option A</label>
  <label><input type="radio" bind:group={selected} value="b" /> Option B</label>
</fieldset>`,
            },
          });
        }
      }
    }

    return issues;
  }

  /**
   * Analyze on: event handlers for keyboard accessibility.
   */
  private analyzeEventHandlers(
    element: any,
    metadata: SvelteMetadata,
    _source: string
  ): SvelteReactivityIssue[] {
    const issues: SvelteReactivityIssue[] = [];

    if (!metadata.directives?.on) return issues;

    const hasClick = metadata.directives.on.includes('click');
    const hasKeyboard = metadata.directives.on.some(event =>
      event === 'keydown' || event === 'keyup' || event === 'keypress'
    );

    // Check for on:click without keyboard handler on non-interactive elements
    if (hasClick && !hasKeyboard && !this.isInteractiveElement(element.tagName)) {
      const hasRole = element.attributes.role;
      const hasTabIndex = element.attributes.tabindex !== undefined;

      if (!hasRole || !hasTabIndex) {
        issues.push({
          type: 'svelte-click-no-keyboard',
          severity: 'error',
          message: `Non-interactive element with on:click lacks keyboard handler. Add on:keydown and role/tabindex.`,
          confidence: {
            level: 'HIGH',
            reason: 'Click handler without keyboard alternative',
            treeCompleteness: 1.0,
          },
          locations: [element.location],
          wcagCriteria: ['2.1.1', '2.1.2'],
          pattern: 'on',
          directive: 'on:click',
          fix: {
            description: 'Add keyboard handler and proper ARIA role',
            code: `<div
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
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
   * Analyze class: directives for visibility changes without ARIA.
   */
  private analyzeClassDirectives(
    element: any,
    metadata: SvelteMetadata,
    source: string
  ): SvelteReactivityIssue[] {
    const issues: SvelteReactivityIssue[] = [];

    if (!metadata.directives?.class) return issues;

    // Check for visibility-related class directives
    for (const className of metadata.directives.class) {
      if (this.isVisibilityClass(className)) {
        const hasAriaHidden = element.attributes['aria-hidden'] !== undefined;
        const hasAriaExpanded = this.hasAriaExpandedInParent(element, source);

        if (!hasAriaHidden && !hasAriaExpanded) {
          issues.push({
            type: 'svelte-class-visibility-no-aria',
            severity: 'warning',
            message: `class:${className} directive affects visibility but lacks ARIA communication. Add aria-hidden or aria-expanded.`,
            confidence: {
              level: 'MEDIUM',
              reason: 'Visibility class directive without ARIA attributes',
              treeCompleteness: 0.7,
            },
            locations: [element.location],
            wcagCriteria: ['4.1.2', '4.1.3'],
            pattern: 'class-directive',
            directive: `class:${className}`,
            fix: {
              description: 'Add ARIA attributes to communicate visibility changes',
              code: `<!-- Option 1: Use aria-hidden -->
<div class:hidden={!isOpen} aria-hidden={!isOpen}>
  Content
</div>

<!-- Option 2: Use aria-expanded on toggle button -->
<button aria-expanded={isOpen} on:click={() => isOpen = !isOpen}>
  Toggle
</button>
<div class:hidden={!isOpen}>
  Content
</div>`,
            },
          });
        }
      }
    }

    return issues;
  }

  /**
   * Analyze reactive statements ($:) for focus management issues.
   */
  private analyzeReactiveStatements(
    source: string,
    sourceFile: string
  ): SvelteReactivityIssue[] {
    const issues: SvelteReactivityIssue[] = [];

    // Find reactive statements with focus management
    const reactiveStatements = this.extractReactiveStatements(source);

    for (const statement of reactiveStatements) {
      if (statement.includesFocus) {
        // Check if there's cleanup or focus restoration
        const hasCleanup = source.includes('onDestroy') || source.includes('beforeUpdate');

        if (!hasCleanup) {
          issues.push({
            type: 'svelte-reactive-focus-no-cleanup',
            severity: 'warning',
            message: 'Reactive statement ($:) manages focus but lacks cleanup. Consider using onDestroy or beforeUpdate to restore focus.',
            confidence: {
              level: 'MEDIUM',
              reason: 'Reactive statement with focus() but no cleanup hooks',
              treeCompleteness: 0.6,
            },
            locations: [{
              file: sourceFile,
              line: statement.line,
              column: 0,
            }],
            wcagCriteria: ['2.4.3', '2.1.2'],
            pattern: 'reactive-statement',
            fix: {
              description: 'Store previous focus and restore on cleanup',
              code: `<script>
  import { onDestroy } from 'svelte';

  let element;
  let previousFocus;

  $: if (condition) {
    previousFocus = document.activeElement;
    element?.focus();
  }

  onDestroy(() => {
    previousFocus?.focus();
  });
</script>`,
            },
          });
        }
      }
    }

    return issues;
  }

  /**
   * Analyze store subscriptions for accessibility announcements.
   */
  private analyzeStoreSubscriptions(
    source: string,
    sourceFile: string
  ): SvelteReactivityIssue[] {
    const issues: SvelteReactivityIssue[] = [];

    // Find store subscriptions ($storeName or store.subscribe)
    const hasStoreSubscription = source.includes('$') && (
      source.includes('Store') ||
      source.includes('writable') ||
      source.includes('readable') ||
      source.includes('derived')
    );

    if (!hasStoreSubscription) return issues;

    // Check if store updates involve UI state that needs announcements
    const managesAccessibilityState =
      source.includes('aria') ||
      source.includes('announce') ||
      source.includes('alert') ||
      source.includes('status');

    if (managesAccessibilityState) {
      const hasLiveRegion = source.includes('aria-live');

      if (!hasLiveRegion) {
        issues.push({
          type: 'svelte-store-no-announcements',
          severity: 'warning',
          message: 'Store manages accessibility state but lacks aria-live region for screen reader announcements.',
          confidence: {
            level: 'MEDIUM',
            reason: 'Store subscription with accessibility keywords but no aria-live',
            treeCompleteness: 0.5,
          },
          locations: [{
            file: sourceFile,
            line: 1,
            column: 0,
          }],
          wcagCriteria: ['4.1.3'],
          pattern: 'store',
          fix: {
            description: 'Add aria-live region for dynamic announcements',
            code: `<script>
  import { statusMessage } from './stores';
</script>

<!-- Announcement region -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  {$statusMessage}
</div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>`,
          },
        });
      }
    }

    return issues;
  }

  // Helper methods

  private hasLabelOrAria(element: any, _source: string): boolean {
    return (
      element.attributes['aria-label'] ||
      element.attributes['aria-labelledby'] ||
      element.attributes.id // Could be referenced by a <label>
    );
  }

  private isInFieldset(element: any): boolean {
    let current = element.parent;
    while (current) {
      if (current.tagName === 'fieldset') return true;
      current = current.parent;
    }
    return false;
  }

  private isInteractiveElement(tagName: string): boolean {
    const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
    return interactiveElements.includes(tagName.toLowerCase());
  }

  private isVisibilityClass(className: string): boolean {
    const visibilityKeywords = ['hidden', 'visible', 'show', 'hide', 'open', 'closed', 'collapsed', 'expanded'];
    return visibilityKeywords.some(keyword =>
      className.toLowerCase().includes(keyword)
    );
  }

  private hasAriaExpandedInParent(_element: any, source: string): boolean {
    // Simplified check: look for aria-expanded in the source
    return source.includes('aria-expanded');
  }

  private extractReactiveStatements(source: string): Array<{ line: number; includesFocus: boolean }> {
    const statements: Array<{ line: number; includesFocus: boolean }> = [];
    const lines = source.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Look for reactive statements: $: ...
      if (/\$:/.test(line)) {
        const includesFocus = line.includes('.focus()') || line.includes('.blur()');
        statements.push({
          line: i + 1,
          includesFocus,
        });
      }
    }

    return statements;
  }
}

/**
 * Convenience function to analyze Svelte component for reactivity issues.
 *
 * @param source - Svelte component source code
 * @param sourceFile - Filename for error reporting
 * @returns Array of detected issues
 */
export function analyzeSvelteReactivity(
  source: string,
  sourceFile: string
): SvelteReactivityIssue[] {
  const analyzer = new SvelteReactivityAnalyzer();
  return analyzer.analyze(source, sourceFile);
}
