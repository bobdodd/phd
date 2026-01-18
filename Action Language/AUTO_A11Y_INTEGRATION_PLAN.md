# Paradise + auto_a11y_python Integration Plan
## Building New Analyzers from auto_a11y Touchpoints

**Created**: 2026-01-18
**Purpose**: Plan for building new Paradise analyzers based on auto_a11y_python's comprehensive accessibility test suite.

---

## Executive Summary

The auto_a11y_python repository contains **~170 accessibility tests** across **27 touchpoint categories**. This document categorizes each touchpoint by its relevance to **source code analysis** (Paradise's domain) vs. **runtime-only testing** (auto_a11y's domain).

**Key Finding**: Approximately **60-70% of auto_a11y tests can be adapted** for source code analysis in Paradise, covering critical WCAG criteria that are currently missing from Paradise's framework.

---

## Methodology

Tests are categorized into three groups:

1. **SOURCE CODE DETECTABLE** ✅: Can be reliably detected by parsing HTML/JS/CSS source
2. **RUNTIME ONLY** ❌: Requires browser rendering, computed styles, or dynamic behavior
3. **HYBRID** ⚠️: Partially detectable in source with caveats or reduced confidence

---

## Current Paradise Coverage

Paradise currently has **13 analyzers** focused on **interactive behaviors**:
- ARIASemanticAnalyzer
- FocusManagementAnalyzer
- FocusOrderConflictAnalyzer
- KeyboardNavigationAnalyzer
- MissingAriaConnectionAnalyzer
- MouseOnlyClickAnalyzer
- OrphanedEventHandlerAnalyzer
- ReactA11yAnalyzer (includes hooks, portals, stopPropagation)
- VisibilityFocusConflictAnalyzer
- WidgetPatternAnalyzer (21 ARIA patterns)
- AngularReactivityAnalyzer
- VueReactivityAnalyzer
- SvelteReactivityAnalyzer

**Paradise's Strength**: Deep analysis of JavaScript behaviors, event handling, focus management, ARIA semantics, and framework-specific patterns.

**Gaps in Coverage**: Structural HTML issues (headings, images, forms, links, landmarks, tables, lists, page structure, semantic HTML).

---

## Touchpoint Analysis

### 1. HEADINGS ✅ SOURCE CODE DETECTABLE
**Priority**: ⭐⭐⭐ CRITICAL
**Tests**: 10 tests
- ErrEmptyHeading
- ErrHeadingLevelsSkipped
- ErrNoH1OnPage
- ErrMultipleH1HeadingsOnPage
- ErrHeadingsDontStartWithH1
- ErrNoHeadingsOnPage
- WarnHeadingInsideDisplayNone
- WarnHeadingLevelTooLong
- WarnHeadingNearLengthLimit
- WarnAriaLevelWithoutRole

**WCAG**: 1.3.1, 2.4.1, 2.4.6, 2.4.10

**Paradise Applicability**: ✅ EXCELLENT (95% confidence)

**What can be detected**:
- All heading elements (h1-h6)
- Elements with [role="heading"][aria-level]
- Heading hierarchy (sequential 1→2→3, not 1→3)
- Multiple or missing H1
- Empty headings (no text content)
- aria-level without role attribute
- Heading text length
- Hidden headings (display:none, visibility:hidden - with caveat)

**Recommended Analyzer**: `HeadingStructureAnalyzer` (NEW)

**Implementation**:
```typescript
class HeadingStructureAnalyzer extends BaseAnalyzer {
  analyze(context: AnalyzerContext): Issue[] {
    // Parse h1-h6 + [role="heading"]
    // Build hierarchy tree
    // Validate:
    // - Exactly one H1
    // - No skipped levels (1→2→3, not 1→3)
    // - No empty headings
    // - Proper aria-level usage
    // - Length warnings (>60 chars)
  }
}
```

**WCAG Mapping**:
- 1.3.1 (Info and Relationships): Heading hierarchy
- 2.4.1 (Bypass Blocks): Navigation via headings
- 2.4.6 (Headings and Labels): Descriptive headings
- 2.4.10 (Section Headings): Organize content

