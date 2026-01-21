export default function SeizureDisorders() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* What You'll Learn */}
      <section className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8 mb-12 border-2 border-red-300">
        <h2 className="text-2xl font-bold text-red-900 mt-0 mb-4">⚠️ Critical Safety Topic: What You'll Learn</h2>
        <ul className="space-y-2 mb-0">
          <li>How photosensitive epilepsy is triggered by visual content</li>
          <li>The specific frequencies and patterns that cause seizures</li>
          <li>WCAG's strict requirements for flashing content (legal requirement)</li>
          <li>How to test for seizure-triggering content</li>
          <li>Safe animation and motion design practices</li>
        </ul>
      </section>

      {/* Critical Warning */}
      <section className="mb-12">
        <div className="bg-red-100 border-4 border-red-600 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🚨</div>
            <div>
              <h2 className="text-3xl font-bold text-red-900 mt-0 mb-4">This Is a Safety Issue, Not Just Usability</h2>
              <p className="text-lg text-red-900 leading-relaxed mb-4">
                Unlike other accessibility issues that create barriers, flashing content can cause <strong>physical
                harm</strong>—seizures that can lead to injury or death. WCAG 2.3.1 is a <strong>Level A requirement</strong>
                and is legally mandated in many jurisdictions. Violations can result in lawsuits and serious harm to users.
              </p>
              <p className="text-lg font-semibold text-red-900">
                If you take away one thing from this module: <strong>NEVER create content that flashes more than 3 times
                per second.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why This Matters</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Photosensitive epilepsy affects about 3% of people with epilepsy—roughly 1 in 4,000 people. While
          relatively rare, the consequences are severe. A single flashing banner ad or animated GIF can trigger
          a seizure, causing loss of consciousness, injury from falling, or even death in extreme cases.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6">
          <p className="text-lg font-semibold text-yellow-900 mb-2">📊 By the Numbers</p>
          <ul className="space-y-2 text-gray-700 mb-0">
            <li><strong>Epilepsy affects 65 million people</strong> worldwide</li>
            <li><strong>1 in 100 people</strong> will have epilepsy at some point in their life</li>
            <li><strong>3% of epilepsy cases</strong> are photosensitive (about 1 in 4,000 people)</li>
            <li><strong>Most vulnerable age:</strong> 7-19 years old</li>
            <li><strong>Can develop in anyone:</strong> Even people without prior seizure history</li>
          </ul>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6">
          <p className="text-lg font-semibold text-red-900 mb-2">Historical Context: The Pokémon Incident (1997)</p>
          <p className="text-gray-700">
            A Pokémon TV episode in Japan featured rapid red and blue flashing. <strong>685 children</strong> were
            hospitalized with seizures, nausea, and vision problems. This incident led to widespread awareness
            and stricter broadcast standards. The same principles apply to web content.
          </p>
        </div>
      </section>

      {/* What Causes Seizures */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">What Causes Photosensitive Seizures?</h2>
        <p className="text-lg text-gray-700 mb-6">
          Photosensitive seizures are triggered by specific visual stimuli. Understanding the triggers helps
          developers avoid creating dangerous content.
        </p>

        <div className="space-y-6">
          {/* Flashing */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-2xl font-semibold text-red-900 mb-3">1. Flashing Content</h3>
            <p className="text-gray-700 mb-4">
              <strong>The most dangerous trigger.</strong> Flashing occurs when content rapidly alternates
              between light and dark or between contrasting colors.
            </p>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="font-semibold text-red-900 mb-2">Critical thresholds:</p>
              <ul className="space-y-2 text-gray-700 mb-0">
                <li><strong>Frequency:</strong> 3-60 Hz (flashes per second), with <strong>15-20 Hz being most dangerous</strong></li>
                <li><strong>WCAG limit:</strong> Maximum <strong>3 flashes per second</strong></li>
                <li><strong>Size:</strong> Large flashing areas more dangerous than small</li>
                <li><strong>Contrast:</strong> High contrast (especially red) increases risk</li>
                <li><strong>Duration:</strong> Longer exposure increases seizure risk</li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 mt-4">
              <p className="font-semibold text-gray-900 mb-2">Examples of flashing content:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>❌ Strobe light effects</li>
                <li>❌ Rapidly blinking banners or ads</li>
                <li>❌ Thunder/lightning effects in videos</li>
                <li>❌ Emergency vehicle lights animation</li>
                <li>❌ Fast-paced video game effects</li>
              </ul>
            </div>
          </div>

          {/* Patterns */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <h3 className="text-2xl font-semibold text-orange-900 mb-3">2. High-Contrast Patterns</h3>
            <p className="text-gray-700 mb-4">
              Regular patterns with high contrast, especially stripes, grids, or checkerboards. Particularly
              problematic when moving or scrolling.
            </p>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="font-semibold text-orange-900 mb-2">Dangerous patterns:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Parallel stripes (especially horizontal)</li>
                <li>High-contrast checkerboards</li>
                <li>Dense grids with thin lines</li>
                <li>Spiral or concentric patterns</li>
                <li>Patterns that create optical illusions</li>
              </ul>
            </div>
          </div>

          {/* Red */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-2xl font-semibold text-red-900 mb-3">3. Red Flashing</h3>
            <p className="text-gray-700 mb-4">
              <strong>Red is especially dangerous.</strong> Red flashing is more likely to trigger seizures
              than other colors. The combination of red with high contrast and rapid flashing is extremely risky.
            </p>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="font-semibold text-red-900 mb-2">Why red is worse:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Red light has longer wavelength, penetrates deeper into eye</li>
                <li>Red-sensitive cells in retina more responsive</li>
                <li>Alternating red and another color compounds the effect</li>
              </ul>
            </div>
          </div>

          {/* Rapid Transitions */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <h3 className="text-2xl font-semibold text-yellow-900 mb-3">4. Rapid Scene Changes</h3>
            <p className="text-gray-700 mb-4">
              Fast cuts between contrasting scenes in video content, especially if the entire screen changes
              rapidly multiple times per second.
            </p>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="font-semibold text-yellow-900 mb-2">Examples:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Action movie rapid cuts</li>
                <li>Music video effects</li>
                <li>Fast-paced video game transitions</li>
                <li>Montage sequences with quick cuts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WCAG Requirements */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">WCAG 2.2 Requirements (Legal Requirements)</h2>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8 border-4 border-red-600 mb-6">
          <h3 className="text-2xl font-bold text-red-900 mb-4">Success Criterion 2.3.1: Three Flashes or Below Threshold (Level A)</h3>
          <p className="text-lg text-gray-700 mb-4">
            <strong>Web pages do not contain anything that flashes more than three times in any one second period,
            or the flash is below the general flash and red flash thresholds.</strong>
          </p>
          <div className="bg-white rounded-lg p-6">
            <p className="font-semibold text-gray-900 mb-3">Breaking this down:</p>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-red-900">Option 1: No More Than 3 Flashes Per Second (Simplest)</p>
                <p className="text-gray-700 text-sm">
                  If content flashes, it must flash 3 times per second or less. This is the easiest rule to follow
                  and ensures compliance.
                </p>
              </div>
              <div>
                <p className="font-medium text-red-900">Option 2: Below General Flash Threshold (Complex)</p>
                <p className="text-gray-700 text-sm">
                  If flashing more than 3 times/second, it must meet technical criteria: flashing area must be small
                  enough and contrast must be low enough based on specific mathematical thresholds. <strong>Requires
                  specialized testing tools.</strong> Not recommended unless you have expertise.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
          <h3 className="text-xl font-bold text-blue-900 mb-3">Success Criterion 2.3.2: Three Flashes (Level AAA)</h3>
          <p className="text-gray-700 mb-2">
            <strong>Web pages do not contain anything that flashes more than three times in any one second period.</strong>
          </p>
          <p className="text-gray-700">
            AAA is stricter—no exceptions for small areas or low contrast. Recommended for maximum safety.
          </p>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-600 p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">Success Criterion 2.3.3: Animation from Interactions (Level AAA, WCAG 2.2 New)</h3>
          <p className="text-gray-700">
            <strong>Motion animation triggered by interaction can be disabled, unless the animation is essential.</strong>
          </p>
          <p className="text-gray-700 mt-2">
            Helps users with vestibular disorders (motion sensitivity) who experience nausea, dizziness, or headaches
            from animation. Overlaps with seizure safety.
          </p>
        </div>
      </section>

      {/* Safe Practices */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Safe Animation & Motion Design Practices</h2>

        <div className="space-y-6">
          <div className="bg-green-50 border-l-4 border-green-600 p-6">
            <h3 className="text-xl font-bold text-green-900 mb-3">✅ Safe Practices</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Limit flash rate:</strong> Never exceed 3 flashes per second</li>
              <li><strong>Use smooth transitions:</strong> Fade instead of flashing, ease instead of snapping</li>
              <li><strong>Small areas:</strong> Keep flashing content small (but still limit to 3/sec)</li>
              <li><strong>Low contrast:</strong> Avoid high contrast flashing (especially red)</li>
              <li><strong>User control:</strong> Provide pause/stop/hide controls for animations</li>
              <li><strong>Respect prefers-reduced-motion:</strong> Disable animations for users who opt out</li>
              <li><strong>Warning labels:</strong> If unavoidable, warn users before showing flashing content</li>
              <li><strong>Auto-play off:</strong> Don't start animations automatically</li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-6">
            <h3 className="text-xl font-bold text-green-900 mb-3">✅ CSS: Respect prefers-reduced-motion</h3>
            <p className="text-gray-700 mb-3">
              Users with vestibular disorders or seizure risk can enable "Reduce Motion" in OS settings.
              Your CSS should respect this preference.
            </p>
            <div className="bg-white rounded p-4">
              <code className="block text-sm font-mono whitespace-pre">
{`/* Default: animation enabled */
.animated-element {
  animation: slide-in 0.5s ease;
}

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    /* Or use a gentler fade */
    animation: fade-in 0.5s ease;
  }
}

/* For users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`}
              </code>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-6">
            <h3 className="text-xl font-bold text-green-900 mb-3">✅ JavaScript: Provide Play/Pause Controls</h3>
            <div className="bg-white rounded p-4">
              <code className="block text-sm font-mono whitespace-pre">
{`// Animated banner example
const banner = document.querySelector('.banner');
const pauseBtn = document.querySelector('.pause-animation');

let isPlaying = true;

pauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    banner.style.animationPlayState = 'paused';
    pauseBtn.textContent = 'Play';
  } else {
    banner.style.animationPlayState = 'running';
    pauseBtn.textContent = 'Pause';
  }
  isPlaying = !isPlaying;
});

// Stop animation if user has reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  banner.style.animation = 'none';
}`}
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Testing Tools */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Testing for Seizure-Triggering Content</h2>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
          <h3 className="text-xl font-bold text-blue-900 mb-3">Photosensitive Epilepsy Analysis Tool (PEAT)</h3>
          <p className="text-gray-700 mb-3">
            <strong>Free tool from Trace Research & Development Center</strong> that analyzes video content for
            seizure triggers. Tests against WCAG 2.3.1 thresholds.
          </p>
          <ul className="space-y-1 text-gray-700">
            <li><strong>Download:</strong> <a href="https://trace.umd.edu/peat/" className="text-blue-700 underline">https://trace.umd.edu/peat/</a></li>
            <li><strong>Platform:</strong> Windows only</li>
            <li><strong>What it analyzes:</strong> Video files (AVI, MPEG, WMV)</li>
            <li><strong>Output:</strong> Pass/fail report with timestamps of failures</li>
          </ul>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
          <h3 className="text-xl font-bold text-blue-900 mb-3">Browser DevTools</h3>
          <p className="text-gray-700 mb-3">
            Chrome DevTools has rendering emulation features:
          </p>
          <ul className="space-y-1 text-gray-700">
            <li>Open DevTools → Cmd/Ctrl+Shift+P → "Emulate CSS prefers-reduced-motion"</li>
            <li>Test your site with reduced motion enabled</li>
            <li>Verify animations are disabled or reduced</li>
          </ul>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-3">Manual Testing</h3>
          <p className="text-gray-700 mb-3">For simple cases, manual inspection:</p>
          <ul className="space-y-2 text-gray-700">
            <li><strong>Count flashes:</strong> Use a stopwatch. Count transitions in 1 second. Must be 3 or fewer.</li>
            <li><strong>Check video frame by frame:</strong> Review any rapid scene changes</li>
            <li><strong>Test animations:</strong> Slow down playback, count transitions</li>
            <li><strong>Review GIFs and videos:</strong> These are common sources of violations</li>
          </ul>
        </div>
      </section>

      {/* Common Violations */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Code Violations</h2>

        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">❌ Blinking/Flashing CSS</h3>
            <div className="bg-white p-4 rounded">
              <code className="block text-sm font-mono whitespace-pre mb-2 text-red-700">
{`/* DANGEROUS - Violates WCAG 2.3.1 */
@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}

.alert {
  animation: blink 0.5s infinite; /* 4 flashes/sec! */
}`}
              </code>
              <p className="text-sm text-gray-700 mt-2">This blinks 4 times per second, exceeding the 3 flash limit.</p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">❌ setInterval Flashing</h3>
            <div className="bg-white p-4 rounded">
              <code className="block text-sm font-mono whitespace-pre mb-2 text-red-700">
{`// DANGEROUS - Violates WCAG 2.3.1
setInterval(() => {
  element.style.display =
    element.style.display === 'none' ? 'block' : 'none';
}, 200); // 5 flashes per second!`}
              </code>
              <p className="text-sm text-gray-700 mt-2">Flashing 5 times per second, well over the limit.</p>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-6">
            <h3 className="text-xl font-bold text-green-900 mb-2">✅ Safe Alternative: Fade</h3>
            <div className="bg-white p-4 rounded">
              <code className="block text-sm font-mono whitespace-pre mb-2 text-green-700">
{`/* SAFE - Smooth fade, not flashing */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.alert {
  animation: pulse 2s ease-in-out infinite;
}

/* Disable for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .alert {
    animation: none;
  }
}`}
              </code>
              <p className="text-sm text-gray-700 mt-2">Smooth fade over 2 seconds, not a flash. Respects user preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Checklist */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8 border-4 border-red-600">
          <h2 className="text-3xl font-bold text-red-900 mb-6">🚨 Developer Checklist: Seizure Safety</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>No content flashes more than 3 times per second:</strong> Count all transitions, animations, and flashing
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Avoid high-contrast patterns:</strong> No dense stripes, checkerboards, or optical illusions
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Avoid red flashing:</strong> Red is especially dangerous, avoid at all costs
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Respect prefers-reduced-motion:</strong> Disable or reduce animations for users who opt out
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Provide pause/stop controls:</strong> Users can pause or hide animations
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Test video content with PEAT:</strong> Analyze videos before publishing
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Warning labels for unavoidable flashing:</strong> Warn users before showing potentially dangerous content
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Review third-party content:</strong> Ads, embedded videos, and user-generated content can violate safety rules
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">🚨 Critical Safety Takeaways</h2>
          <ul className="space-y-3 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <span>Flashing content can cause seizures—this is a safety issue, not just usability</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <span>NEVER exceed 3 flashes per second (WCAG 2.3.1 Level A requirement)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <span>Red flashing is especially dangerous—avoid completely</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <span>Respect prefers-reduced-motion CSS media query</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <span>Test video content with PEAT before publishing</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <div className="bg-gray-100 rounded-xl p-8 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <p className="text-gray-700 mb-4">
            Continue with more disability types:
          </p>
          <div className="space-y-2">
            <a href="/learn/developers/modules/temporary-situational-disabilities" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 8: Temporary and Situational Disabilities
            </a>
            <a href="/learn/developers/modules/animations-and-motion" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 37: Animations and Motion (implementation details)
            </a>
            <a href="/learn/developers/modules/operable-principle" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 15: WCAG Operable Principle (includes 2.3.1)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
