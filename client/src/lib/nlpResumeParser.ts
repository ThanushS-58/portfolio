// AI-Powered Resume Parser with NLP Techniques
// Implements core functional requirements for intelligent resume screening

export interface ParsedResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  experience: {
    totalYears: number;
    positions: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
      level: 'entry' | 'mid' | 'senior';
    }>;
    relevantRoles: string[];
    industries: string[];
  };
  education: {
    degrees: Array<{
      degree: string;
      institution: string;
      year: string;
      grade?: string;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      year: string;
    }>;
  };
  skills: {
    technical: Array<{
      name: string;
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      category: string;
    }>;
    soft: string[];
    languages: Array<{
      name: string;
      proficiency: string;
    }>;
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    duration?: string;
  }>;
  achievements: string[];
}

export class NLPResumeParser {
  // Comprehensive skill taxonomy with synonyms and variations
  private readonly skillTaxonomy = {
    'Programming Languages': {
      synonyms: ['programming', 'coding', 'development languages', 'languages'],
      skills: {
        'JavaScript': ['js', 'javascript', 'node.js', 'nodejs', 'ecmascript'],
        'Python': ['python', 'py', 'python3'],
        'Java': ['java', 'openjdk', 'oracle java'],
        'C++': ['c++', 'cpp', 'c plus plus'],
        'C#': ['c#', 'csharp', 'c sharp', '.net'],
        'C': ['c programming', 'c language'],
        'PHP': ['php', 'php7', 'php8'],
        'TypeScript': ['typescript', 'ts'],
        'Go': ['golang', 'go lang'],
        'Rust': ['rust lang'],
        'Kotlin': ['kotlin'],
        'Swift': ['swift'],
        'Ruby': ['ruby', 'ruby on rails'],
        'Scala': ['scala'],
        'Perl': ['perl'],
        'R': ['r programming', 'r language'],
        'MATLAB': ['matlab']
      }
    },
    'Web Technologies': {
      synonyms: ['web development', 'frontend', 'backend', 'full stack'],
      skills: {
        'HTML': ['html', 'html5', 'markup'],
        'CSS': ['css', 'css3', 'styling', 'stylesheets'],
        'React': ['react', 'reactjs', 'react.js'],
        'Angular': ['angular', 'angularjs'],
        'Vue.js': ['vue', 'vuejs', 'vue.js'],
        'Express.js': ['express', 'expressjs'],
        'Django': ['django'],
        'Flask': ['flask'],
        'Laravel': ['laravel'],
        'Spring': ['spring framework', 'spring boot'],
        'Bootstrap': ['bootstrap', 'twitter bootstrap'],
        'jQuery': ['jquery'],
        'Sass': ['sass', 'scss'],
        'Less': ['less css']
      }
    },
    'Databases': {
      synonyms: ['database', 'data storage', 'db'],
      skills: {
        'MySQL': ['mysql'],
        'PostgreSQL': ['postgresql', 'postgres'],
        'MongoDB': ['mongodb', 'mongo'],
        'SQLite': ['sqlite'],
        'Oracle': ['oracle db', 'oracle database'],
        'SQL Server': ['sql server', 'mssql'],
        'Redis': ['redis'],
        'Cassandra': ['cassandra'],
        'DynamoDB': ['dynamodb'],
        'Firebase': ['firebase']
      }
    },
    'Cloud & DevOps': {
      synonyms: ['cloud computing', 'devops', 'deployment'],
      skills: {
        'AWS': ['amazon web services', 'aws'],
        'Azure': ['microsoft azure', 'azure'],
        'Google Cloud': ['gcp', 'google cloud platform'],
        'Docker': ['docker', 'containerization'],
        'Kubernetes': ['kubernetes', 'k8s'],
        'Jenkins': ['jenkins', 'ci/cd'],
        'Git': ['git', 'version control', 'github', 'gitlab'],
        'Terraform': ['terraform'],
        'Ansible': ['ansible'],
        'Linux': ['linux', 'unix']
      }
    },
    'Data Science & AI': {
      synonyms: ['data science', 'machine learning', 'artificial intelligence'],
      skills: {
        'Machine Learning': ['ml', 'machine learning', 'artificial intelligence', 'ai'],
        'Deep Learning': ['deep learning', 'neural networks'],
        'Data Analysis': ['data analysis', 'data analytics'],
        'Pandas': ['pandas'],
        'NumPy': ['numpy'],
        'TensorFlow': ['tensorflow'],
        'PyTorch': ['pytorch'],
        'Scikit-learn': ['scikit-learn', 'sklearn'],
        'Tableau': ['tableau'],
        'Power BI': ['power bi', 'powerbi']
      }
    }
  };