---

### 2. IMAGES ⚠️ HYBRID
**Priority**: ⭐⭐⭐ CRITICAL
**Tests**: 12 tests
- ErrImageMissingAlt
- ErrImageAltEmpty
- ErrImageAltTooLong
- ErrImageAltGeneric
- ErrImageWithImgFileExtensionAlt
- ErrSvgMissingAccessibleName
- ErrSvgMissingRole
- WarnImageAltRedundant
- WarnImageAltTooShort
- WarnImageAltSuspicious
- DiscoDecorativeImage
- DiscoIconImage

**WCAG**: 1.1.1, 4.1.2

**Paradise Applicability**: ⚠️ GOOD (70% confidence)

**What CAN be detected**:
- ✅ Missing alt attribute (ERROR - high confidence)
- ✅ Empty alt on non-decorative images (needs heuristics)
- ✅ Alt text length (>150 chars warning, <10 chars warning)
- ✅ Generic alt text ("image", "picture", "photo", "graphic")
- ✅ File extensions in alt ("photo.jpg", "banner.png")
- ✅ SVG without role="img" or aria-label
- ✅ Redundant alt (matches nearby text - medium confidence)
- ✅ Decorative images (alt="" is correct - discovery only)

**What CANNOT be detected**:
- ❌ Whether alt text accurately describes visual content
- ❌ Whether image is truly decorative vs. informational (heuristics only)
- ❌ Context-appropriateness of alt text

**Recommended Analyzer**: `ImageAccessibilityAnalyzer` (NEW)

**Implementation**:
```typescript
class ImageAccessibilityAnalyzer extends BaseAnalyzer {
  analyze(context: AnalyzerContext): Issue[] {
    // Parse: <img>, <svg>, <picture>, CSS background-image (limited)

    // ERRORS (high confidence):
    // - No alt attribute
    // - Generic alt patterns (regex matching)
    // - File extension in alt
    // - SVG missing accessibility

    // WARNINGS (medium confidence):
    // - Alt too long (>150 chars)
    // - Alt suspiciously short (<10 chars, not decorative)
    // - Redundant alt (matches nearby heading/text)

    // DISCOVERY:
    // - Decorative images (alt="" - correct usage)
    // - Icon images (size heuristics, class names)
  }
}
```

**Pattern Detection**:
- Generic words: /\b(image|picture|photo|graphic|icon)\b/i
- File extensions: /\.(jpg|jpeg|png|gif|svg|webp|bmp)/i
- Redundancy: Compare alt text with surrounding h1-h6, <p>, <li>
- Icon heuristics: width/height <50px, class contains "icon"

---

### 3. FORMS ✅ SOURCE CODE DETECTABLE
**Priority**: ⭐⭐⭐ CRITICAL
**Tests**: 27 tests (largest category!)
- ErrFormControlNoLabel
- ErrInvalidAriaLabelledby
- ErrRequiredFieldNoIndicator
- ErrFieldsetNoLegend
- ErrAutocompleteInvalid
- ErrInputTypeWrong
- ErrFormNoLandmark
- ErrLabelEmptyFor
- ErrMultipleLabelsOneFor
- ErrAriaDescribedbyInvalid
- WarnFormNoHeading
- WarnFormNoSubmitButton
- ... (many more)

**WCAG**: 1.3.1, 3.3.1, 3.3.2, 3.3.3, 3.3.4, 4.1.2

**Paradise Applicability**: ✅ EXCELLENT (90% confidence)

**What can be detected**:
- ✅ Every input has accessible label (for/id, wrapping, aria-label)
- ✅ aria-labelledby references valid IDs
- ✅ aria-describedby references valid IDs
- ✅ Required fields have indicators (required attr, aria-required)
- ✅ Radio/checkbox groups use fieldset+legend
- ✅ Autocomplete attribute values (valid tokens)
- ✅ Input types appropriate (email, tel, url, etc.)
- ✅ Form landmarks (<form> or role="form")
- ✅ Submit buttons present
- ✅ Error message associations

