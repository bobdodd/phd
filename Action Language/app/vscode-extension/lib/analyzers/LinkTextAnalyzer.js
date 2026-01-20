"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkTextAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
const GENERIC_LINK_PATTERNS = [
    /^click\s+here$/i,
    /^click$/i,
    /^read\s+more$/i,
    /^more$/i,
    /^more\s+info$/i,
    /^more\s+information$/i,
    /^learn\s+more$/i,
    /^here$/i,
    /^link$/i,
    /^this\s+link$/i,
    /^page$/i,
    /^this\s+page$/i,
    /^download$/i,
    /^continue$/i,
    /^continue\s+reading$/i,
    /^view$/i,
    /^view\s+more$/i,
    /^go$/i,
    /^go\s+here$/i
];
class LinkTextAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'LinkTextAnalyzer';
        this.description = 'Detects accessibility issues with link text quality and descriptiveness';
        this.MAX_LINK_LENGTH = 100;
    }
    analyze(context) {
        const issues = [];
        if (!this.supportsDocumentModel(context)) {
            return issues;
        }
        const links = this.extractLinks(context);
        const visibleLinks = links.filter(link => !link.isHidden);
        for (const link of visibleLinks) {
            if (!link.hasAccessibleName && !link.text && !link.hasImageOnly) {
                issues.push(this.createIssue('empty-link-text', 'error', 'Link has no accessible name or text content. Screen reader users will not know the link purpose.', link.element.location, ['2.4.4', '4.1.2'], context, {
                    elementContext: context.documentModel?.getElementContext(link.element),
                    fix: {
                        description: 'Add descriptive text or aria-label to link',
                        code: `<a href="${link.href}" aria-label="Descriptive link purpose">Link text</a>`,
                        location: link.element.location
                    }
                }));
                continue;
            }
            if (link.hasImageOnly && !link.imageAlt) {
                issues.push(this.createIssue('link-image-no-alt', 'error', 'Link contains only an image without alt text. Screen reader users will not know the link purpose.', link.element.location, ['2.4.4', '4.1.2'], context, {
                    elementContext: context.documentModel?.getElementContext(link.element),
                    fix: {
                        description: 'Add alt text to image',
                        code: `<a href="${link.href}">
  <img src="..." alt="Descriptive link purpose">
</a>`,
                        location: link.element.location
                    }
                }));
                continue;
            }
            const linkText = link.text || link.imageAlt || '';
            if (this.isGenericLinkText(linkText)) {
                issues.push(this.createIssue('generic-link-text', 'warning', `Link text "${linkText}" is not descriptive. Screen reader users navigating by links will not understand the link purpose without surrounding context.`, link.element.location, ['2.4.4', '2.4.9'], context, {
                    elementContext: context.documentModel?.getElementContext(link.element),
                    fix: {
                        description: 'Use descriptive link text that explains the destination',
                        code: `<a href="${link.href}">Descriptive link text that explains destination</a>`,
                        location: link.element.location
                    }
                }));
            }
            if (this.isUrlText(linkText)) {
                issues.push(this.createIssue('link-url-as-text', 'warning', `Link text is a URL: "${linkText}". Consider using descriptive text instead for better usability.`, link.element.location, ['2.4.4'], context, {
                    elementContext: context.documentModel?.getElementContext(link.element),
                    fix: {
                        description: 'Replace URL with descriptive link text',
                        code: `<a href="${link.href}">Descriptive link text</a>`,
                        location: link.element.location
                    }
                }));
            }
            if (linkText.length > this.MAX_LINK_LENGTH) {
                issues.push(this.createIssue('link-text-too-long', 'info', `Link text is ${linkText.length} characters (recommended maximum: ${this.MAX_LINK_LENGTH}). Consider making it more concise.`, link.element.location, ['2.4.4'], context, {
                    elementContext: context.documentModel?.getElementContext(link.element)
                }));
            }
        }
        const duplicates = this.findDuplicateLinkText(visibleLinks);
        for (const duplicate of duplicates) {
            issues.push(this.createIssue('duplicate-link-text', 'warning', `Multiple links have identical text "${duplicate.text}" but point to different destinations. Screen reader users may be confused about which link to follow.`, duplicate.elements[0].location, ['2.4.4', '2.4.9'], context, {
                elementContext: context.documentModel?.getElementContext(duplicate.elements[0]),
                fix: {
                    description: 'Make each link text unique to distinguish destinations',
                    code: `<a href="${duplicate.hrefs[0]}">Specific destination 1</a>
<a href="${duplicate.hrefs[1]}">Specific destination 2</a>`,
                    location: duplicate.elements[0].location
                }
            }));
        }
        return issues;
    }
    extractLinks(context) {
        const links = [];
        if (!context.documentModel) {
            return links;
        }
        const allElements = context.documentModel.getAllElements();
        for (const element of allElements) {
            if (element.tagName.toLowerCase() === 'a' && element.attributes.href) {
                const href = element.attributes.href;
                if (href.startsWith('#')) {
                    continue;
                }
                const text = this.getTextContent(element);
                const hasAccessibleName = this.hasAccessibleName(element, context);
                const isHidden = this.isElementHidden(element, context);
                const { hasImageOnly, imageAlt } = this.checkImageOnly(element);
                links.push({
                    element,
                    text,
                    href,
                    hasAccessibleName,
                    isHidden,
                    hasImageOnly,
                    imageAlt
                });
            }
        }
        return links;
    }
    checkImageOnly(element) {
        if (element.children.length === 1) {
            const child = element.children[0];
            if (child.nodeType === 'element') {
                const childElement = child;
                if (childElement.tagName.toLowerCase() === 'img') {
                    return {
                        hasImageOnly: true,
                        imageAlt: childElement.attributes.alt
                    };
                }
            }
        }
        return { hasImageOnly: false };
    }
    getTextContent(element) {
        let text = '';
        for (const child of element.children) {
            if (child.nodeType === 'text') {
                text += child.textContent || '';
            }
            else if (child.nodeType === 'element') {
                const childElement = child;
                const tagName = childElement.tagName.toLowerCase();
                if (tagName === 'script' || tagName === 'style') {
                    continue;
                }
                if (tagName === 'img') {
                    continue;
                }
                text += this.getTextContent(childElement);
            }
        }
        return text.trim();
    }
    hasAccessibleName(element, context) {
        if (element.attributes['aria-label']) {
            return true;
        }
        if (element.attributes['aria-labelledby'] && context.documentModel) {
            const labelledby = element.attributes['aria-labelledby'];
            const allElements = context.documentModel.getAllElements();
            const referencedElement = allElements.find(el => el.attributes.id === labelledby);
            if (referencedElement) {
                return true;
            }
        }
        return false;
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
    isGenericLinkText(text) {
        const trimmedText = text.trim();
        for (const pattern of GENERIC_LINK_PATTERNS) {
            if (pattern.test(trimmedText)) {
                return true;
            }
        }
        return false;
    }
    isUrlText(text) {
        const trimmedText = text.trim();
        return (trimmedText.startsWith('http://') ||
            trimmedText.startsWith('https://') ||
            trimmedText.startsWith('www.') ||
            /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(trimmedText));
    }
    findDuplicateLinkText(links) {
        const duplicates = [];
        const textMap = new Map();
        for (const link of links) {
            const effectiveText = link.text || link.imageAlt || '';
            if (!effectiveText) {
                continue;
            }
            if (!textMap.has(effectiveText)) {
                textMap.set(effectiveText, []);
            }
            textMap.get(effectiveText).push({ href: link.href, element: link.element });
        }
        for (const [text, linkGroup] of textMap.entries()) {
            if (linkGroup.length > 1) {
                const uniqueHrefs = new Set(linkGroup.map(l => l.href));
                if (uniqueHrefs.size > 1) {
                    duplicates.push({
                        text,
                        hrefs: Array.from(uniqueHrefs),
                        elements: linkGroup.map(l => l.element)
                    });
                }
            }
        }
        return duplicates;
    }
}
exports.LinkTextAnalyzer = LinkTextAnalyzer;
