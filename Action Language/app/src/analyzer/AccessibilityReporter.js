/**
 * AccessibilityReporter - Unified accessibility analysis and reporting
 *
 * Combines all analyzers to produce comprehensive accessibility reports:
 * - Runs EventAnalyzer, FocusAnalyzer, ARIAAnalyzer, KeyboardAnalyzer
 * - Validates patterns with WidgetPatternValidator
 * - Calculates accessibility scores
 * - Maps issues to WCAG 2.1 success criteria
 * - Generates prioritized recommendations
 */

const EventAnalyzer = require('./EventAnalyzer');
const FocusAnalyzer = require('./FocusAnalyzer');
const ARIAAnalyzer = require('./ARIAAnalyzer');
const KeyboardAnalyzer = require('./KeyboardAnalyzer');
const WidgetPatternValidator = require('./WidgetPatternValidator');
const ContextChangeAnalyzer = require('./ContextChangeAnalyzer');
const TimingAnalyzer = require('./TimingAnalyzer');
const SemanticAnalyzer = require('./SemanticAnalyzer');

class AccessibilityReporter {
  /**
   * Create a new AccessibilityReporter
   * @param {Object} [options] - Reporter options
   */
  constructor(options = {}) {
    this.options = {
      includeEventAnalysis: options.includeEventAnalysis ?? true,
      includeFocusAnalysis: options.includeFocusAnalysis ?? true,
      includeAriaAnalysis: options.includeAriaAnalysis ?? true,
      includeKeyboardAnalysis: options.includeKeyboardAnalysis ?? true,
      includeWidgetValidation: options.includeWidgetValidation ?? true,
      includeContextChangeAnalysis: options.includeContextChangeAnalysis ?? true,
      includeTimingAnalysis: options.includeTimingAnalysis ?? true,
      includeSemanticAnalysis: options.includeSemanticAnalysis ?? true,
      strictMode: options.strictMode ?? false
    };

    // Initialize analyzers
    this.eventAnalyzer = new EventAnalyzer();
    this.focusAnalyzer = new FocusAnalyzer();
    this.ariaAnalyzer = new ARIAAnalyzer();
    this.keyboardAnalyzer = new KeyboardAnalyzer();
    this.widgetValidator = new WidgetPatternValidator({
      strictMode: this.options.strictMode
    });

    // Phase 3: New analyzers
    this.contextChangeAnalyzer = new ContextChangeAnalyzer();
    this.timingAnalyzer = new TimingAnalyzer();
    this.semanticAnalyzer = new SemanticAnalyzer();

    // Results storage
    this.results = null;

    // WCAG 2.1 criteria mapping
    this.wcagCriteria = this.defineWCAGCriteria();
  }

  /**
   * Define WCAG 2.1 success criteria relevant to JavaScript accessibility
   */
  defineWCAGCriteria() {
    return {
      // Perceivable
      '1.3.1': {
        name: 'Info and Relationships',
        level: 'A',
        description: 'Information, structure, and relationships conveyed through presentation can be programmatically determined',
        category: 'aria'
      },
      '1.4.13': {
        name: 'Content on Hover or Focus',
        level: 'AA',
        description: 'Content appearing on hover/focus is dismissible, hoverable, and persistent',
        category: 'focus'
      },

      // Operable
      '2.1.1': {
        name: 'Keyboard',
        level: 'A',
        description: 'All functionality is available from a keyboard',
        category: 'keyboard'
      },
      '2.1.2': {
        name: 'No Keyboard Trap',
        level: 'A',
        description: 'Keyboard focus can be moved away from any component',
        category: 'keyboard'
      },
      '2.1.4': {
        name: 'Character Key Shortcuts',
        level: 'A',
        description: 'Single character key shortcuts can be turned off or remapped',
        category: 'keyboard'
      },
      '2.4.3': {
        name: 'Focus Order',
        level: 'A',
        description: 'Focusable components receive focus in an order that preserves meaning',
        category: 'focus'
      },
      '2.4.7': {
        name: 'Focus Visible',
        level: 'AA',
        description: 'Keyboard focus indicator is visible',
        category: 'focus'
      },
      '2.4.11': {
        name: 'Focus Not Obscured (Minimum)',
        level: 'AA',
        description: 'Focused component is not entirely hidden',
        category: 'focus'
      },
      '2.5.3': {
        name: 'Label in Name',
        level: 'A',
        description: 'UI components with labels include visible label text in accessible name',
        category: 'aria'
      },

      // Understandable
      '3.2.1': {
        name: 'On Focus',
        level: 'A',
        description: 'Receiving focus does not cause a change of context',
        category: 'focus'
      },
      '3.2.2': {
        name: 'On Input',
        level: 'A',
        description: 'Changing input does not cause unexpected context changes',
        category: 'events'
      },

      // Robust
      '4.1.2': {
        name: 'Name, Role, Value',
        level: 'A',
        description: 'UI components have accessible name, role, states, and properties',
        category: 'aria'
      },
      '4.1.3': {
        name: 'Status Messages',
        level: 'AA',
        description: 'Status messages can be programmatically determined without focus',
        category: 'aria'
      }
    };
  }

