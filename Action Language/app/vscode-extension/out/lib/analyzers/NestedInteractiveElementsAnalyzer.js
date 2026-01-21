"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedInteractiveElementsAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class NestedInteractiveElementsAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'NestedInteractiveElementsAnalyzer';
        this.description = 'Detects nested interactive elements that create focus conflicts and broken keyboard navigation';
        this.INTERACTIVE_ELEMENTS = new Set([
            'a',
            'button',
            'input',
            'select',
            'textarea',
            'audio',
            'video',
            'details',
            'embed',
            'iframe',
            'label'
        ]);
        this.INTERACTIVE_ROLES = new Set([
            'button',
            'link',
            'checkbox',
            'radio',
            'textbox',
            'searchbox',
            'combobox',
            'listbox',
            'option',
            'menuitem',
            'menuitemcheckbox',
            'menuitemradio',
            'tab',
            'switch',
            'slider',
            'spinbutton',
            'gridcell'
        ]);
    }
    analyze(context) {
        const issues = [];
        if (!context.documentModel || !context.documentModel.dom) {
            return issues;
        }
        const allElements = context.documentModel.getAllElements();
        for (const element of allElements) {
            if (this.isInteractive(element)) {
                this.checkForNestedInteractive(element, allElements, context, issues);
            }
        }
        return issues;
    }
    isInteractive(element) {
        if (this.INTERACTIVE_ELEMENTS.has(element.tagName)) {
            if (element.tagName === 'a' && !element.attributes.href) {
                return false;
            }
            if (element.tagName === 'input' && element.attributes.type === 'hidden') {
                return false;
            }
            return true;
        }
        const role = element.attributes.role;
        if (role && this.INTERACTIVE_ROLES.has(role)) {
            return true;
        }
        const elementContext = element.metadata?.elementContext;
        if (elementContext?.jsHandlers && elementContext.jsHandlers.length > 0) {
            return true;
        }
        return false;
    }
    checkForNestedInteractive(element, allElements, context, issues) {
        const descendants = this.getDescendants(element, allElements);
        for (const descendant of descendants) {
            if (this.isInteractive(descendant)) {
                this.reportNestedInteractive(element, descendant, context, issues);
            }
        }
    }
    reportNestedInteractive(parent, child, context, issues) {
        const parentType = this.getInteractiveType(parent);
        const childType = this.getInteractiveType(child);
        const severity = this.getSeverity(parent, child);
        const issueType = this.getIssueType(parent, child);
        const parentName = this.getElementName(parent);
        const childName = this.getElementName(child);
        issues.push(this.createIssue(issueType, severity, `${parentType} contains nested ${childType}. ${parentName} contains ${childName}. Nested interactive elements create focus conflicts and confuse screen readers. Only the outer element will be keyboard accessible. Move the inner interactive element outside or remove its interactive behavior.`, parent.location, ['2.1.1'], context, {
            elementContext: context.documentModel?.getElementContext(parent),
            fix: {
                description: this.getFixDescription(parent, child),
                code: this.getFixCode(parent, child),
                location: parent.location
            }
        }));
    }
    getSeverity(parent, child) {
        if ((parent.tagName === 'a' && (child.tagName === 'button' || child.attributes.role === 'button')) ||
            (parent.tagName === 'button' && (child.tagName === 'a' || child.attributes.role === 'link'))) {
            return 'error';
        }
        if (parent.tagName === 'a' && child.tagName === 'a') {
            return 'error';
        }
        if (parent.tagName === 'button' && child.tagName === 'button') {
            return 'error';
        }
        if (parent.tagName === 'label') {
            return 'warning';
        }
        return 'warning';
    }
    getIssueType(parent, child) {
        if (parent.tagName === 'a' && child.tagName === 'button') {
            return 'button-inside-link';
        }
        if (parent.tagName === 'button' && child.tagName === 'a') {
            return 'link-inside-button';
        }
        if (parent.tagName === 'a' && child.tagName === 'a') {
            return 'nested-links';
        }
        if (parent.tagName === 'button' && child.tagName === 'button') {
            return 'nested-buttons';
        }
        if (parent.tagName === 'label') {
            return 'interactive-inside-label';
        }
        return 'nested-interactive-elements';
    }
    getInteractiveType(element) {
        const role = element.attributes.role;
        if (element.tagName === 'a')
            return 'Link';
        if (element.tagName === 'button')
            return 'Button';
        if (element.tagName === 'input')
            return 'Input';
        if (element.tagName === 'select')
            return 'Select';
        if (element.tagName === 'textarea')
            return 'Textarea';
        if (element.tagName === 'label')
            return 'Label';
        if (role === 'button')
            return 'Button (ARIA)';
        if (role === 'link')
            return 'Link (ARIA)';
        if (role === 'checkbox')
            return 'Checkbox (ARIA)';
        if (role === 'radio')
            return 'Radio (ARIA)';
        if (role)
            return `${role} (ARIA)`;
        return 'Interactive element';
    }
    getElementName(element) {
        const ariaLabel = element.attributes['aria-label'];
        if (ariaLabel)
            return `"${ariaLabel}"`;
        const textContent = this.getSimpleTextContent(element);
        if (textContent && textContent.length < 50) {
            return `"${textContent}"`;
        }
        if (element.tagName === 'a' && element.attributes.href) {
            return `href="${element.attributes.href}"`;
        }
        if (element.attributes.id) {
            return `id="${element.attributes.id}"`;
        }
        if (element.attributes.class) {
            const firstClass = element.attributes.class.split(' ')[0];
            return `class="${firstClass}"`;
        }
        return 'element';
    }
    getSimpleTextContent(element) {
        if (element.textContent) {
            return element.textContent.trim().substring(0, 50);
        }
        if (element.children && element.children.length > 0) {
            const firstChild = element.children[0];
            if (firstChild.textContent) {
                return firstChild.textContent.trim().substring(0, 50);
            }
        }
        return '';
    }
    getFixDescription(parent, child) {
        if (parent.tagName === 'a' && child.tagName === 'button') {
            return `Remove the nested button or restructure:

Option 1: Use only the link (remove button)
<a href="/action">Action Text</a>

Option 2: Use only the button (remove link)
<button onclick="location.href='/action'">Action Text</button>

Option 3: Separate them (recommended)
<div>
  <a href="/action">Link Text</a>
  <button>Button Text</button>
</div>`;
        }
        if (parent.tagName === 'button' && child.tagName === 'a') {
            return `Remove the nested link or restructure:

Option 1: Use only the button
<button onclick="handleAction()">Action Text</button>

Option 2: Use only the link
<a href="/action">Action Text</a>

Option 3: Separate them (recommended)
<div>
  <button>Button Text</button>
  <a href="/link">Link Text</a>
</div>`;
        }
        if (parent.tagName === 'a' && child.tagName === 'a') {
            return `Remove nested link:

Bad (nested):
<a href="/parent">
  Parent link
  <a href="/child">Child link</a>
</a>

Good (separate):
<div>
  <a href="/parent">Parent link</a>
  <a href="/child">Child link</a>
</div>`;
        }
        if (parent.tagName === 'label') {
            return `Move interactive element outside label:

Bad (button inside label):
<label>
  Name:
  <input type="text" name="name">
  <button>Clear</button>
</label>

Good (separate):
<div>
  <label>
    Name:
    <input type="text" name="name">
  </label>
  <button>Clear</button>
</div>`;
        }
        return `Restructure to avoid nesting interactive elements. Each interactive element should be a separate, non-nested element.`;
    }
    getFixCode(parent, child) {
        if (parent.tagName === 'a' && child.tagName === 'button') {
            return `<!-- Option 1: Use only the link -->
<a href="/action">Action Text</a>

<!-- Option 2: Use only the button with navigation -->
<button onclick="location.href='/action'">Action Text</button>`;
        }
        if (parent.tagName === 'button' && child.tagName === 'a') {
            return `<!-- Option 1: Use only the button -->
<button onclick="handleAction()">Action Text</button>

<!-- Option 2: Use only the link -->
<a href="/action">Action Text</a>`;
        }
        return `<!-- Separate the interactive elements -->
<div>
  <!-- First interactive element -->
  <!-- Second interactive element -->
</div>`;
    }
    getDescendants(element, _allElements) {
        const descendants = [];
        if (element.children) {
            for (const child of element.children) {
                descendants.push(child);
                descendants.push(...this.getDescendants(child, _allElements));
            }
        }
        return descendants;
    }
}
exports.NestedInteractiveElementsAnalyzer = NestedInteractiveElementsAnalyzer;
