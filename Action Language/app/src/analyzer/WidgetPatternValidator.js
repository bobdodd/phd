/**
 * WidgetPatternValidator - Validates widget patterns against WAI-ARIA Authoring Practices
 *
 * This validator checks that detected widget patterns follow the WAI-ARIA APG guidelines:
 * https://www.w3.org/WAI/ARIA/apg/patterns/
 *
 * Validates:
 * - Required ARIA roles and attributes
 * - Required keyboard interactions
 * - Focus management requirements
 * - Structural requirements
 */

class WidgetPatternValidator {
  /**
   * Create a new WidgetPatternValidator
   * @param {Object} [options] - Validator options
   */
  constructor(options = {}) {
    this.options = {
      strictMode: options.strictMode ?? false, // Strict mode flags warnings as errors
      validateKeyboard: options.validateKeyboard ?? true,
      validateAria: options.validateAria ?? true,
      validateFocus: options.validateFocus ?? true
    };

    // Validation results
    this.patterns = [];
    this.validations = [];
    this.issues = [];

    // Define WAI-ARIA APG widget patterns with their requirements
    this.widgetPatterns = this.defineWidgetPatterns();
  }

  /**
   * Define WAI-ARIA Authoring Practices widget patterns
   * Based on: https://www.w3.org/WAI/ARIA/apg/patterns/
   */
  defineWidgetPatterns() {
    return {
      // === Accordion ===
      accordion: {
        name: 'Accordion',
        description: 'Vertically stacked headings that reveal/hide content sections',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion/',
        roles: {
          required: [],
          recommended: ['region']
        },
        attributes: {
          required: ['aria-expanded', 'aria-controls'],
          recommended: ['aria-labelledby']
        },
        keyboard: {
          required: ['Enter', 'Space'],
          recommended: ['ArrowDown', 'ArrowUp', 'Home', 'End']
        },
        focus: {
          requirements: ['Headers must be focusable (button or tabindex)']
        }
      },

      // === Alert Dialog ===
      alertdialog: {
        name: 'Alert Dialog',
        description: 'Modal dialog that interrupts workflow with important message',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/',
        roles: {
          required: ['alertdialog'],
          recommended: []
        },
        attributes: {
          required: ['aria-labelledby', 'aria-describedby'],
          recommended: ['aria-modal']
        },
        keyboard: {
          required: ['Tab', 'Escape'],
          recommended: []
        },
        focus: {
          requirements: [
            'Focus moves to element inside dialog on open',
            'Focus trapped within dialog',
            'Escape closes dialog',
            'Focus returns to trigger on close'
          ]
        }
      },

      // === Button ===
      button: {
        name: 'Button',
        description: 'Clickable element that triggers an action',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
        roles: {
          required: [], // Native button doesn't need role
          recommended: ['button'] // For non-button elements
        },
        attributes: {
          required: [],
          recommended: ['aria-pressed', 'aria-expanded'] // For toggle/menu buttons
        },
        keyboard: {
          required: ['Enter', 'Space'],
          recommended: []
        },
        focus: {
          requirements: ['Must be focusable']
        }
      },

      // === Checkbox ===
      checkbox: {
        name: 'Checkbox',
        description: 'Two or three state input for boolean values',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/',
        roles: {
          required: ['checkbox'],
          recommended: []
        },
        attributes: {
          required: ['aria-checked'],
          recommended: ['aria-labelledby']
        },
        keyboard: {
          required: ['Space'],
          recommended: []
        },
        focus: {
          requirements: ['Must be focusable']
        }
      },

      // === Combobox ===
      combobox: {
        name: 'Combobox',
        description: 'Input with popup listbox for selecting values',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
        roles: {
          required: ['combobox', 'listbox'],
          recommended: ['option']
        },
        attributes: {
          required: ['aria-controls', 'aria-expanded'],
          recommended: ['aria-activedescendant', 'aria-autocomplete', 'aria-haspopup']
        },
        keyboard: {
          required: ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'],
          recommended: ['Home', 'End', 'PageDown', 'PageUp']
        },
        focus: {
          requirements: [
            'Input must be focusable',
            'Arrow keys navigate options',
            'Escape closes popup'
          ]
        }
      },

      // === Dialog (Modal) ===
      dialog: {
        name: 'Dialog (Modal)',
        description: 'Window overlaid on primary content',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
        roles: {
          required: ['dialog'],
          recommended: []
        },
        attributes: {
          required: ['aria-labelledby'],
          recommended: ['aria-modal', 'aria-describedby']
        },
        keyboard: {
          required: ['Tab', 'Escape'],
          recommended: []
        },
        focus: {
          requirements: [
            'Focus moves to element inside dialog on open',
            'Focus trapped within dialog',
            'Escape closes dialog',
            'Focus returns to trigger on close'
          ]
        }
      },

      // === Disclosure ===
      disclosure: {
        name: 'Disclosure',
        description: 'Button that shows/hides content',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
        roles: {
          required: [],
          recommended: ['button']
        },
        attributes: {
          required: ['aria-expanded', 'aria-controls'],
          recommended: []
        },
        keyboard: {
          required: ['Enter', 'Space'],
          recommended: []
        },
        focus: {
          requirements: ['Trigger must be focusable']
        }
      },

      // === Grid ===
      grid: {
        name: 'Grid',
        description: 'Interactive tabular data with 2D navigation',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/',
        roles: {
          required: ['grid', 'row', 'gridcell'],
          recommended: ['rowheader', 'columnheader']
        },
        attributes: {
          required: [],
          recommended: ['aria-rowcount', 'aria-colcount', 'aria-rowindex', 'aria-colindex']
        },
        keyboard: {
          required: ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'],
          recommended: ['Home', 'End', 'PageDown', 'PageUp', 'Enter']
        },
        focus: {
          requirements: [
            'One cell focusable at a time',
            'Arrow keys move between cells',
            'Focus indicator visible'
          ]
        }
      },

      // === Listbox ===
      listbox: {
        name: 'Listbox',
        description: 'List of selectable options',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/',
        roles: {
          required: ['listbox', 'option'],
          recommended: []
        },
        attributes: {
          required: ['aria-selected'],
          recommended: ['aria-multiselectable', 'aria-activedescendant']
        },
        keyboard: {
          required: ['ArrowDown', 'ArrowUp'],
          recommended: ['Home', 'End', 'PageDown', 'PageUp', 'Space']
        },
        focus: {
          requirements: [
            'Listbox or option must be focusable',
            'Arrow keys navigate options'
          ]
        }
      },

      // === Menu ===
      menu: {
        name: 'Menu',
        description: 'List of actions or functions',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu/',
        roles: {
          required: ['menu', 'menuitem'],
          recommended: ['menuitemcheckbox', 'menuitemradio']
        },
        attributes: {
          required: [],
          recommended: ['aria-haspopup', 'aria-expanded', 'aria-checked']
        },
        keyboard: {
          required: ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'],
          recommended: ['ArrowRight', 'ArrowLeft', 'Home', 'End']
        },
        focus: {
          requirements: [
            'Menu items navigable with arrow keys',
            'Escape closes menu',
            'Focus returns to trigger on close'
          ]
        }
      },

      // === Menu Button ===
      menubutton: {
        name: 'Menu Button',
        description: 'Button that opens a menu',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/',
        roles: {
          required: ['menu', 'menuitem'],
          recommended: ['button']
        },
        attributes: {
          required: ['aria-haspopup', 'aria-expanded'],
          recommended: ['aria-controls']
        },
        keyboard: {
          required: ['Enter', 'Space', 'ArrowDown', 'Escape'],
          recommended: ['ArrowUp']
        },
        focus: {
          requirements: [
            'Button must be focusable',
            'Arrow down opens menu and moves focus to first item',
            'Escape closes menu and returns focus to button'
          ]
        }
      },

      // === Radio Group ===
      radiogroup: {
        name: 'Radio Group',
        description: 'Set of mutually exclusive options',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/',
        roles: {
          required: ['radiogroup', 'radio'],
          recommended: []
        },
        attributes: {
          required: ['aria-checked'],
          recommended: ['aria-labelledby']
        },
        keyboard: {
          required: ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'],
          recommended: ['Space']
        },
        focus: {
          requirements: [
            'Tab moves to checked radio or first if none checked',
            'Arrow keys move selection and focus'
          ]
        }
      },

      // === Slider ===
      slider: {
        name: 'Slider',
        description: 'Input for selecting value from range',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/',
        roles: {
          required: ['slider'],
          recommended: []
        },
        attributes: {
          required: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
          recommended: ['aria-valuetext', 'aria-label', 'aria-labelledby']
        },
        keyboard: {
          required: ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'],
          recommended: ['Home', 'End', 'PageUp', 'PageDown']
        },
        focus: {
          requirements: ['Slider thumb must be focusable']
        }
      },

      // === Spinbutton ===
      spinbutton: {
        name: 'Spinbutton',
        description: 'Numeric input with increment/decrement',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',
        roles: {
          required: ['spinbutton'],
          recommended: []
        },
        attributes: {
          required: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
          recommended: ['aria-valuetext']
        },
        keyboard: {
          required: ['ArrowUp', 'ArrowDown'],
          recommended: ['Home', 'End', 'PageUp', 'PageDown']
        },
        focus: {
          requirements: ['Input must be focusable']
        }
      },

      // === Switch ===
      switch: {
        name: 'Switch',
        description: 'Toggle between on and off states',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/',
        roles: {
          required: ['switch'],
          recommended: []
        },
        attributes: {
          required: ['aria-checked'],
          recommended: ['aria-labelledby']
        },
        keyboard: {
          required: ['Space'],
          recommended: ['Enter']
        },
        focus: {
          requirements: ['Must be focusable']
        }
      },

      // === Tabs ===
      tabs: {
        name: 'Tabs',
        description: 'Layered sections of content with tab navigation',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',
        roles: {
          required: ['tablist', 'tab', 'tabpanel'],
          recommended: []
        },
        attributes: {
          required: ['aria-selected', 'aria-controls'],
          recommended: ['aria-labelledby']
        },
        keyboard: {
          required: ['ArrowRight', 'ArrowLeft'],
          recommended: ['Home', 'End', 'ArrowDown', 'ArrowUp']
        },
        focus: {
          requirements: [
            'Tab key moves into tablist then to tabpanel',
            'Arrow keys move between tabs',
            'Only active tab in tab sequence'
          ]
        }
      },

      // === Toolbar ===
      toolbar: {
        name: 'Toolbar',
        description: 'Container for grouping controls',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/',
        roles: {
          required: ['toolbar'],
          recommended: ['button', 'separator']
        },
        attributes: {
          required: [],
          recommended: ['aria-label', 'aria-labelledby', 'aria-controls']
        },
        keyboard: {
          required: ['ArrowRight', 'ArrowLeft'],
          recommended: ['Home', 'End', 'Tab']
        },
        focus: {
          requirements: [
            'Tab moves into toolbar then out',
            'Arrow keys move between controls',
            'Roving tabindex recommended'
          ]
        }
      },

      // === Tooltip ===
      tooltip: {
        name: 'Tooltip',
        description: 'Popup with description for element',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/',
        roles: {
          required: ['tooltip'],
          recommended: []
        },
        attributes: {
          required: ['aria-describedby'],
          recommended: []
        },
        keyboard: {
          required: ['Escape'],
          recommended: []
        },
        focus: {
          requirements: [
            'Tooltip appears on focus',
            'Escape dismisses tooltip'
          ]
        }
      },

      // === Tree View ===
      treeview: {
        name: 'Tree View',
        description: 'Hierarchical list with expandable items',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/treeview/',
        roles: {
          required: ['tree', 'treeitem'],
          recommended: ['group']
        },
        attributes: {
          required: ['aria-expanded'],
          recommended: ['aria-selected', 'aria-level', 'aria-setsize', 'aria-posinset']
        },
        keyboard: {
          required: ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Enter'],
          recommended: ['Home', 'End', 'Space']
        },
        focus: {
          requirements: [
            'One item focusable at a time',
            'Arrow down/up move between visible items',
            'Arrow right expands or moves to first child',
            'Arrow left collapses or moves to parent'
          ]
        }
      }
    };
  }

