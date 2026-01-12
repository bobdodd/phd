/**
 * Parser Module
 *
 * JavaScript parsing and ActionLanguage transformation
 */

const { JavaScriptParser, ParseError } = require('./JavaScriptParser');
const ASTTransformer = require('./ASTTransformer');

/**
 * Convenience function to parse JavaScript and transform to ActionLanguage
 * @param {string} source - JavaScript source code
 * @param {Object} [options] - Parser options
 * @returns {ActionTree}
 */
function parseAndTransform(source, options = {}) {
  const ast = JavaScriptParser.parse(source, options);
  const transformer = new ASTTransformer();
  return transformer.transform(ast);
}

module.exports = {
  JavaScriptParser,
  ParseError,
  ASTTransformer,
  parseAndTransform
};
