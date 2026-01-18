import { ActionLanguageModelImpl } from '../models/ActionLanguageModel';
export declare class AngularActionLanguageExtractor {
    private nodeCounter;
    parse(source: string, sourceFile: string): ActionLanguageModelImpl;
    private extractTemplate;
    private traverseElements;
    private createEventBindingNode;
    private createTwoWayBindingNode;
    private createNgIfNode;
    private createHiddenBindingNode;
    private createClassBindingNode;
    private isVisibilityClass;
    private getElementReference;
    private isElement;
    private extractLocation;
    private generateId;
}
export declare function parseAngularActionLanguage(source: string, sourceFile: string): ActionLanguageModelImpl;
//# sourceMappingURL=AngularActionLanguageExtractor.d.ts.map