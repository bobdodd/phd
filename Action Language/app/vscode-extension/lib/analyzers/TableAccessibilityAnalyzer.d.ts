import { BaseAnalyzer, Issue, AnalyzerContext } from './BaseAnalyzer';
export declare class TableAccessibilityAnalyzer extends BaseAnalyzer {
    readonly name = "TableAccessibilityAnalyzer";
    readonly description = "Detects accessibility issues with data tables and table structure";
    analyze(context: AnalyzerContext): Issue[];
    private findTableElements;
    private isDataTable;
    private checkDataTableAccessibility;
    private checkTableHeaders;
    private checkTableLabel;
    private checkScopeAttributes;
    private checkTableStructure;
    private checkComplexTableHeaders;
    private checkLayoutTable;
    private getDescendants;
    private getFirstRowCells;
}
