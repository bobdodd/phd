import { BaseAnalyzer, Issue, AnalyzerContext } from './BaseAnalyzer';
export declare class DeprecatedKeyCodeAnalyzer extends BaseAnalyzer {
    readonly name = "DeprecatedKeyCodeAnalyzer";
    readonly description = "Detects usage of deprecated KeyboardEvent.keyCode and recommends modern alternatives";
    analyze(context: AnalyzerContext): Issue[];
    private isKeyboardEvent;
    private checkHandlerForDeprecatedAPIs;
    private usesKeyCode;
    private usesWhich;
    private usesCharCode;
    private usesNumericKeyComparison;
    private reportDeprecatedKeyCode;
    private reportDeprecatedWhich;
    private reportDeprecatedCharCode;
    private reportNumericKeyComparison;
    private extractKeyCodeValues;
    private extractNumericKeyCodes;
    private getModernKeyAlternative;
    private keyCodeToKeyName;
    private generateModernKeyCodeFix;
    private getHandlerCode;
}
