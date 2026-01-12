/**
 * ActionLanguage Transcoder - Main Module
 *
 * JavaScript to ActionLanguage tree transcoder for accessibility analysis
 */

const actionLanguage = require('./action-language');
const execution = require('./execution');
const parser = require('./parser');

module.exports = {
  // ActionLanguage core
  Action: actionLanguage.Action,
  ActionTree: actionLanguage.ActionTree,
  XMLSerializer: actionLanguage.XMLSerializer,

  // Execution
  Stack: execution.Stack,
  VariableStack: execution.VariableStack,
  ConstantStack: execution.ConstantStack,
  FunctionStack: execution.FunctionStack,
  CallStack: execution.CallStack,
  ExecutionContext: execution.ExecutionContext,
  ExecutionEngine: execution.ExecutionEngine,

  // Parser
  JavaScriptParser: parser.JavaScriptParser,
  ParseError: parser.ParseError,
  ASTTransformer: parser.ASTTransformer,
  parseAndTransform: parser.parseAndTransform
};
