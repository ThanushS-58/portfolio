// Dynamic Skills and Career Objective Generator
// Based on current industry trends and demands (2025)

export interface TrendingSkill {
  name: string;
  category: 'technical' | 'soft' | 'emerging';
  demand: 'high' | 'very-high' | 'critical';
  growth: number; // percentage growth
  industries: string[];
  description: string;
}

export interface CareerObjectiveTemplate {
  field: string;
  templates: string[];
  keySkills: string[];
  emergingSkills: string[];
}

export class DynamicSkillsGenerator {
  private currentTrendingSkills: TrendingSkill[] = [
    // AI & Machine Learning
    { name: 'Artificial Intelligence', category: 'technical', demand: 'critical', growth: 85, industries: ['Tech', 'Healthcare', 'Finance'], description: 'AI development and implementation' },
    { name: 'Machine Learning', category: 'technical', demand: 'critical', growth: 78, industries: ['Tech', 'E-commerce', 'Automotive'], description: 'ML model development and deployment' },
    { name: 'Large Language Models', category: 'technical', demand: 'very-high', growth: 95, industries: ['Tech', 'Content', 'Education'], description: 'LLM fine-tuning and applications' },
    { name: 'Prompt Engineering', category: 'technical', demand: 'very-high', growth: 120, industries: ['Tech', 'Marketing', 'Content'], description: 'AI prompt optimization and design' },
    
    // Cloud & DevOps
    { name: 'Cloud Computing', category: 'technical', demand: 'critical', growth: 65, industries: ['Tech', 'Enterprise', 'Startups'], description: 'Cloud infrastructure and services' },
    { name: 'Kubernetes', category: 'technical', demand: 'very-high', growth: 70, industries: ['Tech', 'DevOps', 'Enterprise'], description: 'Container orchestration' },
    { name: 'DevSecOps', category: 'technical', demand: 'very-high', growth: 82, industries: ['Tech', 'Security', 'Finance'], description: 'Security-integrated development operations' },
    { name: 'Infrastructure as Code', category: 'technical', demand: 'high', growth: 75, industries: ['Tech', 'DevOps', 'Cloud'], description: 'Automated infrastructure management' },
    
    // Data & Analytics
    { name: 'Data Science', category: 'technical', demand: 'critical', growth: 68, industries: ['Tech', 'Healthcare', 'Finance'], description: 'Advanced data analysis and insights' },
    { name: 'Data Engineering', category: 'technical', demand: 'very-high', growth: 72, industries: ['Tech', 'Data', 'Analytics'], description: 'Data pipeline and infrastructure' },
    { name: 'Real-time Analytics', category: 'technical', demand: 'high', growth: 88, industries: ['Tech', 'E-commerce', 'Gaming'], description: 'Live data processing and analysis' },
    
    // Development
    { name: 'Full-Stack Development', category: 'technical', demand: 'critical', growth: 55, industries: ['Tech', 'Startups', 'E-commerce'], description: 'End-to-end web development' },
    { name: 'React/Next.js', category: 'technical', demand: 'very-high', growth: 60, industries: ['Tech', 'Web', 'Mobile'], description: 'Modern frontend frameworks' },
    { name: 'Node.js', category: 'technical', demand: 'high', growth: 58, industries: ['Tech', 'Backend', 'API'], description: 'Server-side JavaScript development' },
    { name: 'TypeScript', category: 'technical', demand: 'very-high', growth: 75, industries: ['Tech', 'Web', 'Enterprise'], description: 'Type-safe JavaScript development' },
    { name: 'Rust', category: 'technical', demand: 'high', growth: 92, industries: ['Tech', 'Systems', 'Blockchain'], description: 'Systems programming language' },
    { name: 'Go', category: 'technical', demand: 'high', growth: 70, industries: ['Tech', 'Cloud', 'Microservices'], description: 'Concurrent programming language' },
    
    // Emerging Technologies
    { name: 'Blockchain Development', category: 'technical', demand: 'high', growth: 65, industries: ['Fintech', 'Web3', 'Gaming'], description: 'Decentralized application development' },
    { name: 'Quantum Computing', category: 'emerging', demand: 'high', growth: 110, industries: ['Research', 'Tech', 'Defense'], description: 'Quantum algorithm development' },
    { name: 'Edge Computing', category: 'technical', demand: 'high', growth: 78, industries: ['IoT', 'Tech', 'Automotive'], description: 'Distributed computing at network edge' },
    { name: 'AR/VR Development', category: 'technical', demand: 'high', growth: 85, industries: ['Gaming', 'Education', 'Healthcare'], description: 'Immersive technology development' },
    
    // Cybersecurity
    { name: 'Cybersecurity', category: 'technical', demand: 'critical', growth: 73, industries: ['Security', 'Finance', 'Healthcare'], description: 'Information security and protection' },
    { name: 'Ethical Hacking', category: 'technical', demand: 'very-high', growth: 80, industries: ['Security', 'Consulting', 'Government'], description: 'Penetration testing and security assessment' },
    { name: 'Zero Trust Security', category: 'technical', demand: 'very-high', growth: 95, industries: ['Security', 'Enterprise', 'Cloud'], description: 'Modern security architecture' },
    
    // Soft Skills
    { name: 'AI Collaboration', category: 'soft', demand: 'very-high', growth: 100, industries: ['All'], description: 'Working effectively with AI tools' },
    { name: 'Cross-functional Leadership', category: 'soft', demand: 'critical', growth: 45, industries: ['All'], description: 'Leading diverse teams and projects' },
    { name: 'Data-Driven Decision Making', category: 'soft', demand: 'very-high', growth: 60, industries: ['All'], description: 'Using data to guide strategic decisions' },
    { name: 'Digital Transformation', category: 'soft', demand: 'high', growth: 55, industries: ['Enterprise', 'Consulting', 'Management'], description: 'Leading organizational digital change' },
    { name: 'Remote Team Management', category: 'soft', demand: 'high', growth: 50, industries: ['All'], description: 'Managing distributed teams effectively' },
  ];

