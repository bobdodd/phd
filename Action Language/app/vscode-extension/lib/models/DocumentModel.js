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
var DocumentModel = /** @class */ (function () {
    function DocumentModel(options) {
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
    DocumentModel.prototype.merge = function () {
        if (!this.dom || this.dom.length === 0)
            return;
        // Iterate over all DOM fragments
        for (var _i = 0, _a = this.dom; _i < _a.length; _i++) {
            var domFragment = _a[_i];
            var _loop_1 = function (element) {
                // Build selectors for this element
                var selectors = this_1.buildSelectors(element);
                // Find JavaScript handlers that reference this element
                element.jsHandlers = this_1.javascript
                    .flatMap(function (jsModel) {
                    return selectors.flatMap(function (selector) { return jsModel.findBySelector(selector); });
                });
                // Find CSS rules that apply to this element
                element.cssRules = this_1.css.flatMap(function (cssModel) {
                    return cssModel.getMatchingRules(element);
                });
            };
            var this_1 = this;
            // For each element in this fragment, find matching JavaScript handlers and CSS rules
            for (var _b = 0, _c = domFragment.getAllElements(); _b < _c.length; _b++) {
                var element = _c[_b];
                _loop_1(element);
            }
        }
    };
    /**
     * Build CSS selectors for an element.
     * Returns all possible selectors that could match this element:
     * - ID selector (#submit)
     * - Class selectors (.btn, .primary)
     * - Tag selector (button)
     * - Role selector ([role="button"])
     */
    DocumentModel.prototype.buildSelectors = function (element) {
        var selectors = [];
        // ID selector (highest priority)
        if (element.attributes.id) {
            selectors.push("#".concat(element.attributes.id));
        }
        // Class selectors
        if (element.attributes.class) {
            var classes = element.attributes.class.split(/\s+/).filter(function (c) { return c; });
            selectors.push.apply(selectors, classes.map(function (c) { return ".".concat(c); }));
        }
        // Tag selector
        selectors.push(element.tagName.toLowerCase());
        // Role selector
        if (element.attributes.role) {
            selectors.push("[role=\"".concat(element.attributes.role, "\"]"));
        }
        // ARIA attribute selectors
        for (var _i = 0, _a = Object.keys(element.attributes); _i < _a.length; _i++) {
            var attr = _a[_i];
            if (attr.startsWith('aria-')) {
                selectors.push("[".concat(attr, "]"));
            }
        }
        return selectors;
    };
    /**
     * Get element context for accessibility analysis.
     * Combines information from all models for a single element.
     */
    DocumentModel.prototype.getElementContext = function (element) {
        var handlers = element.jsHandlers || [];
        // Check for click handlers
        var hasClickHandler = handlers.some(function (h) { return h.actionType === 'eventHandler' && h.event === 'click'; });
        // Check for keyboard handlers (keydown, keypress, keyup)
        var keyboardEvents = ['keydown', 'keypress', 'keyup'];
        var hasKeyboardHandler = handlers.some(function (h) {
            return h.actionType === 'eventHandler' &&
                h.event &&
                keyboardEvents.includes(h.event);
        });
        // Determine if element is focusable
        var focusable = this.isFocusable(element);
        // Element is interactive if it has handlers or is focusable
        var interactive = handlers.length > 0 || focusable;
        // Get ARIA role (explicit or implicit)
        var role = this.getRole(element);
        // Get ARIA label (computed)
        var label = this.getLabel(element);
        return {
            element: element,
            jsHandlers: handlers,
            cssRules: element.cssRules || [],
            focusable: focusable,
            interactive: interactive,
            hasClickHandler: hasClickHandler,
            hasKeyboardHandler: hasKeyboardHandler,
            role: role,
            label: label,
        };
    };
    /**
     * Check if an element is focusable.
     */
    DocumentModel.prototype.isFocusable = function (element) {
        // Check explicit tabindex
        if (element.attributes.tabindex !== undefined) {
            var tabIndex = parseInt(element.attributes.tabindex);
            return !isNaN(tabIndex) && tabIndex >= 0;
        }
        // Naturally focusable elements
        var focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
        var tagName = element.tagName.toLowerCase();
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
    };
    /**
     * Get the ARIA role (explicit or implicit).
     */
    DocumentModel.prototype.getRole = function (element) {
        // Explicit role
        if (element.attributes.role) {
            return element.attributes.role;
        }
        // Implicit roles based on tag name
        var implicitRoles = {
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
        var tagName = element.tagName.toLowerCase();
        return implicitRoles[tagName] || null;
    };
    /**
     * Get the accessible label for an element.
     */
    DocumentModel.prototype.getLabel = function (element) {
        // Check aria-label
        if (element.attributes['aria-label']) {
            return element.attributes['aria-label'];
        }
        // Check aria-labelledby
        if (element.attributes['aria-labelledby']) {
            // Would need to look up the referenced element
            // For now, just return a placeholder
            return "[labelledby: ".concat(element.attributes['aria-labelledby'], "]");
        }
        // Check text content
        var textChildren = element.children.filter(function (child) { return child.nodeType === 'text'; });
        if (textChildren.length > 0) {
            return textChildren
                .map(function (child) { return child.textContent; })
                .filter(function (t) { return t; })
                .join(' ')
                .trim();
        }
        // Check alt text for images
        if (element.tagName.toLowerCase() === 'img') {
            return element.attributes.alt || null;
        }
        // Check value for inputs
        var tagName = element.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'button') {
            return element.attributes.value || element.attributes.placeholder || null;
        }
        return null;
    };
    /**
     * Get all interactive elements in the document.
     * UPDATED: Works with multiple fragments.
     */
    DocumentModel.prototype.getInteractiveElements = function () {
        var _this = this;
        if (!this.dom)
            return [];
        // Get all elements from all fragments
        var allElements = this.dom.flatMap(function (fragment) { return fragment.getAllElements(); });
        return allElements
            .map(function (el) { return _this.getElementContext(el); })
            .filter(function (ctx) { return ctx.interactive; });
    };
    /**
     * Get all elements with accessibility issues.
     * This is a convenience method for analyzers.
     */
    DocumentModel.prototype.getElementsWithIssues = function () {
        var _this = this;
        if (!this.dom)
            return [];
        // Get all elements from all fragments
        var allElements = this.dom.flatMap(function (fragment) { return fragment.getAllElements(); });
        return allElements
            .map(function (el) { return _this.getElementContext(el); })
            .filter(function (ctx) {
            // Has click handler but no keyboard handler
            if (ctx.hasClickHandler && !ctx.hasKeyboardHandler) {
                return true;
            }
            // Is focusable but has no accessible label
            if (ctx.focusable && !ctx.label) {
                var tagName = ctx.element.tagName.toLowerCase();
                // Exclude elements that don't need labels
                if (!['div', 'span', 'p'].includes(tagName)) {
                    return true;
                }
            }
            return false;
        });
    };
    /**
     * NEW: Get the number of DOM fragments.
     * Used for confidence scoring - more fragments means lower confidence.
     */
    DocumentModel.prototype.getFragmentCount = function () {
        var _a;
        return ((_a = this.dom) === null || _a === void 0 ? void 0 : _a.length) || 0;
    };
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
    DocumentModel.prototype.getTreeCompleteness = function () {
        if (!this.dom || this.dom.length === 0) {
            return 0.0;
        }
        var fragmentCount = this.dom.length;
        // Base completeness depends on fragment count
        var completeness = fragmentCount === 1 ? 0.7 : Math.max(0.3, 1.0 - (fragmentCount * 0.1));
        // Count total elements and resolved/unresolved references
        var totalElements = 0;
        var resolvedReferences = 0;
        var unresolvedReferences = 0;
        for (var _i = 0, _a = this.dom; _i < _a.length; _i++) {
            var fragment = _a[_i];
            var elements = fragment.getAllElements();
            totalElements += elements.length;
            for (var _b = 0, elements_1 = elements; _b < elements_1.length; _b++) {
                var element = elements_1[_b];
                // Check JavaScript handler references
                var handlers = element.jsHandlers || [];
                if (handlers.length > 0) {
                    resolvedReferences += handlers.length;
                }
                // Check ARIA references (aria-labelledby, aria-describedby, aria-controls)
                var ariaRefs = [
                    element.attributes['aria-labelledby'],
                    element.attributes['aria-describedby'],
                    element.attributes['aria-controls'],
                ].filter(function (ref) { return ref; });
                var _loop_2 = function (refId) {
                    // Check if referenced element exists in any fragment
                    var found = this_2.dom.some(function (frag) { return frag.getElementById(refId) !== null; });
                    if (found) {
                        resolvedReferences++;
                    }
                    else {
                        unresolvedReferences++;
                    }
                };
                var this_2 = this;
                for (var _c = 0, ariaRefs_1 = ariaRefs; _c < ariaRefs_1.length; _c++) {
                    var refId = ariaRefs_1[_c];
                    _loop_2(refId);
                }
            }
        }
        // Adjust completeness based on reference resolution rate
        if (resolvedReferences + unresolvedReferences > 0) {
            var resolutionRate = resolvedReferences / (resolvedReferences + unresolvedReferences);
            // Boost completeness by resolution rate (max +0.3)
            completeness += resolutionRate * 0.3;
        }
        // Cap at 1.0
        return Math.min(1.0, completeness);
    };
    /**
     * Query element by ID across all fragments.
     * Convenience method for backward compatibility and easier testing.
     *
     * @param id - Element ID to search for
     * @returns First matching element or null
     */
    DocumentModel.prototype.getElementById = function (id) {
        if (!this.dom)
            return null;
        for (var _i = 0, _a = this.dom; _i < _a.length; _i++) {
            var fragment = _a[_i];
            var element = fragment.getElementById(id);
            if (element)
                return element;
        }
        return null;
    };
    /**
     * Query first matching element by selector across all fragments.
     * Matches DOM API: returns single element or null.
     *
     * @param selector - CSS selector
     * @returns First matching element or null
     */
    DocumentModel.prototype.querySelector = function (selector) {
        if (!this.dom)
            return null;
        for (var _i = 0, _a = this.dom; _i < _a.length; _i++) {
            var fragment = _a[_i];
            var element = fragment.querySelector(selector);
            if (element)
                return element;
        }
        return null;
    };
    /**
     * Query all matching elements by selector across all fragments.
     * Matches DOM API: returns array of all matching elements.
     *
     * @param selector - CSS selector
     * @returns Array of matching elements
     */
    DocumentModel.prototype.querySelectorAll = function (selector) {
        if (!this.dom)
            return [];
        return this.dom.flatMap(function (fragment) { return fragment.querySelectorAll(selector); });
    };
    /**
     * Get all elements across all fragments.
     * Convenience method for analyzers.
     *
     * @returns Array of all elements
     */
    DocumentModel.prototype.getAllElements = function () {
        if (!this.dom)
            return [];
        return this.dom.flatMap(function (fragment) { return fragment.getAllElements(); });
    };
    /**
     * NEW: Check if a specific fragment is complete.
     * A fragment is considered complete if it has a clear root element
     * and all internal references resolve within the fragment.
     *
     * @param fragmentId - Index of the fragment to check
     * @returns true if fragment appears complete
     */
    DocumentModel.prototype.isFragmentComplete = function (fragmentId) {
        if (!this.dom)
            return false;
        var index = parseInt(fragmentId);
        if (isNaN(index) || index < 0 || index >= this.dom.length) {
            return false;
        }
        var fragment = this.dom[index];
        var elements = fragment.getAllElements();
        // Check if all ARIA references resolve within this fragment
        for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
            var element = elements_2[_i];
            var ariaRefs = [
                element.attributes['aria-labelledby'],
                element.attributes['aria-describedby'],
                element.attributes['aria-controls'],
            ].filter(function (ref) { return ref; });
            for (var _a = 0, ariaRefs_2 = ariaRefs; _a < ariaRefs_2.length; _a++) {
                var refId = ariaRefs_2[_a];
                if (!fragment.getElementById(refId)) {
                    return false; // Reference doesn't resolve within fragment
                }
            }
        }
        return true;
    };
    return DocumentModel;
}());
exports.DocumentModel = DocumentModel;
/**
 * Document Model Builder
 *
 * Builds a DocumentModel from source code files.
 */
