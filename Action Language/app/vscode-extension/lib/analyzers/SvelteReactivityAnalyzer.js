"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvelteReactivityAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class SvelteReactivityAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'SvelteReactivityAnalyzer';
        this.description = 'Detects accessibility issues in Svelte-specific reactive patterns (bind:, on:, class:)';
    }
    analyze(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        const model = context.actionLanguageModel;
        const svelteNodes = model.nodes.filter(node => node.metadata?.framework === 'svelte');
        if (svelteNodes.length === 0) {
            return issues;
        }
        issues.push(...this.analyzeBindDirectives(svelteNodes, context));
        issues.push(...this.analyzeEventHandlers(svelteNodes, context));
        issues.push(...this.analyzeFocusManagement(model.nodes, context));
        return issues;
    }
    analyzeBindDirectives(nodes, context) {
        const issues = [];
        for (const node of nodes) {
            if (node.actionType === 'ariaStateChange' && node.metadata?.directive?.startsWith('bind:')) {
                const bindTarget = node.metadata.bindTarget;
                if (bindTarget === 'value' || bindTarget === 'checked') {
                    if (this.isFileScopeOnly(context)) {
                        issues.push(this.createIssue('svelte-bind-no-label', 'warning', `Input with ${node.metadata.directive} may lack accessible label. Verify aria-label, aria-labelledby, or associated <label> exists.`, node.location, ['4.1.2', '1.3.1'], context, {
                            fix: {
                                description: 'Add an accessible label to the input element',
                                code: `<input bind:value={name} aria-label="Name" />

<!-- OR with <label> -->
<label for="name-input">Name</label>
<input id="name-input" bind:value={name} />`,
                                location: node.location
                            }
                        }));
                    }
                }
                if (bindTarget === 'group') {
                    issues.push(this.createIssue('svelte-bind-group-no-fieldset', 'warning', 'Radio/checkbox group with bind:group should be wrapped in <fieldset> with <legend> for proper grouping.', node.location, ['1.3.1', '3.3.2'], context, {
                        fix: {
                            description: 'Wrap related inputs in a fieldset with legend',
                            code: `<fieldset>
  <legend>Choose your option</legend>
  <label><input type="radio" bind:group={selected} value="a" /> Option A</label>
  <label><input type="radio" bind:group={selected} value="b" /> Option B</label>
</fieldset>`,
                            location: node.location
                        }
                    }));
                }
            }
        }
        return issues;
    }
    analyzeEventHandlers(nodes, context) {
        const issues = [];
        const elementMap = new Map();
        for (const node of nodes) {
            if (node.actionType === 'eventHandler' && node.metadata?.directive?.startsWith('on:')) {
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
                    issues.push(this.createIssue('svelte-click-no-keyboard', 'error', `Non-interactive element <${tagName}> with on:click lacks keyboard handler. Add on:keydown and role/tabindex.`, clickNode.location, ['2.1.1', '2.1.2'], context, {
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
                    }));
                }
            }
        }
        return issues;
    }
    analyzeFocusManagement(nodes, context) {
        const issues = [];
        const focusActions = nodes.filter(node => node.actionType === 'focusChange' &&
            node.metadata?.framework === 'svelte' &&
            node.metadata?.sourceSection === 'script');
        for (const focusAction of focusActions) {
            if (!focusAction.metadata?.hasCleanup) {
                issues.push(this.createIssue('svelte-focus-no-cleanup', 'info', 'Focus management detected. Ensure focus is restored on component unmount using onDestroy().', focusAction.location, ['2.4.3', '2.1.2'], context, {
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
                }));
            }
        }
        return issues;
    }
}
exports.SvelteReactivityAnalyzer = SvelteReactivityAnalyzer;
