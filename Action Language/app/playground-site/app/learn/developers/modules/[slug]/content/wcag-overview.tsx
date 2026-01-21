export default function WCAGOverview() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* What You'll Learn */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-12 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mt-0 mb-4">What You'll Learn</h2>
        <ul className="list-disc list-outside ml-6 space-y-2 mb-0 text-blue-900">
          <li>What WCAG is and why it exists</li>
          <li>The four POUR principles: Perceivable, Operable, Understandable, Robust</li>
          <li>Three conformance levels: A, AA, AAA</li>
          <li>How success criteria are structured and numbered</li>
          <li>The difference between guidelines and success criteria</li>
          <li>How to read and interpret WCAG documentation</li>
        </ul>
      </section>

      {/* Why This Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why This Matters</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          WCAG (Web Content Accessibility Guidelines) is the <strong>global standard</strong> for web accessibility.
          Understanding WCAG is critical because:
        </p>
        <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700 mb-4">
          <li>WCAG is <strong>legally required</strong> in many countries (ADA, Section 508, European Accessibility Act)</li>
          <li>WCAG 2.1 Level AA is the <strong>most common baseline</strong> for compliance</li>
          <li>Understanding WCAG structure helps you find and apply the right criteria</li>
          <li>WCAG provides testable, objective criteria (not just best practices)</li>
          <li>Certification exams (CPACC, WAS, CPWA) test WCAG knowledge extensively</li>
        </ul>
        <p className="text-lg text-gray-700 leading-relaxed">
          This module gives you the foundation to navigate WCAG confidently.
        </p>
      </section>

      {/* What is WCAG */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What is WCAG?</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          <strong>WCAG (Web Content Accessibility Guidelines)</strong> is a set of technical standards developed by
          the W3C (World Wide Web Consortium) to make web content accessible to people with disabilities.
        </p>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">WCAG Versions</h3>
          <dl className="space-y-4">
            <div>
              <dt className="font-bold text-gray-900 mb-1">WCAG 1.0 (1999)</dt>
              <dd className="text-gray-700 ml-4">First version. Now obsolete. Not widely adopted.</dd>
            </div>
            <div>
              <dt className="font-bold text-gray-900 mb-1">WCAG 2.0 (2008)</dt>
              <dd className="text-gray-700 ml-4">
                Major rewrite. Introduced POUR principles. Still referenced in some laws. 12 guidelines, 61 success criteria.
              </dd>
            </div>
            <div>
              <dt className="font-bold text-gray-900 mb-1">WCAG 2.1 (2018)</dt>
              <dd className="text-gray-700 ml-4">
                Added 17 new criteria focused on mobile, low vision, and cognitive accessibility. 13 guidelines, 78 success criteria.
                <strong> Most widely adopted version.</strong>
              </dd>
            </div>
            <div>
              <dt className="font-bold text-gray-900 mb-1">WCAG 2.2 (2023) ← Current</dt>
              <dd className="text-gray-700 ml-4">
                Added 9 new criteria (cognitive, mobile). Removed 1 criterion (4.1.1). 13 guidelines, 86 success criteria.
                <strong> Latest stable version.</strong>
              </dd>
            </div>
            <div>
              <dt className="font-bold text-gray-900 mb-1">WCAG 3.0 (Draft)</dt>
              <dd className="text-gray-700 ml-4">
                Complete rewrite. Not yet final. Will eventually replace WCAG 2.x, but not for several years.
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6">
          <h4 className="text-lg font-bold text-blue-900 mb-2">Which version should I follow?</h4>
          <p className="text-gray-700 mb-2">
            <strong>WCAG 2.1 Level AA</strong> is the most common legal requirement (ADA, Section 508, EN 301 549).
          </p>
          <p className="text-gray-700 mb-0">
            <strong>WCAG 2.2 Level AA</strong> is the current best practice. All WCAG 2.1 criteria are included in 2.2,
            so meeting 2.2 automatically meets 2.1.
          </p>
        </div>
      </section>

      {/* The Four POUR Principles */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">The Four POUR Principles</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          WCAG is organized around four high-level principles. All content must be:
        </p>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-900 mb-3">1. Perceivable</h3>
            <p className="text-gray-700 mb-3">
              <strong>Information and user interface components must be presentable to users in ways they can perceive.</strong>
            </p>
            <p className="text-gray-700 mb-3">
              <strong>In plain language:</strong> Users must be able to see or hear content. If they can&apos;t see it, provide
              audio. If they can&apos;t hear it, provide captions. If they can&apos;t see or hear it, provide text alternatives
              for screen readers and Braille displays.
            </p>
            <h4 className="font-bold text-green-900 mb-2">Guidelines (4 total):</h4>
            <ul className="list-disc list-outside ml-6 space-y-1 text-gray-700">
              <li>1.1 Text Alternatives</li>
              <li>1.2 Time-based Media (audio, video)</li>
              <li>1.3 Adaptable (structure, relationships, sequence)</li>
              <li>1.4 Distinguishable (color contrast, audio control, text spacing)</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-3">2. Operable</h3>
            <p className="text-gray-700 mb-3">
              <strong>User interface components and navigation must be operable.</strong>
            </p>
            <p className="text-gray-700 mb-3">
              <strong>In plain language:</strong> All functionality must work with a keyboard. Users need enough time to
              read and interact. Don&apos;t cause seizures with flashing content. Help users navigate and find content.
            </p>
            <h4 className="font-bold text-blue-900 mb-2">Guidelines (5 total):</h4>
            <ul className="list-disc list-outside ml-6 space-y-1 text-gray-700">
              <li>2.1 Keyboard Accessible</li>
              <li>2.2 Enough Time</li>
              <li>2.3 Seizures and Physical Reactions</li>
              <li>2.4 Navigable</li>
              <li>2.5 Input Modalities (touch, pointer, voice)</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-900 mb-3">3. Understandable</h3>
            <p className="text-gray-700 mb-3">
              <strong>Information and the operation of user interface must be understandable.</strong>
            </p>
            <p className="text-gray-700 mb-3">
              <strong>In plain language:</strong> Text must be readable. Pages must behave predictably. Help users avoid
              and correct mistakes in forms.
            </p>
            <h4 className="font-bold text-purple-900 mb-2">Guidelines (3 total):</h4>
            <ul className="list-disc list-outside ml-6 space-y-1 text-gray-700">
              <li>3.1 Readable (language, pronunciation)</li>
              <li>3.2 Predictable (consistent navigation, no unexpected changes)</li>
              <li>3.3 Input Assistance (error identification, labels, prevention)</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-orange-900 mb-3">4. Robust</h3>
            <p className="text-gray-700 mb-3">
              <strong>Content must be robust enough to be interpreted reliably by a wide variety of user agents,
              including assistive technologies.</strong>
            </p>
            <p className="text-gray-700 mb-3">
              <strong>In plain language:</strong> Use valid HTML. Ensure your code works with current and future browsers,
              assistive technologies, and platforms.
            </p>
            <h4 className="font-bold text-orange-900 mb-2">Guidelines (1 total):</h4>
            <ul className="list-disc list-outside ml-6 space-y-1 text-gray-700">
              <li>4.1 Compatible (parsing, name/role/value for assistive tech)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Three Conformance Levels */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Three Conformance Levels</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Each success criterion is assigned a conformance level indicating its priority and impact:
        </p>

        <div className="space-y-6">
          <div className="bg-white border-2 border-red-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-900 mb-3">Level A (Minimum)</h3>
            <p className="text-gray-700 mb-3">
              <strong>Most basic requirements.</strong> If you fail Level A, some users cannot access content at all.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>31 criteria in WCAG 2.2</strong>
            </p>
            <h4 className="font-bold text-gray-900 mb-2">Examples:</h4>
            <ul className="list-disc list-outside ml-6 space-y-1 text-gray-700">
              <li>1.1.1: Provide text alternatives for images</li>
              <li>2.1.1: All functionality available via keyboard</li>
              <li>3.3.1: Identify input errors</li>
              <li>4.1.2: Name, role, value available to assistive tech</li>
            </ul>
          </div>

          <div className="bg-white border-2 border-yellow-400 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-900 mb-3">Level AA (Mid-range) ← Most Common Target</h3>
            <p className="text-gray-700 mb-3">
              <strong>Includes Level A + additional criteria.</strong> Removes significant barriers for many users.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>31 Level A + 25 Level AA = 56 total criteria in WCAG 2.2</strong>
            </p>
            <h4 className="font-bold text-gray-900 mb-2">Examples:</h4>
            <ul className="list-disc list-outside ml-6 space-y-1 text-gray-700">
              <li>1.4.3: Color contrast minimum (4.5:1 for text)</li>
              <li>1.4.5: Images of text (use real text when possible)</li>
              <li>2.4.7: Visible focus indicator</li>
              <li>3.2.4: Consistent identification across site</li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
              <p className="text-gray-800 font-semibold mb-0">
                ⚖️ Legal Standard: WCAG 2.1 Level AA is required by ADA, Section 508, and most accessibility laws worldwide.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-green-400 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-900 mb-3">Level AAA (Enhanced)</h3>
            <p className="text-gray-700 mb-3">
              <strong>Includes Level A + AA + additional criteria.</strong> Highest level of accessibility, but not always
              achievable for all content.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>31 Level A + 25 Level AA + 30 Level AAA = 86 total criteria in WCAG 2.2</strong>
            </p>
            <h4 className="font-bold text-gray-900 mb-2">Examples:</h4>
            <ul className="list-disc list-outside ml-6 space-y-1 text-gray-700">
              <li>1.4.6: Enhanced color contrast (7:1 for text)</li>
              <li>2.2.3: No timing (no time limits at all)</li>
              <li>2.4.8: Location (breadcrumbs, sitemap)</li>
              <li>3.1.5: Reading level (lower secondary education level)</li>
            </ul>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-4">
              <p className="text-gray-800 mb-0">
                <strong>Note:</strong> W3C acknowledges it&apos;s not possible to satisfy all Level AAA criteria for some content.
                Aim for AA, exceed with AAA where feasible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Structure of WCAG */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Structure of WCAG</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          WCAG is organized in a hierarchy from abstract principles to specific testable criteria:
        </p>

        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
          <pre className="text-sm font-mono overflow-x-auto">
{`Principle (4 total - POUR)
  ↓
Guideline (13 total - numbered 1.1 through 4.1)
  ↓
Success Criterion (86 total in WCAG 2.2 - numbered 1.1.1 through 4.1.3)
  ↓
Sufficient Techniques (multiple options to meet criterion)
  ↓
Advisory Techniques (go beyond requirement)
  ↓
Failures (common mistakes that violate criterion)`}
          </pre>
        </div>

        <div className="bg-white border-2 border-blue-300 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Example: Success Criterion 1.4.3</h3>

          <dl className="space-y-4">
            <div>
              <dt className="font-bold text-gray-900 mb-1">Number:</dt>
              <dd className="text-gray-700 ml-4">
                <strong>1.4.3</strong>
                <ul className="list-disc list-outside ml-6 mt-2">
                  <li><strong>1</strong> = Principle (Perceivable)</li>
                  <li><strong>4</strong> = Guideline (Distinguishable)</li>
                  <li><strong>3</strong> = Third criterion under this guideline</li>
                </ul>
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900 mb-1">Name:</dt>
              <dd className="text-gray-700 ml-4">Contrast (Minimum)</dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900 mb-1">Level:</dt>
              <dd className="text-gray-700 ml-4">AA</dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900 mb-1">Requirement:</dt>
              <dd className="text-gray-700 ml-4">
                The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for
                large text (3:1), incidental text, and logos.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900 mb-1">Sufficient Techniques:</dt>
              <dd className="text-gray-700 ml-4">
                <ul className="list-disc list-outside ml-6">
                  <li>G18: Ensuring that a contrast ratio of at least 4.5:1 exists</li>
                  <li>G145: Ensuring that a contrast ratio of at least 3:1 exists for large text</li>
                </ul>
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900 mb-1">Common Failures:</dt>
              <dd className="text-gray-700 ml-4">
                <ul className="list-disc list-outside ml-6">
                  <li>F24: Specifying foreground colors without background (or vice versa)</li>
                  <li>F83: Using background images that don&apos;t provide sufficient contrast</li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
          <h4 className="text-lg font-bold text-yellow-900 mb-2">Important: You Only Need to Meet the Criteria</h4>
          <p className="text-gray-700 mb-0">
            Success criteria are <strong>testable and objective</strong>. You don&apos;t have to follow every technique -
            just satisfy the criterion. Techniques are suggestions, not requirements. You can meet a criterion using a
            different technique, or even a method not documented by W3C.
          </p>
        </div>
      </section>

      {/* How to Read WCAG */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Read WCAG Documentation</h2>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Official WCAG Resources</h3>
          <dl className="space-y-4">
            <div>
              <dt className="font-bold text-gray-900 mb-1">1. WCAG 2.2 Specification (Normative)</dt>
              <dd className="text-gray-700 ml-4">
                <a href="https://www.w3.org/TR/WCAG22/" className="text-blue-700 underline hover:text-blue-900" target="_blank" rel="noopener noreferrer">
                  https://www.w3.org/TR/WCAG22/
                </a>
                <p className="mt-2">
                  The official standard. This is the authoritative source. Very technical, legally binding language.
                </p>
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900 mb-1">2. Understanding WCAG 2.2 (Non-normative)</dt>
              <dd className="text-gray-700 ml-4">
                <a href="https://www.w3.org/WAI/WCAG22/Understanding/" className="text-blue-700 underline hover:text-blue-900" target="_blank" rel="noopener noreferrer">
                  https://www.w3.org/WAI/WCAG22/Understanding/
                </a>
                <p className="mt-2">
                  <strong>Start here.</strong> Plain-language explanations, intent, examples, benefits. Much easier to read.
                </p>
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900 mb-1">3. Techniques for WCAG 2.2 (Non-normative)</dt>
              <dd className="text-gray-700 ml-4">
                <a href="https://www.w3.org/WAI/WCAG22/Techniques/" className="text-blue-700 underline hover:text-blue-900" target="_blank" rel="noopener noreferrer">
                  https://www.w3.org/WAI/WCAG22/Techniques/
                </a>
                <p className="mt-2">
                  How-to guides with code examples. Organized by technology (HTML, CSS, ARIA, JavaScript, PDF, etc.).
                </p>
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900 mb-1">4. How to Meet WCAG (Quick Reference)</dt>
              <dd className="text-gray-700 ml-4">
                <a href="https://www.w3.org/WAI/WCAG22/quickref/" className="text-blue-700 underline hover:text-blue-900" target="_blank" rel="noopener noreferrer">
                  https://www.w3.org/WAI/WCAG22/quickref/
                </a>
                <p className="mt-2">
                  Filterable checklist. Most practical tool for developers. Filter by level, guideline, or tags.
                </p>
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Reading Order</h3>
          <ol className="list-decimal list-outside ml-6 space-y-3 text-gray-700">
            <li>
              <strong>Start with &quot;How to Meet WCAG&quot; (Quick Reference)</strong>
              <p className="ml-0 mt-1">Get an overview of all criteria. Filter to Level A and AA.</p>
            </li>
            <li>
              <strong>For each criterion you need to implement, read &quot;Understanding&quot;</strong>
              <p className="ml-0 mt-1">Understand the intent, see examples, learn who it benefits.</p>
            </li>
            <li>
              <strong>Check &quot;Techniques&quot; for implementation guidance</strong>
              <p className="ml-0 mt-1">Find code examples and sufficient techniques.</p>
            </li>
            <li>
              <strong>Refer to the specification only when needed</strong>
              <p className="ml-0 mt-1">For legal interpretation or precise wording.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* Common Misconceptions */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Misconceptions About WCAG</h2>

        <div className="space-y-6">
          <div className="bg-red-50 border-l-4 border-red-600 p-6">
            <h4 className="text-lg font-bold text-red-900 mb-2">❌ Myth: WCAG is just for blind users</h4>
            <p className="text-gray-700 mb-0">
              <strong>Reality:</strong> WCAG addresses visual, auditory, motor, cognitive, speech, and seizure disabilities.
              It also helps users with temporary disabilities, older adults, and people using mobile devices.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6">
            <h4 className="text-lg font-bold text-red-900 mb-2">❌ Myth: WCAG is optional</h4>
            <p className="text-gray-700 mb-0">
              <strong>Reality:</strong> WCAG 2.1 Level AA is legally required for many organizations (government, education,
              large businesses) in the US, EU, Canada, Australia, and other countries.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6">
            <h4 className="text-lg font-bold text-red-900 mb-2">❌ Myth: You must follow all techniques</h4>
            <p className="text-gray-700 mb-0">
              <strong>Reality:</strong> Techniques are <strong>suggestions</strong>. You only need to satisfy the success
              criterion. Use any technique that works, even if it&apos;s not documented.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6">
            <h4 className="text-lg font-bold text-red-900 mb-2">❌ Myth: WCAG AAA is the goal</h4>
            <p className="text-gray-700 mb-0">
              <strong>Reality:</strong> W3C states it&apos;s impossible to meet all AAA criteria for some content.
              <strong> WCAG 2.1 Level AA is the standard target.</strong> Exceed to AAA where possible.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6">
            <h4 className="text-lg font-bold text-red-900 mb-2">❌ Myth: Automated tools can test WCAG compliance</h4>
            <p className="text-gray-700 mb-0">
              <strong>Reality:</strong> Automated tools catch ~30-40% of issues. Many criteria require <strong>manual testing</strong>
              (keyboard navigation, screen reader output, logical reading order, sufficient context).
            </p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Takeaways</h2>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
          <ul className="list-disc list-outside ml-6 space-y-3 text-gray-700">
            <li>
              <strong className="text-green-900">WCAG 2.2 is the current standard:</strong> 86 success criteria across 13 guidelines
            </li>
            <li>
              <strong className="text-green-900">Four POUR principles:</strong> Perceivable, Operable, Understandable, Robust
            </li>
            <li>
              <strong className="text-green-900">Three levels:</strong> A (minimum), AA (target), AAA (enhanced)
            </li>
            <li>
              <strong className="text-green-900">Level AA is the legal standard:</strong> Required by ADA, Section 508, and most laws
            </li>
            <li>
              <strong className="text-green-900">Success criteria are testable:</strong> Objective pass/fail, not subjective
            </li>
            <li>
              <strong className="text-green-900">Techniques are suggestions:</strong> You can meet criteria any way that works
            </li>
            <li>
              <strong className="text-green-900">Start with Understanding docs:</strong> Easier than reading the specification
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Next Steps</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Now that you understand WCAG structure:
        </p>
        <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700 mb-4">
          <li>Bookmark the <a href="https://www.w3.org/WAI/WCAG22/quickref/" className="text-blue-700 underline hover:text-blue-900" target="_blank" rel="noopener noreferrer">WCAG Quick Reference</a></li>
          <li>Browse through Level A and AA criteria to get familiar</li>
          <li>Explore the Understanding docs for criteria that interest you</li>
          <li>Practice identifying which principle and guideline a criterion belongs to</li>
        </ul>
        <p className="text-lg text-gray-700 leading-relaxed">
          Continue to <strong>Module 14: The Perceivable Principle</strong> to dive deep into the first POUR principle
          and learn all Perceivable success criteria.
        </p>
      </section>
    </div>
  );
}
