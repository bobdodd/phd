import { DOMModelImpl } from '../models/DOMModel';
export interface SvelteMetadata {
    isSvelteComponent?: boolean;
    directives?: {
        bind?: string[];
        on?: string[];
        use?: string[];
        transition?: string;
        animate?: string;
        class?: string[];
    };
    reactiveRefs?: string[];
    inConditional?: {
        type: 'if' | 'each' | 'await';
        condition?: string;
    };
}
export declare class SvelteDOMExtractor {
    private elementCounter;
    extract(source: string, sourceFile: string): DOMModelImpl | null;
    private extractTemplate;
    private findRootElement;
    private convertElement;
    private convertChild;
    private extractAttributes;
    private extractSvelteDirectives;
    private isSvelteDirective;
    private isSvelteComponent;
    private isElement;
    private isTextNode;
    private extractLocation;
    private generateId;
}
export declare function extractSvelteDOM(source: string, sourceFile: string): DOMModelImpl | null;
//# sourceMappingURL=SvelteDOMExtractor.d.ts.map