**Recommended Analyzer**: `FormAccessibilityAnalyzer` (NEW)

**Implementation**:
```typescript
class FormAccessibilityAnalyzer extends BaseAnalyzer {
  analyze(context: AnalyzerContext): Issue[] {
    // Parse: <form>, <input>, <select>, <textarea>, <label>, <fieldset>

    // Check label association:
    // 1. <label for="id"> matches <input id="id">
    // 2. <label><input></label> (wrapping)
    // 3. aria-labelledby points to existing element
    // 4. aria-label present
    // 5. title attribute (warning - not ideal)

    // Validate ARIA references:
    // - aria-labelledby → element exists
    // - aria-describedby → element exists
    // - aria-errormessage → element exists

    // Check groups:
    // - Radio buttons: same name, fieldset+legend
    // - Checkboxes: related checkboxes in fieldset

    // Validate autocomplete:
    // - Check against WCAG 2.1 token list
    // - name, email, tel, street-address, etc.

    // Check required indicators:
    // - required attribute present
    // - OR aria-required="true"
    // - Visual indicator (asterisk, "(required)" text)
  }
}
```

**Complexity**: HIGH - Most comprehensive analyzer, many edge cases

---

### 4. BUTTONS ⚠️ HYBRID
**Priority**: ⭐⭐ HIGH
**Tests**: 12 tests
- ErrEmptyButton
- ErrButtonMissingType
- ErrButtonDisabledNoExplanation
- ErrButtonContrastFail (runtime only)
- ErrButtonNoFocusIndicator (runtime only)
- ... more visual tests

**WCAG**: 2.4.7, 4.1.2

**Paradise Applicability**: ⚠️ MODERATE (60% - structural only)

**What CAN be detected**:
- ✅ Empty buttons (no text, no aria-label)
- ✅ Missing type attribute (defaults to submit)
- ✅ Disabled without explanation (no aria-describedby)
- ✅ Icon-only buttons without accessible name
- ✅ role="button" without tabindex

**What CANNOT be detected**:
- ❌ Visual focus indicators (outline, box-shadow)
- ❌ Color contrast
- ❌ Touch target size

**Recommended Analyzer**: `ButtonAccessibilityAnalyzer` (NEW)

**Implementation Notes**: Focus on structural issues only, skip visual

---

### 5. LINKS ⚠️ HYBRID
**Priority**: ⭐⭐ HIGH
**Tests**: 11 tests
- ErrLinkTextAmbiguous
- ErrLinkOpensNewWindow
- ErrLinkEmptyHref
- ErrLinkColorOnlyVisualCue (runtime)
- ErrLinkNoUnderline (runtime)
- ... more

**WCAG**: 2.4.4, 2.4.9, 3.2.5

**Paradise Applicability**: ⚠️ GOOD (70% confidence)

**What CAN be detected**:
- ✅ Ambiguous link text ("click here", "read more", "more", "here")
- ✅ target="_blank" without warning (missing rel, aria-label, title)
- ✅ Empty href or href="#"
- ✅ Empty links (no text or aria-label)
- ✅ Duplicate link text pointing to different URLs
- ⚠️ Underline detection (check text-decoration in style attr)

**What CANNOT be detected**:
- ❌ Color-only link differentiation (requires computed styles)
- ❌ Focus indicator quality

**Recommended Analyzer**: `LinkAccessibilityAnalyzer` (NEW)

**Ambiguous Text Patterns**:
```typescript
const AMBIGUOUS_PATTERNS = [
  /^(click here|here|more|read more|learn more|details|info|link)$/i,
  /^continue$/i,
  /^next$/i,
  /^previous$/i,
];
```

---

### 6. NAVIGATION ✅ SOURCE CODE DETECTABLE
**Priority**: ⭐⭐ HIGH
**Tests**: 6 tests
- ErrDuplicateNavNames
- ErrNavMissingAccessibleName
- ErrNoCurrentPageIndicator
- WarnNavNoLandmark
- ... more

**WCAG**: 2.4.1, 4.1.2

**Paradise Applicability**: ✅ EXCELLENT (90% confidence)

