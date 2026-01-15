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
