/**
 * ActionLanguage Model for Paradise Multi-Model Architecture
 *
 * This file defines the ActionLanguageModel interface for representing
 * UI interaction behaviors extracted from JavaScript/TypeScript code.
 *
 * ActionLanguage captures:
 * - Event handlers (click, keydown, focus, etc.)
 * - DOM manipulation (setAttribute, classList, etc.)
 * - Focus management (focus(), blur())
 * - ARIA state changes
 * - Navigation (location.href, history.pushState)
 *
 * These behaviors are extracted from source code and linked to DOM elements
 * during the DocumentModel merge process.
 */

import {
  Model,
  ModelNode,
  ValidationResult,
} from './BaseModel';

/**
 * Represents a reference to a DOM element in JavaScript code.
 */
export interface ElementReference {
  /** CSS selector for the element (e.g., "#submit", ".nav-item") */
  selector: string;

  /** Variable/object binding in JavaScript (e.g., "button", "buttonRef") */
  binding?: string;

  /** Element ID from HTML/DOM (e.g., "submit-btn") */
  id?: string;

  /** Optional: Resolved element from DOMModel (populated during merge) */
  resolvedElement?: any; // DOMElement
}

/**
 * ActionLanguage node types.
 */
export type ActionType =
  | 'eventHandler'
  | 'focusChange'
  | 'ariaStateChange'
  | 'domManipulation'
  | 'navigation'
  | 'portal'
  | 'eventPropagation';

/**
 * Timing information for actions.
 */
export type TimingType = 'immediate' | 'delayed' | 'conditional' | 'deferred';

/**
 * ActionLanguage node representing a UI interaction pattern.
 */
export interface ActionLanguageNode extends ModelNode {
  nodeType: 'action';

  /** Type of action */
  actionType: ActionType;

  /** Element this action applies to */
  element: ElementReference;

  /** Event type for event handlers (e.g., "click", "keydown") */
  event?: string;

  /** Handler body (function expression or reference) */
  handler?: any;

  /** Timing information (immediate, delayed, conditional) */
  timing?: TimingType;

  /** Additional action-specific metadata */
  metadata: {
    /** Framework that generated this action (vanilla, react, vue, etc.) */
    framework?: string;

    /** Is this a synthetic event (React)? */
    synthetic?: boolean;

    /** Method name for focus/blur actions */
    method?: string;

    /** ARIA attribute name for ARIA state changes */
    attribute?: string;

    /** ARIA attribute value */
    value?: any;

    /** Is this ref-based (React)? */
    refBased?: boolean;

    /** Additional custom metadata */
    [key: string]: any;
  };
}

/**
 * ActionLanguage Model interface.
 *
 * Represents a collection of UI interaction behaviors extracted from
 * JavaScript/TypeScript source code.
 */
export interface ActionLanguageModel extends Model {
  type: 'ActionLanguage';

  /** All ActionLanguage nodes in this model */
  nodes: ActionLanguageNode[];

  /**
   * Find nodes by CSS selector.
   * @param selector - CSS selector to match
   * @returns Matching ActionLanguage nodes
   */
  findBySelector(selector: string): ActionLanguageNode[];

  /**
   * Find nodes by element binding (variable name).
   * @param binding - Variable name to match
   * @returns Matching ActionLanguage nodes
   */
  findByElementBinding(binding: string): ActionLanguageNode[];

  /**
   * Find nodes by action type.
   * @param actionType - Action type to match
   * @returns Matching ActionLanguage nodes
   */
  findByActionType(actionType: ActionType): ActionLanguageNode[];

  /**
   * Find event handlers by event name.
   * @param event - Event name to match (e.g., "click", "keydown")
   * @returns Matching event handler nodes
   */
  findEventHandlers(event: string): ActionLanguageNode[];

  /**
   * Get all event handlers.
   * @returns All event handler nodes
   */
  getAllEventHandlers(): ActionLanguageNode[];

  /**
   * Get all focus management actions.
   * @returns All focus change nodes
   */
  getAllFocusActions(): ActionLanguageNode[];

  /**
   * Get all ARIA state changes.
   * @returns All ARIA state change nodes
   */
  getAllAriaActions(): ActionLanguageNode[];
}

/**
 * Concrete implementation of ActionLanguageModel.
 */
export class ActionLanguageModelImpl implements ActionLanguageModel {
  type: 'ActionLanguage' = 'ActionLanguage';
  version = '1.0.0';
  sourceFile: string;
  nodes: ActionLanguageNode[];

  constructor(nodes: ActionLanguageNode[], sourceFile: string) {
    this.nodes = nodes;
    this.sourceFile = sourceFile;
  }

  /**
   * Parse source code into ActionLanguage nodes.
   * Note: This is implemented by JavaScriptParser.
   */
  parse(_source: string): ModelNode[] {
    throw new Error(
      'ActionLanguageModelImpl.parse() should not be called directly. Use JavaScriptParser.'
    );
  }

  /**
   * Validate the ActionLanguage nodes.
   * Checks for:
   * - Orphaned event handlers (no matching DOM element)
   * - Missing keyboard handlers for click handlers
   * - Invalid ARIA state changes
   */
  validate(): ValidationResult {
    // Validation is performed by analyzers, not at the model level
    return {
      valid: true,
      errors: [],
      warnings: [],
    };
  }

  /**
   * Serialize the ActionLanguage nodes back to source code.
   * Used for generating fixed code.
   */
  serialize(): string {
    // Serialization is complex and not implemented yet
    // Would require converting ActionLanguage back to JavaScript AST
    throw new Error('ActionLanguageModel serialization not yet implemented');
  }

  findBySelector(selector: string): ActionLanguageNode[] {
    return this.nodes.filter((node) => node.element.selector === selector);
  }

  findByElementBinding(binding: string): ActionLanguageNode[] {
    return this.nodes.filter((node) => node.element.binding === binding);
  }

  findByActionType(actionType: ActionType): ActionLanguageNode[] {
    return this.nodes.filter((node) => node.actionType === actionType);
  }

  findEventHandlers(event: string): ActionLanguageNode[] {
    return this.nodes.filter(
      (node) => node.actionType === 'eventHandler' && node.event === event
    );
  }

  getAllEventHandlers(): ActionLanguageNode[] {
    return this.findByActionType('eventHandler');
  }

  getAllFocusActions(): ActionLanguageNode[] {
    return this.findByActionType('focusChange');
  }

  getAllAriaActions(): ActionLanguageNode[] {
    return this.findByActionType('ariaStateChange');
  }
}
