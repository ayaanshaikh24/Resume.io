import React from 'react';
import type { ResumeData } from './PortfolioBuilder';

interface PreviewPanelProps {
  data: ResumeData;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ data }) => {
  return (
    <div
      id="resume-preview-container"
      className="w-full max-w-[800px] mx-auto bg-canvas p-8 md:p-12 rounded-lg border border-hairline shadow-[0_1px_3px_rgba(20,20,19,0.05)] text-ink"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Header Section */}
      <header className="border-b border-hairline pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-ink tracking-tight mb-2">
              {data.name || 'Your Name'}
            </h1>
            <p className="text-sm font-sans font-medium uppercase tracking-[0.15em] text-primary">
              {data.title || 'Your Professional Title'}
            </p>
          </div>
          
          {/* Contact Details in Header */}
          <div className="flex flex-col gap-1 text-sm font-sans text-muted md:text-right mt-4 md:mt-0">
            {data.contact.email && (
              <a href={`mailto:${data.contact.email}`} className="hover:text-primary transition-colors">
                {data.contact.email}
              </a>
            )}
            {data.contact.linkedin && (
              <a 
                href={data.contact.linkedin.startsWith('http') ? data.contact.linkedin : `https://${data.contact.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors"
              >
                {data.contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            )}
            {data.contact.github && (
              <a 
                href={data.contact.github.startsWith('http') ? data.contact.github : `https://${data.contact.github}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors"
              >
                {data.contact.github.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column (Skills & Meta) */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Skills Section */}
          <div>
            <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-muted mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills && data.skills.length > 0 ? (
                data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block bg-surface-card text-ink font-sans text-xs px-3 py-1.5 rounded-pill border border-hairline-soft font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-soft italic">No skills listed</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Bio, Experience, Projects) */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {/* Bio / About */}
          {data.bio && (
            <div>
              <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-muted mb-3">
                Profile
              </h2>
              <p className="text-body-strong leading-relaxed text-base font-sans">
                {data.bio}
              </p>
            </div>
          )}

          {/* Work Experience */}
          <div>
            <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-muted mb-4">
              Work Experience
            </h2>
            <div className="flex flex-col gap-6">
              {data.experience && data.experience.length > 0 ? (
                data.experience.map((exp, index) => (
                  <div key={index} className="border-l border-hairline pl-4 relative">
                    {/* Circle Node */}
                    <div className="absolute w-2.5 h-2.5 bg-primary rounded-full -left-[6px] top-1.5 border border-canvas"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                      <h3 className="font-serif text-xl text-ink leading-tight">
                        {exp.company || 'Company Name'}
                      </h3>
                      <span className="text-xs font-sans text-muted-soft font-medium sm:text-right">
                        {exp.duration || 'Duration'}
                      </span>
                    </div>
                    <p className="text-sm font-sans font-medium text-primary uppercase tracking-wider mb-2">
                      {exp.role || 'Role'}
                    </p>
                    <p className="text-sm font-sans text-body leading-relaxed whitespace-pre-line">
                      {exp.description || 'Description'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-soft italic">No work experience listed</p>
              )}
            </div>
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-muted mb-4">
              Key Projects
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {data.projects && data.projects.length > 0 ? (
                data.projects.map((proj, index) => (
                  <div 
                    key={index} 
                    className="bg-surface-card p-5 rounded-lg border border-hairline hover:shadow-[0_1px_4px_rgba(20,20,19,0.04)] transition-shadow"
                  >
                    <h3 className="font-serif text-lg text-ink mb-1">
                      {proj.title || 'Project Title'}
                    </h3>
                    <p className="text-sm font-sans text-body mb-3 leading-relaxed">
                      {proj.description || 'Project description goes here.'}
                    </p>
                    {proj.link && (
                      <a 
                        href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:text-primary-active font-sans text-xs font-medium underline inline-flex items-center gap-1 transition-colors"
                      >
                        {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-soft italic">No projects listed</p>
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* Small design spike watermark to match brand details */}
      <footer className="mt-12 pt-6 border-t border-hairline-soft flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-soft">
          {/* Radial Spike Icon SVG */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
          </svg>
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.15em]">
            resumeio
          </span>
        </div>
        <span className="font-sans text-[11px] text-muted-soft italic">
          Generated client-side
        </span>
      </footer>
    </div>
  );
};
