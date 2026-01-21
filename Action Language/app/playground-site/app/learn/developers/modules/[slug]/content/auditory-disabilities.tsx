export default function AuditoryDisabilities() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* What You'll Learn */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-12 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mt-0 mb-4">What You'll Learn</h2>
        <ul className="space-y-2 mb-0">
          <li>The spectrum of auditory disabilities from hard of hearing to profoundly deaf</li>
          <li>Deaf culture and identity considerations</li>
          <li>Assistive technologies: captions, transcripts, sign language interpretation, hearing aids</li>
          <li>Common barriers in multimedia content and how to address them</li>
          <li>Developer responsibilities for audio accessibility</li>
        </ul>
      </section>

      {/* Why This Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why This Matters</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Auditory disabilities affect how users perceive and process sound-based content. With the rise of video
          content, podcasts, audio notifications, and voice interfaces, ensuring audio accessibility is more
          important than ever. Many developers overlook audio accessibility because they assume their sites don't
          have much audio content—but alerts, notifications, video tutorials, and even error sounds all require
          accessible alternatives.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6">
          <p className="text-lg font-semibold text-yellow-900 mb-2">📊 By the Numbers</p>
          <ul className="space-y-2 text-gray-700 mb-0">
            <li><strong>466 million people</strong> worldwide have disabling hearing loss (WHO, 2023)</li>
            <li><strong>34 million</strong> are children</li>
            <li><strong>70 million people</strong> are deaf and use sign language as primary communication</li>
            <li>In the US, <strong>15% of adults</strong> (37.5 million) report some trouble hearing</li>
            <li><strong>1 in 8 people</strong> aged 12+ has hearing loss in both ears</li>
          </ul>
        </div>
      </section>

      {/* The Spectrum of Auditory Disabilities */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Spectrum of Auditory Disabilities</h2>
        <p className="text-lg text-gray-700 mb-6">
          Auditory disabilities exist on a spectrum, and people's relationship with sound varies widely.
        </p>

        <div className="space-y-6">
          {/* Hard of Hearing */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-2xl font-semibold text-blue-900 mb-3">1. Hard of Hearing (Mild to Moderate)</h3>
            <p className="text-gray-700 mb-4">
              People with mild to moderate hearing loss. May use hearing aids, cochlear implants, or assistive
              listening devices. Often benefit from increased volume and reduced background noise.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="font-semibold text-blue-900 mb-2">Characteristics:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>May hear some sounds but miss details (especially high-frequency sounds)</li>
                <li>Difficulty understanding speech in noisy environments</li>
                <li>May rely on lip reading to supplement hearing</li>
                <li>Often identify as part of hearing community</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Provide volume controls and ability to pause/replay audio</li>
                <li>Captions benefit greatly (not just for deaf users)</li>
                <li>Clear audio without background music/noise</li>
                <li>Visual alternatives to audio alerts</li>
              </ul>
            </div>
          </div>

          {/* Deaf */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-2xl font-semibold text-purple-900 mb-3">2. Deaf (Severe to Profound)</h3>
            <p className="text-gray-700 mb-4">
              People who have little to no functional hearing. May be deaf from birth (prelingual) or became deaf
              later in life (postlingual). Many are part of Deaf culture and use sign language as their primary
              language.
            </p>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="font-semibold text-purple-900 mb-2">Important: Deaf Culture and Identity</p>
              <ul className="space-y-2 text-gray-700 mb-0">
                <li><strong>Capital "D" Deaf:</strong> Cultural identity, sign language is first language, part of Deaf community</li>
                <li><strong>Lowercase "d" deaf:</strong> Audiological condition, may not identify with Deaf culture</li>
                <li><strong>Language diversity:</strong> American Sign Language (ASL), British Sign Language (BSL), etc. are distinct languages with their own grammar</li>
                <li><strong>Written language:</strong> For many Deaf people, written English/Spanish/etc. is a second language after sign language</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Captions are essential, not optional</li>
                <li>Sign language interpretation for important content</li>
                <li>Visual indicators for all audio information</li>
                <li>Clear, simple language in captions (consider literacy levels)</li>
                <li>Never rely on audio-only alerts or instructions</li>
              </ul>
            </div>
          </div>

          {/* Deafblind */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-2xl font-semibold text-red-900 mb-3">3. Deafblind</h3>
            <p className="text-gray-700 mb-4">
              People with both significant vision and hearing loss. May use Braille displays, haptic feedback,
              or tactile sign language for communication.
            </p>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="font-semibold text-red-900 mb-2">Common causes:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li><strong>Usher syndrome:</strong> Genetic condition causing hearing loss and progressive vision loss</li>
                <li><strong>Age-related:</strong> Combination of age-related hearing and vision loss</li>
                <li><strong>CHARGE syndrome:</strong> Multiple birth defects including deafblindness</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Content must work with refreshable Braille displays</li>
                <li>Proper semantic HTML and ARIA for screen readers</li>
                <li>Transcripts of audio content (accessible via Braille)</li>
                <li>All visual content must have text alternatives</li>
              </ul>
            </div>
          </div>

          {/* Central Auditory Processing Disorder */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <h3 className="text-2xl font-semibold text-orange-900 mb-3">4. Central Auditory Processing Disorder (CAPD)</h3>
            <p className="text-gray-700 mb-4">
              Brain-based difficulty processing auditory information, even with normal hearing ability. Difficulty
              filtering out background noise, understanding rapid speech, or following verbal instructions.
            </p>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="font-semibold text-green-900 mb-2">👨‍💻 Developer Impact:</p>
              <ul className="space-y-1 text-gray-700 mb-0">
                <li>Clear, slow speech in narration</li>
                <li>Captions help process information visually</li>
                <li>Eliminate background music during narration</li>
                <li>Provide transcripts for review at user's pace</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Assistive Technologies */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Assistive Technologies for Auditory Disabilities</h2>

        <div className="space-y-6">
          {/* Captions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">📝</div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Captions (Subtitles)</h3>
                <p className="text-gray-700">
                  Text overlay on video synchronized with the audio. <strong>Captions</strong> include dialogue
                  plus sound effects (door slam, [music playing]). <strong>Subtitles</strong> typically only
                  include dialogue and assume the viewer can hear sound effects.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-4">
              <p className="font-semibold text-gray-900 mb-3">Types of Captions:</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">Closed Captions (CC):</p>
                  <p className="text-gray-700 text-sm">Can be turned on/off by user. Most common on web video.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Open Captions:</p>
                  <p className="text-gray-700 text-sm">Burned into video, always visible. Used when player doesn't support CC.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Automatic (Auto-generated) Captions:</p>
                  <p className="text-gray-700 text-sm">Created by speech recognition (YouTube, Zoom). Often inaccurate, should be reviewed and corrected.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 border-l-4 border-blue-600 p-4">
              <p className="font-semibold text-blue-900 mb-2">Caption Quality Requirements:</p>
              <ul className="space-y-2 text-gray-700 mb-0">
                <li>✓ <strong>Accurate:</strong> Match spoken words exactly</li>
                <li>✓ <strong>Synchronized:</strong> Appear at same time as audio</li>
                <li>✓ <strong>Complete:</strong> Include all dialogue and relevant sounds</li>
                <li>✓ <strong>Speaker identification:</strong> Indicate who is speaking when relevant</li>
                <li>✓ <strong>Sound effects:</strong> [door slams], [phone ringing], [suspenseful music]</li>
                <li>✓ <strong>Readable:</strong> Adequate font size, contrast, and display duration</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="font-semibold text-yellow-900 mb-2">👨‍💻 Implementation (HTML5 Video):</p>
              <div className="bg-white rounded p-3 mt-2">
                <code className="block text-sm font-mono whitespace-pre">
{`<video controls>
  <source src="video.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="captions-en.vtt"
    srclang="en"
    label="English"
    default
  />
  <track
    kind="captions"
    src="captions-es.vtt"
    srclang="es"
    label="Español"
  />
</video>`}
                </code>
              </div>
              <p className="text-sm text-gray-700 mt-3">
                <strong>WebVTT format:</strong> Standard caption file format for web video. Must be served with
                proper CORS headers.
              </p>
            </div>
          </div>

          {/* Transcripts */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">📄</div>
              <div>
                <h3 className="text-2xl font-bold text-purple-900 mb-2">Transcripts</h3>
                <p className="text-gray-700">
                  Full text version of audio or video content. More than just captions—includes descriptions of
                  visual elements and can be read at the user's own pace.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-4">
              <p className="font-semibold text-gray-900 mb-3">Benefits of Transcripts:</p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Searchable and indexable (SEO benefits)</li>
                <li>✓ Can be translated into other languages</li>
                <li>✓ Accessible to Braille display users</li>
                <li>✓ Can be read at user's own pace</li>
                <li>✓ Benefits users with cognitive disabilities</li>
                <li>✓ Useful in quiet environments (libraries, public spaces)</li>
              </ul>
            </div>

            <div className="bg-blue-100 border-l-4 border-blue-600 p-4">
              <p className="font-semibold text-blue-900 mb-2">👨‍💻 Implementation Best Practices:</p>
              <ul className="space-y-2 text-gray-700 mb-0">
                <li>Provide link to transcript near the media player</li>
                <li>Use semantic HTML headings for transcript sections</li>
                <li>Include timestamps to sync with video</li>
                <li>Describe relevant visual information</li>
                <li>Make transcripts downloadable (PDF, TXT)</li>
              </ul>
            </div>
          </div>

          {/* Sign Language Interpretation */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 border-2 border-green-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">🤟</div>
              <div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Sign Language Interpretation</h3>
                <p className="text-gray-700">
                  Video of a sign language interpreter translating spoken content. Preferred by many Deaf users
                  as sign language is their primary language (written language may be second language).
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-4">
              <p className="font-semibold text-gray-900 mb-3">When to Provide Sign Language:</p>
              <ul className="space-y-2 text-gray-700">
                <li><strong>WCAG AAA requirement</strong> for prerecorded audio-video content</li>
                <li>Important public service announcements</li>
                <li>Educational content</li>
                <li>Legal or safety information</li>
                <li>Content targeting Deaf community</li>
              </ul>
            </div>

            <div className="bg-blue-100 border-l-4 border-blue-600 p-4">
              <p className="font-semibold text-blue-900 mb-2">👨‍💻 Implementation:</p>
              <ul className="space-y-2 text-gray-700 mb-0">
                <li>Picture-in-picture video window with interpreter</li>
                <li>Interpreter visible throughout presentation</li>
                <li>Adequate size and video quality</li>
                <li>Good lighting and contrast</li>
                <li>Specify which sign language (ASL, BSL, etc.)</li>
              </ul>
            </div>
          </div>

          {/* Hearing Aids & Cochlear Implants */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border-2 border-orange-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">🦻</div>
              <div>
                <h3 className="text-2xl font-bold text-orange-900 mb-2">Hearing Aids & Cochlear Implants</h3>
                <p className="text-gray-700">
                  Devices that amplify or translate sound. Hearing aids amplify sound; cochlear implants bypass
                  damaged parts of the ear to directly stimulate the auditory nerve.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <p className="font-semibold text-gray-900 mb-3">Developer Impact:</p>
              <p className="text-gray-700 mb-3">
                These are hardware devices used by users—developers can't directly interact with them. However:
              </p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ High-quality audio benefits hearing aid users</li>
                <li>✓ Clear speech without background noise</li>
                <li>✓ Volume controls essential</li>
                <li>✓ Captions still needed (devices don't work perfectly)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Common Barriers */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Barriers for Users with Auditory Disabilities</h2>

        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">1. Video Without Captions</h3>
            <p className="text-gray-700 mb-3">
              The most common and severe barrier. Users cannot access audio information.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border-2 border-red-300">
                <p className="font-mono text-sm text-red-700 mb-1">❌ BAD:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm">
                  &lt;video src="tutorial.mp4" controls&gt;&lt;/video&gt;
                </code>
                <p className="text-sm text-gray-600 mt-2">No captions, audio content inaccessible</p>
              </div>
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <p className="font-mono text-sm text-green-700 mb-1">✅ GOOD:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm whitespace-pre">
{`<video controls>
  <source src="tutorial.mp4" />
  <track kind="captions"
    src="captions.vtt" default />
</video>`}
                </code>
                <p className="text-sm text-gray-600 mt-2">Captions provided via WebVTT</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">2. Auto-Play Audio/Video</h3>
            <p className="text-gray-700 mb-3">
              Starts playing automatically, surprising users and interfering with screen readers.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border-2 border-red-300">
                <p className="font-mono text-sm text-red-700 mb-1">❌ BAD:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm">
                  &lt;video src="ad.mp4" autoplay&gt;
                </code>
                <p className="text-sm text-gray-600 mt-2">Auto-plays, disrupts experience</p>
              </div>
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <p className="font-mono text-sm text-green-700 mb-1">✅ GOOD:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm">
                  &lt;video src="ad.mp4" controls&gt;
                </code>
                <p className="text-sm text-gray-600 mt-2">User initiates playback</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">3. Audio-Only Alerts and Instructions</h3>
            <p className="text-gray-700 mb-3">
              Error sounds, notification chimes, or verbal instructions without visual alternatives.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-gray-900 mb-2">Examples of barriers:</p>
              <ul className="space-y-2 text-gray-700">
                <li>❌ Error beep without visual error message</li>
                <li>❌ "You've got mail" audio notification without visual indicator</li>
                <li>❌ Voice-only CAPTCHA</li>
                <li>❌ Audio tutorials without transcript</li>
              </ul>
              <p className="font-semibold text-green-900 mt-4 mb-2">Solutions:</p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Visual toast notifications for alerts</li>
                <li>✓ Badge counters or icons for new messages</li>
                <li>✓ Alternative CAPTCHA methods</li>
                <li>✓ Text transcripts alongside audio</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">4. Poor Quality Captions</h3>
            <p className="text-gray-700 mb-3">
              Auto-generated captions with errors, missing sound effects, or poor synchronization.
            </p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-gray-900 mb-2">Caption quality issues:</p>
              <ul className="space-y-1 text-gray-700">
                <li>❌ Incorrect words ("their" → "there", technical jargon misspelled)</li>
                <li>❌ Missing speaker identification in multi-person conversations</li>
                <li>❌ No sound effect descriptions [door slams]</li>
                <li>❌ Captions appear too fast or too slow</li>
                <li>❌ Low contrast text hard to read</li>
              </ul>
              <p className="font-semibold text-green-900 mt-4 mb-2">Best practices:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Human review of auto-generated captions</li>
                <li>✓ Professional captioning services for important content</li>
                <li>✓ Test captions with muted audio</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">5. Lack of Visual Focus Indicators</h3>
            <p className="text-gray-700 mb-3">
              Deaf users rely heavily on visual cues. Missing focus indicators make keyboard navigation impossible.
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
{`button:focus {
  outline: 3px solid blue;
  outline-offset: 2px;
}`}
                </code>
                <p className="text-sm text-gray-600 mt-2">Clear focus indicator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Checklist */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-300">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Developer Checklist: Supporting Auditory Disabilities</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>All videos have captions:</strong> Accurate, synchronized, complete with sound effects and speaker identification
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Provide transcripts:</strong> Full text versions of audio/video content available near media player
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>No auto-play:</strong> Users control when media plays, or at minimum auto-play is muted
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Visual alternatives to audio alerts:</strong> Toast notifications, visual indicators, error messages on screen
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Media player controls are keyboard accessible:</strong> Play, pause, volume, captions toggle all work with keyboard
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Caption quality reviewed:</strong> Auto-generated captions corrected by humans
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>WebVTT caption files:</strong> Proper format with CORS headers configured
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Consider sign language:</strong> For important content, educational material, or AAA compliance
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Test with muted audio:</strong> Ensure all content is understandable without sound
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* WCAG Guidelines */}
      <section className="mb-12">
        <div className="bg-gray-100 rounded-xl p-8 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">WCAG 2.2 Guidelines for Audio Content</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">1.2.2 Captions (Prerecorded) - Level A</p>
              <p className="text-gray-700">Captions are provided for all prerecorded audio content in synchronized media.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">1.2.4 Captions (Live) - Level AA</p>
              <p className="text-gray-700">Captions are provided for all live audio content in synchronized media.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">1.2.8 Media Alternative (Prerecorded) - Level AAA</p>
              <p className="text-gray-700">An alternative for time-based media is provided for all prerecorded synchronized media.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">1.4.2 Audio Control - Level A</p>
              <p className="text-gray-700">If audio plays automatically for more than 3 seconds, a mechanism is available to pause/stop it or control volume.</p>
            </div>
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
              <span>Auditory disabilities range from hard of hearing to profound deafness, including Deaf cultural identity</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Captions and transcripts are essential, not optional features</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Never rely on audio-only information—always provide visual alternatives</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Caption quality matters: accurate, synchronized, complete with sound effects</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Testing with muted audio reveals accessibility barriers</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <div className="bg-gray-100 rounded-xl p-8 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <p className="text-gray-700 mb-4">
            Continue your learning journey with related modules:
          </p>
          <div className="space-y-2">
            <a href="/learn/developers/modules/motor-disabilities" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 4: Motor Disabilities
            </a>
            <a href="/learn/developers/modules/video-accessibility" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 34: Video Accessibility (hands-on captioning)
            </a>
            <a href="/learn/developers/modules/perceivable-principle" className="block text-blue-700 hover:text-blue-900 font-medium">
              → Module 14: WCAG Perceivable Principle (includes audio guidelines)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
