"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandmarkStructureAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
const IMPLICIT_LANDMARKS = {
    'main': 'main',
    'nav': 'navigation',
    'header': 'banner',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'form': 'form',
    'section': 'region'
};
const LANDMARK_ROLES = [
    'main',
    'navigation',
    'banner',
    'contentinfo',
    'complementary',
    'search',
    'region',
    'form'
];
class LandmarkStructureAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'LandmarkStructureAnalyzer';
        this.description = 'Detects accessibility issues with landmark regions and page structure';
    }
    analyze(context) {
        const issues = [];
        if (!this.supportsDocumentModel(context)) {
            return issues;
        }
        const landmarks = this.extractLandmarks(context);
        const visibleLandmarks = landmarks.filter(l => !l.isHidden);
        const mainLandmarks = visibleLandmarks.filter(l => l.type === 'main');
        if (mainLandmarks.length === 0) {
            const firstElement = context.documentModel?.getAllElements()[0];
            const location = firstElement?.location || { file: 'unknown', line: 1, column: 1 };
            issues.push(this.createIssue('missing-main-landmark', 'error', 'Page is missing a main landmark. Add a <main> element or role="main" to identify the primary content area.', location, ['1.3.1', '2.4.1'], context, {
                fix: {
                    description: 'Add main landmark to page',
                    code: '<main>\n  <!-- Primary page content here -->\n</main>',
                    location
                }
            }));
        }
        if (mainLandmarks.length > 1) {
            const unlabeledMains = mainLandmarks.filter(l => !l.label);
            if (unlabeledMains.length > 1) {
                for (const landmark of unlabeledMains) {
                    issues.push(this.createIssue('multiple-main-without-labels', 'error', 'Multiple main landmarks exist without unique labels. Each main landmark must have a unique aria-label or aria-labelledby.', landmark.element.location, ['1.3.1', '4.1.2'], context, {
                        elementContext: this.getElementContext(context, landmark.element),
                        fix: {
                            description: 'Add unique label to main landmark',
                            code: this.getElementHTML(landmark.element, { 'aria-label': 'Unique description' }),
                            location: landmark.element.location
                        }
                    }));
                }
            }
        }
        const landmarksByType = this.groupLandmarksByType(visibleLandmarks);
        for (const [type, landmarksOfType] of Object.entries(landmarksByType)) {
            if (landmarksOfType.length > 1) {
                const unlabeled = landmarksOfType.filter(l => !l.label);
                if (unlabeled.length > 1 || (unlabeled.length === 1 && landmarksOfType.length > 1)) {
                    for (const landmark of unlabeled) {
                        const typeName = this.getLandmarkTypeName(type);
                        issues.push(this.createIssue('unlabeled-landmark', 'warning', `Multiple ${typeName} landmarks exist but this one lacks a unique label. Add aria-label or aria-labelledby to distinguish it from other ${typeName} landmarks.`, landmark.element.location, ['1.3.1', '4.1.2'], context, {
                            elementContext: this.getElementContext(context, landmark.element),
                            fix: {
                                description: `Add unique label to ${typeName} landmark`,
                                code: this.getElementHTML(landmark.element, { 'aria-label': `Unique ${typeName} description` }),
                                location: landmark.element.location
                            }
                        }));
                    }
                }
            }
        }
        for (const landmark of landmarks) {
            const tagName = landmark.element.tagName.toLowerCase();
            const explicitRole = landmark.element.attributes.role;
            if (explicitRole && IMPLICIT_LANDMARKS[tagName]) {
                const implicitRole = this.getImplicitRole(landmark.element, context);
                if (explicitRole === implicitRole) {
                    issues.push(this.createIssue('redundant-landmark-role', 'info', `Redundant role="${explicitRole}" on <${tagName}> element. The <${tagName}> element already has an implicit role of "${implicitRole}".`, landmark.element.location, ['4.1.2'], context, {
                        elementContext: this.getElementContext(context, landmark.element),
                        fix: {
                            description: 'Remove redundant role attribute',
                            code: this.getElementHTMLWithoutRole(landmark.element),
                            location: landmark.element.location
                        }
                    }));
                }
            }
        }
        for (const landmark of landmarks) {
            const tagName = landmark.element.tagName.toLowerCase();
            if ((tagName === 'section' || tagName === 'form') && !landmark.label) {
                if (tagName === 'section' && !landmark.element.attributes.role) {
                    issues.push(this.createIssue('section-without-label', 'warning', '<section> element without accessible name will not be exposed as a landmark. Add aria-label or aria-labelledby, or use a different element.', landmark.element.location, ['1.3.1'], context, {
                        elementContext: this.getElementContext(context, landmark.element),
                        fix: {
                            description: 'Add accessible name to section',
                            code: this.getElementHTML(landmark.element, { 'aria-label': 'Section description' }),
                            location: landmark.element.location
                        }
                    }));
                }
            }
        }
        for (const landmark of landmarks) {
            const nestingIssue = this.checkLandmarkNesting(landmark, context);
            if (nestingIssue) {
                issues.push(nestingIssue);
            }
        }
        return issues;
    }
    extractLandmarks(context) {
        const landmarks = [];
        if (!context.documentModel) {
            return landmarks;
        }
        const allElements = context.documentModel.getAllElements();
        for (const element of allElements) {
            const tagName = element.tagName.toLowerCase();
            const explicitRole = element.attributes.role;
            let landmarkType = null;
            if (explicitRole && LANDMARK_ROLES.includes(explicitRole)) {
                landmarkType = explicitRole;
            }
            else if (IMPLICIT_LANDMARKS[tagName]) {
                const implicitRole = this.getImplicitRole(element, context);
                if (implicitRole) {
                    landmarkType = implicitRole;
                }
            }
            if (landmarkType) {
                const label = this.getAccessibleName(element, context);
                const isHidden = this.isElementHidden(element, context);
                landmarks.push({
                    element,
                    type: landmarkType,
                    label,
                    isHidden,
                    hasMultipleSiblings: false
                });
            }
        }
        const typeGroups = this.groupLandmarksByType(landmarks.filter(l => !l.isHidden));
        for (const group of Object.values(typeGroups)) {
            if (group.length > 1) {
                group.forEach(l => l.hasMultipleSiblings = true);
            }
        }
        return landmarks;
    }
    getImplicitRole(element, context) {
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'main')
            return 'main';
        if (tagName === 'nav')
            return 'navigation';
        if (tagName === 'aside')
            return 'complementary';
        if (tagName === 'header') {
            if (this.isNestedInSectioningContent(element)) {
                return null;
            }
            return 'banner';
        }
        if (tagName === 'footer') {
            if (this.isNestedInSectioningContent(element)) {
                return null;
            }
            return 'contentinfo';
        }
        if (tagName === 'section') {
            const label = this.getAccessibleName(element, context);
            return label ? 'region' : null;
        }
        if (tagName === 'form') {
            const label = this.getAccessibleName(element, context);
            return label ? 'form' : null;
        }
        return null;
    }
    isNestedInSectioningContent(element) {
        const sectioningElements = ['article', 'section', 'aside', 'nav'];
        let parent = element.parent;
        while (parent) {
            if (sectioningElements.includes(parent.tagName.toLowerCase())) {
                return true;
            }
            parent = parent.parent;
        }
        return false;
    }
    getAccessibleName(element, context) {
        const ariaLabel = element.attributes['aria-label'];
        if (ariaLabel)
            return ariaLabel;
        const labelledby = element.attributes['aria-labelledby'];
        if (labelledby && context.documentModel) {
            const allElements = context.documentModel.getAllElements();
            const referencedElement = allElements.find(el => el.attributes.id === labelledby);
            if (referencedElement) {
                return this.getElementText(referencedElement);
            }
        }
        return undefined;
    }
    getElementText(element) {
        let text = '';
        for (const child of element.children) {
            if (child.nodeType === 'text') {
                text += child.textContent || '';
            }
            else if (child.nodeType === 'element') {
                text += this.getElementText(child);
            }
        }
        return text.trim();
    }
    groupLandmarksByType(landmarks) {
        const groups = {};
        for (const landmark of landmarks) {
            if (!groups[landmark.type]) {
                groups[landmark.type] = [];
            }
            groups[landmark.type].push(landmark);
        }
        return groups;
    }
    getLandmarkTypeName(type) {
        const names = {
            'main': 'main',
            'navigation': 'navigation',
            'banner': 'banner',
            'contentinfo': 'contentinfo',
            'complementary': 'complementary',
            'search': 'search',
            'region': 'region',
            'form': 'form'
        };
        return names[type] || type;
    }
    checkLandmarkNesting(landmark, context) {
        if (landmark.type === 'main') {
            let parent = landmark.element.parent;
            while (parent) {
                const parentRole = this.getImplicitRole(parent, context) || parent.attributes.role;
                if (parentRole && LANDMARK_ROLES.includes(parentRole) && parentRole !== 'main') {
                    return this.createIssue('main-nested-in-landmark', 'warning', `Main landmark is nested inside a ${parentRole} landmark. This can cause navigation issues for screen reader users.`, landmark.element.location, ['1.3.1'], context, {
                        elementContext: this.getElementContext(context, landmark.element)
                    });
                }
                parent = parent.parent;
            }
        }
        return null;
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
    getElementHTMLWithoutRole(element) {
        const attrs = { ...element.attributes };
        delete attrs.role;
        const attrString = Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
        return `<${element.tagName}${attrString ? ' ' + attrString : ''}>`;
    }
}
exports.LandmarkStructureAnalyzer = LandmarkStructureAnalyzer;
