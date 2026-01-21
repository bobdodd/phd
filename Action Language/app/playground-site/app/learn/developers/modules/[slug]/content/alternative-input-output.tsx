export default function AlternativeInputOutput() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* What You'll Learn */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-12 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mt-0 mb-4">What You'll Learn</h2>
        <ul className="list-disc list-outside ml-6 space-y-2 mb-0 text-blue-900">
          <li>Voice control systems and speech recognition technology</li>
          <li>Eye tracking (gaze control) for hands-free navigation</li>
          <li>Refreshable Braille displays and Braille input devices</li>
          <li>Alternative keyboards: one-handed, ergonomic, on-screen</li>
          <li>Head pointers, mouth sticks, and physical adaptations</li>
          <li>How to design interfaces that work with alternative input methods</li>
        </ul>
      </section>

      {/* Why This Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why This Matters</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Not everyone uses a mouse and keyboard. Millions of people rely on <strong>alternative input and output devices</strong>
          to interact with digital content. Understanding these technologies is essential because:
        </p>
        <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700 mb-4">
          <li>Voice control is used by ~500 million people globally (disability + convenience)</li>
          <li>Eye tracking enables communication for people with ALS, locked-in syndrome</li>
          <li>Braille displays are the primary output for deafblind users</li>
          <li>Alternative keyboards serve users with one hand, limited dexterity, or chronic pain</li>
          <li>Web design decisions directly impact whether these devices work</li>
        </ul>
        <p className="text-lg text-gray-700 leading-relaxed">
          Your interface must be <strong>input-method agnostic</strong> to be truly accessible.
        </p>
      </section>

      {/* Voice Control */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Voice Control</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Voice control (speech recognition) allows users to navigate and interact with interfaces using spoken commands.
        </p>

        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🎤 Popular Voice Control Systems</h3>
            <dl className="space-y-4">
              <div>
                <dt className="font-bold text-gray-900 mb-1">Dragon NaturallySpeaking (Nuance)</dt>
                <dd className="text-gray-700 ml-4">
                  Professional-grade speech recognition. ~$500. 99% accuracy. Used by people with motor disabilities,
                  RSI, or for productivity. Windows only.
                </dd>
              </div>
              <div>
                <dt className="font-bold text-gray-900 mb-1">Voice Control (Apple)</dt>
                <dd className="text-gray-700 ml-4">
                  Built into macOS and iOS. Free. Navigate by element names, numbers, or grids.
                  Commands: &quot;Click [element]&quot;, &quot;Scroll down&quot;, &quot;Show numbers&quot;.
                </dd>
              </div>
              <div>
                <dt className="font-bold text-gray-900 mb-1">Voice Access (Android)</dt>
                <dd className="text-gray-700 ml-4">
                  Built into Android. Free. Similar to Apple Voice Control. Navigate by labels and grid overlays.
                </dd>
              </div>
              <div>
                <dt className="font-bold text-gray-900 mb-1">Windows Speech Recognition</dt>
                <dd className="text-gray-700 ml-4">
                  Built into Windows. Free. Lower accuracy than Dragon, but sufficient for many users.
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-3">How Voice Control Works</h3>
            <ol className="list-decimal list-outside ml-6 space-y-3 text-gray-700">
              <li>
                <strong>Element naming:</strong> User says the visible label of an element
                <pre className="text-sm mt-2 bg-white p-3 rounded border border-gray-300 font-mono overflow-x-auto">
                  User: &quot;Click Submit&quot; &rarr; Clicks button labeled &quot;Submit&quot;
                </pre>
              </li>
              <li>
                <strong>Number overlay:</strong> System displays numbers next to clickable elements
                <pre className="text-sm mt-2 bg-white p-3 rounded border border-gray-300 font-mono overflow-x-auto">
{`User: "Show numbers"
[1] Home  [2] About  [3] Contact  [4] Sign In
User: "Click 4" → Clicks Sign In`}
                </pre>
              </li>
              <li>
                <strong>Grid navigation:</strong> Divides screen into numbered grid cells
                <pre className="text-sm mt-2 bg-white p-3 rounded border border-gray-300 font-mono overflow-x-auto">
{`User: "Show grid"
Screen divided into 9 regions (1-9)
User: "5" → Subdivides center region
User: "3" → Clicks that cell`}
                </pre>
              </li>
              <li>
                <strong>Dictation:</strong> Converts speech to text in form fields
                <pre className="text-sm mt-2 bg-white p-3 rounded border border-gray-300 font-mono overflow-x-auto">
                  User: &quot;Type hello world&quot; &rarr; Text appears in focused input
                </pre>
              </li>
            </ol>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6">
            <h4 className="text-lg font-bold text-red-900 mb-2">❌ Voice Control Fails When:</h4>
            <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700">
              <li><strong>No visible labels:</strong> Icon-only buttons can&apos;t be named (&quot;Click [what?]&quot;)</li>
              <li><strong>Generic labels:</strong> Multiple &quot;Click here&quot; links cause ambiguity</li>
              <li><strong>Hidden interactive elements:</strong> System can&apos;t assign numbers to invisible elements</li>
              <li><strong>Custom UI with no accessibility:</strong> Voice control uses accessibility tree (like screen readers)</li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-6">
            <h4 className="text-lg font-bold text-green-900 mb-2">✅ Voice Control Works When:</h4>
            <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700">
              <li>All interactive elements have <strong>visible, unique labels</strong></li>
              <li>Semantic HTML used (buttons, links, inputs) with proper roles</li>
              <li>Accessible names match visible labels (WCAG 2.5.3 - Level A)</li>
              <li>Custom widgets have ARIA roles and accessible names</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Eye Tracking */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Eye Tracking (Gaze Control)</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Eye tracking uses cameras and infrared sensors to detect where the user is looking, enabling <strong>hands-free</strong>
          computer control.
        </p>

        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">👁️ Who Uses Eye Tracking</h3>
            <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700">
              <li><strong>ALS (Lou Gehrig&apos;s disease):</strong> Progressive muscle weakness, eventually unable to move or speak</li>
              <li><strong>Locked-in syndrome:</strong> Conscious but paralyzed, except eye movement</li>
              <li><strong>Severe cerebral palsy:</strong> Limited or no voluntary muscle control</li>
              <li><strong>Spinal cord injuries:</strong> Quadriplegia with no hand function</li>
              <li><strong>Augmentative communication:</strong> People who cannot speak use eye tracking to &quot;type&quot;</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-3">How Eye Tracking Works</h3>
            <ol className="list-decimal list-outside ml-6 space-y-3 text-gray-700">
              <li>
                <strong>Calibration:</strong> User looks at specific points on screen to train system
              </li>
              <li>
                <strong>Gaze cursor:</strong> Cursor follows user&apos;s gaze (where they&apos;re looking)
              </li>
              <li>
                <strong>Dwell click:</strong> Look at element for X seconds (e.g., 1.5s) to activate
                <pre className="text-sm mt-2 bg-white p-3 rounded border border-gray-300 font-mono overflow-x-auto">
{`User looks at "Submit" button
System shows countdown circle filling (0.5s... 1s... 1.5s)
Button clicked automatically after 1.5s dwell`}
                </pre>
              </li>
              <li>
                <strong>Alternative:</strong> Blink to click (some systems detect intentional blinks)
              </li>
            </ol>
          </div>

          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-900 mb-3">Popular Eye Tracking Systems</h3>
            <dl className="space-y-4">
              <div>
                <dt className="font-bold text-gray-900 mb-1">Tobii Eye Tracker</dt>
                <dd className="text-gray-700 ml-4">
                  Most popular dedicated eye tracking hardware. $150-$2,000 depending on model. Medical-grade accuracy.
                  Used for AAC (augmentative communication) devices.
                </dd>
              </div>
              <div>
                <dt className="font-bold text-gray-900 mb-1">Windows Eye Control</dt>
                <dd className="text-gray-700 ml-4">
                  Built into Windows 10/11 for supported hardware. Works with Tobii and other trackers. Includes
                  on-screen keyboard and mouse emulation.
                </dd>
              </div>
              <div>
                <dt className="font-bold text-gray-900 mb-1">Eye Gaze (Apple Accessibility)</dt>
                <dd className="text-gray-700 ml-4">
                  Coming to iPadOS. Uses front-facing camera for eye tracking (no special hardware). Lower precision but accessible.
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-900 mb-3">Design Challenges for Eye Tracking</h3>
            <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700">
              <li>
                <strong>Small targets:</strong> Hard to dwell accurately on tiny buttons. WCAG recommends minimum 44x44 CSS pixels (Level AAA).
              </li>
              <li>
                <strong>Hover menus:</strong> Mega-menus that open on hover cause accidental triggers (&quot;looked at navigation, menu exploded&quot;).
              </li>
              <li>
                <strong>Reading vs. interacting:</strong> User looks at text to read it, but system thinks they want to click.
                Solution: Longer dwell time for clicks (1-2s).
              </li>
              <li>
                <strong>Fatigue:</strong> Eye tracking is tiring. Minimize required interactions.
              </li>
              <li>
                <strong>Calibration drift:</strong> Accuracy degrades over time. User must recalibrate periodically.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Refreshable Braille Displays */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Refreshable Braille Displays</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Refreshable Braille displays are mechanical devices that convert digital text into <strong>tactile Braille</strong>
          in real-time. They&apos;re the primary output device for deafblind users.
        </p>

        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">⠃ How Refreshable Braille Displays Work</h3>
            <p className="text-gray-700 mb-3">
              A Braille display has a row of <strong>Braille cells</strong> (typically 40 or 80 cells). Each cell
              contains 8 pins that can raise or lower to form Braille characters:
            </p>
            <pre className="text-sm bg-gray-50 p-4 rounded border border-gray-300 font-mono overflow-x-auto mb-3">
{`Example: The word "CAT" on a Braille display

C        A        T
⠉        ⠁        ⠞
• •      •        • •
•        •        ••
          •       •

(dots represent raised pins)`}
            </pre>
            <p className="text-gray-700 mb-3">
              As the user navigates text with a screen reader, the Braille display updates to show the current line.
              User reads by running fingers across the cells.
            </p>
            <dl className="space-y-2">
              <div>
                <dt className="inline font-semibold text-gray-900">Cost: </dt>
                <dd className="inline text-gray-700">$2,000-$15,000 (extremely expensive)</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Typical size: </dt>
                <dd className="inline text-gray-700">40-80 characters (one line of text)</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Lifespan: </dt>
                <dd className="inline text-gray-700">5-10 years with care</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-gray-900">Users: </dt>
                <dd className="inline text-gray-700">Deafblind individuals, blind users who prefer Braille to speech</dd>
              </div>
            </dl>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Why Braille Displays Matter</h3>
            <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700">
              <li>
                <strong>Deafblind users have no alternative:</strong> Cannot use audio (screen reader) or visual (monitor).
                Braille display is their ONLY way to access digital content.
              </li>
              <li>
                <strong>Spelling and formatting:</strong> Screen readers speak words aloud, but Braille shows exact spelling,
                punctuation, capitalization. Critical for programming, writing, etc.
              </li>
              <li>
                <strong>Privacy:</strong> Reading Braille is silent (no speech output in public spaces).
              </li>
              <li>
                <strong>Literacy:</strong> Braille literacy is essential for education and employment of blind individuals.
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-6">
            <h4 className="text-lg font-bold text-green-900 mb-2">✅ How to Support Braille Displays</h4>
            <p className="text-gray-700 mb-2">
              <strong>Good news:</strong> Braille displays work with screen readers. If your site is screen reader accessible,
              it automatically works with Braille displays.
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700">
              <li>Use semantic HTML (headings, lists, buttons)</li>
              <li>Provide accessible names for all interactive elements</li>
              <li>Use ARIA when HTML semantics are insufficient</li>
              <li>Don&apos;t rely solely on visual formatting (bold, color, spacing)</li>
              <li>Ensure text alternatives for images (alt text)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Alternative Keyboards */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Alternative Keyboards</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Standard keyboards assume two hands, ten fingers, and typical dexterity. Many users require <strong>alternative
          keyboard designs</strong> due to injury, disability, or chronic conditions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">⌨️ One-Handed Keyboards</h3>
            <p className="text-gray-700 mb-2">
              <strong>Who uses:</strong> People with one functional arm (amputation, stroke, injury)
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Design:</strong> All keys accessible to one hand. Mirror layout or compact chord keyboard.
            </p>
            <p className="text-gray-700">
              <strong>Example:</strong> Matias Half Keyboard (left or right-handed versions)
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🎹 Chord Keyboards</h3>
            <p className="text-gray-700 mb-2">
              <strong>Who uses:</strong> Users with limited finger mobility or hand injuries
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Design:</strong> 5-10 keys. Press multiple keys simultaneously to form characters (like piano chords).
            </p>
            <p className="text-gray-700">
              <strong>Advantage:</strong> Requires less finger travel, reduces RSI
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">📱 On-Screen Keyboards</h3>
            <p className="text-gray-700 mb-2">
              <strong>Who uses:</strong> People who can&apos;t use physical keyboards (motor disabilities, switches, eye tracking)
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Design:</strong> Virtual keyboard on screen. Click keys with mouse, switch scanning, or eye gaze.
            </p>
            <p className="text-gray-700">
              <strong>Features:</strong> Word prediction, auto-complete, customizable layouts
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🦾 Ergonomic/Split Keyboards</h3>
            <p className="text-gray-700 mb-2">
              <strong>Who uses:</strong> People with RSI, carpal tunnel, arthritis, chronic pain
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Design:</strong> Split into two halves at an angle. Reduces wrist strain.
            </p>
            <p className="text-gray-700">
              <strong>Example:</strong> Microsoft Sculpt, Kinesis Advantage
            </p>
          </div>
        </div>
      </section>

      {/* Physical Adaptations */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Physical Adaptations and Pointers</h2>

        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Head Pointers</h3>
            <p className="text-gray-700 mb-3">
              <strong>What it is:</strong> A pointer attached to the user&apos;s head (headband, glasses, or helmet).
              User moves their head to position pointer over keys on a physical keyboard or touchscreen.
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Who uses:</strong> People who cannot use their arms/hands but have good head control.
            </p>
            <p className="text-gray-700">
              <strong>Typing speed:</strong> Slow (~5-10 words per minute vs. 40 wpm for typical typing)
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🦷 Mouth Sticks</h3>
            <p className="text-gray-700 mb-3">
              <strong>What it is:</strong> A stick held in the user&apos;s mouth (between teeth or lips) to press keys or tap
              a touchscreen.
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Who uses:</strong> Quadriplegics with strong jaw/mouth control but no arm function.
            </p>
            <p className="text-gray-700">
              <strong>Famous example:</strong> Stephen Hawking used a cheek switch (mouth-activated) early in his life with ALS.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🖱️ Trackballs and Joysticks</h3>
            <p className="text-gray-700 mb-3">
              <strong>What it is:</strong> Alternative pointing devices that require less precise movement than a mouse.
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Trackball:</strong> Ball rotates in socket. User rolls ball with palm, thumb, or fingers. No wrist movement needed.
            </p>
            <p className="text-gray-700">
              <strong>Joystick:</strong> Controlled by hand, chin, or foot. Common for power wheelchair users (same joystick
              controls both wheelchair and computer).
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">👣 Foot Pedals and Switches</h3>
            <p className="text-gray-700 mb-3">
              <strong>What it is:</strong> Pedals or switches operated by foot/feet. Can emulate mouse clicks or keyboard keys.
            </p>
            <p className="text-gray-700">
              <strong>Who uses:</strong> People with upper body disabilities but functional legs (e.g., missing/paralyzed arms).
            </p>
          </div>
        </div>
      </section>

      {/* Design Principles */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Design Principles for Alternative Input</h2>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">Universal Design Rules</h3>
          <ul className="list-disc list-outside ml-6 space-y-3 text-gray-700">
            <li>
              <strong>Input method independence:</strong> Don&apos;t assume mouse or keyboard. Support pointer (mouse, touch,
              eye gaze) AND keyboard (physical, on-screen, switch) equally.
            </li>
            <li>
              <strong>Large touch targets:</strong> Minimum 44x44 CSS pixels (WCAG 2.5.5 - Level AAA). Helps eye tracking,
              head pointers, tremors, touch screens.
            </li>
            <li>
              <strong>Visible and consistent labels:</strong> Voice control and on-screen keyboards rely on seeing element names.
            </li>
            <li>
              <strong>Avoid hover-only interactions:</strong> Many alternative input methods can&apos;t hover (switches,
              some eye trackers, keyboard-only).
            </li>
            <li>
              <strong>No time limits:</strong> Alternative input is slower. Allow users to disable or extend timeouts
              (WCAG 2.2.1 - Level A).
            </li>
            <li>
              <strong>Motion-based controls must have alternatives:</strong> Shake, tilt, gesture controls exclude users
              with motor disabilities (WCAG 2.5.4 - Level A).
            </li>
            <li>
              <strong>Pointer cancellation:</strong> Action triggered on up-event (mouse/touch release), not down-event.
              Allows user to drag away if they clicked wrong target (WCAG 2.5.2 - Level A).
            </li>
          </ul>
        </div>
      </section>

      {/* Code Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Code Examples</h2>

        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-6">
          <h3 className="text-xl font-bold text-white mb-4">1. Large Touch Targets (WCAG 2.5.5)</h3>
          <pre className="text-sm font-mono">
            <code>{`/* ❌ BAD: Tiny touch targets */
button {
  padding: 4px 8px; /* Results in ~20x30px target - too small */
}

/* ✅ GOOD: Meets AAA standard (44x44px minimum) */
button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px;
}

/* Even better: Spacing between targets */
button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px;
  margin: 4px; /* Prevents accidental adjacent clicks */
}`}</code>
          </pre>
        </div>

        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-6">
          <h3 className="text-xl font-bold text-white mb-4">2. Label in Name (WCAG 2.5.3)</h3>
          <pre className="text-sm font-mono">
            <code>{`/* Voice control users say the visible label */

<!-- ❌ BAD: Accessible name doesn't match visible label -->
<button aria-label="Submit form">
  Send
</button>
<!-- User sees "Send" but voice control requires "Submit form" -->

<!-- ✅ GOOD: Accessible name contains visible label -->
<button aria-label="Send message">
  Send
</button>
<!-- User says "Click Send" - works! -->

<!-- ✅ EVEN BETTER: Visible label is the accessible name -->
<button>
  Send
</button>
<!-- Simple, clear, works for everyone -->`}</code>
          </pre>
        </div>

        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-6">
          <h3 className="text-xl font-bold text-white mb-4">3. Pointer Cancellation (WCAG 2.5.2)</h3>
          <pre className="text-sm font-mono">
            <code>{`// ❌ BAD: Action on mousedown/touchstart (no way to cancel)
button.addEventListener('mousedown', () => {
  deleteAccount(); // Accidental press = disaster
});

// ✅ GOOD: Action on click/mouseup (can drag away to cancel)
button.addEventListener('click', () => {
  deleteAccount(); // User can press, realize mistake, drag off button
});

// ✅ EVEN BETTER: Confirmation for destructive actions
button.addEventListener('click', () => {
  if (confirm('Delete your account? This cannot be undone.')) {
    deleteAccount();
  }
});`}</code>
          </pre>
        </div>

        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
          <h3 className="text-xl font-bold text-white mb-4">4. No Hover-Only Content (WCAG 1.4.13)</h3>
          <pre className="text-sm font-mono">
            <code>{`<!-- ❌ BAD: Tooltip only appears on hover -->
<button title="Delete item">
  <svg>...</svg> <!-- Icon with no visible label -->
</button>
<!-- Keyboard users, voice control users, eye tracking users can't see tooltip -->

<!-- ✅ GOOD: Persistent label or focus-triggered tooltip -->
<button aria-label="Delete item">
  <svg aria-hidden="true">...</svg>
  <span class="visually-hidden">Delete</span>
</button>

<!-- Or show tooltip on focus too -->
<button class="has-tooltip">
  <svg>...</svg>
  <span class="tooltip">Delete item</span>
</button>

<style>
.has-tooltip .tooltip {
  display: none;
}

.has-tooltip:hover .tooltip,
.has-tooltip:focus .tooltip {
  display: block; /* Shows on both hover AND keyboard focus */
}
</style>`}</code>
          </pre>
        </div>
      </section>

      {/* Testing Checklist */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Testing Checklist</h2>
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
          <ul className="space-y-3 list-none text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>All interactive elements have visible labels (voice control test)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Touch targets are at least 44x44 CSS pixels (measure in DevTools)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>All functionality available via keyboard (no mouse-only interactions)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Hover content also appears on keyboard focus</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Destructive actions have confirmation dialogs</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Gestures (swipe, pinch) have alternative controls (buttons)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Time limits can be disabled or extended</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Works with screen readers (ensures Braille display compatibility)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 text-xl">✓</span>
              <span>Can zoom to 200% without loss of functionality</span>
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
              <strong className="text-green-900">Alternative input devices are essential:</strong> Voice control, eye tracking,
              switches, and adaptive hardware enable access for millions
            </li>
            <li>
              <strong className="text-green-900">Voice control requires visible labels:</strong> Users navigate by saying what
              they see
            </li>
            <li>
              <strong className="text-green-900">Eye tracking needs large targets:</strong> Minimum 44x44px touch targets
            </li>
            <li>
              <strong className="text-green-900">Braille displays depend on screen readers:</strong> Screen reader accessibility
              = Braille accessibility
            </li>
            <li>
              <strong className="text-green-900">Keyboard access enables many devices:</strong> Switches, on-screen keyboards,
              and adaptive equipment all rely on keyboard navigation
            </li>
            <li>
              <strong className="text-green-900">Don&apos;t assume input method:</strong> Support pointer AND keyboard equally
            </li>
            <li>
              <strong className="text-green-900">Alternative input is slower:</strong> Design for efficiency (minimize clicks,
              no time limits)
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Congratulations!</h2>
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            You&apos;ve completed <strong>Domain 1: Disabilities &amp; Assistive Technologies</strong>! You now understand:
          </p>
          <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700 mb-4">
            <li>The social and medical models of disability</li>
            <li>Visual, auditory, motor, cognitive, speech, and seizure disorders</li>
            <li>Temporary, situational, and multiple disabilities</li>
            <li>Screen readers and the accessibility tree</li>
            <li>Switch access and scanning technology</li>
            <li>Alternative input and output devices</li>
          </ul>
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>Next:</strong> Move to <strong>Domain 2: Web Standards &amp; WCAG</strong> to learn the technical
            standards and success criteria for accessible web development.
          </p>
        </div>
      </section>
    </div>
  );
}
