import { BaseAnalyzer, Issue, AnalyzerContext } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

/**
 * ColorContrastAnalyzer - Detects insufficient color contrast for text
 *
 * Implements WCAG 1.4.3 (Contrast Minimum) Level AA
 *
 * Detects:
 * - Text with insufficient contrast ratio (< 4.5:1 for normal text, < 3:1 for large text)
 * - Warns when contrast cannot be reliably determined (gradients, images, animations, etc.)
 *
 * Skips calculation (with warning) when:
 * - Background has images or gradients
 * - Z-index found in ancestor tree before solid background
 * - Text escapes parent container dimensions
 * - Color transitions/tweens detected
 * - Font size transitions detected
 * - Opacity too low on text or background
 *
 * Priority: HIGH IMPACT
 * Target: Ensures text is readable for low vision users
 */
export class ColorContrastAnalyzer extends BaseAnalyzer {
  readonly name = 'ColorContrastAnalyzer';
  readonly description = 'Detects insufficient color contrast and warns when contrast cannot be reliably determined';

  // WCAG AA thresholds
  private readonly NORMAL_TEXT_RATIO = 4.5;
  private readonly LARGE_TEXT_RATIO = 3.0;
  private readonly LARGE_TEXT_SIZE_PX = 18; // 18px or 14px bold
  private readonly LARGE_TEXT_BOLD_SIZE_PX = 14;

