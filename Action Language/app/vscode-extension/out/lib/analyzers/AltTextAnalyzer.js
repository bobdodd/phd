"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AltTextAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class AltTextAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'AltTextAnalyzer';
        this.description = 'Detects accessibility issues with image alt text';
        this.MAX_ALT_LENGTH = 150;
        this.GENERIC_ALT_TERMS = ['image', 'picture', 'photo', 'graphic', 'icon', 'img'];
        this.URL_PATTERN = /^https?:\/\//i;
        this.FILE_PATH_PATTERN = /^(\.\/|\.\.\/|\/)/;
        this.FILE_EXTENSION_PATTERN = /\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)$/i;
        this.HTML_TAG_PATTERN = /<[^>]+>/;
    }
    analyze(context) {
        const issues = [];
        if (!this.supportsDocumentModel(context)) {
            return issues;
        }
        const images = this.extractImages(context);
        for (const image of images) {
            if (this.isElementHidden(image.element, context)) {
                continue;
            }
            if (image.role === 'presentation' || image.role === 'none') {
                continue;
            }
            if (!image.hasAlt) {
                issues.push(this.createIssue('missing-alt-attribute', 'error', `Image is missing alt attribute. All images must have an alt attribute. Use alt="" for decorative images.`, image.element.location, ['1.1.1'], context, {
                    elementContext: this.getElementContext(context, image.element),
                    fix: {
                        description: 'Add alt attribute to image',
                        code: this.getElementHTML(image.element, { alt: 'Descriptive text' }),
                        location: image.element.location
                    }
                }));
                continue;
            }
            const altText = image.alt || '';
            if (image.isDecorative) {
                continue;
            }
            if (altText.trim().length === 0 && altText.length > 0) {
                issues.push(this.createIssue('alt-only-whitespace', 'error', `Image alt attribute contains only whitespace. Use alt="" for decorative images or provide descriptive text.`, image.element.location, ['1.1.1'], context, {
                    elementContext: this.getElementContext(context, image.element),
                    fix: {
                        description: 'Replace with empty alt for decorative image or add description',
                        code: this.getElementHTML(image.element, { alt: '' }),
                        location: image.element.location
                    }
                }));
                continue;
            }
            if (this.HTML_TAG_PATTERN.test(altText)) {
                issues.push(this.createIssue('alt-contains-html', 'error', `Alt text contains HTML tags: "${altText}". Alt text is plain text only - HTML tags will be read aloud by screen readers.`, image.element.location, ['1.1.1'], context, {
                    elementContext: this.getElementContext(context, image.element),
                    fix: {
                        description: 'Remove HTML tags from alt text',
                        code: this.getElementHTML(image.element, {
                            alt: altText.replace(/<[^>]+>/g, '')
                        }),
                        location: image.element.location
                    }
                }));
            }
            if (this.URL_PATTERN.test(altText)) {
                issues.push(this.createIssue('alt-contains-url', 'error', `Alt text contains URL: "${altText}". URLs are not descriptive for screen reader users. Describe what the image shows.`, image.element.location, ['1.1.1'], context, {
                    elementContext: this.getElementContext(context, image.element),
                    fix: {
                        description: 'Replace URL with descriptive text',
                        code: this.getElementHTML(image.element, { alt: 'Descriptive text' }),
                        location: image.element.location
                    }
                }));
            }
            if (this.FILE_PATH_PATTERN.test(altText)) {
                issues.push(this.createIssue('alt-contains-filepath', 'error', `Alt text contains file path: "${altText}". File paths are not meaningful for screen reader users. Describe what the image shows.`, image.element.location, ['1.1.1'], context, {
                    elementContext: this.getElementContext(context, image.element),
                    fix: {
                        description: 'Replace file path with descriptive text',
                        code: this.getElementHTML(image.element, { alt: 'Descriptive text' }),
                        location: image.element.location
                    }
                }));
            }
            if (this.FILE_EXTENSION_PATTERN.test(altText)) {
                issues.push(this.createIssue('alt-ends-with-extension', 'error', `Alt text ends with file extension: "${altText}". Remove the file extension from alt text.`, image.element.location, ['1.1.1'], context, {
                    elementContext: this.getElementContext(context, image.element),
                    fix: {
                        description: 'Remove file extension from alt text',
                        code: this.getElementHTML(image.element, {
                            alt: altText.replace(this.FILE_EXTENSION_PATTERN, '')
                        }),
                        location: image.element.location
                    }
                }));
            }
            if (altText.length > this.MAX_ALT_LENGTH) {
                issues.push(this.createIssue('alt-too-long', 'warning', `Alt text is ${altText.length} characters (maximum recommended: ${this.MAX_ALT_LENGTH}). Consider using aria-describedby for longer descriptions.`, image.element.location, ['1.1.1'], context, {
                    elementContext: this.getElementContext(context, image.element),
                    fix: {
                        description: 'Shorten alt text or use aria-describedby',
                        code: `<img src="${image.src || '...'}" alt="Brief description" aria-describedby="detailed-description">\n<div id="detailed-description">\n  ${altText}\n</div>`,
                        location: image.element.location
                    }
                }));
            }
            const altLower = altText.toLowerCase().trim();
            if (this.GENERIC_ALT_TERMS.includes(altLower)) {
                issues.push(this.createIssue('alt-generic', 'warning', `Alt text "${altText}" is not descriptive. Describe what the image shows, not just that it is an image.`, image.element.location, ['1.1.1'], context, {
                    elementContext: this.getElementContext(context, image.element),
                    fix: {
                        description: 'Provide descriptive alt text',
                        code: this.getElementHTML(image.element, { alt: 'Descriptive text about the image content' }),
                        location: image.element.location
                    }
                }));
            }
        }
        return issues;
    }
    extractImages(context) {
        const images = [];
        if (!context.documentModel) {
            return images;
        }
        const allElements = context.documentModel.getAllElements();
        const imageElements = allElements.filter(el => el.tagName.toLowerCase() === 'img');
        for (const element of imageElements) {
            const src = element.attributes.src;
            const alt = element.attributes.alt;
            const hasAlt = 'alt' in element.attributes;
            const isDecorative = hasAlt && alt === '';
            const hasAriaLabel = !!element.attributes['aria-label'];
            const hasAriaLabelledby = !!element.attributes['aria-labelledby'];
            const role = element.attributes.role;
            images.push({
                element,
                src,
                alt,
                hasAlt,
                isDecorative,
                hasAriaLabel,
                hasAriaLabelledby,
                role
            });
        }
        return images;
    }
    isElementHidden(element, context) {
        if (element.attributes['aria-hidden'] === 'true') {
            return true;
        }
        const elementContext = context.documentModel?.getElementContext(element);
        if (elementContext) {
            for (const cssRule of elementContext.cssRules) {
                if (cssRule.property === 'display' && cssRule.value === 'none') {
                    return true;
                }
                if (cssRule.property === 'visibility' && cssRule.value === 'hidden') {
                    return true;
                }
            }
        }
        return false;
    }
    getElementContext(context, element) {
        return context.documentModel?.getElementContext(element);
    }
    getElementHTML(element, attrOverrides) {
        const attrs = { ...element.attributes, ...attrOverrides };
        const attrString = Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
        return `<${element.tagName}${attrString ? ' ' + attrString : ''}>`;
    }
}
exports.AltTextAnalyzer = AltTextAnalyzer;
