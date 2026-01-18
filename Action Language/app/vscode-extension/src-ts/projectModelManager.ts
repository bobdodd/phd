/**
 * ProjectModelManager - Background system for project-wide analysis
 *
 * Maintains project-wide DocumentModels for all HTML pages in the workspace.
 * Runs in background without blocking the editor.
 */

import * as vscode from 'vscode';
import { DocumentModel, AnalysisScope as CoreAnalysisScope } from '../lib/models/DocumentModel';
import { DocumentModelBuilder } from '../lib/models/DocumentModel';
import { HTMLPageContext, FileCollection, CachedModel, AnalysisScope } from './types';

export class ProjectModelManager {
  private pages: Map<string, HTMLPageContext> = new Map();
  private standaloneJS: vscode.Uri[] = [];
  private standaloneCSS: vscode.Uri[] = [];
  private fileWatchers: vscode.FileSystemWatcher[] = [];
  private parseCache: Map<string, CachedModel> = new Map();
  private backgroundTaskRunning: boolean = false;
  private updateQueue: Set<vscode.Uri> = new Set();
  private onModelUpdatedCallbacks: ((uri: vscode.Uri) => void)[] = [];
  private outputChannel?: vscode.OutputChannel;

  constructor(outputChannel?: vscode.OutputChannel) {
    this.outputChannel = outputChannel;
  }

  private log(message: string): void {
    if (this.outputChannel) {
      this.outputChannel.appendLine(message);
    }
  }

  /**
   * Initialize the project model manager for a workspace folder
   */
  async initialize(workspaceFolder: vscode.WorkspaceFolder): Promise<void> {
    this.log('[ProjectModelManager] Initializing for workspace: ' + workspaceFolder.name);
    // Start background analysis (non-blocking)
    this.startBackgroundAnalysis(workspaceFolder);
  }

  /**
   * Register callback for when a model is updated
   */
  onModelUpdated(callback: (uri: vscode.Uri) => void): void {
    this.onModelUpdatedCallbacks.push(callback);
  }

  /**
   * Get the DocumentModel for a specific file
   * Returns undefined if not yet available
   */
  getDocumentModel(document: vscode.TextDocument): DocumentModel | undefined {
    const pages = this.findPagesForFile(document.uri);
    return pages[0]?.documentModel;
  }

  /**
   * Start background analysis of the entire workspace
   */
  private async startBackgroundAnalysis(workspaceFolder: vscode.WorkspaceFolder): Promise<void> {
    this.backgroundTaskRunning = true;

    try {
      // Phase 1: Discover all files (fast)
      this.log('[Background] Phase 1: Discovering files...');
      const allFiles = await this.discoverAllFiles(workspaceFolder);
      this.log(`[Background] Found: ${allFiles.htmlFiles.length} HTML, ${allFiles.jsFiles.length} JS, ${allFiles.cssFiles.length} CSS files`);

      // Phase 2: Detect HTML pages and their linked resources
      this.log('[Background] Phase 2: Detecting page contexts...');
      await this.detectPageContexts(allFiles);
      this.log(`[Background] Detected ${this.pages.size} HTML pages`);

      // Phase 3: Parse files incrementally (yield between files)
      this.log('[Background] Phase 3: Building page models...');
      let pagesProcessed = 0;
      for (const page of this.pages.values()) {
        await this.buildPageModel(page);
        pagesProcessed++;

        // Yield to editor to stay responsive
        await new Promise(resolve => setImmediate(resolve));

        // Update diagnostics for files in this page
        this.republishDiagnosticsForPage(page);

        if (pagesProcessed % 10 === 0) {
          this.log(`[Background] Processed ${pagesProcessed}/${this.pages.size} pages`);
        }
      }

      // Phase 4: Set up file watchers
      this.log('[Background] Phase 4: Setting up file watchers...');
      this.setupFileWatchers(workspaceFolder);

      // Phase 5: Process any queued updates
      this.log('[Background] Phase 5: Processing queued updates...');
      await this.processUpdateQueue();

      this.log('[Background] ✓ Background analysis complete!');
    } catch (error) {
      this.log('[Background] ✗ Error during background analysis: ' + (error as Error).message);
      console.error('[ProjectModelManager] Error during background analysis:', error);
    } finally {
      this.backgroundTaskRunning = false;
    }
  }

  /**
   * Discover all relevant files in the workspace
   */
  private async discoverAllFiles(workspaceFolder: vscode.WorkspaceFolder): Promise<FileCollection> {
    const config = vscode.workspace.getConfiguration('paradise');
    const includePatterns = config.get<string[]>('includePatterns', [
      '**/*.html', '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', '**/*.css', '**/*.svelte'
    ]);

    const htmlFiles: vscode.Uri[] = [];
    const jsFiles: vscode.Uri[] = [];
    const cssFiles: vscode.Uri[] = [];

    for (const pattern of includePatterns) {
      const files = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, pattern),
        '**/node_modules/**'
      );