**Recommended Action**: Extend `WidgetPatternAnalyzer` or create `NavigationAnalyzer`

---

### 7. COLORS/CONTRAST ❌ RUNTIME ONLY
**Priority**: N/A
**Tests**: 8 tests (all contrast-related)

**Paradise Applicability**: ❌ NOT SUITABLE
- Requires computed styles after CSS cascade
- Requires background calculation (gradients, images, inheritance)
- **Keep in auto_a11y_python**

---

### 8. KEYBOARD NAVIGATION ✅ ALREADY COVERED
**Priority**: ⭐⭐⭐ (already implemented)
**Tests**: 8 tests

**Paradise Status**: ✅ Current analyzers handle this well
- KeyboardNavigationAnalyzer
- MouseOnlyClickAnalyzer
- OrphanedEventHandlerAnalyzer

**Recommended Action**: Compare auto_a11y tests with Paradise, fill any gaps

---

### 9. LANDMARKS ✅ SOURCE CODE DETECTABLE
**Priority**: ⭐⭐⭐ CRITICAL
**Tests**: 8 tests
- ErrMissingMain
- ErrMultipleBanner
- ErrMultipleContentinfo
- ErrDuplicateLandmarkNames
- WarnLandmarkNoLabel
- ... more

**WCAG**: 1.3.1, 2.4.1

**Paradise Applicability**: ✅ EXCELLENT (95% confidence)

**What can be detected**:
- ✅ Missing main landmark
- ✅ Multiple banner/contentinfo (outside article/aside)
- ✅ Duplicate landmark names without differentiation
- ✅ Landmarks missing accessible names
- ✅ Complementary landmarks without labels

**Recommended Analyzer**: `LandmarkAnalyzer` (NEW)

**Implementation**:
```typescript
class LandmarkAnalyzer extends BaseAnalyzer {
  analyze(context: AnalyzerContext): Issue[] {
    // Parse: <main>, <nav>, <header>, <footer>, <aside>, <section>
    // Also: [role="main|navigation|banner|contentinfo|complementary|search|region"]

    // Check:
    // 1. Exactly one main landmark per page
    // 2. Maximum one banner (unless in article/aside)
    // 3. Maximum one contentinfo (unless in article/aside)
    // 4. Multiple same-type landmarks have unique aria-label
    // 5. <section> and complementary need accessible names
  }
}
```

---

### 10. LANGUAGE ✅ SOURCE CODE DETECTABLE
**Priority**: ⭐ MEDIUM
**Tests**: 5 tests
- ErrMissingLang
- ErrInvalidLangCode
- ErrLangChangeNoAttribute
- ... more

**WCAG**: 3.1.1, 3.1.2

**Paradise Applicability**: ✅ EXCELLENT (100% confidence)

**Recommended Analyzer**: `LanguageAnalyzer` (NEW)

**Implementation**:
```typescript
// Validate against ISO 639-1 language codes
const VALID_LANG_CODES = ['en', 'es', 'fr', 'de', 'zh', ...];

// Check:
// - <html lang="en">
// - <span lang="es">texto en español</span>
// - <a href="..." hreflang="fr">
```

---

### 11. TABLES ✅ SOURCE CODE DETECTABLE
**Priority**: ⭐ MEDIUM
**Tests**: 4 tests
- ErrTableMissingCaption
- ErrTableMissingHeaders
- ErrTableHeaderNoScope
- WarnLayoutTableNoRole

**WCAG**: 1.3.1

**Paradise Applicability**: ✅ EXCELLENT (90% confidence)

**Recommended Analyzer**: `TableAccessibilityAnalyzer` (NEW)

---

### 12. LISTS ✅ SOURCE CODE DETECTABLE
**Priority**: ⭐ MEDIUM
**Tests**: 5 tests
- ErrEmptyList
- ErrFakeListImplementation
- ErrImproperListNesting
- ... more

**WCAG**: 1.3.1

**Paradise Applicability**: ✅ EXCELLENT (90% confidence)

**Recommended Analyzer**: `ListStructureAnalyzer` (NEW)

