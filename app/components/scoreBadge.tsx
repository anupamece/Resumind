import React from 'react'

interface ScoreBadgeProps {
  score: number;
  // optional size modifier: 'sm' | 'md' | 'lg'
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ScoreBadge
 * - Displays a small badge for a numeric score with dynamic color and label
 * - Labels: >70 => Good (green), 50-70 => Average (amber), <50 => Needs work (red)
 */
const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, size = 'md' }) => {
  const normalized = Number(score) || 0;

  let bg = 'bg-gray-100';
  let text = 'text-gray-800';
  let border = 'border-gray-200';
  let label = 'Unknown';

  if (normalized > 70) {
    bg = 'bg-green-50';
    text = 'text-green-800';
    border = 'border-green-200';
    label = 'Good';
  } else if (normalized >= 50) {
    bg = 'bg-amber-50';
    text = 'text-amber-800';
    border = 'border-amber-200';
    label = 'Average';
  } else {
    bg = 'bg-red-50';
    text = 'text-red-800';
    border = 'border-red-200';
    label = 'Needs work';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  } as const;

  return (
    <span
      role="status"
      aria-label={`Score: ${normalized}. ${label}`}
      className={`inline-flex items-center gap-2 font-medium rounded-full border ${bg} ${text} ${border} ${sizeClasses[size]}`}
    >
      <span className="font-semibold">{normalized}</span>
      <span className="opacity-80">{label}</span>
    </span>
  );
};

export default ScoreBadge;
