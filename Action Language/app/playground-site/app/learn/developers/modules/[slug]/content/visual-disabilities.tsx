export default function VisualDisabilities() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* What You'll Learn */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-12 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mt-0 mb-4">What You'll Learn</h2>
        <ul className="space-y-2 mb-0">
          <li>The spectrum of visual disabilities from low vision to total blindness</li>
          <li>How users with visual disabilities navigate digital interfaces</li>
          <li>Assistive technologies: screen readers, magnifiers, and Braille displays</li>
          <li>Common barriers in web applications and how to remove them</li>
          <li>Developer responsibilities for supporting visual accessibility</li>
        </ul>
      </section>

      {/* Why This Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why This Matters</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Visual disabilities affect millions of people worldwide, and they represent one of the most diverse
          categories of disabilities in terms of how users interact with digital content. As a developer,
          understanding visual disabilities is critical because many accessibility best practices—semantic HTML,
          ARIA attributes, keyboard navigation—directly support users with visual disabilities.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6">
          <p className="text-lg font-semibold text-yellow-900 mb-2">📊 By the Numbers</p>
          <ul className="space-y-2 text-gray-700 mb-0">
            <li><strong>2.2 billion people</strong> worldwide have a vision impairment (WHO, 2023)</li>
            <li><strong>43 million</strong> people are blind globally</li>
            <li><strong>295 million</strong> have moderate to severe vision impairment</li>
            <li>In the US, <strong>8.1 million adults</strong> use assistive technology for vision</li>
          </ul>
        </div>
      </section>

      {/* The Spectrum of Visual Disabilities */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Spectrum of Visual Disabilities</h2>
        <p className="text-lg text-gray-700 mb-6">
          Visual disabilities exist on a wide spectrum. Understanding this diversity helps you design and build
          more inclusive solutions.
        </p>

        <div className="space-y-6">
          {/* Low Vision */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-2xl font-semibold text-purple-900 mb-3">1. Low Vision (Partial Sight)</h3>
            <p className="text-gray-700 mb-4">
              Users with low vision have reduced visual acuity but are not totally blind. They may use screen
              magnification, high contrast modes, or larger fonts.
            </p>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="font-semibold text-purple-900 mb-2">Common conditions:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li><strong>Macular degeneration:</strong> Loss of central vision, peripheral vision intact</li>
                <li><strong>Diabetic retinopathy:</strong> Damage to blood vessels in the retina</li>
                <li><strong>Glaucoma:</strong> Damage to the optic nerve, often peripheral vision loss first</li>
                <li><strong>Cataracts:</strong> Clouding of the eye's lens, causing blurry vision</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-blue-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Support browser zoom (responsive design up to 200%+)</li>
                <li>High contrast ratios (WCAG 2.2 Level AA: 4.5:1 for text)</li>
                <li>Avoid small touch targets (&lt;44x44px)</li>
                <li>Support OS-level high contrast modes</li>
              </ul>
            </div>
          </div>

          {/* Color Blindness */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-2xl font-semibold text-green-900 mb-3">2. Color Blindness (Color Vision Deficiency)</h3>
            <p className="text-gray-700 mb-4">
              Approximately <strong>8% of men</strong> and <strong>0.5% of women</strong> have some form of color
              vision deficiency, most commonly red-green color blindness.
            </p>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="font-semibold text-green-900 mb-2">Types:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li><strong>Deuteranopia/Protanopia:</strong> Red-green color blindness (most common)</li>
                <li><strong>Tritanopia:</strong> Blue-yellow color blindness (rare)</li>
                <li><strong>Achromatopsia:</strong> Total color blindness (very rare)</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-blue-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Never rely on color alone to convey information</li>
                <li>Use patterns, icons, or text labels in addition to color</li>
                <li>Example: "Red text indicates errors" → Add ❌ icon or "Error:" prefix</li>
                <li>Test designs with color blindness simulators</li>
              </ul>
            </div>
          </div>

          {/* Legal Blindness */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <h3 className="text-2xl font-semibold text-orange-900 mb-3">3. Legal Blindness</h3>
            <p className="text-gray-700 mb-4">
              Defined as visual acuity of 20/200 or less in the better eye with correction, or a visual field
              of 20 degrees or less. Many legally blind people have some usable vision.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="font-semibold text-blue-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Users may combine magnification with screen readers</li>
                <li>Ensure zoom doesn't break layouts or hide content</li>
                <li>Provide multiple ways to access information</li>
              </ul>
            </div>
          </div>

          {/* Total Blindness */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-2xl font-semibold text-red-900 mb-3">4. Total Blindness</h3>
            <p className="text-gray-700 mb-4">
              Complete absence of light perception. Users rely entirely on screen readers, Braille displays,
              or voice interfaces to interact with digital content.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="font-semibold text-blue-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Semantic HTML is critical (proper heading hierarchy, landmarks)</li>
                <li>All functionality must be keyboard accessible</li>
                <li>All images need meaningful alt text</li>
                <li>ARIA attributes for custom widgets and dynamic content</li>
                <li>This is where most WCAG criteria focus</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Assistive Technologies */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Assistive Technologies for Visual Disabilities</h2>

        <div className="space-y-6">
          {/* Screen Readers */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">🔊</div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Screen Readers</h3>
                <p className="text-gray-700">
                  Software that reads digital content aloud using text-to-speech synthesis. Screen readers
                  navigate through content using semantic structure (headings, landmarks, lists, tables).
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-4">
              <p className="font-semibold text-gray-900 mb-3">Popular Screen Readers:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-900">Desktop:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li><strong>JAWS</strong> (Windows) - Most popular, commercial</li>
                    <li><strong>NVDA</strong> (Windows) - Free, open-source</li>
                    <li><strong>VoiceOver</strong> (macOS/iOS) - Built-in, free</li>
                    <li><strong>Narrator</strong> (Windows) - Built-in, improving</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mobile:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li><strong>VoiceOver</strong> (iOS) - Industry-leading mobile SR</li>
                    <li><strong>TalkBack</strong> (Android) - Built-in, widely used</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 border-l-4 border-blue-600 p-4">
              <p className="font-semibold text-blue-900 mb-2">How Screen Readers Work:</p>
              <ol className="space-y-2 text-gray-700 mb-0 list-decimal list-inside">
                <li>Parse HTML to build an <strong>accessibility tree</strong></li>
                <li>Compute <strong>accessible names</strong> for elements (via aria-label, labels, text content)</li>
                <li>Compute <strong>roles</strong> (from HTML semantics or ARIA roles)</li>
                <li>Expose <strong>states and properties</strong> (expanded, checked, disabled, etc.)</li>
                <li>Allow navigation by element type (headings, links, buttons, landmarks)</li>
                <li>Announce content using text-to-speech</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="font-semibold text-yellow-900 mb-2">⚠️ Common Developer Mistakes:</p>
              <ul className="space-y-2 text-gray-700 mb-0">
                <li><code className="bg-red-100 px-2 py-1 rounded">&lt;div onClick=...&gt;</code> - Not keyboard accessible, no role</li>
                <li><code className="bg-red-100 px-2 py-1 rounded">&lt;img src="logo.png"&gt;</code> - Missing alt text</li>
                <li><code className="bg-red-100 px-2 py-1 rounded">&lt;div&gt;Click here&lt;/div&gt;</code> - Unclear link text</li>
                <li><code className="bg-red-100 px-2 py-1 rounded">&lt;span className="icon-delete"&gt;</code> - Icon without text alternative</li>
                <li>Dynamic content updates without ARIA live regions</li>
              </ul>
            </div>
          </div>

          {/* Screen Magnification */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">🔍</div>
              <div>
                <h3 className="text-2xl font-bold text-purple-900 mb-2">Screen Magnification</h3>
                <p className="text-gray-700">
                  Software that enlarges portions of the screen, typically 2x-16x magnification. Some magnifiers
                  include basic screen reader functionality.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-4">
              <p className="font-semibold text-gray-900 mb-3">Popular Magnifiers:</p>
              <ul className="space-y-1 text-gray-700">
                <li><strong>ZoomText</strong> (Windows) - Commercial, combines magnification with speech</li>
                <li><strong>macOS Zoom</strong> - Built-in magnifier with high-quality rendering</li>
                <li><strong>Windows Magnifier</strong> - Built-in, improving with each version</li>
                <li><strong>Browser zoom</strong> - Most users start here (Cmd/Ctrl +)</li>
              </ul>
            </div>

            <div className="bg-blue-100 border-l-4 border-blue-600 p-4">
              <p className="font-semibold text-blue-900 mb-2">👨‍💻 Developer Responsibilities:</p>
              <ul className="space-y-2 text-gray-700 mb-0">
                <li><strong>Support browser zoom to 200%</strong> without horizontal scrolling (WCAG 2.2 AA)</li>
                <li>Use responsive design and relative units (rem, em, %)</li>
                <li>Avoid fixed-width layouts or pixel-based breakpoints</li>
                <li>Test with browser zoom at 200% and 400%</li>
                <li>Don't disable pinch-to-zoom on mobile</li>
              </ul>
            </div>
          </div>

          {/* Braille Displays */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 border-2 border-green-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">⠃⠗⠇</div>
              <div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Refreshable Braille Displays</h3>
                <p className="text-gray-700">
                  Hardware devices that display text in Braille using pins that raise and lower. Used by
                  people who are deafblind or prefer reading Braille over audio.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-4">
              <p className="font-semibold text-gray-900 mb-3">How They Work:</p>
              <ul className="space-y-2 text-gray-700">
                <li>Connect to screen readers via USB or Bluetooth</li>
                <li>Display 12-80 characters of Braille at a time</li>
                <li>Users read by touch, then advance to next line</li>
                <li>Common for deafblind users (15% of blind people have hearing loss)</li>
              </ul>
            </div>

            <div className="bg-blue-100 border-l-4 border-blue-600 p-4">
              <p className="font-semibold text-blue-900 mb-2">👨‍💻 Developer Impact:</p>
              <p className="text-gray-700 mb-2">
                Braille displays rely entirely on screen reader output, so if your site works well with
                screen readers, it works with Braille displays. Key considerations:
              </p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Proper semantic structure (Braille users scan by headings/landmarks)</li>
                <li>Concise, clear labels (Braille is slow to read)</li>
                <li>No reliance on visual-only cues</li>
                <li>Abbreviations and acronyms properly marked up</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Common Barriers */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Barriers for Users with Visual Disabilities</h2>
        <p className="text-lg text-gray-700 mb-6">
          Understanding what doesn't work helps you build better solutions. Here are the most frequent barriers:
        </p>

        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">1. Poor Color Contrast</h3>
            <p className="text-gray-700 mb-3">
              Light gray text on white backgrounds (#aaa on #fff) fails WCAG standards. Users with low vision
              cannot read the content.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border-2 border-red-300">
                <p className="font-mono text-sm text-red-700 mb-1">❌ BAD: Contrast 2.3:1</p>
                <p style={{ color: '#aaa' }} className="text-lg">This text is hard to read</p>
              </div>
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <p className="font-mono text-sm text-green-700 mb-1">✅ GOOD: Contrast 7.0:1</p>
                <p style={{ color: '#333' }} className="text-lg">This text is easy to read</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">2. Images Without Alt Text</h3>
            <p className="text-gray-700 mb-3">
              Screen readers announce "Image" or the filename instead of the image content.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border-2 border-red-300">
                <p className="font-mono text-sm text-red-700 mb-2">❌ BAD:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm">
                  &lt;img src="chart.png"&gt;
                </code>
                <p className="text-sm text-gray-600 mt-2">Screen reader: "Image, chart.png"</p>
              </div>
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <p className="font-mono text-sm text-green-700 mb-2">✅ GOOD:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm">
                  &lt;img src="chart.png"<br />
                  &nbsp;&nbsp;alt="Bar chart showing 40% increase in sales from Q1 to Q2"&gt;
                </code>
                <p className="text-sm text-gray-600 mt-2">Screen reader announces the chart data</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">3. Non-Semantic Markup</h3>
            <p className="text-gray-700 mb-3">
              Using divs and spans instead of semantic HTML elements breaks screen reader navigation.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border-2 border-red-300">
                <p className="font-mono text-sm text-red-700 mb-2">❌ BAD:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm whitespace-pre">
{`<div class="heading">Welcome</div>
<div onClick="submit()">Submit</div>`}
                </code>
                <p className="text-sm text-gray-600 mt-2">No semantic structure, no keyboard access</p>
              </div>
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <p className="font-mono text-sm text-green-700 mb-2">✅ GOOD:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm whitespace-pre">
{`<h1>Welcome</h1>
<button type="submit">Submit</button>`}
                </code>
                <p className="text-sm text-gray-600 mt-2">Semantic, keyboard accessible, SR understands</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">4. Inaccessible Custom Widgets</h3>
            <p className="text-gray-700 mb-3">
              Custom dropdowns, modals, tabs built without ARIA are invisible to screen readers.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-gray-900 mb-2">Required for custom widgets:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Proper ARIA roles (dialog, tablist, combobox, etc.)</li>
                <li>✓ ARIA states (aria-expanded, aria-selected, aria-hidden)</li>
                <li>✓ Keyboard navigation patterns (Arrow keys, Esc, Enter)</li>
                <li>✓ Focus management (trap focus in modals, restore on close)</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">5. Color-Only Information</h3>
            <p className="text-gray-700 mb-3">
              Using color alone to convey status, errors, or meaning excludes colorblind users.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border-2 border-red-300">
                <p className="font-mono text-sm text-red-700 mb-2">❌ BAD:</p>
                <p className="text-red-600">Required field</p>
                <p className="text-sm text-gray-600 mt-2">Color is the only indicator</p>
              </div>
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <p className="font-mono text-sm text-green-700 mb-2">✅ GOOD:</p>
                <p className="text-red-600">* Required field</p>
                <p className="text-sm text-gray-600 mt-2">Icon + color + text</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Checklist */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-300">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Developer Checklist: Supporting Visual Disabilities</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Use semantic HTML:</strong> Headings (h1-h6), landmarks (nav, main, aside), lists (ul, ol), buttons, links
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>All images have alt text:</strong> Descriptive for content images, empty alt="" for decorative
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Color contrast meets WCAG AA:</strong> 4.5:1 for normal text, 3:1 for large text (18pt+)
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Never rely on color alone:</strong> Use icons, patterns, or text labels in addition to color
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Keyboard accessible:</strong> All functionality available via keyboard, visible focus indicators
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Responsive to 200% zoom:</strong> No horizontal scrolling, no content loss
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>ARIA for custom widgets:</strong> Proper roles, states, properties, and keyboard patterns
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Live regions for dynamic content:</strong> Announce changes to screen readers
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Test with screen readers:</strong> NVDA (Windows), VoiceOver (Mac), TalkBack (Android)
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
              <span>Visual disabilities span a wide spectrum from low vision to total blindness</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Screen readers, magnifiers, and Braille displays enable digital access</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Semantic HTML is the foundation of screen reader accessibility</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Color contrast, keyboard access, and proper ARIA are non-negotiable</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Testing with actual assistive technology is essential for validation</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <div className="bg-gray-100 rounded-xl p-8 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <p className="text-gray-700 mb-4">
            Now that you understand visual disabilities, continue your learning journey:
          </p>
          <div className="space-y-2">
            <a href="/learn/developers/modules/auditory-disabilities" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 3: Auditory Disabilities
            </a>
            <a href="/learn/developers/modules/screen-readers-deep-dive" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 10: Screen Readers Deep Dive (hands-on)
            </a>
            <a href="/learn/developers/modules/semantic-html-foundations" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 26: Semantic HTML Foundations (practical implementation)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