  /**
   * Validate widget patterns using results from all analyzers
   * @param {Object} analyzerResults - Combined results from analyzers
   * @returns {Object} Validation results
   */
  validate(analyzerResults) {
    this.reset();

    const { aria, keyboard, focus, events } = analyzerResults;

    // Detect patterns from analyzer results
    this.detectPatterns(aria, keyboard, focus, events);

    // Validate each detected pattern
    for (const pattern of this.patterns) {
      this.validatePattern(pattern, analyzerResults);
    }

    return this.getResults();
  }

  /**
   * Reset validator state
   */
  reset() {
    this.patterns = [];
    this.validations = [];
    this.issues = [];
  }

  /**
   * Detect widget patterns from analyzer results
   */
  detectPatterns(aria, keyboard, focus, events) {
    if (!aria && !keyboard) return;

    // Track detected patterns by type to avoid duplicates
    const detectedTypes = new Set();

    // Detect from ARIA roles
    if (aria?.roleChanges) {
      for (const roleChange of aria.roleChanges) {
        const pattern = this.detectPatternFromRole(roleChange.role);
        if (pattern && !detectedTypes.has(pattern)) {
          detectedTypes.add(pattern);
          this.patterns.push({
            type: pattern,
            source: 'aria-role',
            role: roleChange.role,
            element: roleChange.elementRef,
            location: roleChange.location
          });
        }
      }
    }

    // Detect from ARIA widget patterns (from ARIAAnalyzer)
    if (aria?.widgetPatterns) {
      for (const widget of aria.widgetPatterns) {
        const pattern = this.mapWidgetTypeToPattern(widget.type);
        if (pattern && !detectedTypes.has(pattern)) {
          detectedTypes.add(pattern);
          this.patterns.push({
            type: pattern,
            source: 'aria-widget',
            element: widget.element,
            isComplete: widget.isComplete,
            detectedRoles: widget.roles || []
          });
        }
      }
    }

    // Detect patterns from keyboard navigation
    if (keyboard?.navigationPatterns) {
      for (const navPattern of keyboard.navigationPatterns) {
        const pattern = this.detectPatternFromKeyboard(navPattern, keyboard);
        if (pattern && !detectedTypes.has(pattern)) {
          detectedTypes.add(pattern);
          this.patterns.push({
            type: pattern,
            source: 'keyboard',
            keyboardPattern: navPattern.type
          });
        }
      }
    }
  }

