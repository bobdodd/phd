import { DOMModelImpl } from '../models/DOMModel';
export interface VueMetadata {
    directives?: {
        on?: string[];
        model?: boolean;
        conditionals?: string[];
        show?: boolean;
        loop?: boolean;
        bindings?: string[];
    };
}
export declare class VueDOMExtractor {
    private elementCounter;
    extract(source: string, sourceFile: string): DOMModelImpl | null;
    private extractTemplate;
    private findFirstElement;
    private convertElement;
    private convertTextNode;
    private extractAttributes;
    private extractVueMetadata;
    private isElement;
    private isTextNode;
    private extractLocation;
    private generateId;
}
export declare function extractVueDOM(source: string, sourceFile: string): DOMModelImpl | null;
