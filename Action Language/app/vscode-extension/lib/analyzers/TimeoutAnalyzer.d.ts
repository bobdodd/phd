import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class TimeoutAnalyzer extends BaseAnalyzer {
    readonly name = "TimeoutAnalyzer";
    readonly description = "Detects time limits and timeouts that may prevent users from completing tasks";
    private readonly TIMEOUT_FUNCTIONS;
    private readonly SESSION_PATTERNS;
    private readonly REDIRECT_PATTERNS;
    private readonly TWENTY_HOURS_MS;
    private readonly SHORT_TIMEOUT_THRESHOLD;
    analyze(context: AnalyzerContext): Issue[];
    private detectTimeoutUsage;
    private detectAutomaticRedirect;
    private detectSessionTimeout;
    private detectCountdownTimer;
    private detectInactivityTimeout;
    private extractTimeoutDuration;
    private formatDuration;
}
