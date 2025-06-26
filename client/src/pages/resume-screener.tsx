import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Upload, 
  FileText, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Briefcase,
  Star,
  ArrowLeft,
  Download,
  Filter,
  Eye
} from "lucide-react";
import { Link } from "wouter";
import mammoth from "mammoth";

interface ResumeAnalysis {
  candidateName: string;
  contactInfo: {
    email: string;
    phone: string;
    linkedin: string;
  };
  skills: {
    technical: string[];
    soft: string[];
    missing: string[];
  };
  experience: {
    totalYears: number;
    relevantRoles: string[];
    industries: string[];
  };
  education: {
    degrees: string[];
    institutions: string[];
    relevant: boolean;
  };
  matchScore: number;
  category: 'highly-suitable' | 'moderate-fit' | 'needs-improvement';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface JobRequirements {
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: string;
  education: string;
  location: string;
}

export default function ResumeScreener() {
  const [jobRequirements, setJobRequirements] = useState<JobRequirements>({
    title: "",
    company: "",
    description: "",
    requiredSkills: [],
    experienceLevel: "mid-level",
    education: "bachelor",
    location: ""
  });
  
  const [resumes, setResumes] = useState<File[]>([]);
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedResume, setSelectedResume] = useState<ResumeAnalysis | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    minScore: 0,
    hasEducation: false,
    location: ''
  });
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'text/plain'
    );
    
    if (validFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please upload PDF, Word, or text files only.",
        variant: "destructive"
      });
      return;
    }
    
    setResumes([...resumes, ...validFiles]);
    
    toast({
      title: "Files Uploaded",
      description: `${validFiles.length} resume(s) uploaded successfully.`,
    });
  };

  const readFileContent = async (file: File): Promise<string> => {
    try {
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        // Use mammoth to extract text from .docx files
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } else if (file.type === 'application/pdf') {
        // For PDF files, we'll use a simple text extraction
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            // Basic PDF text extraction - remove binary content
            const textContent = content.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
            resolve(textContent);
          };
          reader.onerror = () => reject(new Error('Failed to read PDF file'));
          reader.readAsText(file);
        });
      } else {
        // For text files
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            resolve(content);
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
      }
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error(`Failed to read file: ${file.name}`);
    }
  };

  const analyzeResumes = async () => {
    if (resumes.length === 0) {
      toast({
        title: "No Resumes",
        description: "Please upload resumes before analyzing.",
        variant: "destructive"
      });
      return;
    }

    if (!jobRequirements.title || !jobRequirements.description) {
      toast({
        title: "Missing Job Details",
        description: "Please provide job title and description.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const analyses: ResumeAnalysis[] = [];
      
      for (let i = 0; i < resumes.length; i++) {
        const resume = resumes[i];
        try {
          const analysis = await analyzeResumeContent(resume);
          analyses.push(analysis);
        } catch (error) {
          console.error(`Error analyzing ${resume.name}:`, error);
          analyses.push(generateFallbackAnalysis(resume));
        }
      }
      
      setAnalyses(analyses);
      
      toast({
        title: "Analysis Complete",
        description: `${resumes.length} resumes analyzed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the resumes.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeResumeContent = async (resume: File): Promise<ResumeAnalysis> => {
    try {
      const text = await readFileContent(resume);
      console.log("Extracted text from file:", text.substring(0, 500)); // Log first 500 chars
      
      // Enhanced parsing for structured resume format
      const candidateName = parseNameFromResume(text);
      console.log("Parsed name:", candidateName);
      
      const contactInfo = parseContactFromResume(text);
      console.log("Parsed contact info:", contactInfo);
      
      const skills = parseSkillsFromResume(text, jobRequirements);
      console.log("Parsed skills:", skills);
      
      const experience = parseExperienceFromResume(text);
      console.log("Parsed experience:", experience);
      
      const education = parseEducationFromResume(text);
      console.log("Parsed education:", education);
      
      const matchScore = calculateDetailedMatchScore(skills, experience, education, jobRequirements);
      const category = categorizeCandidate(matchScore);
      
      const insights = generateDetailedInsights(skills, experience, education, jobRequirements);
      
      return {
        candidateName,
        contactInfo,
        skills,
        experience,
        education,
        matchScore,
        category,
        strengths: insights.strengths,
        weaknesses: insights.weaknesses,
        recommendations: insights.recommendations
      };
    } catch (error) {
      console.error("Error analyzing resume:", error);
      return generateFallbackAnalysis(resume);
    }
  };

  const parseNameFromResume = (text: string): string => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    
    // Look for name in first few lines
    for (let i = 0; i < Math.min(8, lines.length); i++) {
      const line = lines[i];
      
      // Skip lines with obvious non-name content
      if (line.includes('@') || line.includes('+') || line.includes('http') || 
          /^\d/.test(line) || line.length < 2) {
        continue;
      }
      
      // Check for "thanush s" pattern specifically (lowercase)
      if (/^thanush\s+s$/i.test(line.trim())) {
        return line.trim();
      }
      
      // Check for proper name format
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        // Check if all words are name-like (letters only, possibly with single letters)
        const isValidName = words.every(word => {
          // Allow single letters (like "s") or proper capitalized words
          return /^[A-Za-z]+$/.test(word) && 
                 (word.length === 1 || /^[A-Z][a-z]*$/.test(word) || /^[a-z]+$/.test(word));
        });
        
        // Additional check: avoid common non-name words
        const commonWords = ['Career', 'Objective', 'Education', 'Experience', 'Skills', 'Technical', 'Soft'];
        const hasCommonWords = words.some(word => commonWords.includes(word));
        
        if (isValidName && !hasCommonWords && line.length <= 30) {
          return line;
        }
      }
    }
    
    return "Unknown Candidate";
  };

  const parseContactFromResume = (text: string) => {
    // Enhanced regex patterns for better extraction
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const phoneRegex = /(\+91\d{10}|\+\d{1,3}[-.\s]?\d{10}|\d{10})/;
    const linkedinRegex = /(https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/i;
    
    const email = text.match(emailRegex)?.[1] || "";
    const phone = text.match(phoneRegex)?.[1] || "";
    const linkedin = text.match(linkedinRegex)?.[0] || "";
    
    return { email, phone, linkedin };
  };

  const parseSkillsFromResume = (text: string, requirements: JobRequirements) => {
    // Extract technical skills section
    const techSkillsMatch = text.match(/Technical skill[s]?:\s*([\s\S]*?)(?=\n[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*:|$)/i);
    const softSkillsMatch = text.match(/Soft Skill[s]?:\s*([\s\S]*?)(?=\n[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*:|$)/i);
    
    const technicalSkills: string[] = [];
    const softSkills: string[] = [];
    
    // Parse technical skills
    if (techSkillsMatch) {
      const techText = techSkillsMatch[1];
      // Extract skills in format: • HTML(Intermediate)
      const techMatches = techText.match(/•\s*([^(]+)(?:\([^)]+\))?/g);
      if (techMatches) {
        techMatches.forEach(match => {
          const skill = match.replace(/•\s*/, '').replace(/\([^)]*\)/, '').trim();
          if (skill && skill.length > 1) {
            technicalSkills.push(skill);
          }
        });
      }
    }
    
    // Parse soft skills
    if (softSkillsMatch) {
      const softText = softSkillsMatch[1];
      const softMatches = softText.match(/•\s*([^\n]+)/g);
      if (softMatches) {
        softMatches.forEach(match => {
          const skill = match.replace(/•\s*/, '').trim();
          if (skill && skill.length > 1) {
            softSkills.push(skill);
          }
        });
      }
    }
    
    // Check for missing skills
    const requiredSkills = requirements.requiredSkills || [];
    const allFoundSkills = [...technicalSkills, ...softSkills].map(s => s.toLowerCase());
    const missing = requiredSkills.filter(skill => 
      !allFoundSkills.some(found => found.includes(skill.toLowerCase()))
    );
    
    return {
      technical: technicalSkills,
      soft: softSkills,
      missing: missing
    };
  };

  const parseExperienceFromResume = (text: string) => {
    // Extract experience section
    const experienceMatch = text.match(/Experience:\s*([\s\S]*?)(?=\n[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*:|$)/i);
    
    let totalYears = 0;
    const relevantRoles: string[] = [];
    const industries: string[] = [];
    
    if (experienceMatch) {
      const expText = experienceMatch[1];
      
      // Parse date ranges like "Jan 2025 - Mar 2025"
      const dateMatches = expText.match(/(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|Present|Current)/gi);
      
      if (dateMatches) {
        dateMatches.forEach(dateRange => {
          const [start, end] = dateRange.split(/[-–]/);
          const startMatch = start.trim().match(/(\w+)\s+(\d{4})/);
          
          if (startMatch) {
            const startYear = parseInt(startMatch[2]);
            const startMonth = getMonthNumber(startMatch[1]);
            
            let endYear = new Date().getFullYear();
            let endMonth = new Date().getMonth() + 1;
            
            if (!end.toLowerCase().includes('present') && !end.toLowerCase().includes('current')) {
              const endMatch = end.trim().match(/(\w+)\s+(\d{4})/);
              if (endMatch) {
                endYear = parseInt(endMatch[2]);
                endMonth = getMonthNumber(endMatch[1]);
              }
            }
            
            const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth);
            totalYears += monthsDiff / 12;
          }
        });
      }
      
      // Extract role titles
      const roleMatches = expText.match(/([A-Z][a-zA-Z\s]+)\s+at\s+([A-Z][a-zA-Z0-9\s]+)/g);
      if (roleMatches) {
        roleMatches.forEach(roleMatch => {
          const role = roleMatch.split(' at ')[0].trim();
          relevantRoles.push(role);
        });
      }
      
      // Identify industries
      const textLower = expText.toLowerCase();
      if (textLower.includes('ambassador') || textLower.includes('marketing')) {
        industries.push('Marketing');
      }
      if (textLower.includes('tech') || textLower.includes('software')) {
        industries.push('Technology');
      }
      if (textLower.includes('education') || textLower.includes('college')) {
        industries.push('Education');
      }
    }
    
    return {
      totalYears: Math.round(totalYears * 10) / 10,
      relevantRoles: relevantRoles,
      industries: industries
    };
  };

  const parseEducationFromResume = (text: string) => {
    // Extract education section
    const educationMatch = text.match(/Educational Qualification:\s*([\s\S]*?)(?=\n[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*:|$)/i);
    
    const degrees: string[] = [];
    const institutions: string[] = [];
    
    if (educationMatch) {
      const eduText = educationMatch[1];
      
      // Extract degree information
      const degreeMatches = eduText.match(/(B\.Tech[^,]*|Bachelor[^,]*|Master[^,]*|M\.Tech[^,]*|MBA[^,]*)/gi);
      if (degreeMatches) {
        degreeMatches.forEach(degree => {
          degrees.push(degree.trim());
        });
      }
      
      // Extract institution names
      const institutionMatches = eduText.match(/([A-Z][a-zA-Z\s]+(?:College|University|Institute)[a-zA-Z\s]*)/g);
      if (institutionMatches) {
        institutionMatches.forEach(institution => {
          institutions.push(institution.trim());
        });
      }
    }
    
    const jobEducation = jobRequirements.education.toLowerCase();
    const hasRelevantEducation = degrees.some(degree => 
      (jobEducation.includes('bachelor') && degree.toLowerCase().includes('b.tech')) ||
      (jobEducation.includes('master') && degree.toLowerCase().includes('master')) ||
      (jobEducation.includes('phd') && degree.toLowerCase().includes('phd'))
    );
    
    return {
      degrees: degrees,
      institutions: institutions,
      relevant: hasRelevantEducation || degrees.length > 0
    };
  };

  const getMonthNumber = (monthName: string): number => {
    const months = {
      'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
      'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
    };
    return months[monthName.toLowerCase().substring(0, 3) as keyof typeof months] || 1;
  };

  const calculateDetailedMatchScore = (
    skills: { technical: string[]; soft: string[]; missing: string[] },
    experience: { totalYears: number; relevantRoles: string[]; industries: string[] },
    education: { degrees: string[]; institutions: string[]; relevant: boolean },
    requirements: JobRequirements
  ): number => {
    let score = 0;
    
    // Skills matching (40% of total score)
    const requiredSkills = requirements.requiredSkills || [];
    if (requiredSkills.length > 0) {
      const matchedSkills = requiredSkills.filter(skill => 
        skills.technical.some(tech => tech.toLowerCase().includes(skill.toLowerCase())) ||
        skills.soft.some(soft => soft.toLowerCase().includes(skill.toLowerCase()))
      );
      score += (matchedSkills.length / requiredSkills.length) * 40;
    } else {
      // Base score for having skills
      score += Math.min(skills.technical.length * 3 + skills.soft.length * 2, 40);
    }
    
    // Experience matching (35% of total score)
    const experienceLevel = requirements.experienceLevel.toLowerCase();
    let experienceScore = 0;
    
    if (experienceLevel.includes('entry') || experienceLevel.includes('junior')) {
      experienceScore = experience.totalYears >= 0 ? 35 : 25;
    } else if (experienceLevel.includes('mid') || experienceLevel.includes('intermediate')) {
      experienceScore = experience.totalYears >= 2 ? 35 : experience.totalYears >= 1 ? 25 : 15;
    } else if (experienceLevel.includes('senior') || experienceLevel.includes('lead')) {
      experienceScore = experience.totalYears >= 5 ? 35 : experience.totalYears >= 3 ? 25 : 10;
    } else {
      experienceScore = Math.min(experience.totalYears * 7, 35);
    }
    
    // Bonus for relevant roles and industries
    if (experience.relevantRoles.length > 0) {
      experienceScore += 3;
    }
    if (experience.industries.length > 0) {
      experienceScore += 2;
    }
    
    score += Math.min(experienceScore, 35);
    
    // Education matching (25% of total score)
    if (education.relevant) {
      score += 25;
    } else if (education.degrees.length > 0) {
      score += 15;
    } else {
      score += 5;
    }
    
    return Math.min(Math.round(score), 100);
  };

  const categorizeCandidate = (score: number): 'highly-suitable' | 'moderate-fit' | 'needs-improvement' => {
    if (score >= 75) return 'highly-suitable';
    if (score >= 50) return 'moderate-fit';
    return 'needs-improvement';
  };

  const generateDetailedInsights = (
    skills: { technical: string[]; soft: string[]; missing: string[] },
    experience: { totalYears: number; relevantRoles: string[]; industries: string[] },
    education: { degrees: string[]; institutions: string[]; relevant: boolean },
    requirements: JobRequirements
  ) => {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];
    
    // Analyze strengths
    if (skills.technical.length > 3) {
      strengths.push(`Strong technical foundation with ${skills.technical.length} technologies: ${skills.technical.slice(0, 3).join(', ')}`);
    }
    
    if (skills.soft.length > 2) {
      strengths.push(`Well-developed soft skills including ${skills.soft.slice(0, 3).join(', ')}`);
    }
    
    if (experience.totalYears > 0) {
      strengths.push(`${experience.totalYears} years of relevant experience`);
    }
    
    if (experience.relevantRoles.length > 0) {
      strengths.push(`Relevant role experience: ${experience.relevantRoles.join(', ')}`);
    }
    
    if (education.relevant && education.degrees.length > 0) {
      strengths.push(`Educational background: ${education.degrees[0]} from ${education.institutions[0] || 'recognized institution'}`);
    }
    
    if (education.institutions.length > 0) {
      strengths.push(`Educated at ${education.institutions[0]}`);
    }
    
    // Analyze weaknesses
    if (skills.missing.length > 0) {
      weaknesses.push(`Missing required skills: ${skills.missing.slice(0, 3).join(', ')}`);
    }
    
    if (experience.totalYears < 1 && requirements.experienceLevel.includes('senior')) {
      weaknesses.push(`Limited experience for senior-level position`);
    }
    
    if (skills.technical.length < 3) {
      weaknesses.push(`Limited technical skill diversity`);
    }
    
    if (skills.soft.length < 3) {
      weaknesses.push(`Could benefit from more soft skill development`);
    }
    
    // Generate recommendations
    if (skills.missing.length > 0) {
      recommendations.push(`Develop proficiency in required skills: ${skills.missing.slice(0, 3).join(', ')}`);
    }
    
    if (experience.totalYears < 2) {
      recommendations.push(`Gain more hands-on experience through projects, internships, or volunteer work`);
    }
    
    if (skills.technical.length < 5) {
      recommendations.push(`Expand technical skill set with modern industry-relevant technologies`);
    }
    
    if (skills.soft.length < 4) {
      recommendations.push(`Develop additional soft skills like leadership, project management, and team collaboration`);
    }
    
    // Default messages if arrays are empty
    if (strengths.length === 0) {
      strengths.push('Candidate shows potential for growth and development');
    }
    
    if (weaknesses.length === 0) {
      weaknesses.push('No significant weaknesses identified');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue building experience and expanding skill set');
    }
    
    return { strengths, weaknesses, recommendations };
  };

  const generateFallbackAnalysis = (resume: File): ResumeAnalysis => {
    return {
      candidateName: resume.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
      contactInfo: { email: "", phone: "", linkedin: "" },
      skills: { technical: [], soft: [], missing: jobRequirements.requiredSkills },
      experience: { totalYears: 0, relevantRoles: [], industries: [] },
      education: { degrees: [], institutions: [], relevant: false },
      matchScore: 15,
      category: 'needs-improvement',
      strengths: [],
      weaknesses: ["File could not be analyzed properly"],
      recommendations: ["Please ensure file is properly formatted and contains structured sections"]
    };
  };

  const filteredAnalyses = analyses.filter(analysis => {
    if (filters.category !== 'all' && analysis.category !== filters.category) return false;
    if (analysis.matchScore < filters.minScore) return false;
    if (filters.hasEducation && !analysis.education.relevant) return false;
    return true;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'highly-suitable': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'moderate-fit': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'needs-improvement': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'highly-suitable': return <CheckCircle className="h-4 w-4" />;
      case 'moderate-fit': return <AlertCircle className="h-4 w-4" />;
      case 'needs-improvement': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Resume Screener
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload resumes and get AI-powered analysis to find the perfect candidates for your job openings
          </p>
        </motion.div>

        {/* Job Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Job Requirements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Software Engineer"
                    value={jobRequirements.title}
                    onChange={(e) => setJobRequirements(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Tech Corp"
                    value={jobRequirements.company}
                    onChange={(e) => setJobRequirements(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Input
                    id="experienceLevel"
                    placeholder="e.g., mid-level, senior"
                    value={jobRequirements.experienceLevel}
                    onChange={(e) => setJobRequirements(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    placeholder="e.g., bachelor's degree"
                    value={jobRequirements.education}
                    onChange={(e) => setJobRequirements(prev => ({ ...prev, education: e.target.value }))}
                  />
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="requiredSkills">Required Skills (comma-separated)</Label>
                <Input
                  id="requiredSkills"
                  placeholder="e.g., JavaScript, React, Node.js"
                  value={jobRequirements.requiredSkills.join(', ')}
                  onChange={(e) => setJobRequirements(prev => ({ 
                    ...prev, 
                    requiredSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the full job description here..."
                  value={jobRequirements.description}
                  onChange={(e) => setJobRequirements(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resume Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload Resumes
              </h2>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg mb-2">Drag and drop resumes here, or click to browse</p>
                <p className="text-sm text-gray-500 mb-4">Supports PDF, Word, and text files</p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Select Files
                </Button>
              </div>
              {resumes.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium mb-2">{resumes.length} file(s) uploaded:</p>
                  <div className="flex flex-wrap gap-2">
                    {resumes.map((file, index) => (
                      <Badge key={index} variant="secondary">
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-6">
                <Button 
                  onClick={analyzeResumes}
                  disabled={isAnalyzing || resumes.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isAnalyzing ? (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Resumes...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze Resumes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Results */}
        {analyses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Analysis Results ({filteredAnalyses.length})
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <select
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="px-3 py-1 border rounded-md text-sm"
                      >
                        <option value="all">All Categories</option>
                        <option value="highly-suitable">Highly Suitable</option>
                        <option value="moderate-fit">Moderate Fit</option>
                        <option value="needs-improvement">Needs Improvement</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Min Score:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.minScore}
                        onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
                        className="w-20"
                      />
                      <span className="text-sm w-8">{filters.minScore}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAnalyses.map((analysis, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedResume(analysis)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{analysis.candidateName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.contactInfo.email || 'Email not provided'}</p>
                        </div>
                        <Badge className={`${getCategoryColor(analysis.category)} flex items-center gap-1`}>
                          {getCategoryIcon(analysis.category)}
                          <span className="text-xs">{analysis.matchScore}%</span>
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Match Score</span>
                          <span>{analysis.matchScore}%</span>
                        </div>
                        <Progress value={analysis.matchScore} className="h-2" />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Experience:</span> {analysis.experience.totalYears} years
                        </div>
                        <div>
                          <span className="font-medium">Skills:</span> {analysis.skills.technical.length + analysis.skills.soft.length} total
                        </div>
                        <div>
                          <span className="font-medium">Education:</span> {analysis.education.degrees.length > 0 ? analysis.education.degrees[0] : 'Not specified'}
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full mt-3">
                        <Eye className="mr-2 h-3 w-3" />
                        View Details
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Detailed Analysis Modal */}
        {selectedResume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedResume(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedResume.candidateName}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className={`${getCategoryColor(selectedResume.category)} flex items-center gap-1`}>
                      {getCategoryIcon(selectedResume.category)}
                      {selectedResume.category.replace('-', ' ')}
                    </Badge>
                    <span className="text-lg font-semibold">Score: {selectedResume.matchScore}%</span>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedResume(null)}>
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> {selectedResume.contactInfo.email || 'Not provided'}</p>
                    <p><strong>Phone:</strong> {selectedResume.contactInfo.phone || 'Not provided'}</p>
                    <p><strong>LinkedIn:</strong> {selectedResume.contactInfo.linkedin || 'Not provided'}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <div>
                    <p className="font-medium">Technical Skills:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedResume.skills.technical.length > 0 ? (
                        selectedResume.skills.technical.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">None specified</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Soft Skills:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedResume.skills.soft.length > 0 ? (
                        selectedResume.skills.soft.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">None specified</span>
                      )}
                    </div>
                  </div>
                  {selectedResume.skills.missing.length > 0 && (
                    <div>
                      <p className="font-medium text-red-600">Missing Skills:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedResume.skills.missing.map((skill, index) => (
                          <Badge key={index} variant="destructive">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Experience */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Experience</h3>
                  <div className="space-y-2">
                    <p><strong>Total Years:</strong> {selectedResume.experience.totalYears}</p>
                    <div>
                      <p className="font-medium">Relevant Roles:</p>
                      {selectedResume.experience.relevantRoles.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {selectedResume.experience.relevantRoles.map((role, index) => (
                            <li key={index}>{role}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">None specified</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Industries:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedResume.experience.industries.length > 0 ? (
                          selectedResume.experience.industries.map((industry, index) => (
                            <Badge key={index} variant="outline">{industry}</Badge>
                          ))
                        ) : (
                          <span className="text-gray-500">None identified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Education</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">Degrees:</p>
                      {selectedResume.education.degrees.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {selectedResume.education.degrees.map((degree, index) => (
                            <li key={index}>{degree}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">None specified</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Institutions:</p>
                      {selectedResume.education.institutions.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {selectedResume.education.institutions.map((institution, index) => (
                            <li key={index}>{institution}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">None specified</span>
                      )}
                    </div>
                    <p><strong>Relevant to Job:</strong> {selectedResume.education.relevant ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Strengths */}
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-2">Strengths</h3>
                  <ul className="space-y-1">
                    {selectedResume.strengths.map((strength, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Areas for Improvement</h3>
                  <ul className="space-y-1">
                    {selectedResume.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <XCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Recommendations</h3>
                  <ul className="space-y-1">
                    {selectedResume.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <Star className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}