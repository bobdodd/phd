# Paradise Issue Documentation

Comprehensive help for all accessibility issues detected by Paradise.

## How to Use This Documentation

When Paradise detects an accessibility issue in VS Code:

1. **Hover over the squiggly line** to see the issue description, WCAG criteria, and confidence level
2. **Click the issue code** (e.g., `mouse-only-click`) in the diagnostic to open the detailed help page
3. **Press Ctrl+. (or Cmd+.)** to see available quick fixes

Each help page includes:
- **Description**: What the issue is and why it matters
- **The Problem**: Example code showing the issue
- **The Solution**: How to fix it with code examples
- **Common Patterns**: Real-world scenarios
- **Testing**: How to verify the fix works
- **Additional Resources**: Links to WCAG docs and tutorials

## Available Issue Documentation

### Keyboard Accessibility

- **[mouse-only-click](mouse-only-click.md)** - Click handler without keyboard equivalent
  - WCAG: 2.1.1 (Keyboard)
  - Severity: Warning
  - Quick Fix: ✓ Available

- **[potential-keyboard-trap](potential-keyboard-trap.md)** - Tab key intercepted with preventDefault without Escape handler
  - WCAG: 2.1.2 (No Keyboard Trap)
  - Severity: Warning
  - Quick Fix: ✓ Available

- **[screen-reader-conflict](screen-reader-conflict.md)** - Single-character keyboard shortcuts conflict with screen reader navigation
  - WCAG: 2.1.1, 2.1.4 (Keyboard, Character Key Shortcuts)
  - Severity: Warning
  - Quick Fix: ✓ Available

- **[deprecated-keycode](deprecated-keycode.md)** - Using deprecated event.keyCode or event.which
  - WCAG: 2.1.1 (Keyboard)
  - Severity: Info
  - Quick Fix: ✓ Available

- **[tab-without-shift](tab-without-shift.md)** - Tab key handler doesn't check event.shiftKey for reverse navigation
  - WCAG: 2.1.1 (Keyboard)
  - Severity: Info
  - Quick Fix: ✓ Available

- **[missing-escape-handler](missing-escape-handler.md)** - Modal or dialog without Escape key handler
  - WCAG: 2.1.2 (No Keyboard Trap)
  - Severity: Warning
  - Quick Fix: ✓ Available

- **[missing-arrow-navigation](missing-arrow-navigation.md)** - ARIA widget role without arrow key navigation
  - WCAG: 2.1.1, 4.1.2 (Keyboard, Name, Role, Value)
  - Severity: Info
  - Quick Fix: ✗ Manual implementation required

- **[screen-reader-arrow-conflict](screen-reader-arrow-conflict.md)** - Arrow key handlers interfere with screen reader browse mode
  - WCAG: 2.1.1 (Keyboard)
  - Severity: Info
  - Quick Fix: ✗ Manual fix required

### Code Integrity

- **[orphaned-event-handler](orphaned-event-handler.md)** - Event handler attached to non-existent element
  - WCAG: 4.1.2 (Name, Role, Value)
  - Severity: Error
  - Quick Fix: ✗ Manual fix required

### ARIA Relationships

- **[missing-aria-connection](missing-aria-connection.md)** - ARIA attribute references non-existent element
  - WCAG: 4.1.2, 1.3.1 (Info and Relationships)
  - Severity: Warning
  - Quick Fix: ✗ Manual fix required

### Focus Management

- **[removal-without-focus-management](removal-without-focus-management.md)** - Element removed without checking if it has focus
  - WCAG: 2.4.3, 2.4.7 (Focus Order, Focus Visible)
  - Severity: Warning
  - Quick Fix: ✓ Available

- **[hiding-without-focus-management](hiding-without-focus-management.md)** - Element hidden without checking if it has focus
  - WCAG: 2.4.3, 2.4.7 (Focus Order, Focus Visible)
  - Severity: Warning
  - Quick Fix: ✓ Available

- **[hiding-class-without-focus-management](hiding-class-without-focus-management.md)** - classList operation may hide element without focus check
  - WCAG: 2.4.7 (Focus Visible)
  - Severity: Info
  - Quick Fix: ✓ Available

- **[possibly-non-focusable](possibly-non-focusable.md)** - Attempting to focus element that may not be focusable
  - WCAG: 2.4.3, 4.1.2 (Focus Order, Name, Role, Value)
  - Severity: Warning
  - Quick Fix: ✓ Available

- **[standalone-blur](standalone-blur.md)** - Removing focus without explicitly moving it
  - WCAG: 2.4.7 (Focus Visible)
  - Severity: Info
  - Quick Fix: ✓ Available

