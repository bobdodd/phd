export default function SwitchAccessScanning() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* What You'll Learn */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-12 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mt-0 mb-4">What You'll Learn</h2>
        <ul className="list-disc list-outside ml-6 space-y-2 mb-0 text-blue-900">
          <li>What switches are and who uses them</li>
          <li>Single switch (auto-scan) vs. dual switch (step-scan) operation</li>
          <li>Different scanning patterns: linear, row-column, group scanning</li>
          <li>Timing challenges and the cognitive load of scanning</li>
          <li>How to design switch-accessible interfaces</li>
          <li>Testing switch access with keyboard simulation</li>
        </ul>
      </section>

      {/* Why This Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why This Matters</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Switch access is the <strong>last resort input method</strong> for users with severe motor disabilities who
          cannot use a mouse, keyboard, touchscreen, or even voice control. Understanding switch technology is critical because:
        </p>
        <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700 mb-4">
          <li>Users with conditions like ALS, cerebral palsy, or quadriplegia may rely entirely on switches</li>
          <li>Switch navigation is <strong>extremely slow</strong> (5-10x slower than keyboard navigation)</li>
          <li>Poor design can make tasks <strong>impossible</strong> for switch users</li>
          <li>WCAG Level AAA requires keyboard-only access, which enables switch access</li>
          <li>Every interactive element adds time; excessive UI complexity is a barrier</li>
        </ul>
        <p className="text-lg text-gray-700 leading-relaxed">
          If your interface works well for switch users, it will work well for <strong>everyone</strong>.
        </p>
      </section>

      {/* What Is a Switch */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Is a Switch?</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          A <strong>switch</strong> is an assistive technology device that acts as a simple binary input: pressed or not pressed.
          Switches come in many forms:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🖱️ Button Switches</h3>
            <p className="text-gray-700 mb-2">Large physical buttons activated by hand, head, or foot pressure.</p>
            <p className="text-sm text-gray-600">Examples: Jelly Bean, Buddy Button, Big Red Switch</p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">😮 Sip-and-Puff Switches</h3>
            <p className="text-gray-700 mb-2">Activated by blowing or inhaling through a tube.</p>
            <p className="text-sm text-gray-600">Common for users who can only move their head and mouth</p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">👁️ Blink Switches</h3>
            <p className="text-gray-700 mb-2">Infrared sensors detect eye blinks or eyebrow raises.</p>
            <p className="text-sm text-gray-600">For users with minimal voluntary movement</p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🧠 Proximity Switches</h3>
            <p className="text-gray-700 mb-2">Activated by moving any body part near the sensor.</p>
            <p className="text-sm text-gray-600">No physical pressure required</p>
          </div>
        </div>

        <p className="text-lg text-gray-700 leading-relaxed">
          All switches send the same signal to the computer: a single discrete activation. The operating system or software
          then interprets this signal to navigate the interface.
        </p>
      </section>

      {/* Single vs Dual Switch */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Single Switch vs. Dual Switch</h2>

        <div className="space-y-6">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-3">🔵 Single Switch (Auto-Scan Mode)</h3>

            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-2">How It Works:</h4>
              <ol className="list-decimal list-outside ml-6 space-y-2 text-gray-700">
                <li>System automatically highlights interactive elements in sequence</li>
                <li>User watches and waits for the desired element to be highlighted</li>
                <li>User presses the switch when their target is highlighted</li>
                <li>Element is activated (clicked, focused, etc.)</li>
              </ol>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Advantages:</h4>
              <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700">
                <li>Requires only one switch (simplest setup)</li>
                <li>Suitable for users who can only control one body part</li>
                <li>No timing coordination needed between multiple switches</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Disadvantages:</h4>
              <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700">
                <li><strong>Timing pressure:</strong> Must press at the right moment</li>
                <li><strong>Slow:</strong> Must wait for scan to reach target element</li>
                <li><strong>Cognitive load:</strong> Requires sustained attention</li>
                <li><strong>Fatigue:</strong> Missing target means waiting for full cycle</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-blue-300 rounded-lg p-4">
              <h4 className="text-lg font-bold text-blue-900 mb-2">Example Scenario:</h4>
              <p className="text-gray-700 mb-3">
                User wants to click &quot;Submit&quot; button. System scans through elements every 1 second:
              </p>
              <pre className="text-sm font-mono bg-blue-50 p-3 rounded border border-blue-300 overflow-x-auto">
{`t=0s:  [Name field] highlighted
t=1s:  [Email field] highlighted
t=2s:  [Cancel button] highlighted
t=3s:  [Submit button] highlighted ← USER PRESSES SWITCH
t=3.1s: Submit button activated ✓

If user misses at t=3s, they must wait for next cycle.`}
              </pre>
            </div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-900 mb-3">🟣 Dual Switch (Step-Scan Mode)</h3>

            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-2">How It Works:</h4>
              <ol className="list-decimal list-outside ml-6 space-y-2 text-gray-700">
                <li><strong>Switch 1 (Step):</strong> Move highlight to next element</li>
                <li><strong>Switch 2 (Select):</strong> Activate the currently highlighted element</li>
                <li>User has full control over scan speed</li>
                <li>No automatic advancement</li>
              </ol>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Advantages:</h4>
              <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700">
                <li><strong>No timing pressure:</strong> User controls when to advance</li>
                <li><strong>More accurate:</strong> Can pause on target element</li>
                <li><strong>Less cognitive load:</strong> No need to track moving highlight</li>
                <li><strong>Faster for some users:</strong> Can advance quickly through unwanted elements</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Disadvantages:</h4>
              <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700">
                <li>Requires two switches (more complex physical setup)</li>
                <li>User must be able to control two independent body parts</li>
                <li>More total switch activations required</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-purple-300 rounded-lg p-4">
              <h4 className="text-lg font-bold text-purple-900 mb-2">Example Scenario:</h4>
              <p className="text-gray-700 mb-3">
                User wants to click &quot;Submit&quot; button:
              </p>
              <pre className="text-sm font-mono bg-purple-50 p-3 rounded border border-purple-300 overflow-x-auto">
{`User presses Switch 1: [Name field] highlighted
User presses Switch 1: [Email field] highlighted
User presses Switch 1: [Cancel button] highlighted
User presses Switch 1: [Submit button] highlighted
User presses Switch 2: Submit button activated ✓

Total: 4 activations, but no timing pressure.`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Scanning Patterns */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Scanning Patterns</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Different scanning patterns optimize for different interface layouts and user capabilities:
        </p>

        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">1. Linear Scanning</h3>
            <p className="text-gray-700 mb-3">
              <strong>Pattern:</strong> Highlights every element sequentially, one at a time, in DOM order.
            </p>
            <div className="bg-gray-50 p-4 rounded border border-gray-300 mb-3">
              <pre className="text-sm font-mono">{`Element 1 → Element 2 → Element 3 → Element 4 → ...
↑                                                  ↓
←─────────────────────────────────────────────────┘`}</pre>
            </div>
            <p className="text-gray-700 mb-2"><strong>Best for:</strong> Simple interfaces with few elements</p>
            <p className="text-gray-700 mb-0"><strong>Worst for:</strong> Complex pages (too many steps to reach target)</p>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">2. Row-Column Scanning</h3>
            <p className="text-gray-700 mb-3">
              <strong>Pattern:</strong> First highlights rows, then columns within selected row.
            </p>
            <div className="bg-gray-50 p-4 rounded border border-gray-300 mb-3">
              <pre className="text-sm font-mono">{`Step 1: Scan rows           Step 2: Scan columns in row
[Row 1: A B C]              A → B → C
[Row 2: D E F] ← selected   (user selects B)
[Row 3: G H I]`}</pre>
            </div>
            <p className="text-gray-700 mb-2"><strong>Best for:</strong> Grid layouts, keyboards, tables</p>
            <p className="text-gray-700 mb-2"><strong>Speed improvement:</strong> √n instead of n elements (e.g., 6 steps for 9 items vs. 9 steps)</p>
            <p className="text-gray-700 mb-0"><strong>Worst for:</strong> Non-grid layouts</p>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">3. Group Scanning</h3>
            <p className="text-gray-700 mb-3">
              <strong>Pattern:</strong> Elements organized into semantic groups, scan groups first, then items within group.
            </p>
            <div className="bg-gray-50 p-4 rounded border border-gray-300 mb-3">
              <pre className="text-sm font-mono">{`Step 1: Scan groups
[Navigation: Home About Contact]
[Main Content: Article 1, Article 2] ← selected
[Footer: Privacy Terms]

Step 2: Scan items in Main Content
Article 1 → Article 2 → (user selects Article 2)`}</pre>
            </div>
            <p className="text-gray-700 mb-2"><strong>Best for:</strong> Complex pages with clear sections (header, nav, main, footer)</p>
            <p className="text-gray-700 mb-2"><strong>Speed improvement:</strong> Dramatically reduces steps for well-structured content</p>
            <p className="text-gray-700 mb-0"><strong>Requires:</strong> Proper semantic HTML (landmarks, headings)</p>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">4. Frequency-Based Scanning</h3>
            <p className="text-gray-700 mb-3">
              <strong>Pattern:</strong> Most frequently used elements highlighted first.
            </p>
            <p className="text-gray-700 mb-2"><strong>Example:</strong> On a form, &quot;Submit&quot; button scanned before &quot;Reset&quot;</p>
            <p className="text-gray-700 mb-2"><strong>Best for:</strong> Predictable user behavior, repetitive tasks</p>
            <p className="text-gray-700 mb-0"><strong>Requires:</strong> Smart defaults or learning algorithms</p>
          </div>
        </div>
      </section>

      {/* Timing and Cognitive Load */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Timing and Cognitive Load</h2>

        <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-6">
          <h3 className="text-xl font-bold text-red-900 mb-3">The Timing Dilemma</h3>
          <p className="text-gray-700 mb-3">
            Scan speed is a critical trade-off:
          </p>
          <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700">
            <li><strong>Too fast:</strong> User cannot react in time, misses targets, high error rate</li>
            <li><strong>Too slow:</strong> Extremely tedious, increases fatigue, task takes too long</li>
            <li><strong>Typical range:</strong> 0.5-2 seconds per element</li>
          </ul>
        </div>

        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Real-World Time Example</h3>
          <p className="text-gray-700 mb-3">
            Consider a simple task: <strong>Fill out a contact form and submit</strong>
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Mouse user (typical):</h4>
              <p className="text-gray-700">10-15 seconds</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Keyboard user:</h4>
              <p className="text-gray-700">20-30 seconds</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Switch user (single switch, 1s scan speed, 20 elements on page):</h4>
              <ul className="list-disc list-outside ml-6 space-y-1 text-gray-700">
                <li>Scan to Name field: ~5 elements = 5 seconds</li>
                <li>Type name (using on-screen keyboard): ~30 scans = 30 seconds</li>
                <li>Scan to Email field: ~3 elements = 3 seconds</li>
                <li>Type email: ~40 scans = 40 seconds</li>
                <li>Scan to Submit button: ~10 elements = 10 seconds</li>
                <li><strong>Total: ~90 seconds (6x slower than mouse)</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-900 mb-3">Cognitive Load Factors</h3>
          <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700">
            <li><strong>Sustained attention:</strong> User must watch every scan cycle</li>
            <li><strong>Motor precision:</strong> Must activate switch at exact moment</li>
            <li><strong>Error recovery:</strong> Missing target means restarting cycle (frustration)</li>
            <li><strong>Fatigue:</strong> Repeated muscle activations, extended session time</li>
            <li><strong>Context switching:</strong> Reading content while also watching scan progression</li>
          </ul>
        </div>
      </section>

      {/* Designing for Switch Access */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Designing for Switch Access</h2>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">Core Principles</h3>
          <ul className="list-disc list-outside ml-6 space-y-3 text-gray-700">
            <li>
              <strong>Minimize interactive elements:</strong> Every extra button adds time. Combine or remove unnecessary controls.
            </li>
            <li>
              <strong>Logical tab order:</strong> Elements should be in a predictable sequence (visual order = DOM order).
            </li>
            <li>
              <strong>Use semantic landmarks:</strong> Enable group scanning with &lt;nav&gt;, &lt;main&gt;, &lt;aside&gt;, &lt;footer&gt;.
            </li>
            <li>
              <strong>Provide skip links:</strong> &quot;Skip to main content&quot; bypasses navigation (saves many scans).
            </li>
            <li>
              <strong>Large touch targets:</strong> Easier to activate if using head pointer or other adaptive equipment.
            </li>
            <li>
              <strong>Avoid time limits:</strong> Switch users cannot complete tasks quickly (WCAG 2.2.1).
            </li>
            <li>
              <strong>Clear focus indicators:</strong> User needs to see which element is being scanned/focused.
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-red-50 border-l-4 border-red-600 p-6">
            <h4 className="text-lg font-bold text-red-900 mb-2">❌ Bad Example: Navigation with 50 Links</h4>
            <pre className="text-sm bg-white p-3 rounded border border-gray-300 mb-2 font-mono overflow-x-auto">{`<nav>
  <a href="/home">Home</a>
  <a href="/about">About</a>
  <a href="/services">Services</a>
  <!-- ... 47 more links ... -->
  <a href="/contact">Contact</a>
</nav>
<main>
  <h1>Welcome</h1>
  <p>Content here...</p>
</main>`}</pre>
            <p className="text-gray-700 mb-0">
              <strong>Problem:</strong> Switch user must scan through all 50 navigation links before reaching main content.
              At 1s per element, that&apos;s 50 seconds just to start reading the page.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-6">
            <h4 className="text-lg font-bold text-green-900 mb-2">✅ Good Example: Skip Link + Grouped Navigation</h4>
            <pre className="text-sm bg-white p-3 rounded border border-gray-300 mb-2 font-mono overflow-x-auto">{`<a href="#main" class="skip-link">Skip to main content</a>

<nav aria-label="Main navigation">
  <a href="/home">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
  <details>
    <summary>More Pages</summary>
    <!-- 47 other links nested here -->
  </details>
</nav>

<main id="main" tabindex="-1">
  <h1>Welcome</h1>
  <p>Content here...</p>
</main>`}</pre>
            <p className="text-gray-700 mb-0">
              <strong>Solution:</strong> Skip link allows bypassing navigation (1 scan). Grouped navigation reduces visible
              links. Switch user reaches content in ~2 seconds instead of 50.
            </p>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Code Examples</h2>

        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-6">
          <h3 className="text-xl font-bold text-white mb-4">1. Skip Links (WCAG 2.4.1 - Level A)</h3>
          <pre className="text-sm font-mono">
            <code>{`<!-- CSS: Hidden by default, visible on focus -->
<style>
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 999;
}

.skip-link:focus {
  left: 0;
  top: 0;
  background: #000;
  color: #fff;
  padding: 1rem;
}
</style>

<!-- HTML: First focusable element on page -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<!-- Later in DOM -->
<main id="main-content" tabindex="-1">
  <h1>Page Content</h1>
  <!-- ... -->
</main>

<!-- JavaScript: Optional - ensure focus moves -->
<script>
document.querySelector('.skip-link').addEventListener('click', (e) => {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute('href'));
  target.focus();
  target.scrollIntoView();
});
</script>`}</code>
          </pre>
        </div>

        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-6">
          <h3 className="text-xl font-bold text-white mb-4">2. Minimize Tab Stops with groupindex</h3>
          <pre className="text-sm font-mono">
            <code>{`<!-- ❌ BAD: Every icon button is a tab stop -->
<div class="toolbar">
  <button aria-label="Bold">B</button>
  <button aria-label="Italic">I</button>
  <button aria-label="Underline">U</button>
  <button aria-label="Align Left">←</button>
  <button aria-label="Align Center">↔</button>
  <button aria-label="Align Right">→</button>
</div>
<!-- 6 tab stops, 6 scans for switch user -->

<!-- ✅ GOOD: Toolbar is one tab stop, arrow keys navigate internally -->
<div role="toolbar" aria-label="Text formatting">
  <button aria-label="Bold">B</button>
  <button aria-label="Italic">I</button>
  <button aria-label="Underline">U</button>
  <button aria-label="Align Left">←</button>
  <button aria-label="Align Center">↔</button>
  <button aria-label="Align Right">→</button>
</div>

<script>
// Roving tabindex: Only first button is focusable via Tab
// Arrow keys move focus within toolbar
const toolbar = document.querySelector('[role="toolbar"]');
const buttons = toolbar.querySelectorAll('button');

buttons.forEach((btn, index) => {
  btn.tabIndex = index === 0 ? 0 : -1;

  btn.addEventListener('keydown', (e) => {
    let newIndex = index;
    if (e.key === 'ArrowRight') newIndex = (index + 1) % buttons.length;
    if (e.key === 'ArrowLeft') newIndex = (index - 1 + buttons.length) % buttons.length;

    if (newIndex !== index) {
      buttons[newIndex].focus();
      buttons[index].tabIndex = -1;
      buttons[newIndex].tabIndex = 0;
    }
  });
});
</script>
<!-- 1 tab stop, switch user reaches it 6x faster -->`}</code>
          </pre>
        </div>

        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
          <h3 className="text-xl font-bold text-white mb-4">3. Semantic Landmarks for Group Scanning</h3>
          <pre className="text-sm font-mono">
            <code>{`<!-- ✅ GOOD: Proper landmarks enable efficient scanning -->
<body>
  <a href="#main" class="skip-link">Skip to content</a>

  <header>
    <h1>Site Name</h1>
  </header>

  <nav aria-label="Main navigation">
    <!-- Navigation links -->
  </nav>

  <main id="main">
    <h1>Page Title</h1>

    <article>
      <!-- Main content -->
    </article>

    <aside aria-label="Related links">
      <!-- Sidebar content -->
    </aside>
  </main>

  <footer>
    <nav aria-label="Footer navigation">
      <!-- Footer links -->
    </nav>
  </footer>
</body>

<!-- Switch scanning software can now:
     1. Scan landmarks: header → nav → main → aside → footer
     2. User selects "main"
     3. Scan elements within main only

     Result: Dramatically fewer scans to reach target content
-->`}</code>
          </pre>
        </div>
      </section>

      {/* Testing Switch Access */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Testing Switch Access</h2>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Keyboard-Only Testing (Simulates Switch Access)</h3>
          <p className="text-gray-700 mb-4">
            You don&apos;t need specialized hardware to test switch accessibility. Use keyboard-only navigation:
          </p>
          <ol className="list-decimal list-outside ml-6 space-y-3 text-gray-700">
            <li>
              <strong>Unplug or ignore your mouse:</strong> Force yourself to use only keyboard
            </li>
            <li>
              <strong>Press Tab repeatedly:</strong> This simulates switch scanning through focusable elements
            </li>
            <li>
              <strong>Count tab stops:</strong> Every tab press = one scan cycle. More tabs = slower for switch users
            </li>
            <li>
              <strong>Use only Enter/Space:</strong> Activate elements without shortcuts
            </li>
            <li>
              <strong>Time yourself:</strong> If a task takes you 2 minutes with keyboard, switch users may need 10+ minutes
            </li>
          </ol>
        </div>

        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">Testing Checklist</h3>
          <ul className="space-y-3 list-none text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Can you reach all interactive elements with Tab key only?</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Is tab order logical and matches visual layout?</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Does a skip link exist to bypass navigation?</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Are there fewer than 50 tab stops on the main page?</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Can you activate all controls with Enter or Space?</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Are landmarks properly defined (header, nav, main, footer)?</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>No keyboard traps (can Tab out of modals, dropdowns)?</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Clear visible focus indicators on all interactive elements?</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>No time limits or timeout warnings (or can be disabled)?</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Takeaways</h2>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
          <ul className="list-disc list-outside ml-6 space-y-3 text-gray-700">
            <li>
              <strong className="text-green-900">Switches are the last resort:</strong> Used by people with severe motor disabilities
            </li>
            <li>
              <strong className="text-green-900">Single vs. dual switch trade-off:</strong> Single is simpler but has timing pressure; dual is more accurate but requires two switches
            </li>
            <li>
              <strong className="text-green-900">Scanning is slow:</strong> Tasks can take 5-10x longer than keyboard navigation
            </li>
            <li>
              <strong className="text-green-900">Every element adds time:</strong> Minimize interactive elements ruthlessly
            </li>
            <li>
              <strong className="text-green-900">Skip links are critical:</strong> Allow bypassing repetitive content
            </li>
            <li>
              <strong className="text-green-900">Use semantic landmarks:</strong> Enable group scanning for faster navigation
            </li>
            <li>
              <strong className="text-green-900">Test with keyboard only:</strong> Simulates switch user experience
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Next Steps</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Now that you understand switch access:
        </p>
        <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700 mb-4">
          <li>Test your current site with keyboard-only navigation</li>
          <li>Count how many Tab presses are needed to reach main content</li>
          <li>Add skip links if they don&apos;t exist</li>
          <li>Review your interface for unnecessary interactive elements</li>
          <li>Ensure semantic landmarks are properly implemented</li>
        </ul>
        <p className="text-lg text-gray-700 leading-relaxed">
          Continue to <a href="/learn/developers/modules/alternative-input-output" className="text-blue-700 hover:text-blue-900 font-medium underline">Module 12: Alternative Input and Output Devices</a> to explore the full spectrum
          of assistive technologies.
        </p>
      </section>
    </div>
  );
}
