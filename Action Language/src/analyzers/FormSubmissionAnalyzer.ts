import { BaseAnalyzer, Issue, AnalyzerContext } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

/**
 * FormSubmissionAnalyzer - Detects forms with broken submission mechanisms
 *
 * Implements WCAG 2.1.1 (Keyboard) Level A
 *
 * Detects:
 * - Forms without submit buttons (only JavaScript submission)
 * - Forms with onClick on non-submit elements instead of onSubmit
 * - Submit buttons that are disabled or hidden
 * - Forms that prevent Enter key submission
 * - Forms with only type="button" (not type="submit")
 *
 * Priority: MEDIUM IMPACT
 * Target: Ensures forms can be submitted via keyboard (Enter key)
 */
export class FormSubmissionAnalyzer extends BaseAnalyzer {
  readonly name = 'FormSubmissionAnalyzer';
  readonly description = 'Detects forms with broken submission mechanisms that prevent keyboard users from submitting';

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.documentModel || !context.documentModel.dom) {
      return issues;
    }

    const allElements = context.documentModel.getAllElements();
    const forms = allElements.filter(el => el.tagName === 'form');

    for (const form of forms) {
      this.checkFormSubmission(form, allElements, context, issues);
    }

    return issues;
  }

  /**
   * Check form submission mechanism
   */
  private checkFormSubmission(
    form: DOMElement,
    allElements: DOMElement[],
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const formChildren = this.getFormElements(form, allElements);

    // Check 1: Does form have a submit button?
    const submitButtons = this.findSubmitButtons(formChildren);
    const hasVisibleSubmitButton = submitButtons.some(btn => !this.isHiddenOrDisabled(btn));

    // Check 2: Does form have onSubmit handler?
    const hasOnSubmitHandler = this.hasFormSubmitHandler(form, context);

    // Check 3: Are there onClick handlers that might simulate submission?
    const clickHandlersOnNonSubmit = this.findClickHandlersOnNonSubmitElements(formChildren, context);

    // Check 4: Does form prevent Enter key submission?
    const preventsEnterSubmission = this.preventsEnterKey(form, context);

    // Analyze patterns

    // Pattern 1: No submit button AND no onSubmit handler (ERROR)
    if (!hasVisibleSubmitButton && !hasOnSubmitHandler) {
      issues.push(
        this.createIssue(
          'form-no-submit-button',
          'error',
          `Form has no visible submit button and no onSubmit handler. Keyboard users cannot submit the form using Enter key. Add a <button type="submit"> or <input type="submit"> inside the form.`,
          form.location,
          ['2.1.1'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(form),
            fix: {
              description: `Add a submit button to the form:

Option 1: <button type="submit">
<form onsubmit="handleSubmit(event)">
  <!-- form fields -->
  <button type="submit">Submit</button>
</form>

Option 2: <input type="submit">
<form onsubmit="handleSubmit(event)">
  <!-- form fields -->
  <input type="submit" value="Submit">
</form>

IMPORTANT: The submit button must be inside the <form> tag.`,
              code: `<form onsubmit="handleSubmit(event)">
  <!-- form fields -->
  <button type="submit">Submit</button>
</form>`,
              location: form.location
            }
          }
        )
      );
    }

    // Pattern 2: Has submit buttons but all are disabled/hidden (WARNING)
    if (submitButtons.length > 0 && !hasVisibleSubmitButton) {
      issues.push(
        this.createIssue(
          'form-submit-button-disabled',
          'warning',
          `Form has submit button(s) but all are disabled or hidden. Users cannot submit the form. Enable at least one submit button or provide an alternative submission method.`,
          form.location,
          ['2.1.1'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(form),
            fix: {
              description: `Ensure at least one submit button is enabled and visible:

Bad (all submit buttons disabled):
<form>
  <input type="text" name="field">
  <button type="submit" disabled>Submit</button>
</form>

Good (enable submit button when form is valid):
<form>
  <input type="text" name="field" oninput="validateForm()">
  <button type="submit" id="submitBtn">Submit</button>
</form>

<script>
function validateForm() {
  const valid = /* validation logic */;
  document.getElementById('submitBtn').disabled = !valid;
}
</script>`,
              code: `<!-- Enable submit button based on validation -->
<button type="submit" id="submitBtn">Submit</button>

<script>
function validateForm() {
  const valid = checkFormValidity();
  document.getElementById('submitBtn').disabled = !valid;
}
</script>`,
              location: form.location
            }
          }
        )
      );
    }

    // Pattern 3: Only has type="button" buttons (not type="submit") (WARNING)
    const buttons = formChildren.filter(el => el.tagName === 'button');
    const onlyHasTypeButton = buttons.length > 0 && buttons.every(btn =>
      btn.attributes.type === 'button' || !btn.attributes.type
    );

    if (onlyHasTypeButton && submitButtons.length === 0) {
      issues.push(
        this.createIssue(
          'form-only-button-type',
          'warning',
          `Form contains button elements but none have type="submit". Buttons default to type="submit" in forms, but explicit type="button" prevents form submission. Change at least one button to type="submit" or add an onSubmit handler.`,
          form.location,
          ['2.1.1'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(form),
            fix: {
              description: `Change button type to "submit":

Bad (type="button" prevents submission):
<form>
  <input type="text" name="field">
  <button type="button" onclick="submitForm()">Submit</button>
</form>

Good (type="submit" allows Enter key submission):
<form onsubmit="handleSubmit(event)">
  <input type="text" name="field">
  <button type="submit">Submit</button>
</form>`,
              code: `<!-- Change type="button" to type="submit" -->
<button type="submit">Submit</button>`,
              location: form.location
            }
          }
        )
      );
    }

    // Pattern 4: Uses onClick on non-submit elements instead of onSubmit (INFO)
    if (clickHandlersOnNonSubmit.length > 0 && !hasOnSubmitHandler) {
      issues.push(
        this.createIssue(
          'form-click-instead-of-submit',
          'info',
          `Form uses onClick handlers on non-submit elements (${clickHandlersOnNonSubmit.length} found) but no onSubmit handler on the form. This prevents Enter key submission. Use onSubmit on the <form> element instead of onClick on buttons.`,
          form.location,
          ['2.1.1'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(form),
            fix: {
              description: `Use onSubmit on form instead of onClick on button:

Bad (onClick on button, no onSubmit):
<form>
  <input type="text" name="field">
  <button type="button" onclick="submitForm()">Submit</button>
</form>

Good (onSubmit on form):
<form onsubmit="handleSubmit(event); return false;">
  <input type="text" name="field">
  <button type="submit">Submit</button>
</form>

<script>
function handleSubmit(event) {
  event.preventDefault(); // Prevent page reload
  // Handle form submission
}
</script>`,
              code: `<form onsubmit="handleSubmit(event); return false;">
  <!-- form fields -->
  <button type="submit">Submit</button>
</form>

<script>
function handleSubmit(event) {
  event.preventDefault();
  // Submit logic here
}
</script>`,
              location: form.location
            }
          }
        )
      );
    }

    // Pattern 5: Form prevents Enter key submission (WARNING)
    if (preventsEnterSubmission) {
      issues.push(
        this.createIssue(
          'form-prevents-enter-submission',
          'warning',
          `Form has event handler that prevents Enter key (event.preventDefault() on Enter). This breaks standard form submission behavior. Keyboard users expect Enter to submit forms. Remove the Enter key prevention or ensure the form can still be submitted via keyboard.`,
          form.location,
          ['2.1.1'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(form),
            fix: {
              description: `Don't prevent Enter key on forms:

Bad (prevents Enter submission):
<form onkeydown="if (event.key === 'Enter') event.preventDefault()">
  <input type="text">
</form>

Good (allow Enter to submit):
<form onsubmit="handleSubmit(event)">
  <input type="text">
  <button type="submit">Submit</button>
</form>

If you need to prevent Enter in specific fields (like textarea),
do it on the field, not the form:
<textarea onkeydown="if (event.key === 'Enter' && !event.shiftKey) event.preventDefault()"></textarea>`,
              code: `<!-- Remove Enter key prevention from form -->
<form onsubmit="handleSubmit(event)">
  <!-- form fields -->
  <button type="submit">Submit</button>
</form>`,
              location: form.location
            }
          }
        )
      );
    }
  }

  /**
   * Get all elements within a form
   */
  private getFormElements(form: DOMElement, _allElements: DOMElement[]): DOMElement[] {
    const elements: DOMElement[] = [];

    const collectElements = (element: DOMElement) => {
      if (element.children) {
        for (const child of element.children) {
          elements.push(child);
          collectElements(child);
        }
      }
    };

    collectElements(form);
    return elements;
  }

  /**
   * Find submit buttons in form
   */
  private findSubmitButtons(formElements: DOMElement[]): DOMElement[] {
    return formElements.filter(el => {
      // <button type="submit"> or <button> (defaults to submit)
      if (el.tagName === 'button') {
        const type = el.attributes.type;
        return !type || type === 'submit'; // Default is submit
      }

      // <input type="submit">
      if (el.tagName === 'input' && el.attributes.type === 'submit') {
        return true;
      }

      // ARIA button with form submit behavior
      if (el.attributes.role === 'button' && el.attributes['aria-label']?.toLowerCase().includes('submit')) {
        return true;
      }

      return false;
    });
  }

  /**
   * Check if element is hidden or disabled
   */
  private isHiddenOrDisabled(element: DOMElement): boolean {
    // Check disabled attribute
    if (element.attributes.disabled !== undefined) {
      return true;
    }

    // Check aria-hidden
    if (element.attributes['aria-hidden'] === 'true') {
      return true;
    }

    // Check display:none or visibility:hidden (simplified check)
    const style = element.attributes.style;
    if (style && (style.includes('display:none') || style.includes('display: none') ||
                  style.includes('visibility:hidden') || style.includes('visibility: hidden'))) {
      return true;
    }

    // Check hidden attribute
    if (element.attributes.hidden !== undefined) {
      return true;
    }

    return false;
  }

  /**
   * Check if form has onSubmit handler
   */
  private hasFormSubmitHandler(form: DOMElement, context: AnalyzerContext): boolean {
    // Check onsubmit attribute
    if (form.attributes.onsubmit) {
      return true;
    }

    // Check for addEventListener('submit') in JavaScript
    const elementContext = context.documentModel?.getElementContext(form);
    if (elementContext?.jsHandlers) {
      for (const handler of elementContext.jsHandlers) {
        if (handler.event === 'submit') {
          return true;
        }
      }
    }

    // Check for form submit handlers in action language model
    if (context.actionLanguageModel) {
      const allHandlers = context.actionLanguageModel.getAllEventHandlers();
      for (const handler of allHandlers) {
        if (handler.event === 'submit') {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Find click handlers on non-submit elements
   */
  private findClickHandlersOnNonSubmitElements(
    formElements: DOMElement[],
    context: AnalyzerContext
  ): DOMElement[] {
    const elementsWithClickHandlers: DOMElement[] = [];

    for (const element of formElements) {
      // Skip submit buttons
      if (element.tagName === 'button' && (!element.attributes.type || element.attributes.type === 'submit')) {
        continue;
      }
      if (element.tagName === 'input' && element.attributes.type === 'submit') {
        continue;
      }

      // Check for onclick attribute
      if (element.attributes.onclick) {
        elementsWithClickHandlers.push(element);
        continue;
      }

      // Check for addEventListener('click') in JavaScript
      const elementContext = context.documentModel?.getElementContext(element);
      if (elementContext?.jsHandlers) {
        const hasClickHandler = elementContext.jsHandlers.some(h => h.event === 'click');
        if (hasClickHandler) {
          elementsWithClickHandlers.push(element);
        }
      }
    }

    return elementsWithClickHandlers;
  }

  /**
   * Check if form prevents Enter key submission
   */
  private preventsEnterKey(form: DOMElement, context: AnalyzerContext): boolean {
    // Check onkeydown/onkeypress attributes for Enter prevention
    const onkeydown = form.attributes.onkeydown;
    const onkeypress = form.attributes.onkeypress;

    if (onkeydown && this.codesPreventsEnter(onkeydown)) {
      return true;
    }
    if (onkeypress && this.codesPreventsEnter(onkeypress)) {
      return true;
    }

    // Check JavaScript event handlers
    const elementContext = context.documentModel?.getElementContext(form);
    if (elementContext?.jsHandlers) {
      for (const handler of elementContext.jsHandlers) {
        if (handler.event === 'keydown' || handler.event === 'keypress') {
          const code = this.getHandlerCode(handler);
          if (this.codesPreventsEnter(code)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Check if code prevents Enter key
   */
  private codesPreventsEnter(code: string): boolean {
    // Look for patterns like:
    // - if (event.key === 'Enter') preventDefault()
    // - if (e.keyCode === 13) preventDefault()
    const enterPatterns = [
      /if\s*\([^)]*\.key\s*===?\s*['"]Enter['"]/i,
      /if\s*\([^)]*\.keyCode\s*===?\s*13/i,
      /if\s*\([^)]*\.which\s*===?\s*13/i
    ];

    for (const pattern of enterPatterns) {
      if (pattern.test(code)) {
        // Check if it also calls preventDefault
        if (/preventDefault\(\)/.test(code)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get handler code as string
   */
  private getHandlerCode(handler: any): string {
    if (typeof handler.handler === 'string') {
      return handler.handler;
    }

    if (handler.handler && typeof handler.handler.toString === 'function') {
      return handler.handler.toString();
    }

    return '';
  }
}
