import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class AnimationControlAnalyzer extends BaseAnalyzer {
    readonly name = "AnimationControlAnalyzer";
    readonly description = "Detects animations and auto-playing media without proper user controls";
    analyze(context: AnalyzerContext): Issue[];
    private checkAutoPlayMedia;
    private checkAnimatedElement;
    private checkJavaScriptAnimations;
    private checkReducedMotionInDocument;
    private getHandlerCode;
    private addControlsToElement;
}
