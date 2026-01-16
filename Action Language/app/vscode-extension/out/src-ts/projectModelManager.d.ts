/**
 * ProjectModelManager - Background system for project-wide analysis
 *
 * Maintains project-wide DocumentModels for all HTML pages in the workspace.
 * Runs in background without blocking the editor.
 */
import * as vscode from 'vscode';
import { DocumentModel } from '../lib/models/DocumentModel';
export declare class ProjectModelManager {
    private pages;
    private standaloneJS;
    private standaloneCSS;
    private fileWatchers;
    private parseCache;
    private backgroundTaskRunning;
    private updateQueue;
    private onModelUpdatedCallbacks;
    private outputChannel?;
    constructor(outputChannel?: vscode.OutputChannel);
    private log;
    /**
     * Initialize the project model manager for a workspace folder
     */
    initialize(workspaceFolder: vscode.WorkspaceFolder): Promise<void>;
    /**
     * Register callback for when a model is updated
     */
    onModelUpdated(callback: (uri: vscode.Uri) => void): void;
    /**
     * Get the DocumentModel for a specific file
     * Returns undefined if not yet available
     */
    getDocumentModel(document: vscode.TextDocument): DocumentModel | undefined;
    /**
     * Start background analysis of the entire workspace
     */
    private startBackgroundAnalysis;
    /**
     * Discover all relevant files in the workspace
     */
    private discoverAllFiles;
    /**
     * Detect HTML pages and their linked JS/CSS resources
     */
    private detectPageContexts;
    /**
     * Extract script links from HTML content
     */
    private extractScriptLinks;
    /**
     * Extract style links from HTML content
     */
    private extractStyleLinks;
    /**
     * Build DocumentModel for a page
     */
    private buildPageModel;
    /**
     * Cache parsed models for faster access
     */
    private cachePageModels;
    /**
     * Setup file watchers for live updates
     */
    private setupFileWatchers;
    /**
     * Handle file change event
     */
    private onFileChanged;
    /**
     * Handle file creation event
     */
    private onFileCreated;
    /**
     * Handle file deletion event
     */
    private onFileDeleted;
    /**
     * Find all pages that include a specific file
     */
    private findPagesForFile;
    /**
     * Republish diagnostics for all files in a page
     */
    private republishDiagnosticsForPage;
    /**
     * Notify listeners that a model was updated
     */
    private notifyModelUpdated;
    /**
     * Process queued updates
     */
    private processUpdateQueue;
    /**
     * Read file content
     */
    private readFile;
    /**
     * Dispose of all resources
     */
    dispose(): void;
}
//# sourceMappingURL=projectModelManager.d.ts.map