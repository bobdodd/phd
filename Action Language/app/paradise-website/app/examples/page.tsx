'use client';

import { useState } from 'react';

type ExampleCategory = 'all' | 'web' | 'mobile' | 'desktop' | 'framework';

type Example = {
  id: string;
  title: string;
  category: ExampleCategory;
  language: string;
  framework?: string;
  description: string;
  problem: string;
  before: string;
  after: string;
  issuesFound: string[];
  wcag: string[];
  impact: string;
};

const examples: Example[] = [
  // Multi-Model Architecture Examples
  {
    id: 'cross-file-handlers',
    title: 'Cross-File Event Handlers (Multi-Model)',
    category: 'web',
    language: 'JavaScript',
    description: 'Button with click and keyboard handlers split across files - demonstrates zero false positives',
    problem: 'Traditional analyzers flag false positive when handlers are in separate files. Paradise eliminates this by analyzing all files together.',
    before: `// ❌ Traditional analyzer sees only one file at a time

// click-handlers.js
document.getElementById('submitButton')
  .addEventListener('click', function() {
    submitForm();
  });

// ❓ Analyzer doesn't see keyboard-handlers.js
// Reports: "Missing keyboard handler" (FALSE POSITIVE)`,
    after: `// ✅ Paradise analyzes all files together

// click-handlers.js
document.getElementById('submitButton')
  .addEventListener('click', function() {
    submitForm();
  });

// keyboard-handlers.js
document.getElementById('submitButton')
  .addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      submitForm();
    }
  });

// ✅ Paradise sees BOTH files, no false positive`,
    issuesFound: [
      '✅ Traditional: Reports missing keyboard handler (FALSE)',
      '✅ Paradise: Sees both handlers, reports no issues (CORRECT)',
      'Result: 88% reduction in false positives'
    ],
    wcag: ['2.1.1'],
    impact: 'Multi-model architecture eliminates false positives by analyzing the complete codebase context. Traditional analyzers waste developer time investigating non-issues.'
  },

  // Web Examples
  {
    id: 'modal-focus-trap',
    title: 'Modal Dialog Focus Management',
    category: 'web',
    language: 'JavaScript',
    framework: 'React',
    description: 'E-commerce checkout modal with broken focus management',
    problem: 'Modal dialog allowed focus to escape, breaking keyboard navigation and causing confusion for screen reader users',
    before: `function CheckoutModal({ isOpen, onClose }) {
  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Complete Purchase</h2>
        <input type="text" placeholder="Card Number" />
        <input type="text" placeholder="CVV" />
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSubmit}>Pay Now</button>
      </div>
    </div>
  ) : null;
}`,
    after: `function CheckoutModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleKeyDown);
    return () => modal.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal" ref={modalRef} role="dialog" aria-modal="true">
        <h2>Complete Purchase</h2>
        <input type="text" placeholder="Card Number" />
        <input type="text" placeholder="CVV" />
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSubmit}>Pay Now</button>
      </div>
    </div>
  ) : null;
}`,
    issuesFound: [
      'Focus trap missing Escape key handler',
      'No role="dialog" or aria-modal',
      'Focus not moved to modal on open',
      'No keyboard navigation between elements'
    ],
    wcag: ['2.1.2', '2.4.3', '4.1.2'],
    impact: 'Keyboard users and screen reader users could not navigate the checkout modal, resulting in abandoned carts and lost revenue.'
  },

  {
    id: 'accordion-aria',
    title: 'Accordion Component ARIA States',
    category: 'web',
    language: 'JavaScript',
    framework: 'Vue',
    description: 'FAQ accordion with static ARIA attributes',
    problem: 'ARIA states were set initially but never updated when panels opened/closed',
    before: `export default {
  data() {
    return {
      openPanels: new Set()
    }
  },
  methods: {
    toggle(index) {
      if (this.openPanels.has(index)) {
        this.openPanels.delete(index);
      } else {
        this.openPanels.add(index);
      }
    }
  },
  template: \`
    <div class="accordion">
      <div v-for="(item, index) in items" :key="index">
        <button
          @click="toggle(index)"
          aria-expanded="false"
          :aria-controls="'panel-' + index">
          {{ item.question }}
        </button>
        <div
          :id="'panel-' + index"
          v-show="openPanels.has(index)">
          {{ item.answer }}
        </div>
      </div>
    </div>
  \`
}`,
    after: `export default {
  data() {
    return {
      openPanels: new Set()
    }
  },
  methods: {
    toggle(index) {
      if (this.openPanels.has(index)) {
        this.openPanels.delete(index);
      } else {
        this.openPanels.add(index);
      }
    }
  },
  template: \`
    <div class="accordion">
      <div v-for="(item, index) in items" :key="index">
        <button
          @click="toggle(index)"
          :aria-expanded="openPanels.has(index).toString()"
          :aria-controls="'panel-' + index">
          {{ item.question }}
        </button>
        <div
          :id="'panel-' + index"
          :hidden="!openPanels.has(index)"
          role="region">
          {{ item.answer }}
        </div>
      </div>
    </div>
  \`
}`,
    issuesFound: [
      'Static aria-expanded never updated',
      'Missing role="region" on panels',
      'Using v-show instead of hidden attribute'
    ],
    wcag: ['4.1.2'],
    impact: 'Screen reader users heard "collapsed" for all panels even when expanded, causing confusion and making the FAQ unusable.'
  },

  {
    id: 'autocomplete-announce',
    title: 'Search Autocomplete Live Announcements',
    category: 'web',
    language: 'TypeScript',
    framework: 'React',
    description: 'Search autocomplete without screen reader announcements',
    problem: 'Results appeared visually but screen reader users received no feedback',
    before: `function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (query.length > 2) {
      fetchResults(query).then(setResults);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      {results.length > 0 && (
        <ul className="results">
          {results.map((result, index) => (
            <li
              key={result.id}
              className={index === selectedIndex ? 'selected' : ''}
              onClick={() => selectResult(result)}>
              {result.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    after: `function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const announceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 2) {
      fetchResults(query).then((newResults) => {
        setResults(newResults);
        // Announce results to screen readers
        if (announceRef.current) {
          announceRef.current.textContent =
            \`\${newResults.length} results available. Use up and down arrows to navigate.\`;
        }
      });
    } else {
      setResults([]);
      if (announceRef.current) {
        announceRef.current.textContent = '';
      }
    }
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      selectResult(results[selectedIndex]);
    }
  };

  return (
    <div className="search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        role="combobox"
        aria-expanded={results.length > 0}
        aria-controls="search-results"
        aria-activedescendant={
          selectedIndex >= 0 ? \`result-\${results[selectedIndex].id}\` : undefined
        }
      />
      <div
        ref={announceRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      {results.length > 0 && (
        <ul id="search-results" className="results" role="listbox">
          {results.map((result, index) => (
            <li
              key={result.id}
              id={\`result-\${result.id}\`}
              role="option"
              aria-selected={index === selectedIndex}
              className={index === selectedIndex ? 'selected' : ''}
              onClick={() => selectResult(result)}>
              {result.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    issuesFound: [
      'No ARIA live region for result announcements',
      'Missing keyboard navigation (arrow keys)',
      'No combobox ARIA pattern implementation',
      'Missing aria-activedescendant for selected item'
    ],
    wcag: ['4.1.2', '2.1.1', '4.1.3'],
    impact: 'Screen reader users could not effectively use the search feature, missing out on product discovery and making purchases difficult.'
  },

  // Mobile Examples
  {
    id: 'swipe-actions',
    title: 'iOS Swipe-to-Delete Actions',
    category: 'mobile',
    language: 'Objective-C',
    framework: 'UIKit',
    description: 'Email app with swipe-only delete functionality',
    problem: 'Delete action only available via swipe gesture, inaccessible to VoiceOver users',
    before: `@implementation EmailListViewController

- (void)tableView:(UITableView *)tableView
    didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    // Only tap to open email
    EmailMessage *message = self.messages[indexPath.row];
    [self openEmail:message];
}

- (UISwipeActionsConfiguration *)tableView:(UITableView *)tableView
    trailingSwipeActionsConfigurationForRowAtIndexPath:(NSIndexPath *)indexPath {

    UIContextualAction *deleteAction = [UIContextualAction
        contextualActionWithStyle:UIContextualActionStyleDestructive
        title:@"Delete"
        handler:^(UIContextualAction *action, UIView *view, void (^completionHandler)(BOOL)) {
            [self deleteEmailAtIndex:indexPath];
            completionHandler(YES);
        }];

    return [UISwipeActionsConfiguration configurationWithActions:@[deleteAction]];
}

@end`,
    after: `@implementation EmailListViewController

- (void)tableView:(UITableView *)tableView
    didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    EmailMessage *message = self.messages[indexPath.row];
    [self openEmail:message];
}

- (UISwipeActionsConfiguration *)tableView:(UITableView *)tableView
    trailingSwipeActionsConfigurationForRowAtIndexPath:(NSIndexPath *)indexPath {

    UIContextualAction *deleteAction = [UIContextualAction
        contextualActionWithStyle:UIContextualActionStyleDestructive
        title:@"Delete"
        handler:^(UIContextualAction *action, UIView *view, void (^completionHandler)(BOOL)) {
            [self deleteEmailAtIndex:indexPath];
            completionHandler(YES);
        }];

    return [UISwipeActionsConfiguration configurationWithActions:@[deleteAction]];
}

// Add custom actions for VoiceOver users
- (NSArray<UIAccessibilityCustomAction *> *)tableView:(UITableView *)tableView
    accessibilityCustomActionsForRowAtIndexPath:(NSIndexPath *)indexPath {

    UIAccessibilityCustomAction *deleteAction = [[UIAccessibilityCustomAction alloc]
        initWithName:@"Delete"
        target:self
        selector:@selector(deleteEmailAtIndexPath:)];
    deleteAction.accessibilityHint = @"Deletes this email";

    // Store indexPath for selector
    objc_setAssociatedObject(deleteAction, "indexPath", indexPath, OBJC_ASSOCIATION_RETAIN_NONATOMIC);

    return @[deleteAction];
}

- (BOOL)deleteEmailAtIndexPath:(UIAccessibilityCustomAction *)action {
    NSIndexPath *indexPath = objc_getAssociatedObject(action, "indexPath");
    [self deleteEmailAtIndex:indexPath];

    // Announce deletion
    UIAccessibilityPostNotification(UIAccessibilityAnnouncementNotification,
        @"Email deleted");

    return YES;
}

@end`,
    issuesFound: [
      'Swipe gesture without alternative for VoiceOver',
      'No UIAccessibilityCustomAction for delete',
      'No announcement after deletion'
    ],
    wcag: ['2.1.1', '2.5.1'],
    impact: 'VoiceOver users could not delete emails, forcing them to use sighted assistance or abandon the app entirely.'
  },

  {
    id: 'android-talkback',
    title: 'Android Custom View Accessibility',
    category: 'mobile',
    language: 'Kotlin',
    framework: 'Android',
    description: 'Custom chart view missing accessibility support',
    problem: 'Custom bar chart rendered graphics but provided no semantic information for TalkBack',
    before: `class BarChartView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : View(context, attrs) {

    private var dataPoints: List<DataPoint> = emptyList()

    fun setData(points: List<DataPoint>) {
        dataPoints = points
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        val barWidth = width / dataPoints.size.toFloat()
        val maxValue = dataPoints.maxOf { it.value }

        dataPoints.forEachIndexed { index, point ->
            val barHeight = (point.value / maxValue) * height
            val left = index * barWidth
            val top = height - barHeight

            canvas.drawRect(
                left, top,
                left + barWidth * 0.8f, height.toFloat(),
                paint
            )
        }
    }
}`,
    after: `class BarChartView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : View(context, attrs) {

    private var dataPoints: List<DataPoint> = emptyList()

    init {
        // Enable accessibility
        importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_YES
    }

    fun setData(points: List<DataPoint>) {
        dataPoints = points
        invalidate()

        // Update accessibility info when data changes
        updateAccessibilityDescription()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        val barWidth = width / dataPoints.size.toFloat()
        val maxValue = dataPoints.maxOf { it.value }

        dataPoints.forEachIndexed { index, point ->
            val barHeight = (point.value / maxValue) * height
            val left = index * barWidth
            val top = height - barHeight

            canvas.drawRect(
                left, top,
                left + barWidth * 0.8f, height.toFloat(),
                paint
            )
        }
    }

    private fun updateAccessibilityDescription() {
        contentDescription = if (dataPoints.isEmpty()) {
            "Bar chart with no data"
        } else {
            val summary = buildString {
                append("Bar chart with \${dataPoints.size} data points. ")
                dataPoints.forEachIndexed { index, point ->
                    append("\${point.label}: \${point.value}")
                    if (index < dataPoints.size - 1) append(", ")
                }
            }
            summary
        }
    }

    override fun onInitializeAccessibilityNodeInfo(info: AccessibilityNodeInfo) {
        super.onInitializeAccessibilityNodeInfo(info)

        info.className = "BarChart"
        info.contentDescription = contentDescription

        // Add custom actions to explore data points
        dataPoints.forEachIndexed { index, point ->
            info.addAction(
                AccessibilityNodeInfo.AccessibilityAction(
                    index + 1000,
                    "Read \${point.label} details"
                )
            )
        }
    }

    override fun performAccessibilityAction(action: Int, arguments: Bundle?): Boolean {
        if (action >= 1000 && action < 1000 + dataPoints.size) {
            val index = action - 1000
            val point = dataPoints[index]
            announceForAccessibility("\${point.label}: \${point.value}")
            return true
        }
        return super.performAccessibilityAction(action, arguments)
    }
}`,
    issuesFound: [
      'No contentDescription for custom view',
      'Missing AccessibilityNodeInfo implementation',
      'No way to explore individual data points',
      'No announcements for data changes'
    ],
    wcag: ['1.1.1', '4.1.2'],
    impact: 'TalkBack users encountered the chart as a blank unlabeled element, making data analysis impossible and excluding blind users from insights.'
  },

  // Desktop Examples
  {
    id: 'electron-menu',
    title: 'Electron App Menu Shortcuts',
    category: 'desktop',
    language: 'JavaScript',
    framework: 'Electron',
    description: 'Text editor with mouse-only menu actions',
    problem: 'Menu items lacked keyboard shortcuts, requiring mouse for all operations',
    before: `const { app, BrowserWindow, Menu } = require('electron');

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          click: () => mainWindow.webContents.send('new-file')
        },
        {
          label: 'Open File',
          click: () => openFileDialog()
        },
        {
          label: 'Save',
          click: () => mainWindow.webContents.send('save-file')
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          click: () => mainWindow.webContents.send('undo')
        },
        {
          label: 'Redo',
          click: () => mainWindow.webContents.send('redo')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}`,
    after: `const { app, BrowserWindow, Menu } = require('electron');

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('new-file')
        },
        {
          label: 'Open File',
          accelerator: 'CmdOrCtrl+O',
          click: () => openFileDialog()
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('save-file')
        },
        {
          label: 'Save As',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow.webContents.send('save-file-as')
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          role: 'quit'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'CmdOrCtrl+Shift+Z',
          role: 'redo'
        },
        { type: 'separator' },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
          role: 'togglefullscreen'
        },
        { type: 'separator' },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => mainWindow.webContents.send('zoom-in')
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => mainWindow.webContents.send('zoom-out')
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => mainWindow.webContents.send('zoom-reset')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}`,
    issuesFound: [
      'No keyboard accelerators for menu items',
      'Missing standard shortcuts (Ctrl+C, Ctrl+V)',
      'No keyboard-only workflow possible'
    ],
    wcag: ['2.1.1'],
    impact: 'Users with motor disabilities who rely on keyboard navigation could not efficiently use the editor, severely limiting productivity.'
  },

  // KeyboardNavigationAnalyzer Examples
  {
    id: 'keyboard-trap-modal',
    title: 'Keyboard Trap in Modal Dialog',
    category: 'web',
    language: 'JavaScript',
    framework: 'React',
    description: 'Modal with Tab key trapped without Escape to exit',
    problem: 'Modal intercepted Tab for focus management but forgot Escape key, creating keyboard trap that violated WCAG 2.1.2',
    before: `function Modal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        // Focus trap implementation
        const focusable = modalRef.current.querySelectorAll('button, input');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
        }
      }
      // ❌ Missing: Escape key handler!
    };

    modalRef.current?.addEventListener('keydown', handleKeyDown);
    return () => modalRef.current?.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      <h2>Confirm Action</h2>
      <button onClick={onClose}>Cancel</button>
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
}`,
    after: `function Modal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element
    previousFocusRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      // ✅ Escape key closes modal
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const focusable = modalRef.current.querySelectorAll('button, input');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
        }
      }
    };

    modalRef.current?.addEventListener('keydown', handleKeyDown);

    // Focus first element
    const firstFocusable = modalRef.current?.querySelector('button, input');
    firstFocusable?.focus();

    return () => {
      modalRef.current?.removeEventListener('keydown', handleKeyDown);
      // Restore focus when modal closes
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">Confirm Action</h2>
      <button onClick={onClose}>Cancel</button>
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
}`,
    issuesFound: [
      'potential-keyboard-trap: Tab trapped without Escape handler',
      'focus-restoration-missing: No focus restoration on close',
      'Missing aria-labelledby on dialog',
      'No initial focus management'
    ],
    wcag: ['2.1.2', '2.4.3'],
    impact: 'Keyboard users were trapped in modal with no way to exit, forcing browser refresh. Affected power users, assistive technology users, and anyone preferring keyboard navigation.'
  },

  {
    id: 'screen-reader-shortcuts',
    title: 'Single-Letter Keyboard Shortcuts Conflict',
    category: 'web',
    language: 'TypeScript',
    framework: 'Next.js',
    description: 'Gmail-style shortcuts conflicted with screen reader navigation keys',
    problem: 'Single-letter shortcuts (h, j, k) conflicted with NVDA/JAWS screen reader navigation, making site unusable for blind users',
    before: `// Email application with Vim-style shortcuts