  /**
   * Analyze an ActionTree and generate a comprehensive report
   * @param {ActionTree} tree - The ActionTree to analyze
   * @returns {Object} Comprehensive accessibility report
   */
  analyze(tree) {
    const analyzerResults = {};
    const startTime = Date.now();

    // Run all analyzers
    if (this.options.includeEventAnalysis) {
      analyzerResults.events = this.eventAnalyzer.analyze(tree);
    }

    if (this.options.includeFocusAnalysis) {
      analyzerResults.focus = this.focusAnalyzer.analyze(tree);
    }

    if (this.options.includeAriaAnalysis) {
      analyzerResults.aria = this.ariaAnalyzer.analyze(tree);
    }

    if (this.options.includeKeyboardAnalysis) {
      // Pass EventAnalyzer data to KeyboardAnalyzer for enhanced detections
      analyzerResults.keyboard = this.keyboardAnalyzer.analyze(tree, analyzerResults.events);
    }

    // Phase 3: Run new analyzers
    if (this.options.includeContextChangeAnalysis) {
      analyzerResults.contextChange = this.contextChangeAnalyzer.analyze(tree, analyzerResults.events);
    }

    if (this.options.includeTimingAnalysis) {
      analyzerResults.timing = this.timingAnalyzer.analyze(tree);
    }

    if (this.options.includeSemanticAnalysis) {
      analyzerResults.semantic = this.semanticAnalyzer.analyze(tree, analyzerResults.events);
    }

    // Run widget validation
    let widgetResults = null;
    if (this.options.includeWidgetValidation) {
      widgetResults = this.widgetValidator.validate(analyzerResults);
    }

    const analysisTime = Date.now() - startTime;

    // Compile results
    this.results = this.compileResults(analyzerResults, widgetResults, analysisTime);

    return this.results;
  }

  /**
   * Compile results from all analyzers
   */
  compileResults(analyzerResults, widgetResults, analysisTime) {
    // Collect all issues
    const allIssues = this.collectIssues(analyzerResults, widgetResults);

    // Map issues to WCAG criteria
    const wcagMapping = this.mapIssuesToWCAG(allIssues);

    // Calculate scores
    const scores = this.calculateScores(analyzerResults, widgetResults, allIssues);

    // Generate recommendations
    const recommendations = this.generateRecommendations(allIssues, analyzerResults);

    // Compile statistics
    const stats = this.compileStatistics(analyzerResults, widgetResults);

    return {
      // Metadata
      timestamp: new Date().toISOString(),
      analysisTime: analysisTime,

      // Scores
      scores: scores,
      grade: this.calculateGrade(scores.overall),

      // Issues
      issues: allIssues,
      issuesByCategory: this.groupIssuesByCategory(allIssues),
      issuesBySeverity: this.groupIssuesBySeverity(allIssues),

      // WCAG mapping
      wcagCompliance: wcagMapping,

      // Recommendations
      recommendations: recommendations,

      // Statistics
      statistics: stats,

      // Raw analyzer results (for detailed inspection)
      analyzerResults: analyzerResults,
      widgetValidation: widgetResults,

      // Convenience methods
      hasIssues: () => allIssues.length > 0,
      hasErrors: () => allIssues.some(i => i.severity === 'error'),
      hasWarnings: () => allIssues.some(i => i.severity === 'warning'),
      getIssueCount: () => allIssues.length,
      getErrorCount: () => allIssues.filter(i => i.severity === 'error').length,
      getWarningCount: () => allIssues.filter(i => i.severity === 'warning').length,
      isAccessible: () => !allIssues.some(i => i.severity === 'error'),
      getWCAGLevel: () => this.determineWCAGLevel(wcagMapping)
    };
  }

