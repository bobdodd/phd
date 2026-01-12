/**
 * ActionLanguage Transcoder - Main Module
 *
 * JavaScript to ActionLanguage tree transcoder for accessibility analysis
 */

const actionLanguage = require('./action-language');
const execution = require('./execution');

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
  ExecutionContext: execution.ExecutionContext
};
