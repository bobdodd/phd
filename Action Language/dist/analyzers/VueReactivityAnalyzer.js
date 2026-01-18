"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueReactivityAnalyzer = void 0;
exports.analyzeVueReactivity = analyzeVueReactivity;
const VueDOMExtractor_1 = require("../parsers/VueDOMExtractor");
class VueReactivityAnalyzer {
    analyze(source, sourceFile) {
        const issues = [];
        const domModel = (0, VueDOMExtractor_1.extractVueDOM)(source, sourceFile);
        if (!domModel)
            return issues;
        const elements = domModel.getAllElements();
        for (const element of elements) {
            const metadata = element.metadata;
            if (!metadata?.directives)
                continue;
            issues.push(...this.analyzeModelDirectives(element, metadata, source));
            issues.push(...this.analyzeEventHandlers(element, metadata, source));
            issues.push(...this.analyzeVisibilityDirectives(element, metadata, source));
            issues.push(...this.analyzeClassBindings(element, metadata, source));
        }
        issues.push(...this.analyzeRefFocusManagement(source, sourceFile));
        return issues;
    }
    analyzeModelDirectives(element, metadata, _source) {
        const issues = [];
        if (!metadata.directives?.model)
            return issues;
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
    analyzeVisibilityDirectives(element, metadata, source) {
        const issues = [];
        const hasVisibilityDirective = metadata.directives?.show ||
            metadata.directives?.conditionals;
        if (!hasVisibilityDirective)
            return issues;
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
    analyzeClassBindings(element, metadata, source) {
        const issues = [];
        if (!metadata.directives?.bindings?.includes('class'))
            return issues;
        const classAttr = element.attributes[':class'] || element.attributes['v-bind:class'];
        if (!classAttr)
            return issues;
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
    analyzeRefFocusManagement(source, sourceFile) {
        const issues = [];
        const refFocusPattern = /\$refs\.\w+\.focus\(\)/g;
        const matches = source.matchAll(refFocusPattern);
        let hasMatch = false;
        for (const _match of matches) {
            hasMatch = true;
            break;
        }
        if (!hasMatch)
            return issues;
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
    hasLabelOrAria(element) {
        return (element.attributes['aria-label'] ||
            element.attributes['aria-labelledby'] ||
            element.attributes.id);
    }
    isInteractiveElement(tagName) {
        const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
        return interactiveElements.includes(tagName.toLowerCase());
    }
    hasAriaExpandedInParent(_element, source) {
        return source.includes('aria-expanded') || source.includes(':aria-expanded');
    }
}
exports.VueReactivityAnalyzer = VueReactivityAnalyzer;
function analyzeVueReactivity(source, sourceFile) {
    const analyzer = new VueReactivityAnalyzer();
    return analyzer.analyze(source, sourceFile);
}