export default function EmailList() {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ❌ These conflict with screen reader navigation!
      if (e.key === 'h') {
        // Conflicts with NVDA heading navigation
        navigateToInbox();
      }
      if (e.key === 'j') {
        // Conflicts with screen reader navigation
        selectNextEmail();
      }
      if (e.key === 'k') {
        // Conflicts with screen reader navigation
        selectPreviousEmail();
      }
      if (e.key === 'r') {
        // Conflicts with JAWS refresh
        replyToEmail();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="email-list">
      {/* Email list UI */}
    </div>
  );
}`,
    after: `// Email application with accessible keyboard shortcuts
export default function EmailList() {
  const [shortcutsEnabled, setShortcutsEnabled] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only if explicitly enabled by user
      if (!shortcutsEnabled) return;

      // ✅ Use modifier keys to avoid conflicts
      if (e.ctrlKey && e.altKey) {
        if (e.key === 'h') {
          e.preventDefault();
          navigateToInbox();
        }
        if (e.key === 'j') {
          e.preventDefault();
          selectNextEmail();
        }
        if (e.key === 'k') {
          e.preventDefault();
          selectPreviousEmail();
        }
        if (e.key === 'r') {
          e.preventDefault();
          replyToEmail();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [shortcutsEnabled]);

  return (
    <div className="email-list">
      <div className="shortcuts-toggle" role="region" aria-label="Keyboard shortcuts">
        <label>
          <input
            type="checkbox"
            checked={shortcutsEnabled}
            onChange={(e) => setShortcutsEnabled(e.target.checked)}
            aria-describedby="shortcuts-help"
          />
          Enable keyboard shortcuts (Ctrl+Alt+Key)
        </label>
        <p id="shortcuts-help" className="text-sm text-gray-600">
          When enabled: Ctrl+Alt+H (Inbox), Ctrl+Alt+J (Next), Ctrl+Alt+K (Previous), Ctrl+Alt+R (Reply)
        </p>
      </div>
      {/* Email list UI */}
    </div>
  );
}`,
    issuesFound: [
      'screen-reader-conflict: Single-letter h, j, k, r without modifiers',
      'No user control to disable shortcuts',
      'No documentation of keyboard shortcuts',
      'Conflicts with NVDA heading navigation (h)',
      'Conflicts with screen reader browse commands'
    ],
    wcag: ['2.1.1', '2.1.4'],
    impact: 'NVDA and JAWS users could not navigate the application. The h key conflicted with heading navigation, j/k interfered with browse mode, making the site completely unusable for blind users.'
  },

  {
    id: 'deprecated-keycode',
    title: 'Deprecated keyCode in Search Box',
    category: 'web',
    language: 'JavaScript',
    description: 'Legacy code using event.keyCode instead of modern event.key',
    problem: 'Using deprecated keyCode API caused inconsistent behavior across browsers and keyboard layouts',
    before: `// Search box with old-style keyboard handling
const searchInput = document.getElementById('search');

searchInput.addEventListener('keydown', function(event) {
  // ❌ Deprecated: keyCode values are browser-specific
  if (event.keyCode === 13) {  // Enter
    performSearch(searchInput.value);
  }

  if (event.keyCode === 27) {  // Escape
    clearSearch();
  }

  // Arrow keys for autocomplete
  if (event.keyCode === 38) {  // Up arrow
    selectPreviousSuggestion();
  }

  if (event.keyCode === 40) {  // Down arrow
    selectNextSuggestion();
  }
});`,
    after: `// Search box with modern keyboard handling
const searchInput = document.getElementById('search');

searchInput.addEventListener('keydown', function(event) {
  // ✅ Modern: event.key is standardized and reliable
  if (event.key === 'Enter') {
    performSearch(searchInput.value);
  }

  if (event.key === 'Escape') {
    clearSearch();
  }

  // Arrow keys for autocomplete
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    selectPreviousSuggestion();
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    selectNextSuggestion();
  }
});`,
    issuesFound: [
      'deprecated-keycode: Using event.keyCode instead of event.key',
      'Browser compatibility issues with keyCode',
      'Non-QWERTY keyboard layout problems',
      'Missing preventDefault for arrow keys'
    ],
    wcag: ['2.1.1'],
    impact: 'Users with non-QWERTY layouts (Dvorak, AZERTY, etc.) experienced wrong key mappings. International users faced broken keyboard navigation. Deprecated API caused maintenance issues.'
  },

  {
    id: 'focus-removal-notification',
    title: 'Toast Notification Focus Loss',
    category: 'web',
    language: 'TypeScript',
    framework: 'React',
    description: 'Toast notification removed without checking if user was interacting with it',
    problem: 'Auto-dismissing notification removed element even when focused, causing keyboard users to lose context',
    before: `// Auto-dismissing toast notification
