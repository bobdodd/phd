export default function MotorDisabilities() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* What You'll Learn */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-12 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mt-0 mb-4">What You'll Learn</h2>
        <ul className="space-y-2 mb-0">
          <li>The spectrum of motor disabilities from limited dexterity to complete paralysis</li>
          <li>Assistive technologies: switch access, voice control, eye tracking, adaptive keyboards</li>
          <li>Why keyboard accessibility is the foundation of motor accessibility</li>
          <li>Common barriers in interactive interfaces and how to fix them</li>
          <li>Developer responsibilities for motor-accessible design</li>
        </ul>
      </section>

      {/* Why This Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why This Matters</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Motor disabilities affect how users physically interact with digital interfaces. From difficulty using
          a mouse to complete inability to use hands, motor disabilities represent one of the most diverse
          categories of disability. Keyboard accessibility—the foundation of all motor-accessible design—benefits
          not just users with motor disabilities, but also power users, developers, and anyone who prefers
          keyboard navigation.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6">
          <p className="text-lg font-semibold text-yellow-900 mb-2">📊 By the Numbers</p>
          <ul className="space-y-2 text-gray-700 mb-0">
            <li><strong>1 billion people</strong> worldwide live with some form of disability, many affecting mobility (WHO, 2023)</li>
            <li><strong>39 million Americans</strong> have difficulty using their hands or arms</li>
            <li><strong>5.5 million people</strong> in the US live with paralysis</li>
            <li><strong>Arthritis affects 58.5 million adults</strong> in the US, limiting fine motor control</li>
            <li><strong>Repetitive strain injuries (RSI)</strong> affect millions of computer users</li>
          </ul>
        </div>
      </section>

      {/* The Spectrum of Motor Disabilities */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Spectrum of Motor Disabilities</h2>
        <p className="text-lg text-gray-700 mb-6">
          Motor disabilities vary widely in severity, affected body parts, and assistive technology needs.
        </p>

        <div className="space-y-6">
          {/* Limited Fine Motor Control */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-2xl font-semibold text-blue-900 mb-3">1. Limited Fine Motor Control</h3>
            <p className="text-gray-700 mb-4">
              Difficulty with precise movements like clicking small targets, dragging, or performing multi-finger
              gestures. Common in arthritis, Parkinson's disease, essential tremor, or aging.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="font-semibold text-blue-900 mb-2">Characteristics:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Hand tremors make precise clicking difficult</li>
                <li>Difficulty with drag-and-drop operations</li>
                <li>Accidental clicks or double-clicks</li>
                <li>Fatigue with extended mouse use</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Large click targets (minimum 44x44px for touch, 24x24px for mouse)</li>
                <li>Avoid drag-and-drop as the only interaction method</li>
                <li>Provide keyboard alternatives to all mouse actions</li>
                <li>Generous spacing between clickable elements</li>
                <li>Disable or provide option to disable hover-dependent interactions</li>
              </ul>
            </div>
          </div>

          {/* Limited Hand/Arm Mobility */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-2xl font-semibold text-purple-900 mb-3">2. Limited Hand/Arm Mobility</h3>
            <p className="text-gray-700 mb-4">
              Reduced range of motion or strength. May use keyboard with mouth stick, head wand, or adaptive
              keyboard. Common after stroke, spinal cord injury, cerebral palsy, or muscular dystrophy.
            </p>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="font-semibold text-purple-900 mb-2">Assistive technologies:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li><strong>Mouth stick:</strong> Physical pointer held in mouth to press keys</li>
                <li><strong>Head wand:</strong> Pointer attached to head/headband</li>
                <li><strong>Adaptive keyboards:</strong> Larger keys, key guards, one-handed layouts</li>
                <li><strong>Sticky keys:</strong> OS feature to press modifier keys (Shift, Ctrl) sequentially</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>All functionality keyboard accessible</li>
                <li>No time-limited interactions (avoid timeouts)</li>
                <li>Support sticky keys (avoid requiring simultaneous keypresses)</li>
                <li>Avoid keyboard traps (user can always escape)</li>
              </ul>
            </div>
          </div>

          {/* Inability to Use Hands */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-2xl font-semibold text-red-900 mb-3">3. Inability to Use Hands</h3>
            <p className="text-gray-700 mb-4">
              Cannot use conventional input devices. May use voice control, eye tracking, switch access, or
              sip-and-puff devices. Common in quadriplegia, ALS, severe cerebral palsy.
            </p>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="font-semibold text-red-900 mb-2">Assistive technologies:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li><strong>Voice control:</strong> Dragon NaturallySpeaking, macOS Voice Control, Windows Speech Recognition</li>
                <li><strong>Eye tracking:</strong> Tobii eye trackers, control cursor with eye gaze</li>
                <li><strong>Switch access:</strong> One or two switches for scanning through interface</li>
                <li><strong>Sip-and-puff:</strong> Device controlled by breath (sip = click, puff = right-click)</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Voice control relies on proper labels and roles (semantic HTML + ARIA)</li>
                <li>Switch access requires proper focus order and keyboard navigation</li>
                <li>Eye tracking benefits from large click targets</li>
                <li>All interactive elements must be focusable and activatable</li>
              </ul>
            </div>
          </div>

          {/* Slow Response Time */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <h3 className="text-2xl font-semibold text-orange-900 mb-3">4. Slow Response Time</h3>
            <p className="text-gray-700 mb-4">
              Takes longer to perform actions due to physical limitations. May be combined with other motor
              disabilities or cognitive factors.
            </p>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>No automatic timeouts (or provide extension mechanism)</li>
                <li>Allow ample time for form completion</li>
                <li>Warn before session expiration with option to extend</li>
                <li>Save work automatically (don't lose progress)</li>
              </ul>
            </div>
          </div>

          {/* Temporary/Situational Motor Limitations */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
            <h3 className="text-2xl font-semibold text-teal-900 mb-3">5. Temporary & Situational Limitations</h3>
            <p className="text-gray-700 mb-4">
              Not always permanent disabilities—injuries, RSI, holding a baby, wearing gloves, or using mobile
              device one-handed all create temporary motor limitations.
            </p>
            <div className="bg-teal-50 rounded-lg p-4">
              <p className="font-semibold text-teal-900 mb-2">Examples:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Broken arm or wrist injury</li>
                <li>Carpal tunnel syndrome or RSI from typing</li>
                <li>Holding phone one-handed while carrying items</li>
                <li>Wearing winter gloves (limits touchscreen accuracy)</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <p className="text-gray-700">
                The same accessibility features that help permanent disabilities benefit everyone. Keyboard
                navigation helps RSI sufferers. Large touch targets help gloved hands. Motor accessibility
                is universal design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Assistive Technologies Deep Dive */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Assistive Technologies for Motor Disabilities</h2>

        <div className="space-y-6">
          {/* Keyboard-Only Navigation */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">⌨️</div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Keyboard-Only Navigation</h3>
                <p className="text-gray-700">
                  The foundation of motor accessibility. Users navigate using Tab, Enter, Arrow keys, and shortcuts.
                  Many motor disabilities rely entirely on keyboard input (via standard keyboard or adaptive devices).
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-4">
              <p className="font-semibold text-gray-900 mb-3">Essential Keyboard Interactions:</p>
              <div className="space-y-2 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-900">Navigation:</p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li><kbd className="px-2 py-1 bg-gray-200 rounded">Tab</kbd> - Next focusable element</li>
                      <li><kbd className="px-2 py-1 bg-gray-200 rounded">Shift+Tab</kbd> - Previous element</li>
                      <li><kbd className="px-2 py-1 bg-gray-200 rounded">↑ ↓ ← →</kbd> - Within components</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Activation:</p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li><kbd className="px-2 py-1 bg-gray-200 rounded">Enter</kbd> - Activate button/link</li>
                      <li><kbd className="px-2 py-1 bg-gray-200 rounded">Space</kbd> - Toggle checkbox/button</li>
                      <li><kbd className="px-2 py-1 bg-gray-200 rounded">Esc</kbd> - Close modal/menu</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="font-semibold text-yellow-900 mb-2">⚠️ Critical Requirements:</p>
              <ul className="space-y-2 text-gray-700 mb-0">
                <li><strong>All interactive elements focusable:</strong> Buttons, links, inputs, custom widgets</li>
                <li><strong>Visible focus indicators:</strong> Clear outline showing which element has focus</li>
                <li><strong>Logical focus order:</strong> Tab order matches visual reading order</li>
                <li><strong>No keyboard traps:</strong> User can always Tab away from an element</li>
                <li><strong>Skip links:</strong> Allow skipping repetitive content (navigation)</li>
              </ul>
            </div>
          </div>

          {/* Voice Control */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">🎤</div>
              <div>
                <h3 className="text-2xl font-bold text-purple-900 mb-2">Voice Control</h3>
                <p className="text-gray-700">
                  Users control interface entirely by voice commands. Can click elements by saying their visible
                  label ("Click Submit"), navigate ("Scroll down"), and dictate text.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-4">
              <p className="font-semibold text-gray-900 mb-3">Popular Voice Control Systems:</p>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Dragon NaturallySpeaking:</strong> Professional speech recognition, Windows/Mac</li>
                <li><strong>macOS Voice Control:</strong> Built-in, highly capable, works system-wide</li>
                <li><strong>Windows Speech Recognition:</strong> Built-in, improving with each version</li>
                <li><strong>Voice Access (Android):</strong> Google's hands-free control for Android</li>
              </ul>
            </div>

            <div className="bg-blue-100 border-l-4 border-blue-600 p-4">
              <p className="font-semibold text-blue-900 mb-2">How Voice Control Interacts with Web:</p>
              <ol className="space-y-2 text-gray-700 mb-0 list-decimal list-inside">
                <li>Voice control software parses accessibility tree (like screen readers)</li>
                <li>Identifies interactive elements by their accessible names</li>
                <li>User says "Click [accessible name]" to activate element</li>
                <li>Software simulates click on that element</li>
              </ol>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-2 text-gray-700 mb-0">
                <li><strong>Visible labels:</strong> Button text must match accessible name ("Submit" not "→")</li>
                <li><strong>Unique labels:</strong> Multiple "Edit" buttons need context ("Edit profile", "Edit settings")</li>
                <li><strong>Proper roles:</strong> Use semantic HTML so voice control knows what's clickable</li>
                <li><strong>Avoid icon-only buttons:</strong> Icons without text labels can't be voice-controlled</li>
              </ul>
            </div>
          </div>

          {/* Switch Access */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 border-2 border-green-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">🔘</div>
              <div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Switch Access</h3>
                <p className="text-gray-700">
                  One or two physical switches (buttons, sip-and-puff, head movements) used to navigate interface.
                  System automatically scans through interactive elements; user presses switch to select.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-4">
              <p className="font-semibold text-gray-900 mb-3">How Switch Access Works:</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">Single Switch (Auto-Scan):</p>
                  <p className="text-gray-700 text-sm">System highlights elements sequentially. User presses switch when desired element is highlighted.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dual Switch (Step-Scan):</p>
                  <p className="text-gray-700 text-sm">Switch 1: advance to next element. Switch 2: activate current element. More control, less timing pressure.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 border-l-4 border-blue-600 p-4">
              <p className="font-semibold text-blue-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-2 text-gray-700 mb-0">
                <li>Switch access relies entirely on keyboard navigation patterns</li>
                <li>Proper focus order is critical (follows visual reading order)</li>
                <li>All interactive elements must be keyboard accessible</li>
                <li>No timing-dependent interactions</li>
                <li>Keyboard accessibility = switch accessibility</li>
              </ul>
            </div>
          </div>

          {/* Eye Tracking */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border-2 border-orange-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">👁️</div>
              <div>
                <h3 className="text-2xl font-bold text-orange-900 mb-2">Eye Tracking</h3>
                <p className="text-gray-700">
                  Camera tracks eye movement to control cursor. User looks at element to move cursor, dwells
                  (looks for ~1 second) or blinks to click.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-4">
              <p className="font-semibold text-gray-900 mb-3">Popular Eye Trackers:</p>
              <ul className="space-y-1 text-gray-700">
                <li><strong>Tobii Eye Tracker:</strong> Most popular, Windows integration</li>
                <li><strong>EyeTech:</strong> Medical-grade eye tracking</li>
                <li><strong>PCEye:</strong> Eye tracking for communication and computer access</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Large click targets (easier to look at precisely)</li>
                <li>Adequate spacing between elements (avoid accidental clicks)</li>
                <li>Avoid hover-dependent interactions (cursor constantly moving)</li>
                <li>Support keyboard alternatives (eye tracking can trigger keyboard shortcuts)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Common Barriers */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Barriers for Users with Motor Disabilities</h2>

        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">1. Mouse-Only Interactions</h3>
            <p className="text-gray-700 mb-3">
              Functionality that requires mouse (hover effects, drag-and-drop, right-click) without keyboard alternative.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border-2 border-red-300">
                <p className="font-mono text-sm text-red-700 mb-1">❌ BAD:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm whitespace-pre">
{`<div onClick={handleClick}>
  Click me
</div>`}
                </code>
                <p className="text-sm text-gray-600 mt-2">Not focusable, no keyboard access</p>
              </div>
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <p className="font-mono text-sm text-green-700 mb-1">✅ GOOD:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm whitespace-pre">
{`<button onClick={handleClick}>
  Click me
</button>`}
                </code>
                <p className="text-sm text-gray-600 mt-2">Semantic, keyboard accessible</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">2. Small Click Targets</h3>
            <p className="text-gray-700 mb-3">
              Buttons or links smaller than 44x44px (touch) or 24x24px (mouse). Difficult for tremors, limited dexterity.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border-2 border-red-300">
                <p className="font-mono text-sm text-red-700 mb-1">❌ BAD: 16x16px icon button</p>
                <button className="w-4 h-4 bg-blue-600 text-white text-[8px]">×</button>
                <p className="text-sm text-gray-600 mt-2">Too small, hard to click</p>
              </div>
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <p className="font-mono text-sm text-green-700 mb-1">✅ GOOD: 44x44px button</p>
                <button className="w-11 h-11 bg-blue-600 text-white rounded flex items-center justify-center">×</button>
                <p className="text-sm text-gray-600 mt-2">Adequate size, easy target</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">3. No Visible Focus Indicator</h3>
            <p className="text-gray-700 mb-3">
              Users can't see which element is focused when tabbing through page.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border-2 border-red-300">
                <p className="font-mono text-sm text-red-700 mb-1">❌ BAD:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm">
                  button:focus {'{'} outline: none; {'}'}
                </code>
                <p className="text-sm text-gray-600 mt-2">Focus indicator removed</p>
              </div>
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <p className="font-mono text-sm text-green-700 mb-1">✅ GOOD:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm whitespace-pre">
{`button:focus-visible {
  outline: 3px solid blue;
  outline-offset: 2px;
}`}
                </code>
                <p className="text-sm text-gray-600 mt-2">Clear, visible focus indicator</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">4. Keyboard Traps</h3>
            <p className="text-gray-700 mb-3">
              User can Tab into element (like modal or widget) but can't Tab out. Requires mouse to escape.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-gray-900 mb-2">Common keyboard trap scenarios:</p>
              <ul className="space-y-2 text-gray-700">
                <li>❌ Modal dialog without focus trap management</li>
                <li>❌ Custom dropdown that captures Tab key</li>
                <li>❌ Embedded iframe without keyboard exit</li>
                <li>✅ Modal with focus trapped inside + Esc to close</li>
                <li>✅ Dropdown with Esc to close and return focus</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">5. Time-Limited Actions</h3>
            <p className="text-gray-700 mb-3">
              Session timeouts, disappearing tooltips, or timed interactions that don't accommodate slow response times.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-gray-900 mb-2">Solutions:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Warn before session expires with option to extend (WCAG 2.2.1)</li>
                <li>✓ Tooltips don't disappear on hover loss (stay until dismissed)</li>
                <li>✓ Save form data automatically (don't lose progress)</li>
                <li>✓ Allow disabling or extending time limits</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">6. Complex Keyboard Shortcuts</h3>
            <p className="text-gray-700 mb-3">
              Shortcuts requiring simultaneous keypresses (Ctrl+Shift+Alt+S) difficult for users with limited dexterity or sticky keys.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-green-900 mb-2">Better approaches:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Single-key shortcuts (S for Save) when possible</li>
                <li>✓ Sequential shortcuts (press Ctrl, then S)</li>
                <li>✓ Provide UI buttons as alternative to shortcuts</li>
                <li>✓ Allow customization of shortcuts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Checklist */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-300">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Developer Checklist: Supporting Motor Disabilities</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>All interactive elements keyboard accessible:</strong> Can reach and activate with Tab, Enter, Space, Arrow keys
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Visible focus indicators:</strong> Clear outline (3px solid, high contrast) on all focusable elements
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Logical focus order:</strong> Tab order matches visual reading order (left-to-right, top-to-bottom)
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Large click targets:</strong> Minimum 44x44px for touch, 24x24px for mouse (WCAG 2.2.5 Level AAA)
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>No keyboard traps:</strong> Users can Tab into and out of all components using standard keyboard
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Skip links:</strong> "Skip to main content" link at top of page for keyboard users
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>No timing-dependent interactions:</strong> Or provide mechanism to extend/disable time limits
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Visible labels for voice control:</strong> Button text matches accessible name, no icon-only buttons
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Test with keyboard only:</strong> Unplug mouse, navigate entire site with Tab, Enter, Arrow keys
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Key Takeaways</h2>
          <ul className="space-y-3 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Keyboard accessibility is the foundation of motor-accessible design</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>All mouse functionality must have keyboard equivalent</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Large click targets, visible focus indicators, and logical focus order are non-negotiable</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Voice control and switch access rely on proper semantic HTML and ARIA</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Testing with keyboard only reveals motor accessibility barriers</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <div className="bg-gray-100 rounded-xl p-8 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <p className="text-gray-700 mb-4">
            Continue your learning with related modules:
          </p>
          <div className="space-y-2">
            <a href="/learn/developers/modules/cognitive-disabilities" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 5: Cognitive Disabilities
            </a>
            <a href="/learn/developers/modules/switch-access-scanning" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 11: Switch Access and Scanning
            </a>
            <a href="/learn/developers/modules/keyboard-navigation-patterns" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 28: Keyboard Navigation Patterns (hands-on implementation)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
