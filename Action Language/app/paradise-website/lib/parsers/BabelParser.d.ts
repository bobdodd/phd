import { ParserOptions } from '@babel/parser';
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export declare const BABEL_CONFIG: ParserOptions;
export declare function parseSource(source: string, filename?: string): t.File;
export declare function traverseAST(ast: t.Node, visitors: any): void;
export { t as types };
export type { NodePath };
//# sourceMappingURL=BabelParser.d.ts.map