/**
 * Svelte ActionLanguage Extractor
 *
 * This parser extracts ActionLanguage nodes (UI interaction patterns) from
 * Svelte components. It detects:
 * - Event handlers (on: directives)
 * - Two-way bindings (bind: directives)
 * - Class directives (class: directives)
 * - Store subscriptions and reactive statements
 * - Focus management patterns
 *
 * The parser uses parse5 to handle Svelte's HTML template structure and
 * converts Svelte-specific directives into ActionLanguage nodes.
 */

import { parse as parseHTML, DefaultTreeAdapterMap } from 'parse5';
import { SourceLocation } from '../models/BaseModel';
import {
  ActionLanguageNode,
  ActionLanguageModelImpl,
  ElementReference,
} from '../models/ActionLanguageModel';
import { JavaScriptParser } from './JavaScriptParser';

type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];

/**
 * Svelte ActionLanguage Extractor
 *
 * Parses Svelte components and extracts ActionLanguage nodes representing
 * UI interaction patterns from Svelte directives.
 */
export class SvelteActionLanguageExtractor {
  private nodeCounter = 0;

  /**
   * Parse Svelte component into ActionLanguage model.
   *
   * @param source - Svelte component source code
   * @param sourceFile - Filename for error reporting
   * @returns ActionLanguageModel
   *
   * @example
   * ```typescript
   * const extractor = new SvelteActionLanguageExtractor();
   * const model = extractor.parse(`
   *   <script>
   *     let count = 0;
   *   </script>
   *
   *   <button on:click={() => count++} on:keydown={handleKey}>
   *     Count: {count}
   *   </button>
   * `, 'Counter.svelte');
   * ```
   */
  parse(source: string, sourceFile: string): ActionLanguageModelImpl {
    const nodes: ActionLanguageNode[] = [];

    // Step 1: Extract and parse <script> section using JavaScriptParser
    const scriptContent = this.extractScript(source);
    if (scriptContent) {
      try {
        const jsParser = new JavaScriptParser();
        const scriptModel = jsParser.parse(scriptContent, sourceFile);

        // Add all ActionLanguage nodes from the script
        // Mark them as being from Svelte context
        for (const node of scriptModel.nodes) {
          nodes.push({
            ...node,
            metadata: {
              ...node.metadata,
              framework: 'svelte',
              sourceSection: 'script'
            }
          });
        }
      } catch (error) {
        console.error(`Failed to parse Svelte script in ${sourceFile}:`, error);
      }
    }

    // Step 2: Extract the template block (remove <script> and <style>)
    const template = this.extractTemplate(source);

    if (template.trim()) {
      try {
        // Parse the template as HTML
        const document = parseHTML(template, {
          sourceCodeLocationInfo: true,
        });

        // Find body element
        const html = document.childNodes.find((node: Node) =>
          node.nodeName === 'html'
        ) as any;

        if (html) {
          const body = html.childNodes?.find((node: Node) =>
            node.nodeName === 'body'
          ) as any;

          if (body) {
            // Traverse the DOM tree and extract ActionLanguage nodes from directives
            this.traverseElements(body, nodes, sourceFile);
          }
        }
      } catch (error) {
        console.error(`Failed to parse Svelte template in ${sourceFile}:`, error);
      }
    }

    return new ActionLanguageModelImpl(nodes, sourceFile);
  }

  /**
   * Extract <script> content from Svelte component.
   * Returns the JavaScript code inside <script> tags.
   */
  private extractScript(source: string): string {
    // Match <script> blocks (excluding <script context="module"> for now)
    const scriptMatch = source.match(/<script(?!\s+context="module")[^>]*>([\s\S]*?)<\/script>/i);
    return scriptMatch ? scriptMatch[1].trim() : '';
  }

  /**
   * Extract template block from Svelte component.
   * Removes <script> and <style> blocks, leaving only the template markup.
   */
  private extractTemplate(source: string): string {
    // Remove <script> blocks (including <script context="module">)
    let template = source.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    // Remove <style> blocks (including <style global>)
    template = template.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    return template.trim();
  }

  /**
   * Traverse all elements in the DOM tree and extract ActionLanguage nodes.
   */
  private traverseElements(
    node: Node,
    nodes: ActionLanguageNode[],
    sourceFile: string
  ): void {
    if (!node) return;

    // Process element nodes
    if (this.isElement(node)) {
      const element = node as Element;
      const tagName = element.tagName;

      // Extract element reference for this node
      const elementRef = this.getElementReference(element);

      // Extract event handlers from on: directives
      if (element.attrs) {
        for (const attr of element.attrs) {
          // on:click, on:keydown, etc.
          if (attr.name.startsWith('on:')) {
            const eventType = attr.name.substring(3); // Remove 'on:' prefix
            const eventNode = this.createEventHandlerNode(
              eventType,
              elementRef,
              tagName,
              attr.name,
              element,
              sourceFile
            );
            nodes.push(eventNode);
          }

          // bind: directives (two-way binding)
          if (attr.name.startsWith('bind:')) {
            const bindTarget = attr.name.substring(5); // Remove 'bind:' prefix
            const bindNode = this.createBindDirectiveNode(
              bindTarget,
              elementRef,
              tagName,
              attr.name,
              element,
              sourceFile
            );
            nodes.push(bindNode);
          }

          // class: directives (conditional class application)
          if (attr.name.startsWith('class:')) {
            const className = attr.name.substring(6); // Remove 'class:' prefix
            const classNode = this.createClassDirectiveNode(
              className,
              elementRef,
              tagName,
              attr.name,
              element,
              sourceFile
            );
            nodes.push(classNode);
          }
        }
      }
    }

    // Recursively process children
    if ('childNodes' in node) {
      const childNodes = (node as any).childNodes;
      if (childNodes) {
        for (const child of childNodes) {
          this.traverseElements(child, nodes, sourceFile);
        }
      }
    }
  }