  // Job title synonyms and variations
  private readonly jobTitleSynonyms = {
    'Software Developer': [
      'software engineer', 'programmer', 'developer', 'software dev',
      'full stack developer', 'backend developer', 'frontend developer'
    ],
    'Data Scientist': [
      'data analyst', 'data engineer', 'ml engineer', 'ai specialist'
    ],
    'Product Manager': [
      'product owner', 'pm', 'product lead'
    ],
    'DevOps Engineer': [
      'devops specialist', 'site reliability engineer', 'sre', 'platform engineer'
    ],
    'UI/UX Designer': [
      'user experience designer', 'user interface designer', 'ux designer', 'ui designer'
    ]
  };

  // Experience level indicators
  private readonly experienceLevels = {
    'entry': ['intern', 'junior', 'trainee', 'graduate', 'entry level', '0-2 years'],
    'mid': ['mid level', 'intermediate', 'associate', '2-5 years', '3-7 years'],
    'senior': ['senior', 'lead', 'principal', 'staff', 'architect', '5+ years', '7+ years']
  };

  // Soft skills database
  private readonly softSkills = [
    'communication', 'leadership', 'teamwork', 'problem solving', 'time management',
    'project management', 'critical thinking', 'analytical thinking', 'creativity',
    'adaptability', 'collaboration', 'organization', 'presentation skills',
    'interpersonal skills', 'decision making', 'conflict resolution', 'negotiation',
    'customer service', 'marketing', 'sales', 'business development'
  ];

  public parseResume(resumeText: string): ParsedResumeData {
    const cleanedText = this.preprocessText(resumeText);
    
    return {
      personalInfo: this.extractPersonalInfo(cleanedText),
      experience: this.extractExperience(cleanedText),
      education: this.extractEducation(cleanedText),
      skills: this.extractSkills(cleanedText),
      projects: this.extractProjects(cleanedText),
      achievements: this.extractAchievements(cleanedText)
    };
  }

