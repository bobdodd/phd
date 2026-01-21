'use client';

import Link from 'next/link';

interface AnalyzerInfo {
  name: string;
  description: string;
  issueTypes: string[];
  color: string; // Tailwind color class
  category: string;
}

const ANALYZERS: AnalyzerInfo[] = [
  {
    name: 'MouseOnlyClickAnalyzer',
    description: 'Detects click handlers without keyboard support',
    issueTypes: [
      'mouse-only-click - onClick without onKeyDown/onKeyUp',
    ],
    color: 'bg-red-100 border-red-500',
    category: 'Keyboard Accessibility'
  },
  {
    name: 'KeyboardNavigationAnalyzer',
    description: 'Validates keyboard navigation patterns',
    issueTypes: [
      'missing-keyboard-handler - Interactive element without keyboard support',
      'invalid-key-handler - Key handler on non-interactive element',
      'non-standard-key - Using deprecated keyCode property',
    ],
    color: 'bg-blue-100 border-blue-500',
    category: 'Keyboard Accessibility'
  },
  {
    name: 'FocusManagementAnalyzer',
    description: 'Detects focus management issues in dynamic content',
    issueTypes: [
      'removal-without-focus-management - Removing focused element',
      'focus-after-removal - Focus management after element removal',
      'modal-focus-trap - Modal without proper focus trapping',
    ],
    color: 'bg-purple-100 border-purple-500',
    category: 'Focus Management'
  },
  {
    name: 'FocusOrderConflictAnalyzer',
    description: 'Detects conflicts between visual and focus order',
    issueTypes: [
      'focus-order-conflicts-reading-order - Tabindex conflicts with DOM order',
      'positive-tabindex - Positive tabindex values (anti-pattern)',
    ],
    color: 'bg-purple-100 border-purple-500',
    category: 'Focus Management'
  },
  {
    name: 'VisibilityFocusConflictAnalyzer',
    description: 'Detects focusable elements hidden by CSS',
    issueTypes: [
      'focusable-element-hidden - Focusable element with display:none or visibility:hidden',
      'potential-keyboard-trap - Element may trap keyboard focus',
    ],
    color: 'bg-orange-100 border-orange-500',
    category: 'Focus Management'
  },
  {
    name: 'ARIASemanticAnalyzer',
    description: 'Validates ARIA roles and attributes',
    issueTypes: [
      'invalid-role - Invalid or misspelled ARIA role',
      'missing-required-aria - Required ARIA attributes missing',
      'redundant-role - ARIA role matches implicit HTML role',
      'invalid-aria-attribute - Invalid ARIA attribute for role',
    ],
    color: 'bg-green-100 border-green-500',
    category: 'ARIA'
  },
  {
    name: 'MissingAriaConnectionAnalyzer',
    description: 'Validates ARIA relationships and references',
    issueTypes: [
      'aria-labelledby-references-missing - aria-labelledby references non-existent ID',
      'aria-describedby-references-missing - aria-describedby references non-existent ID',
      'aria-controls-references-missing - aria-controls references non-existent ID',
    ],
    color: 'bg-green-100 border-green-500',
    category: 'ARIA'
  },
  {
    name: 'AriaStateManagementAnalyzer',
    description: 'Detects missing ARIA state updates',
    issueTypes: [
      'aria-expanded-not-updated - aria-expanded not updated on interaction',
      'aria-pressed-not-updated - aria-pressed not updated on toggle',
      'aria-checked-not-updated - aria-checked not updated on change',
      'aria-selected-not-updated - aria-selected not updated on selection',
    ],
    color: 'bg-green-100 border-green-500',
    category: 'ARIA'
  },
  {
    name: 'OrphanedEventHandlerAnalyzer',
    description: 'Detects event handlers attached to non-existent elements',
    issueTypes: [
      'orphaned-event-handler - addEventListener on non-existent element',
      'event-handler-on-missing-element - Event handler references missing ID',
    ],
    color: 'bg-yellow-100 border-yellow-500',
    category: 'DOM & Events'
  },
  {
    name: 'WidgetPatternAnalyzer',
    description: 'Validates ARIA widget patterns (tabs, accordions, etc)',
    issueTypes: [
      'widget-missing-role - Widget pattern missing required roles',
      'widget-invalid-aria - Widget pattern with incorrect ARIA attributes',
      'widget-missing-keyboard - Widget pattern missing keyboard support',
      'tabs-missing-tablist - Tab widget missing tablist container',
      'accordion-invalid-structure - Accordion with incorrect structure',
    ],
    color: 'bg-indigo-100 border-indigo-500',
    category: 'ARIA Patterns'
  },
  {
    name: 'HeadingStructureAnalyzer',
    description: 'Validates heading hierarchy and structure',
    issueTypes: [
      'empty-heading - Heading element with no text content',
      'heading-missing-text - Heading without accessible text',
      'skipped-heading-level - Skipped heading level (h1→h3)',
      'missing-h1 - Page missing h1 element',
      'multiple-h1 - Multiple h1 elements on page',
    ],
    color: 'bg-teal-100 border-teal-500',
    category: 'Document Structure'
  },
  {
    name: 'LandmarkStructureAnalyzer',
    description: 'Validates landmark regions and page structure',
    issueTypes: [
      'missing-main-landmark - Page missing main landmark',
      'multiple-main-landmarks - Multiple main landmarks',
      'missing-skip-link - Missing skip navigation link',
      'landmark-missing-label - Landmark region without accessible name',
    ],
    color: 'bg-teal-100 border-teal-500',
    category: 'Document Structure'
  },
  {
    name: 'LanguageAttributeAnalyzer',
    description: 'Validates language declarations',
    issueTypes: [
      'missing-lang-attribute - HTML element missing lang attribute',
      'invalid-lang-value - Invalid BCP 47 language code',
    ],
    color: 'bg-teal-100 border-teal-500',
    category: 'Document Structure'
  },
  {
    name: 'FormLabelAnalyzer',
    description: 'Validates form input labels',
    issueTypes: [
      'form-input-missing-label - Input without associated label',
      'label-without-control - Label without associated form control',
      'duplicate-label-id - Multiple inputs with same label association',
    ],
    color: 'bg-cyan-100 border-cyan-500',
    category: 'Forms'
  },
  {
    name: 'FormSubmissionAnalyzer',
    description: 'Validates form submission and validation',
    issueTypes: [
      'form-submit-no-validation - Form submission without validation',
      'form-missing-error-summary - Form errors not announced',
      'invalid-input-no-aria - Invalid form input missing aria-invalid',
    ],
    color: 'bg-cyan-100 border-cyan-500',
    category: 'Forms'
  },
  {
    name: 'AutocompleteAnalyzer',
    description: 'Validates autocomplete attributes on form fields',
    issueTypes: [
      'missing-autocomplete - Personal data input missing autocomplete',
      'invalid-autocomplete-value - Invalid autocomplete token',
    ],
    color: 'bg-cyan-100 border-cyan-500',
    category: 'Forms'
  },
  {
    name: 'ButtonLabelAnalyzer',
    description: 'Validates button labels and accessible names',
    issueTypes: [
      'button-missing-label - Button without accessible text',
      'button-icon-only - Icon-only button without aria-label',
      'button-generic-label - Button with generic label (click here, submit)',
    ],
    color: 'bg-pink-100 border-pink-500',
    category: 'Interactive Elements'
  },
  {
    name: 'LinkTextAnalyzer',
    description: 'Validates link text and accessibility',
    issueTypes: [
      'link-no-text - Link without text content',
      'link-ambiguous-text - Link with ambiguous text (click here, read more)',
      'link-url-as-text - Link using URL as link text',
    ],
    color: 'bg-pink-100 border-pink-500',
    category: 'Interactive Elements'
  },
  {
    name: 'NestedInteractiveElementsAnalyzer',
    description: 'Detects nested interactive elements',
    issueTypes: [
      'nested-interactive - Button/link inside another button/link',
      'button-inside-link - Button nested inside link',
      'link-inside-button - Link nested inside button',
    ],
    color: 'bg-pink-100 border-pink-500',
    category: 'Interactive Elements'
  },
  {
    name: 'AltTextAnalyzer',
    description: 'Validates image alt text',
    issueTypes: [
      'missing-alt-text - Image without alt attribute',
      'alt-text-filename - Alt text appears to be filename',
      'redundant-alt-text - Alt text includes "image", "picture"',
      'decorative-missing-empty-alt - Decorative image with non-empty alt',
    ],
    color: 'bg-lime-100 border-lime-500',
    category: 'Media'
  },
  {
    name: 'TableAccessibilityAnalyzer',
    description: 'Validates table structure and headers',
    issueTypes: [
      'table-missing-headers - Data table without th elements',
      'table-missing-caption - Table without caption',
      'table-layout-with-role - Layout table with presentation role',
      'complex-table-missing-scope - Complex table missing scope attributes',
    ],
    color: 'bg-amber-100 border-amber-500',
    category: 'Tables'
  },
  {
    name: 'ModalAccessibilityAnalyzer',
    description: 'Validates modal dialog accessibility',
    issueTypes: [
      'modal-missing-role - Modal without role=dialog',
      'modal-missing-label - Modal without aria-label or aria-labelledby',
      'modal-missing-focus-trap - Modal without focus trapping',
      'modal-no-close-button - Modal without accessible close mechanism',
      'missing-escape-handler - Modal without Escape key handler',
    ],
    color: 'bg-violet-100 border-violet-500',
    category: 'Dynamic Content'
  },
  {
    name: 'LiveRegionAnalyzer',
    description: 'Validates ARIA live regions',
    issueTypes: [
      'live-region-no-updates - aria-live element never updated',
      'live-region-too-aggressive - aria-live=assertive used inappropriately',
      'status-updates-not-announced - Status changes not in live region',
      'loading-state-not-announced - Loading states not announced',
    ],
    color: 'bg-violet-100 border-violet-500',
    category: 'Dynamic Content'
  },
  {
    name: 'AnimationControlAnalyzer',
    description: 'Validates animation and motion controls',
    issueTypes: [
      'no-animation-pause - Animation without pause/stop control',
      'autoplay-without-control - Autoplay media without controls',
      'no-prefers-reduced-motion - Animation ignoring prefers-reduced-motion',
    ],
    color: 'bg-rose-100 border-rose-500',
    category: 'Motion & Timing'
  },
  {
    name: 'TimeoutAnalyzer',
    description: 'Detects timeout issues',
    issueTypes: [
      'timeout-no-warning - Timeout without warning to user',
      'timeout-no-extension - Timeout without ability to extend',
      'session-timeout-too-short - Session timeout less than 20 hours',
    ],
    color: 'bg-rose-100 border-rose-500',
    category: 'Motion & Timing'
  },
  {
    name: 'SingleLetterShortcutAnalyzer',
    description: 'Detects problematic single-letter keyboard shortcuts',
    issueTypes: [
      'single-letter-shortcut - Single character keyboard shortcut',
      'shortcut-no-disable - Keyboard shortcut without disable option',
    ],
    color: 'bg-sky-100 border-sky-500',
    category: 'Keyboard Accessibility'
  },
  {
    name: 'DeprecatedKeyCodeAnalyzer',
    description: 'Detects deprecated keyboard event properties',
    issueTypes: [
      'deprecated-keycode - Using event.keyCode (deprecated)',
      'deprecated-which - Using event.which (deprecated)',
      'use-key-instead - Should use event.key instead',
    ],
    color: 'bg-sky-100 border-sky-500',
    category: 'Keyboard Accessibility'
  },
  {
    name: 'ColorContrastAnalyzer',
    description: 'Validates color contrast ratios',
    issueTypes: [
      'insufficient-contrast-aa - Fails WCAG AA contrast (4.5:1)',
      'insufficient-contrast-aaa - Fails WCAG AAA contrast (7:1)',
    ],
    color: 'bg-fuchsia-100 border-fuchsia-500',
    category: 'Visual'
  },
  {
    name: 'PointerTargetAnalyzer',
    description: 'Validates touch target sizes',
    issueTypes: [
      'touch-target-too-small - Interactive element smaller than 24×24px',
      'adjacent-targets-too-close - Interactive elements too close together',
      'inline-link-insufficient-target - Inline link without adequate padding',
    ],
    color: 'bg-fuchsia-100 border-fuchsia-500',
    category: 'Visual'
  },
  {
    name: 'OrientationLockAnalyzer',
    description: 'Detects orientation lock issues',
    issueTypes: [
      'viewport-orientation-lock - Viewport locked to one orientation',
      'css-orientation-restriction - CSS restricts orientation',
    ],
    color: 'bg-emerald-100 border-emerald-500',
    category: 'Responsive'
  },
  {
    name: 'ReactA11yAnalyzer',
    description: 'React-specific accessibility patterns',
    issueTypes: [
      'react-missing-key - List items missing key prop',
      'react-stopPropagation-blocks-keyboard - stopPropagation blocking keyboard events',
      'react-portal-focus-trap - Portal missing focus management',
      'react-hooks-stale-closure - useEffect with stale closure over accessibility props',
    ],
    color: 'bg-slate-100 border-slate-500',
    category: 'Framework-Specific'
  },
  {
    name: 'AngularReactivityAnalyzer',
    description: 'Angular-specific accessibility patterns',
    issueTypes: [
      'angular-aria-not-reactive - ARIA attributes not using data binding',
      'angular-role-not-reactive - Role attribute not reactive to state',
    ],
    color: 'bg-slate-100 border-slate-500',
    category: 'Framework-Specific'
  },
  {
    name: 'VueReactivityAnalyzer',
    description: 'Vue-specific accessibility patterns',
    issueTypes: [
      'vue-aria-not-reactive - ARIA attributes not using v-bind',
      'vue-role-not-reactive - Role attribute not reactive',
    ],
    color: 'bg-slate-100 border-slate-500',
    category: 'Framework-Specific'
  },
  {
    name: 'SvelteReactivityAnalyzer',
    description: 'Svelte-specific accessibility patterns',
    issueTypes: [
      'svelte-aria-not-reactive - ARIA attributes not using reactive syntax',
      'svelte-role-not-reactive - Role attribute not reactive',
    ],
    color: 'bg-slate-100 border-slate-500',
    category: 'Framework-Specific'
  },
  {
    name: 'StaticAriaAnalyzer',
    description: 'Generic ARIA validation',
    issueTypes: [
      'static-aria-error - Generic ARIA validation error',
    ],
    color: 'bg-gray-100 border-gray-500',
    category: 'ARIA'
  },
];

