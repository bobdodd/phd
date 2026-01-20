"use strict";
/**
 * Document Model - Integration Layer
 *
 * This is the central integration layer that merges all models together:
 * - DOMModel: HTML/JSX structure
 * - ActionLanguageModel: JavaScript behaviors
 * - CSSModel: Styling rules (future)
 *
 * The DocumentModel:
 * 1. Takes all three models as input
 * 2. Resolves element references via CSS selectors
 * 3. Attaches JavaScript handlers to DOM elements
 * 4. Attaches CSS rules to DOM elements
 * 5. Generates element context for accessibility analysis
 *
 * This enables cross-file analysis and eliminates false positives
 * when handlers are split across multiple files.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentModelBuilder = exports.DocumentModel = void 0;
/**
 * Document Model - Integration Layer
 *
 * Merges DOMModel, ActionLanguageModel, and CSSModel to enable
 * comprehensive accessibility analysis.
 *
 * UPDATED: Now supports multiple DOM fragments for confidence scoring.
 * - dom?: DOMModel[] (was dom?: DOMModel) - supports disconnected fragments
 * - Tracks tree completeness for confidence scoring
 * - Handles incomplete/sparse trees during development
 */
class DocumentModel {
    constructor(options) {
        this.scope = options.scope;
        // Normalize to array
        this.dom = options.dom
            ? Array.isArray(options.dom)
                ? options.dom
                : [options.dom]
            : undefined;
        this.javascript = options.javascript;
        this.css = options.css || [];
    }
    /**
     * Merge all models and resolve cross-references.
     * This is the key integration step that links JavaScript behaviors
     * and CSS rules to DOM elements via CSS selectors.
     *
     * UPDATED: Now iterates over all DOM fragments.
     */
    merge() {
        if (!this.dom || this.dom.length === 0)
            return;
        // Iterate over all DOM fragments
        for (const domFragment of this.dom) {
            // For each element in this fragment, find matching JavaScript handlers and CSS rules
            for (const element of domFragment.getAllElements()) {
                // Build selectors for this element
                const selectors = this.buildSelectors(element);
                // Find JavaScript handlers that reference this element
                element.jsHandlers = this.javascript
                    .flatMap((jsModel) => selectors.flatMap((selector) => jsModel.findBySelector(selector)));
                // Find CSS rules that apply to this element
                element.cssRules = this.css.flatMap((cssModel) => cssModel.getMatchingRules(element));
            }
        }
    }
    /**
     * Build CSS selectors for an element.
     * Returns all possible selectors that could match this element:
     * - ID selector (#submit)
     * - Class selectors (.btn, .primary)
     * - Tag selector (button)
     * - Role selector ([role="button"])
     */
    buildSelectors(element) {
        const selectors = [];
        // ID selector (highest priority)
        if (element.attributes.id) {
            selectors.push(`#${element.attributes.id}`);
        }
        // Class selectors
        if (element.attributes.class) {
            const classes = element.attributes.class.split(/\s+/).filter((c) => c);
            selectors.push(...classes.map((c) => `.${c}`));
        }
        // Tag selector
        selectors.push(element.tagName.toLowerCase());
        // Role selector
        if (element.attributes.role) {
            selectors.push(`[role="${element.attributes.role}"]`);
        }
        // ARIA attribute selectors
        for (const attr of Object.keys(element.attributes)) {
            if (attr.startsWith('aria-')) {
                selectors.push(`[${attr}]`);
            }
        }
        return selectors;
    }
    /**
     * Get element context for accessibility analysis.
     * Combines information from all models for a single element.
     */
    getElementContext(element) {
        const handlers = element.jsHandlers || [];
        // Check for click handlers
        const hasClickHandler = handlers.some((h) => h.actionType === 'eventHandler' && h.event === 'click');
        // Check for keyboard handlers (keydown, keypress, keyup)
        const keyboardEvents = ['keydown', 'keypress', 'keyup'];
        const hasKeyboardHandler = handlers.some((h) => h.actionType === 'eventHandler' &&
            h.event &&
            keyboardEvents.includes(h.event));
        // Determine if element is focusable
        const focusable = this.isFocusable(element);
        // Element is interactive if it has handlers or is focusable
        const interactive = handlers.length > 0 || focusable;
        // Get ARIA role (explicit or implicit)
        const role = this.getRole(element);
        // Get ARIA label (computed)
        const label = this.getLabel(element);
        return {
            element,
            jsHandlers: handlers,
            cssRules: element.cssRules || [],
            focusable,
            interactive,
            hasClickHandler,
            hasKeyboardHandler,
            role,
            label,
        };
    }
    /**
     * Check if an element is focusable.
     */
    isFocusable(element) {
        // Check explicit tabindex
        if (element.attributes.tabindex !== undefined) {
            const tabIndex = parseInt(element.attributes.tabindex);
            return !isNaN(tabIndex) && tabIndex >= 0;
        }
        // Naturally focusable elements
        const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
        const tagName = element.tagName.toLowerCase();
        // Check if it's a naturally focusable element
        if (focusableTags.includes(tagName)) {
            // Links must have href to be focusable
            if (tagName === 'a') {
                return !!element.attributes.href;
            }
            // Inputs/buttons/etc must not be disabled
            return element.attributes.disabled !== 'true';
        }
        return false;
    }
    /**
     * Get the ARIA role (explicit or implicit).
     */
    getRole(element) {
        // Explicit role
        if (element.attributes.role) {
            return element.attributes.role;
        }
        // Implicit roles based on tag name
        const implicitRoles = {
            button: 'button',
            a: 'link',
            input: 'textbox',
            textarea: 'textbox',
            select: 'combobox',
            img: 'img',
            nav: 'navigation',
            main: 'main',
            header: 'banner',
            footer: 'contentinfo',
            aside: 'complementary',
            section: 'region',
            article: 'article',
            form: 'form',
            table: 'table',
            ul: 'list',
            ol: 'list',
            li: 'listitem',
            h1: 'heading',
            h2: 'heading',
            h3: 'heading',
            h4: 'heading',
            h5: 'heading',
            h6: 'heading',
        };
        const tagName = element.tagName.toLowerCase();
        return implicitRoles[tagName] || null;
    }
    /**
     * Get the accessible label for an element.
     */
    getLabel(element) {
        // Check aria-label
        if (element.attributes['aria-label']) {
            return element.attributes['aria-label'];
        }
        // Check aria-labelledby
        if (element.attributes['aria-labelledby']) {
            // Would need to look up the referenced element
            // For now, just return a placeholder
            return `[labelledby: ${element.attributes['aria-labelledby']}]`;
        }
        // Check text content
        const textChildren = element.children.filter((child) => child.nodeType === 'text');
        if (textChildren.length > 0) {
            return textChildren
                .map((child) => child.textContent)
                .filter((t) => t)
                .join(' ')
                .trim();
        }
        // Check alt text for images
        if (element.tagName.toLowerCase() === 'img') {
            return element.attributes.alt || null;
        }
        // Check value for inputs
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'button') {
            return element.attributes.value || element.attributes.placeholder || null;
        }
        return null;
    }
    /**
     * Get all interactive elements in the document.
     * UPDATED: Works with multiple fragments.
     */
    getInteractiveElements() {
        if (!this.dom)
            return [];
        // Get all elements from all fragments
        const allElements = this.dom.flatMap((fragment) => fragment.getAllElements());
        return allElements
            .map((el) => this.getElementContext(el))
            .filter((ctx) => ctx.interactive);
    }
    /**
     * Get all elements with accessibility issues.
     * This is a convenience method for analyzers.
     */
    getElementsWithIssues() {
        if (!this.dom)
            return [];
        // Get all elements from all fragments
        const allElements = this.dom.flatMap((fragment) => fragment.getAllElements());
        return allElements
            .map((el) => this.getElementContext(el))
            .filter((ctx) => {
            // Has click handler but no keyboard handler
            if (ctx.hasClickHandler && !ctx.hasKeyboardHandler) {
                return true;
            }
            // Is focusable but has no accessible label
            if (ctx.focusable && !ctx.label) {
                const tagName = ctx.element.tagName.toLowerCase();
                // Exclude elements that don't need labels
                if (!['div', 'span', 'p'].includes(tagName)) {
                    return true;
                }
            }
            return false;
        });
    }
    /**
     * NEW: Get the number of DOM fragments.
     * Used for confidence scoring - more fragments means lower confidence.
     */
    getFragmentCount() {
        return this.dom?.length || 0;
    }
    /**
     * NEW: Calculate tree completeness score (0.0 to 1.0).
     *
     * Completeness heuristics:
     * - Single fragment: Higher completeness (0.7 base)
     * - Multiple fragments: Lower completeness (0.3 base)
     * - Resolved references: Increase completeness
     * - Unresolved references: Decrease completeness
     *
     * Returns:
     * - 1.0: Complete single tree with all references resolved
     * - 0.5-0.9: Partial tree or some fragments
     * - 0.0-0.5: Many disconnected fragments
     */
    getTreeCompleteness() {
        if (!this.dom || this.dom.length === 0) {
            return 0.0;
        }
        const fragmentCount = this.dom.length;
        // Base completeness depends on fragment count
        let completeness = fragmentCount === 1 ? 0.7 : Math.max(0.3, 1.0 - (fragmentCount * 0.1));
        // Count total elements and resolved/unresolved references
        let totalElements = 0;
        let resolvedReferences = 0;
        let unresolvedReferences = 0;
        for (const fragment of this.dom) {
            const elements = fragment.getAllElements();
            totalElements += elements.length;
            for (const element of elements) {
                // Check JavaScript handler references
                const handlers = element.jsHandlers || [];
                if (handlers.length > 0) {
                    resolvedReferences += handlers.length;
                }
                // Check ARIA references (aria-labelledby, aria-describedby, aria-controls)
                const ariaRefs = [
                    element.attributes['aria-labelledby'],
                    element.attributes['aria-describedby'],
                    element.attributes['aria-controls'],
                ].filter((ref) => ref);
                for (const refId of ariaRefs) {
                    // Check if referenced element exists in any fragment
                    const found = this.dom.some((frag) => frag.getElementById(refId) !== null);
                    if (found) {
                        resolvedReferences++;
                    }
                    else {
                        unresolvedReferences++;
                    }
                }
            }
        }
        // Adjust completeness based on reference resolution rate
        if (resolvedReferences + unresolvedReferences > 0) {
            const resolutionRate = resolvedReferences / (resolvedReferences + unresolvedReferences);
            // Boost completeness by resolution rate (max +0.3)
            completeness += resolutionRate * 0.3;
        }
        // Cap at 1.0
        return Math.min(1.0, completeness);
    }
    /**
     * Query element by ID across all fragments.
     * Convenience method for backward compatibility and easier testing.
     *
     * @param id - Element ID to search for
     * @returns First matching element or null
     */
    getElementById(id) {
        if (!this.dom)
            return null;
        for (const fragment of this.dom) {
            const element = fragment.getElementById(id);
            if (element)
                return element;
        }
        return null;
    }
    /**
     * Query first matching element by selector across all fragments.
     * Matches DOM API: returns single element or null.
     *
     * @param selector - CSS selector
     * @returns First matching element or null
     */
    querySelector(selector) {
        if (!this.dom)
            return null;
        for (const fragment of this.dom) {
            const element = fragment.querySelector(selector);
            if (element)
                return element;
        }
        return null;
    }
    /**
     * Query all matching elements by selector across all fragments.
     * Matches DOM API: returns array of all matching elements.
     *
     * @param selector - CSS selector
     * @returns Array of matching elements
     */
    querySelectorAll(selector) {
        if (!this.dom)
            return [];
        return this.dom.flatMap((fragment) => fragment.querySelectorAll(selector));
    }
    /**
     * Get all elements across all fragments.
     * Convenience method for analyzers.
     *
     * @returns Array of all elements
     */
    getAllElements() {
        if (!this.dom)
            return [];
        return this.dom.flatMap((fragment) => fragment.getAllElements());
    }
    /**
     * NEW: Check if a specific fragment is complete.
     * A fragment is considered complete if it has a clear root element
     * and all internal references resolve within the fragment.
     *
     * @param fragmentId - Index of the fragment to check
     * @returns true if fragment appears complete
     */
    isFragmentComplete(fragmentId) {
        if (!this.dom)
            return false;
        const index = parseInt(fragmentId);
        if (isNaN(index) || index < 0 || index >= this.dom.length) {
            return false;
        }
        const fragment = this.dom[index];
        const elements = fragment.getAllElements();
        // Check if all ARIA references resolve within this fragment
        for (const element of elements) {
            const ariaRefs = [
                element.attributes['aria-labelledby'],
                element.attributes['aria-describedby'],
                element.attributes['aria-controls'],
            ].filter((ref) => ref);
            for (const refId of ariaRefs) {
                if (!fragment.getElementById(refId)) {
                    return false; // Reference doesn't resolve within fragment
                }
            }
        }
        return true;
    }
}
exports.DocumentModel = DocumentModel;
/**
 * Document Model Builder
 *
 * Builds a DocumentModel from source code files.
 */