  /**
   * Detect pattern type from ARIA role
   */
  detectPatternFromRole(role) {
    const roleToPattern = {
      'dialog': 'dialog',
      'alertdialog': 'alertdialog',
      'menu': 'menu',
      'menubar': 'menu',
      'menuitem': 'menu',
      'menuitemcheckbox': 'menu',
      'menuitemradio': 'menu',
      'tablist': 'tabs',
      'tab': 'tabs',
      'tabpanel': 'tabs',
      'listbox': 'listbox',
      'option': 'listbox',
      'combobox': 'combobox',
      'tree': 'treeview',
      'treeitem': 'treeview',
      'grid': 'grid',
      'gridcell': 'grid',
      'row': 'grid',
      'slider': 'slider',
      'spinbutton': 'spinbutton',
      'checkbox': 'checkbox',
      'switch': 'switch',
      'radiogroup': 'radiogroup',
      'radio': 'radiogroup',
      'toolbar': 'toolbar',
      'tooltip': 'tooltip'
    };

    return roleToPattern[role] || null;
  }

  /**
   * Map ARIAAnalyzer widget type to pattern
   */
  mapWidgetTypeToPattern(widgetType) {
    const mapping = {
      'tabs': 'tabs',
      'dialog': 'dialog',
      'alertdialog': 'alertdialog',
      'menu': 'menu',
      'listbox': 'listbox',
      'combobox': 'combobox',
      'tree': 'treeview',
      'grid': 'grid'
    };
    return mapping[widgetType] || null;
  }

