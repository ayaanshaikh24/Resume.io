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

export interface Education {
  school: string;
  degree: string;
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
  education: Education[];
  contact: Contact;
}

const DEFAULT_RESUME_DATA: ResumeData = {
  name: 'Ayaan Al-Ghazali',
  title: 'Advanced Agentic Developer & Product Designer',
  bio: 'Passionate engineer focusing on AI reasoning, web design, and human-computer interfaces. I build beautiful interfaces that feel literary and editorial, bridging the gap between complexity and humanist technology.',
  skills: ['React', 'TypeScript', 'Astro', 'Tailwind CSS v4', 'Next.js', 'AI Orchestration', 'UI Design', 'PostgreSQL'],
  projects: [
    {
      title: 'resumeio | Modern Resume Builder',
      description: 'A client-side layout builder with real-time preview, print-perfect CSS overrides, and localStorage autosave.',
      link: 'https://github.com/ayaan/resumeio',
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
  education: [
    {
      school: 'Stanford University',
      degree: 'B.S. in Computer Science',
      duration: '2019 - 2023',
      description: 'Specialized in Human-Computer Interaction. Graduated with Honors.',
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
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          // Merge defaults in case user has older state format without education
          const parsed = JSON.parse(saved);
          setData({
            ...DEFAULT_RESUME_DATA,
            ...parsed,
            contact: { ...DEFAULT_RESUME_DATA.contact, ...parsed.contact },
            experience: parsed.experience || [],
            projects: parsed.projects || [],
            education: parsed.education || [],
          });
        } catch (e) {
          console.error('Error loading resume data from localStorage', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Debounced save to localStorage on change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      setIsSaving(true);
      const timer = setTimeout(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        setIsSaving(false);
      }, 600); // 600ms debounce
      return () => clearTimeout(timer);
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

  // Repeatable education actions
  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', duration: '', description: '' }],
    }));
  };

  const updateEducation = (index: number, key: keyof Education, value: string) => {
    setData((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index: number) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index),
    }));
  };

  // Reset template
  const resetToDefault = () => {
    if (confirm('Are you sure you want to reset all fields back to the default template? This will overwrite your current draft.')) {
      setData(DEFAULT_RESUME_DATA);
    }
  };

  // Copy Markdown Summary
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

