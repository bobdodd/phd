/**
 * Execution Module
 *
 * Exports stack architecture and execution context classes
 */

const {
  Stack,
  VariableStack,
  ConstantStack,
  FunctionStack,
  CallStack,
  ExecutionContext
} = require('./Stack');

module.exports = {
  Stack,
  VariableStack,
  ConstantStack,
  FunctionStack,
  CallStack,
  ExecutionContext
};
