"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormSubmissionAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class FormSubmissionAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'FormSubmissionAnalyzer';
        this.description = 'Detects forms with broken submission mechanisms that prevent keyboard users from submitting';
    }
    analyze(context) {
        const issues = [];
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
    checkFormSubmission(form, allElements, context, issues) {
        const formChildren = this.getFormElements(form, allElements);
        const submitButtons = this.findSubmitButtons(formChildren);
        const hasVisibleSubmitButton = submitButtons.some(btn => !this.isHiddenOrDisabled(btn));
        const hasOnSubmitHandler = this.hasFormSubmitHandler(form, context);
        const clickHandlersOnNonSubmit = this.findClickHandlersOnNonSubmitElements(formChildren, context);
        const preventsEnterSubmission = this.preventsEnterKey(form, context);
        if (!hasVisibleSubmitButton && !hasOnSubmitHandler) {
            issues.push(this.createIssue('form-no-submit-button', 'error', `Form has no visible submit button and no onSubmit handler. Keyboard users cannot submit the form using Enter key. Add a <button type="submit"> or <input type="submit"> inside the form.`, form.location, ['2.1.1'], context, {
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
            }));
        }
        if (submitButtons.length > 0 && !hasVisibleSubmitButton) {
            issues.push(this.createIssue('form-submit-button-disabled', 'warning', `Form has submit button(s) but all are disabled or hidden. Users cannot submit the form. Enable at least one submit button or provide an alternative submission method.`, form.location, ['2.1.1'], context, {
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
            }));
        }
        const buttons = formChildren.filter(el => el.tagName === 'button');
        const onlyHasTypeButton = buttons.length > 0 && buttons.every(btn => btn.attributes.type === 'button' || !btn.attributes.type);
        if (onlyHasTypeButton && submitButtons.length === 0) {
            issues.push(this.createIssue('form-only-button-type', 'warning', `Form contains button elements but none have type="submit". Buttons default to type="submit" in forms, but explicit type="button" prevents form submission. Change at least one button to type="submit" or add an onSubmit handler.`, form.location, ['2.1.1'], context, {
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
            }));
        }
        if (clickHandlersOnNonSubmit.length > 0 && !hasOnSubmitHandler) {
            issues.push(this.createIssue('form-click-instead-of-submit', 'info', `Form uses onClick handlers on non-submit elements (${clickHandlersOnNonSubmit.length} found) but no onSubmit handler on the form. This prevents Enter key submission. Use onSubmit on the <form> element instead of onClick on buttons.`, form.location, ['2.1.1'], context, {
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
            }));
        }
        if (preventsEnterSubmission) {
            issues.push(this.createIssue('form-prevents-enter-submission', 'warning', `Form has event handler that prevents Enter key (event.preventDefault() on Enter). This breaks standard form submission behavior. Keyboard users expect Enter to submit forms. Remove the Enter key prevention or ensure the form can still be submitted via keyboard.`, form.location, ['2.1.1'], context, {
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
            }));
        }
    }
    getFormElements(form, _allElements) {
        const elements = [];
        const collectElements = (element) => {
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
    findSubmitButtons(formElements) {
        return formElements.filter(el => {
            if (el.tagName === 'button') {
                const type = el.attributes.type;
                return !type || type === 'submit';
            }
            if (el.tagName === 'input' && el.attributes.type === 'submit') {
                return true;
            }
            if (el.attributes.role === 'button' && el.attributes['aria-label']?.toLowerCase().includes('submit')) {
                return true;
            }
            return false;
        });
    }
    isHiddenOrDisabled(element) {
        if (element.attributes.disabled !== undefined) {
            return true;
        }
        if (element.attributes['aria-hidden'] === 'true') {
            return true;
        }
        const style = element.attributes.style;
        if (style && (style.includes('display:none') || style.includes('display: none') ||
            style.includes('visibility:hidden') || style.includes('visibility: hidden'))) {
            return true;
        }
        if (element.attributes.hidden !== undefined) {
            return true;
        }
        return false;
    }
    hasFormSubmitHandler(form, context) {
        if (form.attributes.onsubmit) {
            return true;
        }
        const elementContext = context.documentModel?.getElementContext(form);
        if (elementContext?.jsHandlers) {
            for (const handler of elementContext.jsHandlers) {
                if (handler.event === 'submit') {
                    return true;
                }
            }
        }
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
    findClickHandlersOnNonSubmitElements(formElements, context) {
        const elementsWithClickHandlers = [];
        for (const element of formElements) {
            if (element.tagName === 'button' && (!element.attributes.type || element.attributes.type === 'submit')) {
                continue;
            }
            if (element.tagName === 'input' && element.attributes.type === 'submit') {
                continue;
            }
            if (element.attributes.onclick) {
                elementsWithClickHandlers.push(element);
                continue;
            }
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
    preventsEnterKey(form, context) {
        const onkeydown = form.attributes.onkeydown;
        const onkeypress = form.attributes.onkeypress;
        if (onkeydown && this.codesPreventsEnter(onkeydown)) {
            return true;
        }
        if (onkeypress && this.codesPreventsEnter(onkeypress)) {
            return true;
        }
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
    codesPreventsEnter(code) {
        const enterPatterns = [
            /if\s*\([^)]*\.key\s*===?\s*['"]Enter['"]/i,
            /if\s*\([^)]*\.keyCode\s*===?\s*13/i,
            /if\s*\([^)]*\.which\s*===?\s*13/i
        ];
        for (const pattern of enterPatterns) {
            if (pattern.test(code)) {
                if (/preventDefault\(\)/.test(code)) {
                    return true;
                }
            }
        }
        return false;
    }
    getHandlerCode(handler) {
        if (typeof handler.handler === 'string') {
            return handler.handler;
        }
        if (handler.handler && typeof handler.handler.toString === 'function') {
            return handler.handler.toString();
        }
        return '';
    }
}
exports.FormSubmissionAnalyzer = FormSubmissionAnalyzer;