  /**
   * Detect pattern from keyboard navigation
   */
  detectPatternFromKeyboard(navPattern, keyboard) {
    // Arrow navigation could indicate various patterns
    if (navPattern.type === 'arrow-navigation') {
      if (navPattern.directions?.bidirectional) {
        // Could be grid, tree, or other 2D widget
        return null; // Need more context
      }
      if (navPattern.directions?.horizontal) {
        // Could be tabs, toolbar, menu
        return null;
      }
      if (navPattern.directions?.vertical) {
        // Could be listbox, menu, tree
        return null;
      }
    }

    // Tab handling with Escape often indicates dialog
    if (navPattern.type === 'tab-handling') {
      const hasEscape = keyboard.keyChecks?.some(k =>
        ['Escape', 'Esc'].includes(k.key) || k.key === 27
      );
      if (hasEscape) {
        return 'dialog';
      }
    }

    return null;
  }

  /**
   * Validate a detected pattern
   */
  validatePattern(pattern, analyzerResults) {
    const patternDef = this.widgetPatterns[pattern.type];
    if (!patternDef) return;

    const validation = {
      pattern: pattern.type,
      patternName: patternDef.name,
      element: pattern.element,
      source: pattern.source,
      url: patternDef.url,
      checks: [],
      passed: 0,
      failed: 0,
      warnings: 0
    };

    // Validate ARIA requirements
    if (this.options.validateAria) {
      this.validateAriaRequirements(pattern, patternDef, analyzerResults.aria, validation);
    }

    // Validate keyboard requirements
    if (this.options.validateKeyboard) {
      this.validateKeyboardRequirements(pattern, patternDef, analyzerResults.keyboard, validation);
    }

    // Validate focus requirements
    if (this.options.validateFocus) {
      this.validateFocusRequirements(pattern, patternDef, analyzerResults.focus, validation);
    }

    this.validations.push(validation);
  }