// Group analyzers by category
const groupedAnalyzers = ANALYZERS.reduce((acc, analyzer) => {
  if (!acc[analyzer.category]) {
    acc[analyzer.category] = [];
  }
  acc[analyzer.category].push(analyzer);
  return acc;
}, {} as Record<string, AnalyzerInfo[]>);

export default function AnalyzersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                What We Test
              </h1>
              <p className="mt-2 text-gray-600">
                35 analyzers running 119 accessibility checks
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Playground
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600">{ANALYZERS.length}</div>
            <div className="text-sm text-gray-600">Total Analyzers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600">119</div>
            <div className="text-sm text-gray-600">Issue Types Detected</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="text-3xl font-bold text-purple-600">
              {Object.keys(groupedAnalyzers).length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>

        {/* Analyzers by Category */}
        {Object.entries(groupedAnalyzers).map(([category, analyzers]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyzers.map((analyzer) => (
                <div
                  key={analyzer.name}
                  className={`${analyzer.color} border-l-4 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4`}
                >
                  <h3 className="font-bold text-gray-900 mb-2">
                    {analyzer.name.replace('Analyzer', '')}
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    {analyzer.description}
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Detects:
                    </p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {analyzer.issueTypes.map((issue, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer Note */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            📚 Learn More
          </h3>
          <p className="text-sm text-blue-800">
            For detailed documentation on each analyzer and issue type, see{' '}
            <a
              href="https://github.com/bobdodd/phd/blob/main/Action%20Language/app/demo/ISSUE_TYPES_REFERENCE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600"
            >
              ISSUE_TYPES_REFERENCE.md
            </a>
            {' '}on GitHub.
          </p>
        </div>
      </div>
    </div>
  );
}
