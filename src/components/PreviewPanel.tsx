import React from 'react';
import type { ResumeData } from './PortfolioBuilder';

interface PreviewPanelProps {
  data: ResumeData;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ data }) => {
  return (
    <div
      id="resume-preview-container"
      className="w-full max-w-[800px] mx-auto bg-white p-8 md:p-12 rounded-lg border border-hairline shadow-[0_2px_12px_rgba(31,31,31,0.03)] text-ink transition-all duration-300"
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
        <div className="flex flex-col gap-1 text-xs font-sans text-muted md:text-right">
          {data.contact.email && (
            <a href={`mailto:${data.contact.email}`} className="hover:text-primary transition-colors flex items-center md:justify-end gap-1.5">
              <svg className="w-3.5 h-3.5 text-muted-soft" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {data.contact.email}
            </a>
          )}
          {data.contact.linkedin && (
            <a 
              href={data.contact.linkedin.startsWith('http') ? data.contact.linkedin : `https://${data.contact.linkedin}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors flex items-center md:justify-end gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-muted-soft" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              {data.contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          )}
          {data.contact.github && (
            <a 
              href={data.contact.github.startsWith('http') ? data.contact.github : `https://${data.contact.github}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors flex items-center md:justify-end gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-muted-soft" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
              {data.contact.github.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          )}
        </div>
      </header>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left narrower column (4 cols out of 12) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Profile Summary (Mobile only, or as a sidebar piece) */}
          {data.bio && (
            <div>
              <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-primary mb-3">
                Profile
              </h2>
              <p className="text-xs font-sans text-muted leading-relaxed">
                {data.bio}
              </p>
            </div>
          )}

          {/* Skills tags */}
          <div>
            <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-primary mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills && data.skills.length > 0 ? (
                data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-canvas text-ink font-sans text-[11px] px-2.5 py-1 rounded-sm border border-hairline font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-soft italic">No skills listed</span>
              )}
            </div>
          </div>
        </div>

        {/* Right wider column (8 cols out of 12) */}
        <div className="md:col-span-8 flex flex-col gap-8">
          
          {/* Work Experience */}
          <div>
            <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-primary mb-4 border-b border-hairline pb-1.5">
              Work Experience
            </h2>
            <div className="flex flex-col gap-6">
              {data.experience && data.experience.length > 0 ? (
                data.experience.map((exp, idx) => (
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
                    <p className="text-xs font-sans text-body leading-relaxed whitespace-pre-line mt-1">
                      {exp.description || 'Description'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-soft italic">No work experience listed</p>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div>
            <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-primary mb-4 border-b border-hairline pb-1.5">
              Education
            </h2>
            <div className="flex flex-col gap-6">
              {data.education && data.education.length > 0 ? (
                data.education.map((edu, idx) => (
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
                      <p className="text-xs font-sans text-body leading-relaxed whitespace-pre-line mt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-soft italic">No education details listed</p>
              )}
            </div>
          </div>

          {/* Key Projects */}
          <div>
            <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-primary mb-4 border-b border-hairline pb-1.5">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {data.projects && data.projects.length > 0 ? (
                data.projects.map((proj, idx) => (
                  <div 
                    key={idx} 
                    className="border-b border-hairline-soft pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h3 className="font-serif text-base text-ink font-normal">
                        {proj.title || 'Project Title'}
                      </h3>
                      {proj.link && (
                        <a 
                          href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:text-primary-active font-sans text-[10px] uppercase font-semibold tracking-wider transition-colors inline-flex items-center gap-0.5"
                        >
                          Link
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <p className="text-xs font-sans text-body leading-relaxed">
                      {proj.description || 'Project description.'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-soft italic">No projects listed</p>
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* Printable Watermark Footer */}
      <footer className="mt-12 pt-6 border-t border-hairline-soft flex items-center justify-between no-print">
        <div className="flex items-center gap-1.5 text-muted-soft">
          {/* Radial Spike Mark */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
          </svg>
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em]">
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
