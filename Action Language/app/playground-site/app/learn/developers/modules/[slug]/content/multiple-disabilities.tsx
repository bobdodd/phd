export default function MultipleAndCompoundDisabilities() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
        <h2 className="text-2xl font-bold text-blue-900 mt-0 mb-4">What You'll Learn</h2>
        <ul className="text-blue-800 space-y-2 mb-0">
          <li>How multiple disabilities compound accessibility challenges</li>
          <li>Deafblindness and the unique assistive technology required</li>
          <li>Common disability combinations and their interaction patterns</li>
          <li>Why single-solution accessibility approaches often fail</li>
          <li>Design strategies for complex, overlapping needs</li>
        </ul>
      </div>

      <h2>Why This Matters</h2>
      <p>
        Most accessibility discussions focus on single disabilities in isolation: "How do blind users navigate?" or
        "What do deaf users need?" But reality is far more complex:
      </p>
      <ul>
        <li>Over <strong>40% of people with disabilities</strong> have multiple conditions</li>
        <li>Aging naturally brings multiple sensory and motor impairments</li>
        <li>Some disabilities inherently come in combinations (cerebral palsy affects both motor and speech)</li>
        <li>Solutions for one disability can conflict with solutions for another</li>
      </ul>
      <p>
        As a developer, you must understand how accessibility features interact and sometimes conflict. A site that
        works perfectly for blind users might be unusable for someone who is both blind and has limited hand mobility.
      </p>

      <h2>What Are Multiple Disabilities?</h2>
      <p>
        Multiple disabilities occur when someone has two or more impairments that significantly impact daily functioning.
        These are <strong>not</strong> merely additive—they're <strong>multiplicative</strong> in their complexity:
      </p>

      <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 my-6">
        <h3 className="text-yellow-900 mt-0">Additive vs. Multiplicative Impact</h3>
        <div className="text-yellow-900 space-y-4">
          <div>
            <p className="font-semibold mb-1">❌ Additive (Incorrect thinking):</p>
            <p className="text-sm mb-0">
              "Blind + motor disability = need screen reader + keyboard navigation"
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">✅ Multiplicative (Reality):</p>
            <p className="text-sm mb-0">
              "Blind + limited hand mobility = screen reader is too keyboard-intensive, switch access is too visual,
              needs refreshable Braille with scanning, custom input device, completely redesigned navigation"
            </p>
          </div>
        </div>
      </div>

      <h2>Deafblindness: The Ultimate Access Challenge</h2>
      <p>
        Deafblindness is the simultaneous impairment of vision and hearing. It's rare (estimated 35,000-40,000 in the U.S.)
        but represents the most extreme accessibility challenge:
      </p>

      <h3>Types of Deafblindness</h3>
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">Total Deafblindness</h4>
          <p>Complete loss of both vision and hearing. Very rare.</p>
          <p className="mb-0">
            <strong>Access method:</strong> Refreshable Braille display with single-line output
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">Functional Deafblindness</h4>
          <p>Sufficient loss in both senses that neither can compensate for the other. Most common.</p>
          <p className="mb-0">
            <strong>Access method:</strong> High-contrast large text + amplified audio, or Braille
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h4 className="text-lg font-semibold mb-2">Progressive Deafblindness</h4>
          <p>Usher syndrome and other conditions cause gradual loss over time.</p>
          <p className="mb-0">
            <strong>Challenge:</strong> Users must constantly adapt as senses decline
          </p>
        </div>
      </div>

      <h3>Assistive Technology for Deafblindness</h3>
      <div className="bg-gray-50 p-6 rounded-lg my-6">
        <h4 className="text-lg font-semibold mb-4">Primary Access: Refreshable Braille Display</h4>
        <p className="mb-4">
          A hardware device with rows of pins that raise and lower to form Braille characters. This is the
          <strong> only</strong> way totally deafblind users can access digital content.
        </p>

        <div className="bg-white border border-gray-300 rounded p-4 mb-4">
          <p className="font-semibold mb-2">How it works:</p>
          <ol className="space-y-2 mb-0">
            <li>Screen reader sends text to Braille display</li>
            <li>User reads line of Braille with fingertips</li>
            <li>User presses button to advance to next line</li>
            <li>User types on Braille keyboard to input text</li>
          </ol>
        </div>

        <div className="bg-red-50 border border-red-300 rounded p-4">
          <p className="font-semibold text-red-900 mb-2">Critical Limitations:</p>
          <ul className="text-red-900 space-y-1 mb-0">
            <li>Displays show only 40-80 characters at a time (one line)</li>
            <li>Reading is slow (about 50-100 words per minute vs. 200+ for sighted readers)</li>
            <li>Devices cost $2,000-$15,000+</li>
            <li>Graphics, images, and visual layouts are completely inaccessible</li>
            <li>Spatial information (position on screen) is lost</li>
          </ul>
        </div>
      </div>

      <h2>Common Disability Combinations</h2>

      <h3>1. Visual + Motor Disabilities</h3>
      <div className="bg-white border border-gray-200 rounded p-4 mb-4">
        <p className="mb-2">
          <strong>Example:</strong> Blind user with arthritis or cerebral palsy
        </p>
        <p className="mb-2">
          <strong>Challenge:</strong> Screen readers require heavy keyboard use, but user has limited hand mobility
        </p>
        <p className="mb-2">
          <strong>Solutions that help:</strong>
        </p>
        <ul className="mb-0">
          <li>Switch access with audio feedback</li>
          <li>Voice control with audio output</li>
          <li>Refreshable Braille (tactile, no keyboard needed)</li>
          <li>Simplified keyboard layouts with fewer keys</li>
          <li>Customizable keystroke timing (slow key repeat)</li>
        </ul>
      </div>

      <h3>2. Deaf + Cognitive Disabilities</h3>
      <div className="bg-white border border-gray-200 rounded p-4 mb-4">
        <p className="mb-2">
          <strong>Example:</strong> Deaf user with learning disability or intellectual disability
        </p>
        <p className="mb-2">
          <strong>Challenge:</strong> Captions require reading comprehension, which may be difficult
        </p>
        <p className="mb-2">
          <strong>Solutions that help:</strong>
        </p>
        <ul className="mb-0">
          <li>Sign language video interpretation (visual, not text-based)</li>
          <li>Simplified language captions (plain language, shorter sentences)</li>
          <li>Visual diagrams and illustrations to supplement text</li>
          <li>Video descriptions of complex concepts</li>
        </ul>
      </div>

      <h3>3. Motor + Speech Disabilities</h3>
      <div className="bg-white border border-gray-200 rounded p-4 mb-4">
        <p className="mb-2">
          <strong>Example:</strong> Cerebral palsy, ALS, or stroke affecting both movement and speech
        </p>
        <p className="mb-2">
          <strong>Challenge:</strong> Can't use mouse or keyboard effectively, can't use voice control
        </p>
        <p className="mb-2">
          <strong>Solutions that help:</strong>
        </p>
        <ul className="mb-0">
          <li>Eye tracking with on-screen keyboard</li>
          <li>Switch access with scanning</li>
          <li>Head pointer with virtual keyboard</li>
          <li>AAC device integration (typed communication)</li>
        </ul>
      </div>

      <h3>4. Visual + Cognitive Disabilities</h3>
      <div className="bg-white border border-gray-200 rounded p-4 mb-4">
        <p className="mb-2">
          <strong>Example:</strong> Low vision with memory impairment or learning disability
        </p>
        <p className="mb-2">
          <strong>Challenge:</strong> Screen magnification creates disorientation; complex navigation is hard to remember
        </p>
        <p className="mb-2">
          <strong>Solutions that help:</strong>
        </p>
        <ul className="mb-0">
          <li>Consistent, predictable layouts (same navigation every page)</li>
          <li>Breadcrumb navigation (orientation cues)</li>
          <li>Clear headings and landmarks</li>
          <li>Persistent search functionality</li>
          <li>Bookmarking and history features</li>
        </ul>
      </div>

      <h3>5. Multiple Sensory (Aging)</h3>
      <div className="bg-white border border-gray-200 rounded p-4 mb-4">
        <p className="mb-2">
          <strong>Example:</strong> Older adult with declining vision, hearing, and motor control
        </p>
        <p className="mb-2">
          <strong>Challenge:</strong> Need multiple accommodations simultaneously
        </p>
        <p className="mb-2">
          <strong>Solutions that help:</strong>
        </p>
        <ul className="mb-0">
          <li>Flexible text sizing (responsive to user settings)</li>
          <li>Both captions and transcripts for audio</li>
          <li>Large, easy-to-click buttons (44px+ minimum)</li>
          <li>High contrast options</li>
          <li>Forgiving UI (easy undo, confirmation dialogs)</li>
        </ul>
      </div>

      <h2>Design Conflicts: When Solutions Clash</h2>
      <p>
        Some accessibility solutions work well for one disability but create problems for another:
      </p>

      <div className="space-y-4">
        <div className="bg-red-50 border-l-4 border-red-600 p-4">
          <h4 className="text-red-900 font-semibold mb-2">Conflict 1: Auto-play Captions vs. Screen Readers</h4>
          <p className="text-red-900 mb-2">
            <strong>Problem:</strong> Deaf users need captions on by default. But auto-play captions are announced
            by screen readers, creating annoying double-announcement for blind users.
          </p>
          <p className="text-red-900 mb-0">
            <strong>Solution:</strong> Detect screen reader, disable caption announcement in that case. Or: let users
            toggle caption speech on/off.
          </p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-600 p-4">
          <h4 className="text-red-900 font-semibold mb-2">Conflict 2: Reduced Motion vs. Visual Feedback</h4>
          <p className="text-red-900 mb-2">
            <strong>Problem:</strong> Users with vestibular disorders need reduced motion. But blind users benefit
            from subtle animations that indicate state changes.
          </p>
          <p className="text-red-900 mb-0">
            <strong>Solution:</strong> Respect prefers-reduced-motion, but also provide non-visual feedback
            (ARIA live regions, sound cues, Braille output).
          </p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-600 p-4">
          <h4 className="text-red-900 font-semibold mb-2">Conflict 3: Keyboard Shortcuts vs. Switch Access</h4>
          <p className="text-red-900 mb-2">
            <strong>Problem:</strong> Complex keyboard shortcuts help blind power users. But switch users can't
            execute multi-key combinations (Ctrl+Shift+K is impossible with one button).
          </p>
          <p className="text-red-900 mb-0">
            <strong>Solution:</strong> Provide both keyboard shortcuts AND menu-driven alternatives. Don't require
            shortcuts for essential functions.
          </p>
        </div>
      </div>

      <h2>Developer Guidelines for Multiple Disabilities</h2>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h3 className="text-blue-900 mt-0">Core Principles</h3>
        <ol className="text-blue-900 space-y-3 mb-0">
          <li>
            <strong>Provide Multiple Pathways:</strong> Never rely on a single input or output method. Offer
            keyboard, mouse, voice, and touch. Offer visual, audio, and tactile feedback.
          </li>
          <li>
            <strong>Make Everything Customizable:</strong> Text size, colors, sounds, keyboard shortcuts, timing—let
            users configure to their needs.
          </li>
          <li>
            <strong>Test Combinations:</strong> Don't just test screen readers. Test screen reader + keyboard-only.
            Test magnification + captions. Test switch access + audio output.
          </li>
          <li>
            <strong>Avoid Modal Interactions:</strong> Don't lock users into single interaction patterns. If something
            requires drag-and-drop, also provide keyboard alternative. If something requires audio, provide text.
          </li>
          <li>
            <strong>Design for Simplicity:</strong> Complex interactions are exponentially harder for users with
            multiple disabilities. Keep navigation simple, interactions straightforward.
          </li>
        </ol>
      </div>

      <h2>Code Example: Multiple Input Methods</h2>
      <p>
        Ensure critical actions work via multiple pathways:
      </p>

      <div className="bg-gray-900 text-gray-100 p-6 rounded-lg my-6 overflow-x-auto">
        <pre className="text-sm">
          <code>{`// ❌ INACCESSIBLE: Only works with drag-and-drop
<div
  draggable
  onDragStart={handleDragStart}
  onDrop={handleDrop}
>
  Drag me to reorder
</div>

// ✅ ACCESSIBLE: Multiple interaction methods
<div
  // Visual: Drag and drop (motor + vision required)
  draggable
  onDragStart={handleDragStart}
  onDrop={handleDrop}

  // Keyboard: Arrow keys to reorder
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'ArrowUp') moveUp();
    if (e.key === 'ArrowDown') moveDown();
    if (e.key === ' ' || e.key === 'Enter') toggleSelection();
  }}

  // Screen reader: Accessible name and instructions
  role="listitem"
  aria-label="Item 1. Press space to select, arrow keys to move"
  aria-grabbed={isGrabbed}
>
  Item content

  {/* Visual buttons for users who can't drag OR use keyboard */}
  <div className="reorder-buttons">
    <button onClick={moveUp} aria-label="Move up">↑</button>
    <button onClick={moveDown} aria-label="Move down">↓</button>
  </div>
</div>`}</code>
        </pre>
      </div>

      <h2>Code Example: Flexible Feedback</h2>
      <p>
        Provide multiple types of feedback for state changes:
      </p>

      <div className="bg-gray-900 text-gray-100 p-6 rounded-lg my-6 overflow-x-auto">
        <pre className="text-sm">
          <code>{`function FileSaveButton() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = async () => {
    setStatus('saving');

    // Visual feedback: Loading spinner
    // (automatically shown by status state in JSX)

    // Audio feedback: For blind users
    const audio = new Audio('/sounds/saving.mp3');
    audio.play();

    // Screen reader announcement
    announceToScreenReader('Saving file...');

    await saveFile();

    setStatus('saved');

    // Visual feedback: Checkmark icon
    // Audio feedback: Success sound
    new Audio('/sounds/success.mp3').play();

    // Screen reader announcement
    announceToScreenReader('File saved successfully');

    // Haptic feedback: Vibration (mobile)
    if (navigator.vibrate) {
      navigator.vibrate(200); // 200ms vibration
    }

    // Auto-hide after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <>
      <button
        onClick={handleSave}
        disabled={status === 'saving'}
        aria-live="polite"
        aria-busy={status === 'saving'}
      >
        {status === 'idle' && 'Save File'}
        {status === 'saving' && (
          <>
            <Spinner aria-hidden="true" />
            Saving...
          </>
        )}
        {status === 'saved' && (
          <>
            <Checkmark aria-hidden="true" />
            Saved!
          </>
        )}
      </button>

      {/* Screen reader only live region */}
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {status === 'saving' && 'Saving file, please wait'}
        {status === 'saved' && 'File saved successfully'}
      </div>
    </>
  );
}

function announceToScreenReader(message: string) {
  // Create temporary live region for announcement
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}`}</code>
        </pre>
      </div>

      <h2>Real-World Example: Helen Keller</h2>
      <div className="bg-gray-50 p-6 rounded-lg my-6">
        <p className="mb-4">
          Helen Keller (1880-1968) was both deaf and blind from age 2 due to illness. She became a world-famous
          author and activist, demonstrating that deafblindness doesn't limit intellectual capability—only access
          to information.
        </p>
        <p className="mb-4">
          Keller learned language through tactile sign language (words spelled into her palm) and later learned to
          read Braille. She wrote books, gave speeches (using her learned speech despite not being able to hear
          herself), and advocated for disability rights.
        </p>
        <p className="mb-0">
          <strong>The lesson:</strong> The barrier isn't the disability—it's the lack of accessible information.
          Today's deafblind users need Braille displays and proper web semantics to access digital content, just as
          Keller needed Braille books and tactile communication.
        </p>
      </div>

      <h2>Developer Checklist</h2>
      <div className="bg-gray-50 p-6 rounded-lg my-6">
        <ul className="space-y-2 mb-0">
          <li>✅ All interactions work via keyboard (not just mouse)</li>
          <li>✅ All interactions work via switch access (single button)</li>
          <li>✅ Content is linearized for Braille displays (meaningful without layout)</li>
          <li>✅ State changes provide multiple types of feedback (visual + audio + ARIA)</li>
          <li>✅ Timing is customizable or nonexistent (no forced timeouts)</li>
          <li>✅ Complex tasks have simple alternatives (drag-and-drop has button option)</li>
          <li>✅ Media has both captions AND transcripts</li>
          <li>✅ Text size doesn't break layout (responsive design)</li>
          <li>✅ Color contrast works for low vision + color blindness simultaneously</li>
          <li>✅ Tested with screen reader + keyboard-only navigation</li>
        </ul>
      </div>

      <h2>Key Takeaways</h2>
      <div className="bg-green-50 border-l-4 border-green-600 p-6">
        <ul className="text-green-900 space-y-2 mb-0">
          <li>
            <strong>Multiple disabilities are multiplicative:</strong> Complexity grows exponentially, not linearly
          </li>
          <li>
            <strong>Deafblindness requires Braille:</strong> The only digital access method for totally deafblind users
          </li>
          <li>
            <strong>Common combinations:</strong> Visual+motor, deaf+cognitive, motor+speech, aging affects multiple senses
          </li>
          <li>
            <strong>Solutions can conflict:</strong> Design for flexibility, not single pathways
          </li>
          <li>
            <strong>Provide multiple pathways:</strong> Never rely on one input method or output channel
          </li>
          <li>
            <strong>Test combinations:</strong> Screen reader + keyboard, magnification + captions, etc.
          </li>
          <li>
            <strong>Simplicity helps everyone:</strong> Especially critical for users with complex needs
          </li>
        </ul>
      </div>

      <h2>Next Steps</h2>
      <p>
        Now that you understand complex disability combinations:
      </p>
      <ul>
        <li>Audit your current projects for single-pathway dependencies (mouse-only, audio-only, etc.)</li>
        <li>Add multiple feedback types to critical interactions</li>
        <li>Test how your site works with combinations: screen reader + magnification, keyboard + reduced motion</li>
        <li>
          Continue to <strong>Module 10: Screen Readers Deep Dive</strong> for an in-depth technical understanding
          of the most important assistive technology
        </li>
      </ul>
    </div>
  );
}
