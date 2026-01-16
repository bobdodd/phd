"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusOrderConflictAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class FocusOrderConflictAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'focus-order-conflict';
        this.description = 'Detects problematic tabindex usage that creates confusing focus order';
    }
    analyze(context) {
        if (!this.supportsDocumentModel(context)) {
            return [];
        }
        const issues = [];
        const documentModel = context.documentModel;
        if (!documentModel.dom)
            return issues;
        const focusableElements = documentModel.dom.flatMap((fragment) => fragment.getFocusableElements());
        for (const element of focusableElements) {
            const tabindex = this.getTabIndex(element);
            if (tabindex !== null && tabindex > 0) {
                const message = `Element <${element.tagName}> uses positive tabindex="${tabindex}". Positive tabindex values create unpredictable focus order and should be avoided. Use tabindex="0" instead (WCAG 2.4.3).`;
                issues.push(this.createIssue('positive-tabindex', 'warning', message, element.location, ['2.4.3'], context, {
                    elementContext: documentModel.getElementContext(element),
                }));
            }
        }
        const tabindexMap = new Map();
        for (const element of focusableElements) {
            const tabindex = this.getTabIndex(element);
            if (tabindex !== null && tabindex > 0) {
                if (!tabindexMap.has(tabindex)) {
                    tabindexMap.set(tabindex, []);
                }
                tabindexMap.get(tabindex).push(element);
            }
        }
        for (const [tabindex, elements] of tabindexMap.entries()) {
            if (elements.length > 1) {
                for (const element of elements) {
                    const otherElements = elements
                        .filter((e) => e !== element)
                        .map((e) => `<${e.tagName}> at ${e.location.file}:${e.location.line}`)
                        .join(', ');
                    const message = `Element <${element.tagName}> has tabindex="${tabindex}" which is also used by: ${otherElements}. Multiple elements with the same positive tabindex create ambiguous focus order (WCAG 2.4.3).`;
                    issues.push(this.createIssue('duplicate-tabindex', 'error', message, element.location, ['2.4.3'], context, {
                        elementContext: documentModel.getElementContext(element),
                        relatedLocations: elements
                            .filter((e) => e !== element)
                            .map((e) => e.location),
                    }));
                }
            }
        }
        return issues;
    }
    getTabIndex(element) {
        const tabindexStr = element.attributes.tabindex;
        if (tabindexStr === undefined) {
            return null;
        }
        const tabindex = parseInt(tabindexStr);
        return isNaN(tabindex) ? null : tabindex;
    }
}
exports.FocusOrderConflictAnalyzer = FocusOrderConflictAnalyzer;
//# sourceMappingURL=FocusOrderConflictAnalyzer.js.map