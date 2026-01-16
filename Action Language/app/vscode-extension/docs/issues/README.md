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

- **focus-order-conflict** (documentation coming soon)
  - WCAG: 2.4.3 (Focus Order)
  - Severity: Warning

### Visual & Interactive

- **visibility-focus-conflict** (documentation coming soon)
  - WCAG: 2.4.7 (Focus Visible)
  - Severity: Warning

## Documentation Status

✅ **Complete**: Comprehensive help page with examples, testing, and resources
🚧 **In Progress**: Basic documentation available
📋 **Planned**: Not yet documented

| Issue Type | Status | WCAG | Severity |
|------------|--------|------|----------|
| mouse-only-click | ✅ | 2.1.1 | Warning |
| orphaned-event-handler | ✅ | 4.1.2 | Error |
| missing-aria-connection | ✅ | 4.1.2, 1.3.1 | Warning |
| focus-order-conflict | 📋 | 2.4.3 | Warning |
| visibility-focus-conflict | 📋 | 2.4.7 | Warning |
| react-portal-accessibility | 📋 | Various | Warning |
| react-stop-propagation | 📋 | 2.1.1 | Info |

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
