// AI-powered resume analysis without external API dependency
export interface AIAnalysisResult {
  extractedData: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experience: string[];
    education: string[];
    certifications: string[];
  };
  suggestions: string[];
  improvements: string[];
  missingFields: string[];
  matchScore: number;
}

export class LocalAIAnalyzer {
  private skillsDatabase = [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    // Web Technologies
    'React', 'Vue', 'Angular', 'Node.js', 'Express', 'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind',
    // Databases
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
    // Cloud & DevOps
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab',
    // Engineering Skills
    'CAD', 'CADD', 'AutoCAD', 'SolidWorks', 'MATLAB', 'Simulink', 'ANSYS', 'CATIA',
    // Soft Skills
    'Leadership', 'Communication', 'Team Management', 'Problem Solving', 'Critical Thinking', 'Time Management'
  ];

  analyzeResume(text: string, jobRequirements?: string): AIAnalysisResult {
    const extractedData = this.extractResumeData(text);
    const suggestions = this.generateSuggestions(extractedData, jobRequirements);
    const improvements = this.generateImprovements(extractedData);
    const missingFields = this.identifyMissingFields(extractedData);
    const matchScore = this.calculateMatchScore(extractedData, jobRequirements);

    return {
      extractedData,
      suggestions,
      improvements,
      missingFields,
      matchScore
    };
  }

  private extractResumeData(text: string) {
    const name = this.extractName(text);
    const email = this.extractEmail(text);
    const phone = this.extractPhone(text);
    const skills = this.extractSkills(text);
    const experience = this.extractExperience(text);
    const education = this.extractEducation(text);
    const certifications = this.extractCertifications(text);

    return {
      name,
      email,
      phone,
      skills,
      experience,
      education,
      certifications
    };
  }

