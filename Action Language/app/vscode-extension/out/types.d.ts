/**
 * Type definitions for VS Code Extension
 */
import * as vscode from 'vscode';
import { DocumentModel, AnalysisScope as CoreAnalysisScope } from '../lib/models/DocumentModel';
import { ActionLanguageModel } from '../lib/models/ActionLanguageModel';
import { Issue } from '../lib/analyzers/BaseAnalyzer';
/**
 * Analysis scope configuration
 * Extension adds 'smart' mode which maps to core types at runtime
 */
export type AnalysisScope = CoreAnalysisScope | 'smart' | 'project';
/**
 * HTML page context - tracks a page and its linked resources
 */
export interface HTMLPageContext {
    htmlFile: vscode.Uri;
    linkedJS: vscode.Uri[];
    linkedCSS: vscode.Uri[];
    documentModel?: DocumentModel;
}
/**
 * File collection structure for workspace discovery
 */
export interface FileCollection {
    htmlFiles: vscode.Uri[];
    jsFiles: vscode.Uri[];
    cssFiles: vscode.Uri[];
}
/**
 * Cached model information
 */
export interface CachedModel {
    model: DocumentModel | ActionLanguageModel;
    mtime: number;
    type: 'DocumentModel' | 'ActionLanguage';
}
/**
 * Analysis result
 */
export interface AnalysisResult {
    issues: Issue[];
    documentModel?: DocumentModel;
    analysisScope: AnalysisScope;
    duration: number;
}
/**
 * Extension configuration
 */
export interface ExtensionConfig {
    enable: boolean;
    analysisMode: AnalysisScope;
    enableBackgroundAnalysis: boolean;
    includePatterns: string[];
    excludePatterns: string[];
    maxProjectFiles: number;
    diagnosticPlacement: 'both' | 'primary' | 'all';
    analyzeOnSave: boolean;
    analyzeOnType: boolean;
    analyzeOnTypeDelay: number;
    minSeverity: 'error' | 'warning' | 'info';
}
//# sourceMappingURL=types.d.ts.map