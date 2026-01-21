import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class OrientationLockAnalyzer extends BaseAnalyzer {
    readonly name = "OrientationLockAnalyzer";
    readonly description = "Detects code that locks screen orientation, preventing users from viewing content in their preferred orientation";
    private readonly ORIENTATION_LOCK_METHODS;
    analyze(context: AnalyzerContext): Issue[];
    private detectScreenOrientationLock;
    private detectMatchMediaOrientationRestriction;
}
