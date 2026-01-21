import { BaseAnalyzer, AnalyzerContext, Issue, IssueFix } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

/**
 * AutocompleteAnalyzer
 *
 * Detects missing or incorrect autocomplete attributes on form inputs.
 *
 * Issue Types (3):
 * 1. missing-autocomplete - Input collects user data but lacks autocomplete attribute
 * 2. invalid-autocomplete-value - autocomplete has invalid value
 * 3. autocomplete-off-discouraged - autocomplete="off" on personal data fields (privacy issue)
 *
 * WCAG: 1.3.5 (Identify Input Purpose) Level AA
 *
 * Key Concepts:
 * - autocomplete helps users fill forms faster (especially mobile/assistive tech users)
 * - Helps password managers and autofill features work correctly
 * - Required for common personal data fields (name, email, phone, address, etc.)
 * - Must use valid tokens from HTML specification
 *
 * Valid Autocomplete Tokens (53 total):
 * - Contact: name, given-name, family-name, email, tel, tel-country-code, etc.
 * - Address: street-address, address-line1, address-line2, city, postal-code, country, etc.
 * - Payment: cc-name, cc-number, cc-exp, cc-csc, transaction-amount, etc.
 * - Authentication: username, new-password, current-password
 * - Other: bday, sex, url, photo
 *
 * Priority: MEDIUM IMPACT
 * Target: Improves form filling experience, especially for users with disabilities
 */
export class AutocompleteAnalyzer extends BaseAnalyzer {
  readonly name = 'AutocompleteAnalyzer';
  readonly description = 'Detects missing or incorrect autocomplete attributes on form inputs';

  // Valid autocomplete tokens from HTML specification
  // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
  private readonly VALID_AUTOCOMPLETE_TOKENS = new Set([
    // Contact information
    'name', 'honorific-prefix', 'given-name', 'additional-name', 'family-name', 'honorific-suffix',
    'nickname', 'email', 'username',
    'tel', 'tel-country-code', 'tel-national', 'tel-area-code', 'tel-local', 'tel-extension',
    'url', 'photo',

    // Organization/company
    'organization', 'organization-title',

    // Address
    'street-address', 'address-line1', 'address-line2', 'address-line3',
    'address-level4', 'address-level3', 'address-level2', 'address-level1',
    'country', 'country-name', 'postal-code',

    // Payment
    'cc-name', 'cc-given-name', 'cc-additional-name', 'cc-family-name',
    'cc-number', 'cc-exp', 'cc-exp-month', 'cc-exp-year', 'cc-csc', 'cc-type',
    'transaction-currency', 'transaction-amount',

    // Other
    'language', 'bday', 'bday-day', 'bday-month', 'bday-year',
    'sex', 'impp',

    // Authentication
    'new-password', 'current-password', 'one-time-code',

    // Special values
    'on', 'off'
  ]);

  // Note: Input type checking is done directly in shouldHaveAutocomplete()
  // to avoid maintaining a separate map

