import { DOMModelImpl } from '../models/DOMModel';
export declare class HTMLParser {
    private elementCounter;
    private sourceFile;
    private sourceContent;
    private lineStarts;
    private tagLocationMap;
    parse(source: string, sourceFile: string): DOMModelImpl;
    private buildLineStarts;
    private buildTagLocationMap;
    private offsetToLineColumn;
    private convertNode;
    private findElementLocation;
    private convertElement;
    private convertTextNode;
    private convertCommentNode;
    private extractAttributes;
    private createLocation;
    private generateId;
}
export declare function parseHTML(source: string, sourceFile: string): DOMModelImpl;
//# sourceMappingURL=HTMLParser.d.ts.map