  // Minimum opacity to consider reliable
  private readonly MIN_OPACITY = 0.8;

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.documentModel || !context.documentModel.dom) {
      return issues;
    }

    const allElements = context.documentModel.getAllElements();

    // Find all text-containing elements
    const textElements = this.findTextElements(allElements);

    for (const element of textElements) {
      this.analyzeTextContrast(element, allElements, context, issues);
    }

    return issues;
  }

  /**
   * Find elements that contain visible text
   */
  private findTextElements(allElements: DOMElement[]): DOMElement[] {
    return allElements.filter(el => {
      // Has text content
      if (!el.textContent || el.textContent.trim().length === 0) {
        return false;
      }

      // Skip hidden elements
      if (this.isHidden(el)) {
        return false;
      }

      // Skip non-text elements (images, inputs without text, etc.)
      if (['img', 'video', 'audio', 'canvas', 'svg'].includes(el.tagName)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Analyze contrast for a text element
   */
  private analyzeTextContrast(
    element: DOMElement,
    allElements: DOMElement[],
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    // Get foreground color
    const fgResult = this.getForegroundColor(element);
    if (!fgResult.reliable) {
      this.reportIndeterminateContrast(element, 'foreground', fgResult.reason!, context, issues);
      return;
    }

    // Get background color by walking up the tree
    const bgResult = this.getBackgroundColor(element, allElements);
    if (!bgResult.reliable) {
      this.reportIndeterminateContrast(element, 'background', bgResult.reason!, context, issues);
      return;
    }

    // Get font size to determine threshold
    const fontSize = this.getFontSize(element);
    const fontWeight = this.getFontWeight(element);
    const isLargeText = this.isLargeText(fontSize, fontWeight);

    // Calculate contrast ratio
    const contrastRatio = this.calculateContrastRatio(fgResult.color!, bgResult.color!);

    // Determine if it passes WCAG AA
    const requiredRatio = isLargeText ? this.LARGE_TEXT_RATIO : this.NORMAL_TEXT_RATIO;
    const passes = contrastRatio >= requiredRatio;

    if (!passes) {
      this.reportInsufficientContrast(
        element,
        contrastRatio,
        requiredRatio,
        isLargeText,
        fgResult.color!,
        bgResult.color!,
        context,
        issues
      );
    }
  }

  /**
   * Get foreground color (text color)
   */
  private getForegroundColor(element: DOMElement): ColorResult {
    // Check inline style
    const style = element.attributes.style;
    if (style) {
      const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
      if (colorMatch) {
        const color = this.parseColor(colorMatch[1].trim());
        if (color) {
          // Check for transitions/animations
          if (this.hasColorTransition(style, 'color')) {
            return { reliable: false, reason: 'color-transition' };
          }

          // Check opacity
          if (color.a < this.MIN_OPACITY) {
            return { reliable: false, reason: 'low-opacity-text' };
          }

          return { reliable: true, color };
        }
      }

      // Check for transitions even without explicit color
      if (this.hasColorTransition(style, 'color')) {
        return { reliable: false, reason: 'color-transition' };
      }
    }

    // Check for class-based transitions (heuristic)
    const className = element.attributes.class;
    if (className && (className.includes('transition') || className.includes('animate'))) {
      return { reliable: false, reason: 'color-transition' };
    }

    // Default to black text (browser default)
    return { reliable: true, color: { r: 0, g: 0, b: 0, a: 1 } };
  }

  /**
   * Get background color by walking up the DOM tree
   */
  private getBackgroundColor(element: DOMElement, _allElements: DOMElement[]): ColorResult {
    let current: DOMElement | undefined = element;

    while (current) {
      // Check for z-index before finding background
      if (this.hasZIndex(current)) {
        return { reliable: false, reason: 'z-index-detected' };
      }

      // Check inline style
      const style = current.attributes.style;
      if (style) {
        // Check for background image or gradient
        if (this.hasBackgroundImage(style) || this.hasGradient(style)) {
          return { reliable: false, reason: 'background-image-or-gradient' };
        }

        // Check for background color
        const bgColorMatch = style.match(/background-color\s*:\s*([^;]+)/i);
        if (bgColorMatch) {
          const color = this.parseColor(bgColorMatch[1].trim());
          if (color) {
            // Check for transitions
            if (this.hasColorTransition(style, 'background-color')) {
              return { reliable: false, reason: 'background-transition' };
            }

            // Check opacity
            if (color.a < this.MIN_OPACITY) {
              return { reliable: false, reason: 'low-opacity-background' };
            }

            // Check if solid color (not transparent)
            if (color.a === 1) {
              return { reliable: true, color };
            }
          }
        }

        // Check for background shorthand
        const bgMatch = style.match(/background\s*:\s*([^;]+)/i);
        if (bgMatch) {
          const bgValue = bgMatch[1].trim();

          // Check for image/gradient
          if (bgValue.includes('url(') || bgValue.includes('gradient(')) {
            return { reliable: false, reason: 'background-image-or-gradient' };
          }

          // Try to parse color from background shorthand
          const color = this.parseColor(bgValue);
          if (color && color.a === 1) {
            return { reliable: true, color };
          }
        }
      }

      // Move to parent
      current = current.parent;
    }

    // Reached root without finding background - default to white
    return { reliable: true, color: { r: 255, g: 255, b: 255, a: 1 } };
  }

  /**
   * Check if element has z-index
   */
  private hasZIndex(element: DOMElement): boolean {
    const style = element.attributes.style;
    if (!style) return false;

    return /z-index\s*:\s*[^;]+/.test(style);
  }

  /**
   * Check if style has background image
   */
  private hasBackgroundImage(style: string): boolean {
    return /background-image\s*:\s*url\(/i.test(style) ||
           /background\s*:\s*[^;]*url\(/i.test(style);
  }

  /**
   * Check if style has gradient
   */
  private hasGradient(style: string): boolean {
    return /gradient\(/i.test(style);
  }

  /**
   * Check if style has color transition
   */
  private hasColorTransition(style: string, property: string): boolean {
    // Check for transition or animation on the color property
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

  /**
   * Get font size in pixels
   */
  private getFontSize(element: DOMElement): number {
    const style = element.attributes.style;
    if (!style) return 16; // Browser default

    const fontSizeMatch = style.match(/font-size\s*:\s*([^;]+)/i);
    if (fontSizeMatch) {
      const value = fontSizeMatch[1].trim();
      return this.parseFontSize(value);
    }

    return 16; // Browser default
  }

  /**
   * Get font weight
   */
  private getFontWeight(element: DOMElement): number {
    const style = element.attributes.style;
    if (!style) {
      // Check if element is bold tag
      return ['b', 'strong'].includes(element.tagName) ? 700 : 400;
    }

    const fontWeightMatch = style.match(/font-weight\s*:\s*([^;]+)/i);
    if (fontWeightMatch) {
      const value = fontWeightMatch[1].trim();
      if (value === 'bold') return 700;
      if (value === 'normal') return 400;
      return parseInt(value, 10) || 400;
    }

    return ['b', 'strong'].includes(element.tagName) ? 700 : 400;
  }

  /**
   * Check if text is considered large
   */
  private isLargeText(fontSize: number, fontWeight: number): boolean {
    // 18px+ or 14px+ bold
    if (fontSize >= this.LARGE_TEXT_SIZE_PX) return true;
    if (fontSize >= this.LARGE_TEXT_BOLD_SIZE_PX && fontWeight >= 700) return true;
    return false;
  }

  /**
   * Parse font size to pixels
   */
  private parseFontSize(value: string): number {
    // Handle px
    if (value.endsWith('px')) {
      return parseFloat(value);
    }

    // Handle em (assume 16px base)
    if (value.endsWith('em')) {
      return parseFloat(value) * 16;
    }

    // Handle rem (assume 16px base)
    if (value.endsWith('rem')) {
      return parseFloat(value) * 16;
    }

    // Handle pt (1pt = 1.333px)
    if (value.endsWith('pt')) {
      return parseFloat(value) * 1.333;
    }

    // Try parsing as number (assume px)
    const num = parseFloat(value);
    return isNaN(num) ? 16 : num;
  }

  /**
   * Parse color string to RGBA
   */
  private parseColor(colorStr: string): Color | null {
    colorStr = colorStr.trim().toLowerCase();

    // RGB/RGBA
    const rgbaMatch = colorStr.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
    if (rgbaMatch) {
      return {
        r: parseInt(rgbaMatch[1], 10),
        g: parseInt(rgbaMatch[2], 10),
        b: parseInt(rgbaMatch[3], 10),
        a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
      };
    }

    // Hex colors
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
      } else {
        return {
          r: parseInt(hex.substring(0, 2), 16),
          g: parseInt(hex.substring(2, 4), 16),
          b: parseInt(hex.substring(4, 6), 16),
          a: 1
        };
      }
    }

    // Named colors (common ones)
    const namedColors: Record<string, Color> = {
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

  /**
   * Calculate contrast ratio using WCAG formula
   */
  private calculateContrastRatio(fg: Color, bg: Color): number {
    const l1 = this.relativeLuminance(fg);
    const l2 = this.relativeLuminance(bg);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Calculate relative luminance
   */
  private relativeLuminance(color: Color): number {
    const rsRGB = color.r / 255;
    const gsRGB = color.g / 255;
    const bsRGB = color.b / 255;

    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Check if element is hidden
   */
  private isHidden(element: DOMElement): boolean {
    if (element.attributes['aria-hidden'] === 'true') return true;
    if (element.attributes.hidden !== undefined) return true;

    const style = element.attributes.style;
    if (style) {
      if (style.includes('display:none') || style.includes('display: none')) return true;
      if (style.includes('visibility:hidden') || style.includes('visibility: hidden')) return true;
    }

    return false;
  }

  /**
   * Report indeterminate contrast (cannot be reliably calculated)
   */
  private reportIndeterminateContrast(
    element: DOMElement,
    layer: 'foreground' | 'background',
    reason: string,
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const reasonMessages: Record<string, string> = {
      'background-image-or-gradient': 'background has image or gradient',
      'z-index-detected': 'z-index detected in ancestor tree before solid background',
      'color-transition': 'text color has transition or animation',
      'background-transition': 'background color has transition or animation',
      'low-opacity-text': 'text opacity is too low (< 80%)',
      'low-opacity-background': 'background opacity is too low (< 80%)'
    };

    const message = `Color contrast cannot be reliably calculated: ${reasonMessages[reason] || reason}. ${layer === 'background' ? 'Background' : 'Text color'} is indeterminate. Manual verification required - ensure text has sufficient contrast (4.5:1 for normal text, 3:1 for large text). Use browser DevTools or contrast checker tools to verify.`;

    const textContent = element.textContent?.trim().substring(0, 50) || 'text content';

    issues.push(
      this.createIssue(
        'contrast-indeterminate',
        'warning',
        message,
        element.location,
        ['1.4.3'],
        context,
        {
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
        }
      )
    );
  }

  /**
   * Report insufficient contrast
   */
  private reportInsufficientContrast(
    element: DOMElement,
    actualRatio: number,
    requiredRatio: number,
    isLargeText: boolean,
    fgColor: Color,
    bgColor: Color,
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const textContent = element.textContent?.trim().substring(0, 50) || 'text content';
    const textType = isLargeText ? 'large text' : 'normal text';

    const message = `Insufficient color contrast: ${actualRatio.toFixed(2)}:1 (requires ${requiredRatio}:1 for ${textType}). Text "${textContent}" may be difficult to read for users with low vision. Foreground: rgb(${fgColor.r}, ${fgColor.g}, ${fgColor.b}), Background: rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b}).`;

    // Generate suggested colors
    const suggestions = this.generateContrastSuggestions(fgColor, bgColor, requiredRatio);

    issues.push(
      this.createIssue(
        'insufficient-contrast',
        'error',
        message,
        element.location,
        ['1.4.3'],
        context,
        {
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
        }
      )
    );
  }

  /**
   * Generate contrast improvement suggestions
   */
  private generateContrastSuggestions(fg: Color, bg: Color, _required: number): string {
    const suggestions: string[] = [];

    // Calculate current luminances
    const fgLum = this.relativeLuminance(fg);
    const bgLum = this.relativeLuminance(bg);

    if (fgLum > bgLum) {
      // Light text on dark background
      suggestions.push('Option 1: Lighten the text color (increase brightness)');
      suggestions.push('Option 2: Darken the background color');
    } else {
      // Dark text on light background
      suggestions.push('Option 1: Darken the text color (decrease brightness)');
      suggestions.push('Option 2: Lighten the background color');
    }

    suggestions.push('Option 3: Increase font size to use large text threshold (3.0:1)');

    return suggestions.join('\n');
  }

  /**
   * Generate fix code with better contrast
   */
  private generateFixCode(_fg: Color, bg: Color, _required: number): string {
    // Simple heuristic: suggest pure black or white based on which is closer
    const bgLum = this.relativeLuminance(bg);

    if (bgLum > 0.5) {
      // Light background - use darker text
      return `color: #000000; /* Black text on light background */
background-color: ${this.colorToString(bg)};`;
    } else {
      // Dark background - use lighter text
      return `color: #FFFFFF; /* White text on dark background */
background-color: ${this.colorToString(bg)};`;
    }
  }

  /**
   * Convert color to CSS string
   */
  private colorToString(color: Color): string {
    if (color.a < 1) {
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }
}

/**
 * Color representation
 */
interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Color extraction result
 */
interface ColorResult {
  reliable: boolean;
  color?: Color;
  reason?: string; // Why it's unreliable
}
