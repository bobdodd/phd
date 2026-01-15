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

import { DOMModel, DOMElement } from './DOMModel';
import { ActionLanguageModel, ActionLanguageNode } from './ActionLanguageModel';

/**
 * Analysis scope determines what files are included.
 */
export type AnalysisScope = 'file' | 'workspace' | 'page';

/**
 * Element context for accessibility analysis.
 * Combines information from all models for a single element.
 */
export interface ElementContext {
  /** The DOM element */
  element: DOMElement;

  /** JavaScript event handlers attached to this element */
  jsHandlers: ActionLanguageNode[];

  /** CSS rules that apply to this element (future) */
  cssRules: any[];

  /** Is this element focusable? */
  focusable: boolean;

  /** Is this element interactive (has handlers)? */
  interactive: boolean;

  /** Does this element have a click handler? */
  hasClickHandler: boolean;

  /** Does this element have a keyboard handler? */
  hasKeyboardHandler: boolean;

  /** ARIA role (explicit or implicit) */
  role: string | null;

  /** ARIA label (computed) */
  label: string | null;
}

/**
 * Document Model - Integration Layer
 *
 * Merges DOMModel, ActionLanguageModel, and CSSModel to enable
 * comprehensive accessibility analysis.
 */
export class DocumentModel {
  scope: AnalysisScope;
  dom?: DOMModel;
  javascript: ActionLanguageModel[];
  css: any[]; // CSSModel[] (future)

  constructor(options: {
    scope: AnalysisScope;
    dom?: DOMModel;
    javascript: ActionLanguageModel[];
    css?: any[];
  }) {
    this.scope = options.scope;
    this.dom = options.dom;
    this.javascript = options.javascript;
    this.css = options.css || [];
  }

  /**
   * Merge all models and resolve cross-references.
   * This is the key integration step that links JavaScript behaviors
   * to DOM elements via CSS selectors.
   */
  merge(): void {
    if (!this.dom) return;

    // For each DOM element, find matching JavaScript handlers
    for (const element of this.dom.getAllElements()) {
      // Build selectors for this element
      const selectors = this.buildSelectors(element);

      // Find JavaScript handlers that reference this element
      element.jsHandlers = this.javascript
        .flatMap((jsModel) =>
          selectors.flatMap((selector) => jsModel.findBySelector(selector))
        );

      // Future: Find CSS rules that apply to this element
      // element.cssRules = this.css.flatMap(cssModel => cssModel.getMatchingRules(element));
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
  private buildSelectors(element: DOMElement): string[] {
    const selectors: string[] = [];

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
  getElementContext(element: DOMElement): ElementContext {
    const handlers = element.jsHandlers || [];

    // Check for click handlers
    const hasClickHandler = handlers.some(
      (h) => h.actionType === 'eventHandler' && h.event === 'click'
    );

    // Check for keyboard handlers (keydown, keypress, keyup)
    const keyboardEvents = ['keydown', 'keypress', 'keyup'];
    const hasKeyboardHandler = handlers.some(
      (h) =>
        h.actionType === 'eventHandler' &&
        h.event &&
        keyboardEvents.includes(h.event)
    );

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
  private isFocusable(element: DOMElement): boolean {
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
  private getRole(element: DOMElement): string | null {
    // Explicit role
    if (element.attributes.role) {
      return element.attributes.role;
    }

    // Implicit roles based on tag name
    const implicitRoles: Record<string, string> = {
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
  private getLabel(element: DOMElement): string | null {
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
    const textChildren = element.children.filter(
      (child) => child.nodeType === 'text'
    );
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
   */
  getInteractiveElements(): ElementContext[] {
    if (!this.dom) return [];

    const elements = this.dom.getAllElements();
    return elements
      .map((el) => this.getElementContext(el))
      .filter((ctx) => ctx.interactive);
  }

  /**
   * Get all elements with accessibility issues.
   * This is a convenience method for analyzers.
   */
  getElementsWithIssues(): ElementContext[] {
    if (!this.dom) return [];

    const elements = this.dom.getAllElements();
    return elements
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
}

/**
 * Source collection for building a DocumentModel.
 */
export interface SourceCollection {
  /** HTML/JSX source (optional for JS-only analysis) */
  html?: string;

  /** JavaScript/TypeScript source files */
  javascript: string[];

  /** CSS source files (future) */
  css: string[];

  /** Source file paths for error reporting */
  sourceFiles: {
    html?: string;
    javascript: string[];
    css: string[];
  };
}

/**
 * Document Model Builder
 *
 * Builds a DocumentModel from source code files.
 */
export class DocumentModelBuilder {
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
  build(sources: SourceCollection, scope: AnalysisScope): DocumentModel {
    // Import parsers (avoiding circular dependencies)
    const { extractJSXDOM } = require('../parsers/JSXDOMExtractor');
    const { JavaScriptParser } = require('../parsers/JavaScriptParser');

    // Parse DOM (from HTML or JSX)
    let domModel: DOMModel | undefined;
    if (sources.html && sources.sourceFiles.html) {
      // Try to extract DOM from JSX first
      domModel = extractJSXDOM(sources.html, sources.sourceFiles.html);

      // Future: Fall back to HTML parser if not JSX
      // if (!domModel) {
      //   domModel = new HTMLParser().parse(sources.html, sources.sourceFiles.html);
      // }
    }

    // Parse JavaScript files
    const parser = new JavaScriptParser();
    const jsModels = sources.javascript.map((js, i) =>
      parser.parse(js, sources.sourceFiles.javascript[i])
    );

    // If we have JSX/TSX source, also parse it for event handlers
    // This extracts inline event handlers like onClick={handler}
    if (sources.html && sources.sourceFiles.html &&
        (sources.sourceFiles.html.endsWith('.jsx') || sources.sourceFiles.html.endsWith('.tsx'))) {
      const jsxActionModel = parser.parse(sources.html, sources.sourceFiles.html);
      if (jsxActionModel.nodes.length > 0) {
        jsModels.push(jsxActionModel);
      }
    }

    // Create document model
    const documentModel = new DocumentModel({
      scope,
      dom: domModel,
      javascript: jsModels,
      css: [], // Future: Parse CSS files
    });

    // Merge models to resolve cross-references
    documentModel.merge();

    return documentModel;
  }
}
