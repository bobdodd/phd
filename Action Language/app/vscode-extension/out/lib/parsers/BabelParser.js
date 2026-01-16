"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = exports.BABEL_CONFIG = void 0;
exports.parseSource = parseSource;
exports.traverseAST = traverseAST;
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
const t = __importStar(require("@babel/types"));
exports.types = t;
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
exports.BABEL_CONFIG = {
    sourceType: 'module',
    plugins: [
        'jsx', // React JSX support
        'typescript', // TypeScript support
        ['decorators', { decoratorsBeforeExport: true }], // Angular/NestJS decorators
        'classProperties', // Class field declarations
        'objectRestSpread', // Object spread/rest
        'optionalChaining', // Optional chaining (?.)
        'nullishCoalescingOperator', // Nullish coalescing (??)
    ],
    // Preserve location information for error reporting
    ranges: true,
    tokens: false,
};
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
function parseSource(source, filename) {
    try {
        return (0, parser_1.parse)(source, {
            ...exports.BABEL_CONFIG,
            sourceFilename: filename,
        });
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Failed to parse ${filename || 'source'}: ${error.message}`);
        }
        throw error;
    }
}
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
function traverseAST(ast, visitors) {
    (0, traverse_1.default)(ast, visitors);
}
//# sourceMappingURL=BabelParser.js.map