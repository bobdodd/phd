import { Model, ModelNode, ValidationResult } from './BaseModel';
export interface DOMElement extends ModelNode {
    nodeType: 'element' | 'text' | 'comment';
    tagName: string;
    attributes: Record<string, string>;
    children: DOMElement[];
    parent?: DOMElement;
    textContent?: string;
    jsHandlers?: any[];
    cssRules?: any[];
    a11y?: {
        focusable: boolean;
        interactive: boolean;
        role: string | null;
        label: string | null;
        tabIndex: number | null;
    };
}
export interface DOMModel extends Model {
    type: 'DOM';
    root: DOMElement;
    getElementById(id: string): DOMElement | null;
    querySelector(selector: string): DOMElement | null;
    querySelectorAll(selector: string): DOMElement[];
    getAllElements(): DOMElement[];
    getFocusableElements(): DOMElement[];
    getInteractiveElements(): DOMElement[];
}
export declare class DOMModelImpl implements DOMModel {
    type: 'DOM';
    version: string;
    sourceFile: string;
    root: DOMElement;
    constructor(root: DOMElement, sourceFile: string);
    parse(_source: string): ModelNode[];
    validate(): ValidationResult;
    serialize(): string;
    private serializeElement;
    getElementById(id: string): DOMElement | null;
    querySelector(selector: string): DOMElement | null;
    querySelectorAll(selector: string): DOMElement[];
    getAllElements(): DOMElement[];
    getFocusableElements(): DOMElement[];
    getInteractiveElements(): DOMElement[];
    private matchesSelector;
    private isFocusable;
    private hasAccessibleLabel;
    private isValidAriaAttribute;
    private traverseElements;
    private findElement;
}
