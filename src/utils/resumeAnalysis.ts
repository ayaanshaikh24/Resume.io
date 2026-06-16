import type { ResumeData } from '../components/PortfolioBuilder';

export interface ATCheck {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail';
  score: number;
  maxScore: number;
  message: string;
  suggestions: string[];
}

export interface ATSReport {
  totalScore: number;
  maxScore: number;
  checks: ATCheck[];
}

const STRONG_VERBS = new Set([
  'architected', 'led', 'reduced', 'improved', 'increased', 'designed',
  'built', 'developed', 'created', 'implemented', 'delivered', 'launched',
  'optimized', 'transformed', 'engineered', 'spearheaded', 'established',
  'pioneered', 'generated', 'accelerated', 'streamlined', 'revamped',
  'overhauled', 'integrated', 'automated', 'deployed', 'drove',
  'achieved', 'expanded', 'produced', 'managed', 'mentored',
  'negotiated', 'reorganized', 'restructured', 'consolidated', 'defined',
  'introduced', 'directed', 'coordinated', 'executed', 'facilitated',
  'formalized', 'launched', 'migrated', 'orchestrated', 'rebuilt',
]);

const WEAK_PATTERNS = [
  /^worked\s+on/i,
  /^helped\s+(with|to)/i,
  /^was\s+responsible\s+for/i,
  /^was\s+involved\s+in/i,
  /^participated\s+in/i,
  /^assisted\s+(with|in)/i,
  /^(did|made|got)\s/i,
  /^was\s+part\s+of/i,
  /^contributed\s+to/i,
  /^tasked\s+with/i,
  /^responsible\s+for/i,
  /^involved\s+in/i,
  /^duties\s+included/i,
  /^handled\s/i,
  /^supported\s/i,
];

const QUANTIFIED_PATTERN = /\b\d+([%x+×]|[\s]*percent|\s*people|\s*users|\s*customers|\s*clients)?\b|\b[%$£€]\s*\d+|\bover\s+\d+|more\s+than\s+\d+|by\s+\d+/i;

const wordCount = (s: string): number =>
  s.trim() ? s.trim().split(/\s+/).filter(Boolean).length : 0;

