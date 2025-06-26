import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Eye, FileText, Sparkles, CheckCircle, AlertCircle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@shared/schema";
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, BorderStyle, WidthType, TabStopType, TabStopPosition } from "docx";
import { dynamicSkillsGenerator } from "@/lib/dynamicSkillsGenerator";

interface ResumeData {
  targetCompany: string;
  jobTitle: string;
  jobDescription: string;
  template: string;
  customObjective: string;
  selectedSkills: string[];
  selectedExperience: string[];
  selectedProjects: string[];
}

export default function ResumeCreator() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedResume, setGeneratedResume] = useState("");

  const [resumeData, setResumeData] = useState<ResumeData>({
    targetCompany: "",
    jobTitle: "",
    jobDescription: "",
    template: "modern",
    customObjective: "",
    selectedSkills: [],
    selectedExperience: [],
    selectedProjects: []
  });

  const { data: profiles } = useQuery<Profile[]>({
    queryKey: ['/api/profiles']
  });

  const profile = Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : undefined;

  const templates = [
    { id: "professional", name: "Professional", description: "Classic corporate layout" },
    { id: "modern", name: "Modern", description: "Clean and contemporary design" },
    { id: "minimal", name: "Minimal", description: "Simple, elegant layout" },
    { id: "technical", name: "Technical", description: "Optimized for tech roles" }
  ];

  // Helper functions
  const getTopSkills = () => {
    try {
      const technicalSkills = Array.isArray(profile?.technicalSkills) ? profile.technicalSkills : [];
      const softSkills = Array.isArray(profile?.softSkills) ? profile.softSkills : [];
      
      const allSkills = [...technicalSkills, ...softSkills];
      return allSkills.slice(0, 3).map(skill => 
        typeof skill === 'object' && skill?.name ? skill.name : String(skill)
      ).filter(Boolean);
    } catch (error) {
      console.error("Error getting top skills:", error);
      return [];
    }
  };

  const getRelevantExperience = () => {
    try {
      if (!profile?.experience || !Array.isArray(profile.experience)) return [];
      return profile.experience.filter(exp => 
        resumeData.selectedExperience.length === 0 || 
        resumeData.selectedExperience.includes(exp.id)
      );
    } catch (error) {
      console.error("Error getting experience:", error);
      return [];
    }
  };

  const getRelevantProjects = () => {
    try {
      if (!profile?.projects || !Array.isArray(profile.projects)) return [];
      return profile.projects.filter(project => 
        resumeData.selectedProjects.length === 0 || 
        resumeData.selectedProjects.includes(project.id)
      );
    } catch (error) {
      console.error("Error getting projects:", error);
      return [];
    }
  };

  const generateEducationSection = () => {
    try {
      // Handle nested education structure from API response
      let educationData = profile?.education;
      
      // If education is an object with nested education array, extract it
      if (educationData && typeof educationData === 'object' && !Array.isArray(educationData)) {
        educationData = (educationData as any).education || [];
      }
      
      if (!Array.isArray(educationData) || educationData.length === 0 || !educationData[0]?.degree) {
        return `Bachelor of Engineering                                                2023-2027
Your College Name
CGPA: 8.5`;
      }

      return educationData.map((edu: any) => `
${edu.degree || 'Bachelor of Engineering'}                                                ${edu.startYear || '2023'}-${edu.endYear || '2027'}
${edu.institution || 'Your College Name'}
${edu.grade ? `CGPA: ${edu.grade}` : 'CGPA: 8.5'}
      `).join('').trim();
    } catch (error) {
      console.error("Error generating education section:", error);
      return `Bachelor of Engineering                                                2023-2027
Your College Name
CGPA: 8.5`;
    }
  };

  const generateAreaOfInterest = () => {
    const interests = getTopSkills();
    return interests.length > 0 ? interests.join('\n') : 'Your area of expertise\nRelevant subject 2\nRelevant subject 3';
  };

  const generateSoftSkills = () => {
    try {
      const softSkills = Array.isArray(profile?.softSkills) ? profile.softSkills : [];
      if (softSkills.length === 0) {
        return '• Team management\n• Time management\n• Leadership';
      }
      return softSkills.map(skill => {
        const skillName = typeof skill === 'object' && skill?.name ? skill.name : String(skill);
        return `• ${skillName}`;
      }).join('\n');
    } catch (error) {
      console.error("Error generating soft skills:", error);
      return '• Team management\n• Time management\n• Leadership';
    }
  };

  const generateTechnicalSkills = () => {
    try {
      const technicalSkills = Array.isArray(profile?.technicalSkills) ? profile.technicalSkills : [];
      if (technicalSkills.length === 0) {
        return '• Programming Languages\n• Software Tools\n• Technical Frameworks';
      }
      return technicalSkills.map(skill => {
        const skillName = typeof skill === 'object' && skill?.name ? skill.name : String(skill);
        const skillLevel = typeof skill === 'object' && skill?.level ? skill.level : 'intermediate';
        return `• ${skillName} (${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)})`;
      }).join('\n');
    } catch (error) {
      console.error("Error generating technical skills:", error);
      return '• Programming Languages\n• Software Tools\n• Technical Frameworks';
    }
  };

  const extractSkillsFromJobDescription = (description: string) => {
    // Enhanced skill detection with better patterns
    const techSkillPatterns = [
      { names: ['HTML', 'HTML5'], pattern: /\bhtml\b|\bhtml5\b/i },
      { names: ['CSS', 'CSS3'], pattern: /\bcss\b|\bcss3\b/i },
      { names: ['JavaScript', 'JS'], pattern: /\bjavascript\b|\b js\b|\bjs\b/i },
      { names: ['TypeScript'], pattern: /\btypescript\b|\bts\b/i },
      { names: ['React', 'ReactJS'], pattern: /\breact\b|\breactjs\b/i },
      { names: ['Angular'], pattern: /\bangular\b/i },
      { names: ['Vue', 'Vue.js'], pattern: /\bvue\b|\bvue\.js\b/i },
      { names: ['Node.js', 'NodeJS'], pattern: /\bnode\.js\b|\bnodejs\b|\bnode\b/i },
      { names: ['Python'], pattern: /\bpython\b/i },
      { names: ['Java'], pattern: /\bjava\b/i },
      { names: ['C++'], pattern: /\bc\+\+\b|\bcpp\b/i },
      { names: ['C'], pattern: /\b c \b|\bc programming\b/i },
      { names: ['SQL'], pattern: /\bsql\b/i },
      { names: ['MongoDB'], pattern: /\bmongodb\b|\bmongo\b/i },
      { names: ['PostgreSQL'], pattern: /\bpostgresql\b|\bpostgres\b/i },
      { names: ['Express'], pattern: /\bexpress\b|\bexpress\.js\b/i },
      { names: ['PHP'], pattern: /\bphp\b/i },
      { names: ['C#'], pattern: /\bc#\b|\bc sharp\b/i },
      { names: ['Ruby'], pattern: /\bruby\b/i },
      { names: ['Docker'], pattern: /\bdocker\b/i },
      { names: ['Git'], pattern: /\bgit\b/i },
      { names: ['AWS'], pattern: /\baws\b|\bamazon web services\b/i },
      { names: ['REST API'], pattern: /\brest\b|\brestful\b|\bapi\b/i }
    ];

    const softSkillPatterns = [
      { names: ['Communication'], pattern: /\bcommunication\b|\bcommunicate\b/i },
      { names: ['Team Collaboration'], pattern: /\bteam\b|\bcollaboration\b|\bcollaborative\b/i },
      { names: ['Problem Solving'], pattern: /\bproblem solving\b|\bsolve\b|\btroubleshoot\b/i },
      { names: ['Leadership'], pattern: /\bleadership\b|\blead\b|\bmanage\b/i },
      { names: ['Time Management'], pattern: /\btime management\b|\bdeadlines\b/i },
      { names: ['Critical Thinking'], pattern: /\bcritical thinking\b|\banalytical\b/i },
      { names: ['Adaptability'], pattern: /\badaptability\b|\bflexible\b|\badapt\b/i }
    ];

    const extractedTechSkills: Array<{id: string, name: string, level: 'intermediate'}> = [];
    const extractedSoftSkills: Array<{id: string, name: string, level: 'intermediate'}> = [];

    // Extract technical skills using patterns
    techSkillPatterns.forEach(skillPattern => {
      if (skillPattern.pattern.test(description)) {
        const skillName = skillPattern.names[0]; // Use primary name
        extractedTechSkills.push({ 
          id: `auto-${skillName.toLowerCase()}`, 
          name: skillName, 
          level: 'intermediate' as const 
        });
      }
    });

    // Extract soft skills using patterns
    softSkillPatterns.forEach(skillPattern => {
      if (skillPattern.pattern.test(description)) {
        const skillName = skillPattern.names[0]; // Use primary name
        extractedSoftSkills.push({ 
          id: `auto-${skillName.toLowerCase()}`, 
          name: skillName, 
          level: 'intermediate' as const 
        });
      }
    });

    return { techSkills: extractedTechSkills, softSkills: extractedSoftSkills };
  };

  const generateResumeContent = (): string => {
    try {
      if (!profile) {
        return "Profile data not found. Please create your profile first.";
      }

      // Extract skills from job description
      const extractedSkills = resumeData.jobDescription ? 
        extractSkillsFromJobDescription(resumeData.jobDescription) : 
        { techSkills: [], softSkills: [] };

      // Enhanced career objective generation with better skill detection
      const generateObjective = () => {
        if (resumeData.customObjective && resumeData.customObjective.trim()) {
          return resumeData.customObjective;
        }

        const targetCompany = resumeData.targetCompany || 'a leading organization';
        const jobTitle = resumeData.jobTitle || 'Software Developer';
        const jobDescription = resumeData.jobDescription || '';
        
        // Enhanced skill extraction with multiple sources
        const extractAllSkills = () => {
          const skillSet = new Set<string>();
          
          // Extract from profile technical skills
          if (profile?.technicalSkills && Array.isArray(profile.technicalSkills)) {
            profile.technicalSkills.forEach(skill => {
              const name = typeof skill === 'object' && skill?.name ? skill.name : String(skill);
              if (name && name.trim()) skillSet.add(name.trim());
            });
          }
          
          // Extract from profile hard skills
          if (profile?.hardSkills && Array.isArray(profile.hardSkills)) {
            profile.hardSkills.forEach(skill => {
              const name = typeof skill === 'object' && skill?.name ? skill.name : String(skill);
              if (name && name.trim()) skillSet.add(name.trim());
            });
          }
          
          // Extract from profile soft skills
          if (profile?.softSkills && Array.isArray(profile.softSkills)) {
            profile.softSkills.forEach(skill => {
              const name = typeof skill === 'object' && skill?.name ? skill.name : String(skill);
              if (name && name.trim()) skillSet.add(name.trim());
            });
          }
          
          // Extract from job description - this should be the primary source
          if (jobDescription) {
            const jobSkills = extractedSkills.techSkills || [];
            jobSkills.forEach(skill => {
              const name = typeof skill === 'object' && skill?.name ? skill.name : String(skill);
              if (name && name.trim()) skillSet.add(name.trim());
            });
            
            // Debug output for skill extraction
            console.log('=== SKILL EXTRACTION DEBUG ===');
            console.log('Job Description:', jobDescription);
            console.log('Extracted Skills from Job:', jobSkills);
            console.log('All Skills in Set:', Array.from(skillSet));
          }
          
          return Array.from(skillSet);
        };
        
        const allSkills = extractAllSkills();
        
        // Prioritize skills based on job description relevance
        const getRelevantSkills = () => {
          // If we have a job description, prioritize extracted skills from it
          if (jobDescription && jobDescription.trim()) {
            const jobExtractedSkills = extractedSkills.techSkills || [];
            const jobSkillNames = jobExtractedSkills.map(skill => 
              typeof skill === 'object' && skill?.name ? skill.name : String(skill)
            ).filter(name => name && name.trim());
            
            // If we extracted skills from job description, use those primarily
            if (jobSkillNames.length > 0) {
              // Add some profile skills that are also relevant to job
              const jobLower = jobDescription.toLowerCase();
              const profileRelevantSkills = allSkills.filter(skill => 
                jobLower.includes(skill.toLowerCase()) && !jobSkillNames.includes(skill)
              );
              
              // Combine job-extracted skills with relevant profile skills
              const combinedSkills = [...jobSkillNames, ...profileRelevantSkills];
              return combinedSkills.slice(0, 3);
            }
          }
          
          // Fallback to profile skills if no job description or no skills extracted
          return allSkills.slice(0, 3);
        };
        
        const relevantSkills = getRelevantSkills();
        const skillsText = relevantSkills.length > 0 ? relevantSkills.join(', ') : 'cutting-edge technologies';
        
        // Generate dynamic career objective using current industry trends
        let dynamicObjective = '';
        try {
          dynamicObjective = dynamicSkillsGenerator.generateDynamicObjective(profile, jobTitle, jobDescription);
        } catch (error) {
          console.error('Error generating dynamic objective:', error);
          // Fallback to enhanced objective with current skills
          dynamicObjective = `Dedicated ${jobTitle} seeking to leverage expertise in ${skillsText} and emerging technologies to drive innovation at ${targetCompany}. Committed to delivering high-impact solutions through continuous learning and technical excellence.`;
        }
        
        // Generate unique objectives based on different approaches including the dynamic one
        const objectiveVariations = [
          // Dynamic AI-generated objective (primary)
          dynamicObjective,
          
          // Innovation focused
          `Motivated ${jobTitle} seeking to drive innovation at ${targetCompany} through expertise in ${skillsText} and cutting-edge technologies like AI collaboration, cloud computing, and data-driven development. Committed to developing scalable solutions that deliver measurable business impact.`,
          
          // Results focused with trending skills
          `Results-oriented professional pursuing ${jobTitle} opportunities at ${targetCompany} to leverage ${skillsText} proficiency alongside emerging technologies including machine learning, DevSecOps, and real-time analytics. Dedicated to creating efficient solutions through collaborative development and continuous improvement.`,
          
          // Growth focused with industry trends
          `Ambitious ${jobTitle} candidate eager to contribute to ${targetCompany}'s technological advancement using ${skillsText} expertise while embracing next-generation technologies like edge computing, quantum computing applications, and advanced AI systems. Passionate about learning emerging technologies and delivering high-quality software solutions.`,
          
          // Problem-solving focused with modern skills
          `Detail-oriented ${jobTitle} aspiring to solve complex challenges at ${targetCompany} through ${skillsText} mastery and modern development practices including zero-trust security, infrastructure as code, and intelligent automation. Focused on building robust applications while maintaining code quality and performance standards.`
        ];
        
        // Select variation based on context
        let selectedIndex = 0;
        
        if (jobDescription) {
          const jobLower = jobDescription.toLowerCase();
          if (jobLower.includes('senior') || jobLower.includes('lead') || jobLower.includes('manage')) {
            selectedIndex = 4; // Leadership focused
          } else if (jobLower.includes('problem') || jobLower.includes('solve') || jobLower.includes('debug')) {
            selectedIndex = 3; // Problem-solving focused
          } else if (jobLower.includes('results') || jobLower.includes('impact') || jobLower.includes('performance')) {
            selectedIndex = 1; // Results focused
          } else if (jobLower.includes('growth') || jobLower.includes('learn') || jobLower.includes('develop')) {
            selectedIndex = 2; // Growth focused
          }
        } else {
          // Use a pseudo-random selection based on profile data for consistency
          const hashInput = (profile?.fullName || '') + (profile?.email || '');
          selectedIndex = hashInput.length % objectiveVariations.length;
        }
        
        return objectiveVariations[selectedIndex];
      };

      // Format education with proper right alignment for years
      const formatEducation = () => {
        const educationData = profile?.education;
        if (!educationData || !Array.isArray(educationData) || educationData.length === 0) {
          const degree = "B.Tech, Information Technology";
          const years = "2023-2027";
          const targetWidth = 65;
          const spacesNeeded = Math.max(1, targetWidth - degree.length - years.length);
          const spacing = " ".repeat(spacesNeeded);
          
          return `${degree}${spacing}${years}
M. Kumarasamy College of Engineering
CGPA: 8.2/10`;
        }

        return educationData.map(edu => {
          const degree = edu.degree || "Bachelor's Degree";
          const institution = edu.institution || "University Name";
          const startYear = edu.startYear || new Date().getFullYear() - 4;
          const endYear = edu.endYear || new Date().getFullYear();
          const grade = edu.grade ? `CGPA: ${edu.grade}` : "CGPA: 8.5";
          const years = `${startYear}-${endYear}`;
          
          // Calculate proper spacing for right alignment of years
          const targetWidth = 65;
          const spacesNeeded = Math.max(1, targetWidth - degree.length - years.length);
          const spacing = " ".repeat(spacesNeeded);
          
          return `${degree}${spacing}${years}
${institution}
${grade}`;
        }).join('\n\n');
      };

      // Format areas of interest based on job requirements
      const formatAreasOfInterest = () => {
        const interests = profile?.areasOfInterest;
        const jobDescription = resumeData.jobDescription || '';
        
        // Convert interests to array if it's a string
        const interestsArray = Array.isArray(interests) ? interests : 
          (typeof interests === 'string' ? interests.split(',').map(s => s.trim()).filter(Boolean) : []);
        
        if (interestsArray && interestsArray.length > 0) {
          // Filter interests relevant to job if job description provided
          if (jobDescription) {
            const jobKeywords = jobDescription.toLowerCase();
            const relevantInterests = interestsArray.filter((interest: string) => 
              jobKeywords.includes(interest.toLowerCase()) ||
              interest.toLowerCase().includes('development') ||
              interest.toLowerCase().includes('technology')
            );
            return relevantInterests.length > 0 ? relevantInterests.join(', ') : interestsArray.slice(0, 3).join(', ');
          }
          return interestsArray.slice(0, 3).join(', ');
        }
        
        // Generate default interests based on job description
        if (jobDescription.toLowerCase().includes('software') || jobDescription.toLowerCase().includes('developer')) {
          return "Software Development, System Design, Code Optimization";
        } else if (jobDescription.toLowerCase().includes('data') || jobDescription.toLowerCase().includes('analytics')) {
          return "Data Analysis, Machine Learning, Statistical Modeling";
        } else if (jobDescription.toLowerCase().includes('web') || jobDescription.toLowerCase().includes('frontend')) {
          return "Web Development, User Experience, Frontend Technologies";
        }
        
        return "Technology Innovation, Problem Solving, Continuous Learning";
      };

      // Enhanced soft skills extraction from job description and extracted skills
      const formatSoftSkills = () => {
        const profileSoftSkills = profile?.softSkills || [];
        const jobDescription = resumeData.jobDescription || '';
        
        // Get soft skills extracted from job description using our pattern matching
        const extractedSoftSkills = extractedSkills.softSkills || [];
        const extractedSoftSkillNames = extractedSoftSkills.map(skill => 
          typeof skill === 'object' && skill?.name ? skill.name : String(skill)
        ).filter(name => name && name.trim());
        
        // Enhanced job-relevant soft skills detection
        const getJobRelevantSoftSkills = () => {
          const jobLower = jobDescription.toLowerCase();
          const jobRelevantSkills: string[] = [];
          
          // Frontend/UI specific soft skills
          if (jobLower.includes('user interface') || jobLower.includes('ui') || jobLower.includes('ux') || jobLower.includes('user experience')) {
            jobRelevantSkills.push('User-Centered Design', 'Attention to Detail');
          }
          if (jobLower.includes('maintains') || jobLower.includes('maintenance') || jobLower.includes('maintain')) {
            jobRelevantSkills.push('Code Maintenance', 'Quality Assurance');
          }
          if (jobLower.includes('builds') || jobLower.includes('building') || jobLower.includes('develop')) {
            jobRelevantSkills.push('Problem Solving', 'Creative Thinking');
          }
          if (jobLower.includes('web applications') || jobLower.includes('websites') || jobLower.includes('web')) {
            jobRelevantSkills.push('Technical Communication', 'Cross-Browser Compatibility');
          }
          if (jobLower.includes('frameworks') || jobLower.includes('react') || jobLower.includes('angular')) {
            jobRelevantSkills.push('Adaptability', 'Continuous Learning');
          }
          
          // General soft skill detection
          if (jobLower.includes('team') || jobLower.includes('collaborate') || jobLower.includes('group')) {
            jobRelevantSkills.push('Team Collaboration', 'Interpersonal Communication');
          }
          if (jobLower.includes('lead') || jobLower.includes('manage') || jobLower.includes('supervise')) {
            jobRelevantSkills.push('Leadership', 'Management Skills');
          }
          if (jobLower.includes('problem') || jobLower.includes('solve') || jobLower.includes('troubleshoot')) {
            jobRelevantSkills.push('Problem Solving', 'Analytical Thinking');
          }
          if (jobLower.includes('communication') || jobLower.includes('present') || jobLower.includes('client')) {
            jobRelevantSkills.push('Communication', 'Presentation Skills');
          }
          if (jobLower.includes('creative') || jobLower.includes('innovative') || jobLower.includes('design')) {
            jobRelevantSkills.push('Creativity', 'Innovation');
          }
          if (jobLower.includes('adapt') || jobLower.includes('flexible') || jobLower.includes('change')) {
            jobRelevantSkills.push('Adaptability', 'Flexibility');
          }
          if (jobLower.includes('detail') || jobLower.includes('accurate') || jobLower.includes('quality')) {
            jobRelevantSkills.push('Attention to Detail', 'Quality Focus');
          }
          if (jobLower.includes('time') || jobLower.includes('deadline') || jobLower.includes('priority')) {
            jobRelevantSkills.push('Time Management', 'Prioritization');
          }
          
          return Array.from(new Set(jobRelevantSkills)); // Remove duplicates
        };
        
        let finalSkills: string[] = [];
        
        // Priority 1: Skills extracted from job description using pattern matching
        if (extractedSoftSkillNames.length > 0) {
          finalSkills.push(...extractedSoftSkillNames);
        }
        
        // Priority 2: Job-relevant skills based on keywords
        if (jobDescription) {
          const jobRelevantSkills = getJobRelevantSoftSkills();
          jobRelevantSkills.forEach(skill => {
            if (!finalSkills.includes(skill) && finalSkills.length < 6) {
              finalSkills.push(skill);
            }
          });
        }
        
        // Priority 3: Add existing profile skills that aren't duplicates
        if (profileSoftSkills.length > 0 && finalSkills.length < 5) {
          const existingSkills = profileSoftSkills.map(skill => 
            typeof skill === 'object' && skill?.name ? skill.name : String(skill)
          );
          
          existingSkills.forEach(skill => {
            if (!finalSkills.includes(skill) && finalSkills.length < 5) {
              finalSkills.push(skill);
            }
          });
        }
        
        // Fallback: Default skills if nothing else
        if (finalSkills.length === 0) {
          finalSkills = ['Communication', 'Problem Solving', 'Team Collaboration', 'Time Management', 'Adaptability'];
        }
        
        // Ensure we have at least 4-5 skills
        const defaultSkills = ['Communication', 'Problem Solving', 'Team Collaboration', 'Time Management', 'Adaptability', 'Creative Thinking'];
        defaultSkills.forEach(skill => {
          if (!finalSkills.includes(skill) && finalSkills.length < 5) {
            finalSkills.push(skill);
          }
        });
        
        return finalSkills.slice(0, 5).map(skill => `•     ${skill}`).join('\n');
      };

      // Format technical/hard skills relevant to job
      const formatTechnicalSkills = () => {
        const techSkills = profile?.technicalSkills || [];
        const hardSkills = profile?.hardSkills || [];
        const jobDescription = resumeData.jobDescription || '';
        
        // Combine all technical skills
        const allTechSkills = [...techSkills, ...hardSkills, ...extractedSkills.techSkills];
        
        // Extract job-relevant technical skills with duplicate prevention
        const getJobRelevantTechSkills = () => {
          const jobLower = jobDescription.toLowerCase();
          const jobTechSkills: Array<{name: string, level: string}> = [];
          const addedSkills = new Set<string>();
          
          // Common programming languages and technologies
          const techKeywords = {
            'JavaScript': ['javascript', 'js', 'node', 'react', 'angular', 'vue'],
            'Python': ['python', 'django', 'flask', 'pandas', 'numpy'],
            'Java': ['java', 'spring', 'hibernate'],
            'C++': ['c++', 'cpp'],
            'C': ['c programming'],
            'SQL': ['sql', 'mysql', 'postgresql', 'database'],
            'HTML': ['html', 'html5'],
            'CSS': ['css', 'css3', 'styling'],
            'React': ['react', 'reactjs'],
            'Node.js': ['node', 'nodejs', 'express'],
            'Git': ['git', 'github', 'version control'],
            'AWS': ['aws', 'amazon web services', 'cloud'],
            'Docker': ['docker', 'container'],
            'Machine Learning': ['ml', 'machine learning', 'ai', 'tensorflow'],
            'API Development': ['api', 'rest', 'restful']
          };
          
          Object.entries(techKeywords).forEach(([skill, keywords]) => {
            if (keywords.some(keyword => jobLower.includes(keyword)) && !addedSkills.has(skill.toLowerCase())) {
              jobTechSkills.push({ name: skill, level: 'intermediate' });
              addedSkills.add(skill.toLowerCase());
            }
          });
          
          return jobTechSkills;
        };
        
        let relevantSkills: any[] = [];
        
        if (allTechSkills.length > 0) {
          // Use existing skills, prioritize job-relevant ones
          const jobRelevant = getJobRelevantTechSkills();
          const jobRelevantNames = jobRelevant.map(s => s.name.toLowerCase());
          
          // Add existing skills that match job requirements first
          allTechSkills.forEach(skill => {
            const skillName = typeof skill === 'object' && skill?.name ? skill.name : String(skill);
            if (jobRelevantNames.includes(skillName.toLowerCase()) && relevantSkills.length < 7) {
              relevantSkills.push(skill);
            }
          });
          
          // Add remaining existing skills
          allTechSkills.forEach(skill => {
            const skillName = typeof skill === 'object' && skill?.name ? skill.name : String(skill);
            if (!relevantSkills.some(s => {
              const existingName = typeof s === 'object' && s?.name ? s.name : String(s);
              return existingName.toLowerCase() === skillName.toLowerCase();
            }) && relevantSkills.length < 7) {
              relevantSkills.push(skill);
            }
          });
        } else {
          // Generate job-relevant technical skills
          relevantSkills = getJobRelevantTechSkills();
          if (relevantSkills.length === 0) {
            relevantSkills = [
              { name: 'Programming', level: 'intermediate' },
              { name: 'Problem Solving', level: 'advanced' },
              { name: 'Software Development', level: 'intermediate' }
            ];
          }
        }
        
        return relevantSkills.slice(0, 7).map(skill => {
          const skillName = typeof skill === 'object' && skill?.name ? skill.name : String(skill);
          const skillLevel = typeof skill === 'object' && skill?.level ? 
            skill.level.charAt(0).toUpperCase() + skill.level.slice(1) : 'Intermediate';
          return `•     ${skillName}(${skillLevel})`;
        }).join('\n');
      };

      // Format projects
      const formatProjects = () => {
        const projects = getRelevantProjects();
        if (projects.length === 0) return '';
        
        return projects.map(project => `Title: ${project.name}
Softwares used: ${project.technologies?.join(', ') || 'Various technologies'}
Description: ${project.description}`).join('\n\n');
      };

      // Format awards
      const formatAwards = () => {
        const awards = profile?.awards || [];
        if (awards.length === 0) return '';
        
        return awards.map(award => 
          `•    Secured first place in ${award.name} held at "${award.description || 'institution'}" during the year ${award.year}.`
        ).join('\n');
      };

      // Format certifications
      const formatCertifications = () => {
        const certs = profile?.certifications || [];
        if (certs.length === 0) return '';
        
        return certs.map(cert => `Certified in ${cert.name}`).join('\n');
      };

      // Format co-curricular activities
      const formatActivities = () => {
        const activities = profile?.extracurricularActivities || [];
        // Convert to array if it's a string
        const activitiesArray = Array.isArray(activities) ? activities : 
          (typeof activities === 'string' ? activities.split(',').map(s => s.trim()).filter(Boolean) : []);
        
        if (activitiesArray.length === 0) return '';
        
        return activitiesArray.map((activity: string) => `•    ${activity}`).join('\n');
      };

      // Format volunteer experience with justified descriptions
      const formatVolunteerWork = () => {
        const volunteerWork = profile?.volunteerWork || [];
        if (volunteerWork.length === 0) return '';
        
        return volunteerWork.map(work => 
          `•    ${work.role} at ${work.organization}
     ${work.description}`
        ).join('\n');
      };

      // Format experience section with bold titles
      const formatExperience = () => {
        const experiences = profile?.experience || [];
        if (experiences.length === 0) return '';
        
        return experiences.map(exp => {
          const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Start Date';
          const endDate = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'End Date');
          
          // Title with proper spacing for right alignment
          const titleCompany = `${exp.title} at ${exp.company}`;
          const dateRange = `${startDate} - ${endDate}`;
          const targetWidth = 65;
          const spacesNeeded = Math.max(1, targetWidth - titleCompany.length - dateRange.length);
          const spacing = " ".repeat(spacesNeeded);
          
          // Clean description to remove unwanted line breaks and extra spaces
          const cleanDescription = exp.description.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
          
          return `${titleCompany}${spacing}${dateRange}
${cleanDescription}`;
        }).join('\n');
      };

      // Build the complete resume following exact template structure
      // Name should be LEFT-aligned at the top
      
      let resume = `${profile?.fullName || "Priya"}
${profile?.phone || "+91 9125637834"}
${profile?.email || "priya@gmail.com"}
${profile?.linkedinUrl ? `Linkedin: ${profile.linkedinUrl}` : "Linkedin:"}
${profile?.githubUrl ? `Github id: ${profile.githubUrl}` : "Github id:"}

Career Objective:
${generateObjective()}

Educational Qualification:
${formatEducation()}`;

      // Add experience section if available with proper spacing
      const experienceContent = formatExperience();
      if (experienceContent) {
        resume += `\n\nExperience:

${experienceContent}`;
      }

      resume += `\n\nArea of Interest:
${formatAreasOfInterest()}

Skill Set:
Soft Skill:
${formatSoftSkills()}

Technical skill:
${formatTechnicalSkills()}`;

      // Add optional sections
      const projectsContent = formatProjects();
      if (projectsContent) {
        resume += `\n\nProjects Done:
${projectsContent}`;
      }

      const awardsContent = formatAwards();
      if (awardsContent) {
        resume += `\n\nAwards and Achievements:
${awardsContent}`;
      }

      const activitiesContent = formatActivities();
      if (activitiesContent) {
        resume += `\n\nCo-Curricular Activities:
${activitiesContent}`;
      }

      const certificationsContent = formatCertifications();
      if (certificationsContent) {
        resume += `\n\nCertifications:
${certificationsContent}`;
      }

      const volunteerContent = formatVolunteerWork();
      if (volunteerContent) {
        resume += `\n\nVolunteer Experience:
${volunteerContent}`;
      }

      // Personal details with proper alignment
      const currentDate = new Date().toLocaleDateString('en-GB');
      const placeName = profile?.place || '[Place]';
      const fullName = profile?.fullName || '[Name]';
      const placeSignatureLine = `Place: ${placeName}`;
      const targetWidth = 65;
      const spacesForSignature = Math.max(1, targetWidth - placeSignatureLine.length - fullName.length);
      const signatureSpacing = " ".repeat(spacesForSignature);
      
      resume += `\n\nPersonal Details:
${profile?.fatherName ? `Father's name: ${profile.fatherName}` : "Father's name:"}
${profile?.motherName ? `Mother's name: ${profile.motherName}` : "Mother's name:"}
${profile?.hobbies ? `Hobbies: ${Array.isArray(profile.hobbies) ? (profile.hobbies as string[]).join(', ') : profile.hobbies}` : "Hobbies:"}
${profile?.address || "Address:"}

Date: ${currentDate}
${placeSignatureLine}${signatureSpacing}${fullName}`;

      // END OF RESUME - no additional content should be added after this point
      return resume;
    } catch (error) {
      console.error("Error generating resume content:", error);
      return "Error generating resume content. Please try again.";
    }
  };

  const getProfileCompleteness = () => {
    if (!profile) return { percentage: 0, missing: ['Complete profile'], completed: [] };
    
    const checks = [
      { field: 'Full Name', value: profile.fullName },
      { field: 'Email', value: profile.email },
      { field: 'Phone', value: profile.phone },
      { field: 'Education', value: profile.education && profile.education.length > 0 },
      { field: 'Skills', value: (profile.technicalSkills && profile.technicalSkills.length > 0) || (profile.softSkills && profile.softSkills.length > 0) }
    ];
    
    const completed = checks.filter(check => check.value && (typeof check.value === 'string' ? check.value.trim() !== '' : check.value));
    const missing = checks.filter(check => !check.value || (typeof check.value === 'string' && check.value.trim() === '')).map(check => check.field);
    
    return {
      percentage: Math.round((completed.length / checks.length) * 100),
      missing,
      completed: completed.map(c => c.field)
    };
  };

  const formatResumeForDisplay = (resumeText: string): string => {
    const lines = resumeText.split('\n');
    let formattedHtml = '';
    let inExperienceSection = false;
    let inVolunteerSection = false;
    let inEducationSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if we're entering education section
      if (line.trim() === 'Educational Qualification:') {
        inEducationSection = true;
        inExperienceSection = false;
        inVolunteerSection = false;
        formattedHtml += `<div style="white-space: pre-line;">${line}</div>`;
        continue;
      }
      
      // Check if we're entering experience section
      if (line.trim() === 'Experience:') {
        inExperienceSection = true;
        inVolunteerSection = false;
        inEducationSection = false;
        formattedHtml += `<div style="white-space: pre-line;">${line}</div>`;
        continue;
      }
      
      // Check if we're entering volunteer section
      if (line.includes('Volunteer Experience:') || line.includes('Social Activities:')) {
        inVolunteerSection = true;
        inExperienceSection = false;
        inEducationSection = false;
        formattedHtml += `<div style="white-space: pre-line;">${line}</div>`;
        continue;
      }
      
      // Check if we're leaving these sections
      if (line.trim().endsWith(':') && !line.includes('at ') && line.trim() !== 'Experience:' && !line.includes('Volunteer') && line.trim() !== 'Educational Qualification:') {
        inExperienceSection = false;
        inVolunteerSection = false;
        inEducationSection = false;
      }
      
      // Handle education lines with right alignment for years
      if (inEducationSection && line.includes('-') && (line.includes('2023') || line.includes('2024') || line.includes('2025') || line.includes('2026') || line.includes('2027'))) {
        // Split the line to get degree and year parts
        const parts = line.split(/\s{2,}/); // Split on multiple spaces
        if (parts.length >= 2) {
          const degree = parts[0].trim();
          const year = parts[parts.length - 1].trim();
          formattedHtml += `<div style="display: flex; justify-content: space-between; white-space: pre-line;"><span>${degree}</span><span>${year}</span></div>`;
          continue;
        }
      }
      
      // Handle experience titles with right alignment for dates
      if (inExperienceSection && line.includes(' at ') && !line.startsWith('•') && !line.startsWith('     ')) {
        // Split the line to get title and date parts
        const parts = line.split(/\s{2,}/); // Split on multiple spaces
        if (parts.length >= 2) {
          const titleCompany = parts[0].trim();
          const dateRange = parts[parts.length - 1].trim();
          formattedHtml += `<div style="display: flex; justify-content: space-between; white-space: pre-line; font-weight: bold;"><span>${titleCompany}</span><span>${dateRange}</span></div>`;
          continue;
        } else {
          formattedHtml += `<div style="white-space: pre-line; font-weight: bold;">${line}</div>`;
          continue;
        }
      }
      
      // Handle signature line with right alignment
      if (line.includes('Place:') && line.includes(profile?.fullName || '')) {
        const parts = line.split(/\s{2,}/); // Split on multiple spaces
        if (parts.length >= 2) {
          const place = parts[0].trim();
          const name = parts[parts.length - 1].trim();
          formattedHtml += `<div style="display: flex; justify-content: space-between; white-space: pre-line;"><span>${place}</span><span>${name}</span></div>`;
          continue;
        }
      }
      
      // Format experience descriptions with justification - continuous paragraph without spaces
      if (inExperienceSection && line.trim() && !line.includes(' at ') && !line.trim().endsWith(':') && !line.startsWith('•')) {
        formattedHtml += `<p style="text-align: justify; text-justify: inter-word; hyphens: auto; word-spacing: 0.05em; line-height: 1.4; margin: 0; padding: 0; margin-bottom: 0;">${line.trim()}</p>`;
        continue;
      }
      
      // Format volunteer descriptions with justification - continuous paragraph
      if (inVolunteerSection && line.trim().startsWith('     ')) {
        const description = line.substring(5); // Remove the 5 leading spaces
        formattedHtml += `<div style="text-align: justify; text-justify: inter-word; hyphens: auto; word-spacing: 0.1em; line-height: 1.5; margin: 0; padding: 0; margin-left: 2em;">${description}</div>`;
        continue;
      }
      
      // Default formatting for other lines
      formattedHtml += `<div style="white-space: pre-line;">${line}</div>`;
    }
    
    return formattedHtml;
  };

  const validateProfileData = () => {
    const issues = [];
    
    if (!profile) {
      issues.push("Profile not found");
    } else {
      if (!profile.fullName || profile.fullName.trim() === '') {
        issues.push("Full name is required");
      }
      if (!profile.email || profile.email.trim() === '') {
        issues.push("Email is required");
      }
    }
    
    return issues;
  };

  const generateTailoredResume = async () => {
    const validationIssues = validateProfileData();
    
    if (validationIssues.length > 0) {
      toast({
        title: "Profile Incomplete",
        description: `Please complete your profile: ${validationIssues.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const tailoredResume = generateResumeContent();
      
      // Check if resume generation returned an error message
      if (tailoredResume.includes("Error generating") || tailoredResume.includes("Profile data not found")) {
        throw new Error(tailoredResume);
      }
      
      setGeneratedResume(tailoredResume);
      setShowPreview(true);
      
      toast({
        title: "Resume Generated",
        description: "Your tailored resume has been created successfully!",
      });
    } catch (error) {
      console.error("Resume generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Please ensure your profile has all required information',
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!profile) {
      toast({
        title: "Profile Required",
        description: "Please create a profile first to generate your resume.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Use the same generateResumeContent function that powers the preview
      const resumeContent = generateResumeContent();
      const lines = resumeContent.split('\n').filter(line => line.trim());
      
      const children = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (!line) continue;
        
        // Check if this is a section header (bold)
        const isSectionHeader = [
          'Career Objective:', 'Educational Qualification:', 'Area of Interest:',
          'Skill Set:', 'Soft Skill:', 'Technical skill:', 'Projects Done:',
          'Awards and Achievements:', 'Co-Curricular Activities:', 'Certifications:',
          'Volunteer Experience:', 'Personal Details:', 'Experience:'
        ].some(header => line.includes(header));
        
        // Check if this is an experience title (should be bold)
        const isExperienceTitle = line.includes(' at ') && !line.startsWith('•') && 
          (line.includes('Jan ') || line.includes('Feb ') || line.includes('Mar ') || 
           line.includes('Apr ') || line.includes('May ') || line.includes('Jun ') ||
           line.includes('Jul ') || line.includes('Aug ') || line.includes('Sep ') ||
           line.includes('Oct ') || line.includes('Nov ') || line.includes('Dec ') ||
           line.includes('Present'));
        
        // Check if this line contains "Place:" - should maintain its formatting
        const isPlaceLine = line.includes('Place:');
        
        // Check if this is an education line with year (should be right-aligned)
        const isEducationWithYear = line.includes('-') && 
          (line.includes('B.Tech') || line.includes('Bachelor') || line.includes('Master') || line.includes('Degree')) &&
          /\d{4}-\d{4}/.test(line);
        
        // Check if this is an experience title with dates (should be right-aligned)
        const isExperienceTitleWithDate = isExperienceTitle && 
          (line.includes('Jan ') || line.includes('Feb ') || line.includes('Mar ') || 
           line.includes('Apr ') || line.includes('May ') || line.includes('Jun ') ||
           line.includes('Jul ') || line.includes('Aug ') || line.includes('Sep ') ||
           line.includes('Oct ') || line.includes('Nov ') || line.includes('Dec ') ||
           line.includes('Present'));
        
        // Handle experience descriptions with justified alignment
        const isExperienceDescription = i > 0 && 
          lines[i-1].includes(' at ') && !line.includes(' at ') && 
          !line.startsWith('•') && !line.trim().endsWith(':');

        // Handle lines that need right alignment using tabs
        if (isEducationWithYear || isExperienceTitleWithDate || isPlaceLine) {
          // Split the line to get left and right parts
          const parts = line.split(/\s{2,}/); // Split on multiple spaces
          if (parts.length >= 2) {
            const leftPart = parts[0].trim();
            const rightPart = parts[parts.length - 1].trim();
            
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: leftPart,
                    bold: isSectionHeader || isExperienceTitle,
                    font: "Times New Roman",
                    size: 22,
                  }),
                  new TextRun({
                    text: "\t",
                    font: "Times New Roman",
                    size: 22,
                  }),
                  new TextRun({
                    text: rightPart,
                    bold: isSectionHeader || isExperienceTitle,
                    font: "Times New Roman",
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.LEFT,
                tabStops: [
                  {
                    type: TabStopType.RIGHT,
                    position: 9000, // Right tab stop position
                  },
                ],
              })
            );
            continue;
          }
        }

        // Clean up excessive spaces in text, especially for experience descriptions
        const cleanedText = line.replace(/\s+/g, ' ').trim();
        
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cleanedText,
                bold: isSectionHeader || isExperienceTitle,
                font: "Times New Roman",
                size: 22,
              }),
            ],
            alignment: isExperienceDescription ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
            spacing: isExperienceDescription ? { after: 0 } : (isSectionHeader ? { before: 200, after: 100 } : { after: 50 }),
          })
        );
      }

      // IMPORTANT: No additional content should be added to Word document
      // The resume content from generateResumeContent() is complete

      // Create the document with proper margins
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: "1in",
                right: "1in",
                bottom: "1in", 
                left: "1in",
              },
            },
          },
          children: children
        }]
      });

      // Generate and download the document
      const blob = await Packer.toBlob(doc);
      const fileName = `${profile?.fullName?.replace(/\s+/g, '_') || 'Resume'}_${resumeData.targetCompany || 'Professional'}.docx`;
      
      // Check if we're on a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 1000);
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
      
      toast({
        title: "Download Started",
        description: "Your resume is being downloaded as a Word document.",
      });
    } catch (error) {
      console.error("Word document generation error:", error);
      toast({
        title: "Download Failed",
        description: `Error creating Word document: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume Creator
            </CardTitle>
            <CardDescription>
              Create a professional resume tailored to your target job.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No profile found. Please create a profile first to generate your resume.
              </p>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Create Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profileCompleteness = getProfileCompleteness();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Profile Completeness Indicator */}
      <Card className={`border-l-4 ${profileCompleteness.percentage >= 80 ? 'border-l-green-500' : profileCompleteness.percentage >= 40 ? 'border-l-yellow-500' : 'border-l-red-500'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle className="text-lg">Profile Completeness</CardTitle>
              <Badge variant={profileCompleteness.percentage >= 80 ? "default" : "secondary"}>
                {profileCompleteness.percentage}%
              </Badge>
            </div>
            {profileCompleteness.percentage >= 80 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
          </div>
        </CardHeader>
        {profileCompleteness.percentage < 80 && (
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Missing:</span>
              {profileCompleteness.missing.map((field) => (
                <Badge key={field} variant="outline" className="text-xs">
                  {field}
                </Badge>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => window.location.href = '/dashboard'}
            >
              Complete Profile
            </Button>
          </CardContent>
        )}
      </Card>

      <Card className="morph-card relative overflow-hidden">
        <div className="particles">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        <CardHeader className="animate-fade-in-up relative z-10">
          <CardTitle className="flex items-center gap-3 gradient-text-purple text-2xl font-bold">
            <Sparkles className="h-6 w-6 text-purple-600 animate-float" />
            <span className="typewriter">AI-Powered Resume Creator</span>
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Generate a professional resume tailored to your target company with intelligent content optimization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger-animation">
            <div className="space-y-6">
              <div className="form-field">
                <Input
                  id="targetCompany"
                  placeholder=" "
                  value={resumeData.targetCompany}
                  onChange={(e) => setResumeData(prev => ({ ...prev, targetCompany: e.target.value }))}
                  className="input-modern peer"
                />
                <Label htmlFor="targetCompany" className="peer-focus:gradient-text-blue">Target Company</Label>
              </div>
              
              <div className="form-field">
                <Input
                  id="jobTitle"
                  placeholder=" "
                  value={resumeData.jobTitle}
                  onChange={(e) => setResumeData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="input-modern peer"
                />
                <Label htmlFor="jobTitle" className="peer-focus:gradient-text-blue">Job Title</Label>
              </div>
              
              <div>
                <Label htmlFor="template" className="gradient-text font-medium">Resume Template</Label>
                <Select value={resumeData.template} onValueChange={(value) => setResumeData(prev => ({ ...prev, template: value }))}>
                  <SelectTrigger className="morph-card border-2 hover:border-primary/50 transition-all duration-300">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent className="morph-card">
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id} className="hover:bg-primary/10">
                        <div className="flex flex-col">
                          <span className="font-medium">{template.name}</span>
                          <span className="text-sm text-muted-foreground">{template.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="jobDescription" className="gradient-text font-medium">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description here to tailor your resume..."
                  value={resumeData.jobDescription}
                  onChange={(e) => setResumeData(prev => ({ ...prev, jobDescription: e.target.value }))}
                  rows={8}
                  className="input-modern resize-none min-h-[200px] transition-all duration-300 hover:shadow-md focus:shadow-lg"
                />
              </div>
            </div>
          </div>
          
          <div className="animate-fade-in-up">
            <Label htmlFor="customObjective" className="gradient-text font-medium">Custom Career Objective (Optional)</Label>
            <Textarea
              id="customObjective"
              placeholder="Write a custom career objective or leave empty for AI-generated one..."
              value={resumeData.customObjective}
              onChange={(e) => setResumeData(prev => ({ ...prev, customObjective: e.target.value }))}
              rows={4}
              className="input-modern resize-none transition-all duration-300 hover:shadow-md focus:shadow-lg mt-2"
            />
          </div>
          
          <div className="flex gap-6 animate-slide-in">
            <Button 
              onClick={generateTailoredResume} 
              disabled={isGenerating}
              className="flex-1 btn-interactive bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  <span className="animate-pulse">Generating Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-3 h-5 w-5 animate-float" />
                  Generate Tailored Resume
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && generatedResume && (
        <Card className="mt-8 morph-card animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-3 gradient-text-blue text-xl">
                  <Eye className="h-6 w-6 animate-float" />
                  Resume Preview
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Your generated resume based on profile data and job requirements.
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleDownload} 
                  className="btn-interactive bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button 
                  onClick={handlePrint} 
                  className="btn-interactive hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                  variant="outline"
                >
                  Print
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
              <div className="p-8 max-h-[600px] overflow-y-auto">
                <div 
                  className="resume-text text-sm leading-relaxed text-gray-800 dark:text-gray-200 animate-fade-in"
                  style={{ 
                    fontFamily: 'Times New Roman, serif',
                    lineHeight: '1.6',
                    wordSpacing: '0.1em'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatResumeForDisplay(generatedResume)
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}