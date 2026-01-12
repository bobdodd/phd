/**
 * Execution Module
 *
 * Exports stack architecture, execution context, and execution engine
 */

const {
  Stack,
  VariableStack,
  ConstantStack,
  FunctionStack,
  CallStack,
  ExecutionContext
} = require('./Stack');

const {
  ExecutionEngine,
  ReturnValue,
  BreakSignal,
  ContinueSignal,
  ThrowSignal
} = require('./ExecutionEngine');

module.exports = {
  Stack,
  VariableStack,
  ConstantStack,
  FunctionStack,
  CallStack,
  ExecutionContext,
  ExecutionEngine,
  ReturnValue,
  BreakSignal,
  ContinueSignal,
  ThrowSignal
};
