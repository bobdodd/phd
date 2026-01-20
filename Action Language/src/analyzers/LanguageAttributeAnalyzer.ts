/**
 * Language Attribute Analyzer
 *
 * Detects missing or invalid language attributes on HTML elements.
 * Proper language identification is essential for screen readers to pronounce content correctly.
 *
 * Detects:
 * - Missing lang attribute on <html> element
 * - Invalid language codes (not BCP 47 compliant)
 * - Language changes in content without lang attribute
 * - Empty lang attributes
 *
 * WCAG 2.1 Success Criteria:
 * - 3.1.1 Language of Page (Level A): The default human language of each Web page can be programmatically determined
 * - 3.1.2 Language of Parts (Level AA): The human language of each passage or phrase can be programmatically determined
 *
 * This analyzer works with DocumentModel to parse HTML structure.
 */

import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

/**
 * Common valid language codes (BCP 47 / ISO 639-1)
 * This is not exhaustive but covers the most common languages
 */
const VALID_LANGUAGE_CODES = new Set([
  // Common language codes
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

/**
 * Analyzer for detecting language attribute accessibility issues.
 */
export class LanguageAttributeAnalyzer extends BaseAnalyzer {
  readonly name = 'LanguageAttributeAnalyzer';
  readonly description = 'Detects missing or invalid language attributes on HTML elements';

  /**
   * Analyze document for language attribute issues.
   */
  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!this.supportsDocumentModel(context) || !context.documentModel) {
      return issues;
    }

    const allElements = context.documentModel.getAllElements();

    // Find the <html> element
    const htmlElement = allElements.find(el => el.tagName.toLowerCase() === 'html');

    if (!htmlElement) {
      // No <html> element found - might be a fragment
      // Check if this appears to be a full page (has body or head)
      const hasBodyOrHead = allElements.some(el => {
        const tag = el.tagName.toLowerCase();
        return tag === 'body' || tag === 'head';
      });

      if (hasBodyOrHead) {
        // This looks like a full page, should have <html> with lang
        const firstElement = allElements[0];
        issues.push(this.createIssue(
          'missing-html-lang',
          'error',
          'Page is missing lang attribute on <html> element. Screen readers need this to pronounce content correctly.',
          firstElement?.location || { file: 'unknown', line: 1, column: 1 },
          ['3.1.1'],
          context,
          {
            fix: {
              description: 'Add lang attribute to html element',
              code: '<html lang="en">',
              location: firstElement?.location || { file: 'unknown', line: 1, column: 1 }
            }
          }
        ));
      }
    } else {
      // Check if <html> element has lang attribute
      const langAttr = htmlElement.attributes.lang;

      if (!langAttr) {
        issues.push(this.createIssue(
          'missing-html-lang',
          'error',
          'The <html> element is missing a lang attribute. Screen readers need this to pronounce content correctly.',
          htmlElement.location,
          ['3.1.1'],
          context,
          {
            elementContext: context.documentModel.getElementContext(htmlElement),
            fix: {
              description: 'Add lang attribute to html element',
              code: this.addLangAttribute(htmlElement, 'en'),
              location: htmlElement.location
            }
          }
        ));
      } else if (langAttr.trim() === '') {
        // Empty lang attribute
        issues.push(this.createIssue(
          'empty-html-lang',
          'error',
          'The <html> element has an empty lang attribute. Specify a valid language code (e.g., "en" for English).',
          htmlElement.location,
          ['3.1.1'],
          context,
          {
            elementContext: context.documentModel.getElementContext(htmlElement),
            fix: {
              description: 'Set valid language code',
              code: this.addLangAttribute(htmlElement, 'en'),
              location: htmlElement.location
            }
          }
        ));
      } else if (!this.isValidLanguageCode(langAttr)) {
        // Invalid language code
        issues.push(this.createIssue(
          'invalid-html-lang',
          'warning',
          `The lang attribute "${langAttr}" may not be a valid BCP 47 language code. Use standard codes like "en", "es", "fr", etc.`,
          htmlElement.location,
          ['3.1.1'],
          context,
          {
            elementContext: context.documentModel.getElementContext(htmlElement),
            fix: {
              description: 'Use a valid language code (example)',
              code: this.addLangAttribute(htmlElement, 'en'),
              location: htmlElement.location
            }
          }
        ));
      }
    }

    // Check for elements with lang attributes (language changes)
    for (const element of allElements) {
      // Skip html element (already checked)
      if (element.tagName.toLowerCase() === 'html') {
        continue;
      }

      const langAttr = element.attributes.lang;

      if (langAttr !== undefined) {
        if (langAttr.trim() === '') {
          // Empty lang attribute on element
          issues.push(this.createIssue(
            'empty-lang-attribute',
            'error',
            `Element <${element.tagName}> has an empty lang attribute. Either remove it or specify a valid language code.`,
            element.location,
            ['3.1.2'],
            context,
            {
              elementContext: context.documentModel.getElementContext(element),
              fix: {
                description: 'Remove empty lang attribute',
                code: this.removeLangAttribute(element),
                location: element.location
              }
            }
          ));
        } else if (!this.isValidLanguageCode(langAttr)) {
          // Invalid language code
          issues.push(this.createIssue(
            'invalid-lang-attribute',
            'warning',
            `Element <${element.tagName}> has invalid lang attribute "${langAttr}". Use standard BCP 47 language codes.`,
            element.location,
            ['3.1.2'],
            context,
            {
              elementContext: context.documentModel.getElementContext(element)
            }
          ));
        }
      }
    }

    return issues;
  }

  /**
   * Check if language code is valid (basic BCP 47 validation).
   */
  private isValidLanguageCode(code: string): boolean {
    const normalized = code.toLowerCase().trim();

    // Check against known language codes
    if (VALID_LANGUAGE_CODES.has(normalized)) {
      return true;
    }

    // Check if it matches BCP 47 pattern (language-region)
    // Language: 2-3 letters, optional region: 2 letters or 3 digits
    const bcp47Pattern = /^[a-z]{2,3}(-[A-Z]{2}|-[0-9]{3})?$/i;

    if (bcp47Pattern.test(code)) {
      // Might be valid even if not in our list
      return true;
    }

    // Also accept extended language codes with script (e.g., zh-Hans, zh-Hant)
    const extendedPattern = /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2}|-[0-9]{3})?$/i;

    return extendedPattern.test(code);
  }

  /**
   * Generate HTML with lang attribute added.
   */
  private addLangAttribute(element: DOMElement, defaultLang: string): string {
    const attrs = { ...element.attributes, lang: defaultLang };
    const attrString = Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `<${element.tagName} ${attrString}>`;
  }

  /**
   * Generate HTML with lang attribute removed.
   */
  private removeLangAttribute(element: DOMElement): string {
    const attrs = { ...element.attributes };
    delete attrs.lang;

    const attrString = Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `<${element.tagName}${attrString ? ' ' + attrString : ''}>`;
  }
}