---

### 13. MEDIA ⚠️ HYBRID
**Priority**: ⭐ MEDIUM
**Tests**: 5 tests
- ErrVideoNoControls
- ErrAutoplayNoUserControl
- ErrIframeMissingTitle
- ... more

**WCAG**: 1.2.1, 1.2.2, 2.2.2, 4.1.2

**Paradise Applicability**: ⚠️ MODERATE (50% - structural only)

**What CAN be detected**:
- ✅ Missing controls attribute
- ✅ Autoplay without user control
- ✅ iframe without title

**What CANNOT be detected**:
- ❌ Whether captions/transcripts actually exist
- ❌ Caption quality

**Recommended Analyzer**: `MediaAccessibilityAnalyzer` (limited scope, low priority)

---

### 14. DIALOGS/MODALS ⚠️ HYBRID
**Priority**: ⭐⭐ HIGH (already partially covered)
**Tests**: 7 tests

**Paradise Status**: Partially covered by `WidgetPatternAnalyzer` (incomplete-dialog-pattern)

**Recommended Action**: Enhance existing dialog detection

---

### 15-17. RUNTIME ONLY CATEGORIES ❌
- **Animation**: Requires animation detection
- **Timers**: Requires runtime execution
- **Fonts/Text**: Requires computed styles

**Paradise Applicability**: ❌ NOT SUITABLE - Keep in auto_a11y_python

---

### 18. SEMANTIC STRUCTURE ✅ SOURCE CODE DETECTABLE
**Priority**: ⭐ MEDIUM
**Tests**: 4 tests
- ErrHeaderScopeInvalid
- ErrInvalidTabindex
- ErrMissingDoctype
- ... more

**WCAG**: 1.3.1, 2.4.3, 4.1.1

**Recommended Action**: Integrate into existing analyzers

---

### 19. ARIA ✅ ALREADY COVERED
**Priority**: ⭐⭐⭐ (already implemented)
**Tests**: 17 tests

**Paradise Status**: ✅ Well covered by `ARIASemanticAnalyzer`

**Recommended Action**: Compare with auto_a11y, enhance if gaps found

---

### 20-21. ALREADY COVERED
- **Focus Management**: ✅ FocusManagementAnalyzer
- **Event Handling**: ✅ MouseOnlyClickAnalyzer, OrphanedEventHandlerAnalyzer

---

### 22. ACCESSIBLE NAMES ✅ SOURCE CODE DETECTABLE
**Priority**: ⭐⭐⭐ CRITICAL
**Tests**: 2 tests (apply broadly)
- ErrMissingAccessibleName
- WarnGenericAccessibleName

**WCAG**: 4.1.2

**Paradise Applicability**: ✅ EXCELLENT (85% confidence)

**Recommended Analyzer**: `AccessibleNameAnalyzer` (NEW)

**Implementation**:
```typescript
class AccessibleNameAnalyzer extends BaseAnalyzer {
  // Compute accessible name using ARIA specification priority order:
  // 1. aria-labelledby (highest priority)
  // 2. aria-label
  // 3. <label for="id">
  // 4. Text content (for buttons, links)
  // 5. title attribute (warning - should not be primary)
  // 6. alt attribute (for images)
  // 7. placeholder (warning - insufficient)

  // Check generic names:
  // - "button", "link", "image", "input", "submit", "click here"

  // Apply to:
  // - All interactive elements (button, a, input, select, textarea)
  // - All ARIA widgets (role="button", role="link", etc.)
  // - Images (<img>, <svg>)
  // - Landmarks (when duplicated)
}
```

---

### 23-27. LOWER PRIORITY / NICHE
- **Maps**: Low priority, uncommon pattern
- **Documents**: PDF/Word link detection (low priority)
- **Page**: Covered by PageStructureAnalyzer
- **Title Attributes**: Integrate into other analyzers
- **Touch/Mobile**: Not source-detectable

---

## Implementation Roadmap

### Phase 1: Critical Structural Issues (10-12 weeks)
**Goal**: Cover most common WCAG failures detectable in source

