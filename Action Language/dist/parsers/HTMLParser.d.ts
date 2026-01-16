import { DOMModelImpl } from '../models/DOMModel';
export declare class HTMLParser {
    private elementCounter;
    private sourceFile;
    parse(source: string, sourceFile: string): DOMModelImpl;
    private convertNode;
    private convertElement;
    private convertTextNode;
    private convertCommentNode;
    private extractAttributes;
    private createLocation;
    private generateId;
}
export declare function parseHTML(source: string, sourceFile: string): DOMModelImpl;
//# sourceMappingURL=HTMLParser.d.ts.map