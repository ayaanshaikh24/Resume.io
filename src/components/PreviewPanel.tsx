import React from 'react';
import type { ResumeData } from './PortfolioBuilder';

export const extractGithubUsername = (url: string): string => {
  if (!url) return '';
  let clean = url.trim().replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '');
  clean = clean.split('/')[0].split('?')[0];
  return clean;
};

export const extractLinkedInUsername = (url: string): string => {
  if (!url) return '';
  let clean = url.trim().replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//i, '');
  clean = clean.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\//i, '');
  clean = clean.split('/')[0].split('?')[0];
  return clean;
};

export const extractEmailUsername = (email: string): string => {
  if (!email) return '';
  const clean = email.trim().replace(/^mailto:/i, '');
  return clean.split('@')[0];
};

interface PreviewPanelProps {
  data: ResumeData;
}

const PreviewPanelInner: React.FC<PreviewPanelProps> = ({ data }) => {
  return (
    <div
      id="resume-preview-container"
      className="w-full max-w-[800px] mx-auto bg-white p-8 md:p-12 rounded-[12px] border border-hairline shadow-[0_1px_3px_rgba(0,0,0,0.06)] text-ink transition-all duration-300"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Header Section */}
      <header className="border-b border-ink/10 pb-6 mb-8 flex flex-col md:flex-row md:justify-between md:items-baseline gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-ink tracking-tight font-normal mb-2 leading-none">
            {data.name || 'Your Name'}
          </h1>
          <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-primary">
            {data.title || 'Your Professional Title'}
          </p>
        </div>
        
        {/* Contact details */}
        <div className="flex flex-col gap-1.5 text-xs font-sans text-muted md:text-right">
          {data.contact.email && (
            <span className="flex items-center md:justify-end gap-2 select-all">
              <svg className="w-4 h-4 text-muted-soft" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {extractEmailUsername(data.contact.email)}
            </span>
          )}
          {data.contact.linkedin && (
            <span className="flex items-center md:justify-end gap-2 select-all">
              <svg className="w-4 h-4 text-muted-soft" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .552-.448 1-1 1H4.75c-.552 0-1-.448-1-1v-4.25m16.5 0a1.5 1.5 0 00-1.5-1.5H4.75A1.5 1.5 0 003.25 14.15m17 0V9.43a1.5 1.5 0 00-1-1.42l-4.5-1.5a1.5 1.5 0 00-1 0l-4.5 1.5a1.5 1.5 0 00-1 1.42v4.72m10.5-4.72V6.75a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25v2.96" />
              </svg>
              {extractLinkedInUsername(data.contact.linkedin)}
            </span>
          )}
          {data.contact.github && (
            <span className="flex items-center md:justify-end gap-2 select-all">
              <svg className="w-4 h-4 text-muted-soft fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              {extractGithubUsername(data.contact.github)}
            </span>
          )}
        </div>
      </header>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left narrower column (4 cols out of 12) */}
        <div className="md:col-span-4 flex flex-col gap-8">
          {/* Profile Summary (Mobile only, or as a sidebar piece) */}
          {data.bio && (
            <div>
              <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-primary mb-4 border-b border-hairline pb-1.5">
                Profile
              </h2>
              <p className="text-xs font-sans text-muted leading-relaxed">
                {data.bio}
              </p>
            </div>
          )}

          {/* Skills tags */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-primary mb-4 border-b border-hairline pb-1.5">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-hairline-soft text-ink font-sans text-[11px] px-2 py-0.5 rounded-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right wider column (8 cols out of 12) */}
        <div className="md:col-span-8 flex flex-col gap-8">
          
          {/* Work Experience */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-primary mb-4 border-b border-hairline pb-1.5">
                Work Experience
              </h2>
              <div className="flex flex-col gap-6">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                      <h3 className="font-serif text-lg text-ink font-normal leading-tight">
                        {exp.company || 'Company Name'}
                      </h3>
                      <span className="text-[11px] font-sans text-muted-soft font-medium">
                        {exp.duration || 'Duration'}
                      </span>
                    </div>
                    <div className="text-xs font-sans font-semibold text-primary/80 uppercase tracking-wider">
                      {exp.role || 'Role'}
                    </div>
                    <p className="text-xs font-sans text-body leading-relaxed whitespace-pre-line">
                      {exp.description || 'Description'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {data.education && data.education.length > 0 && (
            <div>
              <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-primary mb-4 border-b border-hairline pb-1.5">
                Education
              </h2>
              <div className="flex flex-col gap-6">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                      <h3 className="font-serif text-lg text-ink font-normal leading-tight">
                        {edu.school || 'Institution Name'}
                      </h3>
                      <span className="text-[11px] font-sans text-muted-soft font-medium">
                        {edu.duration || 'Duration'}
                      </span>
                    </div>
                    <div className="text-xs font-sans font-semibold text-primary/80 uppercase tracking-wider">
                      {edu.degree || 'Degree/Program'}
                    </div>
                    {edu.description && (
                      <p className="text-xs font-sans text-body leading-relaxed whitespace-pre-line">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Projects */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-primary mb-4 border-b border-hairline pb-1.5">
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {data.projects.map((proj, idx) => (
                  <div 
                    key={idx} 
                    className="border-b border-hairline-soft pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="mb-1">
                      <h3 className="font-serif text-base text-ink font-normal">
                        {proj.title || 'Project Title'}
                      </h3>
                    </div>
                    <p className="text-xs font-sans text-body leading-relaxed">
                      {proj.description || 'Project description.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Printable Watermark Footer */}
      <footer className="mt-12 pt-6 border-t border-hairline-soft flex items-center justify-between no-print">
        <div className="flex items-center gap-2 text-muted-soft">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="footer-logo-bookmark-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFA47A" />
                <stop offset="100%" stop-color="#D97757" />
              </linearGradient>
            </defs>
            <rect x="3" y="5" width="15" height="16" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="6.5" y1="10" x2="11.5" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="6.5" y1="13.5" x2="14.5" y2="13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="6.5" y1="17" x2="10.5" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 3h6v9.5l-3-2.5-3 2.5V3z" fill="url(#footer-logo-bookmark-grad)" />
          </svg>
          <span className="font-sans text-[11px] font-semibold tracking-[0.1em] text-ink/80">
            resumeio
          </span>
        </div>
        <span className="font-sans text-[10px] text-muted-soft italic">
          Designed with Warm Canvas
        </span>
      </footer>
    </div>
  );
};

export const PreviewPanel = React.memo(PreviewPanelInner);