  private careerObjectiveTemplates: CareerObjectiveTemplate[] = [
    {
      field: 'software-development',
      templates: [
        'Seeking a dynamic software development role where I can leverage {primarySkills} and emerging technologies like {emergingSkills} to build scalable, innovative solutions that drive business growth and user engagement.',
        'Passionate software engineer with expertise in {primarySkills} seeking to contribute to cutting-edge projects involving {emergingSkills}, while continuously advancing my technical skills in a collaborative environment.',
        'Dedicated to creating robust, high-performance applications using {primarySkills} and staying ahead of industry trends through {emergingSkills}, aiming to deliver exceptional user experiences and technical excellence.'
      ],
      keySkills: ['Full-Stack Development', 'React/Next.js', 'Node.js', 'TypeScript', 'Cloud Computing'],
      emergingSkills: ['AI Collaboration', 'Large Language Models', 'Edge Computing']
    },
    {
      field: 'data-science',
      templates: [
        'Aspiring to leverage advanced {primarySkills} and cutting-edge {emergingSkills} to extract meaningful insights from complex datasets, driving data-informed decision making and business strategy.',
        'Data science professional seeking to apply {primarySkills} and emerging {emergingSkills} technologies to solve real-world problems, optimize processes, and unlock hidden patterns in big data.',
        'Committed to advancing the field of data science through {primarySkills} while embracing {emergingSkills} to deliver predictive analytics and machine learning solutions that create measurable business impact.'
      ],
      keySkills: ['Data Science', 'Machine Learning', 'Data Engineering', 'Real-time Analytics', 'Cloud Computing'],
      emergingSkills: ['Large Language Models', 'Quantum Computing', 'AI Collaboration']
    },
    {
      field: 'ai-ml',
      templates: [
        'Seeking to push the boundaries of artificial intelligence through {primarySkills} and revolutionary {emergingSkills}, developing intelligent systems that transform industries and enhance human capabilities.',
        'AI/ML engineer passionate about implementing {primarySkills} and pioneering {emergingSkills} to create next-generation intelligent applications that solve complex, real-world challenges.',
        'Dedicated to advancing machine intelligence using {primarySkills} while exploring {emergingSkills} to build ethical, scalable AI solutions that positively impact society and drive innovation.'
      ],
      keySkills: ['Artificial Intelligence', 'Machine Learning', 'Large Language Models', 'Data Science', 'Prompt Engineering'],
      emergingSkills: ['Quantum Computing', 'Edge Computing', 'AI Collaboration']
    },
    {
      field: 'cybersecurity',
      templates: [
        'Cybersecurity professional seeking to protect digital assets through {primarySkills} and advanced {emergingSkills}, ensuring robust security postures in an evolving threat landscape.',
        'Committed to safeguarding organizations using {primarySkills} and cutting-edge {emergingSkills}, while staying ahead of emerging cyber threats and implementing proactive security measures.',
        'Security expert dedicated to building resilient systems through {primarySkills} and innovative {emergingSkills}, focusing on zero-trust architectures and comprehensive risk management.'
      ],
      keySkills: ['Cybersecurity', 'Ethical Hacking', 'Zero Trust Security', 'DevSecOps', 'Cloud Computing'],
      emergingSkills: ['AI Collaboration', 'Quantum Computing', 'Edge Computing']
    },
    {
      field: 'devops-cloud',
      templates: [
        'DevOps engineer seeking to optimize development lifecycles through {primarySkills} and innovative {emergingSkills}, enabling rapid, reliable software delivery and scalable infrastructure.',
        'Cloud infrastructure specialist passionate about implementing {primarySkills} and emerging {emergingSkills} to build resilient, automated systems that support modern application architectures.',
        'Dedicated to streamlining operations through {primarySkills} while embracing {emergingSkills} to create efficient, secure, and scalable cloud-native solutions.'
      ],
      keySkills: ['DevSecOps', 'Kubernetes', 'Cloud Computing', 'Infrastructure as Code', 'Full-Stack Development'],
      emergingSkills: ['Edge Computing', 'AI Collaboration', 'Zero Trust Security']
    },
    {
      field: 'general-tech',
      templates: [
        'Technology professional eager to contribute technical expertise in {primarySkills} while exploring {emergingSkills} to drive innovation, solve complex problems, and create impactful solutions.',
        'Seeking a challenging role where I can apply {primarySkills} and stay at the forefront of technology through {emergingSkills}, contributing to projects that shape the future of digital transformation.',
        'Passionate technologist committed to leveraging {primarySkills} and embracing {emergingSkills} to build next-generation solutions that enhance user experiences and drive business success.'
      ],
      keySkills: ['Full-Stack Development', 'Cloud Computing', 'Data-Driven Decision Making', 'Cross-functional Leadership'],
      emergingSkills: ['AI Collaboration', 'Digital Transformation', 'Large Language Models']
    }
  ];

