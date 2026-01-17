"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentModelBuilder = exports.DocumentModel = void 0;
class DocumentModel {
    constructor(options) {
        this.scope = options.scope;
        this.dom = options.dom
            ? Array.isArray(options.dom)
                ? options.dom
                : [options.dom]
            : undefined;
        this.javascript = options.javascript;
        this.css = options.css || [];
    }
    merge() {
        if (!this.dom || this.dom.length === 0)
            return;
        for (const domFragment of this.dom) {
            for (const element of domFragment.getAllElements()) {
                const selectors = this.buildSelectors(element);
                element.jsHandlers = this.javascript
                    .flatMap((jsModel) => selectors.flatMap((selector) => jsModel.findBySelector(selector)));
                element.cssRules = this.css.flatMap((cssModel) => cssModel.getMatchingRules(element));
            }
        }
    }
    buildSelectors(element) {
        const selectors = [];
        if (element.attributes.id) {
            selectors.push(`#${element.attributes.id}`);
        }
        if (element.attributes.class) {
            const classes = element.attributes.class.split(/\s+/).filter((c) => c);
            selectors.push(...classes.map((c) => `.${c}`));
        }
        selectors.push(element.tagName.toLowerCase());
        if (element.attributes.role) {
            selectors.push(`[role="${element.attributes.role}"]`);
        }
        for (const attr of Object.keys(element.attributes)) {
            if (attr.startsWith('aria-')) {
                selectors.push(`[${attr}]`);
            }
        }
        return selectors;
    }
    getElementContext(element) {
        const handlers = element.jsHandlers || [];
        const hasClickHandler = handlers.some((h) => h.actionType === 'eventHandler' && h.event === 'click');
        const keyboardEvents = ['keydown', 'keypress', 'keyup'];
        const hasKeyboardHandler = handlers.some((h) => h.actionType === 'eventHandler' &&
            h.event &&
            keyboardEvents.includes(h.event));
        const focusable = this.isFocusable(element);
        const interactive = handlers.length > 0 || focusable;
        const role = this.getRole(element);
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
    isFocusable(element) {
        if (element.attributes.tabindex !== undefined) {
            const tabIndex = parseInt(element.attributes.tabindex);
            return !isNaN(tabIndex) && tabIndex >= 0;
        }
        const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
        const tagName = element.tagName.toLowerCase();
        if (focusableTags.includes(tagName)) {
            if (tagName === 'a') {
                return !!element.attributes.href;
            }
            return element.attributes.disabled !== 'true';
        }
        return false;
    }
    getRole(element) {
        if (element.attributes.role) {
            return element.attributes.role;
        }
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
    getLabel(element) {
        if (element.attributes['aria-label']) {
            return element.attributes['aria-label'];
        }
        if (element.attributes['aria-labelledby']) {
            return `[labelledby: ${element.attributes['aria-labelledby']}]`;
        }
        const textChildren = element.children.filter((child) => child.nodeType === 'text');
        if (textChildren.length > 0) {
            return textChildren
                .map((child) => child.textContent)
                .filter((t) => t)
                .join(' ')
                .trim();
        }
        if (element.tagName.toLowerCase() === 'img') {
            return element.attributes.alt || null;
        }
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'button') {
            return element.attributes.value || element.attributes.placeholder || null;
        }
        return null;
    }
    getInteractiveElements() {
        if (!this.dom)
            return [];
        const allElements = this.dom.flatMap((fragment) => fragment.getAllElements());
        return allElements
            .map((el) => this.getElementContext(el))
            .filter((ctx) => ctx.interactive);
    }
    getElementsWithIssues() {
        if (!this.dom)
            return [];
        const allElements = this.dom.flatMap((fragment) => fragment.getAllElements());
        return allElements
            .map((el) => this.getElementContext(el))
            .filter((ctx) => {
            if (ctx.hasClickHandler && !ctx.hasKeyboardHandler) {
                return true;
            }
            if (ctx.focusable && !ctx.label) {
                const tagName = ctx.element.tagName.toLowerCase();
                if (!['div', 'span', 'p'].includes(tagName)) {
                    return true;
                }
            }
            return false;
        });
    }
    getFragmentCount() {
        return this.dom?.length || 0;
    }
    getTreeCompleteness() {
        if (!this.dom || this.dom.length === 0) {
            return 0.0;
        }
        const fragmentCount = this.dom.length;
        let completeness = fragmentCount === 1 ? 0.7 : Math.max(0.3, 1.0 - (fragmentCount * 0.1));
        let totalElements = 0;
        let resolvedReferences = 0;
        let unresolvedReferences = 0;
        for (const fragment of this.dom) {
            const elements = fragment.getAllElements();
            totalElements += elements.length;
            for (const element of elements) {
                const handlers = element.jsHandlers || [];
                if (handlers.length > 0) {
                    resolvedReferences += handlers.length;
                }
                const ariaRefs = [
                    element.attributes['aria-labelledby'],
                    element.attributes['aria-describedby'],
                    element.attributes['aria-controls'],
                ].filter((ref) => ref);
                for (const refId of ariaRefs) {
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
        if (resolvedReferences + unresolvedReferences > 0) {
            const resolutionRate = resolvedReferences / (resolvedReferences + unresolvedReferences);
            completeness += resolutionRate * 0.3;
        }
        return Math.min(1.0, completeness);
    }
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
    querySelectorAll(selector) {
        if (!this.dom)
            return [];
        return this.dom.flatMap((fragment) => fragment.querySelectorAll(selector));
    }
    getAllElements() {
        if (!this.dom)
            return [];
        return this.dom.flatMap((fragment) => fragment.getAllElements());
    }
    isFragmentComplete(fragmentId) {
        if (!this.dom)
            return false;
        const index = parseInt(fragmentId);
        if (isNaN(index) || index < 0 || index >= this.dom.length) {
            return false;
        }
        const fragment = this.dom[index];
        const elements = fragment.getAllElements();
        for (const element of elements) {
            const ariaRefs = [
                element.attributes['aria-labelledby'],
                element.attributes['aria-describedby'],
                element.attributes['aria-controls'],
            ].filter((ref) => ref);
            for (const refId of ariaRefs) {
                if (!fragment.getElementById(refId)) {
                    return false;
                }
            }
        }
        return true;
    }
}
exports.DocumentModel = DocumentModel;
class DocumentModelBuilder {
    build(sources, scope) {
        const { extractJSXDOM } = require('../parsers/JSXDOMExtractor');
        const { parseHTML } = require('../parsers/HTMLParser');
        const { JavaScriptParser } = require('../parsers/JavaScriptParser');
        const { CSSParser } = require('../parsers/CSSParser');
        let domModel;
        if (sources.html && sources.sourceFiles.html) {
            const sourceFile = sources.sourceFiles.html;
            const isJSX = sourceFile.endsWith('.jsx') || sourceFile.endsWith('.tsx');
            if (isJSX) {
                domModel = extractJSXDOM(sources.html, sourceFile);
            }
            else {
                domModel = parseHTML(sources.html, sourceFile);
            }
        }
        const jsParser = new JavaScriptParser();
        const jsModels = sources.javascript.map((js, i) => jsParser.parse(js, sources.sourceFiles.javascript[i]));
        if (sources.html && sources.sourceFiles.html &&
            (sources.sourceFiles.html.endsWith('.jsx') || sources.sourceFiles.html.endsWith('.tsx'))) {
            const jsxActionModel = jsParser.parse(sources.html, sources.sourceFiles.html);
            if (jsxActionModel.nodes.length > 0) {
                jsModels.push(jsxActionModel);
            }
        }
        const cssParser = new CSSParser();
        const cssModels = sources.css.map((css, i) => cssParser.parse(css, sources.sourceFiles.css[i]));
        const documentModel = new DocumentModel({
            scope,
            dom: domModel,
            javascript: jsModels,
            css: cssModels,
        });
        documentModel.merge();
        return documentModel;
    }
}
exports.DocumentModelBuilder = DocumentModelBuilder;
//# sourceMappingURL=DocumentModel.js.map