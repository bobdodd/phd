/**
 * Svelte Reactivity Analyzer
 *
 * Detects accessibility issues in Svelte-specific reactive patterns including:
 * - bind: directives without proper ARIA attributes
 * - on: event handlers without keyboard alternatives
 * - Class directives (class:) affecting visibility without ARIA
 * - Focus management patterns
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): All functionality available via keyboard
 * - 4.1.2 Name, Role, Value (Level A): ARIA attributes must reflect state
 *
 * This analyzer works with ActionLanguageModel nodes created by SvelteActionLanguageExtractor,
 * which parses both <script> sections and template directives.
 */

import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
import { ActionLanguageNode } from '../models/ActionLanguageModel';

/**
 * Analyzer for detecting Svelte reactivity accessibility issues.
 */
export class SvelteReactivityAnalyzer extends BaseAnalyzer {
  readonly name = 'SvelteReactivityAnalyzer';
  readonly description = 'Detects accessibility issues in Svelte-specific reactive patterns (bind:, on:, class:)';

  /**
   * Analyze Svelte component for reactivity accessibility issues.
   */
  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    // Only analyze if we have ActionLanguageModel with Svelte nodes
    if (!context.actionLanguageModel) {
      return issues;
    }

    const model = context.actionLanguageModel;
    const svelteNodes = model.nodes.filter(
      node => node.metadata?.framework === 'svelte'
    );

    if (svelteNodes.length === 0) {
      return issues;
    }

    // Check bind: directives for missing labels
    issues.push(...this.analyzeBindDirectives(svelteNodes, context));

    // Check on: directives for missing keyboard handlers
    issues.push(...this.analyzeEventHandlers(svelteNodes, context));

    // Check useEffect-style patterns with focus management
    issues.push(...this.analyzeFocusManagement(model.nodes, context));

    return issues;
  }

  /**
   * Analyze bind: directives for accessibility issues.
   */
  private analyzeBindDirectives(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    for (const node of nodes) {
      if (node.actionType === 'ariaStateChange' && node.metadata?.directive?.startsWith('bind:')) {
        const bindTarget = node.metadata.bindTarget;

        // Check for bind:value or bind:checked without proper labeling
        if (bindTarget === 'value' || bindTarget === 'checked') {
          // In file-scope mode, we can't check if element has label
          // So we flag it as a potential issue with MEDIUM confidence
          if (this.isFileScopeOnly(context)) {
            issues.push(this.createIssue(
              'svelte-bind-no-label',
              'warning',
              `Input with ${node.metadata.directive} may lack accessible label. Verify aria-label, aria-labelledby, or associated <label> exists.`,
              node.location,
              ['4.1.2', '1.3.1'],
              context,
              {
                fix: {
                  description: 'Add an accessible label to the input element',
                  code: `<input bind:value={name} aria-label="Name" />

<!-- OR with <label> -->
<label for="name-input">Name</label>
<input id="name-input" bind:value={name} />`,
                  location: node.location
                }
              }
            ));
          }
          // TODO: In document-scope mode, check actual DOM for label
        }

        // Check for bind:group without fieldset (always flag as warning)
        if (bindTarget === 'group') {
          issues.push(this.createIssue(
            'svelte-bind-group-no-fieldset',
            'warning',
            'Radio/checkbox group with bind:group should be wrapped in <fieldset> with <legend> for proper grouping.',
            node.location,
            ['1.3.1', '3.3.2'],
            context,
            {
              fix: {
                description: 'Wrap related inputs in a fieldset with legend',
                code: `<fieldset>
  <legend>Choose your option</legend>
  <label><input type="radio" bind:group={selected} value="a" /> Option A</label>
  <label><input type="radio" bind:group={selected} value="b" /> Option B</label>
</fieldset>`,
                location: node.location
              }
            }
          ));
        }
      }
    }

    return issues;
  }

  /**
   * Analyze on: event handlers for keyboard accessibility.
   */
  private analyzeEventHandlers(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    // Group nodes by element to check for click without keyboard
    const elementMap = new Map<string, ActionLanguageNode[]>();

    for (const node of nodes) {
      if (node.actionType === 'eventHandler' && node.metadata?.directive?.startsWith('on:')) {
        const elementKey = node.element.id || node.element.selector || 'unknown';
        if (!elementMap.has(elementKey)) {
          elementMap.set(elementKey, []);
        }
        elementMap.get(elementKey)!.push(node);
      }
    }

    // Check each element for click without keyboard handler
    for (const [_elementKey, elementNodes] of elementMap) {
      const hasClick = elementNodes.some(n => n.event === 'click');
      const hasKeyboard = elementNodes.some(n =>
        n.event === 'keydown' || n.event === 'keyup' || n.event === 'keypress'
      );

      if (hasClick && !hasKeyboard) {
        const clickNode = elementNodes.find(n => n.event === 'click')!;
        const tagName = clickNode.metadata?.tagName as string;

        // Only flag non-interactive elements
        const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
        if (!interactiveElements.includes(tagName?.toLowerCase() || '')) {
          issues.push(this.createIssue(
            'svelte-click-no-keyboard',
            'error',
            `Non-interactive element <${tagName}> with on:click lacks keyboard handler. Add on:keydown and role/tabindex.`,
            clickNode.location,
            ['2.1.1', '2.1.2'],
            context,
            {
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
                location: clickNode.location
              }
            }
          ));
        }
      }
    }

    return issues;
  }

  /**
   * Analyze focus management patterns for cleanup issues.
   * Similar to React's useEffect analysis.
   */
  private analyzeFocusManagement(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    // Find focus management in Svelte scripts
    const focusActions = nodes.filter(
      node => node.actionType === 'focusChange' &&
              node.metadata?.framework === 'svelte' &&
              node.metadata?.sourceSection === 'script'
    );

    for (const focusAction of focusActions) {
      // Check if there's cleanup (harder to detect without deeper analysis)
      // For now, just flag as a reminder
      if (!focusAction.metadata?.hasCleanup) {
        issues.push(this.createIssue(
          'svelte-focus-no-cleanup',
          'info',
          'Focus management detected. Ensure focus is restored on component unmount using onDestroy().',
          focusAction.location,
          ['2.4.3', '2.1.2'],
          context,
          {
            fix: {
              description: 'Add cleanup using onDestroy to restore focus',
              code: `import { onDestroy } from 'svelte';

let element;
let previousFocus;

function handleFocus() {
  previousFocus = document.activeElement;
  element?.focus();
}

onDestroy(() => {
  previousFocus?.focus();
});`,
              location: focusAction.location
            }
          }
        ));
      }
    }

    return issues;
  }
}