class DocumentModelBuilder {
    /**
     * Build a DocumentModel from source files.
     *
     * @param sources - Source code files
     * @param scope - Analysis scope
     * @returns DocumentModel with merged models
     *
     * @example
     * ```typescript
     * const sources = {
     *   html: '<button id="submit">Submit</button>',
     *   javascript: ['document.getElementById("submit").addEventListener("click", handler);'],
     *   css: [],
     *   sourceFiles: {
     *     html: 'index.html',
     *     javascript: ['handlers.js'],
     *     css: []
     *   }
     * };
     *
     * const builder = new DocumentModelBuilder();
     * const documentModel = builder.build(sources, 'page');
     *
     * // Now analyze for accessibility issues
     * const issues = documentModel.getElementsWithIssues();
     * ```
     */
    build(sources, scope) {
        // Import parsers (avoiding circular dependencies)
        const { extractJSXDOM } = require('../parsers/JSXDOMExtractor');
        const { extractSvelteDOM } = require('../parsers/SvelteDOMExtractor');
        const { parseHTML } = require('../parsers/HTMLParser');
        const { JavaScriptParser } = require('../parsers/JavaScriptParser');
        const { SvelteActionLanguageExtractor } = require('../parsers/SvelteActionLanguageExtractor');
        const { CSSParser } = require('../parsers/CSSParser');
        // Parse DOM (from HTML, JSX, or Svelte)
        let domModel;
        if (sources.html && sources.sourceFiles.html) {
            const sourceFile = sources.sourceFiles.html;
            // Detect file type
            const isJSX = sourceFile.endsWith('.jsx') || sourceFile.endsWith('.tsx');
            const isSvelte = sourceFile.endsWith('.svelte');
            if (isSvelte) {
                // Use Svelte DOM extractor for Svelte components
                domModel = extractSvelteDOM(sources.html, sourceFile);
            }
            else if (isJSX) {
                // Use JSX extractor for React components
                domModel = extractJSXDOM(sources.html, sourceFile);
            }
            else {
                // Use HTML parser for traditional HTML files
                domModel = parseHTML(sources.html, sourceFile);
            }
        }
        // Parse JavaScript files
        const jsParser = new JavaScriptParser();
        const jsModels = sources.javascript.map((js, i) => {
            const sourceFile = sources.sourceFiles.javascript[i];
            // Use Svelte parser for .svelte files
            if (sourceFile.endsWith('.svelte')) {
                const svelteParser = new SvelteActionLanguageExtractor();
                return svelteParser.parse(js, sourceFile);
            }
            // Use JavaScript parser for JS/TS/JSX/TSX files
            return jsParser.parse(js, sourceFile);
        });
        // If we have JSX/TSX source, also parse it for event handlers
        // This extracts inline event handlers like onClick={handler}
        if (sources.html && sources.sourceFiles.html &&
            (sources.sourceFiles.html.endsWith('.jsx') || sources.sourceFiles.html.endsWith('.tsx'))) {
            const jsxActionModel = jsParser.parse(sources.html, sources.sourceFiles.html);
            if (jsxActionModel.nodes.length > 0) {
                jsModels.push(jsxActionModel);
            }
        }
        // If we have Svelte source, also parse it for ActionLanguage nodes
        // This extracts Svelte directives like on:click, bind:value
        if (sources.html && sources.sourceFiles.html && sources.sourceFiles.html.endsWith('.svelte')) {
            const svelteParser = new SvelteActionLanguageExtractor();
            const svelteActionModel = svelteParser.parse(sources.html, sources.sourceFiles.html);
            if (svelteActionModel.nodes.length > 0) {
                jsModels.push(svelteActionModel);
            }
        }
        // Parse CSS files
        const cssParser = new CSSParser();
        const cssModels = sources.css.map((css, i) => cssParser.parse(css, sources.sourceFiles.css[i]));
        // Create document model
        const documentModel = new DocumentModel({
            scope,
            dom: domModel,
            javascript: jsModels,
            css: cssModels,
        });
        // Merge models to resolve cross-references
        documentModel.merge();
        return documentModel;
    }
}
exports.DocumentModelBuilder = DocumentModelBuilder;
//# sourceMappingURL=DocumentModel.js.map