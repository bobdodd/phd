"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactHooksA11yAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class ReactHooksA11yAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'react-hooks-a11y';
        this.description = 'Detects accessibility issues in React Hooks patterns (useEffect focus management, useRef patterns)';
    }
    analyze(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        issues.push(...this.analyzeFocusManagement(context));
        return issues;
    }
    analyzeFocusManagement(context) {
        const issues = [];
        const model = context.actionLanguageModel;
        const focusActions = model.nodes.filter((node) => node.actionType === 'focusChange' &&
            node.metadata?.framework === 'react' &&
            node.metadata?.hook === 'useEffect');
        for (const focusAction of focusActions) {
            const message = 'useEffect contains focus management (.focus() or .blur()) but may lack a cleanup function. ' +
                'Focus management in effects should return a cleanup function to prevent focus leaks when the component unmounts or dependencies change.';
            const fix = {
                description: 'Add cleanup function to useEffect',
                code: `useEffect(() => {
  // Your focus management code
  elementRef.current.focus();

  // Add cleanup to restore focus
  return () => {
    // Restore focus to previous element or remove focus
    document.activeElement?.blur();
  };
}, [dependencies]);`,
                location: focusAction.location,
            };
            issues.push(this.createIssue('react-hooks-useeffect-focus-cleanup', 'warning', message, focusAction.location, ['2.1.1', '2.4.3'], context, { fix }));
        }
        return issues;
    }
}
exports.ReactHooksA11yAnalyzer = ReactHooksA11yAnalyzer;