  /**
   * Collect all issues from analyzers
   */
  collectIssues(analyzerResults, widgetResults) {
    const issues = [];

    // Event analyzer issues
    if (analyzerResults.events?.accessibilityPatterns) {
      for (const pattern of analyzerResults.events.accessibilityPatterns) {
        if (pattern.type === 'click-without-keyboard') {
          issues.push({
            id: `event-${issues.length}`,
            category: 'keyboard',
            severity: 'warning',
            message: 'Click handler without keyboard equivalent',
            element: pattern.element,
            wcag: ['2.1.1'],
            source: 'EventAnalyzer'
          });
        }
      }
    }

    // Focus analyzer issues
    if (analyzerResults.focus?.issues) {
      for (const issue of analyzerResults.focus.issues) {
        issues.push({
          id: `focus-${issues.length}`,
          category: 'focus',
          severity: issue.severity,
          message: issue.message,
          element: issue.elementRef,
          suggestion: issue.suggestion,
          wcag: this.mapFocusIssueToWCAG(issue),
          source: 'FocusAnalyzer',
          location: issue.location,
          actionId: issue.actionId
        });
      }
    }

    // ARIA analyzer issues
    if (analyzerResults.aria?.issues) {
      for (const issue of analyzerResults.aria.issues) {
        issues.push({
          id: `aria-${issues.length}`,
          category: 'aria',
          severity: issue.severity,
          message: issue.message,
          element: issue.elementRef,
          suggestion: issue.suggestion,
          wcag: this.mapAriaIssueToWCAG(issue),
          source: 'ARIAAnalyzer',
          location: issue.location,
          actionId: issue.actionId
        });
      }
    }

    // Keyboard analyzer issues
    if (analyzerResults.keyboard?.issues) {
      for (const issue of analyzerResults.keyboard.issues) {
        issues.push({
          id: `keyboard-${issues.length}`,
          category: 'keyboard',
          severity: issue.severity,
          message: issue.message,
          element: issue.elementRef,
          suggestion: issue.suggestion,
          wcag: this.mapKeyboardIssueToWCAG(issue),
          source: 'KeyboardAnalyzer',
          location: issue.location,
          actionId: issue.actionId
        });
      }
    }

    // Widget validation issues
    if (widgetResults?.issues) {
      for (const issue of widgetResults.issues) {
        issues.push({
          id: `widget-${issues.length}`,
          category: 'widget',
          severity: issue.severity,
          message: issue.message,
          pattern: issue.pattern,
          element: issue.element,
          url: issue.url,
          wcag: ['4.1.2'],
          source: 'WidgetPatternValidator'
        });
      }
    }

    return issues;
  }

  /**
   * Map focus issues to WCAG criteria
   */
  mapFocusIssueToWCAG(issue) {
    const mappings = {
      'focus-on-non-focusable': ['2.4.3', '4.1.2'],
      'positive-tabindex': ['2.4.3'],
      'standalone-blur': ['2.4.7'],
      'hiding-without-focus-management': ['2.4.3', '2.4.7'],
      'removal-without-focus-management': ['2.4.3', '2.4.7'], // Removing focused element loses visible focus (2.4.7) and changes focus order (2.4.3)
      'hiding-class-without-focus': ['2.4.7']
    };
    return mappings[issue.type] || ['2.4.3'];
  }

