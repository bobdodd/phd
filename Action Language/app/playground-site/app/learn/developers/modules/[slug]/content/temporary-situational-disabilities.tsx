export default function TemporaryAndSituationalDisabilities() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
        <h2 className="text-2xl font-bold text-blue-900 mt-0 mb-4">What You'll Learn</h2>
        <ul className="text-blue-800 space-y-2 mb-0">
          <li>How temporary injuries create short-term accessibility needs</li>
          <li>Situational disabilities caused by environment and context</li>
          <li>Equipment limitations that affect interaction</li>
          <li>Why accessible design benefits everyone, not just people with permanent disabilities</li>
          <li>The Persona Spectrum concept for understanding universal design</li>
        </ul>
      </div>

      <h2>Why This Matters</h2>
      <p>
        When people hear "disability," they often think of permanent conditions. But accessibility needs are far more universal:
      </p>
      <ul>
        <li><strong>Temporary:</strong> A broken arm makes you one-handed for weeks</li>
        <li><strong>Situational:</strong> Bright sunlight makes your screen hard to read</li>
        <li><strong>Equipment-based:</strong> A slow internet connection affects media access</li>
      </ul>
      <p>
        Microsoft's Inclusive Design toolkit estimates that temporary and situational disabilities affect{' '}
        <strong>billions of people daily</strong>. By designing for permanent disabilities, you automatically
        make your product better for everyone.
      </p>

      <h2>The Persona Spectrum</h2>
      <p>
        Microsoft's Persona Spectrum illustrates how disability exists on a continuum:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left pb-2">Type</th>
              <th className="text-left pb-2">Permanent</th>
              <th className="text-left pb-2">Temporary</th>
              <th className="text-left pb-2">Situational</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-semibold">Touch</td>
              <td className="py-3">One arm (amputation)</td>
              <td className="py-3">Arm injury (cast/sling)</td>
              <td className="py-3">New parent (holding baby)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-semibold">See</td>
              <td className="py-3">Blind</td>
              <td className="py-3">Cataract surgery</td>
              <td className="py-3">Distracted driver, bright sun</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-semibold">Hear</td>
              <td className="py-3">Deaf</td>
              <td className="py-3">Ear infection</td>
              <td className="py-3">Noisy environment, bartender</td>
            </tr>
            <tr>
              <td className="py-3 font-semibold">Speak</td>
              <td className="py-3">Non-verbal</td>
              <td className="py-3">Laryngitis</td>
              <td className="py-3">Heavy accent, foreign language</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Temporary Disabilities</h2>
      <p>
        Temporary disabilities are short-term conditions caused by injury, illness, or medical procedures:
      </p>

      <h3>Common Examples</h3>
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">🤕 Broken Arm/Hand</h4>
          <ul className="mb-0">
            <li>Duration: 6-12 weeks</li>
            <li>Impact: One-handed operation, limited fine motor control</li>
            <li>Needs: Keyboard shortcuts, large click targets, voice input</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">👁️ Eye Surgery</h4>
          <ul className="mb-0">
            <li>Duration: Days to weeks (LASIK, cataract surgery)</li>
            <li>Impact: Blurred vision, light sensitivity, reduced contrast perception</li>
            <li>Needs: Screen reader support, high contrast, large text</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">🤒 Ear Infection</h4>
          <ul className="mb-0">
            <li>Duration: 1-2 weeks</li>
            <li>Impact: Temporary hearing loss, muffled audio</li>
            <li>Needs: Captions, visual alerts, text alternatives to audio</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">🏥 Post-Surgery Recovery</h4>
          <ul className="mb-0">
            <li>Duration: Varies (days to months)</li>
            <li>Impact: Pain medication causing cognitive fog, limited mobility</li>
            <li>Needs: Clear instructions, forgiving UI, simple navigation</li>
          </ul>
        </div>
      </div>

      <h2>Situational Disabilities</h2>
      <p>
        Situational disabilities arise from the environment or context of use:
      </p>

      <h3>Environmental Factors</h3>
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">☀️ Bright Sunlight</h4>
          <p>Using a phone outdoors washes out the screen, making text and controls hard to see.</p>
          <p className="mb-0"><strong>Solution:</strong> High contrast modes, large text, tactile feedback</p>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">🎵 Noisy Environment</h4>
          <p>In a crowded restaurant or subway, audio cues are useless.</p>
          <p className="mb-0"><strong>Solution:</strong> Visual notifications, captions, haptic feedback</p>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">🤫 Quiet Environment</h4>
          <p>In a library or meeting, you can't use voice commands or play audio.</p>
          <p className="mb-0"><strong>Solution:</strong> Silent interaction modes, captions</p>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">🚗 Driving</h4>
          <p>Driver can't look at screen or use hands for interaction.</p>
          <p className="mb-0"><strong>Solution:</strong> Voice control, audio feedback, simple interactions</p>
        </div>
      </div>

      <h3>Contextual Factors</h3>
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">👶 Holding a Baby</h4>
          <p>New parents often operate devices one-handed while holding their child.</p>
          <p className="mb-0"><strong>Solution:</strong> One-handed operation, gesture controls, voice commands</p>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">🛍️ Carrying Packages</h4>
          <p>Both hands full makes phone interaction difficult.</p>
          <p className="mb-0"><strong>Solution:</strong> Voice activation, large touch targets, simple gestures</p>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">🧤 Wearing Gloves</h4>
          <p>Winter gloves or work gloves reduce touch precision.</p>
          <p className="mb-0"><strong>Solution:</strong> Large buttons, voice control, simplified navigation</p>
        </div>
      </div>

      <h2>Equipment-Based Limitations</h2>
      <p>
        Technology limitations can create temporary accessibility barriers:
      </p>

      <h3>Device Constraints</h3>
      <div className="bg-gray-50 p-6 rounded-lg my-6">
        <ul className="space-y-3 mb-0">
          <li>
            <strong>Slow Internet:</strong> 2G/3G connections make video and heavy images inaccessible
            <br />
            <span className="text-sm text-gray-600">Solution: Provide text alternatives, optimize loading</span>
          </li>
          <li>
            <strong>Old Hardware:</strong> Older phones/computers struggle with resource-heavy sites
            <br />
            <span className="text-sm text-gray-600">Solution: Progressive enhancement, performance optimization</span>
          </li>
          <li>
            <strong>Low Battery:</strong> Power-saving mode disables features like auto-brightness
            <br />
            <span className="text-sm text-gray-600">Solution: Efficient code, manual controls</span>
          </li>
          <li>
            <strong>Broken Screen:</strong> Cracked screen makes precise taps difficult
            <br />
            <span className="text-sm text-gray-600">Solution: Large touch targets, keyboard navigation</span>
          </li>
          <li>
            <strong>No Audio:</strong> Broken speakers or forgotten headphones
            <br />
            <span className="text-sm text-gray-600">Solution: Captions, visual alternatives</span>
          </li>
        </ul>
      </div>

      <h2>Design Implications for Developers</h2>
      <p>
        Designing for temporary and situational disabilities naturally creates better experiences for everyone:
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h3 className="text-blue-900 mt-0">Universal Design Benefits</h3>
        <div className="space-y-4 text-blue-900">
          <div>
            <h4 className="text-base font-semibold mb-1">Keyboard Shortcuts</h4>
            <p className="text-sm mb-0">
              Help: Blind users, broken mouse, power users, temporary hand injury
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-1">Captions</h4>
            <p className="text-sm mb-0">
              Help: Deaf users, noisy environment, quiet environment, language learners, accents
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-1">High Contrast</h4>
            <p className="text-sm mb-0">
              Help: Low vision, bright sunlight, old monitors, eye fatigue, aging users
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-1">Voice Control</h4>
            <p className="text-sm mb-0">
              Help: Motor disabilities, temporary injury, driving, multitasking, hands-free contexts
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-1">Large Touch Targets</h4>
            <p className="text-sm mb-0">
              Help: Motor disabilities, tremors, gloves, cracked screen, one-handed use, moving vehicle
            </p>
          </div>
        </div>
      </div>

      <h2>Code Example: Responsive Touch Targets</h2>
      <p>
        Design for one-handed use and imprecise input:
      </p>

      <div className="bg-gray-900 text-gray-100 p-6 rounded-lg my-6 overflow-x-auto">
        <pre className="text-sm">
          <code>{`/* ❌ INACCESSIBLE: Tiny targets */
.button {
  padding: 4px 8px;
  font-size: 12px;
}

/* ✅ ACCESSIBLE: WCAG minimum 44x44px */
.button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 24px;
  font-size: 16px;

  /* Extra space between adjacent buttons */
  margin: 8px;
}

/* Even better: Larger on mobile for thumb use */
@media (max-width: 768px) {
  .button {
    min-height: 48px;
    padding: 16px 24px;
  }
}

/* Critical actions: Extra large */
.primary-button {
  min-height: 56px;
  padding: 20px 32px;
  font-size: 18px;
}`}</code>
        </pre>
      </div>

      <h2>Real-World Scenarios</h2>

      <div className="space-y-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
          <h4 className="text-yellow-900 font-semibold mb-2">Scenario: Parent with Toddler</h4>
          <p className="text-yellow-900 mb-2">
            Sarah is shopping online while holding her sleeping 2-year-old. She can only use one hand.
          </p>
          <p className="text-yellow-900 mb-0">
            <strong>What helps:</strong> Large buttons, simple checkout flow, saved payment info, voice search,
            one-handed navigation gestures
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
          <h4 className="text-yellow-900 font-semibold mb-2">Scenario: Injured Athlete</h4>
          <p className="text-yellow-900 mb-2">
            Marcus broke his dominant hand playing basketball. He's in a cast for 8 weeks.
          </p>
          <p className="text-yellow-900 mb-0">
            <strong>What helps:</strong> Keyboard shortcuts, voice typing, large buttons for imprecise mouse control,
            undo functionality for mistakes
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
          <h4 className="text-yellow-900 font-semibold mb-2">Scenario: Commuter on Subway</h4>
          <p className="text-yellow-900 mb-2">
            Aisha watches videos during her train commute, but it's too loud for audio.
          </p>
          <p className="text-yellow-900 mb-0">
            <strong>What helps:</strong> Auto-play captions, visual notifications, haptic feedback,
            transcript option
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
          <h4 className="text-yellow-900 font-semibold mb-2">Scenario: Developer in Bright Office</h4>
          <p className="text-yellow-900 mb-2">
            James sits near a window. Afternoon sun makes his screen nearly unreadable.
          </p>
          <p className="text-yellow-900 mb-0">
            <strong>What helps:</strong> High contrast mode, adjustable brightness, dark mode option,
            no reliance on subtle color differences
          </p>
        </div>
      </div>

      <h2>Developer Checklist</h2>
      <div className="bg-gray-50 p-6 rounded-lg my-6">
        <ul className="space-y-2 mb-0">
          <li>✅ Touch targets are minimum 44x44px (WCAG 2.5.5)</li>
          <li>✅ All functionality available via keyboard</li>
          <li>✅ All audio content has captions or transcripts</li>
          <li>✅ Interface works in bright sunlight (high contrast)</li>
          <li>✅ Site functions well on slow 3G connections</li>
          <li>✅ One-handed operation is possible on mobile</li>
          <li>✅ Voice control supported for text input</li>
          <li>✅ Clear error messages and undo functionality</li>
          <li>✅ No critical actions require precise timing</li>
          <li>✅ Works with gloves (larger targets, no hover-only)</li>
        </ul>
      </div>

      <h2>Key Takeaways</h2>
      <div className="bg-green-50 border-l-4 border-green-600 p-6">
        <ul className="text-green-900 space-y-2 mb-0">
          <li>
            <strong>Everyone experiences disability:</strong> Temporary injuries and situational factors affect us all
          </li>
          <li>
            <strong>Persona Spectrum:</strong> Permanent, temporary, and situational disabilities have similar needs
          </li>
          <li>
            <strong>Universal design wins:</strong> Accessible features benefit everyone in various contexts
          </li>
          <li>
            <strong>Context matters:</strong> Good design considers where and how people use your product
          </li>
          <li>
            <strong>Equipment varies:</strong> Design for slow connections, old devices, and broken hardware
          </li>
          <li>
            <strong>Flexibility is key:</strong> Offer multiple input methods (touch, keyboard, voice)
          </li>
        </ul>
      </div>

      <h2>Next Steps</h2>
      <p>
        Now that you understand how temporary and situational factors create universal accessibility needs:
      </p>
      <ul>
        <li>Review your current project: Which features assume perfect conditions?</li>
        <li>Test your site in challenging contexts (bright sun, one-handed, no audio)</li>
        <li>Consider the Persona Spectrum when designing new features</li>
        <li>
          Continue to <strong>Module 9: Multiple and Compound Disabilities</strong> to learn about users with
          complex combinations of accessibility needs
        </li>
      </ul>
    </div>
  );
}