- **[focus-restoration-missing](focus-restoration-missing.md)** - Modal/dialog closes without restoring focus
  - WCAG: 2.4.3 (Focus Order)
  - Severity: Warning
  - Quick Fix: ✓ Available

- **[focus-order-conflict](focus-order-conflict.md)** - Positive tabindex creates unpredictable focus order
  - WCAG: 2.4.3 (Focus Order)
  - Severity: Warning
  - Quick Fix: ✗ Manual fix required

### Visual & Interactive

- **[visibility-focus-conflict](visibility-focus-conflict.md)** - Element is focusable but visually hidden
  - WCAG: 2.4.7 (Focus Visible), 4.1.2 (Name, Role, Value)
  - Severity: Error
  - Quick Fix: ✗ Manual fix required

### React-Specific

- **[react-portal-accessibility](react-portal-accessibility.md)** - Portal renders outside parent DOM hierarchy
  - WCAG: 2.1.1, 2.4.3, 1.3.2, 4.1.2
  - Severity: Warning
  - Quick Fix: ✓ Comprehensive guidance

- **[react-stop-propagation](react-stop-propagation.md)** - stopPropagation blocks assistive technology events
  - WCAG: 2.1.1, 4.1.2
  - Severity: Warning/Error
  - Quick Fix: ✓ Alternative approaches

## Documentation Status

✅ **Complete**: Comprehensive help page with examples, testing, and resources
🚧 **In Progress**: Basic documentation available
📋 **Planned**: Not yet documented

| Issue Type | Status | WCAG | Severity |
|------------|--------|------|----------|
| mouse-only-click | ✅ | 2.1.1 | Warning |
| potential-keyboard-trap | ✅ | 2.1.2 | Warning |
| screen-reader-conflict | ✅ | 2.1.1, 2.1.4 | Warning |
| deprecated-keycode | ✅ | 2.1.1 | Info |
| tab-without-shift | ✅ | 2.1.1 | Info |
| missing-escape-handler | ✅ | 2.1.2 | Warning |
| missing-arrow-navigation | ✅ | 2.1.1, 4.1.2 | Info |
| screen-reader-arrow-conflict | ✅ | 2.1.1 | Info |
| orphaned-event-handler | ✅ | 4.1.2 | Error |
| missing-aria-connection | ✅ | 4.1.2, 1.3.1 | Warning |
| removal-without-focus-management | ✅ | 2.4.3, 2.4.7 | Warning |
| hiding-without-focus-management | ✅ | 2.4.3, 2.4.7 | Warning |
| hiding-class-without-focus-management | ✅ | 2.4.7 | Info |
| possibly-non-focusable | ✅ | 2.4.3, 4.1.2 | Warning |
| standalone-blur | ✅ | 2.4.7 | Info |
| focus-restoration-missing | ✅ | 2.4.3 | Warning |
| focus-order-conflict | ✅ | 2.4.3 | Warning |
| visibility-focus-conflict | ✅ | 2.4.7 | Error |
| react-portal-accessibility | ✅ | Various | Warning |
| react-stop-propagation | ✅ | 2.1.1 | Warning/Error |

## Contributing

Help us improve this documentation! If you:
- Find an issue that needs better explanation
- Have real-world examples to share
- Spot errors or omissions

Please [open an issue](https://github.com/bobdodd/paradise/issues) or submit a pull request.

## WCAG Quick Reference

Paradise maps issues to WCAG 2.1 success criteria:

- **[2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)** - All functionality available via keyboard
- **[2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap)** - Users can navigate away using keyboard alone
- **[2.1.4 Character Key Shortcuts](https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts)** - Single-character shortcuts can be turned off or remapped
- **[2.4.3 Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order)** - Navigation order is logical and intuitive
- **[2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible)** - Keyboard focus indicator is visible
- **[4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)** - UI components have accessible names and roles
- **[1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships)** - Structure and relationships are programmatically determined

## Additional Resources

### Official Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

### Testing Tools
- [NVDA Screen Reader](https://www.nvaccess.org/) (Windows, free)
- [JAWS Screen Reader](https://www.freedomscientific.com/products/software/jaws/) (Windows, commercial)
- [VoiceOver](https://www.apple.com/accessibility/voiceover/) (macOS/iOS, built-in)
- [axe DevTools](https://www.deque.com/axe/devtools/) (Browser extension)

### Learning Resources
- [WebAIM](https://webaim.org/) - Accessibility tutorials and articles
- [The A11Y Project](https://www.a11yproject.com/) - Community-driven accessibility resources
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) - Developer documentation

---

**Maintained by:** Paradise Development Team
**Last Updated:** January 2026
**License:** MIT
