export default function CognitiveDisabilities() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* What You'll Learn */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-12 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mt-0 mb-4">What You'll Learn</h2>
        <ul className="space-y-2 mb-0">
          <li>The diverse spectrum of cognitive disabilities and how they affect web use</li>
          <li>How memory, attention, language processing, and executive function impact digital interaction</li>
          <li>Why cognitive accessibility benefits everyone (plain language, clear navigation, etc.)</li>
          <li>Common barriers in complex interfaces and how to simplify them</li>
          <li>Developer strategies for cognitive-accessible design</li>
        </ul>
      </section>

      {/* Why This Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why This Matters</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Cognitive disabilities are the most common and most diverse category of disability—and often the most
          overlooked in web development. Unlike visual or motor disabilities where assistive technology can bridge
          gaps, cognitive accessibility requires thoughtful design from the start. The good news: cognitive
          accessibility improvements benefit everyone, from users in stressful situations to those using sites
          in their second language.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6">
          <p className="text-lg font-semibold text-yellow-900 mb-2">📊 By the Numbers</p>
          <ul className="space-y-2 text-gray-700 mb-0">
            <li><strong>16% of the global population</strong> has significant cognitive disabilities (WHO, 2023)</li>
            <li><strong>6.5 million Americans</strong> have intellectual disabilities</li>
            <li><strong>6.2 million Americans</strong> have dementia or Alzheimer's</li>
            <li><strong>8-12% of children</strong> have learning disabilities (dyslexia, ADHD, etc.)</li>
            <li><strong>Everyone experiences temporary cognitive impairment:</strong> stress, fatigue, multitasking, medication, alcohol</li>
          </ul>
        </div>
      </section>

      {/* The Spectrum of Cognitive Disabilities */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Spectrum of Cognitive Disabilities</h2>
        <p className="text-lg text-gray-700 mb-6">
          Cognitive disabilities affect mental processes like memory, attention, perception, problem-solving,
          and language. They vary widely and often co-occur.
        </p>

        <div className="space-y-6">
          {/* Learning Disabilities */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-2xl font-semibold text-blue-900 mb-3">1. Learning Disabilities</h3>
            <p className="text-gray-700 mb-4">
              Specific difficulties with learning skills like reading, writing, or math. Intelligence is typically
              average or above average—the difficulty is with specific cognitive processes.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="font-semibold text-blue-900 mb-2">Common types:</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">Dyslexia (Reading):</p>
                  <p className="text-gray-700 text-sm">Difficulty reading fluently, may swap letters (b/d, p/q), read slowly. Affects 5-10% of population.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dysgraphia (Writing):</p>
                  <p className="text-gray-700 text-sm">Difficulty with writing mechanics—spelling, grammar, organizing thoughts on paper.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dyscalculia (Math):</p>
                  <p className="text-gray-700 text-sm">Difficulty understanding numbers, performing calculations, remembering math facts.</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Clear, simple language (8th grade reading level or below)</li>
                <li>Text-to-speech support (screen reader compatibility)</li>
                <li>Spell-check in forms, forgiving input validation</li>
                <li>Visual aids and icons to supplement text</li>
                <li>Avoid CAPTCHA with text-based puzzles</li>
              </ul>
            </div>
          </div>

          {/* ADHD */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-2xl font-semibold text-purple-900 mb-3">2. ADHD (Attention-Deficit/Hyperactivity Disorder)</h3>
            <p className="text-gray-700 mb-4">
              Difficulty sustaining attention, controlling impulses, and managing executive functions like planning
              and organization. Affects 4-5% of adults, 8-12% of children.
            </p>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="font-semibold text-purple-900 mb-2">Characteristics affecting web use:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Easily distracted by animations, auto-play videos, ads</li>
                <li>Difficulty completing long forms or multi-step processes</li>
                <li>May miss important information if not prominent</li>
                <li>Hyperfocus can lead to losing track of time (session timeouts)</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Minimize distractions (no auto-play, reduce animations)</li>
                <li>Break long forms into short steps with progress indicators</li>
                <li>Clearly highlight important information (alerts, deadlines)</li>
                <li>Save progress automatically, no aggressive timeouts</li>
                <li>Provide option to pause/hide animations</li>
              </ul>
            </div>
          </div>

          {/* Autism Spectrum Disorder */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-2xl font-semibold text-green-900 mb-3">3. Autism Spectrum Disorder (ASD)</h3>
            <p className="text-gray-700 mb-4">
              Neurological differences affecting social communication, behavior patterns, and sensory processing.
              Highly variable—ranges from requiring substantial support to minimal support. About 1-2% of population.
            </p>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="font-semibold text-green-900 mb-2">Characteristics affecting web use:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Preference for literal, precise language (idioms and metaphors can confuse)</li>
                <li>May be overwhelmed by sensory input (flashing, bright colors, sounds)</li>
                <li>Strong preference for consistency and predictable patterns</li>
                <li>Difficulty understanding social cues or implied meaning</li>
                <li>May have exceptional focus and attention to detail</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-blue-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Use literal, concrete language (avoid idioms like "hit the ground running")</li>
                <li>Consistent navigation and layout across pages</li>
                <li>Avoid sensory overload (flashing, autoplay, busy designs)</li>
                <li>Clear instructions with examples</li>
                <li>Predictable interactions (buttons always behave the same way)</li>
              </ul>
            </div>
          </div>

          {/* Memory Impairments */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <h3 className="text-2xl font-semibold text-orange-900 mb-3">4. Memory Impairments</h3>
            <p className="text-gray-700 mb-4">
              Difficulty remembering information, which can be short-term (working memory) or long-term. Common
              in aging, dementia, brain injury, or as side effect of medications.
            </p>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="font-semibold text-orange-900 mb-2">Types of memory challenges:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li><strong>Working memory:</strong> Difficulty holding information temporarily (remembering steps in a task)</li>
                <li><strong>Long-term memory:</strong> Difficulty recalling learned information (passwords, how to use site)</li>
                <li><strong>Prospective memory:</strong> Remembering to do something in the future (return to complete task)</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Provide clear reminders and confirmations</li>
                <li>Save user's place in multi-step processes</li>
                <li>Allow password managers and autocomplete</li>
                <li>Use recognition over recall (show options vs ask for input)</li>
                <li>Provide help and instructions inline, not hidden</li>
              </ul>
            </div>
          </div>

          {/* Intellectual Disabilities */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-2xl font-semibold text-red-900 mb-3">5. Intellectual Disabilities</h3>
            <p className="text-gray-700 mb-4">
              Limitations in cognitive functioning and adaptive behavior. May have difficulty with complex language,
              abstract concepts, problem-solving, and learning new tasks.
            </p>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="font-semibold text-red-900 mb-2">Challenges:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Reading comprehension may be limited</li>
                <li>Difficulty with abstract or complex instructions</li>
                <li>May need more time to process information</li>
                <li>Navigation can be challenging if inconsistent</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Very simple, clear language (elementary reading level)</li>
                <li>Images and symbols to support text</li>
                <li>Simple, consistent navigation</li>
                <li>One main task per page (avoid overwhelming)</li>
                <li>Provide help that's easy to understand</li>
              </ul>
            </div>
          </div>

          {/* Seizure Disorders */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
            <h3 className="text-2xl font-semibold text-pink-900 mb-3">6. Seizure Disorders (Photosensitive Epilepsy)</h3>
            <p className="text-gray-700 mb-4">
              Seizures can be triggered by flashing lights, rapid animations, or certain visual patterns. Affects
              about 3% of people with epilepsy (photosensitive epilepsy).
            </p>
            <div className="bg-pink-50 rounded-lg p-4">
              <p className="font-semibold text-pink-900 mb-2">Triggers:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Flashing at 3-60 Hz (especially 15-20 Hz)</li>
                <li>Large, high-contrast patterns</li>
                <li>Rapid transitions or animations</li>
                <li>Red flashing particularly problematic</li>
              </ul>
            </div>
            <div className="bg-red-100 border-l-4 border-red-600 p-4 mt-4">
              <p className="font-semibold text-red-900 mb-2">⚠️ CRITICAL Safety Requirement:</p>
              <p className="text-gray-700 mb-2">
                <strong>WCAG 2.3.1 (Level A):</strong> Web pages must not contain anything that flashes more than
                three times per second. This is a safety requirement, not just usability.
              </p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>✓ No flashing content (or warn users first)</li>
                <li>✓ Limit animation frequency and contrast</li>
                <li>✓ Provide option to disable animations</li>
                <li>✓ Test with tools like Photosensitive Epilepsy Analysis Tool (PEAT)</li>
              </ul>
            </div>
          </div>

          {/* Temporary Cognitive Impairment */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
            <h3 className="text-2xl font-semibold text-teal-900 mb-3">7. Temporary & Situational Cognitive Impairment</h3>
            <p className="text-gray-700 mb-4">
              Everyone experiences reduced cognitive function at times—stress, fatigue, multitasking, illness,
              medication, alcohol, or simply being in an unfamiliar context.
            </p>
            <div className="bg-teal-50 rounded-lg p-4">
              <p className="font-semibold text-teal-900 mb-2">Common scenarios:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Sleep deprivation reduces attention and working memory</li>
                <li>High stress impairs decision-making</li>
                <li>Multitasking reduces comprehension</li>
                <li>Using site in second language</li>
                <li>Grief, anxiety, or emotional distress</li>
                <li>Medication side effects (pain meds, allergy meds)</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <p className="text-gray-700">
                Cognitive accessibility is universal design. Simple, clear interfaces help everyone, not just
                users with diagnosed disabilities. Design for the tired, stressed, distracted user.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cognitive Accessibility Principles */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Core Principles of Cognitive Accessibility</h2>

        <div className="space-y-6">
          {/* Clear Language */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">📝</div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">1. Clear, Simple Language</h3>
                <p className="text-gray-700">
                  Use plain language at 8th grade reading level or below. Avoid jargon, complex sentences, and idioms.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border-2 border-red-300">
                <p className="font-mono text-sm text-red-700 mb-2">❌ Complex:</p>
                <p className="text-gray-700 text-sm italic">
                  "Leverage our cutting-edge solutions to synergize your workflow and maximize ROI."
                </p>
              </div>
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <p className="font-mono text-sm text-green-700 mb-2">✅ Clear:</p>
                <p className="text-gray-700 text-sm">
                  "Use our tools to work faster and save money."
                </p>
              </div>
            </div>
          </div>

          {/* Consistent Layout */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">🎨</div>
              <div>
                <h3 className="text-2xl font-bold text-purple-900 mb-2">2. Consistent Layout & Navigation</h3>
                <p className="text-gray-700">
                  Keep navigation in the same place, use consistent terminology, maintain predictable patterns.
                  Users shouldn't have to relearn the interface on each page.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">Best practices:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Navigation always in same location (top or side)</li>
                <li>✓ Logo always links to homepage</li>
                <li>✓ Buttons use consistent labels ("Save", not "Save" on one page and "Submit" on another)</li>
                <li>✓ Icons have consistent meaning throughout site</li>
              </ul>
            </div>
          </div>

          {/* Reduce Cognitive Load */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 border-2 border-green-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">🧠</div>
              <div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">3. Reduce Cognitive Load</h3>
                <p className="text-gray-700">
                  Don't make users remember information or perform mental calculations. Minimize the number
                  of decisions required.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">Strategies:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Break complex tasks into simple steps</li>
                <li>✓ Provide defaults and suggestions</li>
                <li>✓ Show calculations instead of asking user to compute</li>
                <li>✓ Use recognition over recall (show options vs free-form input)</li>
                <li>✓ One primary action per page when possible</li>
              </ul>
            </div>
          </div>

          {/* Visual Hierarchy */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border-2 border-orange-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">📐</div>
              <div>
                <h3 className="text-2xl font-bold text-orange-900 mb-2">4. Clear Visual Hierarchy</h3>
                <p className="text-gray-700">
                  Make the most important information stand out. Use headings, white space, and visual
                  emphasis to guide attention.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">Techniques:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Proper heading hierarchy (h1, h2, h3)</li>
                <li>✓ Generous white space (don't cram content)</li>
                <li>✓ Highlight important actions (primary button style)</li>
                <li>✓ Group related items together</li>
                <li>✓ Limit choices (7±2 rule: present 5-9 options max)</li>
              </ul>
            </div>
          </div>

          {/* Error Prevention & Recovery */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8 border-2 border-red-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">🛡️</div>
              <div>
                <h3 className="text-2xl font-bold text-red-900 mb-2">5. Error Prevention & Easy Recovery</h3>
                <p className="text-gray-700">
                  Prevent errors when possible. When they occur, explain clearly and help users fix them.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">Best practices:</p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Forgiving input validation ("415-555-1234" and "4155551234" both accepted)</li>
                <li>✓ Confirm destructive actions ("Are you sure you want to delete?")</li>
                <li>✓ Allow undo for important actions</li>
                <li>✓ Clear error messages with specific solutions ("Email must include @")</li>
                <li>✓ Inline validation (show errors immediately, not after submit)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Common Barriers */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Cognitive Barriers in Web Interfaces</h2>

        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">1. Complex, Jargon-Heavy Language</h3>
            <p className="text-gray-700 mb-3">
              Technical terms, idioms, or unnecessarily complex sentences exclude users with reading difficulties.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded">
                <p className="font-medium text-red-700 mb-2">❌ Complex examples:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>"Utilize" → Use</li>
                  <li>"In the event that" → If</li>
                  <li>"Subsequent to" → After</li>
                  <li>"In close proximity to" → Near</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded">
                <p className="font-medium text-green-700 mb-2">✅ Tools to help:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Hemingway Editor (readability)</li>
                  <li>Flesch-Kincaid Grade Level</li>
                  <li>Plain language guidelines</li>
                  <li>Test with actual users</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">2. Distracting Animations & Auto-Play</h3>
            <p className="text-gray-700 mb-3">
              Movement draws attention away from content. Particularly problematic for ADHD, autism, or anyone trying to focus.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-gray-900 mb-2">Solutions:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Respect <code className="bg-gray-200 px-1 rounded">prefers-reduced-motion</code> media query</li>
                <li>✓ No auto-play videos with sound</li>
                <li>✓ Provide pause/stop controls for animations</li>
                <li>✓ Limit movement in peripheral vision</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">3. Unclear Navigation & Inconsistent Design</h3>
            <p className="text-gray-700 mb-3">
              Navigation that changes location, disappears, or uses unfamiliar patterns forces users to relearn the interface.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-gray-900 mb-2">WCAG 3.2.3 & 3.2.4:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Navigation must be in consistent order across pages</li>
                <li>✓ Components with same functionality must be identified consistently</li>
                <li>✓ Breadcrumbs help users track location</li>
                <li>✓ Current page clearly indicated in navigation</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">4. Long, Complex Forms Without Help</h3>
            <p className="text-gray-700 mb-3">
              Multi-field forms with unclear requirements, no examples, and cryptic error messages.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-green-900 mb-2">Better approaches:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Break into multiple steps with progress indicator</li>
                <li>✓ Provide examples for each field ("555-123-4567")</li>
                <li>✓ Show requirements upfront ("Password must be 8+ characters")</li>
                <li>✓ Inline help text that's always visible</li>
                <li>✓ Save progress automatically</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">5. Aggressive Timeouts</h3>
            <p className="text-gray-700 mb-3">
              Session expires without warning, losing user's work. Particularly frustrating for users who work slowly.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-green-900 mb-2">WCAG 2.2.1 Requirements:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Warn before timeout with option to extend (20 seconds warning minimum)</li>
                <li>✓ Save data automatically so nothing is lost</li>
                <li>✓ Allow at least 20 hours for time limits (or no limit)</li>
                <li>✓ Provide option to turn off time limit</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Checklist */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-300">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Developer Checklist: Supporting Cognitive Disabilities</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Simple, clear language:</strong> 8th grade reading level, avoid jargon and idioms
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Consistent navigation:</strong> Same location and order across all pages
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Clear visual hierarchy:</strong> Proper headings, white space, emphasis on important content
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Minimize distractions:</strong> No auto-play, respect prefers-reduced-motion
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Break complex tasks into steps:</strong> Multi-step forms with progress indicators
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Provide help and examples:</strong> Inline help text, field format examples
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Clear error messages:</strong> Explain what went wrong and how to fix it
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>No flashing content:</strong> Nothing flashes 3+ times per second (WCAG 2.3.1)
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Generous timeouts:</strong> Warn before expiring, allow extension, save progress
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
              <span>Cognitive disabilities are diverse and common—design for clarity benefits everyone</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Simple language, consistent patterns, and clear hierarchy are foundational</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Reduce cognitive load by breaking tasks into steps and providing help</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Minimize distractions and respect user preferences for reduced motion</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Cognitive accessibility is universal design—everyone benefits from clarity</span>
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
            <a href="/learn/developers/modules/speech-disabilities" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 6: Speech Disabilities
            </a>
            <a href="/learn/developers/modules/understandable-principle" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 16: WCAG Understandable Principle (cognitive-focused guidelines)
            </a>
            <a href="/learn/developers/modules/animations-and-motion" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 37: Animations and Motion (prefers-reduced-motion)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
