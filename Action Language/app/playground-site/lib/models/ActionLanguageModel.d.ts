import { Model, ModelNode, ValidationResult } from './BaseModel';
export interface ElementReference {
    selector: string;
    binding?: string;
    id?: string;
    resolvedElement?: any;
}
export type ActionType = 'eventHandler' | 'focusChange' | 'ariaStateChange' | 'domManipulation' | 'navigation' | 'portal' | 'eventPropagation';
export type TimingType = 'immediate' | 'delayed' | 'conditional' | 'deferred';
export interface ActionLanguageNode extends ModelNode {
    nodeType: 'action';
    actionType: ActionType;
    element: ElementReference;
    event?: string;
    handler?: any;
    timing?: TimingType;
    metadata: {
        framework?: string;
        synthetic?: boolean;
        method?: string;
        attribute?: string;
        value?: any;
        refBased?: boolean;
        [key: string]: any;
    };
}
export interface ActionLanguageModel extends Model {
    type: 'ActionLanguage';
    nodes: ActionLanguageNode[];
    findBySelector(selector: string): ActionLanguageNode[];
    findByElementBinding(binding: string): ActionLanguageNode[];
    findByActionType(actionType: ActionType): ActionLanguageNode[];
    findEventHandlers(event: string): ActionLanguageNode[];
    getAllEventHandlers(): ActionLanguageNode[];
    getAllFocusActions(): ActionLanguageNode[];
    getAllAriaActions(): ActionLanguageNode[];
}
export declare class ActionLanguageModelImpl implements ActionLanguageModel {
    type: 'ActionLanguage';
    version: string;
    sourceFile: string;
    nodes: ActionLanguageNode[];
    constructor(nodes: ActionLanguageNode[], sourceFile: string);
    parse(_source: string): ModelNode[];
    validate(): ValidationResult;
    serialize(): string;
    findBySelector(selector: string): ActionLanguageNode[];
    findByElementBinding(binding: string): ActionLanguageNode[];
    findByActionType(actionType: ActionType): ActionLanguageNode[];
    findEventHandlers(event: string): ActionLanguageNode[];
    getAllEventHandlers(): ActionLanguageNode[];
    getAllFocusActions(): ActionLanguageNode[];
    getAllAriaActions(): ActionLanguageNode[];
}
