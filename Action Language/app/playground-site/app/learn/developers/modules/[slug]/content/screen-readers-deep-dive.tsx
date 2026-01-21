export default function ScreenReadersDeepDive() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
        <h2 className="text-2xl font-bold text-blue-900 mt-0 mb-4">What You'll Learn</h2>
        <ul className="text-blue-800 space-y-2 mb-0">
          <li>How screen readers convert visual interfaces to speech and Braille</li>
          <li>The accessibility tree and how browsers expose semantics</li>
          <li>Browse mode vs. focus mode and their different interaction models</li>
          <li>Keyboard shortcuts and navigation strategies screen reader users employ</li>
          <li>The accessible name computation algorithm (accName)</li>
          <li>Common screen readers: JAWS, NVDA, VoiceOver, TalkBack, Narrator</li>
          <li>Why semantic HTML and ARIA are critical for screen reader accessibility</li>
        </ul>
      </div>

      <h2>Why This Matters</h2>
      <p>
        Screen readers are the <strong>most important assistive technology</strong> for web accessibility. Understanding
        how they work is essential because:
      </p>
      <ul>
        <li>Approximately <strong>2.2 billion people</strong> worldwide have vision impairment</li>
        <li>Screen readers are used by blind, low vision, and learning disabled users</li>
        <li>Your semantic HTML directly impacts screen reader output</li>
        <li>WCAG Level A conformance requires screen reader accessibility</li>
        <li>Screen reader users navigate very differently than sighted mouse users</li>
      </ul>
      <p>
        A site that looks beautiful but has poor semantics is <strong>completely unusable</strong> to screen reader users.
        This module teaches you to "see" your site through the screen reader lens.
      </p>

      <h2>What Is a Screen Reader?</h2>
      <p>
        A screen reader is software that reads digital content aloud using text-to-speech, and optionally outputs
        to a refreshable Braille display. It:
      </p>
      <ul>
        <li>Extracts text, roles, and structure from the accessibility tree</li>
        <li>Announces elements sequentially as the user navigates</li>
        <li>Provides keyboard shortcuts for efficient navigation</li>
        <li>Offers multiple reading modes for different tasks</li>
      </ul>

      <h2>Popular Screen Readers</h2>
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-lg font-semibold mb-2 mt-0">🖥️ JAWS (Job Access With Speech)</h3>
          <ul className="mb-0">
            <li><strong>Platform:</strong> Windows</li>
            <li><strong>Market share:</strong> ~40% (most popular globally)</li>
            <li><strong>Cost:</strong> $1,200+ (expensive, but most feature-rich)</li>
            <li><strong>Users:</strong> Professional blind users, corporate environments</li>
            <li><strong>Key feature:</strong> Customizable scripts, extensive application support</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-lg font-semibold mb-2 mt-0">🖥️ NVDA (NonVisual Desktop Access)</h3>
          <ul className="mb-0">
            <li><strong>Platform:</strong> Windows</li>
            <li><strong>Market share:</strong> ~30%</li>
            <li><strong>Cost:</strong> FREE (open source)</li>
            <li><strong>Users:</strong> Growing rapidly due to zero cost</li>
            <li><strong>Key feature:</strong> Excellent web support, frequent updates</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-lg font-semibold mb-2 mt-0">🍎 VoiceOver</h3>
          <ul className="mb-0">
            <li><strong>Platform:</strong> macOS, iOS, iPadOS</li>
            <li><strong>Market share:</strong> ~20% (desktop), dominant on mobile</li>
            <li><strong>Cost:</strong> FREE (built into Apple devices)</li>
            <li><strong>Users:</strong> Apple ecosystem users</li>
            <li><strong>Key feature:</strong> Tight OS integration, gesture controls on mobile</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-lg font-semibold mb-2 mt-0">🤖 TalkBack</h3>
          <ul className="mb-0">
            <li><strong>Platform:</strong> Android</li>
            <li><strong>Market share:</strong> Dominant on Android mobile</li>
            <li><strong>Cost:</strong> FREE (built into Android)</li>
            <li><strong>Users:</strong> Android smartphone users</li>
            <li><strong>Key feature:</strong> Gesture navigation, global menu</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-lg font-semibold mb-2 mt-0">🖥️ Narrator</h3>
          <ul className="mb-0">
            <li><strong>Platform:</strong> Windows</li>
            <li><strong>Market share:</strong> ~5% (growing with Windows 11)</li>
            <li><strong>Cost:</strong> FREE (built into Windows)</li>
            <li><strong>Users:</strong> Casual users, new to screen readers</li>
            <li><strong>Key feature:</strong> Improving rapidly, decent web support</li>
          </ul>
        </div>
      </div>

      <h2>The Accessibility Tree</h2>
      <p>
        Screen readers don't read your HTML directly. Instead, browsers build an <strong>accessibility tree</strong>
        —a parallel structure derived from the DOM that exposes semantics to assistive technology:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg my-6">
        <h3 className="mt-0">DOM vs. Accessibility Tree</h3>

        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2">DOM (What the browser sees):</h4>
          <pre className="bg-white p-4 rounded border border-gray-300 text-xs overflow-x-auto">
{`<div class="menu">
  <span onclick="showMenu()">Menu</span>
  <div class="submenu">
    <span onclick="goHome()">Home</span>
    <span onclick="goAbout()">About</span>
  </div>
</div>`}
          </pre>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Accessibility Tree (What the screen reader sees):</h4>
          <pre className="bg-white p-4 rounded border border-gray-300 text-xs overflow-x-auto">
{`[generic]
  [generic] "Menu" (no role, no keyboard access)
  [generic]
    [generic] "Home" (no role, no keyboard access)
    [generic] "About" (no role, no keyboard access)

❌ Problem: Screen reader announces "Menu, Home, About" with no indication
these are interactive or how to activate them.`}
          </pre>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg my-6">
        <h3 className="mt-0">Fixed with Semantic HTML:</h3>

        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2">DOM:</h4>
          <pre className="bg-white p-4 rounded border border-gray-300 text-xs overflow-x-auto">
{`<nav aria-label="Main menu">
  <button aria-expanded="false" aria-controls="submenu">
    Menu
  </button>
  <ul id="submenu" hidden>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>`}
          </pre>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Accessibility Tree:</h4>
          <pre className="bg-white p-4 rounded border border-gray-300 text-xs overflow-x-auto">
{`[navigation] "Main menu"
  [button] "Menu, collapsed" (focusable, activatable)
  [list]
    [listitem]
      [link] "Home" (focusable, activatable)
    [listitem]
      [link] "About" (focusable, activatable)

✅ Screen reader announces: "Navigation, Main menu. Button, Menu, collapsed.
Press Enter to activate." User can navigate by buttons or links.`}
          </pre>
        </div>
      </div>

      <h3>What the Accessibility Tree Contains</h3>
      <p>Each node in the accessibility tree exposes:</p>
      <ul>
        <li><strong>Role:</strong> What type of element (button, link, heading, list, etc.)</li>
        <li><strong>Name:</strong> The accessible name (computed from labels, text, ARIA)</li>
        <li><strong>State:</strong> Current condition (checked, expanded, selected, pressed)</li>
        <li><strong>Properties:</strong> Additional info (level, required, invalid, etc.)</li>
        <li><strong>Value:</strong> For inputs, ranges, etc.</li>
        <li><strong>Description:</strong> Optional help text (from aria-describedby)</li>
      </ul>

      <h2>Browse Mode vs. Focus Mode</h2>
      <p>
        Screen readers have two primary interaction modes:
      </p>

      <div className="bg-white border border-gray-200 rounded p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2 mt-0">📖 Browse Mode (Virtual Cursor)</h3>
        <p className="mb-2">
          <strong>Default mode</strong> for reading content. The screen reader creates a virtual cursor that can
          read everything sequentially, regardless of focusability.
        </p>
        <p className="mb-2"><strong>Navigation:</strong></p>
        <ul className="mb-2">
          <li>Arrow keys move by line or element</li>
          <li>H key jumps to next heading</li>
          <li>K jumps to next link</li>
          <li>D jumps to next landmark</li>
          <li>T jumps to next table</li>
          <li>B jumps to next button</li>
        </ul>
        <p className="mb-0">
          <strong>Use case:</strong> Reading articles, browsing content, exploring page structure
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2 mt-0">⌨️ Focus Mode (Forms Mode)</h3>
        <p className="mb-2">
          Activated when entering form fields. The screen reader passes <strong>all</strong> keystrokes to the
          browser, allowing typing and interaction.
        </p>
        <p className="mb-2"><strong>Navigation:</strong></p>
        <ul className="mb-2">
          <li>Tab/Shift+Tab move between focusable elements</li>
          <li>Arrow keys type text (not navigation)</li>
          <li>Single-letter shortcuts are disabled</li>
        </ul>
        <p className="mb-0">
          <strong>Use case:</strong> Filling forms, typing text, interacting with custom widgets
        </p>
      </div>

      <h2>Common Keyboard Shortcuts</h2>
      <p>
        Screen reader users rely heavily on keyboard shortcuts. Here are the most important ones:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left pb-2">Action</th>
              <th className="text-left pb-2">JAWS/NVDA</th>
              <th className="text-left pb-2">VoiceOver</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold">Start/Stop</td>
              <td className="py-2">Insert</td>
              <td className="py-2">Cmd+F5</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold">Next element</td>
              <td className="py-2">↓</td>
              <td className="py-2">VO+→</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold">Previous element</td>
              <td className="py-2">↑</td>
              <td className="py-2">VO+←</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold">Next heading</td>
              <td className="py-2">H</td>
              <td className="py-2">VO+Cmd+H</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold">Next link</td>
              <td className="py-2">K</td>
              <td className="py-2">VO+Cmd+L</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold">Next button</td>
              <td className="py-2">B</td>
              <td className="py-2">VO+Cmd+J</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold">Next landmark</td>
              <td className="py-2">D (NVDA), R (JAWS)</td>
              <td className="py-2">VO+U, then ←/→</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold">Elements list</td>
              <td className="py-2">Insert+F7</td>
              <td className="py-2">VO+U</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold">Read all</td>
              <td className="py-2">Insert+↓</td>
              <td className="py-2">VO+A</td>
            </tr>
            <tr>
              <td className="py-2 font-semibold">Focus mode toggle</td>
              <td className="py-2">Insert+Space</td>
              <td className="py-2">VO+Shift+↓</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Accessible Name Computation</h2>
      <p>
        The <strong>accessible name</strong> is what the screen reader announces to identify an element. Computing it
        is complex, following the W3C Accessible Name and Description Computation spec:
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h3 className="text-blue-900 mt-0">Accessible Name Algorithm (Simplified)</h3>
        <ol className="text-blue-900 space-y-3 mb-0">
          <li>
            <strong>aria-labelledby:</strong> Highest priority. Concatenates text from referenced elements by ID.
            <pre className="text-xs mt-2 bg-white p-2 rounded">{`<button aria-labelledby="label1 label2">
<span id="label1">Delete</span>
<span id="label2">5 items</span>
</button>
Name: "Delete 5 items"`}</pre>
          </li>
          <li>
            <strong>aria-label:</strong> Second priority. Direct string value.
            <pre className="text-xs mt-2 bg-white p-2 rounded">{`<button aria-label="Close dialog">✕</button>
Name: "Close dialog"`}</pre>
          </li>
          <li>
            <strong>Native labeling:</strong> For form inputs, associated <code>&lt;label&gt;</code> element.
            <pre className="text-xs mt-2 bg-white p-2 rounded">{`<label for="email">Email address:</label>
<input id="email" type="email">
Name: "Email address"`}</pre>
          </li>
          <li>
            <strong>Alt text (images):</strong> For <code>&lt;img&gt;</code>, use <code>alt</code> attribute.
            <pre className="text-xs mt-2 bg-white p-2 rounded">{`<img src="logo.png" alt="Company logo">
Name: "Company logo"`}</pre>
          </li>
          <li>
            <strong>Text content:</strong> For buttons, links, headings, use contained text.
            <pre className="text-xs mt-2 bg-white p-2 rounded">{`<button>Save Changes</button>
Name: "Save Changes"`}</pre>
          </li>
          <li>
            <strong>Placeholder (inputs):</strong> Last resort for inputs (not recommended as sole label).
            <pre className="text-xs mt-2 bg-white p-2 rounded">{`<input placeholder="Enter email">
Name: "Enter email" (warning: placeholder is insufficient)`}</pre>
          </li>
          <li>
            <strong>Title attribute:</strong> Very last resort (also shown as tooltip).
            <pre className="text-xs mt-2 bg-white p-2 rounded">{`<button title="Close">✕</button>
Name: "Close" (better to use aria-label)`}</pre>
          </li>
        </ol>
      </div>

      <h2>Code Example: Proper Labeling</h2>
      <div className="bg-gray-900 text-gray-100 p-6 rounded-lg my-6 overflow-x-auto">
        <pre className="text-sm">
          <code>{`// ❌ INACCESSIBLE: No accessible name
<button onclick="deleteItem()">
  <svg>...</svg> {/* Icon only, no text */}
</button>
// Screen reader announces: "Button" (what does it do?!)

// ✅ ACCESSIBLE: aria-label provides name
<button onclick="deleteItem()" aria-label="Delete item">
  <svg aria-hidden="true">...</svg>
</button>
// Announces: "Delete item, button"

// ✅ EVEN BETTER: Visible text + hidden detail
<button onclick="deleteItem()" aria-label="Delete 'Q4 Report.pdf'">
  <svg aria-hidden="true">...</svg>
  <span>Delete</span>
</button>
// Announces: "Delete 'Q4 Report.pdf', button"
// Sighted users see "Delete", SR users hear full context

// ❌ INACCESSIBLE: Placeholder is not a label
<input type="email" placeholder="Email address">
// Name: "Email address" (disappears when typing, insufficient)

// ✅ ACCESSIBLE: Persistent label
<label for="email">Email address:</label>
<input id="email" type="email" placeholder="you@example.com">
// Name: "Email address" (from label)
// Hint: "you@example.com" (from placeholder)

// ✅ COMPLEX EXAMPLE: Multi-part name
<div role="group" aria-labelledby="filter-label">
  <span id="filter-label">Filter by:</span>
  <button aria-label="Category">All</button>
  <button aria-label="Price">Any</button>
  <button aria-label="Rating">4+ stars</button>
</div>
// Group name: "Filter by"
// Buttons: "Category, button", "Price, button", "Rating, button"`}</code>
        </pre>
      </div>

      <h2>Screen Reader Announcements by Role</h2>
      <p>
        Screen readers announce elements differently based on their role:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg my-6">
        <ul className="space-y-3 mb-0">
          <li>
            <strong>Button:</strong> "Submit, button" (name + role)
          </li>
          <li>
            <strong>Link:</strong> "Read more, link" (name + role, sometimes URL)
          </li>
          <li>
            <strong>Heading:</strong> "About Us, heading level 2" (name + role + level)
          </li>
          <li>
            <strong>Checkbox:</strong> "Agree to terms, checkbox, not checked" (name + role + state)
          </li>
          <li>
            <strong>Text input:</strong> "Email address, edit, blank" (name + role + value state)
          </li>
          <li>
            <strong>Navigation:</strong> "Navigation, main navigation, navigation landmark" (role + label + context)
          </li>
          <li>
            <strong>List:</strong> "List, 3 items" (role + count), then "Bullet, item text" for each
          </li>
          <li>
            <strong>Table:</strong> "Table, 5 rows, 3 columns" (role + dimensions)
          </li>
          <li>
            <strong>Dialog:</strong> "Settings, dialog" (name + role, focus trapped inside)
          </li>
        </ul>
      </div>

      <h2>Navigation Strategies</h2>
      <p>
        Screen reader users employ different strategies depending on familiarity with the site:
      </p>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-lg font-semibold mb-2 mt-0">🆕 First Visit: Exploratory Navigation</h3>
          <ul className="mb-0">
            <li>Press H repeatedly to skim headings (get page outline)</li>
            <li>Press D to jump between landmarks (header, nav, main, footer)</li>
            <li>Open elements list (Insert+F7) to see all links, headings, landmarks</li>
            <li>Use "read all" (Insert+↓) to hear entire page</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-lg font-semibold mb-2 mt-0">🔁 Return Visit: Targeted Navigation</h3>
          <ul className="mb-0">
            <li>Press K repeatedly to jump through links, find "Sign in"</li>
            <li>Press B to jump to buttons</li>
            <li>Press F to jump to form fields</li>
            <li>Use search (Ctrl+F) to find specific text</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-lg font-semibold mb-2 mt-0">📝 Form Filling: Sequential Navigation</h3>
          <ul className="mb-0">
            <li>Tab through form fields in order</li>
            <li>Listen to labels and instructions as each field receives focus</li>
            <li>Enter focus mode automatically when reaching input</li>
            <li>Submit with Enter when on submit button</li>
          </ul>
        </div>
      </div>

      <h2>Common Screen Reader Issues</h2>

      <div className="space-y-4">
        <div className="bg-red-50 border-l-4 border-red-600 p-4">
          <h4 className="text-red-900 font-semibold mb-2">Issue 1: Missing Accessible Names</h4>
          <p className="text-red-900 mb-2">
            <strong>Problem:</strong> Icon buttons with no text or aria-label
          </p>
          <pre className="text-xs bg-white p-2 rounded mb-2">{`❌ <button><svg>...</svg></button>
Announces: "Button" (no indication of purpose)`}</pre>
          <p className="text-red-900 mb-0">
            <strong>Fix:</strong> Add aria-label or visually-hidden text
          </p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-600 p-4">
          <h4 className="text-red-900 font-semibold mb-2">Issue 2: Non-semantic Divs</h4>
          <p className="text-red-900 mb-2">
            <strong>Problem:</strong> Clickable divs without button role
          </p>
          <pre className="text-xs bg-white p-2 rounded mb-2">{`❌ <div onclick="submit()">Submit</div>
No role, not focusable, doesn't announce as interactive`}</pre>
          <p className="text-red-900 mb-0">
            <strong>Fix:</strong> Use semantic <code>&lt;button&gt;</code> element
          </p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-600 p-4">
          <h4 className="text-red-900 font-semibold mb-2">Issue 3: Missing Heading Hierarchy</h4>
          <p className="text-red-900 mb-2">
            <strong>Problem:</strong> Styled text instead of semantic headings
          </p>
          <pre className="text-xs bg-white p-2 rounded mb-2">{`❌ <div class="big-text">About Us</div>
Screen reader can't navigate by headings`}</pre>
          <p className="text-red-900 mb-0">
            <strong>Fix:</strong> Use <code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code>
          </p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-600 p-4">
          <h4 className="text-red-900 font-semibold mb-2">Issue 4: Keyboard Trap</h4>
          <p className="text-red-900 mb-2">
            <strong>Problem:</strong> Focus stuck inside modal/dropdown with no escape
          </p>
          <p className="text-red-900 mb-0">
            <strong>Fix:</strong> Implement focus trap with Escape key handler, manage focus properly
          </p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-600 p-4">
          <h4 className="text-red-900 font-semibold mb-2">Issue 5: No Focus Indicator</h4>
          <p className="text-red-900 mb-2">
            <strong>Problem:</strong> CSS removes outline, low-vision keyboard users can't see focus
          </p>
          <pre className="text-xs bg-white p-2 rounded mb-2">{`❌ button { outline: none; }
Removes visible focus indicator`}</pre>
          <p className="text-red-900 mb-0">
            <strong>Fix:</strong> Provide custom visible focus style
          </p>
        </div>
      </div>

      <h2>Testing Your Site with Screen Readers</h2>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h3 className="text-blue-900 mt-0">Quick Testing Setup</h3>
        <div className="text-blue-900 space-y-4">
          <div>
            <p className="font-semibold mb-1">Windows (Free):</p>
            <ol className="text-sm space-y-1 mb-0">
              <li>Download NVDA: <a href="https://www.nvaccess.org/" className="underline">nvaccess.org</a></li>
              <li>Install and restart</li>
              <li>Press Insert to start/stop speech</li>
              <li>Navigate with arrows, H, K, B keys</li>
            </ol>
          </div>

          <div>
            <p className="font-semibold mb-1">Mac (Built-in):</p>
            <ol className="text-sm space-y-1 mb-0">
              <li>System Preferences → Accessibility → VoiceOver</li>
              <li>Enable VoiceOver (or press Cmd+F5)</li>
              <li>VO = Ctrl+Option (your modifier keys)</li>
              <li>Navigate with VO+arrows</li>
            </ol>
          </div>

          <div>
            <p className="font-semibold mb-1">Chrome DevTools (Visual simulation):</p>
            <ol className="text-sm space-y-1 mb-0">
              <li>Open DevTools → Elements tab</li>
              <li>Right-click element → Inspect Accessibility</li>
              <li>View computed name, role, properties</li>
              <li>See accessibility tree structure</li>
            </ol>
          </div>
        </div>
      </div>

      <h2>Developer Checklist</h2>
      <div className="bg-gray-50 p-6 rounded-lg my-6">
        <ul className="space-y-2 mb-0">
          <li>✅ All interactive elements have meaningful accessible names</li>
          <li>✅ Semantic HTML used (buttons, links, headings, lists, nav, main)</li>
          <li>✅ Heading hierarchy is logical (h1 → h2 → h3, no skipping levels)</li>
          <li>✅ Form inputs have associated labels (not just placeholders)</li>
          <li>✅ Images have alt text (or alt="" for decorative)</li>
          <li>✅ Landmarks used (header, nav, main, aside, footer)</li>
          <li>✅ Focus order matches visual order (tabindex management)</li>
          <li>✅ No keyboard traps (can Tab out of everything)</li>
          <li>✅ ARIA states update dynamically (aria-expanded, aria-pressed)</li>
          <li>✅ Tested with actual screen reader (NVDA or VoiceOver)</li>
        </ul>
      </div>

      <h2>Key Takeaways</h2>
      <div className="bg-green-50 border-l-4 border-green-600 p-6">
        <ul className="text-green-900 space-y-2 mb-0">
          <li>
            <strong>Accessibility tree is parallel to DOM:</strong> Browsers expose semantics to screen readers
          </li>
          <li>
            <strong>Semantic HTML is critical:</strong> Use native elements (button, nav, h1) whenever possible
          </li>
          <li>
            <strong>Accessible names are computed:</strong> aria-labelledby &gt; aria-label &gt; native label &gt; text content
          </li>
          <li>
            <strong>Two modes:</strong> Browse mode for reading, focus mode for forms and widgets
          </li>
          <li>
            <strong>Keyboard shortcuts are essential:</strong> H for headings, K for links, D for landmarks
          </li>
          <li>
            <strong>JAWS/NVDA dominant on desktop:</strong> VoiceOver/TalkBack on mobile
          </li>
          <li>
            <strong>Test with real screen readers:</strong> NVDA is free, VoiceOver is built-in on Mac
          </li>
        </ul>
      </div>

      <h2>Next Steps</h2>
      <p>
        Now that you understand how screen readers work:
      </p>
      <ul>
        <li>Install NVDA (Windows) or enable VoiceOver (Mac) and test your current projects</li>
        <li>Navigate your site with keyboard only (no mouse) to identify issues</li>
        <li>Use Chrome DevTools Accessibility inspector to audit your accessibility tree</li>
        <li>Review all interactive elements for accessible names</li>
        <li>
          Continue to <strong>Module 11: Switch Access and Scanning</strong> to learn about another critical
          assistive technology for motor disabilities
        </li>
      </ul>
    </div>
  );
}
