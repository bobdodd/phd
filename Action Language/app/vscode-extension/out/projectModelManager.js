"use strict";
/**
 * ProjectModelManager - Background system for project-wide analysis
 *
 * Maintains project-wide DocumentModels for all HTML pages in the workspace.
 * Runs in background without blocking the editor.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModelManager = void 0;
const vscode = __importStar(require("vscode"));
const DocumentModel_1 = require("../lib/models/DocumentModel");
class ProjectModelManager {
    constructor(outputChannel) {
        this.pages = new Map();
        this.standaloneJS = [];
        this.standaloneCSS = [];
        this.fileWatchers = [];
        this.parseCache = new Map();
        this.backgroundTaskRunning = false;
        this.updateQueue = new Set();
        this.onModelUpdatedCallbacks = [];
        this.outputChannel = outputChannel;
    }
    log(message) {
        if (this.outputChannel) {
            this.outputChannel.appendLine(message);
        }
    }
    /**
     * Initialize the project model manager for a workspace folder
     */
    async initialize(workspaceFolder) {
        this.log('[ProjectModelManager] Initializing for workspace: ' + workspaceFolder.name);
        // Start background analysis (non-blocking)
        this.startBackgroundAnalysis(workspaceFolder);
    }
    /**
     * Register callback for when a model is updated
     */
    onModelUpdated(callback) {
        this.onModelUpdatedCallbacks.push(callback);
    }
    /**
     * Get the DocumentModel for a specific file
     * Returns undefined if not yet available
     */
    getDocumentModel(document) {
        const pages = this.findPagesForFile(document.uri);
        return pages[0]?.documentModel;
    }
    /**
     * Start background analysis of the entire workspace
     */
    async startBackgroundAnalysis(workspaceFolder) {
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
        }
        catch (error) {
            this.log('[Background] ✗ Error during background analysis: ' + error.message);
            console.error('[ProjectModelManager] Error during background analysis:', error);
        }
        finally {
            this.backgroundTaskRunning = false;
        }
    }
    /**
     * Discover all relevant files in the workspace
     */
    async discoverAllFiles(workspaceFolder) {
        const config = vscode.workspace.getConfiguration('paradise');
        const includePatterns = config.get('includePatterns', [
            '**/*.html', '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', '**/*.css', '**/*.svelte'
        ]);
        const htmlFiles = [];
        const jsFiles = [];
        const cssFiles = [];
        for (const pattern of includePatterns) {
            const files = await vscode.workspace.findFiles(new vscode.RelativePattern(workspaceFolder, pattern), '**/node_modules/**');
            for (const file of files) {
                if (file.path.endsWith('.html')) {
                    htmlFiles.push(file);
                }
                else if (file.path.match(/\.(js|ts|jsx|tsx|svelte)$/)) {
                    jsFiles.push(file);
                }
                else if (file.path.endsWith('.css')) {
                    cssFiles.push(file);
                }
            }
        }
        return { htmlFiles, jsFiles, cssFiles };
    }
    /**
     * Detect HTML pages and their linked JS/CSS resources
     */
    async detectPageContexts(files) {
        // For each HTML file, detect which JS/CSS files it uses
        for (const htmlFile of files.htmlFiles) {
            const content = await this.readFile(htmlFile);
            if (content === null)
                continue; // Skip if HTML file doesn't exist
            const linkedJS = this.extractScriptLinks(content, htmlFile);
            const linkedCSS = this.extractStyleLinks(content, htmlFile);
            this.pages.set(htmlFile.fsPath, {
                htmlFile,
                linkedJS,
                linkedCSS
            });
        }
        // Track standalone JS/CSS (not linked to any HTML)
        this.standaloneJS = files.jsFiles.filter(js => !Array.from(this.pages.values()).some(page => page.linkedJS.some(linked => linked.fsPath === js.fsPath)));
        this.standaloneCSS = files.cssFiles.filter(css => !Array.from(this.pages.values()).some(page => page.linkedCSS.some(linked => linked.fsPath === css.fsPath)));
    }
    /**
     * Extract script links from HTML content
     */
    extractScriptLinks(htmlContent, htmlUri) {
        const scriptTags = htmlContent.match(/<script[^>]+src=["']([^"']+)["'][^>]*>/g) || [];
        const links = [];
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
                    }
                    catch (error) {
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
    extractStyleLinks(htmlContent, htmlUri) {
        const linkTags = htmlContent.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/g) || [];
        const links = [];
        const htmlDir = vscode.Uri.joinPath(htmlUri, '..');
        for (const tag of linkTags) {
            const hrefMatch = tag.match(/href=["']([^"']+)["']/);
            if (hrefMatch) {
                const href = hrefMatch[1];
                if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
                    try {
                        const resolvedUri = vscode.Uri.joinPath(htmlDir, href);
                        links.push(resolvedUri);
                    }
                    catch (error) {
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
    async buildPageModel(page) {
        try {
            // Read all sources for this page
            const htmlContent = await this.readFile(page.htmlFile);
            if (htmlContent === null) {
                // HTML file doesn't exist, skip
                return;
            }
            // Read JS files, skipping any that don't exist
            const jsContents = (await Promise.all(page.linkedJS.map(async (uri) => {
                const content = await this.readFile(uri);
                return content !== null ? { content, file: uri.fsPath } : null;
            }))).filter((item) => item !== null);
            // Read CSS files, skipping any that don't exist
            const cssContents = (await Promise.all(page.linkedCSS.map(async (uri) => {
                const content = await this.readFile(uri);
                return content !== null ? { content, file: uri.fsPath } : null;
            }))).filter((item) => item !== null);
            // Build DocumentModel using DocumentModelBuilder
            const builder = new DocumentModel_1.DocumentModelBuilder();
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
            page.documentModel = builder.build(sources, 'page');
            // Cache parsed models
            this.cachePageModels(page);
        }
        catch (error) {
            // Only log if it's not a missing file error
            if (error && error.code !== 'FileNotFound' && error.code !== 'ENOENT') {
                console.error(`[ProjectModelManager] Failed to build model for ${page.htmlFile.fsPath}:`, error);
            }
        }
    }
    /**
     * Cache parsed models for faster access
     */
    cachePageModels(page) {
        if (!page.documentModel)
            return;
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
    setupFileWatchers(workspaceFolder) {
        const config = vscode.workspace.getConfiguration('paradise');
        const patterns = config.get('includePatterns', []);
        for (const pattern of patterns) {
            const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(workspaceFolder, pattern));
            watcher.onDidChange(uri => this.onFileChanged(uri));
            watcher.onDidCreate(uri => this.onFileCreated(uri));
            watcher.onDidDelete(uri => this.onFileDeleted(uri));
            this.fileWatchers.push(watcher);
        }
    }
    /**
     * Handle file change event
     */
    async onFileChanged(uri) {
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
    async onFileCreated(uri) {
        // Re-discover files to pick up new file
        // For now, just treat as changed
        await this.onFileChanged(uri);
    }
    /**
     * Handle file deletion event
     */
    async onFileDeleted(uri) {
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
    findPagesForFile(uri) {
        const pages = [];
        for (const page of this.pages.values()) {
            if (page.htmlFile.fsPath === uri.fsPath) {
                pages.push(page);
            }
            else if (page.linkedJS.some(js => js.fsPath === uri.fsPath)) {
                pages.push(page);
            }
            else if (page.linkedCSS.some(css => css.fsPath === uri.fsPath)) {
                pages.push(page);
            }
        }
        return pages;
    }
    /**
     * Republish diagnostics for all files in a page
     */
    republishDiagnosticsForPage(page) {
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
    notifyModelUpdated(uri) {
        for (const callback of this.onModelUpdatedCallbacks) {
            try {
                callback(uri);
            }
            catch (error) {
                console.error('[ProjectModelManager] Error in onModelUpdated callback:', error);
            }
        }
    }
    /**
     * Process queued updates
     */
    async processUpdateQueue() {
        if (this.updateQueue.size === 0)
            return;
        for (const uri of this.updateQueue) {
            await this.onFileChanged(uri);
        }
        this.updateQueue.clear();
    }
    /**
     * Read file content, returns null if file doesn't exist
     */
    async readFile(uri) {
        try {
            const bytes = await vscode.workspace.fs.readFile(uri);
            return Buffer.from(bytes).toString('utf8');
        }
        catch (error) {
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
    dispose() {
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
exports.ProjectModelManager = ProjectModelManager;
//# sourceMappingURL=projectModelManager.js.map