  /**
   * Map ARIA issues to WCAG criteria
   */
  mapAriaIssueToWCAG(issue) {
    const mappings = {
      'invalid-role': ['4.1.2'],
      'aria-hidden-interactive': ['4.1.2', '1.3.1'],
      'interactive-role-no-handler': ['2.1.1', '4.1.2'],
      'assertive-live-region': ['4.1.3'],
      'missing-required-attribute': ['4.1.2'],
      'dialog-without-label': ['4.1.2', '2.5.3']
    };
    return mappings[issue.type] || ['4.1.2'];
  }

  /**
   * Map keyboard issues to WCAG criteria
   */
  mapKeyboardIssueToWCAG(issue) {
    const mappings = {
      'mouse-only-click': ['2.1.1'],
      'potential-keyboard-trap': ['2.1.2'],
      'deprecated-keycode': ['4.1.2'],
      'tab-without-shift': ['2.1.1'],
      'screen-reader-conflict': ['2.1.4'],
      'screen-reader-arrow-conflict': ['2.1.4']
    };
    return mappings[issue.type] || ['2.1.1'];
  }

  /**
   * Map all issues to WCAG criteria
   */
  mapIssuesToWCAG(issues) {
    const compliance = {};

    // Initialize all criteria
    for (const [criterion, info] of Object.entries(this.wcagCriteria)) {
      compliance[criterion] = {
        ...info,
        status: 'pass',
        issues: []
      };
    }

    // Map issues to criteria
    for (const issue of issues) {
      for (const criterion of issue.wcag || []) {
        if (compliance[criterion]) {
          compliance[criterion].issues.push(issue);
          if (issue.severity === 'error') {
            compliance[criterion].status = 'fail';
          } else if (issue.severity === 'warning' && compliance[criterion].status !== 'fail') {
            compliance[criterion].status = 'warning';
          }
        }
      }
    }

    return compliance;
  }

  /**
   * Calculate accessibility scores
   */
  calculateScores(analyzerResults, widgetResults, issues) {
    const scores = {
      keyboard: this.calculateKeyboardScore(analyzerResults, issues),
      aria: this.calculateAriaScore(analyzerResults, issues),
      focus: this.calculateFocusScore(analyzerResults, issues),
      widgets: this.calculateWidgetScore(widgetResults),
      overall: 0
    };

    // Calculate overall score (weighted average)
    const weights = {
      keyboard: 0.30,
      aria: 0.25,
      focus: 0.25,
      widgets: 0.20
    };

    scores.overall = Math.round(
      scores.keyboard * weights.keyboard +
      scores.aria * weights.aria +
      scores.focus * weights.focus +
      scores.widgets * weights.widgets
    );

    return scores;
  }

