'use client';

import React from 'react';

interface ConfidenceBadgeProps {
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  score: number;
  reason?: string;
  compact?: boolean;
}

/**
 * ConfidenceBadge displays the confidence level for an accessibility issue.
 *
 * Confidence levels:
 * - HIGH (0.9-1.0): Green badge, no false positive risk
 * - MEDIUM (0.6-0.8): Yellow badge, some uncertainty
 * - LOW (0.4-0.5): Orange badge, may have false positives
 */
export default function ConfidenceBadge({ level, score, reason, compact = false }: ConfidenceBadgeProps) {
  const percentage = Math.round(score * 100);

  // Color scheme based on level
  const colors = {
    HIGH: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      icon: '✓'
    },
    MEDIUM: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      icon: '⚠'
    },
    LOW: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-300',
      icon: '!'
    }
  };

  const style = colors[level];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
        title={reason || `Confidence: ${percentage}%`}
      >
        <span aria-hidden="true">{style.icon}</span>
        <span>{percentage}%</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex flex-col gap-1 px-3 py-2 rounded border ${style.bg} ${style.text} ${style.border}`}
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-lg">{style.icon}</span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold">Confidence: {percentage}%</span>
          <span className="text-xs opacity-80">{level}</span>
        </div>
      </div>
      {reason && (
        <p className="text-xs mt-1 opacity-90">
          {reason}
        </p>
      )}
    </div>
  );
}