      for (const file of files) {
        if (file.path.endsWith('.html')) {
          htmlFiles.push(file);
        } else if (file.path.match(/\.(js|ts|jsx|tsx|svelte)$/)) {
          jsFiles.push(file);
        } else if (file.path.endsWith('.css')) {
          cssFiles.push(file);
        }
      }
    }

    return { htmlFiles, jsFiles, cssFiles };
  }

  /**
   * Detect HTML pages and their linked JS/CSS resources
   */
  private async detectPageContexts(files: FileCollection): Promise<void> {
    // For each HTML file, detect which JS/CSS files it uses
    for (const htmlFile of files.htmlFiles) {
      const content = await this.readFile(htmlFile);
      if (content === null) continue; // Skip if HTML file doesn't exist

      const linkedJS = this.extractScriptLinks(content, htmlFile);
      const linkedCSS = this.extractStyleLinks(content, htmlFile);

      this.pages.set(htmlFile.fsPath, {
        htmlFile,
        linkedJS,
        linkedCSS
      });
    }

    // Track standalone JS/CSS (not linked to any HTML)
    this.standaloneJS = files.jsFiles.filter(js =>
      !Array.from(this.pages.values()).some(page =>
        page.linkedJS.some(linked => linked.fsPath === js.fsPath)
      )
    );

    this.standaloneCSS = files.cssFiles.filter(css =>
      !Array.from(this.pages.values()).some(page =>
        page.linkedCSS.some(linked => linked.fsPath === css.fsPath)
      )
    );
  }

  /**
   * Extract script links from HTML content
   */
  private extractScriptLinks(htmlContent: string, htmlUri: vscode.Uri): vscode.Uri[] {
    const scriptTags = htmlContent.match(/<script[^>]+src=["']([^"']+)["'][^>]*>/g) || [];
    const links: vscode.Uri[] = [];
    const htmlDir = vscode.Uri.joinPath(htmlUri, '..');

    // External scripts
    for (const tag of scriptTags) {
      const srcMatch = tag.match(/src=["']([^"']+)["']/);
      if (srcMatch) {
        const src = srcMatch[1];
        // Skip external URLs, only resolve local files
        if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('//')) {
          try {
            const resolvedUri = vscode.Uri.joinPath(htmlDir, src);
            links.push(resolvedUri);
          } catch (error) {
            console.warn('[ProjectModelManager] Failed to resolve script:', src, error);
          }
        }
      }
    }

    return links;
  }

  /**
   * Extract style links from HTML content
   */
  private extractStyleLinks(htmlContent: string, htmlUri: vscode.Uri): vscode.Uri[] {
    const linkTags = htmlContent.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/g) || [];
    const links: vscode.Uri[] = [];
    const htmlDir = vscode.Uri.joinPath(htmlUri, '..');

    for (const tag of linkTags) {
      const hrefMatch = tag.match(/href=["']([^"']+)["']/);
      if (hrefMatch) {
        const href = hrefMatch[1];
        if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
          try {
            const resolvedUri = vscode.Uri.joinPath(htmlDir, href);
            links.push(resolvedUri);
          } catch (error) {
            console.warn('[ProjectModelManager] Failed to resolve stylesheet:', href, error);
          }
        }
      }
    }

    return links;
  }

  /**
   * Build DocumentModel for a page
   */
  private async buildPageModel(page: HTMLPageContext): Promise<void> {
    try {
      // Read all sources for this page
      const htmlContent = await this.readFile(page.htmlFile);
      if (htmlContent === null) {
        // HTML file doesn't exist, skip
        return;
      }

      // Read JS files, skipping any that don't exist
      const jsContents = (await Promise.all(
        page.linkedJS.map(async uri => {
          const content = await this.readFile(uri);
          return content !== null ? { content, file: uri.fsPath } : null;
        })
      )).filter((item): item is { content: string; file: string } => item !== null);

      // Read CSS files, skipping any that don't exist
      const cssContents = (await Promise.all(
        page.linkedCSS.map(async uri => {
          const content = await this.readFile(uri);
          return content !== null ? { content, file: uri.fsPath } : null;
        })
      )).filter((item): item is { content: string; file: string } => item !== null);

      // Build DocumentModel using DocumentModelBuilder
      const builder = new DocumentModelBuilder();
      const sources = {
        html: htmlContent,
        javascript: jsContents.map(js => js.content),
        css: cssContents.map(css => css.content),
        sourceFiles: {
          html: page.htmlFile.fsPath,
          javascript: jsContents.map(js => js.file),
          css: cssContents.map(css => css.file)
        }
      };

      page.documentModel = builder.build(sources, 'page' as CoreAnalysisScope);

      // Cache parsed models
      this.cachePageModels(page);
    } catch (error) {
      // Only log if it's not a missing file error
      if (error && (error as any).code !== 'FileNotFound' && (error as any).code !== 'ENOENT') {
        console.error(`[ProjectModelManager] Failed to build model for ${page.htmlFile.fsPath}:`, error);
      }
    }
  }

  /**
   * Cache parsed models for faster access
   */
  private cachePageModels(page: HTMLPageContext): void {
    if (!page.documentModel) return;

    // Cache the document model
    this.parseCache.set(page.htmlFile.fsPath, {
      model: page.documentModel,
      mtime: Date.now(),
      type: 'DocumentModel'
    });
  }

  /**
   * Setup file watchers for live updates
   */
  private setupFileWatchers(workspaceFolder: vscode.WorkspaceFolder): void {
    const config = vscode.workspace.getConfiguration('paradise');
    const patterns = config.get<string[]>('includePatterns', []);

    for (const pattern of patterns) {
      const watcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(workspaceFolder, pattern)
      );

      watcher.onDidChange(uri => this.onFileChanged(uri));
      watcher.onDidCreate(uri => this.onFileCreated(uri));
      watcher.onDidDelete(uri => this.onFileDeleted(uri));

      this.fileWatchers.push(watcher);
    }
  }

  /**
   * Handle file change event
   */
  private async onFileChanged(uri: vscode.Uri): Promise<void> {

    // Find which page(s) this file belongs to
    const affectedPages = this.findPagesForFile(uri);

    for (const page of affectedPages) {
      // Invalidate cache for this file
      this.parseCache.delete(uri.fsPath);

      // Rebuild page model
      await this.buildPageModel(page);

      // Notify listeners
      this.notifyModelUpdated(uri);

      // Update diagnostics for all files in this page
      this.republishDiagnosticsForPage(page);
    }

    // If file is standalone JS/CSS, handle separately
    if (affectedPages.length === 0) {
      this.updateQueue.add(uri);
      this.notifyModelUpdated(uri);
    }
  }

  /**
   * Handle file creation event
   */
  private async onFileCreated(uri: vscode.Uri): Promise<void> {
    // Re-discover files to pick up new file
    // For now, just treat as changed
    await this.onFileChanged(uri);
  }

  /**
   * Handle file deletion event
   */
  private async onFileDeleted(uri: vscode.Uri): Promise<void> {

    // Remove from cache
    this.parseCache.delete(uri.fsPath);

    // Find affected pages and rebuild
    const affectedPages = this.findPagesForFile(uri);
    for (const page of affectedPages) {
      await this.buildPageModel(page);
      this.republishDiagnosticsForPage(page);
    }

    // Notify listeners
    this.notifyModelUpdated(uri);
  }

  /**
   * Find all pages that include a specific file
   */
  private findPagesForFile(uri: vscode.Uri): HTMLPageContext[] {
    const pages: HTMLPageContext[] = [];

    for (const page of this.pages.values()) {
      if (page.htmlFile.fsPath === uri.fsPath) {
        pages.push(page);
      } else if (page.linkedJS.some(js => js.fsPath === uri.fsPath)) {
        pages.push(page);
      } else if (page.linkedCSS.some(css => css.fsPath === uri.fsPath)) {
        pages.push(page);
      }
    }

    return pages;
  }

  /**
   * Republish diagnostics for all files in a page
   */
  private republishDiagnosticsForPage(page: HTMLPageContext): void {
    const filesToUpdate = [
      page.htmlFile,
      ...page.linkedJS,
      ...page.linkedCSS
    ];

    for (const fileUri of filesToUpdate) {
      this.notifyModelUpdated(fileUri);
    }
  }

  /**
   * Notify listeners that a model was updated
   */
  private notifyModelUpdated(uri: vscode.Uri): void {
    for (const callback of this.onModelUpdatedCallbacks) {
      try {
        callback(uri);
      } catch (error) {
        console.error('[ProjectModelManager] Error in onModelUpdated callback:', error);
      }
    }
  }

  /**
   * Process queued updates
   */
  private async processUpdateQueue(): Promise<void> {
    if (this.updateQueue.size === 0) return;

    for (const uri of this.updateQueue) {
      await this.onFileChanged(uri);
    }

    this.updateQueue.clear();
  }

  /**
   * Read file content, returns null if file doesn't exist
   */
  private async readFile(uri: vscode.Uri): Promise<string | null> {
    try {
      const bytes = await vscode.workspace.fs.readFile(uri);
      return Buffer.from(bytes).toString('utf8');
    } catch (error: any) {
      // Silently skip missing files (they might be referenced but not exist)
      if (error.code === 'FileNotFound' || error.code === 'ENOENT') {
        return null;
      }
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Dispose of all resources
   */
  dispose(): void {

    for (const watcher of this.fileWatchers) {
      watcher.dispose();
    }

    this.fileWatchers = [];
    this.pages.clear();
    this.parseCache.clear();
    this.updateQueue.clear();
    this.onModelUpdatedCallbacks = [];
  }
}
