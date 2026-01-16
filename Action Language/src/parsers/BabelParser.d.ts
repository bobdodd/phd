/**
 * Babel Parser Configuration for Paradise
 *
 * This module configures Babel to parse JavaScript, TypeScript, and JSX source files.
 * Babel is used instead of Acorn because it provides robust support for:
 * - JSX and TSX syntax (React components)
 * - TypeScript types and interfaces
 * - Modern JavaScript features (optional chaining, nullish coalescing, etc.)
 * - Decorators (Angular, NestJS)
 *
 * This configuration is used by the ActionLanguage parser to extract UI interaction
 * patterns from source code.
 */
import { ParserOptions } from '@babel/parser';
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
/**
 * Babel parser configuration for parsing JavaScript/TypeScript/JSX.
 *
 * Plugins enabled:
 * - jsx: React JSX support (<button>, <dialog>, etc.)
 * - typescript: TypeScript syntax and types
 * - decorators: Angular/NestJS decorators
 * - classProperties: Class field declarations
 * - objectRestSpread: Object spread/rest (...props)
 * - optionalChaining: Optional chaining operator (?.)
 * - nullishCoalescingOperator: Nullish coalescing operator (??)
 */
export declare const BABEL_CONFIG: ParserOptions;
/**
 * Parse JavaScript/TypeScript/JSX source code into a Babel AST.
 *
 * @param source - Source code to parse
 * @param filename - Optional filename for better error messages
 * @returns Babel File AST
 * @throws SyntaxError if source code cannot be parsed
 *
 * @example
 * ```typescript
 * const ast = parseSource(`
 *   function MyComponent() {
 *     return <button onClick={handleClick}>Click me</button>;
 *   }
 * `, 'MyComponent.tsx');
 * ```
 */
export declare function parseSource(source: string, filename?: string): t.File;
/**
 * Traverse a Babel AST with visitor functions.
 *
 * This is a re-export of @babel/traverse for convenience.
 *
 * @example
 * ```typescript
 * const ast = parseSource(source);
 * traverseAST(ast, {
 *   JSXElement(path) {
 *     console.log('Found JSX element:', path.node.openingElement.name);
 *   },
 *   CallExpression(path) {
 *     console.log('Found function call:', path.node.callee);
 *   }
 * });
 * ```
 */
export declare function traverseAST(ast: t.Node, visitors: any): void;
/**
 * Re-export Babel types for use in other modules.
 * This provides access to type guards, builders, and validators.
 */
export { t as types };
export type { NodePath };
//# sourceMappingURL=BabelParser.d.ts.map