  /**
   * Validate ARIA requirements for a pattern
   */
  validateAriaRequirements(pattern, patternDef, aria, validation) {
    if (!aria) {
      validation.checks.push({
        type: 'aria',
        status: 'skipped',
        message: 'No ARIA data available'
      });
      return;
    }

    // Check required roles
    for (const role of patternDef.roles.required) {
      const hasRole = aria.roleChanges?.some(r => r.role === role) ||
                     pattern.detectedRoles?.includes(role);

      if (hasRole) {
        validation.checks.push({
          type: 'aria-role',
          status: 'pass',
          message: `Required role "${role}" is present`
        });
        validation.passed++;
      } else {
        validation.checks.push({
          type: 'aria-role',
          status: 'fail',
          message: `Missing required role "${role}"`,
          severity: 'error'
        });
        validation.failed++;
        this.addIssue('error', pattern, `Missing required ARIA role "${role}" for ${patternDef.name} pattern`);
      }
    }

    // Check required attributes
    for (const attr of patternDef.attributes.required) {
      const hasAttr = aria.ariaAttributes?.some(a => a.attribute === attr);

      if (hasAttr) {
        validation.checks.push({
          type: 'aria-attr',
          status: 'pass',
          message: `Required attribute "${attr}" is present`
        });
        validation.passed++;
      } else {
        const severity = this.options.strictMode ? 'error' : 'warning';
        validation.checks.push({
          type: 'aria-attr',
          status: this.options.strictMode ? 'fail' : 'warn',
          message: `Missing required attribute "${attr}"`,
          severity
        });
        if (this.options.strictMode) {
          validation.failed++;
        } else {
          validation.warnings++;
        }
        this.addIssue(severity, pattern, `Missing required ARIA attribute "${attr}" for ${patternDef.name} pattern`);
      }
    }

    // Check recommended attributes (as info)
    for (const attr of patternDef.attributes.recommended) {
      const hasAttr = aria.ariaAttributes?.some(a => a.attribute === attr);

      if (!hasAttr) {
        validation.checks.push({
          type: 'aria-attr',
          status: 'info',
          message: `Recommended attribute "${attr}" not detected`
        });
      }
    }
  }

