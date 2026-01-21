"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorContrastAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class ColorContrastAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'ColorContrastAnalyzer';
        this.description = 'Detects insufficient color contrast and warns when contrast cannot be reliably determined';
        this.NORMAL_TEXT_RATIO = 4.5;
        this.LARGE_TEXT_RATIO = 3.0;
        this.LARGE_TEXT_SIZE_PX = 18;
        this.LARGE_TEXT_BOLD_SIZE_PX = 14;
        this.MIN_OPACITY = 0.8;
    }
    analyze(context) {
        const issues = [];
        if (!context.documentModel || !context.documentModel.dom) {
            return issues;
        }
        const allElements = context.documentModel.getAllElements();
        const textElements = this.findTextElements(allElements);
        for (const element of textElements) {
            this.analyzeTextContrast(element, allElements, context, issues);
        }
        return issues;
    }
    findTextElements(allElements) {
        return allElements.filter(el => {
            if (!el.textContent || el.textContent.trim().length === 0) {
                return false;
            }
            if (this.isHidden(el)) {
                return false;
            }
            if (['img', 'video', 'audio', 'canvas', 'svg'].includes(el.tagName)) {
                return false;
            }
            return true;
        });
    }
    analyzeTextContrast(element, allElements, context, issues) {
        const fgResult = this.getForegroundColor(element);
        if (!fgResult.reliable) {
            this.reportIndeterminateContrast(element, 'foreground', fgResult.reason, context, issues);
            return;
        }
        const bgResult = this.getBackgroundColor(element, allElements);
        if (!bgResult.reliable) {
            this.reportIndeterminateContrast(element, 'background', bgResult.reason, context, issues);
            return;
        }
        const fontSize = this.getFontSize(element);
        const fontWeight = this.getFontWeight(element);
        const isLargeText = this.isLargeText(fontSize, fontWeight);
        const contrastRatio = this.calculateContrastRatio(fgResult.color, bgResult.color);
        const requiredRatio = isLargeText ? this.LARGE_TEXT_RATIO : this.NORMAL_TEXT_RATIO;
        const passes = contrastRatio >= requiredRatio;
        if (!passes) {
            this.reportInsufficientContrast(element, contrastRatio, requiredRatio, isLargeText, fgResult.color, bgResult.color, context, issues);
        }
    }
    getForegroundColor(element) {
        const style = element.attributes.style;
        if (style) {
            const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
            if (colorMatch) {
                const color = this.parseColor(colorMatch[1].trim());
                if (color) {
                    if (this.hasColorTransition(style, 'color')) {
                        return { reliable: false, reason: 'color-transition' };
                    }
                    if (color.a < this.MIN_OPACITY) {
                        return { reliable: false, reason: 'low-opacity-text' };
                    }
                    return { reliable: true, color };
                }
            }
            if (this.hasColorTransition(style, 'color')) {
                return { reliable: false, reason: 'color-transition' };
            }
        }
        const className = element.attributes.class;
        if (className && (className.includes('transition') || className.includes('animate'))) {
            return { reliable: false, reason: 'color-transition' };
        }
        return { reliable: true, color: { r: 0, g: 0, b: 0, a: 1 } };
    }
    getBackgroundColor(element, _allElements) {
        let current = element;
        while (current) {
            if (this.hasZIndex(current)) {
                return { reliable: false, reason: 'z-index-detected' };
            }
            const style = current.attributes.style;
            if (style) {
                if (this.hasBackgroundImage(style) || this.hasGradient(style)) {
                    return { reliable: false, reason: 'background-image-or-gradient' };
                }
                const bgColorMatch = style.match(/background-color\s*:\s*([^;]+)/i);
                if (bgColorMatch) {
                    const color = this.parseColor(bgColorMatch[1].trim());
                    if (color) {
                        if (this.hasColorTransition(style, 'background-color')) {
                            return { reliable: false, reason: 'background-transition' };
                        }
                        if (color.a < this.MIN_OPACITY) {
                            return { reliable: false, reason: 'low-opacity-background' };
                        }
                        if (color.a === 1) {
                            return { reliable: true, color };
                        }
                    }
                }
                const bgMatch = style.match(/background\s*:\s*([^;]+)/i);
                if (bgMatch) {
                    const bgValue = bgMatch[1].trim();
                    if (bgValue.includes('url(') || bgValue.includes('gradient(')) {
                        return { reliable: false, reason: 'background-image-or-gradient' };
                    }
                    const color = this.parseColor(bgValue);
                    if (color && color.a === 1) {
                        return { reliable: true, color };
                    }
                }
            }
            current = current.parent;
        }
        return { reliable: true, color: { r: 255, g: 255, b: 255, a: 1 } };
    }
    hasZIndex(element) {
        const style = element.attributes.style;
        if (!style)
            return false;
        return /z-index\s*:\s*[^;]+/.test(style);
    }
    hasBackgroundImage(style) {
        return /background-image\s*:\s*url\(/i.test(style) ||
            /background\s*:\s*[^;]*url\(/i.test(style);
    }
    hasGradient(style) {
        return /gradient\(/i.test(style);
    }
    hasColorTransition(style, property) {
        const transitionMatch = style.match(/transition\s*:\s*([^;]+)/i);
        if (transitionMatch && transitionMatch[1].includes(property)) {
            return true;
        }
        const animationMatch = style.match(/animation\s*:\s*([^;]+)/i);
        if (animationMatch) {
            return true;
        }
        return false;
    }
    getFontSize(element) {
        const style = element.attributes.style;
        if (!style)
            return 16;
        const fontSizeMatch = style.match(/font-size\s*:\s*([^;]+)/i);
        if (fontSizeMatch) {
            const value = fontSizeMatch[1].trim();
            return this.parseFontSize(value);
        }
        return 16;
    }
    getFontWeight(element) {
        const style = element.attributes.style;
        if (!style) {
            return ['b', 'strong'].includes(element.tagName) ? 700 : 400;
        }
        const fontWeightMatch = style.match(/font-weight\s*:\s*([^;]+)/i);
        if (fontWeightMatch) {
            const value = fontWeightMatch[1].trim();
            if (value === 'bold')
                return 700;
            if (value === 'normal')
                return 400;
            return parseInt(value, 10) || 400;
        }
        return ['b', 'strong'].includes(element.tagName) ? 700 : 400;
    }
    isLargeText(fontSize, fontWeight) {
        if (fontSize >= this.LARGE_TEXT_SIZE_PX)
            return true;
        if (fontSize >= this.LARGE_TEXT_BOLD_SIZE_PX && fontWeight >= 700)
            return true;
        return false;
    }
    parseFontSize(value) {
        if (value.endsWith('px')) {
            return parseFloat(value);
        }
        if (value.endsWith('em')) {
            return parseFloat(value) * 16;
        }
        if (value.endsWith('rem')) {
            return parseFloat(value) * 16;
        }
        if (value.endsWith('pt')) {
            return parseFloat(value) * 1.333;
        }
        const num = parseFloat(value);
        return isNaN(num) ? 16 : num;
    }
    parseColor(colorStr) {
        colorStr = colorStr.trim().toLowerCase();
        const rgbaMatch = colorStr.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
        if (rgbaMatch) {
            return {
                r: parseInt(rgbaMatch[1], 10),
                g: parseInt(rgbaMatch[2], 10),
                b: parseInt(rgbaMatch[3], 10),
                a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
            };
        }
        const hexMatch = colorStr.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
        if (hexMatch) {
            const hex = hexMatch[1];
            if (hex.length === 3) {
                return {
                    r: parseInt(hex[0] + hex[0], 16),
                    g: parseInt(hex[1] + hex[1], 16),
                    b: parseInt(hex[2] + hex[2], 16),
                    a: 1
                };
            }
            else {
                return {
                    r: parseInt(hex.substring(0, 2), 16),
                    g: parseInt(hex.substring(2, 4), 16),
                    b: parseInt(hex.substring(4, 6), 16),
                    a: 1
                };
            }
        }
        const namedColors = {
            'black': { r: 0, g: 0, b: 0, a: 1 },
            'white': { r: 255, g: 255, b: 255, a: 1 },
            'red': { r: 255, g: 0, b: 0, a: 1 },
            'green': { r: 0, g: 128, b: 0, a: 1 },
            'blue': { r: 0, g: 0, b: 255, a: 1 },
            'gray': { r: 128, g: 128, b: 128, a: 1 },
            'grey': { r: 128, g: 128, b: 128, a: 1 },
            'transparent': { r: 0, g: 0, b: 0, a: 0 }
        };
        return namedColors[colorStr] || null;
    }
    calculateContrastRatio(fg, bg) {
        const l1 = this.relativeLuminance(fg);
        const l2 = this.relativeLuminance(bg);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }
    relativeLuminance(color) {
        const rsRGB = color.r / 255;
        const gsRGB = color.g / 255;
        const bsRGB = color.b / 255;
        const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    isHidden(element) {
        if (element.attributes['aria-hidden'] === 'true')
            return true;
        if (element.attributes.hidden !== undefined)
            return true;
        const style = element.attributes.style;
        if (style) {
            if (style.includes('display:none') || style.includes('display: none'))
                return true;
            if (style.includes('visibility:hidden') || style.includes('visibility: hidden'))
                return true;
        }
        return false;
    }
    reportIndeterminateContrast(element, layer, reason, context, issues) {
        const reasonMessages = {
            'background-image-or-gradient': 'background has image or gradient',
            'z-index-detected': 'z-index detected in ancestor tree before solid background',
            'color-transition': 'text color has transition or animation',
            'background-transition': 'background color has transition or animation',
            'low-opacity-text': 'text opacity is too low (< 80%)',
            'low-opacity-background': 'background opacity is too low (< 80%)'
        };
        const message = `Color contrast cannot be reliably calculated: ${reasonMessages[reason] || reason}. ${layer === 'background' ? 'Background' : 'Text color'} is indeterminate. Manual verification required - ensure text has sufficient contrast (4.5:1 for normal text, 3:1 for large text). Use browser DevTools or contrast checker tools to verify.`;
        const textContent = element.textContent?.trim().substring(0, 50) || 'text content';
        issues.push(this.createIssue('contrast-indeterminate', 'warning', message, element.location, ['1.4.3'], context, {
            elementContext: context.documentModel?.getElementContext(element),
            fix: {
                description: `Manually verify contrast for: "${textContent}"

Cannot auto-calculate because: ${reasonMessages[reason]}

Use one of these methods to verify:
1. Browser DevTools: Inspect element → Check contrast in accessibility panel
2. Online tool: https://webaim.org/resources/contrastchecker/
3. Browser extension: WAVE, axe DevTools, or Lighthouse

WCAG AA Requirements:
- Normal text (< 18px): 4.5:1 contrast ratio
- Large text (≥ 18px or ≥ 14px bold): 3.0:1 contrast ratio

If using background images/gradients:
- Ensure text has solid color overlay/shadow
- Or use multiple background layers with solid fallback
- Or ensure image provides sufficient contrast everywhere`,
                code: `<!-- Example: Add text shadow for readability over images -->
<div style="
  background-image: url('hero.jpg');
  background-size: cover;">
  <h1 style="
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
    Text with shadow for contrast
  </h1>
</div>

<!-- Example: Use overlay for guaranteed contrast -->
<div style="
  position: relative;
  background-image: url('hero.jpg');">
  <div style="
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.6);"></div>
  <h1 style="
    position: relative;
    color: white;">
    Text on overlay
  </h1>
</div>`,
                location: element.location
            }
        }));
    }
    reportInsufficientContrast(element, actualRatio, requiredRatio, isLargeText, fgColor, bgColor, context, issues) {
        const textContent = element.textContent?.trim().substring(0, 50) || 'text content';
        const textType = isLargeText ? 'large text' : 'normal text';
        const message = `Insufficient color contrast: ${actualRatio.toFixed(2)}:1 (requires ${requiredRatio}:1 for ${textType}). Text "${textContent}" may be difficult to read for users with low vision. Foreground: rgb(${fgColor.r}, ${fgColor.g}, ${fgColor.b}), Background: rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b}).`;
        const suggestions = this.generateContrastSuggestions(fgColor, bgColor, requiredRatio);
        issues.push(this.createIssue('insufficient-contrast', 'error', message, element.location, ['1.4.3'], context, {
            elementContext: context.documentModel?.getElementContext(element),
            fix: {
                description: `Improve contrast for "${textContent}"

Current: ${actualRatio.toFixed(2)}:1
Required: ${requiredRatio}:1 (${textType})

${suggestions}

WCAG AA Requirements:
- Normal text (< 18px): 4.5:1 minimum
- Large text (≥ 18px or ≥ 14px bold): 3.0:1 minimum

Test contrast: https://webaim.org/resources/contrastchecker/`,
                code: `/* Current colors (insufficient contrast) */
color: ${this.colorToString(fgColor)};
background-color: ${this.colorToString(bgColor)};

/* Suggested fix: Darken foreground or lighten background */
${this.generateFixCode(fgColor, bgColor, requiredRatio)}`,
                location: element.location
            }
        }));
    }
    generateContrastSuggestions(fg, bg, _required) {
        const suggestions = [];
        const fgLum = this.relativeLuminance(fg);
        const bgLum = this.relativeLuminance(bg);
        if (fgLum > bgLum) {
            suggestions.push('Option 1: Lighten the text color (increase brightness)');
            suggestions.push('Option 2: Darken the background color');
        }
        else {
            suggestions.push('Option 1: Darken the text color (decrease brightness)');
            suggestions.push('Option 2: Lighten the background color');
        }
        suggestions.push('Option 3: Increase font size to use large text threshold (3.0:1)');
        return suggestions.join('\n');
    }
    generateFixCode(_fg, bg, _required) {
        const bgLum = this.relativeLuminance(bg);
        if (bgLum > 0.5) {
            return `color: #000000; /* Black text on light background */
background-color: ${this.colorToString(bg)};`;
        }
        else {
            return `color: #FFFFFF; /* White text on dark background */
background-color: ${this.colorToString(bg)};`;
        }
    }
    colorToString(color) {
        if (color.a < 1) {
            return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        }
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
}
exports.ColorContrastAnalyzer = ColorContrastAnalyzer;
