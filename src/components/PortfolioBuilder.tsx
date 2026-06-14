import React, { useState, useEffect } from 'react';
import { PreviewPanel } from './PreviewPanel';

export interface Project {
  title: string;
  description: string;
  link: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Contact {
  email: string;
  linkedin: string;
  github: string;
}

export interface ResumeData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  projects: Project[];
  experience: WorkExperience[];
  contact: Contact;
}

const DEFAULT_RESUME_DATA: ResumeData = {
  name: 'Ayaan',
  title: 'Advanced Agentic Developer & Product Designer',
  bio: 'Passionate engineer focusing on AI reasoning, web design, and human-computer interfaces. I build beautiful interfaces that feel literary and editorial, bridging the gap between complexity and humanist technology.',
  skills: ['React', 'TypeScript', 'Astro', 'Tailwind CSS v4', 'Next.js', 'AI Orchestration', 'UI Design'],
  projects: [
    {
      title: 'Claude Code Editor Mockup',
      description: 'A syntax-highlighted code editor mockup showing dynamic typing effects and premium scrollbars.',
      link: 'https://github.com/example/claude-code',
    },
    {
      title: 'Warm Canvas Design System',
      description: 'An open-source design token system bringing the warmth of printed materials to digital interfaces.',
      link: 'https://github.com/example/warm-canvas',
    },
  ],
  experience: [
    {
      company: 'Anthropic',
      role: 'AI Interface Designer',
      duration: '2025 - Present',
      description: 'Leading the design of next-generation developer tools. Established editorial layout guidelines and improved typographic hierarchies across chat environments.',
    },
    {
      company: 'Creative Dev Studio',
      role: 'Senior Frontend Engineer',
      duration: '2023 - 2025',
      description: 'Architected single-page client-side web applications utilizing React and Astro. Integrated advanced canvas utilities and optimized build performance.',
    },
  ],
  contact: {
    email: 'hello@ayaan.dev',
    linkedin: 'linkedin.com/in/ayaan',
    github: 'github.com/ayaan',
  },
};

const LOCAL_STORAGE_KEY = 'resumeio_draft_data';