  /**
   * Create an ActionLanguage node for a Svelte event handler (on: directive).
   */
  private createEventHandlerNode(
    eventType: string,
    elementRef: ElementReference,
    tagName: string,
    directiveName: string,
    element: Element,
    sourceFile: string
  ): ActionLanguageNode {
    return {
      id: this.generateId(),
      nodeType: 'action',
      actionType: 'eventHandler',
      event: eventType,
      element: elementRef,
      location: this.extractLocation(element, sourceFile),
      metadata: {
        framework: 'svelte',
        synthetic: true,
        directive: directiveName,
        tagName,
      },
    };
  }

  /**
   * Create an ActionLanguage node for a Svelte bind: directive.
   * Two-way bindings can trigger ARIA state changes or focus changes.
   */
  private createBindDirectiveNode(
    bindTarget: string,
    elementRef: ElementReference,
    tagName: string,
    directiveName: string,
    element: Element,
    sourceFile: string
  ): ActionLanguageNode {
    // Determine the action type based on bind target
    let actionType: ActionLanguageNode['actionType'] = 'domManipulation';

    // bind:value, bind:checked affect ARIA state
    if (bindTarget === 'value' || bindTarget === 'checked') {
      actionType = 'ariaStateChange';
    }

    // bind:this can lead to focus management
    if (bindTarget === 'this') {
      actionType = 'focusChange';
    }

    return {
      id: this.generateId(),
      nodeType: 'action',
      actionType,
      element: elementRef,
      location: this.extractLocation(element, sourceFile),
      metadata: {
        framework: 'svelte',
        directive: directiveName,
        bindTarget,
        tagName,
      },
    };
  }

  /**
   * Create an ActionLanguage node for a Svelte class: directive.
   * Class directives can affect visibility, which impacts ARIA.
   */
  private createClassDirectiveNode(
    className: string,
    elementRef: ElementReference,
    tagName: string,
    directiveName: string,
    element: Element,
    sourceFile: string
  ): ActionLanguageNode {
    return {
      id: this.generateId(),
      nodeType: 'action',
      actionType: 'domManipulation',
      element: elementRef,
      location: this.extractLocation(element, sourceFile),
      metadata: {
        framework: 'svelte',
        directive: directiveName,
        className,
        tagName,
        affectsVisibility: this.isVisibilityClass(className),
      },
    };
  }

  /**
   * Get an element reference for a parse5 Element node.
   */
  private getElementReference(element: Element): ElementReference {
    // Try to get ID attribute
    const idAttr = element.attrs?.find(attr => attr.name === 'id');
    if (idAttr) {
      return {
        selector: `#${idAttr.value}`,
        binding: idAttr.value,
      };
    }

    // Try to get class attribute
    const classAttr = element.attrs?.find(attr => attr.name === 'class');
    if (classAttr) {
      const classes = classAttr.value.split(/\s+/);
      return {
        selector: `.${classes[0]}`,
        binding: classAttr.value,
      };
    }

    // Fallback to tag name
    return {
      selector: element.tagName,
      binding: element.tagName,
    };
  }

  /**
   * Check if a class name is likely to affect visibility.
   */
  private isVisibilityClass(className: string): boolean {
    const visibilityKeywords = [
      'hidden',
      'visible',
      'show',
      'hide',
      'open',
      'closed',
      'collapsed',
      'expanded',
    ];
    return visibilityKeywords.some(keyword =>
      className.toLowerCase().includes(keyword)
    );
  }

  /**
   * Check if a parse5 node is an Element.
   */
  private isElement(node: Node): boolean {
    return 'tagName' in node;
  }

  /**
   * Extract source location from a parse5 node.
   */
  private extractLocation(node: Node, sourceFile: string): SourceLocation {
    const loc = (node as any).sourceCodeLocation;

    return {
      file: sourceFile,
      line: loc?.startLine || 0,
      column: loc?.startCol || 0,
      length: loc?.endOffset && loc?.startOffset
        ? loc.endOffset - loc.startOffset
        : undefined,
    };
  }

  /**
   * Generate a unique ID for a node.
   */
  private generateId(): string {
    return `svelte_action_${++this.nodeCounter}`;
  }
}

/**
 * Parse Svelte component into ActionLanguage model.
 *
 * @param source - Svelte component source code
 * @param sourceFile - Filename for error reporting
 * @returns ActionLanguageModel
 *
 * @example
 * ```typescript
 * const model = parseSvelteActionLanguage(`
 *   <script>
 *     let isOpen = false;
 *   </script>
 *
 *   <button on:click={() => isOpen = !isOpen}>
 *     Toggle
 *   </button>
 *
 *   <div class:hidden={!isOpen}>
 *     Content
 *   </div>
 * `, 'Dropdown.svelte');
 *
 * // Find all event handlers
 * const eventHandlers = model.findEventHandlers('click');
 * ```
 */
export function parseSvelteActionLanguage(
  source: string,
  sourceFile: string
): ActionLanguageModelImpl {
  const extractor = new SvelteActionLanguageExtractor();
  return extractor.parse(source, sourceFile);
}
