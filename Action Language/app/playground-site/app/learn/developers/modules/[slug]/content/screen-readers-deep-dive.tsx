export default function ScreenReadersDeepDive() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* What You'll Learn */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-12 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mt-0 mb-4">What You'll Learn</h2>
        <ul className="space-y-2 mb-0 text-blue-900">
          <li>How screen readers convert visual interfaces to speech and Braille</li>
          <li>The accessibility tree and how browsers expose semantics</li>
          <li>Browse mode vs. focus mode and their different interaction models</li>
          <li>Keyboard shortcuts and navigation strategies screen reader users employ</li>
          <li>The accessible name computation algorithm (accName)</li>
          <li>Common screen readers: JAWS, NVDA, VoiceOver, TalkBack, Narrator</li>
          <li>Why semantic HTML and ARIA are critical for screen reader accessibility</li>
        </ul>
      </section>

      {/* Why This Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why This Matters</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Screen readers are the <strong>most important assistive technology</strong> for web accessibility. Understanding
          how they work is essential because:
        </p>
        <ul className="space-y-2 text-gray-700 mb-4">
          <li>Approximately <strong>2.2 billion people</strong> worldwide have vision impairment</li>
          <li>Screen readers are used by blind, low vision, and learning disabled users</li>
          <li>Your semantic HTML directly impacts screen reader output</li>
          <li>WCAG Level A conformance requires screen reader accessibility</li>
          <li>Screen reader users navigate very differently than sighted mouse users</li>
        </ul>
        <p className="text-lg text-gray-700 leading-relaxed">
          A site that looks beautiful but has poor semantics is <strong>completely unusable</strong> to screen reader users.
          This module teaches you to &quot;see&quot; your site through the screen reader lens.
        </p>
      </section>

      {/* What Is a Screen Reader */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Is a Screen Reader?</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          A screen reader is software that reads digital content aloud using text-to-speech, and optionally outputs
          to a refreshable Braille display. It:
        </p>
        <ul className="space-y-2 text-gray-700">
          <li>Extracts text, roles, and structure from the accessibility tree</li>
          <li>Announces elements sequentially as the user navigates</li>
          <li>Provides keyboard shortcuts for efficient navigation</li>
          <li>Offers multiple reading modes for different tasks</li>
        </ul>
      </section>

      {/* Popular Screen Readers */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Popular Screen Readers</h2>
        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🖥️ JAWS (Job Access With Speech)</h3>
            <dl className="space-y-2">
              <div>
                <dt className="inline font-semibold text-gray-900">Platform: </dt>
                <dd className="inline text-gray-700">Windows</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Market share: </dt>
                <dd className="inline text-gray-700">~40% (most popular globally)</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Cost: </dt>
                <dd className="inline text-gray-700">$1,200+ (expensive, but most feature-rich)</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Users: </dt>
                <dd className="inline text-gray-700">Professional blind users, corporate environments</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Key feature: </dt>
                <dd className="inline text-gray-700">Customizable scripts, extensive application support</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🖥️ NVDA (NonVisual Desktop Access)</h3>
            <dl className="space-y-2">
              <div>
                <dt className="inline font-semibold text-gray-900">Platform: </dt>
                <dd className="inline text-gray-700">Windows</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Market share: </dt>
                <dd className="inline text-gray-700">~30%</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Cost: </dt>
                <dd className="inline text-gray-700">FREE (open source)</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Users: </dt>
                <dd className="inline text-gray-700">Growing rapidly due to zero cost</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Key feature: </dt>
                <dd className="inline text-gray-700">Excellent web support, frequent updates</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🍎 VoiceOver</h3>
            <dl className="space-y-2">
              <div>
                <dt className="inline font-semibold text-gray-900">Platform: </dt>
                <dd className="inline text-gray-700">macOS, iOS, iPadOS</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Market share: </dt>
                <dd className="inline text-gray-700">~20% (desktop), dominant on mobile</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Cost: </dt>
                <dd className="inline text-gray-700">FREE (built into Apple devices)</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Users: </dt>
                <dd className="inline text-gray-700">Apple ecosystem users</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Key feature: </dt>
                <dd className="inline text-gray-700">Tight OS integration, gesture controls on mobile</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🤖 TalkBack</h3>
            <dl className="space-y-2">
              <div>
                <dt className="inline font-semibold text-gray-900">Platform: </dt>
                <dd className="inline text-gray-700">Android</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Market share: </dt>
                <dd className="inline text-gray-700">Dominant on Android mobile</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Cost: </dt>
                <dd className="inline text-gray-700">FREE (built into Android)</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Users: </dt>
                <dd className="inline text-gray-700">Android smartphone users</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Key feature: </dt>
                <dd className="inline text-gray-700">Gesture navigation, global menu</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🖥️ Narrator</h3>
            <dl className="space-y-2">
              <div>
                <dt className="inline font-semibold text-gray-900">Platform: </dt>
                <dd className="inline text-gray-700">Windows</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Market share: </dt>
                <dd className="inline text-gray-700">~5% (growing with Windows 11)</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Cost: </dt>
                <dd className="inline text-gray-700">FREE (built into Windows)</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Users: </dt>
                <dd className="inline text-gray-700">Casual users, new to screen readers</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Key feature: </dt>
                <dd className="inline text-gray-700">Improving rapidly, decent web support</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* The Accessibility Tree */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">The Accessibility Tree</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Screen readers don&apos;t read your HTML directly. Instead, browsers build an <strong>accessibility tree</strong>
          —a parallel structure derived from the DOM that exposes semantics to assistive technology:
        </p>

        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">DOM vs. Accessibility Tree</h3>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">DOM (What the browser sees):</h4>
            <pre className="bg-white p-4 rounded border-2 border-gray-300 text-sm overflow-x-auto font-mono">
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
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Accessibility Tree (What the screen reader sees):</h4>
            <pre className="bg-white p-4 rounded border-2 border-gray-300 text-sm overflow-x-auto font-mono">
{`[generic]
  [generic] "Menu" (no role, no keyboard access)
  [generic]
    [generic] "Home" (no role, no keyboard access)
    [generic] "About" (no role, no keyboard access)

❌ Problem: Screen reader announces "Menu, Home, About" with no
indication these are interactive or how to activate them.`}
            </pre>
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">Fixed with Semantic HTML:</h3>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-green-800 mb-2">DOM:</h4>
            <pre className="bg-white p-4 rounded border-2 border-green-300 text-sm overflow-x-auto font-mono">
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
            <h4 className="text-lg font-semibold text-green-800 mb-2">Accessibility Tree:</h4>
            <pre className="bg-white p-4 rounded border-2 border-green-300 text-sm overflow-x-auto font-mono">
{`[navigation] "Main menu"
  [button] "Menu, collapsed" (focusable, activatable)
  [list]
    [listitem]
      [link] "Home" (focusable, activatable)
    [listitem]
      [link] "About" (focusable, activatable)

✅ Screen reader announces: "Navigation, Main menu. Button, Menu,
collapsed. Press Enter to activate." User can navigate by buttons
or links.`}
            </pre>
          </div>
        </div>
      </section>

      {/* What the Accessibility Tree Contains */}
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">What the Accessibility Tree Contains</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">Each node in the accessibility tree exposes:</p>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Role:</strong> What type of element (button, link, heading, list, etc.)</li>
          <li><strong>Name:</strong> The accessible name (computed from labels, text, ARIA)</li>
          <li><strong>State:</strong> Current condition (checked, expanded, selected, pressed)</li>
          <li><strong>Properties:</strong> Additional info (level, required, invalid, etc.)</li>
          <li><strong>Value:</strong> For inputs, ranges, etc.</li>
          <li><strong>Description:</strong> Optional help text (from aria-describedby)</li>
        </ul>
      </section>

      {/* Browse Mode vs. Focus Mode */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Mode vs. Focus Mode</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Screen readers have two primary interaction modes:
        </p>

        <div className="space-y-6">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-3">📖 Browse Mode (Virtual Cursor)</h3>
            <p className="text-gray-700 mb-3">
              <strong>Default mode</strong> for reading content. The screen reader creates a virtual cursor that can
              read everything sequentially, regardless of focusability.
            </p>
            <div className="mb-3">
              <p className="font-semibold text-gray-900 mb-2">Navigation:</p>
              <ul className="space-y-1 text-gray-700">
                <li>Arrow keys move by line or element</li>
                <li>H key jumps to next heading</li>
                <li>K jumps to next link</li>
                <li>D jumps to next landmark</li>
                <li>T jumps to next table</li>
                <li>B jumps to next button</li>
              </ul>
            </div>
            <p className="text-gray-700 mb-0">
              <strong>Use case:</strong> Reading articles, browsing content, exploring page structure
            </p>
          </div>

          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-900 mb-3">⌨️ Focus Mode (Forms Mode)</h3>
            <p className="text-gray-700 mb-3">
              Activated when entering form fields. The screen reader passes <strong>all</strong> keystrokes to the
              browser, allowing typing and interaction.
            </p>
            <div className="mb-3">
              <p className="font-semibold text-gray-900 mb-2">Navigation:</p>
              <ul className="space-y-1 text-gray-700">
                <li>Tab/Shift+Tab move between focusable elements</li>
                <li>Arrow keys type text (not navigation)</li>
                <li>Single-letter shortcuts are disabled</li>
              </ul>
            </div>
            <p className="text-gray-700 mb-0">
              <strong>Use case:</strong> Filling forms, typing text, interacting with custom widgets
            </p>
          </div>
        </div>
      </section>

      {/* Common Keyboard Shortcuts */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Keyboard Shortcuts</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Screen reader users rely heavily on keyboard shortcuts. Here are the most important ones:
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-2 border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-900 border-b-2 border-gray-300">Action</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 border-b-2 border-gray-300">JAWS/NVDA</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 border-b-2 border-gray-300">VoiceOver</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-semibold text-gray-900">Start/Stop</td>
                <td className="px-4 py-3 text-gray-700">Insert</td>
                <td className="px-4 py-3 text-gray-700">Cmd+F5</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-semibold text-gray-900">Next element</td>
                <td className="px-4 py-3 text-gray-700">↓</td>
                <td className="px-4 py-3 text-gray-700">VO+→</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-semibold text-gray-900">Previous element</td>
                <td className="px-4 py-3 text-gray-700">↑</td>
                <td className="px-4 py-3 text-gray-700">VO+←</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-semibold text-gray-900">Next heading</td>
                <td className="px-4 py-3 text-gray-700">H</td>
                <td className="px-4 py-3 text-gray-700">VO+Cmd+H</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-semibold text-gray-900">Next link</td>
                <td className="px-4 py-3 text-gray-700">K</td>
                <td className="px-4 py-3 text-gray-700">VO+Cmd+L</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-semibold text-gray-900">Next button</td>
                <td className="px-4 py-3 text-gray-700">B</td>
                <td className="px-4 py-3 text-gray-700">VO+Cmd+J</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-semibold text-gray-900">Next landmark</td>
                <td className="px-4 py-3 text-gray-700">D (NVDA), R (JAWS)</td>
                <td className="px-4 py-3 text-gray-700">VO+U, then ←/→</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-semibold text-gray-900">Elements list</td>
                <td className="px-4 py-3 text-gray-700">Insert+F7</td>
                <td className="px-4 py-3 text-gray-700">VO+U</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-semibold text-gray-900">Read all</td>
                <td className="px-4 py-3 text-gray-700">Insert+↓</td>
                <td className="px-4 py-3 text-gray-700">VO+A</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-gray-900">Focus mode toggle</td>
                <td className="px-4 py-3 text-gray-700">Insert+Space</td>
                <td className="px-4 py-3 text-gray-700">VO+Shift+↓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Accessible Name Computation */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Accessible Name Computation</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The <strong>accessible name</strong> is what the screen reader announces to identify an element. Computing it
          is complex, following the W3C Accessible Name and Description Computation spec:
        </p>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Accessible Name Algorithm (Simplified)</h3>
          <ol className="space-y-4 list-decimal list-inside text-gray-700">
            <li>
              <strong>aria-labelledby:</strong> Highest priority. Concatenates text from referenced elements by ID.
              <pre className="text-sm mt-2 bg-white p-3 rounded border border-gray-300 font-mono overflow-x-auto">{`<button aria-labelledby="label1 label2">
<span id="label1">Delete</span>
<span id="label2">5 items</span>
</button>
Name: "Delete 5 items"`}</pre>
            </li>
            <li>
              <strong>aria-label:</strong> Second priority. Direct string value.
              <pre className="text-sm mt-2 bg-white p-3 rounded border border-gray-300 font-mono overflow-x-auto">{`<button aria-label="Close dialog">✕</button>
Name: "Close dialog"`}</pre>
            </li>
            <li>
              <strong>Native labeling:</strong> For form inputs, associated &lt;label&gt; element.
              <pre className="text-sm mt-2 bg-white p-3 rounded border border-gray-300 font-mono overflow-x-auto">{`<label for="email">Email address:</label>
<input id="email" type="email">
Name: "Email address"`}</pre>
            </li>
            <li>
              <strong>Alt text (images):</strong> For &lt;img&gt;, use alt attribute.
              <pre className="text-sm mt-2 bg-white p-3 rounded border border-gray-300 font-mono overflow-x-auto">{`<img src="logo.png" alt="Company logo">
Name: "Company logo"`}</pre>
            </li>
            <li>
              <strong>Text content:</strong> For buttons, links, headings, use contained text.
              <pre className="text-sm mt-2 bg-white p-3 rounded border border-gray-300 font-mono overflow-x-auto">{`<button>Save Changes</button>
Name: "Save Changes"`}</pre>
            </li>
            <li>
              <strong>Placeholder (inputs):</strong> Last resort for inputs (not recommended as sole label).
              <pre className="text-sm mt-2 bg-white p-3 rounded border border-gray-300 font-mono overflow-x-auto">{`<input placeholder="Enter email">
Name: "Enter email" (warning: insufficient)`}</pre>
            </li>
            <li>
              <strong>Title attribute:</strong> Very last resort (also shown as tooltip).
              <pre className="text-sm mt-2 bg-white p-3 rounded border border-gray-300 font-mono overflow-x-auto">{`<button title="Close">✕</button>
Name: "Close" (better to use aria-label)`}</pre>
            </li>
          </ol>
        </div>
      </section>

      {/* Code Example */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Code Example: Proper Labeling</h2>
        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
          <pre className="text-sm font-mono">
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
// Name: "Email address" (disappears when typing)

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
      </section>

      {/* Screen Reader Announcements by Role */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Screen Reader Announcements by Role</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Screen readers announce elements differently based on their role:
        </p>

        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
          <dl className="space-y-4">
            <div className="border-b border-gray-300 pb-3">
              <dt className="font-bold text-gray-900 text-lg mb-1">Button</dt>
              <dd className="text-gray-700 ml-4">&quot;Submit, button&quot; (name + role)</dd>
            </div>
            <div className="border-b border-gray-300 pb-3">
              <dt className="font-bold text-gray-900 text-lg mb-1">Link</dt>
              <dd className="text-gray-700 ml-4">&quot;Read more, link&quot; (name + role, sometimes URL)</dd>
            </div>
            <div className="border-b border-gray-300 pb-3">
              <dt className="font-bold text-gray-900 text-lg mb-1">Heading</dt>
              <dd className="text-gray-700 ml-4">&quot;About Us, heading level 2&quot; (name + role + level)</dd>
            </div>
            <div className="border-b border-gray-300 pb-3">
              <dt className="font-bold text-gray-900 text-lg mb-1">Checkbox</dt>
              <dd className="text-gray-700 ml-4">&quot;Agree to terms, checkbox, not checked&quot; (name + role + state)</dd>
            </div>
            <div className="border-b border-gray-300 pb-3">
              <dt className="font-bold text-gray-900 text-lg mb-1">Text input</dt>
              <dd className="text-gray-700 ml-4">&quot;Email address, edit, blank&quot; (name + role + value state)</dd>
            </div>
            <div className="border-b border-gray-300 pb-3">
              <dt className="font-bold text-gray-900 text-lg mb-1">Navigation</dt>
              <dd className="text-gray-700 ml-4">&quot;Navigation, main navigation, navigation landmark&quot; (role + label + context)</dd>
            </div>
            <div className="border-b border-gray-300 pb-3">
              <dt className="font-bold text-gray-900 text-lg mb-1">List</dt>
              <dd className="text-gray-700 ml-4">&quot;List, 3 items&quot; (role + count), then &quot;Bullet, item text&quot; for each</dd>
            </div>
            <div className="border-b border-gray-300 pb-3">
              <dt className="font-bold text-gray-900 text-lg mb-1">Table</dt>
              <dd className="text-gray-700 ml-4">&quot;Table, 5 rows, 3 columns&quot; (role + dimensions)</dd>
            </div>
            <div>
              <dt className="font-bold text-gray-900 text-lg mb-1">Dialog</dt>
              <dd className="text-gray-700 ml-4">&quot;Settings, dialog&quot; (name + role, focus trapped inside)</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Navigation Strategies */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Navigation Strategies</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Screen reader users employ different strategies depending on familiarity with the site:
        </p>

        <div className="space-y-6">
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-900 mb-3">🆕 First Visit: Exploratory Navigation</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Press H repeatedly to skim headings (get page outline)</li>
              <li>Press D to jump between landmarks (header, nav, main, footer)</li>
              <li>Open elements list (Insert+F7) to see all links, headings, landmarks</li>
              <li>Use &quot;read all&quot; (Insert+↓) to hear entire page</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-3">🔁 Return Visit: Targeted Navigation</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Press K repeatedly to jump through links, find &quot;Sign in&quot;</li>
              <li>Press B to jump to buttons</li>
              <li>Press F to jump to form fields</li>
              <li>Use search (Ctrl+F) to find specific text</li>
            </ul>
          </div>

          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-900 mb-3">📝 Form Filling: Sequential Navigation</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Tab through form fields in order</li>
              <li>Listen to labels and instructions as each field receives focus</li>
              <li>Enter focus mode automatically when reaching input</li>
              <li>Submit with Enter when on submit button</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Common Screen Reader Issues */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Screen Reader Issues</h2>

        <div className="space-y-6">
          <div className="bg-red-50 border-l-4 border-red-600 p-6">
            <h4 className="text-lg font-bold text-red-900 mb-2">Issue 1: Missing Accessible Names</h4>
            <p className="text-gray-700 mb-2">
              <strong>Problem:</strong> Icon buttons with no text or aria-label
            </p>
            <pre className="text-sm bg-white p-3 rounded border border-gray-300 mb-2 font-mono overflow-x-auto">{`❌ <button><svg>...</svg></button>
Announces: "Button" (no indication of purpose)`}</pre>
            <p className="text-gray-700 mb-0">
              <strong>Fix:</strong> Add aria-label or visually-hidden text
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6">
            <h4 className="text-lg font-bold text-red-900 mb-2">Issue 2: Non-semantic Divs</h4>
            <p className="text-gray-700 mb-2">
              <strong>Problem:</strong> Clickable divs without button role
            </p>
            <pre className="text-sm bg-white p-3 rounded border border-gray-300 mb-2 font-mono overflow-x-auto">{`❌ <div onclick="submit()">Submit</div>
No role, not focusable, doesn't announce as interactive`}</pre>
            <p className="text-gray-700 mb-0">
              <strong>Fix:</strong> Use semantic &lt;button&gt; element
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6">
            <h4 className="text-lg font-bold text-red-900 mb-2">Issue 3: Missing Heading Hierarchy</h4>
            <p className="text-gray-700 mb-2">
              <strong>Problem:</strong> Styled text instead of semantic headings
            </p>
            <pre className="text-sm bg-white p-3 rounded border border-gray-300 mb-2 font-mono overflow-x-auto">{`❌ <div class="big-text">About Us</div>
Screen reader can't navigate by headings`}</pre>
            <p className="text-gray-700 mb-0">
              <strong>Fix:</strong> Use &lt;h1&gt; through &lt;h6&gt;
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6">
            <h4 className="text-lg font-bold text-red-900 mb-2">Issue 4: Keyboard Trap</h4>
            <p className="text-gray-700 mb-2">
              <strong>Problem:</strong> Focus stuck inside modal/dropdown with no escape
            </p>
            <p className="text-gray-700 mb-0">
              <strong>Fix:</strong> Implement focus trap with Escape key handler, manage focus properly
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6">
            <h4 className="text-lg font-bold text-red-900 mb-2">Issue 5: No Focus Indicator</h4>
            <p className="text-gray-700 mb-2">
              <strong>Problem:</strong> CSS removes outline, low-vision keyboard users can&apos;t see focus
            </p>
            <pre className="text-sm bg-white p-3 rounded border border-gray-300 mb-2 font-mono overflow-x-auto">{`❌ button { outline: none; }
Removes visible focus indicator`}</pre>
            <p className="text-gray-700 mb-0">
              <strong>Fix:</strong> Provide custom visible focus style
            </p>
          </div>
        </div>
      </section>

      {/* Testing Your Site with Screen Readers */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Testing Your Site with Screen Readers</h2>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-6">Quick Testing Setup</h3>

          <div className="space-y-8">
            <section>
              <h4 className="text-lg font-bold text-blue-900 mb-3">Windows (Free)</h4>
              <ol className="space-y-2 list-decimal list-inside text-gray-700">
                <li>Download NVDA: <a href="https://www.nvaccess.org/" className="text-blue-700 underline hover:text-blue-900">nvaccess.org</a></li>
                <li>Install and restart</li>
                <li>Press Insert to start/stop speech</li>
                <li>Navigate with arrows, H, K, B keys</li>
              </ol>
            </section>

            <section>
              <h4 className="text-lg font-bold text-blue-900 mb-3">Mac (Built-in)</h4>
              <ol className="space-y-2 list-decimal list-inside text-gray-700">
                <li>System Preferences &rarr; Accessibility &rarr; VoiceOver</li>
                <li>Enable VoiceOver (or press Cmd+F5)</li>
                <li>VO = Ctrl+Option (your modifier keys)</li>
                <li>Navigate with VO+arrows</li>
              </ol>
            </section>

            <section>
              <h4 className="text-lg font-bold text-blue-900 mb-3">Chrome DevTools (Visual simulation)</h4>
              <ol className="space-y-2 list-decimal list-inside text-gray-700">
                <li>Open DevTools &rarr; Elements tab</li>
                <li>Right-click element &rarr; Inspect Accessibility</li>
                <li>View computed name, role, properties</li>
                <li>See accessibility tree structure</li>
              </ol>
            </section>
          </div>
        </div>
      </section>

      {/* Developer Checklist */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Developer Checklist</h2>
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
          <ul className="space-y-3 list-none text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✅</span>
              <span>All interactive elements have meaningful accessible names</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✅</span>
              <span>Semantic HTML used (buttons, links, headings, lists, nav, main)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✅</span>
              <span>Heading hierarchy is logical (h1 &rarr; h2 &rarr; h3, no skipping levels)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✅</span>
              <span>Form inputs have associated labels (not just placeholders)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✅</span>
              <span>Images have alt text (or alt=&quot;&quot; for decorative)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✅</span>
              <span>Landmarks used (header, nav, main, aside, footer)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✅</span>
              <span>Focus order matches visual order (tabindex management)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✅</span>
              <span>No keyboard traps (can Tab out of everything)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✅</span>
              <span>ARIA states update dynamically (aria-expanded, aria-pressed)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✅</span>
              <span>Tested with actual screen reader (NVDA or VoiceOver)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Takeaways</h2>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong className="text-green-900">Accessibility tree is parallel to DOM:</strong> Browsers expose semantics to screen readers
            </li>
            <li>
              <strong className="text-green-900">Semantic HTML is critical:</strong> Use native elements (button, nav, h1) whenever possible
            </li>
            <li>
              <strong className="text-green-900">Accessible names are computed:</strong> aria-labelledby &gt; aria-label &gt; native label &gt; text content
            </li>
            <li>
              <strong className="text-green-900">Two modes:</strong> Browse mode for reading, focus mode for forms and widgets
            </li>
            <li>
              <strong className="text-green-900">Keyboard shortcuts are essential:</strong> H for headings, K for links, D for landmarks
            </li>
            <li>
              <strong className="text-green-900">JAWS/NVDA dominant on desktop:</strong> VoiceOver/TalkBack on mobile
            </li>
            <li>
              <strong className="text-green-900">Test with real screen readers:</strong> NVDA is free, VoiceOver is built-in on Mac
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Next Steps</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Now that you understand how screen readers work:
        </p>
        <ul className="space-y-2 text-gray-700 mb-4">
          <li>Install NVDA (Windows) or enable VoiceOver (Mac) and test your current projects</li>
          <li>Navigate your site with keyboard only (no mouse) to identify issues</li>
          <li>Use Chrome DevTools Accessibility inspector to audit your accessibility tree</li>
          <li>Review all interactive elements for accessible names</li>
        </ul>
        <p className="text-lg text-gray-700 leading-relaxed">
          Continue to <strong>Module 11: Switch Access and Scanning</strong> to learn about another critical
          assistive technology for motor disabilities.
        </p>
      </section>
    </div>
  );
}
