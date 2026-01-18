"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadingStructureAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class HeadingStructureAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'HeadingStructureAnalyzer';
        this.description = 'Detects accessibility issues in heading hierarchy and structure';
        this.MAX_HEADING_LENGTH = 60;
        this.NEAR_LIMIT_THRESHOLD = 40;
    }
    analyze(context) {
        const issues = [];
        if (!this.supportsDocumentModel(context)) {
            return issues;
        }
        const headings = this.extractHeadings(context);
        if (headings.length === 0) {
            issues.push(this.createIssue('no-headings-on-page', 'error', 'Page contains no heading elements. Headings provide structure and enable navigation for screen reader users.', { file: '', line: 1, column: 1 }, ['1.3.1', '2.4.6'], context, {
                fix: {
                    description: 'Add headings to structure your content',
                    code: `<h1>Page Title</h1>
<h2>Main Section</h2>
<h3>Subsection</h3>`,
                    location: { file: '', line: 1, column: 1 }
                }
            }));
            return issues;
        }
        issues.push(...this.analyzeH1(headings, context));
        issues.push(...this.analyzeHierarchy(headings, context));
        for (const heading of headings) {
            if (heading.isEmpty) {
                issues.push(this.createIssue('empty-heading', 'error', `Heading level ${heading.level} contains no text content. Screen readers will announce it as empty, causing confusion.`, heading.element.location, ['2.4.6', '1.3.1'], context, {
                    fix: {
                        description: 'Add descriptive text to the heading or remove it',
                        code: `<h${heading.level}>Descriptive Section Title</h${heading.level}>`,
                        location: heading.element.location
                    }
                }));
            }
            if (heading.isHidden && !heading.isEmpty) {
                issues.push(this.createIssue('hidden-heading', 'warning', `Heading level ${heading.level} is hidden with display:none or visibility:hidden. Hidden headings may be read inconsistently by screen readers.`, heading.element.location, ['1.3.1'], context, {
                    fix: {
                        description: 'Make the heading visible or remove it',
                        code: `<!-- Remove display:none/visibility:hidden -->
<h${heading.level}>${heading.text}</h${heading.level}>

<!-- OR use visually-hidden technique if needed for screen readers only -->
<h${heading.level} class="sr-only">${heading.text}</h${heading.level}>`,
                        location: heading.element.location
                    }
                }));
            }
            if (heading.text.length > this.MAX_HEADING_LENGTH) {
                issues.push(this.createIssue('heading-too-long', 'warning', `Heading level ${heading.level} is ${heading.text.length} characters long (recommended: <${this.MAX_HEADING_LENGTH}). Long headings are difficult to scan and navigate.`, heading.element.location, ['2.4.6'], context, {
                    fix: {
                        description: 'Shorten the heading to make it more concise',
                        code: `<h${heading.level}>Concise Descriptive Title</h${heading.level}>

<!-- If more detail needed, use a paragraph: -->
<h${heading.level}>Section Title</h${heading.level}>
<p>Additional explanatory text can go here.</p>`,
                        location: heading.element.location
                    }
                }));
            }
            else if (heading.text.length >= this.NEAR_LIMIT_THRESHOLD && heading.text.length <= this.MAX_HEADING_LENGTH) {
                issues.push(this.createIssue('heading-near-length-limit', 'info', `Heading level ${heading.level} is ${heading.text.length} characters long, approaching the recommended limit of ${this.MAX_HEADING_LENGTH}. Consider shortening for better scannability.`, heading.element.location, ['2.4.6'], context));
            }
        }
        issues.push(...this.analyzeAriaLevel(context));
        return issues;
    }
    extractHeadings(context) {
        const headings = [];
        const doc = context.documentModel;
        const allElements = doc.getAllElements();
        for (const element of allElements) {
            const tagName = element.tagName.toLowerCase();
            if (/^h[1-6]$/.test(tagName)) {
                const level = parseInt(tagName[1], 10);
                headings.push({
                    level,
                    element,
                    text: this.getElementText(element),
                    isEmpty: this.isElementEmpty(element),
                    isHidden: this.isElementHidden(element)
                });
            }
            else if (element.attributes['role'] === 'heading' && element.attributes['aria-level']) {
                const level = parseInt(element.attributes['aria-level'], 10);
                if (level >= 1 && level <= 6) {
                    headings.push({
                        level,
                        element,
                        text: this.getElementText(element),
                        isEmpty: this.isElementEmpty(element),
                        isHidden: this.isElementHidden(element)
                    });
                }
            }
        }
        headings.sort((a, b) => a.element.location.line - b.element.location.line);
        return headings;
    }
    analyzeH1(headings, context) {
        const issues = [];
        const h1Headings = headings.filter(h => h.level === 1 && !h.isEmpty);
        const isPageScope = context.scope === 'page' || context.scope === 'workspace';
        if (isPageScope) {
            if (h1Headings.length === 0) {
                const firstHeading = headings[0];
                issues.push(this.createIssue('no-h1-on-page', 'error', 'Page has headings but no H1 element. Every page should have exactly one H1 that describes the main content.', firstHeading ? firstHeading.element.location : { file: '', line: 1, column: 1 }, ['1.3.1', '2.4.6'], context, {
                    fix: {
                        description: 'Add a single H1 element that describes the main content',
                        code: `<h1>Page Title - Main Topic</h1>`,
                        location: firstHeading ? firstHeading.element.location : { file: '', line: 1, column: 1 }
                    }
                }));
            }
            else if (h1Headings.length > 1) {
                for (let i = 1; i < h1Headings.length; i++) {
                    issues.push(this.createIssue('multiple-h1-headings', 'warning', `Page contains ${h1Headings.length} H1 elements. There should be exactly one H1 per page representing the main topic.`, h1Headings[i].element.location, ['1.3.1'], context, {
                        relatedLocations: h1Headings.map(h => h.element.location),
                        fix: {
                            description: 'Change additional H1 elements to H2 or lower',
                            code: `<h1>Main Page Title</h1>
<!-- Change other H1s to appropriate levels: -->
<h2>Section Title</h2>
<h2>Another Section</h2>`,
                            location: h1Headings[i].element.location
                        }
                    }));
                }
            }
            if (headings.length > 0 && headings[0].level !== 1 && !headings[0].isEmpty) {
                issues.push(this.createIssue('page-doesnt-start-with-h1', 'warning', `First heading on page is H${headings[0].level}, not H1. Pages should start with H1 as the main heading.`, headings[0].element.location, ['1.3.1', '2.4.6'], context, {
                    fix: {
                        description: 'Start the page with an H1 heading',
                        code: `<h1>Page Title</h1>
<h2>First Section</h2>`,
                        location: headings[0].element.location
                    }
                }));
            }
        }
        return issues;
    }
    analyzeHierarchy(headings, context) {
        const issues = [];
        let previousLevel = 0;
        const nonEmptyHeadings = headings.filter(h => !h.isEmpty);
        for (const heading of nonEmptyHeadings) {
            const level = heading.level;
            if (previousLevel > 0 && level > previousLevel + 1) {
                const skippedLevels = [];
                for (let i = previousLevel + 1; i < level; i++) {
                    skippedLevels.push(`H${i}`);
                }
                issues.push(this.createIssue('heading-levels-skipped', 'error', `Heading level jumps from H${previousLevel} to H${level}, skipping ${skippedLevels.join(', ')}. Maintain sequential heading levels without skipping.`, heading.element.location, ['1.3.1'], context, {
                    fix: {
                        description: 'Adjust heading levels to maintain sequential hierarchy',
                        code: `<!-- Correct hierarchy: -->
<h${previousLevel}>Previous Section</h${previousLevel}>
<h${previousLevel + 1}>Next Section</h${previousLevel + 1}>

<!-- Instead of skipping to: -->
<h${level}>This Section</h${level}>`,
                        location: heading.element.location
                    }
                }));
            }
            previousLevel = level;
        }
        return issues;
    }
    analyzeAriaLevel(context) {
        const issues = [];
        const doc = context.documentModel;
        const allElements = doc.getAllElements();
        for (const element of allElements) {
            if (element.attributes['aria-level'] && !element.attributes['role']) {
                const level = element.attributes['aria-level'];
                issues.push(this.createIssue('aria-level-without-role', 'error', `Element has aria-level="${level}" but no role attribute. Elements with aria-level must have role="heading".`, element.location, ['4.1.2'], context, {
                    fix: {
                        description: 'Add role="heading" to the element',
                        code: `<div role="heading" aria-level="${level}">Section Title</div>

<!-- OR use semantic HTML: -->
<h${level}>Section Title</h${level}>`,
                        location: element.location
                    }
                }));
            }
        }
        return issues;
    }
    getElementText(element) {
        if (element.attributes['aria-label']) {
            return element.attributes['aria-label'];
        }
        if (element.attributes['aria-labelledby']) {
            return '[aria-labelledby]';
        }
        let text = '';
        for (const child of element.children) {
            if (child.nodeType === 'text' && child.textContent) {
                text += child.textContent;
            }
        }
        return text.trim();
    }
    isElementEmpty(element) {
        const text = this.getElementText(element);
        return !text || text.trim().length === 0;
    }
    isElementHidden(element) {
        const style = element.attributes['style'];
        if (style) {
            if (/display\s*:\s*none/i.test(style) || /visibility\s*:\s*hidden/i.test(style)) {
                return true;
            }
        }
        const className = element.attributes['class'];
        if (className) {
            if (/\b(hidden|hide|d-none|invisible)\b/.test(className)) {
                return true;
            }
        }
        return false;
    }
}
exports.HeadingStructureAnalyzer = HeadingStructureAnalyzer;
