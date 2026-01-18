import { DOMModelImpl } from '../models/DOMModel';
export interface AngularMetadata {
    bindings?: {
        events?: string[];
        properties?: string[];
        twoWay?: string[];
        structural?: string[];
        classes?: string[];
    };
}
export declare class AngularDOMExtractor {
    private elementCounter;
    extract(source: string, sourceFile: string): DOMModelImpl | null;
    private extractTemplate;
    private findFirstElement;
    private convertElement;
    private convertTextNode;
    private extractAttributes;
    private extractAngularMetadata;
    private isElement;
    private isTextNode;
    private extractLocation;
    private generateId;
}
export declare function extractAngularDOM(source: string, sourceFile: string): DOMModelImpl | null;
