'use client';

import React from 'react';

interface DocumentContextBannerProps {
  hasHtmlTag: boolean;
  hasBodyTag: boolean;
  hasHeadTag: boolean;
  issueCount: number;
  highConfidenceCount: number;
  mediumConfidenceCount: number;
  lowConfidenceCount: number;
}

/**
 * DocumentContextBanner shows what document structure is available
 * and how it affects confidence in issue detection.
 */
export default function DocumentContextBanner({
  hasHtmlTag,
  hasBodyTag,
  hasHeadTag,
  issueCount,
  highConfidenceCount,
  mediumConfidenceCount,
  lowConfidenceCount
}: DocumentContextBannerProps) {
  // Determine context level
  let contextLevel: 'full' | 'body' | 'fragment';
  let icon: string;
  let bgColor: string;
  let textColor: string;
  let title: string;
  let description: string;

  if (hasHtmlTag && hasHeadTag && hasBodyTag) {
    // Full page
    contextLevel = 'full';
    icon = '✅';
    bgColor = 'bg-green-50';
    textColor = 'text-green-900';
    title = 'Analyzing complete HTML document';
    description = 'All checks running with full confidence';
  } else if (hasBodyTag) {
    // Body only
    contextLevel = 'body';
    icon = '📄';
    bgColor = 'bg-blue-50';
    textColor = 'text-blue-900';
    title = 'Analyzing partial page (body only)';
    description = 'Most checks running with high confidence';
  } else {
    // Fragment
    contextLevel = 'fragment';
    icon = '📋';
    bgColor = 'bg-yellow-50';
    textColor = 'text-yellow-900';
    title = 'Analyzing code fragment';
    description = 'Some checks have reduced confidence (missing document context)';
  }

  const totalIssues = issueCount;
  const totalChecks = 119; // As documented in ISSUE_TYPES_REFERENCE.md

  return (
    <div className={`${bgColor} border border-gray-300 rounded-lg p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden="true">{icon}</span>
        <div className="flex-1">
          <h3 className={`font-semibold ${textColor} mb-1`}>
            {title}
          </h3>
          <p className={`text-sm ${textColor} opacity-90 mb-2`}>
            {description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`${textColor} opacity-75`}>
              <span className="font-medium">{totalIssues}</span> issues detected from <span className="font-medium">{totalChecks}</span> checks
            </div>
            <div className={`${textColor} opacity-75 flex gap-3`}>
              {highConfidenceCount > 0 && (
                <span title="High confidence issues">
                  <span className="text-green-700 font-medium">{highConfidenceCount}</span> high
                </span>
              )}
              {mediumConfidenceCount > 0 && (
                <span title="Medium confidence issues">
                  <span className="text-yellow-700 font-medium">{mediumConfidenceCount}</span> medium
                </span>
              )}
              {lowConfidenceCount > 0 && (
                <span title="Low confidence issues">
                  <span className="text-orange-700 font-medium">{lowConfidenceCount}</span> low
                </span>
              )}
            </div>
          </div>

          {/* Recommendations based on context */}
          {contextLevel === 'fragment' && (
            <div className={`mt-3 p-2 rounded ${textColor} bg-white/50 text-xs`}>
              <p className="font-medium mb-1">💡 Improve confidence:</p>
              <ul className="list-disc list-inside space-y-0.5 opacity-90">
                <li>Add <code className="bg-black/10 px-1 rounded">&lt;body&gt;</code> tags for 85% confidence on all checks</li>
                <li>Use full HTML document with <code className="bg-black/10 px-1 rounded">&lt;head&gt;</code> for 100% confidence</li>
              </ul>
            </div>
          )}

          {contextLevel === 'body' && !hasHeadTag && (
            <div className={`mt-3 p-2 rounded ${textColor} bg-white/50 text-xs`}>
              <p className="font-medium mb-1">💡 Improve confidence:</p>
              <ul className="list-disc list-inside space-y-0.5 opacity-90">
                <li>Add <code className="bg-black/10 px-1 rounded">&lt;head&gt;</code> section for full confidence on CSS and meta tag checks</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
