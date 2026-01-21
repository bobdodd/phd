'use client';

import Link from 'next/link';

export default function AboutSwitchesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="bg-purple-700 text-white py-6 shadow-lg">
        <div className="max-w-5xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center text-purple-100 hover:text-white mb-4 transition-colors">
            ← Back to Playground
          </Link>
          <h1 className="text-4xl font-bold">About Switch Technology</h1>
          <p className="text-xl text-purple-100 mt-2">Essential knowledge for web developers</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* Introduction */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What is Switch Access Technology?</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Switch access is assistive technology that allows people with severe motor disabilities to control computers, smartphones,
              communication devices, and even wheelchairs using <strong>one or more adaptive switches</strong> instead of traditional input
              methods like keyboards, mice, or touchscreens.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              A switch is essentially a specialized button that can be activated through various physical movements - from pressing with a hand or foot,
              to head movements, eye blinks, sip-and-puff breath control, or even subtle muscle twitches. The key is that these switches require
              <strong> minimal physical effort</strong> to activate.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              For web developers, understanding switch access is critical because users rely entirely on <strong>sequential scanning</strong> through
              interface elements. If your interactive elements aren't properly coded, switch users literally cannot access them - no workarounds available.
            </p>
          </div>
        </section>

        {/* Who Uses Switches */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who Uses Switch Access?</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border border-purple-200 bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">People with Cerebral Palsy</h3>
              <p className="text-gray-700">
                Motor control limitations make traditional keyboards and mice difficult or impossible to use. Switch access provides
                an alternative input method that works with their range of motion.
              </p>
            </div>

            <div className="border border-purple-200 bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Spinal Cord Injury Survivors</h3>
              <p className="text-gray-700">
                Individuals with quadriplegia or limited hand/arm mobility use head switches, sip-and-puff devices, or foot switches
                to maintain independence in computer use.
              </p>
            </div>

            <div className="border border-purple-200 bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">People with ALS (Lou Gehrig's Disease)</h3>
              <p className="text-gray-700">
                As motor function declines, switch access becomes essential. Many progress from button switches to eye-gaze or
                muscle-twitch activated switches.
              </p>
            </div>

            <div className="border border-purple-200 bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Children with Multiple Disabilities</h3>
              <p className="text-gray-700">
                Switch access enables participation in education, communication, and play for children with complex physical
                and cognitive disabilities.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r">
            <p className="text-blue-900 font-semibold mb-2">Key Point for Developers:</p>
            <p className="text-blue-800">
              Switch users often have the <strong>most severe motor disabilities</strong>. If your site works for switch access,
              it works for virtually everyone. Switch accessibility is the "highest bar" for motor disability access.
            </p>
          </div>
        </section>

        {/* Types of Switches */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of Adaptive Switches</h2>

          <div className="space-y-6">
            {/* Button Switches */}
            <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Button Switches</h3>
              <p className="text-gray-700 mb-3">
                Large, pressure-sensitive buttons that can be placed near any body part with reliable movement - hand, foot, elbow, head, knee.
                Require light touch (as little as 2-3 ounces of pressure).
              </p>
              <p className="text-sm text-blue-800 italic">
                "The classic switch - looks like a big round button, usually 2-5 inches in diameter"
              </p>
            </div>

            {/* Sip-and-Puff */}
            <div className="border-l-4 border-green-500 pl-6 py-4 bg-green-50 rounded-r">
              <h3 className="text-xl font-semibold text-green-900 mb-2">Sip-and-Puff Switches</h3>
              <p className="text-gray-700 mb-3">
                Controlled by breath - a gentle sip (inhale) or puff (exhale) on a tube or straw. Critical for users with quadriplegia
                or very limited motor control.
              </p>
              <p className="text-sm text-green-800 italic">
                "Enables complete computer control using only breath - often mounted on a wheelchair"
              </p>
            </div>

            {/* Head Switches */}
            <div className="border-l-4 border-purple-500 pl-6 py-4 bg-purple-50 rounded-r">
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Head Switches</h3>
              <p className="text-gray-700 mb-3">
                Mounted on headrests or headbands, activated by head movements (tilt, turn, or touch). Can be pillow-style switches that
                respond to head pressure.
              </p>
              <p className="text-sm text-purple-800 italic">
                "User can control device by moving head left, right, forward, or back"
              </p>
            </div>

            {/* Proximity/Motion Switches */}
            <div className="border-l-4 border-yellow-500 pl-6 py-4 bg-yellow-50 rounded-r">
              <h3 className="text-xl font-semibold text-yellow-900 mb-2">Proximity and Motion Sensors</h3>
              <p className="text-gray-700 mb-3">
                Detect movement without requiring contact - hand/finger movement, facial gestures, or body position changes.
                Uses infrared or other sensing technology.
              </p>
              <p className="text-sm text-yellow-800 italic">
                "No pressure needed - just wave hand or move body part within sensor range"
              </p>
            </div>

            {/* EMG/Muscle Switches */}
            <div className="border-l-4 border-red-500 pl-6 py-4 bg-red-50 rounded-r">
              <h3 className="text-xl font-semibold text-red-900 mb-2">EMG (Muscle) Switches</h3>
              <p className="text-gray-700 mb-3">
                Detect electrical signals from muscle contractions using electrodes on the skin. Can work with extremely small movements -
                even muscle twitches invisible to the eye.
              </p>
              <p className="text-sm text-red-800 italic">
                "For users who can only move a single muscle - facial muscles, forehead, jaw, etc."
              </p>
            </div>

            {/* Eye Blink */}
            <div className="border-l-4 border-indigo-500 pl-6 py-4 bg-indigo-50 rounded-r">
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">Eye Blink Switches</h3>
              <p className="text-gray-700 mb-3">
                Small sensors mounted on glasses that detect intentional eye blinks (distinguished from natural blinking).
                Used when eye movement is the most reliable motor control.
              </p>
              <p className="text-sm text-indigo-800 italic">
                "Double blink to click, single blink to select"
              </p>
            </div>
          </div>
        </section>

        {/* How Switch Scanning Works */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How Switch Scanning Works</h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Since switch users can only press one or two buttons, they can't directly point to what they want (like with a mouse).
            Instead, the system uses <strong>scanning</strong> - automatically or manually highlighting items on screen in a sequence,
            and the user activates their switch when the desired item is highlighted.
          </p>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Single Switch Scanning (Auto-Scan)</h3>
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>System automatically highlights elements in sequence (like buttons, links, menu items)</li>
                  <li>Each element is highlighted for a set duration (e.g., 1-3 seconds - user configurable)</li>
                  <li>User presses their switch when the item they want is highlighted</li>
                  <li>That item is activated (clicked/selected)</li>
                  <li>Process repeats for next interaction</li>
                </ol>
              </div>
              <div className="bg-white border border-blue-200 rounded p-4">
                <p className="font-semibold text-blue-900 mb-2">Example Scenario:</p>
                <p className="text-gray-700 text-sm">
                  User wants to click "Submit" button. System highlights "Name field" (1 sec) → "Email field" (1 sec) →
                  "Submit button" (1 sec) → <strong>User presses switch!</strong> → Submit button activates.
                </p>
              </div>
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-600 p-4">
                <p className="text-yellow-900 font-medium">Challenge:</p>
                <p className="text-yellow-800 text-sm">
                  Requires excellent timing and concentration. If user presses too early or late, wrong element activates.
                  Timing pressure can be exhausting, especially with fast scan rates.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Dual Switch Scanning (Step-Scan)</h3>
            <div className="bg-green-50 border border-green-300 rounded-lg p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-green-900 mb-2">How it works:</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li><strong>Switch 1 (Step):</strong> Manually move highlight to next element</li>
                  <li><strong>Switch 2 (Select):</strong> Activate the currently highlighted element</li>
                  <li>User controls the pace completely - no automatic timing</li>
                </ol>
              </div>
              <div className="bg-white border border-green-200 rounded p-4">
                <p className="font-semibold text-green-900 mb-2">Example Scenario:</p>
                <p className="text-gray-700 text-sm">
                  User presses Switch 1 (step) → highlight moves to Name field. Press Switch 1 again → Email field.
                  Again → Submit button. Press Switch 2 (select) → Submit button activates.
                </p>
              </div>
              <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4">
                <p className="text-blue-900 font-medium">Advantage:</p>
                <p className="text-blue-800 text-sm">
                  No timing pressure! User can take as long as needed. More accurate and less fatiguing than auto-scan.
                  However, requires ability to reliably operate two separate switches.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Scanning Patterns</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-300 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Linear Scanning</h4>
                <p className="text-gray-700 mb-3">
                  Simplest pattern: highlights each element one by one in order (top to bottom, left to right).
                </p>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  Item 1 → Item 2 → Item 3 → Item 4 → ...
                </div>
                <p className="text-sm text-gray-600 mt-2 italic">
                  Easy to understand but slow for finding items at end of list
                </p>
              </div>

              <div className="border border-gray-300 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Row-Column Scanning</h4>
                <p className="text-gray-700 mb-3">
                  For grid layouts: first scan rows, user selects row, then scan items within that row.
                </p>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  Row 1 → Row 2 → (select Row 2)<br />
                  → Col 1 → Col 2 → (select Col 2)
                </div>
                <p className="text-sm text-gray-600 mt-2 italic">
                  Faster for large grids but requires two-step selection
                </p>
              </div>

              <div className="border border-gray-300 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Group Scanning</h4>
                <p className="text-gray-700 mb-3">
                  Elements organized in groups: scan groups first, user selects group, then scan items within group.
                </p>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  Group A → Group B → (select B)<br />
                  → Item B1 → Item B2 → ...
                </div>
                <p className="text-sm text-gray-600 mt-2 italic">
                  Efficient for menus, navigation, and logically grouped items
                </p>
              </div>

              <div className="border border-gray-300 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Auditory Scanning</h4>
                <p className="text-gray-700 mb-3">
                  For users with visual impairments: system speaks item names instead of (or in addition to) visual highlighting.
                </p>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  [Voice: "Home"] → [Voice: "Products"]<br />
                  → [Voice: "Contact"] → (press switch)
                </div>
                <p className="text-sm text-gray-600 mt-2 italic">
                  Combines switch access with screen reader functionality
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Web Accessibility Requirements */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What This Means for Web Development</h2>

          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-semibold text-red-900 mb-3">Critical Insight</h3>
            <p className="text-lg text-red-800 leading-relaxed">
              Switch users access websites through <strong>assistive technology that simulates keyboard input</strong>. Their switch
              presses are converted to Tab, Enter, Space, and arrow key presses. This means:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-red-800">
              <li>If it's not keyboard accessible, it's not switch accessible</li>
              <li>Tab order = scanning order</li>
              <li>Keyboard traps are catastrophic failures</li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-purple-600 pl-6 py-4 bg-purple-50 rounded-r">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">1. Every Interactive Element Must Be Reachable</h3>
              <p className="text-gray-700 mb-3">
                Switch users scan through <strong>only focusable elements</strong> (buttons, links, form fields). If something is clickable
                but not in the tab order, it's completely invisible to switch scanning.
              </p>
              <div className="bg-white border border-purple-300 rounded p-4 mt-3">
                <p className="font-semibold text-purple-900 mb-2 text-sm">❌ Bad Code:</p>
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
{`<div class="card" onclick="openDetails()">
  <!-- Not keyboard accessible, not in tab order -->
</div>`}
                </pre>
                <p className="font-semibold text-green-900 mb-2 mt-4 text-sm">✓ Good Code:</p>
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
{`<button class="card" onclick="openDetails()">
  <!-- Or: <div role="button" tabindex="0" onclick... with keyboard handler -->
</button>`}
                </pre>
              </div>
            </div>

            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-blue-50 rounded-r">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">2. Logical Tab Order is Crucial</h3>
              <p className="text-gray-700 mb-3">
                Switch scanning follows keyboard tab order. If your visual layout doesn't match DOM order, switch users experience
                a chaotic, illogical navigation sequence.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mt-3">
                <p className="text-yellow-900 font-medium mb-2">Example Problem:</p>
                <p className="text-yellow-800 text-sm">
                  Visual layout (using CSS): Header → Main Content → Sidebar<br />
                  DOM order: Header → Sidebar → Main Content<br />
                  <strong>Result:</strong> Switch user scans header, then sidebar (skipping main content), then goes back to main content. Confusing and disorienting!
                </p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-600 p-4 mt-3">
                <p className="text-green-900 font-medium mb-2">Solution:</p>
                <p className="text-green-800 text-sm">
                  Keep DOM order matching visual/logical order. Use CSS Grid or Flexbox for layout, but don't reorder content drastically.
                  If you must reorder visually, ensure tab order still makes sense.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-red-600 pl-6 py-4 bg-red-50 rounded-r">
              <h3 className="text-xl font-semibold text-red-900 mb-3">3. Keyboard Traps are Catastrophic</h3>
              <p className="text-gray-700 mb-3">
                A keyboard trap occurs when focus enters an element but can't leave. For switch users, this means they're
                <strong> permanently stuck</strong> - no way to escape, must reload page.
              </p>
              <div className="bg-white border border-red-300 rounded p-4 mt-3">
                <p className="font-semibold text-red-900 mb-2 text-sm">Common Trap Example: Modal Dialog</p>
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto mb-3">
{`<!-- Modal opens, user can tab through modal content -->
<!-- But close button is <span onclick>, not focusable! -->
<!-- User trapped, can't close modal -->`}
                </pre>
                <p className="font-semibold text-green-900 mb-2 text-sm">✓ Solution:</p>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Make close button a real &lt;button&gt;</li>
                  <li>Support Escape key to close</li>
                  <li>Implement focus trap (cycle through modal elements, don't leave modal)</li>
                  <li>Return focus to trigger element when modal closes</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-green-600 pl-6 py-4 bg-green-50 rounded-r">
              <h3 className="text-xl font-semibold text-green-900 mb-3">4. Clear Focus Indicators Are Essential</h3>
              <p className="text-gray-700 mb-3">
                Switch users need to see which element is currently highlighted/focused. If you remove the default focus outline
                without providing an alternative, they're navigating blind.
              </p>
              <div className="bg-white border border-green-300 rounded p-4 mt-3">
                <p className="font-semibold text-red-900 mb-2 text-sm">❌ Never do this without replacement:</p>
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
{`button:focus {
  outline: none; /* User has no idea where they are! */
}`}
                </pre>
                <p className="font-semibold text-green-900 mb-2 mt-4 text-sm">✓ Provide custom focus indicator:</p>
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
{`button:focus {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
  /* Or use box-shadow, border, background change */
}`}
                </pre>
              </div>
            </div>

            <div className="border-l-4 border-indigo-600 pl-6 py-4 bg-indigo-50 rounded-r">
              <h3 className="text-xl font-semibold text-indigo-900 mb-3">5. Minimize Number of Focusable Elements</h3>
              <p className="text-gray-700 mb-3">
                Every extra tab stop = extra scan cycles for switch users. Be intentional about what's focusable. Don't make
                every &lt;div&gt; in your layout tabbable.
              </p>
              <div className="bg-white border border-indigo-300 rounded p-4 mt-3">
                <p className="font-semibold text-indigo-900 mb-2 text-sm">Examples:</p>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                  <li><strong>Decorative images:</strong> Use alt="" and role="presentation" - not focusable</li>
                  <li><strong>Card containers:</strong> If entire card is clickable, make the card the button, not a wrapper div</li>
                  <li><strong>Skip links:</strong> Add "Skip to main content" link at top so users can bypass navigation</li>
                  <li><strong>Hidden content:</strong> Use display:none or visibility:hidden to remove from tab order when not visible</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-yellow-600 pl-6 py-4 bg-yellow-50 rounded-r">
              <h3 className="text-xl font-semibold text-yellow-900 mb-3">6. Use Semantic HTML and ARIA</h3>
              <p className="text-gray-700 mb-3">
                Assistive technology needs to understand what elements are and how they behave. Proper roles, states, and
                properties enable switch users to know what will happen when they activate an element.
              </p>
              <div className="bg-white border border-yellow-300 rounded p-4 mt-3">
                <p className="font-semibold text-yellow-900 mb-2 text-sm">Examples:</p>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                  <li>
                    <strong>Expandable sections:</strong> Use aria-expanded="true/false" so users know current state
                  </li>
                  <li>
                    <strong>Checkboxes:</strong> Use aria-checked or real &lt;input type="checkbox"&gt;
                  </li>
                  <li>
                    <strong>Disabled buttons:</strong> Use disabled attribute or aria-disabled="true"
                  </li>
                  <li>
                    <strong>Current page:</strong> Use aria-current="page" on navigation links
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testing with Switches */}
        <section className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-8 mb-8 border-2 border-purple-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Testing Your Site for Switch Access</h2>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-semibold text-purple-900 mb-4">Keyboard-Only Testing (Simulates Switch Access)</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Unplug Your Mouse</h4>
                  <p className="text-gray-700">
                    Literally disconnect it. You need to experience the site as someone who can't use a mouse.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Use Only Tab, Enter, Space, and Arrow Keys</h4>
                  <p className="text-gray-700 mb-2">
                    <strong>Tab:</strong> Move to next interactive element<br />
                    <strong>Shift+Tab:</strong> Move to previous element<br />
                    <strong>Enter:</strong> Activate buttons and links<br />
                    <strong>Space:</strong> Activate buttons, toggle checkboxes<br />
                    <strong>Arrow keys:</strong> Radio buttons, select dropdowns, sliders
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Complete Critical User Journeys</h4>
                  <p className="text-gray-700">
                    Try to accomplish key tasks: sign up, log in, make a purchase, fill out contact form, navigate to product pages.
                    If you get stuck or can't reach something, you've found an accessibility barrier.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pay Attention to Tab Order</h4>
                  <p className="text-gray-700">
                    Does the focus move in a logical order? Or does it jump around chaotically? Does it match the visual layout?
                    Illogical order = poor switch access experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Test Modal Dialogs and Overlays Carefully</h4>
                  <p className="text-gray-700">
                    Can you open them? Can you close them with keyboard? Does focus get trapped? Can you reach all content inside?
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-semibold text-purple-900 mb-4">Browser Switch Access Simulators</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Android: Switch Access (Built-in)</h4>
                <p className="text-gray-700 mb-2">
                  Settings → Accessibility → Switch Access. Simulates single or dual switch scanning on Android devices.
                  Great for testing mobile web apps.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">iOS: Switch Control (Built-in)</h4>
                <p className="text-gray-700 mb-2">
                  Settings → Accessibility → Switch Control. Apple's built-in switch scanning for iPhone/iPad.
                  Test your mobile site with real switch simulation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Paradise Playground: Switch Simulator</h4>
                <p className="text-gray-700">
                  The playground you're using right now includes a switch access simulator. Use it to see how your code
                  behaves with auto-scan and step-scan modes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">Key Questions to Ask</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-purple-600 text-xl flex-shrink-0">?</span>
                <span className="text-gray-700">Can I reach every button, link, and form field with Tab alone?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 text-xl flex-shrink-0">?</span>
                <span className="text-gray-700">Can I see clearly where keyboard focus is at all times?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 text-xl flex-shrink-0">?</span>
                <span className="text-gray-700">Does tab order make sense and match visual layout?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 text-xl flex-shrink-0">?</span>
                <span className="text-gray-700">Can I open AND close all modals, menus, and overlays with keyboard?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 text-xl flex-shrink-0">?</span>
                <span className="text-gray-700">Are there any elements I can't escape from (keyboard traps)?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 text-xl flex-shrink-0">?</span>
                <span className="text-gray-700">Do custom widgets (sliders, tabs, accordions) work with keyboard?</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Real User Impact */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding the Real Impact</h2>

          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-purple-900 mb-3">Time and Effort</h3>
            <p className="text-gray-700 mb-3">
              Imagine having to scan through every single interactive element on a page, one by one, waiting 1-2 seconds for each.
              A page with 50 focusable elements takes 50-100 seconds just to scan through - and that's if they don't miss their target
              and have to start over.
            </p>
            <p className="text-purple-800 font-medium">
              Developer takeaway: Every unnecessary tab stop you add to your page multiplies the time and cognitive load for switch users.
              Be intentional about what's focusable.
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-3">Cognitive Load</h3>
            <p className="text-gray-700 mb-3">
              With auto-scan, users must maintain constant attention and perfect timing. With step-scan, they must remember where
              they are in the sequence. Complex navigation structures become mental mazes.
            </p>
            <p className="text-blue-800 font-medium">
              Developer takeaway: Simple, predictable layouts with clear logical flow reduce cognitive load. Consistency across
              pages helps users build mental models.
            </p>
          </div>

          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-red-900 mb-3">Fatigue</h3>
            <p className="text-gray-700 mb-3">
              Physical fatigue from repeated switch activation. Mental fatigue from concentration required. Emotional fatigue from
              encountering accessibility barriers. Many users can only use their computer for limited periods before exhaustion.
            </p>
            <p className="text-red-800 font-medium">
              Developer takeaway: Sites that work efficiently with switches respect users' limited energy. Sites with barriers
              (keyboard traps, missing focus indicators, illogical tab order) are exhausting and may be completely unusable.
            </p>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Key Takeaways for Developers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">1. Keyboard Accessibility = Switch Accessibility</h3>
              <p className="text-purple-100">
                If your site isn't fully keyboard accessible, it's not switch accessible. Period. Test with keyboard only.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">2. Tab Order = Scanning Order</h3>
              <p className="text-purple-100">
                The sequence of focusable elements (DOM order) determines the scanning sequence. Make it logical and predictable.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">3. Focus Indicators Are Mandatory</h3>
              <p className="text-purple-100">
                Clear, visible focus indicators are not optional styling - they're essential navigation feedback for switch users.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">4. Minimize Cognitive Load</h3>
              <p className="text-purple-100">
                Every extra tab stop, every illogical jump in focus order, every hidden trap increases mental effort exponentially.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-white/20 rounded-lg p-6 border-2 border-white/40">
            <p className="text-xl font-semibold mb-3">
              The Bottom Line
            </p>
            <p className="text-lg text-purple-50">
              Switch access is the ultimate test of keyboard accessibility. If someone who can only press one or two buttons
              can use your site, then anyone can use your site. Focus on semantic HTML, logical tab order, and thorough keyboard testing.
              Switch users depend on developers who understand that accessibility isn't a feature - it's foundational.
            </p>
          </div>
        </section>

        {/* Resources */}
        <section className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Learn More</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Switch Access Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://axesslab.com/switches/" className="text-purple-600 hover:underline" target="_blank" rel="noopener">
                    Axess Lab: The Switch
                  </a>
                </li>
                <li>
                  <a href="https://www.assistiveware.com/learn-aac/explore-vocabulary-organization-in-aac-apps" className="text-purple-600 hover:underline" target="_blank" rel="noopener">
                    AssistiveWare: Switch Scanning Modes
                  </a>
                </li>
                <li>
                  <a href="https://support.google.com/accessibility/android/answer/6122836" className="text-purple-600 hover:underline" target="_blank" rel="noopener">
                    Android Switch Access Guide
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Keyboard Accessibility Guidelines</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://webaim.org/techniques/keyboard/" className="text-purple-600 hover:underline" target="_blank" rel="noopener">
                    WebAIM: Keyboard Accessibility
                  </a>
                </li>
                <li>
                  <a href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard" className="text-purple-600 hover:underline" target="_blank" rel="noopener">
                    WCAG: Keyboard Criterion
                  </a>
                </li>
                <li>
                  <a href="https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/" className="text-purple-600 hover:underline" target="_blank" rel="noopener">
                    ARIA: Keyboard Interface Practices
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gray-300">
            Part of Paradise Playground - Learn accessibility by doing
          </p>
          <Link href="/" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
            Return to Playground
          </Link>
        </div>
      </footer>
    </div>
  );
}