var DocumentModelBuilder = /** @class */ (function () {
    function DocumentModelBuilder() {
    }
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
    DocumentModelBuilder.prototype.build = function (sources, scope) {
        // Import parsers (avoiding circular dependencies)
        var extractJSXDOM = require('../parsers/JSXDOMExtractor').extractJSXDOM;
        var parseHTML = require('../parsers/HTMLParser').parseHTML;
        var JavaScriptParser = require('../parsers/JavaScriptParser').JavaScriptParser;
        var CSSParser = require('../parsers/CSSParser').CSSParser;
        // Parse DOM (from HTML or JSX)
        var domModel;
        if (sources.html && sources.sourceFiles.html) {
            var sourceFile = sources.sourceFiles.html;
            // Detect if this is JSX/TSX or traditional HTML
            var isJSX = sourceFile.endsWith('.jsx') || sourceFile.endsWith('.tsx');
            if (isJSX) {
                // Use JSX extractor for React components
                domModel = extractJSXDOM(sources.html, sourceFile);
            }
            else {
                // Use HTML parser for traditional HTML files
                domModel = parseHTML(sources.html, sourceFile);
            }
        }
        // Parse JavaScript files
        var jsParser = new JavaScriptParser();
        var jsModels = sources.javascript.map(function (js, i) {
            return jsParser.parse(js, sources.sourceFiles.javascript[i]);
        });
        // If we have JSX/TSX source, also parse it for event handlers
        // This extracts inline event handlers like onClick={handler}
        if (sources.html && sources.sourceFiles.html &&
            (sources.sourceFiles.html.endsWith('.jsx') || sources.sourceFiles.html.endsWith('.tsx'))) {
            var jsxActionModel = jsParser.parse(sources.html, sources.sourceFiles.html);
            if (jsxActionModel.nodes.length > 0) {
                jsModels.push(jsxActionModel);
            }
        }
        // Parse CSS files
        var cssParser = new CSSParser();
        var cssModels = sources.css.map(function (css, i) {
            return cssParser.parse(css, sources.sourceFiles.css[i]);
        });
        // Create document model
        var documentModel = new DocumentModel({
            scope: scope,
            dom: domModel,
            javascript: jsModels,
            css: cssModels,
        });
        // Merge models to resolve cross-references
        documentModel.merge();
        return documentModel;
    };
    return DocumentModelBuilder;
}());
exports.DocumentModelBuilder = DocumentModelBuilder;
//# sourceMappingURL=DocumentModel.js.map