import React from 'react'

type Suggestion = {
  type: 'good' | 'improve';
  tip: string;
};

export interface AtsProps {
  score: number;
  suggestions: Suggestion[];
}

const getGradient = (score: number) => {
  // lighter gradients so text (dark) is clearly visible
  if (score > 70) return 'bg-gradient-to-r from-green-100 to-green-200';
  if (score > 50) return 'bg-gradient-to-r from-yellow-100 to-yellow-200';
  return 'bg-gradient-to-r from-red-100 to-red-200';
};

const getLabel = (score: number) => {
  if (score > 70) return 'Good';
  if (score > 50) return 'Average';
  return 'Needs work';
};

const Ats: React.FC<AtsProps> = ({ score, suggestions }) => {
  const gradient = getGradient(score);
  const label = getLabel(score);

  return (
    <article
      aria-label={`ATS score card: ${label} (${score})`}
      className={`rounded-xl p-4 text-gray-900 shadow-sm ${gradient} w-full`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">ATS Score</h3>
          <p className="text-base opacity-90">Overall suitability for ATS</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold leading-none">{score}</span>
            <span className="text-base">/100</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-white text-base font-medium text-gray-900">{label}</div>
        </div>
      </div>

      <div className="mt-4 bg-white/80 rounded-md p-3">
  <h4 className="text-base font-semibold mb-2 text-gray-900">Suggestions</h4>
        {suggestions && suggestions.length > 0 ? (
          <ul className="space-y-2">
            {suggestions.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span
                  className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${
                    sug.type === 'good' ? 'bg-green-600' : 'bg-red-600'
                  }`}
                  aria-hidden
                />
                <div>
                  <p className="text-base font-medium text-gray-900">{sug.tip}</p>
                  <p className="text-sm text-gray-700">{sug.type === 'good' ? 'Strength' : 'Improvement'}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base opacity-90">No suggestions available.</p>
        )}
      </div>
    </article>
  );
};

export default Ats;
