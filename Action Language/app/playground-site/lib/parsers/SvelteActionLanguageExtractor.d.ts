import { ActionLanguageModelImpl } from '../models/ActionLanguageModel';
export declare class SvelteActionLanguageExtractor {
    private nodeCounter;
    parse(source: string, sourceFile: string): ActionLanguageModelImpl;
    private extractScript;
    private extractTemplate;
    private traverseElements;
    private createEventHandlerNode;
    private createBindDirectiveNode;
    private createClassDirectiveNode;
    private getElementReference;
    private isVisibilityClass;
    private isElement;
    private extractLocation;
    private generateId;
}
export declare function parseSvelteActionLanguage(source: string, sourceFile: string): ActionLanguageModelImpl;
