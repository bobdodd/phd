"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageAttributeAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
const VALID_LANGUAGE_CODES = new Set([
    'en', 'en-US', 'en-GB', 'en-CA', 'en-AU',
    'es', 'es-ES', 'es-MX', 'es-AR',
    'fr', 'fr-FR', 'fr-CA',
    'de', 'de-DE', 'de-AT', 'de-CH',
    'it', 'it-IT',
    'pt', 'pt-BR', 'pt-PT',
    'nl', 'nl-NL', 'nl-BE',
    'ru', 'ru-RU',
    'ja', 'ja-JP',
    'ko', 'ko-KR',
    'zh', 'zh-CN', 'zh-TW', 'zh-HK',
    'ar', 'ar-SA', 'ar-EG',
    'hi', 'hi-IN',
    'bn', 'bn-IN',
    'pa', 'pa-IN',
    'te', 'te-IN',
    'mr', 'mr-IN',
    'ta', 'ta-IN',
    'tr', 'tr-TR',
    'vi', 'vi-VN',
    'id', 'id-ID',
    'th', 'th-TH',
    'pl', 'pl-PL',
    'uk', 'uk-UA',
    'ro', 'ro-RO',
    'el', 'el-GR',
    'cs', 'cs-CZ',
    'sv', 'sv-SE',
    'hu', 'hu-HU',
    'fi', 'fi-FI',
    'no', 'no-NO', 'nb', 'nb-NO', 'nn', 'nn-NO',
    'da', 'da-DK',
    'he', 'he-IL',
    'fa', 'fa-IR',
    'ur', 'ur-PK',
    'ms', 'ms-MY',
    'sw', 'sw-KE',
    'af', 'af-ZA',
    'sq', 'sq-AL',
    'am', 'am-ET',
    'hy', 'hy-AM',
    'az', 'az-AZ',
    'eu', 'eu-ES',
    'be', 'be-BY',
    'bs', 'bs-BA',
    'bg', 'bg-BG',
    'ca', 'ca-ES',
    'hr', 'hr-HR',
    'et', 'et-EE',
    'tl', 'tl-PH', 'fil', 'fil-PH',
    'ka', 'ka-GE',
    'gu', 'gu-IN',
    'is', 'is-IS',
    'kn', 'kn-IN',
    'kk', 'kk-KZ',
    'km', 'km-KH',
    'lv', 'lv-LV',
    'lt', 'lt-LT',
    'mk', 'mk-MK',
    'ml', 'ml-IN',
    'mn', 'mn-MN',
    'ne', 'ne-NP',
    'si', 'si-LK',
    'sk', 'sk-SK',
    'sl', 'sl-SI',
    'sr', 'sr-RS',
    'zu', 'zu-ZA'
]);
class LanguageAttributeAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'LanguageAttributeAnalyzer';
        this.description = 'Detects missing or invalid language attributes on HTML elements';
    }
    analyze(context) {
        const issues = [];
        if (!this.supportsDocumentModel(context) || !context.documentModel) {
            return issues;
        }
        const allElements = context.documentModel.getAllElements();
        const htmlElement = allElements.find(el => el.tagName.toLowerCase() === 'html');
        if (!htmlElement) {
            const hasBodyOrHead = allElements.some(el => {
                const tag = el.tagName.toLowerCase();
                return tag === 'body' || tag === 'head';
            });
            if (hasBodyOrHead) {
                const firstElement = allElements[0];
                issues.push(this.createIssue('missing-html-lang', 'error', 'Page is missing lang attribute on <html> element. Screen readers need this to pronounce content correctly.', firstElement?.location || { file: 'unknown', line: 1, column: 1 }, ['3.1.1'], context, {
                    fix: {
                        description: 'Add lang attribute to html element',
                        code: '<html lang="en">',
                        location: firstElement?.location || { file: 'unknown', line: 1, column: 1 }
                    }
                }));
            }
        }
        else {
            const langAttr = htmlElement.attributes.lang;
            if (!langAttr) {
                issues.push(this.createIssue('missing-html-lang', 'error', 'The <html> element is missing a lang attribute. Screen readers need this to pronounce content correctly.', htmlElement.location, ['3.1.1'], context, {
                    elementContext: context.documentModel.getElementContext(htmlElement),
                    fix: {
                        description: 'Add lang attribute to html element',
                        code: this.addLangAttribute(htmlElement, 'en'),
                        location: htmlElement.location
                    }
                }));
            }
            else if (langAttr.trim() === '') {
                issues.push(this.createIssue('empty-html-lang', 'error', 'The <html> element has an empty lang attribute. Specify a valid language code (e.g., "en" for English).', htmlElement.location, ['3.1.1'], context, {
                    elementContext: context.documentModel.getElementContext(htmlElement),
                    fix: {
                        description: 'Set valid language code',
                        code: this.addLangAttribute(htmlElement, 'en'),
                        location: htmlElement.location
                    }
                }));
            }
            else if (!this.isValidLanguageCode(langAttr)) {
                issues.push(this.createIssue('invalid-html-lang', 'warning', `The lang attribute "${langAttr}" may not be a valid BCP 47 language code. Use standard codes like "en", "es", "fr", etc.`, htmlElement.location, ['3.1.1'], context, {
                    elementContext: context.documentModel.getElementContext(htmlElement),
                    fix: {
                        description: 'Use a valid language code (example)',
                        code: this.addLangAttribute(htmlElement, 'en'),
                        location: htmlElement.location
                    }
                }));
            }
        }
        for (const element of allElements) {
            if (element.tagName.toLowerCase() === 'html') {
                continue;
            }
            const langAttr = element.attributes.lang;
            if (langAttr !== undefined) {
                if (langAttr.trim() === '') {
                    issues.push(this.createIssue('empty-lang-attribute', 'error', `Element <${element.tagName}> has an empty lang attribute. Either remove it or specify a valid language code.`, element.location, ['3.1.2'], context, {
                        elementContext: context.documentModel.getElementContext(element),
                        fix: {
                            description: 'Remove empty lang attribute',
                            code: this.removeLangAttribute(element),
                            location: element.location
                        }
                    }));
                }
                else if (!this.isValidLanguageCode(langAttr)) {
                    issues.push(this.createIssue('invalid-lang-attribute', 'warning', `Element <${element.tagName}> has invalid lang attribute "${langAttr}". Use standard BCP 47 language codes.`, element.location, ['3.1.2'], context, {
                        elementContext: context.documentModel.getElementContext(element)
                    }));
                }
            }
        }
        return issues;
    }
    isValidLanguageCode(code) {
        const normalized = code.toLowerCase().trim();
        if (VALID_LANGUAGE_CODES.has(normalized)) {
            return true;
        }
        const bcp47Pattern = /^[a-z]{2,3}(-[A-Z]{2}|-[0-9]{3})?$/i;
        if (bcp47Pattern.test(code)) {
            return true;
        }
        const extendedPattern = /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2}|-[0-9]{3})?$/i;
        return extendedPattern.test(code);
    }
    addLangAttribute(element, defaultLang) {
        const attrs = { ...element.attributes, lang: defaultLang };
        const attrString = Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
        return `<${element.tagName} ${attrString}>`;
    }
    removeLangAttribute(element) {
        const attrs = { ...element.attributes };
        delete attrs.lang;
        const attrString = Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
        return `<${element.tagName}${attrString ? ' ' + attrString : ''}>`;
    }
}
exports.LanguageAttributeAnalyzer = LanguageAttributeAnalyzer;
