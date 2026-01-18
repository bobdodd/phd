"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueReactivityAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class VueReactivityAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'VueReactivityAnalyzer';
        this.description = 'Detects accessibility issues in Vue-specific reactive patterns (v-model, v-on)';
    }
    analyze(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        const vueNodes = context.actionLanguageModel.nodes.filter(node => node.metadata?.framework === 'vue');
        if (vueNodes.length === 0) {
            return issues;
        }
        issues.push(...this.analyzeVModel(vueNodes, context));
        issues.push(...this.analyzeEventHandlers(vueNodes, context));
        issues.push(...this.analyzeFocusManagement(context.actionLanguageModel.nodes, context));
        return issues;
    }
    analyzeVModel(nodes, context) {
        const issues = [];
        for (const node of nodes) {
            if (node.actionType === 'ariaStateChange' &&
                (node.metadata?.directive === 'v-model' || node.metadata?.directive?.startsWith('v-model:'))) {
                if (this.isFileScopeOnly(context)) {
                    issues.push(this.createIssue('vue-vmodel-no-label', 'warning', `Input with ${node.metadata.directive} may lack accessible label. Verify aria-label, aria-labelledby, or associated <label> exists.`, node.location, ['4.1.2', '1.3.1'], context, {
                        fix: {
                            description: 'Add an accessible label to the input element',
                            code: `<input v-model="name" aria-label="Name" />

<!-- OR with <label> -->
<label for="name-input">Name</label>
<input id="name-input" v-model="name" />`,
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
            if (node.actionType === 'eventHandler' &&
                (node.metadata?.directive?.startsWith('v-on:') || node.metadata?.directive?.startsWith('@'))) {
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
                    issues.push(this.createIssue('vue-click-no-keyboard', 'error', `Non-interactive element <${tagName}> with @click lacks keyboard handler. Add @keydown and role/tabindex.`, clickNode.location, ['2.1.1', '2.1.2'], context, {
                        fix: {
                            description: 'Add keyboard handler and proper ARIA role',
                            code: `<div role="button" tabindex="0" @click="handleClick" @keydown="handleKeydown">Click me</div>`,
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
            node.metadata?.framework === 'vue' &&
            node.metadata?.sourceSection === 'script');
        for (const focusAction of focusActions) {
            if (!focusAction.metadata?.hasCleanup) {
                issues.push(this.createIssue('vue-focus-no-cleanup', 'info', 'Focus management detected. Ensure focus is restored on component unmount using beforeUnmount().', focusAction.location, ['2.4.3', '2.1.2'], context, {
                    fix: {
                        description: 'Add cleanup using beforeUnmount to restore focus',
                        code: `import { onBeforeUnmount } from 'vue';

let previousFocus;
onMounted(() => { previousFocus = document.activeElement; });
onBeforeUnmount(() => { previousFocus?.focus(); });`,
                        location: focusAction.location
                    }
                }));
            }
        }
        return issues;
    }
}
exports.VueReactivityAnalyzer = VueReactivityAnalyzer;