**Priority Order**:

1. **HeadingStructureAnalyzer** ⭐⭐⭐
   - Time: 2-3 weeks
   - Tests: 10
   - Impact: CRITICAL (extremely common issues)
   - WCAG: 1.3.1, 2.4.1, 2.4.6, 2.4.10

2. **FormAccessibilityAnalyzer** ⭐⭐⭐
   - Time: 4-5 weeks
   - Tests: 27 (most complex)
   - Impact: CRITICAL (affects user input)
   - WCAG: 1.3.1, 3.3.1, 3.3.2, 3.3.3, 3.3.4, 4.1.2

3. **ImageAccessibilityAnalyzer** ⭐⭐⭐
   - Time: 2-3 weeks
   - Tests: 12
   - Impact: CRITICAL (very common)
   - WCAG: 1.1.1, 4.1.2

4. **LandmarkAnalyzer** ⭐⭐⭐
   - Time: 2 weeks
   - Tests: 8
   - Impact: HIGH (navigation structure)
   - WCAG: 1.3.1, 2.4.1

5. **AccessibleNameAnalyzer** ⭐⭐⭐
   - Time: 2-3 weeks
   - Tests: 2 (but applies broadly)
   - Impact: CRITICAL (foundation for other checks)
   - WCAG: 4.1.2

### Phase 2: Navigation & Interaction (6-8 weeks)

6. **LinkAccessibilityAnalyzer** ⭐⭐
   - Time: 2-3 weeks
   - Tests: 11
   - Impact: HIGH
   - WCAG: 2.4.4, 2.4.9, 3.2.5

7. **ButtonAccessibilityAnalyzer** ⭐⭐
   - Time: 2 weeks
   - Tests: 12 (structural subset)
   - Impact: MEDIUM-HIGH
   - WCAG: 2.4.7, 4.1.2

8. **PageStructureAnalyzer** ⭐⭐
   - Time: 1 week
   - Tests: 7
   - Impact: HIGH (quick win)
   - WCAG: 2.4.2

### Phase 3: Semantic HTML (4-5 weeks)

9. **TableAccessibilityAnalyzer** ⭐
   - Time: 2 weeks
   - Tests: 4
   - Impact: MEDIUM (niche but important)
   - WCAG: 1.3.1

10. **ListStructureAnalyzer** ⭐
    - Time: 1-2 weeks
    - Tests: 5
    - Impact: MEDIUM
    - WCAG: 1.3.1

11. **LanguageAnalyzer** ⭐
    - Time: 1 week
    - Tests: 5
    - Impact: MEDIUM (i18n sites)
    - WCAG: 3.1.1, 3.1.2

### Phase 4: Enhancements (3-4 weeks)

12. **Enhance Existing Analyzers**
    - Compare auto_a11y tests with current implementation
    - Add missing checks to ARIASemanticAnalyzer
    - Add missing checks to KeyboardNavigationAnalyzer
    - Enhance WidgetPatternAnalyzer dialog checks

13. **Optional: MediaAccessibilityAnalyzer**
    - Limited scope (structural checks only)
    - Low priority

---

## Testing Strategy

For each new analyzer:

1. **Port test fixtures** from auto_a11y_python
   - Use their test HTML as baseline
   - Adapt Python tests to TypeScript

2. **Reuse issue descriptions**
   - auto_a11y's issue_descriptions.py is authoritative
   - Port "what", "why", "who", "remediation" sections

3. **Match severity levels**
   - auto_a11y "Err*" → Paradise "error"
   - auto_a11y "Warn*" → Paradise "warning"
   - auto_a11y "Disco*" → Paradise "info"

4. **Include WCAG criteria**
   - Use auto_a11y's WCAG mappings
   - Add to issue metadata

5. **Create playground examples**
   - Live demos in Paradise playground
   - Before/after fix examples

6. **Document thoroughly**
   - Help files for each issue type
   - Fix examples with code

---

## Success Metrics

### Coverage Goals
- **80+ new test types** from auto_a11y
- **15+ new WCAG criteria** covered
- **6 new analyzers** implemented
- **Total: ~140 unique accessibility checks** (52 existing + 80+ new)

