export default function SpeechDisabilities() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* What You'll Learn */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-12 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mt-0 mb-4">What You'll Learn</h2>
        <ul className="space-y-2 mb-0">
          <li>The spectrum of speech disabilities and communication challenges</li>
          <li>Why voice interfaces and voice authentication create barriers</li>
          <li>How to ensure voice-controlled systems don't exclude users</li>
          <li>Alternative communication methods and augmentative devices</li>
          <li>Developer responsibilities for speech-accessible design</li>
        </ul>
      </section>

      {/* Why This Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why This Matters</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          As voice interfaces become more common—from voice search to smart speakers to authentication systems—
          speech disabilities become increasingly relevant to web developers. While speech disabilities are less
          common than visual or motor disabilities, the rise of voice-only interfaces creates new barriers that
          developers must anticipate and address.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6">
          <p className="text-lg font-semibold text-yellow-900 mb-2">📊 By the Numbers</p>
          <ul className="space-y-2 text-gray-700 mb-0">
            <li><strong>7.5 million Americans</strong> have trouble using their voice</li>
            <li><strong>1 in 12 children</strong> has a voice, speech, or language disorder</li>
            <li><strong>6-8 million people</strong> in the US have some form of language impairment</li>
            <li><strong>1 million people</strong> in the US use augmentative and alternative communication (AAC)</li>
            <li><strong>Speech impairments often co-occur</strong> with other disabilities (cerebral palsy, autism, hearing loss)</li>
          </ul>
        </div>
      </section>

      {/* The Spectrum of Speech Disabilities */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Spectrum of Speech Disabilities</h2>
        <p className="text-lg text-gray-700 mb-6">
          Speech disabilities range from mild articulation difficulties to complete inability to produce speech.
        </p>

        <div className="space-y-6">
          {/* Articulation Disorders */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-2xl font-semibold text-blue-900 mb-3">1. Articulation Disorders</h3>
            <p className="text-gray-700 mb-4">
              Difficulty producing specific speech sounds correctly. Words may be unclear or hard to understand,
              but the person can speak.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="font-semibold text-blue-900 mb-2">Examples:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Substituting sounds (saying "wabbit" instead of "rabbit")</li>
                <li>Omitting sounds (saying "ca" instead of "cat")</li>
                <li>Distorting sounds (slurred or imprecise pronunciation)</li>
                <li>Lisp or difficulty with specific consonants</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Voice recognition may not understand unclear speech</li>
                <li>Provide text-based alternatives to voice commands</li>
                <li>Allow voice training/calibration in voice systems</li>
              </ul>
            </div>
          </div>

          {/* Fluency Disorders */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-2xl font-semibold text-purple-900 mb-3">2. Fluency Disorders (Stuttering)</h3>
            <p className="text-gray-700 mb-4">
              Disruptions in the flow of speech—repetitions, prolongations, or blocks. About 1% of adults stutter.
              Speech is clear but interrupted.
            </p>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="font-semibold text-purple-900 mb-2">Characteristics:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Repetition of sounds, syllables, or words ("b-b-b-ball")</li>
                <li>Prolongation of sounds ("sssssnake")</li>
                <li>Blocks where no sound comes out</li>
                <li>Secondary behaviors (eye blinking, tension)</li>
                <li>May worsen under stress or time pressure</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Voice recognition may time out during pauses</li>
                <li>Allow generous timeout periods for voice input</li>
                <li>Don't force voice-only authentication</li>
                <li>Provide text alternatives for all voice features</li>
              </ul>
            </div>
          </div>

          {/* Dysarthria */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-2xl font-semibold text-green-900 mb-3">3. Dysarthria</h3>
            <p className="text-gray-700 mb-4">
              Weakness or paralysis of speech muscles due to neurological conditions. Common after stroke,
              in cerebral palsy, Parkinson's disease, ALS, or brain injury.
            </p>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="font-semibold text-green-900 mb-2">Characteristics:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Slurred, slow, or effortful speech</li>
                <li>Weak, breathy, or hoarse voice quality</li>
                <li>Limited tongue, lip, or jaw movement</li>
                <li>Monotone pitch or abnormal rhythm</li>
                <li>May be mild (slightly unclear) to severe (unintelligible)</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-blue-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Voice recognition systems may fail entirely</li>
                <li>Always provide non-voice alternatives</li>
                <li>Text-based communication options essential</li>
                <li>Support AAC devices (see below)</li>
              </ul>
            </div>
          </div>

          {/* Apraxia of Speech */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <h3 className="text-2xl font-semibold text-orange-900 mb-3">4. Apraxia of Speech</h3>
            <p className="text-gray-700 mb-4">
              Brain difficulty planning and coordinating the movements for speech. The person knows what they
              want to say but has trouble coordinating the muscle movements. Can occur after stroke or brain injury.
            </p>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="font-semibold text-orange-900 mb-2">Characteristics:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Inconsistent errors (different each attempt)</li>
                <li>Groping or struggling to start words</li>
                <li>Aware of errors and frustrated by them</li>
                <li>May have better automatic speech (greetings, songs)</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Voice commands highly unreliable</li>
                <li>Text-based communication preferred</li>
                <li>Keyboard/touch interfaces essential</li>
              </ul>
            </div>
          </div>

          {/* Aphasia */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-2xl font-semibold text-red-900 mb-3">5. Aphasia (Language Impairment)</h3>
            <p className="text-gray-700 mb-4">
              Brain damage affecting language processing—understanding or producing language (spoken or written).
              Most commonly caused by stroke. Affects 2 million Americans.
            </p>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="font-semibold text-red-900 mb-2">Types:</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">Broca's Aphasia (Expressive):</p>
                  <p className="text-gray-700 text-sm">Difficulty producing speech, but comprehension relatively intact. Speech is effortful, limited, telegraphic.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Wernicke's Aphasia (Receptive):</p>
                  <p className="text-gray-700 text-sm">Fluent but meaningless speech. Difficulty understanding language. May not realize speech doesn't make sense.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Global Aphasia:</p>
                  <p className="text-gray-700 text-sm">Severe impairment in both production and comprehension.</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Simple, clear language helps comprehension (cognitive accessibility)</li>
                <li>Visual communication aids (icons, images)</li>
                <li>Text-to-speech for reading assistance</li>
                <li>May use AAC devices for communication</li>
              </ul>
            </div>
          </div>

          {/* Non-Verbal */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
            <h3 className="text-2xl font-semibold text-pink-900 mb-3">6. Non-Verbal</h3>
            <p className="text-gray-700 mb-4">
              Unable to produce functional speech. May be due to severe cerebral palsy, autism, brain injury,
              or congenital conditions. Often use augmentative and alternative communication (AAC) devices.
            </p>
            <div className="bg-pink-50 rounded-lg p-4">
              <p className="font-semibold text-pink-900 mb-2">Communication methods:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>AAC devices with speech output</li>
                <li>Sign language</li>
                <li>Picture/symbol boards</li>
                <li>Text-based communication (typing)</li>
                <li>Eye-tracking communication systems</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Voice interfaces completely inaccessible</li>
                <li>Must provide non-voice alternatives for ALL features</li>
                <li>Support text-based communication</li>
                <li>Ensure AAC devices can interact with your site</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Augmentative and Alternative Communication */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Augmentative & Alternative Communication (AAC)</h2>
        <p className="text-lg text-gray-700 mb-6">
          AAC includes methods and devices that supplement or replace speech for people with communication disabilities.
        </p>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-300">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Low-Tech AAC</h3>
              <ul className="space-y-1 text-gray-700">
                <li><strong>Picture/symbol boards:</strong> Point to images to communicate</li>
                <li><strong>Writing/typing:</strong> Pen and paper or keyboard</li>
                <li><strong>Sign language:</strong> Manual communication</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">High-Tech AAC Devices</h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <strong>Speech-generating devices (SGDs):</strong> Dedicated tablets with symbol-based or text-based input, synthesized speech output.
                  Examples: Tobii Dynavox, PRC AAC devices
                </li>
                <li>
                  <strong>iPad/tablet AAC apps:</strong> Proloquo2Go, TouchChat, LAMP Words for Life
                </li>
                <li>
                  <strong>Eye-tracking communication:</strong> For users who can't use hands, control device with eye gaze
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 mt-4">
              <p className="font-semibold text-blue-900 mb-2">👨‍💻 How AAC Users Interact with Web:</p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ AAC devices act as input devices (like keyboard or mouse)</li>
                <li>✓ User selects symbols/words on device, device types text or speaks</li>
                <li>✓ Requires same accessibility as keyboard-only users (proper focus management, no traps)</li>
                <li>✓ May be slow to type—generous timeouts essential</li>
                <li>✓ Benefits from word prediction and autocomplete</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Interface Problems */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem with Voice-Only Interfaces</h2>
        <p className="text-lg text-gray-700 mb-6">
          The rise of voice assistants (Alexa, Siri, Google Assistant) and voice authentication creates new
          accessibility barriers for users with speech disabilities.
        </p>

        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">1. Voice-Only Authentication</h3>
            <p className="text-gray-700 mb-3">
              Banks and services using voice biometrics for security. Excludes users who can't speak clearly or at all.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-green-900 mb-2">Solutions:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Always provide alternative authentication methods (password, PIN, SMS code)</li>
                <li>✓ Never make voice authentication the only option</li>
                <li>✓ Allow users to opt out of voice features</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">2. Voice-Controlled Smart Devices</h3>
            <p className="text-gray-700 mb-3">
              Smart speakers, home automation, in-car systems that require voice commands.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-green-900 mb-2">Solutions:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Provide companion app with touch/keyboard interface</li>
                <li>✓ Support voice AND physical controls (buttons, touch screens)</li>
                <li>✓ Allow scheduling/automation so commands aren't needed</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">3. Voice Search & Commands</h3>
            <p className="text-gray-700 mb-3">
              Websites with voice search or voice navigation features.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-green-900 mb-2">Solutions:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Voice should enhance, never replace, text-based input</li>
                <li>✓ Always provide traditional search box alongside voice search</li>
                <li>✓ All voice commands must have keyboard equivalents</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">4. Voice CAPTCHA</h3>
            <p className="text-gray-700 mb-3">
              Audio CAPTCHA as alternative to visual CAPTCHA, but assumes user can speak response.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-green-900 mb-2">Solutions:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Provide both audio (listening) and text-based CAPTCHA alternatives</li>
                <li>✓ Consider CAPTCHA alternatives entirely (reCAPTCHA v3, honeypots)</li>
                <li>✓ Never require speaking as the only option</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Guidelines */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-300">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Developer Guidelines for Speech Accessibility</h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Core Principle: Never Require Speech</h3>
              <p className="text-gray-700 mb-4">
                Voice features should always be optional enhancements, never requirements. Every voice feature
                must have a non-voice alternative.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                <p className="font-semibold text-blue-900 mb-2">WCAG 2.2 Success Criterion 1.4.2:</p>
                <p className="text-gray-700">
                  <strong>Audio Control (Level A):</strong> If audio plays automatically, provide mechanism to
                  pause, stop, or control volume independently.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Specific Recommendations</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-green-900">✓ Multiple Input Methods</p>
                  <p className="text-gray-700 text-sm">Support voice, keyboard, mouse, and touch equally. Don't privilege one over others.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-green-900">✓ Text Alternatives for Voice Commands</p>
                  <p className="text-gray-700 text-sm">Every "Say [command]" instruction should have "Or click [button]" alternative.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-green-900">✓ Generous Timeouts</p>
                  <p className="text-gray-700 text-sm">AAC users type slowly. Stuttering causes pauses. Allow time for input.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-green-900">✓ Clear Visual Feedback</p>
                  <p className="text-gray-700 text-sm">When voice command succeeds/fails, show visual confirmation (not just audio).</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-green-900">✓ Support Standard Input Methods</p>
                  <p className="text-gray-700 text-sm">AAC devices work like keyboards. Ensure keyboard accessibility = AAC accessibility.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Checklist */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-300">
          <h2 className="text-3xl font-bold text-purple-900 mb-6">Developer Checklist: Speech Accessibility</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Voice features are optional:</strong> All voice commands/input have non-voice alternatives
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>No voice-only authentication:</strong> Provide password, PIN, or other alternatives
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Keyboard accessibility:</strong> Full site functionality via keyboard (helps AAC users)
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Generous timeouts:</strong> Allow time for AAC typing and speech disfluencies
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Visual feedback:</strong> Show confirmation/errors visually, not just audio
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Text-based communication options:</strong> Contact forms, chat, email as alternatives to phone
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>CAPTCHA alternatives:</strong> Provide non-voice verification methods
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Test without speaking:</strong> Complete all tasks using only keyboard/mouse
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
              <span>Speech disabilities range from mild articulation issues to complete inability to speak</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Voice interfaces must always be optional, never required</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>AAC users rely on keyboard accessibility and generous timeouts</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Every voice command needs a non-voice alternative</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Speech accessibility benefits overlap with keyboard and cognitive accessibility</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <div className="bg-gray-100 rounded-xl p-8 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <p className="text-gray-700 mb-4">
            You've completed Domain 1! Continue with assistive technologies:
          </p>
          <div className="space-y-2">
            <a href="/learn/developers/modules/keyboard-and-pointing-devices" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 7: Keyboard & Pointing Devices
            </a>
            <a href="/learn/developers/modules/screen-readers-deep-dive" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 10: Screen Readers Deep Dive
            </a>
            <a href="/learn/developers/modules/wcag-overview" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 13: WCAG Overview (Start Domain 2)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
