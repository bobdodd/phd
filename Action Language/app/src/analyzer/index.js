/**
 * Analyzer Module
 *
 * Semantic analysis tools for ActionLanguage trees
 */

const EventAnalyzer = require('./EventAnalyzer');
const FocusAnalyzer = require('./FocusAnalyzer');
const ARIAAnalyzer = require('./ARIAAnalyzer');
const KeyboardAnalyzer = require('./KeyboardAnalyzer');
const WidgetPatternValidator = require('./WidgetPatternValidator');
const AccessibilityReporter = require('./AccessibilityReporter');
const ContextChangeAnalyzer = require('./ContextChangeAnalyzer');
const TimingAnalyzer = require('./TimingAnalyzer');
const SemanticAnalyzer = require('./SemanticAnalyzer');

module.exports = {
  EventAnalyzer,
  FocusAnalyzer,
  ARIAAnalyzer,
  KeyboardAnalyzer,
  WidgetPatternValidator,
  AccessibilityReporter,
  ContextChangeAnalyzer,
  TimingAnalyzer,
  SemanticAnalyzer
};