  private extractName(text: string): string {
    const namePatterns = [
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]*)*(?:\s+[A-Z])?)/m,
      /Name:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]*)*)/i,
      /^([A-Z]{2,}(?:\s+[A-Z]{2,})*)/m,
      /^([A-Z]+(?:\s+[A-Z])+)/m
    ];
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      for (const pattern of namePatterns) {
        const match = line.match(pattern);
        if (match && match[1].length >= 3 && match[1].length <= 50) {
          const name = match[1].trim();
          const excludeWords = ['RESUME', 'CV', 'CURRICULUM', 'VITAE', 'EMAIL', 'PHONE', 'ADDRESS'];
          if (!excludeWords.some(word => name.toUpperCase().includes(word))) {
            return name;
          }
        }
      }
    }
    return '';
  }

  private extractEmail(text: string): string {
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    return emailMatch ? emailMatch[0] : '';
  }

  private extractPhone(text: string): string {
    const phonePatterns = [
      /(\+91[\s-]?)?[6-9]\d{9}/g,
      /(\+91[\s-]?)?\d{10}/g,
      /[\+]?[\d\s\-\(\)]{10,15}/g
    ];
    
    for (const pattern of phonePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        return matches[0].replace(/\s+/g, '');
      }
    }
    return '';
  }

  private extractSkills(text: string): string[] {
    const foundSkills: string[] = [];
    const lowerText = text.toLowerCase();
    
    this.skillsDatabase.forEach(skill => {
      const skillVariations = [
        skill.toLowerCase(),
        skill.toLowerCase().replace(/\s+/g, ''),
        skill.toLowerCase().replace(/\./g, '')
      ];
      
      if (skillVariations.some(variation => lowerText.includes(variation))) {
        foundSkills.push(skill);
      }
    });
    
    return Array.from(new Set(foundSkills));
  }

  private extractExperience(text: string): string[] {
    const experiencePatterns = [
      /(?:Software Developer|Engineer|Analyst|Manager|Lead|Architect|Intern|Trainee)[^\n]*/gi,
      /(?:at|@)\s+([A-Z][a-zA-Z\s&]+(?:Ltd|Inc|Corp|Limited|Technologies|Systems|Solutions|Services)?)/g
    ];
    
    const experience: string[] = [];
    
    experiencePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        experience.push(...matches.slice(0, 5));
      }
    });
    
    return Array.from(new Set(experience));
  }

  private extractEducation(text: string): string[] {
    const degreePatterns = [
      /Bachelor\s+of\s+Technology|B\.?\s*Tech|BTech/gi,
      /Bachelor\s+of\s+Engineering|B\.?\s*E\.?|BE/gi,
      /Bachelor\s+of\s+Science|B\.?\s*Sc\.?|BSc/gi,
      /Master\s+of\s+Technology|M\.?\s*Tech|MTech/gi,
      /Master\s+of\s+Engineering|M\.?\s*E\.?|ME/gi,
      /PhD|Ph\.?D\.?|Doctorate/gi
    ];
    
    const education: string[] = [];
    
    degreePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        education.push(...matches.map(m => m.trim()));
      }
    });
    
    return Array.from(new Set(education));
  }

  private extractCertifications(text: string): string[] {
    const certPatterns = [
      /Certified\s+in\s+([^\n]+)/gi,
      /Certificate\s+in\s+([^\n]+)/gi,
      /Certification:?\s*([^\n]+)/gi
    ];
    
    const certifications: string[] = [];
    
    certPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        certifications.push(...matches.map(m => m.trim()));
      }
    });
    
    return Array.from(new Set(certifications));
  }

  private generateSuggestions(data: any, jobRequirements?: string): string[] {
    const suggestions: string[] = [];
    
    if (!data.name) {
      suggestions.push("Add a clear name at the top of your resume");
    }
    
    if (!data.email) {
      suggestions.push("Include a professional email address");
    }
    
    if (!data.phone) {
      suggestions.push("Add your phone number for easy contact");
    }
    
    if (data.skills.length < 5) {
      suggestions.push("Expand your skills section with more technical and soft skills");
    }
    
    if (data.experience.length === 0) {
      suggestions.push("Add work experience or internships to strengthen your profile");
    }
    
    if (data.education.length === 0) {
      suggestions.push("Include your educational background");
    }
    
    if (jobRequirements) {
      const requiredSkills = this.extractSkills(jobRequirements);
      const missingSkills = requiredSkills.filter(skill => !data.skills.includes(skill));
      
      if (missingSkills.length > 0) {
        suggestions.push(`Consider learning these skills: ${missingSkills.slice(0, 3).join(', ')}`);
      }
    }
    
    return suggestions;
  }

  private generateImprovements(data: any): string[] {
    const improvements: string[] = [];
    
    improvements.push("Use action verbs to describe your achievements");
    improvements.push("Quantify your accomplishments with numbers and metrics");
    improvements.push("Tailor your resume to match the job description");
    improvements.push("Keep your resume format clean and professional");
    improvements.push("Proofread for grammar and spelling errors");
    
    if (data.skills.length > 10) {
      improvements.push("Organize skills by category (Technical, Soft Skills, etc.)");
    }
    
    return improvements;
  }

  private identifyMissingFields(data: any): string[] {
    const missingFields: string[] = [];
    
    if (!data.name) missingFields.push("Name");
    if (!data.email) missingFields.push("Email");
    if (!data.phone) missingFields.push("Phone");
    if (data.skills.length === 0) missingFields.push("Skills");
    if (data.education.length === 0) missingFields.push("Education");
    
    return missingFields;
  }

  private calculateMatchScore(data: any, jobRequirements?: string): number {
    let score = 0;
    
    // Basic information (30 points)
    if (data.name) score += 10;
    if (data.email) score += 10;
    if (data.phone) score += 10;
    
    // Skills (40 points)
    if (data.skills.length > 0) score += Math.min(40, data.skills.length * 4);
    
    // Experience (20 points)
    if (data.experience.length > 0) score += Math.min(20, data.experience.length * 5);
    
    // Education (10 points)
    if (data.education.length > 0) score += 10;
    
    // Job requirements match bonus
    if (jobRequirements) {
      const requiredSkills = this.extractSkills(jobRequirements);
      const matchingSkills = data.skills.filter((skill: string) => requiredSkills.includes(skill));
      const matchPercentage = requiredSkills.length > 0 ? matchingSkills.length / requiredSkills.length : 0;
      score = Math.min(100, score + (matchPercentage * 20));
    }
    
    return Math.round(Math.min(100, score));
  }
}

export const aiAnalyzer = new LocalAIAnalyzer();