  /**
   * Calculate keyboard accessibility score
   */
  calculateKeyboardScore(analyzerResults, issues) {
    let score = 100;
    const keyboard = analyzerResults.keyboard;

    if (!keyboard) return 50; // No analysis performed

    // Deductions for issues
    const keyboardIssues = issues.filter(i => i.category === 'keyboard');
    for (const issue of keyboardIssues) {
      if (issue.severity === 'error') score -= 15;
      else if (issue.severity === 'warning') score -= 8;
      else score -= 3;
    }

    // Bonus for good practices
    if (keyboard.navigationPatterns?.length > 0) score += 5;
    if (keyboard.keyChecks?.some(k => k.key === 'Escape')) score += 3;
    if (keyboard.keyChecks?.some(k => ['Enter', 'Space', ' '].includes(k.key))) score += 3;

    // Penalty for mouse-only elements
    if (keyboard.stats?.mouseOnlyElements > 0) {
      score -= keyboard.stats.mouseOnlyElements * 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate ARIA score
   */
  calculateAriaScore(analyzerResults, issues) {
    let score = 100;
    const aria = analyzerResults.aria;

    if (!aria) return 50;

    // Deductions for issues
    const ariaIssues = issues.filter(i => i.category === 'aria');
    for (const issue of ariaIssues) {
      if (issue.severity === 'error') score -= 15;
      else if (issue.severity === 'warning') score -= 8;
      else score -= 3;
    }

    // Bonus for good ARIA usage
    if (aria.ariaAttributes?.length > 0) score += 5;
    if (aria.roleChanges?.some(r => r.isValid)) score += 3;
    if (aria.labelPatterns?.length > 0) score += 5;
    if (aria.liveRegions?.length > 0) score += 3;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate focus management score
   */
  calculateFocusScore(analyzerResults, issues) {
    let score = 100;
    const focus = analyzerResults.focus;

    if (!focus) return 50;

    // Deductions for issues
    const focusIssues = issues.filter(i => i.category === 'focus');
    for (const issue of focusIssues) {
      if (issue.severity === 'error') score -= 15;
      else if (issue.severity === 'warning') score -= 8;
      else score -= 3;
    }

    // Bonus for focus management
    if (focus.focusCalls?.length > 0) score += 5;
    if (focus.focusPatterns?.some(p => p.type === 'keyboard-focus')) score += 5;
    if (focus.activeElementAccess?.length > 0) score += 3;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate widget compliance score
   */
  calculateWidgetScore(widgetResults) {
    if (!widgetResults || widgetResults.patterns.length === 0) return 100;

    const summary = widgetResults.summary;
    if (summary.totalChecks === 0) return 100;

    const passRate = summary.passed / summary.totalChecks;
    let score = Math.round(passRate * 100);

    // Penalty for failures
    score -= summary.failed * 5;
    score -= summary.warnings * 2;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate grade from score
   */
  calculateGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Determine WCAG conformance level
   */
  determineWCAGLevel(wcagMapping) {
    let levelA = true;
    let levelAA = true;

    for (const [criterion, info] of Object.entries(wcagMapping)) {
      if (info.status === 'fail') {
        if (info.level === 'A') levelA = false;
        if (info.level === 'AA') levelAA = false;
      }
    }

    if (!levelA) return 'None';
    if (!levelAA) return 'A';
    return 'AA';
  }

  /**
   * Group issues by category
   */
  groupIssuesByCategory(issues) {
    const grouped = {
      keyboard: [],
      aria: [],
      focus: [],
      widget: [],
      events: []
    };

    for (const issue of issues) {
      if (grouped[issue.category]) {
        grouped[issue.category].push(issue);
      }
    }

    return grouped;
  }

  /**
   * Group issues by severity
   */
  groupIssuesBySeverity(issues) {
    return {
      error: issues.filter(i => i.severity === 'error'),
      warning: issues.filter(i => i.severity === 'warning'),
      info: issues.filter(i => i.severity === 'info')
    };
  }

  /**
   * Generate prioritized recommendations
   */
  generateRecommendations(issues, analyzerResults) {
    const recommendations = [];

    // High priority: Errors
    const errors = issues.filter(i => i.severity === 'error');
    for (const error of errors.slice(0, 5)) {
      recommendations.push({
        priority: 'high',
        category: error.category,
        title: this.getRecommendationTitle(error),
        description: error.message,
        suggestion: error.suggestion || this.getDefaultSuggestion(error),
        wcag: error.wcag,
        impact: 'Critical - blocks accessibility'
      });
    }

    // Medium priority: Warnings
    const warnings = issues.filter(i => i.severity === 'warning');
    for (const warning of warnings.slice(0, 5)) {
      recommendations.push({
        priority: 'medium',
        category: warning.category,
        title: this.getRecommendationTitle(warning),
        description: warning.message,
        suggestion: warning.suggestion || this.getDefaultSuggestion(warning),
        wcag: warning.wcag,
        impact: 'Significant - degrades accessibility'
      });
    }

    // Add proactive recommendations based on analysis
    this.addProactiveRecommendations(recommendations, analyzerResults);

    return recommendations;
  }

  /**
   * Get recommendation title from issue
   */
  getRecommendationTitle(issue) {
    const titles = {
      'mouse-only-click': 'Add Keyboard Support',
      'potential-keyboard-trap': 'Fix Keyboard Trap',
      'screen-reader-conflict': 'Resolve Screen Reader Conflict',
      'invalid-role': 'Use Valid ARIA Role',
      'missing-required-attribute': 'Add Required ARIA Attribute',
      'focus-on-non-focusable': 'Fix Focus Target',
      'positive-tabindex': 'Remove Positive tabindex',
      'hiding-without-focus-management': 'Manage Focus on Hide'
    };
    return titles[issue.type] || 'Fix Accessibility Issue';
  }

  /**
   * Get default suggestion for issue type
   */
  getDefaultSuggestion(issue) {
    const suggestions = {
      keyboard: 'Ensure all interactive elements are keyboard accessible',
      aria: 'Follow WAI-ARIA specifications for proper attribute usage',
      focus: 'Manage focus appropriately when content changes',
      widget: 'Follow WAI-ARIA Authoring Practices for this widget pattern'
    };
    return suggestions[issue.category] || 'Review accessibility best practices';
  }

  /**
   * Add proactive recommendations based on analysis
   */
  addProactiveRecommendations(recommendations, analyzerResults) {
    // Recommend adding ARIA labels if none detected
    if (!analyzerResults.aria?.labelPatterns?.length) {
      recommendations.push({
        priority: 'low',
        category: 'aria',
        title: 'Add Accessible Labels',
        description: 'No ARIA labels detected in the code',
        suggestion: 'Consider adding aria-label or aria-labelledby to interactive elements',
        wcag: ['2.5.3', '4.1.2'],
        impact: 'Improves screen reader experience'
      });
    }

    // Recommend focus management for dialogs
    const hasDialog = analyzerResults.aria?.roleChanges?.some(r =>
      r.role === 'dialog' || r.role === 'alertdialog'
    );
    if (hasDialog && !analyzerResults.focus?.focusCalls?.length) {
      recommendations.push({
        priority: 'medium',
        category: 'focus',
        title: 'Add Dialog Focus Management',
        description: 'Dialog detected but no focus management code found',
        suggestion: 'Move focus to dialog on open, trap focus within, return focus on close',
        wcag: ['2.4.3', '2.1.2'],
        impact: 'Essential for dialog accessibility'
      });
    }

    // Recommend live regions for dynamic content
    if (analyzerResults.focus?.visibilityChanges?.length > 0 &&
        !analyzerResults.aria?.liveRegions?.length) {
      recommendations.push({
        priority: 'low',
        category: 'aria',
        title: 'Consider Live Regions',
        description: 'Dynamic content changes detected without live regions',
        suggestion: 'Use aria-live regions to announce dynamic content changes to screen readers',
        wcag: ['4.1.3'],
        impact: 'Improves dynamic content accessibility'
      });
    }
  }

  /**
   * Compile statistics from all analyzers
   */
  compileStatistics(analyzerResults, widgetResults) {
    return {
      events: {
        totalHandlers: analyzerResults.events?.stats?.totalHandlers || 0,
        keyboardHandlers: analyzerResults.events?.stats?.byEventType?.keydown || 0,
        clickHandlers: analyzerResults.events?.stats?.byEventType?.click || 0
      },
      focus: {
        focusCalls: analyzerResults.focus?.stats?.totalFocusCalls || 0,
        blurCalls: analyzerResults.focus?.stats?.totalBlurCalls || 0,
        tabIndexChanges: analyzerResults.focus?.stats?.tabIndexChanges || 0,
        visibilityChanges: analyzerResults.focus?.stats?.visibilityChanges || 0
      },
      aria: {
        ariaAttributes: analyzerResults.aria?.stats?.totalAriaChanges || 0,
        roleChanges: analyzerResults.aria?.stats?.roleChanges || 0,
        liveRegions: analyzerResults.aria?.liveRegions?.length || 0,
        widgetPatterns: analyzerResults.aria?.widgetPatterns?.length || 0
      },
      keyboard: {
        keyboardHandlers: analyzerResults.keyboard?.stats?.totalKeyboardHandlers || 0,
        mouseHandlers: analyzerResults.keyboard?.stats?.totalMouseHandlers || 0,
        keyChecks: analyzerResults.keyboard?.keyChecks?.length || 0,
        navigationPatterns: analyzerResults.keyboard?.navigationPatterns?.length || 0,
        screenReaderConflicts: analyzerResults.keyboard?.stats?.screenReaderConflicts || 0
      },
      widgets: {
        patternsDetected: widgetResults?.summary?.patternsDetected || 0,
        validationsPassed: widgetResults?.summary?.passed || 0,
        validationsFailed: widgetResults?.summary?.failed || 0
      }
    };
  }

  /**
   * Generate a text summary report
   */
  getSummary() {
    if (!this.results) return 'No analysis performed yet.';

    const r = this.results;
    const lines = [
      '╔══════════════════════════════════════════════════════════╗',
      '║           Accessibility Analysis Report                  ║',
      '╚══════════════════════════════════════════════════════════╝',
      '',
      `Analysis Date: ${r.timestamp}`,
      `Analysis Time: ${r.analysisTime}ms`,
      '',
      '┌─────────────────────────────────────────────────────────┐',
      '│  OVERALL SCORE                                          │',
      '└─────────────────────────────────────────────────────────┘',
      '',
      `  Grade: ${r.grade}  (${r.scores.overall}/100)`,
      `  WCAG 2.1 Level: ${r.getWCAGLevel()}`,
      '',
      '  Category Scores:',
      `    Keyboard:  ${this.renderScoreBar(r.scores.keyboard)}`,
      `    ARIA:      ${this.renderScoreBar(r.scores.aria)}`,
      `    Focus:     ${this.renderScoreBar(r.scores.focus)}`,
      `    Widgets:   ${this.renderScoreBar(r.scores.widgets)}`,
      ''
    ];

    // Issues summary
    lines.push('┌─────────────────────────────────────────────────────────┐');
    lines.push('│  ISSUES FOUND                                           │');
    lines.push('└─────────────────────────────────────────────────────────┘');
    lines.push('');

    const errorCount = r.getErrorCount();
    const warningCount = r.getWarningCount();
    const infoCount = r.issues.filter(i => i.severity === 'info').length;

    lines.push(`  Errors:   ${errorCount}`);
    lines.push(`  Warnings: ${warningCount}`);
    lines.push(`  Info:     ${infoCount}`);
    lines.push('');

    // List errors
    if (errorCount > 0) {
      lines.push('  Critical Issues:');
      for (const error of r.issuesBySeverity.error.slice(0, 5)) {
        lines.push(`    [!] ${error.message}`);
      }
      if (errorCount > 5) {
        lines.push(`    ... and ${errorCount - 5} more`);
      }
      lines.push('');
    }

    // Recommendations
    if (r.recommendations.length > 0) {
      lines.push('┌─────────────────────────────────────────────────────────┐');
      lines.push('│  TOP RECOMMENDATIONS                                    │');
      lines.push('└─────────────────────────────────────────────────────────┘');
      lines.push('');

      for (const rec of r.recommendations.slice(0, 5)) {
        const icon = rec.priority === 'high' ? '[!]' : rec.priority === 'medium' ? '[?]' : '[i]';
        lines.push(`  ${icon} ${rec.title}`);
        lines.push(`      ${rec.suggestion}`);
        lines.push('');
      }
    }

    // WCAG compliance
    lines.push('┌─────────────────────────────────────────────────────────┐');
    lines.push('│  WCAG 2.1 COMPLIANCE                                    │');
    lines.push('└─────────────────────────────────────────────────────────┘');
    lines.push('');

    const failedCriteria = Object.entries(r.wcagCompliance)
      .filter(([_, info]) => info.status === 'fail');

    if (failedCriteria.length === 0) {
      lines.push('  All tested criteria passed!');
    } else {
      lines.push('  Failed Criteria:');
      for (const [criterion, info] of failedCriteria) {
        lines.push(`    ${criterion} ${info.name} (Level ${info.level})`);
      }
    }
    lines.push('');

    // Statistics
    lines.push('┌─────────────────────────────────────────────────────────┐');
    lines.push('│  STATISTICS                                             │');
    lines.push('└─────────────────────────────────────────────────────────┘');
    lines.push('');
    lines.push(`  Event handlers: ${r.statistics.events.totalHandlers}`);
    lines.push(`  Keyboard handlers: ${r.statistics.keyboard.keyboardHandlers}`);
    lines.push(`  ARIA attributes: ${r.statistics.aria.ariaAttributes}`);
    lines.push(`  Focus operations: ${r.statistics.focus.focusCalls}`);
    lines.push(`  Widget patterns: ${r.statistics.widgets.patternsDetected}`);
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Render a score bar
   */
  renderScoreBar(score) {
    const filled = Math.round(score / 10);
    const empty = 10 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const label = score >= 80 ? 'Good' : score >= 60 ? 'Fair' : 'Needs Work';
    return `${bar} ${score}/100 (${label})`;
  }

  /**
   * Generate JSON report
   */
  getJSONReport() {
    return JSON.stringify(this.results, (key, value) => {
      // Exclude functions from JSON
      if (typeof value === 'function') return undefined;
      return value;
    }, 2);
  }

  /**
   * Generate HTML report
   */
  getHTMLReport() {
    if (!this.results) return '<p>No analysis performed yet.</p>';

    const r = this.results;
    const gradeColor = {
      'A': '#22c55e',
      'B': '#84cc16',
      'C': '#eab308',
      'D': '#f97316',
      'F': '#ef4444'
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Report</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; }
    .grade { font-size: 4rem; font-weight: bold; color: ${gradeColor[r.grade]}; }
    .score-bar { background: #e5e5e5; border-radius: 4px; height: 20px; overflow: hidden; }
    .score-fill { height: 100%; background: #3b82f6; transition: width 0.3s; }
    .issue { padding: 10px; margin: 5px 0; border-left: 4px solid; }
    .issue.error { border-color: #ef4444; background: #fef2f2; }
    .issue.warning { border-color: #f97316; background: #fff7ed; }
    .issue.info { border-color: #3b82f6; background: #eff6ff; }
    .section { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
    h1, h2, h3 { color: #1f2937; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #e5e5e5; }
  </style>
</head>
<body>
  <h1>Accessibility Analysis Report</h1>
  <p>Generated: ${r.timestamp}</p>

  <div class="section">
    <h2>Overall Score</h2>
    <div class="grade">${r.grade}</div>
    <p>${r.scores.overall}/100 - WCAG 2.1 Level ${r.getWCAGLevel()}</p>

    <h3>Category Scores</h3>
    <table>
      <tr><td>Keyboard</td><td><div class="score-bar"><div class="score-fill" style="width: ${r.scores.keyboard}%"></div></div></td><td>${r.scores.keyboard}/100</td></tr>
      <tr><td>ARIA</td><td><div class="score-bar"><div class="score-fill" style="width: ${r.scores.aria}%"></div></div></td><td>${r.scores.aria}/100</td></tr>
      <tr><td>Focus</td><td><div class="score-bar"><div class="score-fill" style="width: ${r.scores.focus}%"></div></div></td><td>${r.scores.focus}/100</td></tr>
      <tr><td>Widgets</td><td><div class="score-bar"><div class="score-fill" style="width: ${r.scores.widgets}%"></div></div></td><td>${r.scores.widgets}/100</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Issues (${r.issues.length})</h2>
    ${r.issues.map(i => `
      <div class="issue ${i.severity}">
        <strong>${i.severity.toUpperCase()}</strong>: ${i.message}
        ${i.suggestion ? `<br><em>Suggestion: ${i.suggestion}</em>` : ''}
        ${i.wcag ? `<br><small>WCAG: ${i.wcag.join(', ')}</small>` : ''}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Recommendations</h2>
    ${r.recommendations.map(rec => `
      <div class="issue ${rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'info'}">
        <strong>${rec.title}</strong>
        <p>${rec.suggestion}</p>
        <small>Impact: ${rec.impact}</small>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
  }

  /**
   * Get results (must call analyze first)
   */
  getResults() {
    return this.results;
  }
}

module.exports = AccessibilityReporter;