  public generateDynamicObjective(profile: any, jobTitle?: string, jobDescription?: string): string {
    try {
      // Analyze user's skills and experience
      const userSkills = this.extractUserSkills(profile);
      const experienceLevel = this.determineExperienceLevel(profile);
      const detectedField = this.detectProfessionalField(profile, jobTitle, jobDescription);
      
      // Get relevant trending skills
      const relevantTrendingSkills = this.getRelevantTrendingSkills(userSkills, detectedField);
      const emergingSkills = this.getEmergingSkillsForField(detectedField);
      
      // Select appropriate template
      const template = this.selectTemplate(detectedField, experienceLevel);
      
      // Generate personalized objective
      return this.populateTemplate(template, userSkills, relevantTrendingSkills, emergingSkills);
    } catch (error) {
      console.error('Error generating dynamic objective:', error);
      return this.getFallbackObjective(profile);
    }
  }

  private extractUserSkills(profile: any): string[] {
    const skills: string[] = [];
    
    // Extract technical skills
    if (profile?.technicalSkills && Array.isArray(profile.technicalSkills)) {
      profile.technicalSkills.forEach((skill: any) => {
        const skillName = typeof skill === 'object' ? skill.name : skill;
        if (skillName) skills.push(skillName);
      });
    }
    
    // Extract soft skills
    if (profile?.softSkills && Array.isArray(profile.softSkills)) {
      profile.softSkills.forEach((skill: any) => {
        const skillName = typeof skill === 'object' ? skill.name : skill;
        if (skillName) skills.push(skillName);
      });
    }
    
    return skills;
  }

  private determineExperienceLevel(profile: any): 'entry' | 'mid' | 'senior' {
    if (!profile?.experience || !Array.isArray(profile.experience)) return 'entry';
    
    const totalExperience = profile.experience.length;
    const hasLeadershipRole = profile.experience.some((exp: any) => 
      exp.title?.toLowerCase().includes('lead') || 
      exp.title?.toLowerCase().includes('senior') ||
      exp.title?.toLowerCase().includes('manager')
    );
    
    if (totalExperience >= 5 || hasLeadershipRole) return 'senior';
    if (totalExperience >= 2) return 'mid';
    return 'entry';
  }

