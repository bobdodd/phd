/**
 * Base Analyzer
 *
 * Abstract base class for all accessibility analyzers.
 * Provides backward compatibility for file-scope analysis while
 * supporting enhanced DocumentModel-based analysis.
 */

import { DocumentModel, ElementContext } from '../models/DocumentModel';
import { ActionLanguageModel } from '../models/ActionLanguageModel';
import { SourceLocation } from '../models/BaseModel';

/**
 * Analysis scope determines what context is available.
 */
export type AnalysisScope = 'file' | 'workspace' | 'page';

/**
 * Analyzer context provides all available models and scope.
 */
export interface AnalyzerContext {
  /** Document model (if page/workspace analysis available) */
  documentModel?: DocumentModel;

  /** Single ActionLanguage model (legacy file-scope fallback) */
  actionLanguageModel?: ActionLanguageModel;

  /** Analysis scope */
  scope: AnalysisScope;
}

/**
 * Issue severity levels.
 */
export type IssueSeverity = 'error' | 'warning' | 'info';

/**
 * Confidence level for an issue.
 */
export interface IssueConfidence {
  /** Confidence level for this issue */
  level: 'HIGH' | 'MEDIUM' | 'LOW';

  /** Numerical confidence score (0.0 to 1.0) */
  score: number;

  /** Human-readable reason for the confidence level */
  reason: string;

  /** Analysis scope used (affects confidence) */
  scope: 'file' | 'page' | 'workspace';
}

/**
 * Accessibility issue detected by an analyzer.
 */
export interface Issue {
  /** Issue type identifier */
  type: string;

  /** Issue severity */
  severity: IssueSeverity;

  /** WCAG criteria violated (e.g., ['2.1.1', '4.1.2']) */
  wcagCriteria: string[];

  /** Human-readable message */
  message: string;

  /** Confidence in this issue - HIGH means no false positive risk */
  confidence: IssueConfidence;

  /** Primary location of the issue */
  location: SourceLocation;

  /** Related locations (e.g., missing keyboard handler location) */
  relatedLocations?: SourceLocation[];

  /** Element context (if available from DocumentModel) */
  elementContext?: ElementContext;

  /** Suggested fix (optional) */
  fix?: IssueFix;
}

/**
 * Suggested fix for an issue.
 */
export interface IssueFix {
  /** Description of the fix */
  description: string;

  /** Code to insert/replace */
  code: string;

  /** Location to apply the fix */
  location: SourceLocation;
}

/**
 * Base class for all analyzers.
 *
 * Analyzers can operate in two modes:
 * 1. File-scope: Analyze a single ActionLanguageModel (legacy, may have false positives)
 * 2. Document-scope: Analyze DocumentModel with full context (accurate, eliminates false positives)
 *
 * Analyzers should prefer DocumentModel when available, falling back to
 * file-scope analysis for backward compatibility.
 */
export abstract class BaseAnalyzer {
  /** Analyzer name */
  abstract readonly name: string;

  /** Analyzer description */
  abstract readonly description: string;

  /**
   * Analyze the provided context and return issues.
   *
   * @param context - Analysis context with models and scope
   * @returns Array of accessibility issues
   */
  abstract analyze(context: AnalyzerContext): Issue[];

  /**
   * Check if DocumentModel is available and has DOM.
   * When true, analyzers should use document-scope analysis for accuracy.
   *
   * @param context - Analysis context
   * @returns True if DocumentModel with DOM is available
   */
  protected supportsDocumentModel(context: AnalyzerContext): boolean {
    return (
      context.documentModel !== undefined &&
      context.documentModel.dom !== undefined
    );
  }

  /**
   * Check if only file-scope analysis is available.
   * When true, analyzers should use legacy analysis (may have false positives).
   *
   * @param context - Analysis context
   * @returns True if only file-scope analysis is available
   */
  protected isFileScopeOnly(context: AnalyzerContext): boolean {
    return (
      context.scope === 'file' ||
      context.actionLanguageModel !== undefined &&
      context.documentModel === undefined
    );
  }

