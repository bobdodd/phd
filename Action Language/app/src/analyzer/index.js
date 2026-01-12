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

module.exports = {
  EventAnalyzer,
  FocusAnalyzer,
  ARIAAnalyzer,
  KeyboardAnalyzer,
  WidgetPatternValidator
};
