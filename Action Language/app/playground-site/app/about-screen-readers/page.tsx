'use client';

import Link from 'next/link';

export default function AboutScreenReadersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-blue-700 text-white py-6 shadow-lg">
        <div className="max-w-5xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors">
            ← Back to Playground
          </Link>
          <h1 className="text-4xl font-bold">About Screen Readers</h1>
          <p className="text-xl text-blue-100 mt-2">Essential knowledge for web developers</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* Table of Contents */}
        <nav className="bg-white rounded-xl shadow-lg p-8 mb-8" aria-labelledby="toc-heading">
          <h2 id="toc-heading" className="text-2xl font-bold text-gray-900 mb-6">On This Page</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="#what-are" className="group block p-4 rounded-lg border-2 border-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
              <span className="font-semibold text-blue-900">What Are Screen Readers?</span>
            </a>
            <a href="#popular" className="group block p-4 rounded-lg border-2 border-green-600 bg-green-50 hover:bg-green-100 transition-colors">
              <span className="font-semibold text-green-900">Popular Screen Readers</span>
            </a>
            <a href="#navigation" className="group block p-4 rounded-lg border-2 border-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors">
              <span className="font-semibold text-purple-900">How Users Navigate</span>
            </a>
            <a href="#announces" className="group block p-4 rounded-lg border-2 border-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors">
              <span className="font-semibold text-orange-900">What Gets Announced</span>
            </a>
            <a href="#mistakes" className="group block p-4 rounded-lg border-2 border-red-600 bg-red-50 hover:bg-red-100 transition-colors">
              <span className="font-semibold text-red-900">Common Mistakes</span>
            </a>
            <a href="#design-impact" className="group block p-4 rounded-lg border-2 border-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
              <span className="font-semibold text-indigo-900">Design Impact</span>
            </a>
            <a href="#testing" className="group block p-4 rounded-lg border-2 border-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors">
              <span className="font-semibold text-teal-900">Testing Guide</span>
            </a>
            <a href="#takeaways" className="group block p-4 rounded-lg border-2 border-pink-600 bg-pink-50 hover:bg-pink-100 transition-colors">
              <span className="font-semibold text-pink-900">Key Takeaways</span>
            </a>
          </div>
        </nav>

        {/* Introduction */}
        <section id="what-are" className="bg-white rounded-xl shadow-lg p-8 mb-8 scroll-mt-24">
          <h2 className="text-3xl font-bold text-blue-700 mb-4 border-l-4 border-blue-600 pl-4">What Are Screen Readers?</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Screen readers are assistive technology software programs that convert on-screen content into synthesized speech or refreshable Braille,
              enabling blind and visually impaired users to navigate and interact with digital content. Almost <strong>7.3 million Americans</strong> rely
              on screen readers for accessing the web.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              For web developers, understanding screen readers is crucial because they reveal how your code structure, semantic HTML, and ARIA
              attributes directly impact the user experience. What looks perfect visually might be completely inaccessible to screen reader users.
            </p>
          </div>
        </section>

        {/* Popular Screen Readers */}
        <section id="popular" className="bg-white rounded-xl shadow-lg p-8 mb-8 scroll-mt-24">
          <h2 className="text-3xl font-bold text-green-700 mb-6 border-l-4 border-green-600 pl-4">Popular Screen Readers</h2>
          <div className="grid md:grid-cols-2 gap-6">

            {/* JAWS */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">JAWS (Job Access With Speech)</h3>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Platform:</span> Windows
              </p>
              <p className="text-gray-700 mb-3">
                The most widely used commercial screen reader worldwide. Known for its powerful features and extensive customization options.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Highly customizable</li>
                <li>Excellent web navigation</li>
                <li>Professional support available</li>
                <li>Cost: ~$1,000+</li>
              </ul>
            </div>

            {/* NVDA */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">NVDA (NonVisual Desktop Access)</h3>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Platform:</span> Windows
              </p>
              <p className="text-gray-700 mb-3">
                Free, open-source screen reader that has become increasingly popular. Comparable to JAWS in many features.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Completely free</li>
                <li>Open source</li>
                <li>Regular updates</li>
                <li>Active community support</li>
              </ul>
            </div>

            {/* VoiceOver */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">VoiceOver</h3>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Platform:</span> macOS, iOS, iPadOS
              </p>
              <p className="text-gray-700 mb-3">
                Built into all Apple devices. Most commonly used screen reader on mobile devices.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Pre-installed on all Apple devices</li>
                <li>Gesture-based on mobile</li>
                <li>Tight OS integration</li>
                <li>Free with device</li>
              </ul>
            </div>

            {/* TalkBack */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">TalkBack</h3>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Platform:</span> Android
              </p>
              <p className="text-gray-700 mb-3">
                Google's screen reader for Android devices. Pre-installed on most Android phones.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Pre-installed on Android</li>
                <li>Gesture navigation</li>
                <li>Free with device</li>
                <li>Regular Google updates</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How Blind Users Navigate */}
        <section id="navigation" className="bg-white rounded-xl shadow-lg p-8 mb-8 scroll-mt-24">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 border-l-4 border-purple-600 pl-4">How Blind Users Navigate the Web</h2>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Keyboard-First Navigation</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Screen reader users navigate exclusively with the keyboard. They <strong>never use a mouse</strong>. This means every interactive
              element must be keyboard accessible. If you can't reach it with Tab, Enter, and arrow keys, it doesn't exist for screen reader users.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="font-semibold text-blue-900 mb-2">Developer Impact:</p>
              <p className="text-blue-800">
                Test your entire site with keyboard only (no mouse). Can you access every button, link, form field, and interactive widget?
                If not, you have accessibility issues.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Navigation Modes</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-blue-900 mb-3">Browse Mode (Virtual Cursor)</h4>
                <p className="text-gray-700 mb-3">
                  Used for reading and navigating web content. The screen reader creates a virtual representation of the page.
                </p>
                <p className="text-sm text-gray-600 font-medium mb-2">Key Features:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Read line by line with arrow keys</li>
                  <li>Jump by element type (H for headings, K for links)</li>
                  <li>Navigate by landmarks (regions)</li>
                  <li>List all elements of a type</li>
                </ul>
              </div>

              <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-green-900 mb-3">Focus Mode (Forms Mode)</h4>
                <p className="text-gray-700 mb-3">
                  Automatically activated when entering form fields. Arrow keys type characters instead of navigating.
                </p>
                <p className="text-sm text-gray-600 font-medium mb-2">Key Features:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Direct interaction with form controls</li>
                  <li>Arrow keys work within the control</li>
                  <li>Tab to move between fields</li>
                  <li>Press Escape to return to browse mode</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Common Navigation Shortcuts</h3>
            <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Key</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Action</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Why It Matters</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4"><code className="bg-gray-200 px-2 py-1 rounded">H</code></td>
                    <td className="py-3 px-4">Jump to next heading</td>
                    <td className="py-3 px-4">Users scan pages by headings - structure your content!</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4"><code className="bg-gray-200 px-2 py-1 rounded">K</code></td>
                    <td className="py-3 px-4">Jump to next link</td>
                    <td className="py-3 px-4">Link text must be descriptive (not "click here")</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4"><code className="bg-gray-200 px-2 py-1 rounded">D</code></td>
                    <td className="py-3 px-4">Jump to next landmark</td>
                    <td className="py-3 px-4">Use semantic HTML: &lt;main&gt;, &lt;nav&gt;, &lt;header&gt;</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4"><code className="bg-gray-200 px-2 py-1 rounded">F</code></td>
                    <td className="py-3 px-4">Jump to next form field</td>
                    <td className="py-3 px-4">Every form field needs a proper &lt;label&gt;</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4"><code className="bg-gray-200 px-2 py-1 rounded">T</code></td>
                    <td className="py-3 px-4">Jump to next table</td>
                    <td className="py-3 px-4">Tables need &lt;th&gt; headers and proper structure</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4"><code className="bg-gray-200 px-2 py-1 rounded">B</code></td>
                    <td className="py-3 px-4">Jump to next button</td>
                    <td className="py-3 px-4">Use &lt;button&gt; not &lt;div&gt; with onclick</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4"><code className="bg-gray-200 px-2 py-1 rounded">G</code></td>
                    <td className="py-3 px-4">Jump to next graphic/image</td>
                    <td className="py-3 px-4">Images need alt text or role="presentation"</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              <strong>Note:</strong> These are JAWS/NVDA shortcuts. VoiceOver uses different commands but similar concepts.
            </p>
          </div>
        </section>

        {/* What Screen Readers Announce */}
        <section id="announces" className="bg-white rounded-xl shadow-lg p-8 mb-8 scroll-mt-24">
          <h2 className="text-3xl font-bold text-orange-700 mb-6 border-l-4 border-orange-600 pl-4">What Screen Readers Announce</h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Screen readers don't just read text - they announce semantic information about elements. Understanding what gets announced
            helps you write better HTML and ARIA.
          </p>

          <div className="space-y-6">
            {/* Headings */}
            <div className="border-l-4 border-purple-500 pl-6 py-4 bg-purple-50 rounded-r">
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Headings</h3>
              <div className="font-mono text-sm bg-white p-3 rounded mb-2">
                &lt;h1&gt;Welcome to Our Site&lt;/h1&gt;
              </div>
              <p className="text-purple-900 font-medium mb-1">Screen reader announces:</p>
              <p className="text-purple-800 italic">"Heading level 1, Welcome to Our Site"</p>
              <p className="text-sm text-purple-700 mt-2">
                <strong>Why it matters:</strong> Users jump between headings to scan content. Skipping levels (H1 → H3) confuses users about page structure.
              </p>
            </div>

            {/* Buttons */}
            <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Buttons</h3>
              <div className="font-mono text-sm bg-white p-3 rounded mb-2">
                &lt;button&gt;Submit Form&lt;/button&gt;
              </div>
              <p className="text-blue-900 font-medium mb-1">Screen reader announces:</p>
              <p className="text-blue-800 italic">"Submit Form, button"</p>
              <p className="text-sm text-blue-700 mt-2">
                <strong>Why it matters:</strong> Compare to &lt;div onclick&gt; which announces nothing. Users won't know it's clickable.
              </p>
            </div>

            {/* Links */}
            <div className="border-l-4 border-green-500 pl-6 py-4 bg-green-50 rounded-r">
              <h3 className="text-xl font-semibold text-green-900 mb-2">Links</h3>
              <div className="font-mono text-sm bg-white p-3 rounded mb-2">
                &lt;a href="/products"&gt;View Our Products&lt;/a&gt;
              </div>
              <p className="text-green-900 font-medium mb-1">Screen reader announces:</p>
              <p className="text-green-800 italic">"View Our Products, link"</p>
              <p className="text-sm text-green-700 mt-2">
                <strong>Why it matters:</strong> Users can list all links. "Click here" tells them nothing. "View Our Products" is meaningful.
              </p>
            </div>

            {/* Form Fields */}
            <div className="border-l-4 border-yellow-500 pl-6 py-4 bg-yellow-50 rounded-r">
              <h3 className="text-xl font-semibold text-yellow-900 mb-2">Form Fields</h3>
              <div className="font-mono text-sm bg-white p-3 rounded mb-2">
                &lt;label for="email"&gt;Email Address&lt;/label&gt;<br />
                &lt;input type="email" id="email" required&gt;
              </div>
              <p className="text-yellow-900 font-medium mb-1">Screen reader announces:</p>
              <p className="text-yellow-800 italic">"Email Address, edit text, required"</p>
              <p className="text-sm text-yellow-700 mt-2">
                <strong>Why it matters:</strong> Without the &lt;label&gt;, it announces "Edit text, required" with no context. User has no idea what to enter.
              </p>
            </div>

            {/* Images */}
            <div className="border-l-4 border-red-500 pl-6 py-4 bg-red-50 rounded-r">
              <h3 className="text-xl font-semibold text-red-900 mb-2">Images</h3>
              <div className="font-mono text-sm bg-white p-3 rounded mb-2">
                &lt;img src="chart.png" alt="Sales increased 50% in Q4"&gt;
              </div>
              <p className="text-red-900 font-medium mb-1">Screen reader announces:</p>
              <p className="text-red-800 italic">"Image, Sales increased 50% in Q4"</p>
              <p className="text-sm text-red-700 mt-2">
                <strong>Why it matters:</strong> Without alt text, announces "Image" or the filename. User misses critical information conveyed visually.
              </p>
            </div>

            {/* ARIA Widgets */}
            <div className="border-l-4 border-indigo-500 pl-6 py-4 bg-indigo-50 rounded-r">
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">ARIA Widgets (Expandable Sections)</h3>
              <div className="font-mono text-sm bg-white p-3 rounded mb-2">
                &lt;button aria-expanded="false" aria-controls="panel1"&gt;<br />
                &nbsp;&nbsp;Show More Details<br />
                &lt;/button&gt;
              </div>
              <p className="text-indigo-900 font-medium mb-1">Screen reader announces:</p>
              <p className="text-indigo-800 italic">"Show More Details, button, collapsed"</p>
              <p className="text-sm text-indigo-700 mt-2">
                <strong>Why it matters:</strong> The "collapsed" state tells users there's hidden content. When clicked, it changes to "expanded".
              </p>
            </div>
          </div>
        </section>

        {/* Common Developer Mistakes */}
        <section id="mistakes" className="bg-white rounded-xl shadow-lg p-8 mb-8 scroll-mt-24">
          <h2 className="text-3xl font-bold text-red-700 mb-6 border-l-4 border-red-600 pl-4">Common Developer Mistakes That Break Screen Readers</h2>

          <div className="space-y-6">
            {/* Mistake 1 */}
            <div className="border border-red-200 rounded-lg p-6 bg-red-50">
              <div className="flex items-start gap-4">
                <span className="text-3xl">❌</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-red-900 mb-2">Using &lt;div&gt; or &lt;span&gt; as Buttons</h3>
                  <div className="font-mono text-sm bg-white p-3 rounded mb-3 border border-red-200">
                    &lt;div class="button" onclick="submit()"&gt;Submit&lt;/div&gt;
                  </div>
                  <p className="text-red-800 mb-2">
                    <strong>What happens:</strong> Screen reader announces "Submit" with no indication it's clickable. Not keyboard accessible.
                  </p>
                  <div className="bg-green-50 border border-green-300 rounded p-3 mt-3">
                    <p className="text-green-900 font-medium mb-2">✓ Do this instead:</p>
                    <div className="font-mono text-sm bg-white p-3 rounded">
                      &lt;button onclick="submit()"&gt;Submit&lt;/button&gt;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mistake 2 */}
            <div className="border border-red-200 rounded-lg p-6 bg-red-50">
              <div className="flex items-start gap-4">
                <span className="text-3xl">❌</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-red-900 mb-2">Missing Form Labels</h3>
                  <div className="font-mono text-sm bg-white p-3 rounded mb-3 border border-red-200">
                    &lt;input type="text" placeholder="Enter your name"&gt;
                  </div>
                  <p className="text-red-800 mb-2">
                    <strong>What happens:</strong> Screen reader announces "Edit text" - user doesn't know what to enter. Placeholder is not a label.
                  </p>
                  <div className="bg-green-50 border border-green-300 rounded p-3 mt-3">
                    <p className="text-green-900 font-medium mb-2">✓ Do this instead:</p>
                    <div className="font-mono text-sm bg-white p-3 rounded">
                      &lt;label for="name"&gt;Name&lt;/label&gt;<br />
                      &lt;input type="text" id="name"&gt;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mistake 3 */}
            <div className="border border-red-200 rounded-lg p-6 bg-red-50">
              <div className="flex items-start gap-4">
                <span className="text-3xl">❌</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-red-900 mb-2">Skipping Heading Levels</h3>
                  <div className="font-mono text-sm bg-white p-3 rounded mb-3 border border-red-200">
                    &lt;h1&gt;Page Title&lt;/h1&gt;<br />
                    &lt;h3&gt;Section Title&lt;/h3&gt; {/* Skipped h2! */}
                  </div>
                  <p className="text-red-800 mb-2">
                    <strong>What happens:</strong> Users navigating by headings get confused about content hierarchy and structure.
                  </p>
                  <div className="bg-green-50 border border-green-300 rounded p-3 mt-3">
                    <p className="text-green-900 font-medium mb-2">✓ Do this instead:</p>
                    <div className="font-mono text-sm bg-white p-3 rounded">
                      &lt;h1&gt;Page Title&lt;/h1&gt;<br />
                      &lt;h2&gt;Section Title&lt;/h2&gt;<br />
                      &lt;h3&gt;Subsection&lt;/h3&gt;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mistake 4 */}
            <div className="border border-red-200 rounded-lg p-6 bg-red-50">
              <div className="flex items-start gap-4">
                <span className="text-3xl">❌</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-red-900 mb-2">Missing Alt Text on Images</h3>
                  <div className="font-mono text-sm bg-white p-3 rounded mb-3 border border-red-200">
                    &lt;img src="product.jpg"&gt;
                  </div>
                  <p className="text-red-800 mb-2">
                    <strong>What happens:</strong> Screen reader announces filename: "product dot jay peg" - completely meaningless.
                  </p>
                  <div className="bg-green-50 border border-green-300 rounded p-3 mt-3">
                    <p className="text-green-900 font-medium mb-2">✓ Do this instead:</p>
                    <div className="font-mono text-sm bg-white p-3 rounded">
                      &lt;img src="product.jpg" alt="Blue ceramic coffee mug"&gt;<br /><br />
                      {/* For decorative images: */}<br />
                      &lt;img src="divider.png" alt="" role="presentation"&gt;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mistake 5 */}
            <div className="border border-red-200 rounded-lg p-6 bg-red-50">
              <div className="flex items-start gap-4">
                <span className="text-3xl">❌</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-red-900 mb-2">Generic Link Text</h3>
                  <div className="font-mono text-sm bg-white p-3 rounded mb-3 border border-red-200">
                    &lt;a href="/report.pdf"&gt;Click here&lt;/a&gt;<br />
                    &lt;a href="/more.html"&gt;Read more&lt;/a&gt;
                  </div>
                  <p className="text-red-800 mb-2">
                    <strong>What happens:</strong> Users list all links - see 50 "Click here" links with no context about where they go.
                  </p>
                  <div className="bg-green-50 border border-green-300 rounded p-3 mt-3">
                    <p className="text-green-900 font-medium mb-2">✓ Do this instead:</p>
                    <div className="font-mono text-sm bg-white p-3 rounded">
                      &lt;a href="/report.pdf"&gt;Download Q4 Financial Report (PDF)&lt;/a&gt;<br />
                      &lt;a href="/more.html"&gt;Read more about our accessibility features&lt;/a&gt;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mistake 6 */}
            <div className="border border-red-200 rounded-lg p-6 bg-red-50">
              <div className="flex items-start gap-4">
                <span className="text-3xl">❌</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-red-900 mb-2">Keyboard Traps</h3>
                  <div className="font-mono text-sm bg-white p-3 rounded mb-3 border border-red-200">
                    {/* Modal that can't be closed with keyboard */}<br />
                    &lt;div class="modal"&gt;<br />
                    &nbsp;&nbsp;&lt;span onclick="close()"&gt;×&lt;/span&gt;<br />
                    &lt;/div&gt;
                  </div>
                  <p className="text-red-800 mb-2">
                    <strong>What happens:</strong> User opens modal, can't close it with keyboard, trapped forever. Must reload page.
                  </p>
                  <div className="bg-green-50 border border-green-300 rounded p-3 mt-3">
                    <p className="text-green-900 font-medium mb-2">✓ Do this instead:</p>
                    <div className="font-mono text-sm bg-white p-3 rounded">
                      &lt;div role="dialog" aria-modal="true"&gt;<br />
                      &nbsp;&nbsp;&lt;button onclick="close()" aria-label="Close"&gt;×&lt;/button&gt;<br />
                      &nbsp;&nbsp;{/* Press Escape to close */}<br />
                      &lt;/div&gt;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact on Design Decisions */}
        <section id="design-impact" className="bg-white rounded-xl shadow-lg p-8 mb-8 scroll-mt-24">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-l-4 border-indigo-600 pl-4">How This Impacts Your Design Decisions</h2>

          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">1. Visual Hierarchy = Reading Hierarchy</h3>
              <p className="text-blue-800 mb-3">
                That large, bold text you styled with CSS? If it's not an &lt;h2&gt;, screen readers won't treat it as a heading.
                Use semantic HTML first, then style it.
              </p>
              <p className="text-sm text-blue-700 italic">
                "Don't use &lt;div class='heading'&gt; - use &lt;h2 class='blue-text'&gt;"
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r">
              <h3 className="text-xl font-semibold text-green-900 mb-3">2. Focus Indicators Are Not Optional</h3>
              <p className="text-green-800 mb-3">
                That outline when you Tab through elements? Screen reader users depend on it to know where they are.
                Never use <code className="bg-green-200 px-2 py-1 rounded">outline: none</code> without providing an alternative.
              </p>
              <p className="text-sm text-green-700 italic">
                "If you remove the default focus outline, provide a custom one that's even more visible"
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">3. Tab Order = Reading Order</h3>
              <p className="text-purple-800 mb-3">
                Using CSS to visually reorder content? The keyboard tab order follows DOM order, not visual order.
                This can completely confuse screen reader users.
              </p>
              <p className="text-sm text-purple-700 italic">
                "Keep your DOM order logical. Use CSS Grid/Flexbox's 'order' property sparingly and carefully"
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r">
              <h3 className="text-xl font-semibold text-yellow-900 mb-3">4. Color is Not Enough</h3>
              <p className="text-yellow-800 mb-3">
                Red text for errors? Screen readers don't announce colors. You need text like "Error:" or
                <code className="bg-yellow-200 px-2 py-1 rounded mx-1">aria-invalid="true"</code> with
                <code className="bg-yellow-200 px-2 py-1 rounded ml-1">aria-describedby</code> pointing to error message.
              </p>
              <p className="text-sm text-yellow-700 italic">
                "Every visual indicator needs a non-visual equivalent"
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r">
              <h3 className="text-xl font-semibold text-red-900 mb-3">5. Hidden Doesn't Always Mean Hidden</h3>
              <p className="text-red-800 mb-3">
                <code className="bg-red-200 px-2 py-1 rounded">display: none</code> and
                <code className="bg-red-200 px-2 py-1 rounded mx-1">visibility: hidden</code> hide from screen readers (good for menus).
                But <code className="bg-red-200 px-2 py-1 rounded">opacity: 0</code> and
                <code className="bg-red-200 px-2 py-1 rounded mx-1">position: absolute; left: -9999px</code> don't hide from screen readers.
              </p>
              <p className="text-sm text-red-700 italic">
                "Understand what hides content from whom: visually only, screen readers only, or both"
              </p>
            </div>
          </div>
        </section>

        {/* Testing with Screen Readers */}
        <section id="testing" className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl shadow-lg p-8 mb-8 border-2 border-teal-300 scroll-mt-24">
          <h2 className="text-3xl font-bold text-teal-800 mb-6 border-l-4 border-teal-700 pl-4">Testing Your Site with Screen Readers</h2>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-semibold text-indigo-900 mb-4">Quick Start Guide</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Windows: Download NVDA (Free)</h4>
                  <p className="text-gray-700 mb-2">
                    Go to <a href="https://www.nvaccess.org/" className="text-blue-600 hover:underline" target="_blank" rel="noopener">nvaccess.org</a>,
                    download and install. Press <code className="bg-gray-200 px-2 py-1 rounded">Ctrl + Alt + N</code> to start.
                  </p>
                  <p className="text-sm text-gray-600">
                    Important: Close your eyes or look away while testing. You need to experience it like a blind user would.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mac: Turn On VoiceOver (Built-in)</h4>
                  <p className="text-gray-700 mb-2">
                    Press <code className="bg-gray-200 px-2 py-1 rounded">Cmd + F5</code> to enable.
                    Use <code className="bg-gray-200 px-2 py-1 rounded">Ctrl + Option + arrow keys</code> to navigate.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Navigate Your Site Without Looking</h4>
                  <p className="text-gray-700">
                    Can you complete critical tasks (login, purchase, contact) using only keyboard and audio?
                    If not, you've found accessibility issues.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">What to Test</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">Can you reach every interactive element with keyboard only?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">Are all images described meaningfully?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">Can you navigate by headings (press H repeatedly)?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">Do form fields announce their labels?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">Can you tell when elements are buttons vs links vs text?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">Do error messages get announced immediately?</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Key Takeaways */}
        <section id="takeaways" className="bg-gradient-to-r from-pink-600 to-purple-700 rounded-xl shadow-lg p-8 text-white scroll-mt-24">
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-white pl-4">Key Takeaways for Developers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">1. Semantic HTML First</h3>
              <p className="text-blue-100">
                Use the right HTML element for the job. &lt;button&gt; for buttons, &lt;nav&gt; for navigation,
                &lt;h1&gt;-&lt;h6&gt; for headings. Screen readers rely on this.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">2. Test with Keyboard Only</h3>
              <p className="text-blue-100">
                Unplug your mouse. Can you use your entire site? If not, it's broken for screen reader users.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">3. Content Structure Matters</h3>
              <p className="text-blue-100">
                Users navigate by landmarks, headings, and element types. A flat &lt;div&gt; soup is impossible to navigate.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">4. Context is Everything</h3>
              <p className="text-blue-100">
                "Click here" links, unlabeled buttons, and missing alt text provide zero context to screen reader users.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-white/20 rounded-lg p-6 border-2 border-white/40">
            <p className="text-xl font-semibold mb-3">
              The Bottom Line
            </p>
            <p className="text-lg text-blue-50">
              Screen readers don't magically make your site accessible. They expose your code's semantic structure (or lack thereof).
              Write semantic HTML, test with keyboard navigation, and actually use a screen reader on your site.
              You'll be shocked by what you discover.
            </p>
          </div>
        </section>

        {/* Resources */}
        <section className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Learn More</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Screen Reader Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.nvaccess.org/" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                    NVDA (Free Windows screen reader)
                  </a>
                </li>
                <li>
                  <a href="https://webaim.org/articles/screenreader_testing/" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                    WebAIM: Testing with Screen Readers
                  </a>
                </li>
                <li>
                  <a href="https://dequeuniversity.com/screenreaders/" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                    Deque: Screen Reader Keyboard Shortcuts
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Accessibility Guidelines</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.w3.org/WAI/WCAG22/quickref/" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                    WCAG 2.2 Quick Reference
                  </a>
                </li>
                <li>
                  <a href="https://www.w3.org/WAI/ARIA/apg/" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                    ARIA Authoring Practices Guide
                  </a>
                </li>
                <li>
                  <a href="https://webaim.org/" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                    WebAIM (Web Accessibility In Mind)
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
          <Link href="/" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
            Return to Playground
          </Link>
        </div>
      </footer>
    </div>
  );
}