  /**
   * Get all interactive elements from DocumentModel.
   * Helper method for analyzers that need to check all interactive elements.
   *
   * @param context - Analysis context
   * @returns Array of element contexts, or empty array if no DocumentModel
   */
  protected getInteractiveElements(context: AnalyzerContext): ElementContext[] {
    if (!context.documentModel || !context.documentModel.dom) {
      return [];
    }
    return context.documentModel.getInteractiveElements();
  }

  /**
   * Get all elements with accessibility issues.
   * Helper method for analyzers.
   *
   * @param context - Analysis context
   * @returns Array of element contexts with issues
   */
  protected getElementsWithIssues(context: AnalyzerContext): ElementContext[] {
    if (!context.documentModel || !context.documentModel.dom) {
      return [];
    }
    return context.documentModel.getElementsWithIssues();
  }

  /**
   * Create an issue object with confidence scoring.
   * Helper method for consistent issue creation.
   *
   * @param type - Issue type
   * @param severity - Issue severity
   * @param message - Issue message
   * @param location - Primary location
   * @param wcagCriteria - WCAG criteria violated
   * @param context - Analysis context (for confidence scoring)
   * @param options - Additional options
   * @returns Issue object
   */
  protected createIssue(
    type: string,
    severity: IssueSeverity,
    message: string,
    location: SourceLocation,
    wcagCriteria: string[],
    context: AnalyzerContext,
    options?: {
      relatedLocations?: SourceLocation[];
      elementContext?: ElementContext;
      fix?: IssueFix;
      customConfidence?: { score: number; reason?: string };
    }
  ): Issue {
    // Compute confidence based on analysis scope and context
    let confidence: IssueConfidence;

    if (options?.customConfidence) {
      // Use custom confidence if provided
      const { score, reason } = options.customConfidence;
      confidence = {
        level: score >= 0.9 ? 'HIGH' : score >= 0.6 ? 'MEDIUM' : 'LOW',
        score,
        reason: reason || 'Custom confidence score',
        scope: context.scope,
      };
    } else {
      // Calculate issue-specific confidence
      const { score, reason } = this.calculateIssueConfidence(
        type,
        context,
        options?.elementContext
      );

      confidence = {
        level: score >= 0.9 ? 'HIGH' : score >= 0.6 ? 'MEDIUM' : 'LOW',
        score,
        reason: reason || this.getDefaultConfidenceReason(context, options?.elementContext),
        scope: context.scope,
      };
    }

    return {
      type,
      severity,
      message,
      location,
      wcagCriteria,
      confidence,
      relatedLocations: options?.relatedLocations,
      elementContext: options?.elementContext,
      fix: options?.fix,
    };
  }

  /**
   * Get default confidence reason based on context.
   */
  private getDefaultConfidenceReason(
    context: AnalyzerContext,
    elementContext?: ElementContext
  ): string {
    if (context.documentModel && elementContext) {
      return 'Full document analysis with complete DOM and JavaScript context';
    }
    if (context.documentModel && context.scope !== 'file') {
      return 'Document-scope analysis with HTML, CSS, and JavaScript';
    }
    if (context.documentModel) {
      return 'Partial document context available';
    }
    return 'File-scope analysis only - may have false positives if handler is in another file';
  }

  /**
   * Compute confidence level for an issue based on available context.
   *
   * Confidence levels:
   * - HIGH (0.9-1.0): Full DocumentModel available, complete context, no false positive risk
   * - MEDIUM (0.6-0.8): Partial context, some uncertainty
   * - LOW (0.4-0.5): File-scope only, may have false positives
   */
  private computeConfidence(
    context: AnalyzerContext,
    elementContext?: ElementContext
  ): IssueConfidence {
    // HIGH confidence: Full DocumentModel with element context
    if (context.documentModel && elementContext) {
      return {
        level: 'HIGH',
        score: 1.0,
        reason: 'Full document analysis with complete DOM and JavaScript context',
        scope: context.scope,
      };
    }

    // HIGH confidence: DocumentModel available (page/workspace scope)
    if (context.documentModel && context.scope !== 'file') {
      return {
        level: 'HIGH',
        score: 0.95,
        reason: 'Document-scope analysis with HTML, CSS, and JavaScript',
        scope: context.scope,
      };
    }

    // MEDIUM confidence: Some context but not complete
    if (context.documentModel) {
      return {
        level: 'MEDIUM',
        score: 0.7,
        reason: 'Partial document context available',
        scope: context.scope,
      };
    }

    // LOW confidence: File-scope only
    return {
      level: 'LOW',
      score: 0.5,
      reason: 'File-scope analysis only - may have false positives if handler is in another file',
      scope: 'file',
    };
  }