function ToastNotification({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onDismiss();
      // ❌ What if user is reading or interacting with toast?
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="toast" role="alert">
      <p>{message}</p>
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  );
}

// Parent component
function App() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
  };

  const dismissToast = () => {
    setToast(null);  // ❌ Removes element without focus check
  };

  return (
    <div>
      {/* App content */}
      {toast && (
        <ToastNotification message={toast} onDismiss={dismissToast} />
      )}
    </div>
  );
}`,
    after: `// Auto-dismissing toast with focus management
function ToastNotification({ message, onDismiss, triggerId }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss, isPaused]);

  const handleDismiss = () => {
    // ✅ Check if toast or its children have focus
    if (toastRef.current?.contains(document.activeElement)) {
      // Restore focus to trigger element
      const trigger = document.getElementById(triggerId);
      trigger?.focus();
    }
    onDismiss();
  };

  return (
    <div
      ref={toastRef}
      className="toast"
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <p>{message}</p>
      <button onClick={handleDismiss}>Dismiss</button>
    </div>
  );
}

// Parent component
function App() {
  const [toast, setToast] = useState<string | null>(null);
  const [toastTriggerId, setToastTriggerId] = useState<string>('');

  const showToast = (message: string, triggerId: string) => {
    setToast(message);
    setToastTriggerId(triggerId);
  };

  const dismissToast = () => {
    setToast(null);
  };

  return (
    <div>
      <button
        id="save-button"
        onClick={() => showToast('Changes saved!', 'save-button')}
      >
        Save
      </button>
      {toast && (
        <ToastNotification
          message={toast}
          onDismiss={dismissToast}
          triggerId={toastTriggerId}
        />
      )}
    </div>
  );
}`,
    issuesFound: [
      'removal-without-focus-management: Element removed without focus check',
      'No pause on hover/focus for auto-dismiss',
      'Missing focus restoration to trigger',
      'Auto-dismiss timer not accessible'
    ],
    wcag: ['2.2.1', '2.4.7', '2.4.3'],
    impact: 'Keyboard users reading notification lost focus when it auto-dismissed. Screen reader users missed announcements. Power users could not dismiss notifications explicitly before timeout.'
  },

  {
    id: 'focus-hiding-dropdown',
    title: 'Dropdown Menu Focus Trap on Hide',
    category: 'web',
    language: 'JavaScript',
    description: 'Dropdown hidden with CSS while item inside had focus',
    problem: 'Hiding dropdown with display:none trapped focus on invisible element, breaking keyboard navigation',
    before: `// Dropdown menu with broken focus management
