/**
 * JavaScriptParser - Wrapper around Babel parser for JavaScript/ES6 parsing
 *
 * Parses JavaScript source code into a Babel AST, which can then be
 * transformed into ActionLanguage trees.
 */

const babelParser = require('@babel/parser');

class JavaScriptParser {
  /**
   * Default parser options for ES6+ support
   */
  static get defaultOptions() {
    return {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'dynamicImport',
        'optionalChaining',
        'nullishCoalescingOperator',
        'objectRestSpread',
        'asyncGenerators',
        'decorators-legacy'
      ],
      errorRecovery: true,
      attachComment: true,
      ranges: true
    };
  }

  /**
   * Parse JavaScript source code
   * @param {string} source - The JavaScript source code
   * @param {Object} [options] - Parser options (merged with defaults)
   * @returns {Object} Babel AST
   */
  static parse(source, options = {}) {
    const mergedOptions = {
      ...JavaScriptParser.defaultOptions,
      ...options
    };

    try {
      return babelParser.parse(source, mergedOptions);
    } catch (error) {
      throw new ParseError(error.message, error.loc);
    }
  }

  /**
   * Parse a JavaScript expression (not a full program)
   * @param {string} expression - The expression to parse
   * @returns {Object} Babel AST expression node
   */
  static parseExpression(expression) {
    try {
      return babelParser.parseExpression(expression, {
        ...JavaScriptParser.defaultOptions
      });
    } catch (error) {
      throw new ParseError(error.message, error.loc);
    }
  }

  /**
   * Check if source code is valid JavaScript
   * @param {string} source - The source code to validate
   * @returns {{ valid: boolean, errors: Array }}
   */
  static validate(source) {
    try {
      const ast = babelParser.parse(source, {
        ...JavaScriptParser.defaultOptions,
        errorRecovery: true
      });

      // Check for recovered errors
      const errors = ast.errors || [];
      return {
        valid: errors.length === 0,
        errors: errors.map(e => ({
          message: e.message,
          line: e.loc?.line,
          column: e.loc?.column
        }))
      };
    } catch (error) {
      return {
        valid: false,
        errors: [{
          message: error.message,
          line: error.loc?.line,
          column: error.loc?.column
        }]
      };
    }
  }

  /**
   * Get all function declarations from source
   * @param {string} source - The source code
   * @returns {Array} Array of function info objects
   */
  static extractFunctions(source) {
    const ast = JavaScriptParser.parse(source);
    const functions = [];

    JavaScriptParser.walkAST(ast, (node) => {
      if (node.type === 'FunctionDeclaration') {
        functions.push({
          name: node.id?.name || '<anonymous>',
          params: node.params.map(p => JavaScriptParser.getParamName(p)),
          async: node.async,
          generator: node.generator,
          loc: node.loc
        });
      } else if (node.type === 'ArrowFunctionExpression' ||
                 node.type === 'FunctionExpression') {
        // These need parent context for names
        functions.push({
          name: '<anonymous>',
          params: node.params.map(p => JavaScriptParser.getParamName(p)),
          async: node.async,
          generator: node.generator,
          loc: node.loc
        });
      }
    });

    return functions;
  }

  /**
   * Extract parameter name from various param types
   * @private
   */
  static getParamName(param) {
    switch (param.type) {
      case 'Identifier':
        return param.name;
      case 'AssignmentPattern':
        return JavaScriptParser.getParamName(param.left);
      case 'RestElement':
        return '...' + JavaScriptParser.getParamName(param.argument);
      case 'ObjectPattern':
        return '{...}';
      case 'ArrayPattern':
        return '[...]';
      default:
        return '?';
    }
  }

  /**
   * Walk the AST calling visitor for each node
   * @param {Object} node - The AST node to walk
   * @param {Function} visitor - Function(node, parent) called for each node
   * @param {Object} [parent] - Parent node (used internally)
   */
  static walkAST(node, visitor, parent = null) {
    if (!node || typeof node !== 'object') return;

    visitor(node, parent);

    for (const key of Object.keys(node)) {
      const child = node[key];

      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object' && item.type) {
            JavaScriptParser.walkAST(item, visitor, node);
          }
        }
      } else if (child && typeof child === 'object' && child.type) {
        JavaScriptParser.walkAST(child, visitor, node);
      }
    }
  }

  /**
   * Get a readable description of an AST node type
   * @param {string} nodeType - The Babel AST node type
   * @returns {string}
   */
  static describeNodeType(nodeType) {
    const descriptions = {
      'Program': 'Program',
      'VariableDeclaration': 'Variable Declaration',
      'VariableDeclarator': 'Variable Declarator',
      'FunctionDeclaration': 'Function Declaration',
      'FunctionExpression': 'Function Expression',
      'ArrowFunctionExpression': 'Arrow Function',
      'ClassDeclaration': 'Class Declaration',
      'ClassExpression': 'Class Expression',
      'MethodDefinition': 'Method Definition',
      'IfStatement': 'If Statement',
      'ForStatement': 'For Loop',
      'ForInStatement': 'For-In Loop',
      'ForOfStatement': 'For-Of Loop',
      'WhileStatement': 'While Loop',
      'DoWhileStatement': 'Do-While Loop',
      'SwitchStatement': 'Switch Statement',
      'TryStatement': 'Try Statement',
      'ThrowStatement': 'Throw Statement',
      'ReturnStatement': 'Return Statement',
      'BreakStatement': 'Break Statement',
      'ContinueStatement': 'Continue Statement',
      'BlockStatement': 'Block',
      'ExpressionStatement': 'Expression Statement',
      'CallExpression': 'Function Call',
      'NewExpression': 'New Expression',
      'MemberExpression': 'Member Access',
      'AssignmentExpression': 'Assignment',
      'BinaryExpression': 'Binary Operation',
      'UnaryExpression': 'Unary Operation',
      'LogicalExpression': 'Logical Operation',
      'ConditionalExpression': 'Ternary Conditional',
      'Identifier': 'Identifier',
      'Literal': 'Literal',
      'StringLiteral': 'String Literal',
      'NumericLiteral': 'Numeric Literal',
      'BooleanLiteral': 'Boolean Literal',
      'NullLiteral': 'Null Literal',
      'ArrayExpression': 'Array',
      'ObjectExpression': 'Object',
      'Property': 'Property',
      'SpreadElement': 'Spread',
      'TemplateLiteral': 'Template String',
      'TaggedTemplateExpression': 'Tagged Template',
      'AwaitExpression': 'Await Expression',
      'YieldExpression': 'Yield Expression',
      'ImportDeclaration': 'Import',
      'ExportNamedDeclaration': 'Named Export',
      'ExportDefaultDeclaration': 'Default Export'
    };

    return descriptions[nodeType] || nodeType;
  }
}

/**
 * Custom parse error with location info
 */
class ParseError extends Error {
  constructor(message, loc) {
    super(message);
    this.name = 'ParseError';
    this.loc = loc;
  }
}

module.exports = {
  JavaScriptParser,
  ParseError
};