  /**
   * Calculate confidence score for a specific issue type based on document context.
   * This method should be overridden by analyzers for issue-specific confidence calculation.
   *
   * @param issueType - The type of issue being reported
   * @param context - Analysis context
   * @param elementContext - Element context (if available)
   * @returns Confidence score and reason
   */
  protected calculateIssueConfidence(
    issueType: string,
    context: AnalyzerContext,
    elementContext?: ElementContext
  ): { score: number; reason?: string } {
    // Default implementation: use document context for base confidence
    if (!context.documentModel) {
      return {
        score: 0.5,
        reason: 'File-scope analysis only - may have false positives',
      };
    }

    const docContext = context.documentModel.getDocumentContext();

    // Fragment-safe issues (most issues): high confidence regardless of context
    // These can be detected accurately in code fragments
    const fragmentSafeIssues = new Set([
      'mouse-only-click',
      'potential-keyboard-trap',
      'screen-reader-conflict',
      'positive-tabindex',
      'invalid-role',
      'missing-required-aria',
      'orphaned-event-handler',
      'empty-heading',
      'heading-missing-text',
      'missing-alt-text',
      'alt-text-filename',
      'redundant-alt-text',
      'form-input-missing-label',
      'button-missing-label',
      'link-no-text',
      'link-ambiguous-text',
      // ... many more (see ISSUE_TYPES_REFERENCE.md)
    ]);

    if (fragmentSafeIssues.has(issueType)) {
      return { score: 1.0 };
    }

    // Body-required issues: reduced confidence without body
    const bodyRequiredIssues = new Set([
      'missing-main-landmark',
      'multiple-main-landmarks',
      'missing-h1',
      'skipped-heading-level',
      'missing-lang-attribute',
      // ... others
    ]);

    if (bodyRequiredIssues.has(issueType)) {
      if (!docContext.hasBodyTag) {
        return {
          score: 0.6,
          reason: 'Complete <body> structure required for accurate detection',
        };
      }
      return { score: 0.9 };
    }

    // Full-page required issues: reduced confidence without head
    const fullPageRequiredIssues = new Set([
      'missing-viewport-meta',
      'no-prefers-reduced-motion',
      'no-prefers-contrast',
    ]);

    if (fullPageRequiredIssues.has(issueType)) {
      if (!docContext.hasHtmlTag || !docContext.hasHeadTag) {
        return {
          score: 0.5,
          reason: 'Full HTML document with <head> required for accurate detection',
        };
      }
      return { score: 1.0 };
    }

    // Property-dependent issues (color contrast, touch targets)
    // These need special handling based on available CSS
    if (issueType.includes('contrast')) {
      if (!docContext.hasExternalCSS && elementContext) {
        // Check if element has inline color properties
        const hasInlineColor = elementContext.element.attributes.style?.includes('color');
        const hasInlineBackground = elementContext.element.attributes.style?.includes('background');

        if (hasInlineColor && hasInlineBackground) {
          return { score: 1.0 };
        }
      }

      if (docContext.hasExternalCSS && !docContext.hasHeadTag) {
        return {
          score: 0.6,
          reason: 'Color values may be defined in external CSS. Actual contrast may differ.',
        };
      }

      return { score: 0.7 };
    }

    if (issueType.includes('touch-target')) {
      if (elementContext) {
        const hasInlineSize =
          elementContext.element.attributes.style?.includes('width') ||
          elementContext.element.attributes.style?.includes('height') ||
          elementContext.element.attributes.width ||
          elementContext.element.attributes.height;

        if (hasInlineSize) {
          return { score: 1.0 };
        }
      }

      if (docContext.hasExternalCSS) {
        return {
          score: 0.65,
          reason: 'Element size may be defined in external CSS. Actual rendered size may differ.',
        };
      }

      return {
        score: 0.5,
        reason: 'Element size not specified. Cannot determine if touch target is adequate without CSS.',
      };
    }

    // Default: medium confidence
    return { score: 0.8 };
  }
}