export const PortfolioBuilder: React.FC = () => {
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
  const [skillInput, setSkillInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading resume data from localStorage', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  // Update root profile fields
  const updateField = (field: keyof ResumeData, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update contact fields
  const updateContactField = (field: keyof Contact, value: string) => {
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  // Add a skill tag
  const addSkill = (skillStr: string) => {
    const trimmed = skillStr.trim();
    if (!trimmed) return;
    
    // Split by comma in case multiple are added
    const newSkills = trimmed
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && !data.skills.includes(s));

    if (newSkills.length > 0) {
      setData((prev) => ({
        ...prev,
        skills: [...prev.skills, ...newSkills],
      }));
    }
    setSkillInput('');
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const removeSkill = (indexToRemove: number) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Repeatable projects actions
  const addProject = () => {
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', link: '' }],
    }));
  };

  const updateProject = (index: number, key: keyof Project, value: string) => {
    setData((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index: number) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== index),
    }));
  };

  // Repeatable experience actions
  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: '', role: '', duration: '', description: '' }],
    }));
  };

  const updateExperience = (index: number, key: keyof WorkExperience, value: string) => {
    setData((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, experience: updated };
    });
  };

  const removeExperience = (index: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== index),
    }));
  };

  // Reset to default template
  const resetToDefault = () => {
    if (confirm('Are you sure you want to reset all fields back to the default template? This will overwrite your current draft.')) {
      setData(DEFAULT_RESUME_DATA);
    }
  };

  // Copy Markdown Summary to Clipboard
  const handleCopySummary = () => {
    const md = `
# ${data.name || 'Name'}
**${data.title || 'Title'}**

## Profile
${data.bio || 'Bio not specified'}

## Contact
- Email: ${data.contact.email || 'N/A'}
- LinkedIn: ${data.contact.linkedin || 'N/A'}
- GitHub: ${data.contact.github || 'N/A'}

## Skills
${data.skills.join(', ') || 'None listed'}

## Work Experience
${data.experience.map((exp) => `
### ${exp.company || 'Company'} | ${exp.role || 'Role'} (${exp.duration || 'Duration'})
${exp.description || 'Description not specified'}
`).join('\n')}

## Projects
${data.projects.map((proj) => `
### ${proj.title || 'Project'}
${proj.description || 'Description not specified'}
Link: ${proj.link || 'N/A'}
`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(md)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  // Download Preview Panel as Image using html2canvas via CDN
  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      // Dynamic promise import for CDN script
      const html2canvas = await new Promise<any>((resolve, reject) => {
        if ((window as any).html2canvas) {
          resolve((window as any).html2canvas);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = () => resolve((window as any).html2canvas);
        script.onerror = () => reject(new Error('Failed to load html2canvas from CDN'));
        document.body.appendChild(script);
      });

      const element = document.getElementById('resume-preview-container');
      if (!element) {
        throw new Error('Preview container not found');
      }

      // Render canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#faf9f5', // canvas background hex
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${(data.name || 'portfolio').toLowerCase().replace(/\s+/g, '_')}_resume.png`;
      link.href = imgData;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
      alert('Error generating image. Please verify you are connected to the internet to fetch html2canvas.');
    } finally {
      setDownloading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="text-muted font-sans text-sm animate-pulse flex items-center gap-2">
          {/* Spike spinner */}
          <svg className="w-5 h-5 animate-spin fill-current text-primary" viewBox="0 0 24 24">
            <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
          </svg>
          Loading workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-[1440px] mx-auto p-4 md:p-8">
      
      {/* LEFT COLUMN: The Interactive Form (7 cols) */}
      <section className="lg:col-span-6 xl:col-span-5 flex flex-col gap-8">
        <div className="bg-canvas border border-hairline rounded-lg p-6 md:p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-hairline pb-4">
            <h2 className="font-serif text-2xl text-ink tracking-tight">
              Edit Portfolio Data
            </h2>
            <button
              onClick={resetToDefault}
              className="text-xs font-sans font-medium text-muted hover:text-primary transition-colors cursor-pointer border border-hairline rounded px-2.5 py-1 hover:bg-surface-soft"
              id="reset-template-btn"
            >
              Reset to Template
            </button>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-muted-soft">
              Profile Details
            </h3>
            
            <div className="flex flex-col gap-1">
              <label htmlFor="form-name" className="text-xs font-sans font-medium text-muted">
                Full Name
              </label>
              <input
                id="form-name"
                type="text"
                value={data.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ayaan"
                className="bg-canvas text-ink font-sans text-sm rounded-md px-3.5 py-2.5 h-10 border border-hairline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/15 transition-all w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="form-title" className="text-xs font-sans font-medium text-muted">
                Professional Title
              </label>
              <input
                id="form-title"
                type="text"
                value={data.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Full Stack Engineer"
                className="bg-canvas text-ink font-sans text-sm rounded-md px-3.5 py-2.5 h-10 border border-hairline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/15 transition-all w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="form-bio" className="text-xs font-sans font-medium text-muted">
                Profile Bio
              </label>
              <textarea
                id="form-bio"
                value={data.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Brief professional profile bio..."
                rows={4}
                className="bg-canvas text-ink font-sans text-sm rounded-md px-3.5 py-2.5 min-h-[100px] border border-hairline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/15 transition-all w-full resize-y"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4 pt-4 border-t border-hairline-soft">
            <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-muted-soft">
              Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="form-email" className="text-xs font-sans font-medium text-muted">
                  Email Address
                </label>
                <input
                  id="form-email"
                  type="email"
                  value={data.contact.email}
                  onChange={(e) => updateContactField('email', e.target.value)}
                  placeholder="hello@ayaan.dev"
                  className="bg-canvas text-ink font-sans text-sm rounded-md px-3.5 py-2.5 h-10 border border-hairline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/15 transition-all w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="form-linkedin" className="text-xs font-sans font-medium text-muted">
                  LinkedIn Profile URL
                </label>
                <input
                  id="form-linkedin"
                  type="text"
                  value={data.contact.linkedin}
                  onChange={(e) => updateContactField('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="bg-canvas text-ink font-sans text-sm rounded-md px-3.5 py-2.5 h-10 border border-hairline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/15 transition-all w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="form-github" className="text-xs font-sans font-medium text-muted">
                GitHub Username / Profile URL
              </label>
              <input
                id="form-github"
                type="text"
                value={data.contact.github}
                onChange={(e) => updateContactField('github', e.target.value)}
                placeholder="github.com/username"
                className="bg-canvas text-ink font-sans text-sm rounded-md px-3.5 py-2.5 h-10 border border-hairline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/15 transition-all w-full"
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="flex flex-col gap-4 pt-4 border-t border-hairline-soft">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-muted-soft">
                Skills & Technologies
              </h3>
              <span className="text-[10px] font-sans text-muted-soft">
                Press Enter or Comma to add
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <input
                id="form-skills-input"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                onBlur={() => addSkill(skillInput)}
                placeholder="Add skill tag (e.g. React, Docker)..."
                className="bg-canvas text-ink font-sans text-sm rounded-md px-3.5 py-2.5 h-10 border border-hairline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/15 transition-all w-full"
              />
              
              {/* Skill Tags List */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    onClick={() => removeSkill(idx)}
                    className="inline-flex items-center gap-1 bg-surface-card hover:bg-red-50 text-ink hover:text-error font-sans text-xs px-2.5 py-1 rounded-pill border border-hairline-soft font-medium cursor-pointer transition-colors group"
                    title="Click to remove"
                  >
                    {skill}
                    <span className="text-[10px] text-muted group-hover:text-error">×</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="flex flex-col gap-4 pt-4 border-t border-hairline-soft">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-muted-soft">
                Work Experience
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="text-xs font-sans font-medium text-primary hover:text-primary-active transition-colors flex items-center gap-1 cursor-pointer"
                id="add-experience-btn"
              >
                + Add Experience
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="bg-surface-soft p-4 rounded-lg border border-hairline-soft flex flex-col gap-3 relative group">
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="absolute top-3 right-3 text-muted-soft hover:text-error transition-colors p-1 cursor-pointer"
                    title="Remove experience"
                  >
                    {/* Trash Can SVG */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                        placeholder="Company"
                        className="bg-canvas text-ink font-sans text-xs rounded-md px-2.5 py-2 h-9 border border-hairline focus:outline-none focus:border-primary w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted">
                        Duration (e.g. 2025 - Present)
                      </label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateExperience(idx, 'duration', e.target.value)}
                        placeholder="Duration"
                        className="bg-canvas text-ink font-sans text-xs rounded-md px-2.5 py-2 h-9 border border-hairline focus:outline-none focus:border-primary w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted">
                      Role Title
                    </label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                      placeholder="Role"
                      className="bg-canvas text-ink font-sans text-xs rounded-md px-2.5 py-2 h-9 border border-hairline focus:outline-none focus:border-primary w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted">
                      Description / Key Accomplishments
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                      placeholder="Duties, achievements, and technical stack details..."
                      rows={3}
                      className="bg-canvas text-ink font-sans text-xs rounded-md px-2.5 py-2 min-h-[70px] border border-hairline focus:outline-none focus:border-primary w-full resize-y"
                    />
                  </div>
                </div>
              ))}
              {data.experience.length === 0 && (
                <p className="text-xs text-muted-soft italic text-center py-4 border border-dashed border-hairline rounded-lg">
                  No experience items added. Click "+ Add Experience" to build your timeline.
                </p>
              )}
            </div>
          </div>

          {/* Projects Section */}
          <div className="flex flex-col gap-4 pt-4 border-t border-hairline-soft">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-muted-soft">
                Key Projects
              </h3>
              <button
                type="button"
                onClick={addProject}
                className="text-xs font-sans font-medium text-primary hover:text-primary-active transition-colors flex items-center gap-1 cursor-pointer"
                id="add-project-btn"
              >
                + Add Project
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {data.projects.map((proj, idx) => (
                <div key={idx} className="bg-surface-soft p-4 rounded-lg border border-hairline-soft flex flex-col gap-3 relative group">
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="absolute top-3 right-3 text-muted-soft hover:text-error transition-colors p-1 cursor-pointer"
                    title="Remove project"
                  >
                    {/* Trash Can SVG */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(idx, 'title', e.target.value)}
                        placeholder="Project Title"
                        className="bg-canvas text-ink font-sans text-xs rounded-md px-2.5 py-2 h-9 border border-hairline focus:outline-none focus:border-primary w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted">
                        Project Link
                      </label>
                      <input
                        type="text"
                        value={proj.link}
                        onChange={(e) => updateProject(idx, 'link', e.target.value)}
                        placeholder="github.com/username/project"
                        className="bg-canvas text-ink font-sans text-xs rounded-md px-2.5 py-2 h-9 border border-hairline focus:outline-none focus:border-primary w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted">
                      Project Description
                    </label>
                    <textarea
                      value={proj.description}
                      onChange={(e) => updateProject(idx, 'description', e.target.value)}
                      placeholder="What does this project do and what technologies did you use?"
                      rows={3}
                      className="bg-canvas text-ink font-sans text-xs rounded-md px-2.5 py-2 min-h-[70px] border border-hairline focus:outline-none focus:border-primary w-full resize-y"
                    />
                  </div>
                </div>
              ))}
              {data.projects.length === 0 && (
                <p className="text-xs text-muted-soft italic text-center py-4 border border-dashed border-hairline rounded-lg">
                  No projects added. Click "+ Add Project" to feature your work.
                </p>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* RIGHT COLUMN: The Toolbar & Live Preview (5 cols) */}
      <section className="lg:col-span-6 xl:col-span-7 lg:sticky lg:top-8 flex flex-col gap-6">
        
        {/* Actions Toolbar */}
        <div className="bg-canvas border border-hairline rounded-lg p-4 flex flex-wrap gap-3 items-center justify-between shadow-[0_1px_3px_rgba(20,20,19,0.02)]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></div>
            <span className="text-xs font-sans text-muted font-medium">
              Autosaved to draft
            </span>
          </div>

          <div className="flex gap-2.5">
            {/* Copy markdown summary button */}
            <button
              onClick={handleCopySummary}
              className="bg-canvas hover:bg-surface-soft text-ink text-sm font-sans font-medium px-4 py-2.5 h-10 rounded-md border border-hairline transition-colors flex items-center gap-2 cursor-pointer shadow-[0_1px_2px_rgba(20,20,19,0.03)]"
              title="Copy portfolio summary in markdown format"
              id="copy-summary-btn"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c1.009.308 1.75 1.224 1.75 2.312v12.75c0 1.353-1.097 2.45-2.45 2.45H6.45C5.097 21 4 19.903 4 18.55V6.2c0-1.088.741-2.004 1.75-2.312M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm-1.5 6a3.75 3.75 0 10-9 0" />
                  </svg>
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            {/* Download as PNG button */}
            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="bg-primary hover:bg-primary-active disabled:bg-primary-disabled text-on-primary text-sm font-sans font-medium px-4 py-2.5 h-10 rounded-md transition-colors flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(204,120,92,0.1)] cursor-pointer"
              title="Download portfolio as high resolution image"
              id="download-image-btn"
            >
              {downloading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Download Image</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Preview Pane */}
        <div className="overflow-x-auto">
          <PreviewPanel data={data} />
        </div>
      </section>

    </div>
  );
};