  // Field patterns to suggest appropriate autocomplete values
  private readonly FIELD_PATTERNS = new Map<RegExp, string[]>([
    // Name fields
    [/\b(first[-_\s]?name|fname|forename|given[-_\s]?name)\b/i, ['given-name']],
    [/\b(last[-_\s]?name|lname|surname|family[-_\s]?name)\b/i, ['family-name']],
    [/\b(full[-_\s]?name|name)\b/i, ['name']],
    [/\b(nickname|display[-_\s]?name)\b/i, ['nickname']],

    // Contact fields
    [/\b(email|e-mail)\b/i, ['email']],
    [/\b(phone|telephone|mobile|cell)\b/i, ['tel']],
    [/\b(website|homepage|url)\b/i, ['url']],

    // Address fields
    [/\b(address|street)\b/i, ['street-address']],
    [/\b(city|town)\b/i, ['address-level2']],
    [/\b(state|province|region)\b/i, ['address-level1']],
    [/\b(zip|postal[-_\s]?code|postcode)\b/i, ['postal-code']],
    [/\b(country)\b/i, ['country-name']],

    // Payment fields
    [/\b(card[-_\s]?number|cc[-_\s]?number)\b/i, ['cc-number']],
    [/\b(card[-_\s]?name|name[-_\s]?on[-_\s]?card)\b/i, ['cc-name']],
    [/\b(expir|exp[-_\s]?date)\b/i, ['cc-exp']],
    [/\b(cvv|cvc|csc|security[-_\s]?code)\b/i, ['cc-csc']],

    // Authentication
    [/\b(username|user[-_\s]?name|login)\b/i, ['username']],
    [/\b(new[-_\s]?password|confirm[-_\s]?password)\b/i, ['new-password']],
    [/\b(current[-_\s]?password|password)\b/i, ['current-password']],

    // Other
    [/\b(birth[-_\s]?date|birthday|dob)\b/i, ['bday']],
    [/\b(organization|company)\b/i, ['organization']],
    [/\b(job[-_\s]?title|position)\b/i, ['organization-title']]
  ]);

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.documentModel) {
      return issues;
    }

    const allElements = context.documentModel.getAllElements();

    // Find all input elements
    const inputElements = allElements.filter(el =>
      el.tagName === 'input' || el.tagName === 'select' || el.tagName === 'textarea'
    );

    for (const element of inputElements) {
      // Skip hidden inputs and buttons
      const inputType = element.attributes.type?.toLowerCase() || 'text';
      if (inputType === 'hidden' || inputType === 'submit' || inputType === 'button' ||
          inputType === 'reset' || inputType === 'image') {
        continue;
      }

      const autocomplete = element.attributes.autocomplete;

      if (!autocomplete) {
        // Check if this input should have autocomplete
        const shouldHaveAutocomplete = this.shouldHaveAutocomplete(element);
        if (shouldHaveAutocomplete) {
          issues.push(...this.detectMissingAutocomplete(element, context));
        }
      } else {
        // Validate autocomplete value
        issues.push(...this.validateAutocompleteValue(element, autocomplete, context));

        // Check for discouraged autocomplete="off" on personal data
        if (autocomplete.toLowerCase() === 'off') {
          issues.push(...this.detectAutocompleteOff(element, context));
        }
      }
    }

    return issues;
  }

  /**
   * Detect missing autocomplete attribute on inputs that should have it.
   *
   * Pattern: Input collects personal data but lacks autocomplete
   * Problem: Users can't autofill, especially difficult for mobile/assistive tech users
   * WCAG: 1.3.5 (Identify Input Purpose)
   */
  private detectMissingAutocomplete(
    element: DOMElement,
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    const inputType = element.attributes.type?.toLowerCase() || 'text';
    const suggestedValues = this.suggestAutocompleteValue(element);

    if (suggestedValues.length === 0) return issues;

    const fieldIdentifier = this.getFieldIdentifier(element);
    const message = `Input field "${fieldIdentifier}" is missing autocomplete attribute. This field appears to collect personal data (${inputType}). Adding autocomplete helps users fill forms faster, especially on mobile devices and with assistive technologies. It also enables password managers and autofill features.`;

    const fix: IssueFix = {
      description: `Add autocomplete="${suggestedValues[0]}"`,
      code: `<input type="${inputType}"
       name="${element.attributes.name || fieldIdentifier}"
       autocomplete="${suggestedValues[0]}"${element.attributes.id ? `\n       id="${element.attributes.id}"` : ''}${element.attributes.placeholder ? `\n       placeholder="${element.attributes.placeholder}"` : ''}>

<!-- Valid autocomplete values for this field: ${suggestedValues.join(', ')} -->`,
      location: element.location
    };

    issues.push(
      this.createIssue(
        'missing-autocomplete',
        'warning',
        message,
        element.location,
        ['1.3.5'],
        context,
        {
          elementContext: context.documentModel?.getElementContext(element),
          fix
        }
      )
    );

    return issues;
  }

  /**
   * Validate autocomplete attribute value.
   *
   * Pattern: autocomplete has invalid value
   * Problem: Browser ignores invalid values, autofill won't work
   * WCAG: 1.3.5 (Identify Input Purpose)
   */
  private validateAutocompleteValue(
    element: DOMElement,
    autocomplete: string,
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    // Parse autocomplete value (can have multiple tokens: "section-blue shipping street-address")
    const tokens = autocomplete.trim().toLowerCase().split(/\s+/);

    // Check for section prefix (section-*) and billing/shipping
    // These are valid prefixes but we only validate the final token
    let tokenIndex = 0;

    if (tokens[tokenIndex]?.startsWith('section-')) {
      tokenIndex++;
    }

    // Check for billing/shipping
    if (tokens[tokenIndex] === 'billing' || tokens[tokenIndex] === 'shipping') {
      tokenIndex++;
    }

    // Check final token (the actual autocomplete field name)
    const finalToken = tokens[tokenIndex];

    if (!finalToken || !this.VALID_AUTOCOMPLETE_TOKENS.has(finalToken)) {
      const fieldIdentifier = this.getFieldIdentifier(element);
      const suggestedValues = this.suggestAutocompleteValue(element);

      const message = `Input field "${fieldIdentifier}" has invalid autocomplete value: "${autocomplete}". ${finalToken ? `"${finalToken}" is not a valid autocomplete token.` : 'Missing final token.'} Browsers will ignore this and autofill won't work. Valid tokens include: name, email, tel, street-address, postal-code, cc-number, etc.`;

      const fix: IssueFix = {
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

      issues.push(
        this.createIssue(
          'invalid-autocomplete-value',
          'error',
          message,
          element.location,
          ['1.3.5'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(element),
            fix
          }
        )
      );
    }

    return issues;
  }

  /**
   * Detect autocomplete="off" on personal data fields.
   *
   * Pattern: autocomplete="off" on email, password, name, address fields
   * Problem: Prevents autofill, hurts usability (especially for users with disabilities)
   * WCAG: 1.3.5 (Identify Input Purpose)
   */
  private detectAutocompleteOff(
    element: DOMElement,
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    // Check if this looks like a personal data field
    const suggestedValues = this.suggestAutocompleteValue(element);

    // If we can suggest a value, it's probably personal data
    if (suggestedValues.length > 0 && suggestedValues[0] !== 'off') {
      const inputType = element.attributes.type?.toLowerCase() || 'text';

      // Search fields are OK to have autocomplete="off"
      if (inputType === 'search') return issues;

      const fieldIdentifier = this.getFieldIdentifier(element);
      const message = `Input field "${fieldIdentifier}" has autocomplete="off" but appears to collect personal data. This prevents browsers from helping users fill the form automatically, which is especially problematic for users with disabilities, mobile users, and anyone using assistive technologies. Consider using appropriate autocomplete value like "${suggestedValues[0]}" unless there's a strong security reason.`;

      const fix: IssueFix = {
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

      issues.push(
        this.createIssue(
          'autocomplete-off-discouraged',
          'info',
          message,
          element.location,
          ['1.3.5'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(element),
            fix
          }
        )
      );
    }

    return issues;
  }

  /**
   * Check if input should have autocomplete attribute
   */
  private shouldHaveAutocomplete(element: DOMElement): boolean {
    const inputType = element.attributes.type?.toLowerCase() || 'text';

    // Password fields should ALWAYS have autocomplete
    if (inputType === 'password') return true;

    // Email and tel types should have autocomplete
    if (inputType === 'email' || inputType === 'tel' || inputType === 'url') return true;

    // Check field name/id/placeholder for personal data patterns
    const suggestedValues = this.suggestAutocompleteValue(element);
    return suggestedValues.length > 0;
  }

  /**
   * Suggest appropriate autocomplete value based on field attributes
   */
  private suggestAutocompleteValue(element: DOMElement): string[] {
    const suggestions: string[] = [];

    const inputType = element.attributes.type?.toLowerCase() || 'text';
    const name = element.attributes.name?.toLowerCase() || '';
    const id = element.attributes.id?.toLowerCase() || '';
    const placeholder = element.attributes.placeholder?.toLowerCase() || '';
    const label = element.attributes['aria-label']?.toLowerCase() || '';

    // Combine all text to search
    const combinedText = `${name} ${id} ${placeholder} ${label}`;

    // Check input type first
    if (inputType === 'email') {
      suggestions.push('email');
    } else if (inputType === 'tel') {
      suggestions.push('tel');
    } else if (inputType === 'url') {
      suggestions.push('url');
    } else if (inputType === 'password') {
      // Distinguish new vs current password
      if (/new|confirm|repeat|again/i.test(combinedText)) {
        suggestions.push('new-password');
      } else {
        suggestions.push('current-password');
      }
    }

    // Check field patterns
    for (const [pattern, values] of this.FIELD_PATTERNS.entries()) {
      if (pattern.test(combinedText)) {
        suggestions.push(...values);
      }
    }

    // Remove duplicates and return
    return [...new Set(suggestions)];
  }

  /**
   * Get field identifier for error messages
   */
  private getFieldIdentifier(element: DOMElement): string {
    return element.attributes.name ||
           element.attributes.id ||
           element.attributes.placeholder ||
           element.attributes['aria-label'] ||
           `${element.tagName} field`;
  }
}