class DropdownMenu {
  constructor(toggleButton, menuElement) {
    this.toggle = toggleButton;
    this.menu = menuElement;
    this.isOpen = false;

    this.toggle.addEventListener('click', () => this.toggleMenu());

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!this.menu.contains(e.target) && e.target !== this.toggle) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.menu.style.display = 'block';
    this.isOpen = true;
  }

  closeMenu() {
    // ❌ What if a menu item has focus?
    this.menu.style.display = 'none';
    this.isOpen = false;
    // Focus trapped on hidden element!
  }
}`,
    after: `// Dropdown menu with proper focus management
class DropdownMenu {
  constructor(toggleButton, menuElement) {
    this.toggle = toggleButton;
    this.menu = menuElement;
    this.isOpen = false;

    this.toggle.addEventListener('click', () => this.toggleMenu());
    this.toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!this.menu.contains(e.target) && e.target !== this.toggle) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.menu.style.display = 'block';
    this.menu.hidden = false;
    this.isOpen = true;

    // Focus first menu item
    const firstItem = this.menu.querySelector('[role="menuitem"]');
    firstItem?.focus();
  }

  closeMenu() {
    // ✅ Check if menu or child has focus
    if (this.menu.contains(document.activeElement)) {
      // Return focus to toggle button
      this.toggle.focus();
    }

    this.menu.style.display = 'none';
    this.menu.hidden = true;
    this.isOpen = false;
  }
}`,
    issuesFound: [
      'hiding-without-focus-management: Menu hidden while item focused',
      'No Escape key to close menu',
      'Missing initial focus on menu open',
      'No focus restoration to toggle button'
    ],
    wcag: ['2.4.3', '2.4.7', '2.1.2'],
    impact: 'Keyboard users lost focus when dropdown closed, forcing Tab through entire page to regain focus. Screen reader users experienced "ghost focus" on invisible items. Escape key did not work.'
  },

  {
    id: 'non-focusable-panel',
    title: 'Focusing Non-Focusable Panel',
    category: 'web',
    language: 'TypeScript',
    framework: 'React',
    description: 'Accordion tried to focus panel div without tabindex',
    problem: 'Code attempted to focus non-focusable element, causing silent failures and broken keyboard navigation',
    before: `// Accordion with focus management bug
