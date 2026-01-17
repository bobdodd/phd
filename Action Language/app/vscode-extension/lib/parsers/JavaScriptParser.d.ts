import { ActionLanguageModelImpl } from '../models/ActionLanguageModel';
export declare class JavaScriptParser {
    private nodeCounter;
    private variableBindings;
    parse(source: string, sourceFile: string): ActionLanguageModelImpl;
    private isAddEventListener;
    private isJSXEventHandler;
    private isSetAttribute;
    private isFocusChange;
    private extractEventHandler;
    private extractJSXEventHandler;
    private extractAriaUpdate;
    private extractFocusChange;
    private collectVariableBinding;
    private extractElementReference;
    private extractElementReferenceFromExpression;
    private getJSXTagName;
    private getJSXMemberExpressionName;
    private extractLocation;
    private generateId;
}
//# sourceMappingURL=JavaScriptParser.d.ts.map