## Education
${data.education.map((edu) => `
### ${edu.school || 'School'} | ${edu.degree || 'Degree'} (${edu.duration || 'Duration'})
${edu.description || 'Description not specified'}
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

  // Download Resume as Image using html2canvas
  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const html2canvas = await new Promise<any>((resolve, reject) => {
        if ((window as any).html2canvas) {
          resolve((window as any).html2canvas);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas-pro@2.0.4/dist/html2canvas-pro.min.js';
        script.onload = () => resolve((window as any).html2canvas);
        script.onerror = () => reject(new Error('Failed to load html2canvas-pro from CDN'));
        document.body.appendChild(script);
      });

      const element = document.getElementById('resume-preview-container');
      if (!element) {
        throw new Error('Preview container not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${(data.name || 'portfolio').toLowerCase().replace(/\s+/g, '_')}_resume.png`;
      link.href = imgData;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
      alert('Error generating image.');
      } finally {
        setDownloading(false);
      }
    };

    // Download Resume as PDF using jsPDF + html2canvas
    const handleDownloadPDF = async () => {
      setDownloadingPdf(true);
      try {
        // Load html2canvas (already cached if PNG was used, otherwise loaded here)
        const html2canvas = await new Promise<any>((resolve, reject) => {
          if ((window as any).html2canvas) {
            resolve((window as any).html2canvas);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/html2canvas-pro@2.0.4/dist/html2canvas-pro.min.js';
          script.onload = () => resolve((window as any).html2canvas);
          script.onerror = () => reject(new Error('Failed to load html2canvas-pro from CDN'));
          document.body.appendChild(script);
        });

        // Load jsPDF UMD module
        const jspdfModule = await new Promise<any>((resolve, reject) => {
          if ((window as any).jspdf) {
            resolve((window as any).jspdf);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = () => resolve((window as any).jspdf);
          script.onerror = () => reject(new Error('Failed to load jsPDF from CDN'));
          document.body.appendChild(script);
        });

        const element = document.getElementById('resume-preview-container');
        if (!element) {
          throw new Error('Preview container not found');
        }

        // Render target preview component into high-DPI canvas
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#FFFFFF',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        
        // Grab jsPDF from UMD namespace
        const jsPDFClass = jspdfModule.jsPDF;
        const pdf = new jsPDFClass('p', 'mm', 'a4');
        
        const imgWidth = 210; // A4 page width in mm
        const pageHeight = 295; // A4 page height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Draw initial page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Perform pagination if the resume exceeds single page length
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${(data.name || 'portfolio').toLowerCase().replace(/\s+/g, '_')}_resume.pdf`);
      } catch (err) {
        console.error('PDF Download error:', err);
        alert('Error generating PDF.');
      } finally {
        setDownloadingPdf(false);
      }
    };
  
    // Trigger Print View (Export PDF)
    const handlePrintPDF = () => {
      window.print();
    };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="text-muted font-sans text-xs animate-pulse flex items-center gap-2">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="load-logo-bookmark-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFA47A" />
                <stop offset="100%" stop-color="#D97757" />
              </linearGradient>
            </defs>
            <rect x="3" y="5" width="15" height="16" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="6.5" y1="10" x2="11.5" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="6.5" y1="13.5" x2="14.5" y2="13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="6.5" y1="17" x2="10.5" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 3h6v9.5l-3-2.5-3 2.5V3z" fill="url(#load-logo-bookmark-grad)" />
          </svg>
          Loading workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-[1440px] mx-auto p-4 md:p-8">
      
      {/* LEFT COLUMN: The Glassmorphic Editor Panel (7 cols) */}
      <section className="lg:col-span-6 xl:col-span-5 flex flex-col gap-8">
        <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-8">
          
          <div className="flex justify-between items-center border-b border-hairline pb-4">
            <div>
              <h2 className="font-serif text-2xl text-ink tracking-tight font-normal">
                Edit Resume
              </h2>
              <p className="text-[10px] font-sans text-muted mt-1 uppercase tracking-wider">
                Create a startup-grade resume
              </p>
            </div>
            <button
              onClick={resetToDefault}
              className="text-xs font-sans font-medium text-muted hover:text-primary hover:bg-white border border-hairline rounded-md px-3 py-1.5 transition-all duration-300 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              id="reset-template-btn"
            >
              Reset Draft
            </button>
          </div>

          {/* Profile Details Section */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-hairline-soft pb-2">
              {/* User Icon SVG */}
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-ink">
                Profile Details
              </h3>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="form-name" className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted mb-1.5">
                Full Name
              </label>
              <input
                id="form-name"
                type="text"
                value={data.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ayaan Al-Ghazali"
                className="glass-input text-ink rounded-md h-10 px-3.5 py-2.5 text-xs border border-hairline focus:outline-none w-full"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="form-title" className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted mb-1.5">
                Professional Title
              </label>
              <input
                id="form-title"
                type="text"
                value={data.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Advanced Developer & Designer"
                className="glass-input text-ink rounded-md h-10 px-3.5 py-2.5 text-xs border border-hairline focus:outline-none w-full"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="form-bio" className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted mb-1.5">
                Profile Bio
              </label>
              <textarea
                id="form-bio"
                value={data.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Brief professional profile bio..."
                rows={4}
                className="glass-input text-ink rounded-md px-3.5 py-2.5 text-xs border border-hairline focus:outline-none w-full resize-y min-h-[90px]"
              />
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-hairline-soft pb-2">
              {/* Envelope SVG */}
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-ink">
                Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="form-email" className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted mb-1.5">
                  Email Address
                </label>
                <input
                  id="form-email"
                  type="email"
                  value={data.contact.email}
                  onChange={(e) => updateContactField('email', e.target.value)}
                  placeholder="hello@ayaan.dev"
                  className="glass-input text-ink rounded-md h-10 px-3.5 py-2.5 text-xs border border-hairline focus:outline-none w-full"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="form-linkedin" className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted mb-1.5">
                  LinkedIn Profile
                </label>
                <input
                  id="form-linkedin"
                  type="text"
                  value={data.contact.linkedin}
                  onChange={(e) => updateContactField('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="glass-input text-ink rounded-md h-10 px-3.5 py-2.5 text-xs border border-hairline focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="form-github" className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted mb-1.5">
                GitHub Username / Profile URL
              </label>
              <input
                id="form-github"
                type="text"
                value={data.contact.github}
                onChange={(e) => updateContactField('github', e.target.value)}
                placeholder="github.com/username"
                className="glass-input text-ink rounded-md h-10 px-3.5 py-2.5 text-xs border border-hairline focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-hairline-soft pb-2">
              <div className="flex items-center gap-2">
                {/* Code Icon SVG */}
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
                <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-ink">
                  Skills & Tech
                </h3>
              </div>
              <span className="text-[9px] font-sans text-muted-soft uppercase tracking-wider">
                Enter / comma to add
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
                placeholder="Add skill tag (e.g. Next.js, Postgres)..."
                className="glass-input text-ink rounded-md h-10 px-3.5 py-2.5 text-xs border border-hairline focus:outline-none w-full"
              />
              
              {/* Skill Tags List */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    onClick={() => removeSkill(idx)}
                    className="inline-flex items-center gap-1 bg-white/70 hover:bg-red-50 text-ink hover:text-error font-sans text-[11px] px-2.5 py-1 rounded-sm border border-hairline-soft font-medium cursor-pointer transition-colors group shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    title="Click to remove"
                  >
                    {skill}
                    <span className="text-[9px] text-muted-soft group-hover:text-error ml-0.5">×</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-hairline-soft pb-2">
              <div className="flex items-center gap-2">
                {/* Briefcase SVG */}
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .552-.448 1-1 1H4.75c-.552 0-1-.448-1-1v-4.25m16.5 0a1.5 1.5 0 00-1.5-1.5H4.75A1.5 1.5 0 003.25 14.15m17 0V9.43a1.5 1.5 0 00-1-1.42l-4.5-1.5a1.5 1.5 0 00-1 0l-4.5 1.5a1.5 1.5 0 00-1 1.42v4.72m10.5-4.72V6.75a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25v2.96" />
                </svg>
                <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-ink">
                  Work Experience
                </h3>
              </div>
              <button
                type="button"
                onClick={addExperience}
                className="text-[10px] font-sans font-semibold text-primary hover:text-primary-active uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                id="add-experience-btn"
              >
                + Add Role
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="bg-white/30 hover:bg-white/50 border border-hairline-soft rounded-lg p-5 flex flex-col gap-3 relative group transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover-card-elevation">
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="absolute top-4 right-4 text-muted-soft hover:text-error transition-colors p-1 cursor-pointer"
                    title="Remove experience"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-sans font-semibold uppercase tracking-wider text-muted">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                        placeholder="e.g. Stripe"
                        className="glass-input text-ink rounded px-2.5 py-1.5 text-xs border border-hairline focus:outline-none w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-sans font-semibold uppercase tracking-wider text-muted">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateExperience(idx, 'duration', e.target.value)}
                        placeholder="e.g. 2024 - Present"
                        className="glass-input text-ink rounded px-2.5 py-1.5 text-xs border border-hairline focus:outline-none w-full h-9"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-sans font-semibold uppercase tracking-wider text-muted">
                      Role / Position Title
                    </label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                      placeholder="e.g. Staff Engineer"
                      className="glass-input text-ink rounded px-2.5 py-1.5 text-xs border border-hairline focus:outline-none w-full h-9"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-sans font-semibold uppercase tracking-wider text-muted">
                      Role Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                      placeholder="List technical stack details and core accomplishments..."
                      rows={3}
                      className="glass-input text-ink rounded px-2.5 py-1.5 text-xs border border-hairline focus:outline-none w-full resize-y min-h-[60px]"
                    />
                  </div>
                </div>
              ))}
              {data.experience.length === 0 && (
                <p className="text-xs text-muted-soft italic text-center py-4 border border-dashed border-hairline rounded-lg">
                  No experience items added.
                </p>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-hairline-soft pb-2">
              <div className="flex items-center gap-2">
                {/* Academic cap SVG */}
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M12 2.25V4.5m0 12.852V21" />
                </svg>
                <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-ink">
                  Education
                </h3>
              </div>
              <button
                type="button"
                onClick={addEducation}
                className="text-[10px] font-sans font-semibold text-primary hover:text-primary-active uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                id="add-education-btn"
              >
                + Add Degree
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className="bg-white/30 hover:bg-white/50 border border-hairline-soft rounded-lg p-5 flex flex-col gap-3 relative group transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover-card-elevation">
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-4 right-4 text-muted-soft hover:text-error transition-colors p-1 cursor-pointer"
                    title="Remove education"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-sans font-semibold uppercase tracking-wider text-muted">
                        School / University
                      </label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                        placeholder="e.g. Stanford University"
                        className="glass-input text-ink rounded px-2.5 py-1.5 text-xs border border-hairline focus:outline-none w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-sans font-semibold uppercase tracking-wider text-muted">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={edu.duration}
                        onChange={(e) => updateEducation(idx, 'duration', e.target.value)}
                        placeholder="e.g. 2019 - 2023"
                        className="glass-input text-ink rounded px-2.5 py-1.5 text-xs border border-hairline focus:outline-none w-full h-9"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-sans font-semibold uppercase tracking-wider text-muted">
                      Degree / Program
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                      placeholder="e.g. B.S. in Computer Science"
                      className="glass-input text-ink rounded px-2.5 py-1.5 text-xs border border-hairline focus:outline-none w-full h-9"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-sans font-semibold uppercase tracking-wider text-muted">
                      Description / Honors (Optional)
                    </label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => updateEducation(idx, 'description', e.target.value)}
                      placeholder="Activities, achievements, honors, or thesis topics..."
                      rows={2}
                      className="glass-input text-ink rounded px-2.5 py-1.5 text-xs border border-hairline focus:outline-none w-full resize-y min-h-[50px]"
                    />
                  </div>
                </div>
              ))}
              {data.education.length === 0 && (
                <p className="text-xs text-muted-soft italic text-center py-4 border border-dashed border-hairline rounded-lg">
                  No education items added.
                </p>
              )}
            </div>
          </div>

          {/* Projects Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-hairline-soft pb-2">
              <div className="flex items-center gap-2">
                {/* Folder icon SVG */}
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0017.25 3h-5.25L10.5 5.25H3.75A2.25 2.25 0 001.5 7.5v4.5a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-ink">
                  Featured Projects
                </h3>
              </div>
              <button
                type="button"
                onClick={addProject}
                className="text-[10px] font-sans font-semibold text-primary hover:text-primary-active uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                id="add-project-btn"
              >
                + Add Project
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {data.projects.map((proj, idx) => (
                <div key={idx} className="bg-white/30 hover:bg-white/50 border border-hairline-soft rounded-lg p-5 flex flex-col gap-3 relative group transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover-card-elevation">
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="absolute top-4 right-4 text-muted-soft hover:text-error transition-colors p-1 cursor-pointer"
                    title="Remove project"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-sans font-semibold uppercase tracking-wider text-muted">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(idx, 'title', e.target.value)}
                        placeholder="e.g. resumeio"
                        className="glass-input text-ink rounded px-2.5 py-1.5 text-xs border border-hairline focus:outline-none w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-sans font-semibold uppercase tracking-wider text-muted">
                        Project Link
                      </label>
                      <input
                        type="text"
                        value={proj.link}
                        onChange={(e) => updateProject(idx, 'link', e.target.value)}
                        placeholder="e.g. github.com/username/repo"
                        className="glass-input text-ink rounded px-2.5 py-1.5 text-xs border border-hairline focus:outline-none w-full h-9"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-sans font-semibold uppercase tracking-wider text-muted">
                      Project Description
                    </label>
                    <textarea
                      value={proj.description}
                      onChange={(e) => updateProject(idx, 'description', e.target.value)}
                      placeholder="What is the purpose of this project and what tech stacks did you use?"
                      rows={3}
                      className="glass-input text-ink rounded px-2.5 py-1.5 text-xs border border-hairline focus:outline-none w-full resize-y min-h-[60px]"
                    />
                  </div>
                </div>
              ))}
              {data.projects.length === 0 && (
                <p className="text-xs text-muted-soft italic text-center py-4 border border-dashed border-hairline rounded-lg">
                  No projects added.
                </p>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* RIGHT COLUMN: The Sticky Glassmorphic Actions & Live Preview (5 cols) */}
      <section className="lg:col-span-6 xl:col-span-7 lg:sticky lg:top-8 flex flex-col gap-6">
        
        {/* Premium Action Toolbar (Not visible during printing) */}
        <div className="glass-panel rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-[0_2px_12px_rgba(31,31,31,0.02)] no-print">
          {/* Micro-interaction Autosave Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber bg-accent-amber animate-saving-pulse' : 'bg-success bg-accent-teal'}`}></div>
            <span className="text-[10px] font-sans text-muted font-semibold uppercase tracking-wider">
              {isSaving ? 'Saving draft...' : 'Saved to draft'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Copy Markdown Summary */}
            <button
              onClick={handleCopySummary}
              className="bg-white/60 hover:bg-white text-ink text-xs font-semibold px-3 py-2 h-9 rounded-md border border-hairline transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              title="Copy resume details as Markdown format"
              id="copy-summary-btn"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-muted-soft" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c1.009.308 1.75 1.224 1.75 2.312v12.75c0 1.353-1.097 2.45-2.45 2.45H6.45C5.097 21 4 19.903 4 18.55V6.2c0-1.088.741-2.004 1.75-2.312M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm-1.5 6a3.75 3.75 0 10-9 0" />
                  </svg>
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            {/* Download as Image PNG */}
            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="bg-white/60 hover:bg-white text-ink text-xs font-semibold px-3 py-2 h-9 rounded-md border border-hairline transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              title="Download resume canvas as PNG"
              id="download-image-btn"
            >
              {downloading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Rendering...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-muted-soft" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
                  </svg>
                  <span>Download PNG</span>
                </>
              )}
            </button>

            {/* Download as PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              className="bg-white/60 hover:bg-white text-ink text-xs font-semibold px-3 py-2 h-9 rounded-md border border-hairline transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              title="Download resume as PDF directly"
              id="download-pdf-btn"
            >
              {downloadingPdf ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-muted-soft" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Export PDF (triggers print dialog) */}
            <button
              onClick={handlePrintPDF}
              className="bg-primary hover:bg-primary-active text-white text-xs font-semibold px-4 py-2 h-9 rounded-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(217,119,87,0.15)] hover:shadow-[0_4px_12px_rgba(217,119,87,0.22)]"
              title="Print or export resume as PDF"
              id="export-pdf-btn"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0a2.25 2.25 0 01-2.24 2.24H8.58A2.25 2.25 0 016.34 18m11.318-3.085c.24.03.48.062.72.096m-.72-.096a42.42 42.42 0 01-11.318 0m11.318 0l-.636 1.426a2.25 2.25 0 01-2.062 1.33H8.58a2.25 2.25 0 01-2.062-1.33l-.636-1.426M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Live Resume Canvas */}
        <div className="w-full overflow-x-auto">
          <PreviewPanel data={data} />
        </div>
      </section>

    </div>
  );
};