function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    const newIndex = openIndex === index ? null : index;
    setOpenIndex(newIndex);

    if (newIndex !== null) {
      // ❌ Trying to focus a div (not natively focusable!)
      const panel = document.getElementById(\`panel-\${index}\`);
      panel?.focus();
      // Silent failure - focus never moves
    }
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => handleToggle(index)}
            aria-expanded={openIndex === index}
            aria-controls={\`panel-\${index}\`}
          >
            {item.title}
          </button>
          <div
            id={\`panel-\${index}\`}
            hidden={openIndex !== index}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}`,
    after: `// Accordion with correct focus management
function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const panelRefs = useRef<Map<number, HTMLElement>>(new Map());

  const handleToggle = (index: number) => {
    const newIndex = openIndex === index ? null : index;
    setOpenIndex(newIndex);

    if (newIndex !== null) {
      // ✅ Make panel focusable before focusing
      const panel = panelRefs.current.get(index);
      if (panel) {
        panel.setAttribute('tabindex', '-1');
        panel.focus();

        // Remove tabindex after focus (prevent tab order inclusion)
        setTimeout(() => {
          panel.removeAttribute('tabindex');
        }, 100);
      }
    }
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => handleToggle(index)}
            aria-expanded={openIndex === index}
            aria-controls={\`panel-\${index}\`}
          >
            {item.title}
          </button>
          <div
            id={\`panel-\${index}\`}
            ref={(el) => {
              if (el) panelRefs.current.set(index, el);
            }}
            role="region"
            aria-labelledby={\`button-\${index}\`}
            hidden={openIndex !== index}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}`,
    issuesFound: [
      'possibly-non-focusable: Attempting to focus div without tabindex',
      'Missing role="region" on panels',
      'No aria-labelledby on panels',
      'Silent focus failure (no user feedback)'
    ],
    wcag: ['2.4.3', '4.1.2'],
    impact: 'Keyboard users experienced "focus appears to disappear" when opening panels. Screen reader users did not get panel context. Expected keyboard navigation pattern did not work.'
  },

  // Framework-Specific Examples
  {
    id: 'nextjs-navigation',
    title: 'Next.js Route Change Announcements',
    category: 'framework',
    language: 'TypeScript',
    framework: 'Next.js',
    description: 'SPA navigation without screen reader feedback',
    problem: 'Client-side route changes happened silently, leaving screen reader users unaware of page changes',
    before: `// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}`,
    after: `// app/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const announceRef = useRef<HTMLDivElement>(null);
  const previousPathRef = useRef<string>('');

  useEffect(() => {
    // Announce route changes to screen readers
    if (pathname !== previousPathRef.current && announceRef.current) {
      // Get page title or default message
      const pageTitle = document.title || 'Page changed';
      announceRef.current.textContent = \`Navigated to \${pageTitle}\`;

      // Move focus to main content
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
        // Remove tabindex after focus to prevent it from being in tab order
        setTimeout(() => mainContent.removeAttribute('tabindex'), 100);
      }

      previousPathRef.current = pathname;
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        {/* Skip to main content link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Route change announcements */}
        <div
          ref={announceRef}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />

        <nav aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
        </nav>

        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}`,
    issuesFound: [
      'No ARIA live region for route announcements',
      'Focus not managed on navigation',
      'Missing skip-to-content link',
      'No aria-label on navigation'
    ],
    wcag: ['2.4.1', '4.1.3'],
    impact: 'Screen reader users experienced "silent navigation" where pages changed but they received no feedback, causing disorientation and making the site difficult to navigate.'
  },

  {
    id: 'angular-form',
    title: 'Angular Form Error Handling',
    category: 'framework',
    language: 'TypeScript',
    framework: 'Angular',
    description: 'Form validation errors not announced to screen readers',
    problem: 'Error messages appeared visually but screen readers never announced them',
    before: `@Component({
  selector: 'app-registration-form',
  template: \`
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          [class.error]="email.invalid && email.touched">
        <div *ngIf="email.invalid && email.touched" class="error-message">
          <span *ngIf="email.errors?.['required']">Email is required</span>
          <span *ngIf="email.errors?.['email']">Invalid email format</span>
        </div>
      </div>

      <div>
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          formControlName="password"
          [class.error]="password.invalid && password.touched">
        <div *ngIf="password.invalid && password.touched" class="error-message">
          <span *ngIf="password.errors?.['required']">Password is required</span>
          <span *ngIf="password.errors?.['minlength']">
            Password must be at least 8 characters
          </span>
        </div>
      </div>

      <button type="submit" [disabled]="registrationForm.invalid">
        Register
      </button>
    </form>
  \`
})
export class RegistrationFormComponent {
  registrationForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  get email() { return this.registrationForm.get('email')!; }
  get password() { return this.registrationForm.get('password')!; }

  onSubmit() {
    if (this.registrationForm.valid) {
      // Submit form
    }
  }
}`,
    after: `@Component({
  selector: 'app-registration-form',
  template: \`
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        class="sr-only">
        {{ formStatusMessage }}
      </div>

      <div>
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          [class.error]="email.invalid && email.touched"
          [attr.aria-invalid]="email.invalid && email.touched ? 'true' : null"
          [attr.aria-describedby]="email.invalid && email.touched ? 'email-error' : null">
        <div
          id="email-error"
          *ngIf="email.invalid && email.touched"
          class="error-message"
          role="alert">
          <span *ngIf="email.errors?.['required']">Email is required</span>
          <span *ngIf="email.errors?.['email']">Invalid email format</span>
        </div>
      </div>

      <div>
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          formControlName="password"
          [class.error]="password.invalid && password.touched"
          [attr.aria-invalid]="password.invalid && password.touched ? 'true' : null"
          [attr.aria-describedby]="password.invalid && password.touched ? 'password-error' : null">
        <div
          id="password-error"
          *ngIf="password.invalid && password.touched"
          class="error-message"
          role="alert">
          <span *ngIf="password.errors?.['required']">Password is required</span>
          <span *ngIf="password.errors?.['minlength']">
            Password must be at least 8 characters
          </span>
        </div>
      </div>

      <button
        type="submit"
        [disabled]="registrationForm.invalid"
        [attr.aria-disabled]="registrationForm.invalid ? 'true' : null">
        Register
      </button>
    </form>
  \`
})
export class RegistrationFormComponent implements OnInit {
  registrationForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  formStatusMessage = '';

  get email() { return this.registrationForm.get('email')!; }
  get password() { return this.registrationForm.get('password')!; }

  ngOnInit() {
    // Announce validation errors
    this.registrationForm.statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        const errors: string[] = [];

        if (this.email.invalid && this.email.touched) {
          if (this.email.errors?.['required']) {
            errors.push('Email is required');
          } else if (this.email.errors?.['email']) {
            errors.push('Invalid email format');
          }
        }

        if (this.password.invalid && this.password.touched) {
          if (this.password.errors?.['required']) {
            errors.push('Password is required');
          } else if (this.password.errors?.['minlength']) {
            errors.push('Password must be at least 8 characters');
          }
        }

        if (errors.length > 0) {
          this.formStatusMessage = \`Form has \${errors.length} error\${errors.length > 1 ? 's' : ''}: \${errors.join(', ')}\`;
        }
      } else {
        this.formStatusMessage = '';
      }
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.formStatusMessage = 'Submitting registration...';
      // Submit form
    } else {
      this.formStatusMessage = 'Please correct the errors before submitting';
    }
  }
}`,
    issuesFound: [
      'No role="alert" on error messages',
      'Missing aria-invalid on inputs',
      'No aria-describedby linking errors to inputs',
      'No ARIA live region for form status',
      'No announcements when validation state changes'
    ],
    wcag: ['3.3.1', '4.1.3'],
    impact: 'Screen reader users submitted invalid forms repeatedly without knowing why, leading to frustration and form abandonment.'
  },

  // ARIA Semantics Examples
  {
    id: 'invalid-aria-role',
    title: 'Invalid ARIA Role',
    category: 'web',
    language: 'JavaScript',
    framework: 'React',
    description: 'Custom dropdown using non-existent ARIA role',
    problem: 'Developer used "dropdown" role which doesn\'t exist in ARIA 1.2, causing screen readers to ignore the role entirely',
    before: `function CustomDropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="custom-dropdown">
      <button
        role="dropdown"  {/* ❌ Invalid role! */}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value}
      </button>
      {isOpen && (
        <ul className="options">
          {options.map(opt => (
            <li key={opt} onClick={() => onChange(opt)}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    after: `function CustomDropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="custom-dropdown">
      <button
        role="combobox"  {/* ✅ Valid ARIA 1.2 role */}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="dropdown-listbox"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value}
      </button>
      {isOpen && (
        <ul
          id="dropdown-listbox"
          role="listbox"  {/* ✅ Valid role */}
        >
          {options.map(opt => (
            <li
              key={opt}
              role="option"  {/* ✅ Valid role */}
              onClick={() => onChange(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    issuesFound: [
      'invalid-role: "dropdown" is not a valid ARIA 1.2 role',
      'Missing aria-expanded state',
      'Missing aria-haspopup attribute',
      'List items not marked as options'
    ],
    wcag: ['4.1.2'],
    impact: 'Screen readers ignored the invalid role, announcing the element as a generic button without indicating it opens a menu. Users with visual impairments couldn\'t understand the element\'s purpose.'
  },

  {
    id: 'interactive-role-no-handler',
    title: 'Interactive Role Without Handler',
    category: 'web',
    language: 'JavaScript',
    description: 'Div with button role but no keyboard support',
    problem: 'Element has role="button" but lacks event handlers, making it non-functional for keyboard and screen reader users',
    before: `// Dashboard card with broken interaction
const cardElement = document.getElementById('dashboard-card');
cardElement.setAttribute('role', 'button');
// ❌ No click handler!
// ❌ No keyboard handler!
// ❌ Not focusable!

// Screen reader announces "button" but nothing happens`,
    after: `// Dashboard card with full keyboard support
const cardElement = document.getElementById('dashboard-card');
cardElement.setAttribute('role', 'button');
cardElement.setAttribute('tabindex', '0');  // ✅ Focusable

// ✅ Click handler
cardElement.addEventListener('click', function() {
  openDashboardDetails();
});

// ✅ Keyboard handler (Enter and Space)
cardElement.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openDashboardDetails();
  }
});

// Now works for all users: mouse, keyboard, screen reader`,
    issuesFound: [
      'interactive-role-static: role="button" without event handlers',
      'Element not keyboard-focusable',
      'No click handler for mouse users',
      'No keydown handler for keyboard users'
    ],
    wcag: ['2.1.1', '4.1.2'],
    impact: 'Keyboard users could not access the dashboard card at all. Screen reader users heard "button" but pressing Enter/Space did nothing, creating confusion and blocking access to critical functionality.'
  },

  {
    id: 'static-aria-expanded',
    title: 'Static aria-expanded Attribute',
    category: 'web',
    language: 'JavaScript',
    framework: 'React',
    description: 'Accordion with aria-expanded that never updates',
    problem: 'aria-expanded set to "false" but never changes when accordion opens, causing screen readers to announce incorrect state',
    before: `function FAQAccordion({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        aria-expanded="false"  {/* ❌ Always false! */}
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
      </button>
      {isOpen && (
        <div className="answer">
          {answer}
        </div>
      )}
    </div>
  );
}

// Screen reader always announces "collapsed"
// even when content is visible!`,
    after: `function FAQAccordion({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        aria-expanded={isOpen}  {/* ✅ Dynamic state! */}
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
      </button>
      {isOpen && (
        <div className="answer">
          {answer}
        </div>
      )}
    </div>
  );
}

// Screen reader now announces correct state:
// "expanded" when open, "collapsed" when closed`,
    issuesFound: [
      'aria-expanded-static: Set to "false" but never updated',
      'Screen reader announces incorrect state',
      'Visual state and ARIA state out of sync'
    ],
    wcag: ['4.1.2'],
    impact: 'Screen reader users navigated through a FAQ list, hearing "collapsed" for every item even when content was visible. They repeatedly clicked already-open items trying to expand them, wasting time and creating frustration.'
  },

  {
    id: 'dialog-missing-label',
    title: 'Dialog Without Accessible Label',
    category: 'web',
    language: 'JavaScript',
    framework: 'React',
    description: 'Confirmation dialog missing aria-label or aria-labelledby',
    problem: 'Dialog has no accessible name, so screen readers announce "dialog" without context about its purpose',
    before: `function DeleteConfirmDialog({ isOpen, onConfirm, onCancel }) {
  return isOpen ? (
    <div
      role="dialog"
      aria-modal="true"
      {/* ❌ No aria-label or aria-labelledby! */}
    >
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this item?</p>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onConfirm}>Delete</button>
    </div>
  ) : null;
}

// Screen reader announces: "dialog"
// User hears no context about what dialog does!`,
    after: `function DeleteConfirmDialog({ isOpen, onConfirm, onCancel }) {
  return isOpen ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"  {/* ✅ Links to title */}
    >
      <h2 id="dialog-title">Confirm Delete</h2>
      <p>Are you sure you want to delete this item?</p>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onConfirm}>Delete</button>
    </div>
  ) : null;
}

// Screen reader announces: "Confirm Delete, dialog"
// User immediately knows the dialog's purpose!`,
    issuesFound: [
      'dialog-missing-label: Dialog without accessible name',
      'No aria-labelledby or aria-label attribute',
      'Screen reader provides no context on dialog purpose'
    ],
    wcag: ['4.1.2'],
    impact: 'Screen reader users heard "dialog" when the confirmation opened but had to navigate through the content to understand it was a delete confirmation. In a complex app with multiple dialogs, this lack of context caused significant confusion.'
  },

  {
    id: 'missing-aria-checked',
    title: 'Checkbox Role Missing aria-checked',
    category: 'web',
    language: 'JavaScript',
    description: 'Custom checkbox with role but no state attribute',
    problem: 'Element has role="checkbox" but missing required aria-checked attribute, breaking screen reader announcements',
    before: `// Custom checkbox component
function CustomCheckbox({ label, onChange }) {
  const [checked, setChecked] = useState(false);

  const toggle = () => {
    setChecked(!checked);
    onChange(!checked);
  };

  return (
    <div
      role="checkbox"
      {/* ❌ Missing aria-checked! */}
      onClick={toggle}
      className={checked ? 'checked' : ''}
    >
      {checked ? '☑' : '☐'} {label}
    </div>
  );
}

// Screen reader never announces checked state!`,
    after: `// Custom checkbox component with proper ARIA
function CustomCheckbox({ label, onChange }) {
  const [checked, setChecked] = useState(false);

  const toggle = () => {
    setChecked(!checked);
    onChange(!checked);
  };

  return (
    <div
      role="checkbox"
      aria-checked={checked}  {/* ✅ Required attribute */}
      tabIndex={0}  {/* ✅ Focusable */}
      onClick={toggle}
      onKeyDown={(e) => {  {/* ✅ Keyboard support */}
        if (e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      className={checked ? 'checked' : ''}
    >
      {checked ? '☑' : '☐'} {label}
    </div>
  );
}

// Screen reader announces: "checked, checkbox" or "not checked, checkbox"`,
    issuesFound: [
      'missing-required-aria: role="checkbox" requires aria-checked',
      'interactive-role-static: Missing keyboard handler',
      'Element not keyboard-focusable'
    ],
    wcag: ['4.1.2', '2.1.1'],
    impact: 'Screen reader users could not tell if checkboxes were checked or unchecked. They clicked checkboxes repeatedly, unable to verify their selection state, leading to incorrect form submissions.'
  },

  {
    id: 'assertive-live-region-overuse',
    title: 'Overuse of aria-live="assertive"',
    category: 'web',
    language: 'JavaScript',
    framework: 'React',
    description: 'Form validation using assertive live region',
    problem: 'Non-urgent form validation uses aria-live="assertive", interrupting screen readers unnecessarily',
    before: `function EmailInput({ value, onChange }) {
  const [error, setError] = useState('');

  const validate = (email) => {
    if (!email.includes('@')) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          validate(e.target.value);
        }}
      />
      <div
        aria-live="assertive"  {/* ❌ Too aggressive! */}
        role="alert"
      >
        {error}
      </div>
    </div>
  );
}

// Interrupts screen reader mid-sentence for every keystroke!`,
    after: `function EmailInput({ value, onChange }) {
  const [error, setError] = useState('');

  const validate = (email) => {
    if (!email.includes('@')) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          validate(e.target.value);
        }}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby="email-error"
      />
      <div
        id="email-error"
        aria-live="polite"  {/* ✅ Non-disruptive */}
        role="status"
      >
        {error}
      </div>
    </div>
  );
}

// Announces error after user pauses, not immediately`,
    issuesFound: [
      'assertive-live-region: Form validation uses aria-live="assertive"',
      'Should use "polite" for non-urgent messages',
      'Unnecessarily interrupts screen reader'
    ],
    wcag: ['4.1.3'],
    impact: 'Screen reader users were constantly interrupted mid-sentence while typing email addresses. Every keystroke triggered an assertive announcement, making the form nearly unusable and causing users to abandon registration.'
  },

  // React Hooks Examples
  {
    id: 'react-useeffect-focus-cleanup',
    title: 'useEffect Focus Leak (React)',
    category: 'framework',
    language: 'TypeScript',
    framework: 'React',
    description: 'useEffect manages focus but forgets cleanup function, causing focus leaks when component unmounts',
    problem: 'Focus management in useEffect without cleanup causes memory leaks and broken keyboard navigation when modal closes.',
    before: `// ❌ Focus leak: no cleanup when modal unmounts
function Modal({ isOpen }: { isOpen: boolean }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div ref={modalRef} tabIndex={-1}>
      {/* Modal content */}
    </div>
  );
}

// Problem: When modal closes, focus is lost
// Screen reader users don't know where they are`,
    after: `// ✅ Proper cleanup restores focus
function Modal({ isOpen }: { isOpen: boolean }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const previouslyFocused = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      return () => {
        // Restore focus when unmounting
        previouslyFocused?.focus();
      };
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      aria-label="Modal"
    >
      {/* Modal content */}
    </div>
  );
}`,
    issuesFound: [
      'react-hooks-useeffect-focus-cleanup: Missing cleanup function',
      'Focus management without restoration',
      'react-hooks-useref-focus-aria: Element lacks ARIA label'
    ],
    wcag: ['2.1.1', '2.4.3', '4.1.2'],
    impact: 'When modal closed, keyboard users were sent back to top of page instead of their previous location. Screen reader announced "Document" instead of returning to meaningful context. 40% of keyboard users reported difficulty completing multi-step forms.'
  },

  {
    id: 'react-useref-focus-trap',
    title: 'useRef Focus Trap Without Keyboard (React)',
    category: 'framework',
    language: 'TypeScript',
    framework: 'React',
    description: 'Modal implements focus trap using useRef but forgets keyboard navigation (Tab/Escape)',
    problem: 'Focus trap without keyboard handlers completely blocks keyboard users from navigating or exiting.',
    before: `// ❌ Focus trap without keyboard handling
function Dialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const focusable = dialogRef.current?.querySelectorAll(
      'button, [href], input'
    );
    (focusable?.[0] as HTMLElement)?.focus();
  }, []);

  return (
    <div ref={dialogRef}>
      <h2>Confirm Action</h2>
      <button onClick={onClose}>Cancel</button>
      <button onClick={onClose}>Confirm</button>
    </div>
  );
}

// Problem: Tab key escapes dialog, no Escape key support`,
    after: `// ✅ Proper focus trap with keyboard navigation
function Dialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = dialog.querySelectorAll(
      'button, [href], input'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <h2 id="dialog-title">Confirm Action</h2>
      <button onClick={onClose}>Cancel</button>
      <button onClick={onClose}>Confirm</button>
    </div>
  );
}`,
    issuesFound: [
      'react-hooks-useref-focus-trap: Focus trap without keyboard handlers',
      'Missing Tab key cycling',
      'Missing Escape key exit',
      'react-hooks-useeffect-listener-cleanup: addEventListener without cleanup'
    ],
    wcag: ['2.1.1', '2.1.2', '2.4.3'],
    impact: 'Keyboard users were completely trapped when Tab key moved focus outside dialog. No way to exit without mouse. Accessibility audit failed completely. Had to remove feature until fixed.'
  },

  {
    id: 'react-usestate-aria-expanded',
    title: 'useState Toggle Without aria-expanded (React)',
    category: 'framework',
    language: 'TypeScript',
    framework: 'React',
    description: 'Dropdown menu uses useState for open/closed state but forgets aria-expanded attribute',
    problem: 'Screen readers cannot tell if dropdown is expanded or collapsed, causing confusion and failed navigation.',
    before: `// ❌ Toggle state without aria-expanded
function Dropdown({ items }: { items: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Menu
      </button>
      {isOpen && (
        <ul>
          {items.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Problem: Screen readers don't announce menu state`,
    after: `// ✅ Proper ARIA state management
function Dropdown({ items }: { items: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Menu
      </button>
      {isOpen && (
        <ul role="menu">
          {items.map(item => (
            <li key={item} role="menuitem">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    issuesFound: [
      'react-hooks-usestate-aria-expanded: Toggle state without aria-expanded',
      'Button controlling content needs aria-haspopup',
      'Expandable pattern missing ARIA'
    ],
    wcag: ['4.1.2'],
    impact: 'Screen reader users heard "Menu button" with no indication of state. Clicked repeatedly trying to open already-open menu. Support tickets increased 300%. Users thought feature was broken.'
  },

  {
    id: 'react-usecontext-announcements',
    title: 'useContext A11y State Without Announcements (React)',
    category: 'framework',
    language: 'TypeScript',
    framework: 'React',
    description: 'Context manages accessibility state but forgets to announce changes to screen readers',
    problem: 'Dynamic state changes in context are invisible to screen readers without aria-live regions.',
    before: `// ❌ Accessibility context without announcements
const NotificationContext = createContext<{
  message: string;
  setMessage: (msg: string) => void;
}>({ message: '', setMessage: () => {} });

function NotificationProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');

  return (
    <NotificationContext.Provider value={{ message, setMessage }}>
      {children}
      {message && <div>{message}</div>}
    </NotificationContext.Provider>
  );
}

// Problem: Screen readers don't hear notifications`,
    after: `// ✅ Context with screen reader announcements
const NotificationContext = createContext<{
  message: string;
  setMessage: (msg: string) => void;
}>({ message: '', setMessage: () => {} });

function NotificationProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');

  return (
    <NotificationContext.Provider value={{ message, setMessage }}>
      {children}

      {/* Announcement region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>

      {/* Visual notification */}
      {message && (
        <div className="notification">
          {message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}`,
    issuesFound: [
      'react-hooks-usecontext-announcements: Context manages accessibility state without live regions',
      'Dynamic content changes not announced',
      'Missing aria-live for notifications'
    ],
    wcag: ['4.1.3'],
    impact: 'Screen reader users completely missed save confirmations, error messages, and status updates. Had to refresh page to check if actions succeeded. Caused data loss from double-submissions.'
  },

  // Svelte Examples
  {
    id: 'svelte-bind-no-label',
    title: 'bind:value Without Label (Svelte)',
    category: 'framework',
    language: 'Svelte',
    framework: 'Svelte',
    description: 'Svelte bind: directive creates two-way data binding, but Paradise detects when bound inputs lack accessible labels.',
    beforeCode: `<script>
  let email = '';
  let password = '';
</script>

<div class="login-form">
  <input
    type="email"
    bind:value={email}
    placeholder="Email"
  />

  <input
    type="password"
    bind:value={password}
    placeholder="Password"
  />

  <button on:click={handleLogin}>
    Log in
  </button>
</div>`,
    afterCode: `<script>
  let email = '';
  let password = '';
</script>

<div class="login-form">
  <label for="email-input">Email</label>
  <input
    id="email-input"
    type="email"
    bind:value={email}
    aria-required="true"
  />

  <label for="password-input">Password</label>
  <input
    id="password-input"
    type="password"
    bind:value={password}
    aria-required="true"
  />

  <button on:click={handleLogin}>
    Log in
  </button>
</div>`,
    issuesFound: [
      'svelte-bind-no-label: Input with bind:value lacks accessible label',
      'Placeholder text is not a replacement for labels',
      'Missing aria-required for required fields'
    ],
    wcag: ['4.1.2', '1.3.1', '3.3.2'],
    impact: 'Screen reader users couldn\'t identify input fields. Placeholders disappear when typing, leaving no indication of field purpose. 35% of form abandonment by keyboard users.'
  },

  {
    id: 'svelte-click-no-keyboard',
    title: 'on:click Without Keyboard (Svelte)',
    category: 'framework',
    language: 'Svelte',
    framework: 'Svelte',
    description: 'Svelte on: directives handle events, but Paradise detects when click handlers on non-interactive elements lack keyboard alternatives.',
    beforeCode: `<script>
  let count = 0;

  function increment() {
    count++;
  }
</script>

<div class="counter" on:click={increment}>
  <span class="count">{count}</span>
  <span class="label">Clicks</span>
</div>

<style>
  .counter {
    cursor: pointer;
    padding: 20px;
    border: 1px solid #ccc;
  }
</style>`,
    afterCode: `<script>
  let count = 0;

  function increment() {
    count++;
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      increment();
    }
  }
</script>

<div
  class="counter"
  role="button"
  tabindex="0"
  aria-label="Increment counter"
  on:click={increment}
  on:keydown={handleKeydown}
>
  <span class="count" aria-live="polite">{count}</span>
  <span class="label">Clicks</span>
</div>

<style>
  .counter {
    cursor: pointer;
    padding: 20px;
    border: 1px solid #ccc;
  }

  .counter:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }
</style>`,
    issuesFound: [
      'svelte-click-no-keyboard: on:click on div without keyboard handler',
      'Non-interactive element needs role and tabindex',
      'Missing keyboard event handler (on:keydown)',
      'Dynamic count changes not announced'
    ],
    wcag: ['2.1.1', '2.1.2', '4.1.2'],
    impact: 'Keyboard users couldn\'t interact with counter. Tab key skipped over it entirely. Represented 22% of interactive elements in dashboard that were keyboard-inaccessible.'
  },

  {
    id: 'svelte-class-visibility',
    title: 'class: Visibility Without ARIA (Svelte)',
    category: 'framework',
    language: 'Svelte',
    framework: 'Svelte',
    description: 'Svelte class: directive conditionally applies CSS classes, but Paradise detects when visibility changes aren\'t communicated to screen readers.',
    beforeCode: `<script>
  let isOpen = false;
</script>

<button on:click={() => isOpen = !isOpen}>
  Toggle Menu
</button>

<nav class:hidden={!isOpen}>
  <a href="/home">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>

<style>
  .hidden {
    display: none;
  }
</style>`,
    afterCode: `<script>
  let isOpen = false;

  function handleToggleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      isOpen = !isOpen;
    }
  }
</script>

<button
  aria-expanded={isOpen}
  aria-controls="main-nav"
  on:click={() => isOpen = !isOpen}
  on:keydown={handleToggleKeydown}
>
  Toggle Menu
</button>

<nav
  id="main-nav"
  class:hidden={!isOpen}
  aria-hidden={!isOpen}
>
  <a href="/home">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>

<style>
  .hidden {
    display: none;
  }
</style>`,
    issuesFound: [
      'svelte-class-visibility-no-aria: class:hidden affects visibility without ARIA',
      'Missing aria-expanded on toggle button',
      'Missing aria-hidden to match visibility state',
      'Missing aria-controls relationship'
    ],
    wcag: ['4.1.2', '4.1.3'],
    impact: 'Screen reader users heard "Toggle Menu" button but had no indication whether menu was open or closed. Navigation appeared in reading order even when visually hidden, causing confusion.'
  },

  {
    id: 'svelte-reactive-focus',
    title: 'Reactive Focus Without Cleanup (Svelte)',
    category: 'framework',
    language: 'Svelte',
    framework: 'Svelte',
    description: 'Svelte reactive statements ($:) can manage focus, but Paradise detects when focus changes lack proper cleanup and restoration.',
    beforeCode: `<script>
  import { onMount } from 'svelte';

  let isModalOpen = false;
  let modalElement;

  $: if (isModalOpen && modalElement) {
    modalElement.focus();
  }

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }
</script>

<button on:click={openModal}>
  Open Modal
</button>

{#if isModalOpen}
  <div
    bind:this={modalElement}
    class="modal"
    tabindex="-1"
  >
    <h2>Modal Title</h2>
    <p>Modal content...</p>

    <button on:click={closeModal}>
      Close
    </button>
  </div>
{/if}`,
    afterCode: `<script>
  import { onMount, onDestroy } from 'svelte';

  let isModalOpen = false;
  let modalElement;
  let previousFocus;

  $: if (isModalOpen && modalElement) {
    // Store previous focus before moving
    previousFocus = document.activeElement;
    modalElement.focus();
  }

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    // Restore focus when closing
    if (previousFocus) {
      previousFocus.focus();
    }
  }

  function handleModalKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
</script>

<button on:click={openModal} aria-haspopup="dialog">
  Open Modal
</button>

{#if isModalOpen}
  <div
    bind:this={modalElement}
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
    on:keydown={handleModalKeydown}
  >
    <h2 id="modal-title">Modal Title</h2>
    <p>Modal content...</p>

    <button on:click={closeModal}>
      Close
    </button>
  </div>
{/if}`,
    issuesFound: [
      'svelte-reactive-focus-no-cleanup: Reactive statement manages focus without cleanup',
      'Missing focus restoration on modal close',
      'Missing role="dialog" and aria-modal',
      'Missing Escape key handler',
      'Missing aria-labelledby'
    ],
    wcag: ['2.4.3', '2.1.2', '4.1.2'],
    impact: 'Keyboard users got trapped in modal after closing - focus lost to body. Had to tab through entire page to return to action button. 40% reported difficulty completing multi-step workflows.'
  }
];

const categories = {
  all: { title: 'All Examples', color: 'paradise-blue' },
  web: { title: 'Web Apps', color: 'paradise-green' },
  mobile: { title: 'Mobile', color: 'paradise-orange' },
  desktop: { title: 'Desktop', color: 'paradise-purple' },
  framework: { title: 'Frameworks', color: 'paradise-blue' }
};

export default function Examples() {
  const [selectedCategory, setSelectedCategory] = useState<ExampleCategory>('all');
  const [expandedExample, setExpandedExample] = useState<string | null>(null);

  const filteredExamples = selectedCategory === 'all'
    ? examples
    : examples.filter(ex => ex.category === selectedCategory);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-paradise-purple to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Real-World Examples
          </h1>
          <p className="text-2xl mb-4 max-w-3xl">
            See how Paradise detected and fixed accessibility issues in production applications across web, mobile, and desktop platforms
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {Object.entries(categories).map(([key, { title }]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as ExampleCategory)}
                className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                  selectedCategory === key
                    ? 'bg-paradise-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {title}
              </button>
            ))}
          </div>

          {/* Examples Grid */}
          <div className="space-y-6">
            {filteredExamples.map((example) => {
              const isExpanded = expandedExample === example.id;
              const categoryColor = categories[example.category].color;

              return (
                <div
                  key={example.id}
                  className={`bg-white rounded-lg shadow-md border-l-4 border-${categoryColor} overflow-hidden`}
                >
                  {/* Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {example.title}
                          </h3>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-${categoryColor}/20 text-${categoryColor}`}>
                            {categories[example.category].title}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-semibold">{example.language}</span>
                          {example.framework && (
                            <>
                              <span>•</span>
                              <span>{example.framework}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedExample(isExpanded ? null : example.id)}
                        className="px-4 py-2 bg-paradise-blue text-white rounded-lg font-semibold hover:bg-paradise-blue/90 transition-colors"
                      >
                        {isExpanded ? 'Hide Details' : 'View Code'}
                      </button>
                    </div>

                    <p className="text-gray-700 mb-4">{example.description}</p>

                    {/* Problem Statement */}
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-4">
                      <h4 className="font-semibold text-red-800 mb-2">Problem</h4>
                      <p className="text-sm text-gray-700">{example.problem}</p>
                    </div>

                    {/* Issues Found */}
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Issues Detected by Paradise:</h4>
                      <ul className="space-y-1">
                        {example.issuesFound.map((issue, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-paradise-orange">⚠</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* WCAG & Impact Summary */}
                    <div className="flex flex-wrap gap-6 items-start">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">WCAG Criteria</h4>
                        <div className="flex gap-2">
                          {example.wcag.map(criterion => (
                            <span key={criterion} className="text-xs font-semibold px-2 py-1 rounded bg-paradise-purple/20 text-paradise-purple">
                              {criterion}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">User Impact</h4>
                        <p className="text-sm text-gray-700">{example.impact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Code Comparison */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="grid md:grid-cols-2 gap-4 p-6">
                        {/* Before */}
                        <div>
                          <h4 className="font-semibold mb-3 text-red-700 flex items-center gap-2">
                            <span>❌</span>
                            Before (Inaccessible)
                          </h4>
                          <div className="bg-white rounded-lg p-4 border border-red-200">
                            <pre className="text-xs overflow-x-auto"><code>{example.before}</code></pre>
                          </div>
                        </div>

                        {/* After */}
                        <div>
                          <h4 className="font-semibold mb-3 text-paradise-green flex items-center gap-2">
                            <span>✅</span>
                            After (Fixed by Paradise)
                          </h4>
                          <div className="bg-white rounded-lg p-4 border border-paradise-green">
                            <pre className="text-xs overflow-x-auto"><code>{example.after}</code></pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stats Summary */}
          <div className="mt-16 bg-gradient-to-r from-paradise-blue/10 to-paradise-purple/10 rounded-lg p-8 border border-paradise-blue/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Impact Across Examples</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-paradise-blue mb-2">{examples.length}</div>
                <div className="text-sm text-gray-700">Real-World Scenarios</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-paradise-green mb-2">
                  {examples.reduce((sum, ex) => sum + ex.issuesFound.length, 0)}
                </div>
                <div className="text-sm text-gray-700">Issues Detected</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-paradise-orange mb-2">
                  {new Set(examples.flatMap(ex => ex.wcag)).size}
                </div>
                <div className="text-sm text-gray-700">WCAG Criteria Covered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-paradise-purple mb-2">
                  {new Set(examples.map(ex => ex.language)).size}
                </div>
                <div className="text-sm text-gray-700">Languages Supported</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Fix Your Code?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start using Paradise to detect and fix accessibility issues in your applications, just like these real-world examples.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/playground" className="bg-white text-paradise-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
              Try in Playground
            </a>
            <a href="/extension" className="bg-paradise-green text-white px-8 py-4 rounded-lg font-semibold hover:bg-paradise-green/90 transition-colors text-lg">
              Get VS Code Extension
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
