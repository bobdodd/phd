import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class ReactHooksA11yAnalyzer extends BaseAnalyzer {
    readonly name = "react-hooks-a11y";
    readonly description = "Detects accessibility issues in React Hooks patterns (useEffect focus management, useRef patterns)";
    analyze(context: AnalyzerContext): Issue[];
    private analyzeFocusManagement;
}