export function analyzeResume(data: ResumeData): ATSReport {
  const checks: ATCheck[] = [];
  let totalScore = 0;
  const maxScore = 100;

  // 1. Contact completeness: 15 pts
  {
    let score = 0;
    const suggestions: string[] = [];
    if (data.contact.email) score += 5;
    else suggestions.push('Add an email address so recruiters can reach you.');
    if (data.contact.linkedin) score += 5;
    else suggestions.push('Add your LinkedIn profile URL — most recruiters check this.');
    if (data.contact.github) score += 5;
    else suggestions.push('Add your GitHub profile URL — it builds credibility for technical roles.');

    const missing: string[] = [];
    if (!data.contact.email) missing.push('email');
    if (!data.contact.linkedin) missing.push('LinkedIn');
    if (!data.contact.github) missing.push('GitHub');

    checks.push({
      id: 'contact',
      label: 'Contact Information',
      status: score === 15 ? 'pass' : score === 0 ? 'fail' : 'warn',
      score,
      maxScore: 15,
      message: score === 15 ? 'All contact fields filled in' : `Missing: ${missing.join(', ')}`,
      suggestions,
    });
    totalScore += score;
  }

  // 2. Bio/summary length: 10 pts
  {
    const wc = wordCount(data.bio || '');
    let score = 0;
    const suggestions: string[] = [];

    if (wc === 0) {
      suggestions.push('Write a 2-3 sentence professional summary (20-60 words) highlighting your role, expertise, and career focus.');
    } else if (wc < 20) {
      score = 5;
      suggestions.push(`Expand your summary (currently ${wc} words) to at least 20 words. Include your title, key skills, and what you deliver.`);
    } else if (wc <= 60) {
      score = 10;
    } else {
      score = 5;
      suggestions.push(`Trim your summary (currently ${wc} words) to 60 words or fewer. ATS systems may truncate or ignore overly long summaries.`);
    }

    checks.push({
      id: 'bio-length',
      label: 'Profile Summary Length',
      status: score === 10 ? 'pass' : score === 0 ? 'fail' : 'warn',
      score,
      maxScore: 10,
      message: wc === 0 ? 'No profile summary written' : `${wc} words — ${score === 10 ? 'ideal length' : wc < 20 ? 'too short' : 'too long'}`,
      suggestions,
    });
    totalScore += score;
  }

  // 3. Quantified achievements: 20 pts
  {
    const totalRoles = data.experience.length;
    let rolesWithNumbers = 0;
    const suggestions: string[] = [];

    for (const exp of data.experience) {
      const desc = exp.description || '';
      if (QUANTIFIED_PATTERN.test(desc)) {
        rolesWithNumbers++;
      } else if (desc.trim()) {
        const company = exp.company || 'this role';
        suggestions.push(`Add a number to "${company}": e.g. "Improved performance by 40%" or "Managed a team of 12".`);
      }
    }

    const allEmpty = totalRoles > 0 && data.experience.every(e => !(e.description || '').trim());
    let score = 0;
    let msg: string;

    if (totalRoles === 0) {
      msg = 'No work experience to evaluate';
      suggestions.push('Add at least one work experience entry with quantified achievements.');
    } else if (allEmpty) {
      msg = 'Experience descriptions are empty';
      suggestions.unshift('Fill in experience descriptions with specific, measurable accomplishments.');
    } else if (rolesWithNumbers === totalRoles) {
      score = 20;
      msg = `All ${totalRoles} role${totalRoles > 1 ? 's' : ''} include quantified results`;
    } else if (rolesWithNumbers > 0) {
      score = 10;
      msg = `${rolesWithNumbers}/${totalRoles} role${totalRoles > 1 ? 's' : ''} include quantified results`;
    } else {
      msg = 'No quantified achievements found in any role';
      suggestions.push('Recruiters expect numbers. Try: "Reduced load time by 30%", "Served 50K+ users", or "Cut costs by $200K/year".');
    }

    checks.push({
      id: 'quantified',
      label: 'Quantified Achievements',
      status: score === 20 ? 'pass' : score === 0 ? 'fail' : 'warn',
      score,
      maxScore: 20,
      message: msg,
      suggestions: suggestions.slice(0, 3),
    });
    totalScore += score;
  }

  // 4. Action verb strength: 15 pts
  {
    const suggestions: string[] = [];
    let weakCount = 0;
    let totalBullets = 0;

    for (const exp of data.experience) {
      const desc = exp.description || '';
      if (!desc.trim()) continue;
      const sentences = desc.split(/[.!?\n]+/).filter(s => s.trim().length > 3);
      for (const sentence of sentences) {
        totalBullets++;
        const trimmed = sentence.trim();
        if (WEAK_PATTERNS.some(p => p.test(trimmed))) weakCount++;
        else if (!STRONG_VERBS.has(trimmed.toLowerCase().split(/\s+/)[0])) {
          weakCount++;
        }
      }
    }

    let score = 0;
    let msg: string;

    if (totalBullets === 0) {
      msg = 'No bullet points to analyze';
      suggestions.push('Write experience descriptions using strong action verbs like "Architected", "Led", or "Optimized".');
    } else if (weakCount === 0) {
      score = 15;
      msg = `All ${totalBullets} bullet${totalBullets > 1 ? 's' : ''} use strong action verbs`;
    } else if (weakCount <= totalBullets / 2) {
      score = 8;
      msg = `${weakCount}/${totalBullets} bullet${totalBullets > 1 ? 's' : ''} need stronger verbs`;
      suggestions.push('Replace weak openings like "Worked on" with strong verbs: "Architected", "Delivered", "Engineered".');
    } else {
      score = 0;
      msg = `Most bullet points (${weakCount}/${totalBullets}) use passive or weak verbs`;
      suggestions.push('Lead every bullet with a strong action verb. Instead of "Worked on X", try "Architected X" or "Launched X".');
    }

    checks.push({
      id: 'action-verbs',
      label: 'Action Verb Strength',
      status: score === 15 ? 'pass' : score === 0 ? 'fail' : 'warn',
      score,
      maxScore: 15,
      message: msg,
      suggestions,
    });
    totalScore += score;
  }

  // 5. Skills count: 10 pts
  {
    const count = data.skills.length;
    let score = 0;
    const suggestions: string[] = [];

    if (count >= 5 && count <= 15) {
      score = 10;
    } else if (count < 5) {
      suggestions.push(count === 0
        ? 'Add relevant skills. Recruiters heavily filter by skill keywords.'
        : `Add more skills (currently ${count}). Aim for at least 5 relevant technologies or tools.`);
    } else {
      suggestions.push(`Trim to the 15 most relevant skills (currently ${count}). Group related skills or remove outdated ones.`);
    }

    checks.push({
      id: 'skills-count',
      label: 'Skills Section',
      status: score === 10 ? 'pass' : 'warn',
      score,
      maxScore: 10,
      message: `${count} skill${count !== 1 ? 's' : ''} listed — ${score === 10 ? 'ideal range (5-15)' : count < 5 ? 'too few (aim for 5-15)' : 'too many (max 15 recommended)'}`,
      suggestions,
    });
    totalScore += score;
  }

  // 6. Section completeness: 15 pts
  {
    let score = 0;
    const suggestions: string[] = [];

    if (data.experience.length > 0) score += 7.5;
    else suggestions.push('Add work experience — the most important section for job applications.');

    if (data.education.length > 0) score += 7.5;
    else suggestions.push('Add your education details, even if you are early in your career.');

    const msg = score === 15
      ? 'Both Experience and Education sections are present'
      : score === 0
        ? 'Both Experience and Education are empty'
        : 'One required section is missing';

    checks.push({
      id: 'sections',
      label: 'Section Completeness',
      status: score === 15 ? 'pass' : score === 0 ? 'fail' : 'warn',
      score,
      maxScore: 15,
      message: msg,
      suggestions,
    });
    totalScore += score;
  }

  // 7. Content length / density: 15 pts
  {
    const allText = [
      data.bio || '',
      ...data.experience.map(e => e.description || ''),
      ...data.education.map(e => e.description || ''),
      ...data.projects.map(p => p.description || ''),
    ].join(' ');
    const wc = wordCount(allText);
    let score = 0;
    const suggestions: string[] = [];

    if (wc < 150) {
      suggestions.push('Your resume content is very sparse. Expand each section with detailed accomplishments and descriptions.');
    } else if (wc < 250) {
      score = 8;
      suggestions.push('Add more detail — each experience entry should have 3-5 bullet points with specific accomplishments.');
    } else if (wc <= 650) {
      score = 15;
    } else {
      score = 8;
      suggestions.push('Consider trimming to fit one page. Focus on the most recent or relevant roles and tighten descriptions.');
    }

    checks.push({
      id: 'density',
      label: 'Content Length & Density',
      status: score === 15 ? 'pass' : 'warn',
      score,
      maxScore: 15,
      message: `~${wc} words — ${score === 15 ? 'good density for a single page' : score === 0 ? 'very sparse, likely under 1 page' : wc < 250 ? 'consider adding more detail' : 'may exceed 1 page'}`,
      suggestions,
    });
    totalScore += score;
  }

  return { totalScore: Math.round(totalScore), maxScore, checks };
}
