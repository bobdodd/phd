"use strict";
/**
 * React stopPropagation Analyzer
 *
 * Detects use of stopPropagation() and stopImmediatePropagation() in React event handlers,
 * which can block assistive technology from receiving events.
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): stopPropagation can prevent keyboard events from reaching AT
 * - 4.1.2 Name, Role, Value (Level A): Can interfere with ARIA state updates
 *
 * Why this matters:
 * - Screen readers and other assistive technologies often rely on event bubbling
 * - stopPropagation() can prevent AT from detecting user interactions
 * - Particularly problematic for focus management and ARIA live regions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactStopPropagationAnalyzer = void 0;
exports.analyzeReactStopPropagation = analyzeReactStopPropagation;
const ReactPatternDetector_1 = require("../parsers/ReactPatternDetector");
/**
 * Analyzer for detecting stopPropagation accessibility issues in React components.
 */
class ReactStopPropagationAnalyzer {
    /**
     * Analyze React component for stopPropagation issues.
     *
     * @param source - React component source code
     * @param sourceFile - Filename for error reporting
     * @returns Array of detected issues
     *
     * @example
     * ```typescript
     * const analyzer = new ReactStopPropagationAnalyzer();
     * const issues = analyzer.analyze(`
     *   function Modal() {
     *     const handleClick = (e) => {
     *       e.stopPropagation(); // ⚠️ Blocks AT events
     *       closeModal();
     *     };
     *     return <button onClick={handleClick}>Close</button>;
     *   }
     * `, 'Modal.tsx');
     * ```
     */
    analyze(source, sourceFile) {
        const issues = [];
        try {
            const analysis = (0, ReactPatternDetector_1.analyzeReactComponent)(source, sourceFile);
            const problematicEvents = analysis.syntheticEvents.filter((e) => e.accessibilityConcerns.length > 0);
            for (const event of problematicEvents) {
                // Determine severity based on what methods are used
                const usesStopPropagation = event.methodsCalled.includes('stopPropagation');
                const usesStopImmediate = event.methodsCalled.includes('stopImmediatePropagation');
                const severity = usesStopImmediate ? 'error' : 'warning';
                // Build detailed message
                const message = this.buildMessage(event, usesStopImmediate);
                const fix = this.buildFix(event, usesStopPropagation, usesStopImmediate);
                issues.push({
                    type: 'react-stop-propagation',
                    severity,
                    message,
                    confidence: {
                        level: 'HIGH',
                        reason: 'Definitely using stopPropagation in event handler',
                        treeCompleteness: 1.0,
                    },
                    locations: [event.location],
                    wcagCriteria: ['2.1.1', '4.1.2'],
                    syntheticEvent: event,
                    fix,
                });
            }
        }
        catch (error) {
            // Parsing failed - might not be valid React code
            console.error(`React analysis failed for ${sourceFile}:`, error);
        }
        return issues;
    }
    /**
     * Build a detailed message for the issue.
     */
    buildMessage(_event, usesStopImmediate) {
        const method = usesStopImmediate ? 'stopImmediatePropagation()' : 'stopPropagation()';
        let message = `Event handler uses ${method}, which can prevent assistive technology from receiving events.`;
        if (usesStopImmediate) {
            message += ' This method blocks ALL subsequent listeners, including those from AT.';
        }
        else {
            message += ' This can interfere with screen readers and other AT that rely on event bubbling.';
        }
        return message;
    }
    /**
     * Build a fix recommendation.
     */
    buildFix(event, usesStopPropagation, usesStopImmediate) {
        if (usesStopImmediate) {
            return {
                description: 'Remove stopImmediatePropagation() unless absolutely necessary. Consider using stopPropagation() instead, or restructure the component to avoid needing it.',
                code: `// Instead of:\n${event.eventParamName}.stopImmediatePropagation();\n\n// Consider:\n// 1. Remove it entirely\n// 2. Use conditional logic to prevent duplicate handlers\n// 3. Use event delegation properly`,
            };
        }
        if (usesStopPropagation) {
            return {
                description: 'Remove stopPropagation() if possible. If needed to prevent default behavior, use preventDefault() instead. If you must stop propagation, document why and test thoroughly with screen readers.',
                code: `// Instead of:\n${event.eventParamName}.stopPropagation();\n\n// Consider:\n${event.eventParamName}.preventDefault(); // Only prevents default, allows bubbling\n\n// Or restructure component to avoid the need`,
            };
        }
        return {
            description: 'Review event handling logic and test with assistive technology.',
        };
    }
    /**
     * Check if a component uses stopPropagation (quick check without full analysis).
     */
    hasStopPropagation(source) {
        return (source.includes('stopPropagation()') || source.includes('stopImmediatePropagation()'));
    }
}
exports.ReactStopPropagationAnalyzer = ReactStopPropagationAnalyzer;
/**
 * Convenience function to analyze React component for stopPropagation issues.
 *
 * @param source - React component source code
 * @param sourceFile - Filename for error reporting
 * @returns Array of detected issues
 */
function analyzeReactStopPropagation(source, sourceFile) {
    const analyzer = new ReactStopPropagationAnalyzer();
    return analyzer.analyze(source, sourceFile);
}
//# sourceMappingURL=ReactStopPropagationAnalyzer.js.map