/**
 * Shared types for the Virtual Screen Reader system
 */

/**
 * ARIA states that can be present on elements
 */
export interface ARIAStates {
  checked?: boolean | 'mixed';
  disabled?: boolean;
  expanded?: boolean;
  hidden?: boolean;
  invalid?: boolean | 'grammar' | 'spelling';
  pressed?: boolean | 'mixed';
  selected?: boolean;
  busy?: boolean;
  grabbed?: boolean;
  readonly?: boolean;
  required?: boolean;
  current?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  visited?: boolean;
}

/**
 * ARIA properties that provide additional information about elements
 */
export interface ARIAProperties {
  level?: number; // For headings
  posinset?: number; // Position in set
  setsize?: number; // Size of set
  valuemin?: number;
  valuemax?: number;
  valuenow?: number;
  valuetext?: string;
  autocomplete?: string;
  haspopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  orientation?: 'horizontal' | 'vertical';
  sort?: 'ascending' | 'descending' | 'none' | 'other';
  multiselectable?: boolean;
  multiline?: boolean;
  modal?: boolean;
  live?: 'off' | 'polite' | 'assertive';
  atomic?: boolean;
  relevant?: string;
  // ARIA relationship attributes
  controls?: string; // ID(s) of elements this element controls
  labelledby?: string; // ID(s) of elements that label this element
  describedby?: string; // ID(s) of elements that describe this element
  errormessage?: string; // ID of element containing error message
}

/**
 * A node in the accessibility tree
 */
export interface AccessibilityNode {
  /** Unique identifier for this node */
  id: string;

  /** Reference to the actual DOM element in the iframe */
  domElement: HTMLElement | null;

  /** Computed ARIA role (explicit or implicit) */
  role: string;

  /** Accessible name (computed via accname algorithm) */
  name: string;

  /** Accessible description */
  description?: string;

  /** Current value (for inputs, range widgets, etc.) */
  value?: string;

  /** ARIA states */
  states: ARIAStates;

  /** ARIA properties */
  properties: ARIAProperties;

  /** Child nodes in the accessibility tree */
  children: AccessibilityNode[];

  /** Parent node (undefined for root) */
  parent?: AccessibilityNode;

  /** Whether this element is hidden from the accessibility tree */
  isHidden: boolean;

  /** Whether this element is focusable */
  isFocusable: boolean;

  /** Whether this element has click handlers */
  hasClickHandler: boolean;

  /** Tag name of the original HTML element */
  tagName: string;

  /** Flattened index in tree (for navigation) */
  treeIndex?: number;
}

/**
 * Screen reader message types
 */
export type SRMessageType = 'navigation' | 'announcement' | 'state-change' | 'error' | 'page-load';

/**
 * A message announced by the screen reader
 */
export interface SRMessage {
  /** Unique identifier */
  id: string;

  /** Timestamp of the message */
  timestamp: number;

  /** Type of message */
  type: SRMessageType;

  /** The actual text content to announce */
  content: string;

  /** Reference to the element this message is about */
  element?: AccessibilityNode;

  /** Politeness level for announcements */
  politeness?: 'polite' | 'assertive';
}

/**
 * Virtual cursor position
 */
export interface VirtualCursorPosition {
  /** Index in the flattened accessibility tree */
  index: number;

  /** Reference to the current node */
  node: AccessibilityNode | null;
}

/**
 * Screen reader navigation mode
 */
export type NavigationMode = 'browse' | 'focus';

/**
 * Keyboard navigation command
 */
export type NavigationCommand =
  | 'next'
  | 'previous'
  | 'nextHeading'
  | 'previousHeading'
  | 'nextLink'
  | 'previousLink'
  | 'nextButton'
  | 'previousButton'
  | 'nextLandmark'
  | 'previousLandmark'
  | 'nextFormControl'
  | 'previousFormControl'
  | 'nextTable'
  | 'previousTable'
  | 'nextList'
  | 'previousList'
  | 'nextGraphic'
  | 'previousGraphic'
  | 'activate'
  | 'toggleMode';
