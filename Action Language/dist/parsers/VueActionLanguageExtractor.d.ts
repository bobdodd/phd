import { ActionLanguageModelImpl } from '../models/ActionLanguageModel';
export declare class VueActionLanguageExtractor {
    private nodeCounter;
    parse(source: string, sourceFile: string): ActionLanguageModelImpl;
    private extractTemplate;
    private traverseElements;
    private extractEventType;
    private createEventHandlerNode;
    private createModelDirectiveNode;
    private createShowDirectiveNode;
    private createIfDirectiveNode;
    private createClassBindingNode;
    private getElementReference;
    private isElement;
    private extractLocation;
    private generateId;
}
export declare function parseVueActionLanguage(source: string, sourceFile: string): ActionLanguageModelImpl;
//# sourceMappingURL=VueActionLanguageExtractor.d.ts.map