  /**
   * Validate keyboard requirements for a pattern
   */
  validateKeyboardRequirements(pattern, patternDef, keyboard, validation) {
    if (!keyboard) {
      validation.checks.push({
        type: 'keyboard',
        status: 'skipped',
        message: 'No keyboard data available'
      });
      return;
    }

    const detectedKeys = new Set(
      keyboard.keyChecks?.map(k => this.normalizeKey(k.key)) || []
    );

    // Check required keys
    for (const key of patternDef.keyboard.required) {
      const normalizedKey = this.normalizeKey(key);
      const hasKey = detectedKeys.has(normalizedKey);

      if (hasKey) {
        validation.checks.push({
          type: 'keyboard',
          status: 'pass',
          message: `Required key "${key}" handling detected`
        });
        validation.passed++;
      } else {
        const severity = this.options.strictMode ? 'error' : 'warning';
        validation.checks.push({
          type: 'keyboard',
          status: this.options.strictMode ? 'fail' : 'warn',
          message: `Missing required key "${key}" handling`,
          severity
        });
        if (this.options.strictMode) {
          validation.failed++;
        } else {
          validation.warnings++;
        }
        this.addIssue(severity, pattern, `${patternDef.name} pattern should handle "${key}" key per WAI-ARIA APG`);
      }
    }

    // Check recommended keys (as info)
    for (const key of patternDef.keyboard.recommended) {
      const normalizedKey = this.normalizeKey(key);
      const hasKey = detectedKeys.has(normalizedKey);

      if (!hasKey) {
        validation.checks.push({
          type: 'keyboard',
          status: 'info',
          message: `Recommended key "${key}" handling not detected`
        });
      }
    }
  }

  /**
   * Validate focus requirements for a pattern
   */
  validateFocusRequirements(pattern, patternDef, focus, validation) {
    if (!focus) {
      validation.checks.push({
        type: 'focus',
        status: 'skipped',
        message: 'No focus data available'
      });
      return;
    }

    // Check for focus management presence
    const hasFocusManagement = focus.focusCalls?.length > 0 ||
                              focus.tabIndexChanges?.length > 0;

    if (patternDef.focus.requirements.length > 0) {
      if (hasFocusManagement) {
        validation.checks.push({
          type: 'focus',
          status: 'pass',
          message: 'Focus management detected'
        });
        validation.passed++;
      } else {
        validation.checks.push({
          type: 'focus',
          status: 'info',
          message: 'No explicit focus management detected',
          requirements: patternDef.focus.requirements
        });
      }
    }

    // Pattern-specific focus checks
    if (['dialog', 'alertdialog'].includes(pattern.type)) {
      this.validateDialogFocus(pattern, patternDef, focus, validation);
    }
  }

  /**
   * Validate dialog-specific focus requirements
   */
  validateDialogFocus(pattern, patternDef, focus, validation) {
    // Check for focus trap indicator (multiple focus calls or tab handling)
    const multipleFocusCalls = (focus.focusCalls?.length || 0) > 1;
    const hasTabHandling = focus.focusPatterns?.some(p =>
      p.type === 'focus-in-event' && p.eventType === 'keydown'
    );

    if (!multipleFocusCalls && !hasTabHandling) {
      validation.checks.push({
        type: 'focus',
        status: 'warn',
        message: 'Dialog may not have focus trapping implemented',
        severity: 'warning'
      });
      validation.warnings++;
      this.addIssue('warning', pattern, 'Dialog should trap focus within it - no focus trap pattern detected');
    }
  }

  /**
   * Normalize key name for comparison
   */
  normalizeKey(key) {
    const normalizations = {
      ' ': 'Space',
      'Esc': 'Escape',
      'Up': 'ArrowUp',
      'Down': 'ArrowDown',
      'Left': 'ArrowLeft',
      'Right': 'ArrowRight'
    };
    return normalizations[key] || key;
  }

  /**
   * Add an issue
   */
  addIssue(severity, pattern, message) {
    this.issues.push({
      severity,
      pattern: pattern.type,
      element: pattern.element,
      message,
      url: this.widgetPatterns[pattern.type]?.url
    });
  }

