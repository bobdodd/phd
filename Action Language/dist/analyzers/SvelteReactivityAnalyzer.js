"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvelteReactivityAnalyzer = void 0;
exports.analyzeSvelteReactivity = analyzeSvelteReactivity;
const SvelteDOMExtractor_1 = require("../parsers/SvelteDOMExtractor");
class SvelteReactivityAnalyzer {
    analyze(source, sourceFile) {
        const issues = [];
        const domModel = (0, SvelteDOMExtractor_1.extractSvelteDOM)(source, sourceFile);
        if (!domModel)
            return issues;
        const elements = domModel.getAllElements();
        for (const element of elements) {
            const metadata = element.metadata;
            if (!metadata?.directives)
                continue;
            issues.push(...this.analyzeBindDirectives(element, metadata, source));
            issues.push(...this.analyzeEventHandlers(element, metadata, source));
            issues.push(...this.analyzeClassDirectives(element, metadata, source));
        }
        issues.push(...this.analyzeReactiveStatements(source, sourceFile));
        issues.push(...this.analyzeStoreSubscriptions(source, sourceFile));
        return issues;
    }
    analyzeBindDirectives(element, metadata, source) {
        const issues = [];
        if (!metadata.directives?.bind)
            return issues;
        for (const bindTarget of metadata.directives.bind) {
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
    analyzeEventHandlers(element, metadata, _source) {
        const issues = [];
        if (!metadata.directives?.on)
            return issues;
        const hasClick = metadata.directives.on.includes('click');
        const hasKeyboard = metadata.directives.on.some(event => event === 'keydown' || event === 'keyup' || event === 'keypress');
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
    analyzeClassDirectives(element, metadata, source) {
        const issues = [];
        if (!metadata.directives?.class)
            return issues;
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
    analyzeReactiveStatements(source, sourceFile) {
        const issues = [];
        const reactiveStatements = this.extractReactiveStatements(source);
        for (const statement of reactiveStatements) {
            if (statement.includesFocus) {
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
    analyzeStoreSubscriptions(source, sourceFile) {
        const issues = [];
        const hasStoreSubscription = source.includes('$') && (source.includes('Store') ||
            source.includes('writable') ||
            source.includes('readable') ||
            source.includes('derived'));
        if (!hasStoreSubscription)
            return issues;
        const managesAccessibilityState = source.includes('aria') ||
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
    hasLabelOrAria(element, _source) {
        return (element.attributes['aria-label'] ||
            element.attributes['aria-labelledby'] ||
            element.attributes.id);
    }
    isInFieldset(element) {
        let current = element.parent;
        while (current) {
            if (current.tagName === 'fieldset')
                return true;
            current = current.parent;
        }
        return false;
    }
    isInteractiveElement(tagName) {
        const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
        return interactiveElements.includes(tagName.toLowerCase());
    }
    isVisibilityClass(className) {
        const visibilityKeywords = ['hidden', 'visible', 'show', 'hide', 'open', 'closed', 'collapsed', 'expanded'];
        return visibilityKeywords.some(keyword => className.toLowerCase().includes(keyword));
    }
    hasAriaExpandedInParent(_element, source) {
        return source.includes('aria-expanded');
    }
    extractReactiveStatements(source) {
        const statements = [];
        const lines = source.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
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
exports.SvelteReactivityAnalyzer = SvelteReactivityAnalyzer;
function analyzeSvelteReactivity(source, sourceFile) {
    const analyzer = new SvelteReactivityAnalyzer();
    return analyzer.analyze(source, sourceFile);
}