  private detectProfessionalField(profile: any, jobTitle?: string, jobDescription?: string): string {
    const combinedText = [
      jobTitle || '',
      jobDescription || '',
      profile?.careerObjective || '',
      profile?.professionalSummary || '',
      ...(profile?.experience || []).map((exp: any) => `${exp.title} ${exp.description}`),
      ...(profile?.projects || []).map((proj: any) => `${proj.name} ${proj.description}`)
    ].join(' ').toLowerCase();

    if (combinedText.includes('ai') || combinedText.includes('machine learning') || 
        combinedText.includes('artificial intelligence') || combinedText.includes('llm')) {
      return 'ai-ml';
    }
    
    if (combinedText.includes('data scientist') || combinedText.includes('data engineer') || 
        combinedText.includes('analytics') || combinedText.includes('big data')) {
      return 'data-science';
    }
    
    if (combinedText.includes('security') || combinedText.includes('cybersecurity') || 
        combinedText.includes('penetration') || combinedText.includes('ethical hack')) {
      return 'cybersecurity';
    }
    
    if (combinedText.includes('devops') || combinedText.includes('cloud') || 
        combinedText.includes('kubernetes') || combinedText.includes('infrastructure')) {
      return 'devops-cloud';
    }
    
    if (combinedText.includes('developer') || combinedText.includes('engineer') || 
        combinedText.includes('programming') || combinedText.includes('software')) {
      return 'software-development';
    }
    
    return 'general-tech';
  }

  private getRelevantTrendingSkills(userSkills: string[], field: string): string[] {
    return this.currentTrendingSkills
      .filter(skill => 
        skill.industries.some(industry => 
          industry.toLowerCase().includes('tech') || 
          this.isSkillRelevantToField(skill, field)
        )
      )
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 3)
      .map(skill => skill.name);
  }

  private getEmergingSkillsForField(field: string): string[] {
    const template = this.careerObjectiveTemplates.find(t => t.field === field);
    return template?.emergingSkills || ['AI Collaboration', 'Digital Transformation', 'Data-Driven Decision Making'];
  }

  private selectTemplate(field: string, experienceLevel: 'entry' | 'mid' | 'senior'): string {
    const template = this.careerObjectiveTemplates.find(t => t.field === field);
    if (!template) {
      return this.careerObjectiveTemplates.find(t => t.field === 'general-tech')!.templates[0];
    }
    
    // Select template based on experience level
    const templateIndex = experienceLevel === 'entry' ? 0 : experienceLevel === 'mid' ? 1 : 2;
    return template.templates[templateIndex] || template.templates[0];
  }

  private populateTemplate(template: string, userSkills: string[], trendingSkills: string[], emergingSkills: string[]): string {
    // Combine user skills with trending skills, prioritizing user skills
    const combinedSkills = [...userSkills.slice(0, 3), ...trendingSkills];
    const uniqueSkills = combinedSkills.filter((skill, index) => combinedSkills.indexOf(skill) === index);
    const primarySkills = uniqueSkills.slice(0, 4);
    const selectedEmergingSkills = emergingSkills.slice(0, 2);
    
    return template
      .replace('{primarySkills}', primarySkills.join(', '))
      .replace('{emergingSkills}', selectedEmergingSkills.join(' and '));
  }

  private isSkillRelevantToField(skill: TrendingSkill, field: string): boolean {
    const fieldMappings: Record<string, string[]> = {
      'ai-ml': ['Tech', 'AI', 'Data'],
      'data-science': ['Tech', 'Data', 'Analytics'],
      'cybersecurity': ['Security', 'Tech'],
      'devops-cloud': ['Cloud', 'DevOps', 'Tech'],
      'software-development': ['Tech', 'Web', 'Mobile'],
      'general-tech': ['Tech']
    };
    
    const relevantIndustries = fieldMappings[field] || ['Tech'];
    return skill.industries.some(industry => relevantIndustries.includes(industry));
  }

  private getFallbackObjective(profile: any): string {
    const name = profile?.fullName || 'Professional';
    return `Dedicated ${name.split(' ')[0]} seeking to leverage technical expertise and innovative thinking to contribute to cutting-edge projects while continuously learning and growing in a dynamic technology environment.`;
  }

  public getTrendingSkillsForField(field: string): TrendingSkill[] {
    return this.currentTrendingSkills
      .filter(skill => this.isSkillRelevantToField(skill, field))
      .sort((a, b) => b.growth - a.growth);
  }

  public getAllTrendingSkills(): TrendingSkill[] {
    return this.currentTrendingSkills.sort((a, b) => b.growth - a.growth);
  }
}

export const dynamicSkillsGenerator = new DynamicSkillsGenerator();