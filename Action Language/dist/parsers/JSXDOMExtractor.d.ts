import { DOMModelImpl } from '../models/DOMModel';
export declare class JSXDOMExtractor {
    private elementCounter;
    extract(source: string, sourceFile: string): DOMModelImpl | null;
    private extractJSXElement;
    private convertJSXElement;
    private convertJSXFragment;
    private convertJSXChild;
    private getTagName;
    private getJSXMemberExpressionName;
    private extractAttributes;
    private getAttributeName;
    private getAttributeValue;
    private isReactComponent;
    private extractLocation;
    private generateId;
}
export declare function extractJSXDOM(source: string, sourceFile: string): DOMModelImpl | null;