  /**
   * Get validation results
   */
  getResults() {
    const totalPassed = this.validations.reduce((sum, v) => sum + v.passed, 0);
    const totalFailed = this.validations.reduce((sum, v) => sum + v.failed, 0);
    const totalWarnings = this.validations.reduce((sum, v) => sum + v.warnings, 0);

    return {
      patterns: this.patterns,
      validations: this.validations,
      issues: this.issues,
      summary: {
        patternsDetected: this.patterns.length,
        totalChecks: totalPassed + totalFailed + totalWarnings,
        passed: totalPassed,
        failed: totalFailed,
        warnings: totalWarnings
      },

      // Convenience methods
      hasPatterns: () => this.patterns.length > 0,

      getPatternsByType: (type) =>
        this.patterns.filter(p => p.type === type),

      getValidationByPattern: (type) =>
        this.validations.find(v => v.pattern === type),

      getIssuesBySeverity: (severity) =>
        this.issues.filter(i => i.severity === severity),

      hasErrors: () =>
        this.issues.some(i => i.severity === 'error'),

      hasWarnings: () =>
        this.issues.some(i => i.severity === 'warning'),

      isValid: () =>
        !this.issues.some(i => i.severity === 'error')
    };
  }

  /**
   * Generate a validation report
   */
  getReport() {
    const lines = [
      'Widget Pattern Validation Report',
      '================================',
      '',
      `Patterns Detected: ${this.patterns.length}`,
      ''
    ];

    if (this.patterns.length === 0) {
      lines.push('No widget patterns detected in the code.');
      return lines.join('\n');
    }

    // List detected patterns
    lines.push('Detected Patterns:');
    for (const pattern of this.patterns) {
      const def = this.widgetPatterns[pattern.type];
      lines.push(`  - ${def?.name || pattern.type} (from ${pattern.source})`);
    }
    lines.push('');

    // Validation results per pattern
    for (const validation of this.validations) {
      lines.push(`${validation.patternName} Validation:`);
      lines.push(`  Reference: ${validation.url}`);
      lines.push(`  Checks: ${validation.passed} passed, ${validation.failed} failed, ${validation.warnings} warnings`);

      const failedChecks = validation.checks.filter(c => c.status === 'fail' || c.status === 'warn');
      if (failedChecks.length > 0) {
        lines.push('  Issues:');
        for (const check of failedChecks) {
          const icon = check.status === 'fail' ? '!' : '?';
          lines.push(`    [${icon}] ${check.message}`);
        }
      }
      lines.push('');
    }

    // Summary
    const summary = this.getResults().summary;
    lines.push('Summary:');
    lines.push(`  Total checks: ${summary.totalChecks}`);
    lines.push(`  Passed: ${summary.passed}`);
    lines.push(`  Failed: ${summary.failed}`);
    lines.push(`  Warnings: ${summary.warnings}`);

    if (summary.failed === 0 && summary.warnings === 0) {
      lines.push('');
      lines.push('[+] All detected patterns follow WAI-ARIA Authoring Practices');
    }

    return lines.join('\n');
  }

  /**
   * Get pattern documentation
   */
  getPatternDocumentation(patternType) {
    const pattern = this.widgetPatterns[patternType];
    if (!pattern) return null;

    return {
      name: pattern.name,
      description: pattern.description,
      url: pattern.url,
      requiredRoles: pattern.roles.required,
      recommendedRoles: pattern.roles.recommended,
      requiredAttributes: pattern.attributes.required,
      recommendedAttributes: pattern.attributes.recommended,
      requiredKeys: pattern.keyboard.required,
      recommendedKeys: pattern.keyboard.recommended,
      focusRequirements: pattern.focus.requirements
    };
  }

  /**
   * List all supported patterns
   */
  getSupportedPatterns() {
    return Object.keys(this.widgetPatterns).map(key => ({
      id: key,
      name: this.widgetPatterns[key].name,
      description: this.widgetPatterns[key].description,
      url: this.widgetPatterns[key].url
    }));
  }
}

module.exports = WidgetPatternValidator;
