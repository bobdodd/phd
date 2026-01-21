"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompleteAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class AutocompleteAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'AutocompleteAnalyzer';
        this.description = 'Detects missing or incorrect autocomplete attributes on form inputs';
        this.VALID_AUTOCOMPLETE_TOKENS = new Set([
            'name', 'honorific-prefix', 'given-name', 'additional-name', 'family-name', 'honorific-suffix',
            'nickname', 'email', 'username',
            'tel', 'tel-country-code', 'tel-national', 'tel-area-code', 'tel-local', 'tel-extension',
            'url', 'photo',
            'organization', 'organization-title',
            'street-address', 'address-line1', 'address-line2', 'address-line3',
            'address-level4', 'address-level3', 'address-level2', 'address-level1',
            'country', 'country-name', 'postal-code',
            'cc-name', 'cc-given-name', 'cc-additional-name', 'cc-family-name',
            'cc-number', 'cc-exp', 'cc-exp-month', 'cc-exp-year', 'cc-csc', 'cc-type',
            'transaction-currency', 'transaction-amount',
            'language', 'bday', 'bday-day', 'bday-month', 'bday-year',
            'sex', 'impp',
            'new-password', 'current-password', 'one-time-code',
            'on', 'off'
        ]);
        this.FIELD_PATTERNS = new Map([
            [/\b(first[-_\s]?name|fname|forename|given[-_\s]?name)\b/i, ['given-name']],
            [/\b(last[-_\s]?name|lname|surname|family[-_\s]?name)\b/i, ['family-name']],
            [/\b(full[-_\s]?name|name)\b/i, ['name']],
            [/\b(nickname|display[-_\s]?name)\b/i, ['nickname']],
            [/\b(email|e-mail)\b/i, ['email']],
            [/\b(phone|telephone|mobile|cell)\b/i, ['tel']],
            [/\b(website|homepage|url)\b/i, ['url']],
            [/\b(address|street)\b/i, ['street-address']],
            [/\b(city|town)\b/i, ['address-level2']],
            [/\b(state|province|region)\b/i, ['address-level1']],
            [/\b(zip|postal[-_\s]?code|postcode)\b/i, ['postal-code']],
            [/\b(country)\b/i, ['country-name']],
            [/\b(card[-_\s]?number|cc[-_\s]?number)\b/i, ['cc-number']],
            [/\b(card[-_\s]?name|name[-_\s]?on[-_\s]?card)\b/i, ['cc-name']],
            [/\b(expir|exp[-_\s]?date)\b/i, ['cc-exp']],
            [/\b(cvv|cvc|csc|security[-_\s]?code)\b/i, ['cc-csc']],
            [/\b(username|user[-_\s]?name|login)\b/i, ['username']],
            [/\b(new[-_\s]?password|confirm[-_\s]?password)\b/i, ['new-password']],
            [/\b(current[-_\s]?password|password)\b/i, ['current-password']],
            [/\b(birth[-_\s]?date|birthday|dob)\b/i, ['bday']],
            [/\b(organization|company)\b/i, ['organization']],
            [/\b(job[-_\s]?title|position)\b/i, ['organization-title']]
        ]);
    }
    analyze(context) {
        const issues = [];
        if (!context.documentModel) {
            return issues;
        }
        const allElements = context.documentModel.getAllElements();
        const inputElements = allElements.filter(el => el.tagName === 'input' || el.tagName === 'select' || el.tagName === 'textarea');
        for (const element of inputElements) {
            const inputType = element.attributes.type?.toLowerCase() || 'text';
            if (inputType === 'hidden' || inputType === 'submit' || inputType === 'button' ||
                inputType === 'reset' || inputType === 'image') {
                continue;
            }
            const autocomplete = element.attributes.autocomplete;
            if (!autocomplete) {
                const shouldHaveAutocomplete = this.shouldHaveAutocomplete(element);
                if (shouldHaveAutocomplete) {
                    issues.push(...this.detectMissingAutocomplete(element, context));
                }
            }
            else {
                issues.push(...this.validateAutocompleteValue(element, autocomplete, context));
                if (autocomplete.toLowerCase() === 'off') {
                    issues.push(...this.detectAutocompleteOff(element, context));
                }
            }
        }
        return issues;
    }
    detectMissingAutocomplete(element, context) {
        const issues = [];
        const inputType = element.attributes.type?.toLowerCase() || 'text';
        const suggestedValues = this.suggestAutocompleteValue(element);
        if (suggestedValues.length === 0)
            return issues;
        const fieldIdentifier = this.getFieldIdentifier(element);
        const message = `Input field "${fieldIdentifier}" is missing autocomplete attribute. This field appears to collect personal data (${inputType}). Adding autocomplete helps users fill forms faster, especially on mobile devices and with assistive technologies. It also enables password managers and autofill features.`;
        const fix = {
            description: `Add autocomplete="${suggestedValues[0]}"`,
            code: `<input type="${inputType}"
       name="${element.attributes.name || fieldIdentifier}"
       autocomplete="${suggestedValues[0]}"${element.attributes.id ? `\n       id="${element.attributes.id}"` : ''}${element.attributes.placeholder ? `\n       placeholder="${element.attributes.placeholder}"` : ''}>

<!-- Valid autocomplete values for this field: ${suggestedValues.join(', ')} -->`,
            location: element.location
        };
        issues.push(this.createIssue('missing-autocomplete', 'warning', message, element.location, ['1.3.5'], context, {
            elementContext: context.documentModel?.getElementContext(element),
            fix
        }));
        return issues;
    }
    validateAutocompleteValue(element, autocomplete, context) {
        const issues = [];
        const tokens = autocomplete.trim().toLowerCase().split(/\s+/);
        let tokenIndex = 0;
        if (tokens[tokenIndex]?.startsWith('section-')) {
            tokenIndex++;
        }
        if (tokens[tokenIndex] === 'billing' || tokens[tokenIndex] === 'shipping') {
            tokenIndex++;
        }
        const finalToken = tokens[tokenIndex];
        if (!finalToken || !this.VALID_AUTOCOMPLETE_TOKENS.has(finalToken)) {
            const fieldIdentifier = this.getFieldIdentifier(element);
            const suggestedValues = this.suggestAutocompleteValue(element);
            const message = `Input field "${fieldIdentifier}" has invalid autocomplete value: "${autocomplete}". ${finalToken ? `"${finalToken}" is not a valid autocomplete token.` : 'Missing final token.'} Browsers will ignore this and autofill won't work. Valid tokens include: name, email, tel, street-address, postal-code, cc-number, etc.`;
            const fix = {
                description: 'Use valid autocomplete value',
                code: suggestedValues.length > 0
                    ? `<!-- Replace with valid autocomplete value -->
<input type="${element.attributes.type || 'text'}"
       name="${element.attributes.name || fieldIdentifier}"
       autocomplete="${suggestedValues[0]}">

<!-- Suggested values: ${suggestedValues.join(', ')} -->

<!-- Full autocomplete syntax (optional prefixes): -->
<!-- [section-*] [billing|shipping] <field-name> -->
<!-- Examples: -->
<!-- "email" -->
<!-- "shipping street-address" -->
<!-- "section-primary billing cc-number" -->`
                    : `<!-- See valid autocomplete tokens: -->
<!-- https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill -->`,
                location: element.location
            };
            issues.push(this.createIssue('invalid-autocomplete-value', 'error', message, element.location, ['1.3.5'], context, {
                elementContext: context.documentModel?.getElementContext(element),
                fix
            }));
        }
        return issues;
    }
    detectAutocompleteOff(element, context) {
        const issues = [];
        const suggestedValues = this.suggestAutocompleteValue(element);
        if (suggestedValues.length > 0 && suggestedValues[0] !== 'off') {
            const inputType = element.attributes.type?.toLowerCase() || 'text';
            if (inputType === 'search')
                return issues;
            const fieldIdentifier = this.getFieldIdentifier(element);
            const message = `Input field "${fieldIdentifier}" has autocomplete="off" but appears to collect personal data. This prevents browsers from helping users fill the form automatically, which is especially problematic for users with disabilities, mobile users, and anyone using assistive technologies. Consider using appropriate autocomplete value like "${suggestedValues[0]}" unless there's a strong security reason.`;
            const fix = {
                description: `Change to autocomplete="${suggestedValues[0]}"`,
                code: `<input type="${inputType}"
       name="${element.attributes.name || fieldIdentifier}"
       autocomplete="${suggestedValues[0]}">

<!-- Common reasons autocomplete="off" is problematic: -->
<!-- 1. Hurts users with cognitive disabilities who rely on autofill -->
<!-- 2. Difficult for mobile users to type long addresses/names -->
<!-- 3. Password managers can't save/autofill passwords -->
<!-- 4. Modern browsers often ignore autocomplete="off" anyway -->

<!-- Only use "off" for: -->
<!-- - One-time codes (use "one-time-code" instead) -->
<!-- - Truly sensitive data where autofill is dangerous -->
<!-- - Search boxes (but consider keeping history) -->`,
                location: element.location
            };
            issues.push(this.createIssue('autocomplete-off-discouraged', 'info', message, element.location, ['1.3.5'], context, {
                elementContext: context.documentModel?.getElementContext(element),
                fix
            }));
        }
        return issues;
    }
    shouldHaveAutocomplete(element) {
        const inputType = element.attributes.type?.toLowerCase() || 'text';
        if (inputType === 'password')
            return true;
        if (inputType === 'email' || inputType === 'tel' || inputType === 'url')
            return true;
        const suggestedValues = this.suggestAutocompleteValue(element);
        return suggestedValues.length > 0;
    }
    suggestAutocompleteValue(element) {
        const suggestions = [];
        const inputType = element.attributes.type?.toLowerCase() || 'text';
        const name = element.attributes.name?.toLowerCase() || '';
        const id = element.attributes.id?.toLowerCase() || '';
        const placeholder = element.attributes.placeholder?.toLowerCase() || '';
        const label = element.attributes['aria-label']?.toLowerCase() || '';
        const combinedText = `${name} ${id} ${placeholder} ${label}`;
        if (inputType === 'email') {
            suggestions.push('email');
        }
        else if (inputType === 'tel') {
            suggestions.push('tel');
        }
        else if (inputType === 'url') {
            suggestions.push('url');
        }
        else if (inputType === 'password') {
            if (/new|confirm|repeat|again/i.test(combinedText)) {
                suggestions.push('new-password');
            }
            else {
                suggestions.push('current-password');
            }
        }
        for (const [pattern, values] of this.FIELD_PATTERNS.entries()) {
            if (pattern.test(combinedText)) {
                suggestions.push(...values);
            }
        }
        return [...new Set(suggestions)];
    }
    getFieldIdentifier(element) {
        return element.attributes.name ||
            element.attributes.id ||
            element.attributes.placeholder ||
            element.attributes['aria-label'] ||
            `${element.tagName} field`;
    }
}
exports.AutocompleteAnalyzer = AutocompleteAnalyzer;