  private preprocessText(text: string): string {
    // Clean and normalize text
    return text
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\n+/g, '\n') // Multiple newlines to single newline
      .trim();
  }

  private extractPersonalInfo(text: string) {
    // Advanced name extraction using multiple patterns
    const namePatterns = [
      /^([A-Z][A-Z\s]+[A-Z])$/m, // All caps like "THANUSH S"
      /^([A-Z][a-z]+(?:\s[A-Z][a-z]*)*(?:\s[A-Z]))$/m, // Title case with initials
      /Name[:\s]*([A-Za-z\s]+)/i,
      /^([A-Z][a-z]+\s[A-Z][a-z]+)/m
    ];

    let name = "Not found";
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1] && this.isValidName(match[1])) {
        name = match[1].trim();
        break;
      }
    }

    // Enhanced contact extraction
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const phoneMatch = text.match(/(\+91[\s-]?\d{10}|\+?\d{1,3}[\s-]?\d{3,4}[\s-]?\d{3,4}[\s-]?\d{3,4})/);
    const linkedinMatch = text.match(/(linkedin\.com\/[^\s]+|LinkedIn[:\s]*([^\s]+))/i);
    const githubMatch = text.match(/(github\.com\/[^\s]+|GitHub[:\s]*([^\s]+))/i);
    
    // Location extraction
    const locationPatterns = [
      /(?:Location|Address|City)[:\s]*([^\n]+)/i,
      /([A-Za-z\s]+,\s*[A-Za-z\s]+,\s*\d{6})/,
      /(Bangalore|Mumbai|Delhi|Chennai|Hyderabad|Pune|Kolkata|Ahmedabad|Bengaluru)/i
    ];
    
    let location = "";
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) {
        location = match[1].trim();
        break;
      }
    }

    return {
      name,
      email: emailMatch ? emailMatch[1] : "",
      phone: phoneMatch ? phoneMatch[1] : "",
      location,
      linkedin: linkedinMatch ? linkedinMatch[1] : "",
      github: githubMatch ? githubMatch[1] : ""
    };
  }

  private isValidName(name: string): boolean {
    const cleaned = name.trim();
    return cleaned.length >= 2 && 
           cleaned.length <= 50 && 
           !/[0-9@#$%^&*()_+=<>?]/.test(cleaned) &&
           !['RESUME', 'CV', 'EMAIL', 'PHONE'].some(word => cleaned.toUpperCase().includes(word));
  }

  private extractExperience(text: string) {
    // Extract work experience section
    const experienceSection = this.extractSection(text, [
      'work experience', 'professional experience', 'experience', 'employment history'
    ]);

    // Calculate total years of experience
    const yearPatterns = [
      /(\d{4})\s*[-–]\s*(\d{4}|present|current)/gi,
      /(\d+)\s*years?\s*(?:of\s*)?experience/i
    ];

    let totalYears = 0;
    const yearMatches = text.match(/(\d{4})\s*[-–]\s*(\d{4}|present|current)/gi) || [];
    
    if (yearMatches.length > 0) {
      const currentYear = new Date().getFullYear();
      for (const match of yearMatches) {
        const years = match.match(/(\d{4})\s*[-–]\s*(\d{4}|present|current)/i);
        if (years) {
          const startYear = parseInt(years[1]);
          const endYear = years[2].toLowerCase().includes('present') || years[2].toLowerCase().includes('current') 
            ? currentYear : parseInt(years[2]);
          totalYears += Math.max(0, endYear - startYear);
        }
      }
    }

    // Extract job positions
    const positions = this.extractJobPositions(experienceSection || text);
    const relevantRoles = this.extractJobTitles(text);
    const industries = this.extractIndustries(text);

    return {
      totalYears,
      positions,
      relevantRoles,
      industries
    };
  }

  private extractJobPositions(text: string) {
    const positions = [];
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for job title patterns
      const titlePattern = /^([A-Za-z\s&-]+)(?:\s*[•·]\s*|\s+)([A-Za-z\s&.,]+)(?:\s+(\w+\s+\d{4}\s*[-–]\s*\w+\s+\d{4}|\d{4}\s*[-–]\s*\d{4}))?/;
      const match = line.match(titlePattern);
      
      if (match && this.isJobTitle(match[1])) {
        let description = "";
        // Get description from following lines
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          if (lines[j] && !this.isJobTitle(lines[j]) && !lines[j].match(/\d{4}/)) {
            description += lines[j] + " ";
          } else {
            break;
          }
        }

        positions.push({
          title: match[1].trim(),
          company: match[2] ? match[2].trim() : "",
          duration: match[3] ? match[3].trim() : "",
          description: description.trim(),
          level: this.determineExperienceLevel(match[1], description)
        });
      }
    }

    return positions;
  }

  private extractEducation(text: string) {
    const educationSection = this.extractSection(text, [
      'education', 'academic background', 'qualifications', 'educational background'
    ]);
    
    const degrees = [];
    const certifications = [];

    // Degree patterns
    const degreePatterns = [
      /([BM]\.?(?:Tech|E|Sc|A|Com)\.?[^,\n]*)\s*,?\s*([^,\n]+)(?:\s*,?\s*(\d{4}(?:\s*[-–]\s*\d{4})?))?/gi,
      /(Bachelor|Master|PhD|Doctorate)[^,\n]*\s*,?\s*([^,\n]+)(?:\s*,?\s*(\d{4}(?:\s*[-–]\s*\d{4})?))?/gi
    ];

    for (const pattern of degreePatterns) {
      let match;
      while ((match = pattern.exec(educationSection || text)) !== null) {
        degrees.push({
          degree: match[1].trim(),
          institution: match[2] ? match[2].trim() : "",
          year: match[3] ? match[3].trim() : ""
        });
      }
    }

    // Certification patterns
    const certificationPatterns = [
      /(?:certification|certified|certificate)[:\s]*([^,\n]+)(?:\s*,?\s*([^,\n]+))?(?:\s*,?\s*(\d{4}))?/gi
    ];

    for (const pattern of certificationPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        certifications.push({
          name: match[1].trim(),
          issuer: match[2] ? match[2].trim() : "",
          year: match[3] ? match[3].trim() : ""
        });
      }
    }

    return { degrees, certifications };
  }

  private extractSkills(text: string) {
    const technical = [];
    const soft = [];
    const languages = [];

    // Extract technical skills using taxonomy
    for (const [category, categoryData] of Object.entries(this.skillTaxonomy)) {
      for (const [skill, synonyms] of Object.entries(categoryData.skills)) {
        for (const synonym of synonyms) {
          const regex = new RegExp(`\\b${synonym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
          if (regex.test(text)) {
            technical.push({
              name: skill,
              level: this.determineSkillLevel(text, skill, synonyms),
              category
            });
            break;
          }
        }
      }
    }

    // Extract soft skills
    for (const skill of this.softSkills) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (regex.test(text)) {
        soft.push(skill);
      }
    }

    // Extract language skills
    const languagePatterns = [
      /(English|Hindi|Tamil|Telugu|Kannada|Malayalam|Bengali|Gujarati|Marathi|French|German|Spanish|Chinese|Japanese)\s*[:\-]?\s*(native|fluent|proficient|intermediate|basic|beginner)/gi
    ];

    for (const pattern of languagePatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        languages.push({
          name: match[1],
          proficiency: match[2] || 'intermediate'
        });
      }
    }

    return { technical, soft, languages };
  }

  private extractProjects(text: string) {
    const projectSection = this.extractSection(text, [
      'projects', 'project', 'portfolio', 'personal projects', 'academic projects'
    ]);
    
    const projects = [];
    const lines = (projectSection || text).split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Project title patterns
      const projectPattern = /^([A-Za-z\s&-]+(?:System|Management|Platform|Application|Website|App|Tool|API|Dashboard))/i;
      const match = line.match(projectPattern);
      
      if (match) {
        let description = "";
        let technologies = [];
        
        // Get description and technologies from following lines
        for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
          if (lines[j] && !lines[j].match(projectPattern)) {
            description += lines[j] + " ";
            
            // Extract technologies
            const techMatches = lines[j].match(/(?:using|with|technologies?)[:\s]*([^.]+)/i);
            if (techMatches) {
              technologies = techMatches[1].split(/[,\s]+/).filter(Boolean);
            }
          } else {
            break;
          }
        }

        projects.push({
          name: match[1].trim(),
          description: description.trim(),
          technologies
        });
      }
    }

    return projects;
  }

  private extractAchievements(text: string) {
    const achievements = [];
    const achievementPatterns = [
      /(?:secured|won|achieved|awarded)[^.!?\n]+/gi,
      /(?:first|1st|second|2nd|third|3rd)\s+(?:prize|place|position)[^.!?\n]*/gi,
      /(?:certificate|certification|award)[^.!?\n]+/gi
    ];

    for (const pattern of achievementPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        achievements.push(...matches.map(match => match.trim()));
      }
    }

    return [...new Set(achievements)].slice(0, 10);
  }

  private extractSection(text: string, sectionHeaders: string[]): string | null {
    for (const header of sectionHeaders) {
      const regex = new RegExp(`${header}[:\n]([\\s\\S]*?)(?=\\n[A-Z][A-Z\\s]+:|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  }

  private isJobTitle(text: string): boolean {
    const jobTitleKeywords = [
      'developer', 'engineer', 'manager', 'analyst', 'specialist', 'coordinator',
      'intern', 'associate', 'lead', 'director', 'designer', 'consultant',
      'administrator', 'architect', 'scientist', 'researcher', 'ambassador'
    ];
    
    return jobTitleKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private determineExperienceLevel(title: string, description: string): 'entry' | 'mid' | 'senior' {
    const combined = (title + " " + description).toLowerCase();
    
    for (const [level, indicators] of Object.entries(this.experienceLevels)) {
      if (indicators.some(indicator => combined.includes(indicator))) {
        return level as 'entry' | 'mid' | 'senior';
      }
    }
    
    return 'mid'; // Default
  }

  private determineSkillLevel(text: string, skill: string, synonyms: string[]): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const skillContext = this.getSkillContext(text, skill, synonyms);
    
    if (skillContext.includes('expert') || skillContext.includes('advanced') || skillContext.includes('senior')) {
      return 'expert';
    } else if (skillContext.includes('intermediate') || skillContext.includes('proficient')) {
      return 'advanced';
    } else if (skillContext.includes('basic') || skillContext.includes('beginner') || skillContext.includes('learning')) {
      return 'beginner';
    }
    
    return 'intermediate'; // Default
  }

  private getSkillContext(text: string, skill: string, synonyms: string[]): string {
    for (const synonym of synonyms) {
      const regex = new RegExp(`.{0,50}${synonym}.{0,50}`, 'gi');
      const match = text.match(regex);
      if (match) {
        return match[0].toLowerCase();
      }
    }
    return '';
  }

  private extractJobTitles(text: string): string[] {
    const titles = [];
    for (const [standardTitle, variations] of Object.entries(this.jobTitleSynonyms)) {
      for (const variation of variations) {
        const regex = new RegExp(`\\b${variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        if (regex.test(text)) {
          titles.push(standardTitle);
          break;
        }
      }
    }
    return [...new Set(titles)];
  }

  private extractIndustries(text: string): string[] {
    const industries = [
      'technology', 'healthcare', 'finance', 'education', 'marketing', 'consulting',
      'retail', 'manufacturing', 'telecommunications', 'automotive', 'aerospace',
      'e-commerce', 'fintech', 'edtech', 'advertising', 'media', 'gaming'
    ];
    
    return industries.filter(industry => 
      new RegExp(`\\b${industry}\\b`, 'gi').test(text)
    );
  }
}

// Job matching and scoring functions
export class JobMatcher {
  private parser = new NLPResumeParser();

  public analyzeResume(resumeText: string, jobRequirements: any) {
    const parsedResume = this.parser.parseResume(resumeText);
    const matchScore = this.calculateMatchScore(parsedResume, jobRequirements);
    const category = this.categorizeCandidate(matchScore);
    const analysis = this.generateAnalysis(parsedResume, jobRequirements);

    return {
      candidateName: parsedResume.personalInfo.name,
      contactInfo: {
        email: parsedResume.personalInfo.email,
        phone: parsedResume.personalInfo.phone,
        linkedin: parsedResume.personalInfo.linkedin
      },
      skills: {
        technical: parsedResume.skills.technical.map(skill => skill.name),
        soft: parsedResume.skills.soft,
        missing: this.findMissingSkills(parsedResume, jobRequirements)
      },
      experience: {
        totalYears: parsedResume.experience.totalYears,
        relevantRoles: parsedResume.experience.relevantRoles,
        industries: parsedResume.experience.industries
      },
      education: {
        degrees: parsedResume.education.degrees.map(deg => deg.degree),
        institutions: parsedResume.education.degrees.map(deg => deg.institution),
        relevant: parsedResume.education.degrees.length > 0
      },
      matchScore,
      category,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      recommendations: analysis.recommendations
    };
  }

  private calculateMatchScore(parsedResume: ParsedResumeData, jobRequirements: any): number {
    let score = 0;
    let maxScore = 100;

    // Skills matching (40% weight)
    const requiredSkills = jobRequirements.requiredSkills || [];
    const candidateSkills = parsedResume.skills.technical.map(skill => skill.name.toLowerCase());
    const skillMatches = requiredSkills.filter((skill: string) => 
      candidateSkills.some(candidateSkill => candidateSkill.includes(skill.toLowerCase()))
    );
    score += (skillMatches.length / Math.max(requiredSkills.length, 1)) * 40;

    // Experience matching (30% weight)
    const requiredExperience = this.extractExperienceRequirement(jobRequirements.description || "");
    if (parsedResume.experience.totalYears >= requiredExperience) {
      score += 30;
    } else {
      score += (parsedResume.experience.totalYears / Math.max(requiredExperience, 1)) * 30;
    }

    // Education matching (20% weight)
    if (parsedResume.education.degrees.length > 0) {
      score += 20;
    }

    // Job title relevance (10% weight)
    const jobTitle = jobRequirements.title || "";
    const relevantTitles = parsedResume.experience.relevantRoles;
    if (relevantTitles.some(title => jobTitle.toLowerCase().includes(title.toLowerCase()))) {
      score += 10;
    }

    return Math.min(Math.round(score), 100);
  }

  private extractExperienceRequirement(jobDescription: string): number {
    const experiencePatterns = [
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
      /(\d+)\s*to\s*(\d+)\s*years/i,
      /minimum\s*(\d+)\s*years/i
    ];

    for (const pattern of experiencePatterns) {
      const match = jobDescription.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }

    return 0;
  }

  private categorizeCandidate(score: number): 'highly-suitable' | 'moderate-fit' | 'needs-improvement' {
    if (score >= 80) return 'highly-suitable';
    if (score >= 60) return 'moderate-fit';
    return 'needs-improvement';
  }

  private findMissingSkills(parsedResume: ParsedResumeData, jobRequirements: any): string[] {
    const requiredSkills = jobRequirements.requiredSkills || [];
    const candidateSkills = parsedResume.skills.technical.map(skill => skill.name.toLowerCase());
    
    return requiredSkills.filter((skill: string) => 
      !candidateSkills.some(candidateSkill => candidateSkill.includes(skill.toLowerCase()))
    );
  }

  private generateAnalysis(parsedResume: ParsedResumeData, jobRequirements: any) {
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];

    // Analyze strengths
    if (parsedResume.skills.technical.length > 5) {
      strengths.push("Strong technical skill set with diverse technologies");
    }
    if (parsedResume.experience.totalYears > 2) {
      strengths.push("Solid work experience background");
    }
    if (parsedResume.projects.length > 2) {
      strengths.push("Good project portfolio demonstrating practical experience");
    }

    // Analyze weaknesses
    const missingSkills = this.findMissingSkills(parsedResume, jobRequirements);
    if (missingSkills.length > 0) {
      weaknesses.push(`Missing required skills: ${missingSkills.join(', ')}`);
    }
    if (parsedResume.experience.totalYears < 1) {
      weaknesses.push("Limited professional experience");
    }

    // Generate recommendations
    if (missingSkills.length > 0) {
      recommendations.push(`Consider gaining experience in: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    if (parsedResume.education.certifications.length === 0) {
      recommendations.push("Professional certifications would strengthen the profile");
    }

    return { strengths, weaknesses, recommendations };
  }
}