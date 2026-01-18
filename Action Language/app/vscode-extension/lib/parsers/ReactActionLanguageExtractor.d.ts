import { ActionLanguageModelImpl } from '../models/ActionLanguageModel';
export declare class ReactActionLanguageExtractor {
    private nodeCounter;
    parse(source: string, sourceFile: string): ActionLanguageModelImpl;
    private extractJSXEventHandlers;
    private extractFocusManagement;
    private extractPortals;
    private extractEventPropagation;
    private checkEventPropagationInFunction;
    private getJSXElementName;
    private extractLocation;
    private generateId;
}
export declare function extractReactActionLanguage(source: string, sourceFile: string): ActionLanguageModelImpl;