### Quality Goals
- **<10% false positive rate**
- **>90% test coverage** for new analyzers
- **<200ms analysis time** per file
- **100% documentation** coverage

### Integration Goals
- All follow `BaseAnalyzer` pattern
- Work in file and document scope
- Integrate with VS Code extension
- Appear in Paradise playground

---

## Technical Implementation Notes

### Accessible Name Computation
Implement ARIA accessible name algorithm:

```typescript
function computeAccessibleName(element: Element): string {
  // 1. aria-labelledby (can reference multiple IDs)
  if (element.hasAttribute('aria-labelledby')) {
    const ids = element.getAttribute('aria-labelledby').split(/\s+/);
    return ids.map(id => document.getElementById(id)?.textContent).join(' ');
  }

  // 2. aria-label
  if (element.hasAttribute('aria-label')) {
    return element.getAttribute('aria-label');
  }

  // 3. Label (for form controls)
  if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
    const id = element.getAttribute('id');
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) return label.textContent;

    // Wrapping label
    const wrappingLabel = element.closest('label');
    if (wrappingLabel) return wrappingLabel.textContent;
  }

  // 4. Text content (for buttons, links)
  if (element.tagName === 'BUTTON' || element.tagName === 'A') {
    return element.textContent?.trim();
  }

  // 5. alt (for images)
  if (element.tagName === 'IMG') {
    return element.getAttribute('alt');
  }

  // 6. title (fallback, with warning)
  if (element.hasAttribute('title')) {
    return element.getAttribute('title');
  }

  return '';
}
```

### Heading Hierarchy Validation

```typescript
function validateHeadingHierarchy(headings: Heading[]): Issue[] {
  const issues: Issue[] = [];
  let previousLevel = 0;

  for (const heading of headings) {
    const level = heading.level; // 1-6

    // Check for skipped levels
    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.push({
        type: 'heading-levels-skipped',
        severity: 'error',
        message: `Heading level jumps from H${previousLevel} to H${level}, skipping H${previousLevel + 1}`,
        location: heading.location,
        wcagCriteria: ['1.3.1'],
      });
    }

    previousLevel = level;
  }

  return issues;
}
```

---

## Integration with auto_a11y_python

### Shared Resources
- **WCAG mappings**: Use auto_a11y's authoritative mappings
- **Issue descriptions**: Port from issue_descriptions.py
- **Test fixtures**: Adapt Python test HTML

### Complementary Roles
- **Paradise**: Source code analysis (development-time)
- **auto_a11y_python**: Runtime testing (testing/CI)

**Together**: Comprehensive accessibility coverage

---

## Next Steps

1. **✅ User approval** of this plan
2. **Start Phase 1, Analyzer #1**: HeadingStructureAnalyzer
3. **Create test suite** from auto_a11y fixtures
4. **Document patterns** for replication
5. **Iterate** based on feedback

---

## Estimated Timeline

| Phase | Weeks | Analyzers | Tests Added | Cumulative |
|-------|-------|-----------|-------------|------------|
| Phase 1 | 10-12 | 5 | 60+ | 52 → 112+ |
| Phase 2 | 6-8 | 3 | 30+ | 112 → 142+ |
| Phase 3 | 4-5 | 3 | 14+ | 142 → 156+ |
| Phase 4 | 3-4 | Enhancements | 10+ | 156 → 166+ |
| **Total** | **23-29 weeks** | **11+ new** | **114+ tests** | **~166 total** |

**Target**: 6 months for complete implementation

---

## Conclusion

This plan will **triple Paradise's test coverage** from 52 to ~166 unique accessibility checks by integrating source-detectable tests from auto_a11y_python.

**Key Benefits**:
- Covers structural HTML issues (headings, forms, images, landmarks)
- Complements existing behavioral analysis
- Reuses auto_a11y's authoritative WCAG mappings
- Maintains clear separation: Paradise (source) vs. auto_a11y (runtime)

**Recommendation**: Start with Phase 1 to deliver immediate high-impact value.

