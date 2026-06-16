import React, { useState } from 'react';
import type { ATSReport } from '../utils/resumeAnalysis';

interface ATSReportPanelProps {
  report: ATSReport;
}

const scoreRingColor = (score: number, max: number): string => {
  const pct = score / max;
  if (pct >= 0.8) return 'stroke-success';
  if (pct >= 0.5) return 'stroke-accent-amber';
  return 'stroke-error';
};

const scoreTextColor = (score: number, max: number): string => {
  const pct = score / max;
  if (pct >= 0.8) return 'text-success';
  if (pct >= 0.5) return 'text-accent-amber';
  return 'text-error';
};

const ringBgColor = (score: number, max: number): string => {
  const pct = score / max;
  if (pct >= 0.8) return 'text-success/15';
  if (pct >= 0.5) return 'text-accent-amber/15';
  return 'text-error/15';
};

export const ATSReportPanel: React.FC<ATSReportPanelProps> = ({ report }) => {
  const [isOpen, setIsOpen] = useState(true);

  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (report.totalScore / report.maxScore) * circumference;

  return (
    <div className="glass-panel rounded-[12px] overflow-hidden no-print">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-hairline-soft transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" strokeWidth="3" className={ringBgColor(report.totalScore, report.maxScore)} />
              <circle
                cx="20" cy="20" r="18" fill="none" strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className={scoreRingColor(report.totalScore, report.maxScore)}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold font-sans ${scoreTextColor(report.totalScore, report.maxScore)}`}>
              {report.totalScore}
            </span>
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold font-sans text-ink">ATS Resume Score</span>
            <p className="text-[10px] text-muted font-sans mt-0.5">
              {report.totalScore >= 80 ? 'Strong — minor tweaks needed' :
               report.totalScore >= 50 ? 'Fair — improvements recommended' :
               'Needs significant improvement'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-sans font-medium text-muted-soft uppercase tracking-wider">
            {report.checks.filter(c => c.status === 'pass').length}/{report.checks.length} checks
          </span>
          <svg
            className={`w-4 h-4 text-muted-soft transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 flex flex-col gap-1 border-t border-hairline pt-3">
          {report.checks.map(check => (
            <div key={check.id} className="flex items-start gap-2.5 py-1.5">
              {check.status === 'pass' ? (
                <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : check.status === 'warn' ? (
                <svg className="w-4 h-4 text-accent-amber mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-error mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold font-sans text-ink">{check.label}</span>
                  <span className={`text-[10px] font-sans font-medium shrink-0 ${
                    check.status === 'pass' ? 'text-success' :
                    check.status === 'warn' ? 'text-accent-amber' : 'text-error'
                  }`}>
                    {check.score}/{check.maxScore}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-muted mt-0.5">{check.message}</p>
                {check.suggestions.length > 0 && (
                  <ul className="mt-1 flex flex-col gap-0.5">
                    {check.suggestions.map((s, i) => (
                      <li key={i} className="text-[10px] font-sans text-muted-soft flex items-start gap-1">
                        <span className="text-muted-soft mt-px shrink-0">→</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
