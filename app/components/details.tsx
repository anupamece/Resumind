import React, { useState } from 'react'

type Tip = {
  type?: 'good' | 'improve';
  tip: string;
  explanation?: string;
};

type Category = {
  score: number;
  tips: Tip[];
};

interface DetailsProps {
  feedback: Feedback;
}

const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  let bg = 'bg-red-500'
  let text = 'text-white'
  if (score > 70) {
    bg = 'bg-green-500'
    text = 'text-white'
  } else if (score > 50) {
    bg = 'bg-yellow-400'
    text = 'text-gray-900'
  }


  return (
    <span
      aria-label={`Score ${score}`}
      className={`${bg} ${text} px-3 py-1 rounded-full font-semibold text-sm shadow-sm`}
    >
      {score}
    </span>
  )
}

const getStatusLabel = (score: number) => {
  if (score > 70) return { text: 'Good', bg: 'bg-green-100', textColor: 'text-green-800' };
  if (score > 50) return { text: 'Average', bg: 'bg-yellow-100', textColor: 'text-yellow-800' };
  return { text: 'Improvement needed', bg: 'bg-red-100', textColor: 'text-red-800' };
}

const StatusBadge: React.FC<{ score: number }> = ({ score }) => {
  const s = getStatusLabel(score);
  return (
    <span className={`${s.bg} ${s.textColor} px-2 py-0.5 rounded-md text-sm font-semibold`}>{s.text}</span>
  )
}

const CategoryHeader: React.FC<{ title: string; categoryScore: number }> = ({ title, categoryScore }) => {
  return (
    <div className={`flex items-center justify-between w-full`}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="flex items-center gap-3">
        <ScoreBadge score={categoryScore} />
        <StatusBadge score={categoryScore} />
      </div>
    </div>
  )
}

type StatusClasses = {
  gradient: string;
  border: string;
  accent: string; // color for left-border and emphasis
}

const getCategoryGradient = (score: number): StatusClasses => {
  // return a small set of Tailwind classes to apply per status
  if (score > 70)
    return {
      gradient: 'bg-gradient-to-r from-green-50 to-green-100',
      border: 'border-green-200',
      accent: 'border-green-400',
    }
  if (score > 50)
    return {
      gradient: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
      border: 'border-yellow-200',
      accent: 'border-yellow-400',
    }

  return {
    gradient: 'bg-gradient-to-r from-red-50 to-red-100',
    border: 'border-red-200',
    accent: 'border-red-400',
  }
}

const getTipStyles = (tipType?: 'good' | 'improve') => {
  if (tipType === 'good') {
    return {
      background: 'bg-green-50/80',
      border: 'border-l-4 border-green-400',
      icon: 'text-green-600'
    }
  }
  // For 'improve' or undefined tips, use yellow/orange for improvement needed
  return {
    background: 'bg-yellow-50/80',
    border: 'border-l-4 border-yellow-400', 
    icon: 'text-yellow-600'
  }
}

const CategoryContent: React.FC<{ tips: Tip[]; score?: number }> = ({ tips, score = 0 }) => {
  const tipsOnly = tips || []
  const explanations = tipsOnly.filter((t) => t.explanation)
  const status = getCategoryGradient(score)

  return (
    <div className={`mt-3 rounded-md p-3 border ${status.border} ${status.gradient}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tipsOnly.map((t, i) => {
          const tipStyle = getTipStyles(t.type)
          return (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-md shadow-sm ${tipStyle.background} ${tipStyle.border}`}>
              <div className="mt-1">
                {t.type === 'good' ? (
                  <svg className={`w-5 h-5 ${tipStyle.icon}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L7 12.172 4.707 9.879a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l9-9z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className={`w-5 h-5 ${tipStyle.icon}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.681-1.36 3.446 0l6.518 11.59c.75 1.334-.213 2.98-1.723 2.98H3.462c-1.51 0-2.474-1.646-1.724-2.98L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-base font-medium text-gray-900">{t.tip}</p>
              </div>
            </div>
          )
        })}
      </div>

      {explanations.length > 0 && (
        <div className="mt-4 space-y-2">
          {explanations.map((e, idx) => {
            const tipStyle = getTipStyles(e.type)
            return (
              <div key={idx} className={`p-3 rounded-md shadow-sm ${tipStyle.background} ${tipStyle.border}`}>
                <p className="text-sm font-semibold text-gray-800">{e.tip}</p>
                <p className="text-sm text-gray-700 mt-1">{e.explanation}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const Details: React.FC<DetailsProps> = ({ feedback }) => {
  const [open, setOpen] = useState<{ [k: string]: boolean }>({
    tone: true,
    content: false,
    structure: false,
    skills: false,
  })

  const sections: { key: string; title: string; data: Category }[] = [
    { key: 'tone', title: 'Tone & Style', data: feedback.toneAndStyle as Category },
    { key: 'content', title: 'Content', data: feedback.content as Category },
    { key: 'structure', title: 'Structure', data: feedback.structure as Category },
    { key: 'skills', title: 'Skills', data: feedback.skills as Category },
  ]

  const toggle = (key: string) => setOpen((s) => ({ ...s, [key]: !s[key] }))

  return (
    <div className="w-full space-y-4">
      {sections.map((sec) => (
        <section key={sec.key} className="w-full bg-white rounded-lg shadow-sm p-4">
            {/* header button has the gradient/background so it spans full width */}
            <button
              onClick={() => toggle(sec.key)}
              aria-expanded={!!open[sec.key]}
              className={`w-full flex items-center justify-between gap-4 text-left rounded-md p-0 hover:bg-gray-50`}
            >
              <CategoryHeader title={sec.title} categoryScore={sec.data?.score ?? 0} />
              <svg
                className={`ml-4 w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  open[sec.key] ? 'rotate-180' : 'rotate-0'
                }`}
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
              >
                <path d="M5 8.5L10 13.5L15 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

          <div
            className={`mt-3 overflow-hidden transition-[max-height]_duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
              open[sec.key] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
            aria-hidden={!open[sec.key]}
          >
            <div className="pt-3">
              <CategoryContent tips={sec.data?.tips ?? []} score={sec.data?.score ?? 0} />
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

export default Details
