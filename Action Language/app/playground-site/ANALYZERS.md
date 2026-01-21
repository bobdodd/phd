# Paradise Playground Analyzers

**Total: 35 Analyzers | 100+ Issue Types**

All analyzers run automatically in Paradise Playground when you write HTML, CSS, or JavaScript code.

## Quick Reference

### By WCAG Level

**Level A (Critical):**
- Keyboard access (2.1.1, 2.1.2)
- Text alternatives (1.1.1)
- Timing adjustments (2.2.1)
- Language attributes (3.1.1)
- Semantic structure (1.3.1)

**Level AA (Standard):**
- Color contrast (1.4.3)
- Focus management (2.4.3, 2.4.7)
- Input purpose (1.3.5)
- Orientation (1.3.4)
- Touch targets ≥24px (2.5.8)
- Status messages (4.1.3)

**Level AAA (Enhanced):**
- Touch targets ≥44px (2.5.5)
- Character shortcuts (2.1.4)

---

## Analyzer Categories

### 🎯 Behavioral (JavaScript + DOM) - 15 analyzers
Focus management, keyboard navigation, ARIA state management, event handlers

### 🏗️ Structural (HTML/DOM) - 10 analyzers
Headings, landmarks, forms, images, links, tables, language

### ⚛️ Framework-Specific - 4 analyzers
React, Angular, Vue, Svelte reactivity and accessibility patterns

### 🚀 Production Hardening (Sprint 14) - 6 analyzers
Color contrast, live regions, autocomplete, orientation, timeouts, touch targets

---

## Sprint 14 Production Analyzers (New!)

### ColorContrastAnalyzer
**WCAG 1.4.3** - Validates text/background contrast ratios
- Level AA: 4.5:1 (normal), 3:1 (large text)
- Level AAA: 7:1 (normal), 4.5:1 (large text)

### LiveRegionAnalyzer
**WCAG 4.1.3** - Ensures dynamic content announces to screen readers
- Detects aria-live without updates
- Validates politeness levels
- Identifies missing live regions

### AutocompleteAnalyzer
**WCAG 1.3.5** - Validates form autocomplete attributes
- Checks 53 HTML autocomplete tokens
- Suggests appropriate values
- Flags autocomplete="off" issues

### OrientationLockAnalyzer
**WCAG 1.3.4** - Prevents orientation locks
- Detects Screen Orientation API usage
- Identifies matchMedia restrictions
- Ensures content works in any orientation

### TimeoutAnalyzer
**WCAG 2.2.1** - Validates time limit controls
- Session timeouts need warnings
- Automatic redirects need control
- Validates 20-hour WCAG threshold

### PointerTargetAnalyzer
**WCAG 2.5.5/2.5.8** - Validates touch target sizes
- Level AA: ≥24×24px
- Level AAA: ≥44×44px
- Checks spacing between targets

---

## Most Common Issues Detected

1. **Missing keyboard handlers** - Click without Enter/Space
2. **Focus management errors** - Elements removed/hidden without focus checks
3. **Missing ARIA labels** - Interactive elements without labels
4. **Heading structure problems** - Skipped levels, missing H1
5. **Form label issues** - Inputs without associated labels
6. **Image alt text** - Missing or inadequate alt attributes
7. **Low color contrast** - Text hard to read for low vision users
8. **Missing live regions** - Dynamic content updates not announced
9. **Small touch targets** - Buttons/links too small to tap accurately
10. **Session timeouts** - Time limits without warnings or controls

---

## Testing Tips

### In Playground:
1. Write your HTML/CSS/JS code
2. Issues appear automatically in the right panel
3. Click "View Fix" to see recommended solutions
4. Click "Apply Fix" to auto-apply suggested code

### Issue Severity:
- 🔴 **Error:** Must fix (WCAG Level A, critical barriers)
- 🟡 **Warning:** Should fix (WCAG Level AA, usability barriers)
- 🔵 **Info:** Consider fixing (Level AAA, best practices)

### Test Coverage:
Each analyzer has comprehensive test files demonstrating:
- ❌ Error examples (what fails)
- ⚠️ Warning examples (what needs improvement)
- ℹ️ Info examples (recommendations)
- ✅ Compliant examples (correct implementations)

---

## Framework Support

### React
- Hooks accessibility validation
- Portal accessibility
- Event propagation issues
- Fragment keys and accessibility

### Angular
- Change detection and ARIA updates
- Template reactive bindings
- Async pipe accessibility

### Vue
- Reactive ARIA attributes
- v-model accessibility
- Computed property dependencies

### Svelte
- Reactive statements and ARIA
- Bind directive accessibility
- Store subscription patterns

---

## For More Information

- **Complete Analyzer List:** `/app/demo/COMPLETE_ANALYZER_LIST.md`
- **Paradise Website:** Detailed analyzer documentation with examples
- **Test Files:** `/test-*.html` files for each analyzer

---

**Last Updated:** January 2026
**Version:** Sprint 14 Complete (35/35 analyzers)
