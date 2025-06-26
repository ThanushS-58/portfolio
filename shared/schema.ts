import { z } from "zod";

// Profile interface for LowDB
export interface Profile {
  id: number;
  // Personal Information
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  leetcodeUrl?: string;
  hackerrankUrl?: string;
  address?: string;
  profilePhotoUrl?: string;
  careerObjective?: string;
  professionalSummary?: string;
  
  // Additional personal details required for resume format
  fatherName?: string;
  motherName?: string;
  place?: string; // Place for resume signature
  
  // Areas of Interest (new field for resume format)
  areasOfInterest?: string[];
  
  // Job-specific fields for tailored resume generation
  targetJobTitle?: string;
  targetCompany?: string;
  jobDescription?: string;
  
  // Enhanced skill categorization
  hardSkills?: Skill[];
  relevantHardSkills?: string[]; // Skills relevant to current job target
  relevantSoftSkills?: string[]; // Soft skills relevant to current job target
  
  // Complex data structures
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  technicalSkills?: Skill[];
  softSkills?: Skill[];
  awards?: Award[];
  certifications?: Certification[];
  languages?: Language[];
  hobbies?: string[];
  publications?: Publication[];
  volunteerWork?: VolunteerWork[];
  extracurricularActivities?: string[];
  
  createdAt?: string;
  updatedAt?: string;
}

// Supporting interfaces
export interface Education {
  id: string;
  degree: string;
  institution: string;
  startYear: number;
  endYear: number;
  grade?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
  technologies?: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Award {
  id: string;
  name: string;
  year: number;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  year: number;
  issuer?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Publication {
  id: string;
  title: string;
  journal: string;
  year?: number;
  url?: string;
}

export interface VolunteerWork {
  id: string;
  organization: string;
  role: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

// Zod schemas for validation
export const insertProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  address: z.string().optional(),
  profilePhotoUrl: z.string().optional(),
  careerObjective: z.string().optional(),
  professionalSummary: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  place: z.string().optional(),
  areasOfInterest: z.array(z.string()).optional(),
  targetJobTitle: z.string().optional(),
  targetCompany: z.string().optional(),
  jobDescription: z.string().optional(),
  hardSkills: z.array(z.object({
    id: z.string(),
    name: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'])
  })).optional(),
  relevantHardSkills: z.array(z.string()).optional(),
  relevantSoftSkills: z.array(z.string()).optional(),
  education: z.array(z.object({
    id: z.string(),
    degree: z.string(),
    institution: z.string(),
    startYear: z.number(),
    endYear: z.number(),
    grade: z.string().optional(),
  })).optional(),
  experience: z.array(z.object({
    id: z.string(),
    title: z.string(),
    company: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string(),
    current: z.boolean(),
  })).optional(),
  projects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    link: z.string().optional(),
    technologies: z.array(z.string()).optional(),
  })).optional(),
  technicalSkills: z.array(z.object({
    id: z.string(),
    name: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  })).optional(),
  softSkills: z.array(z.object({
    id: z.string(),
    name: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  })).optional(),
  awards: z.array(z.object({
    id: z.string(),
    name: z.string(),
    year: z.number(),
    description: z.string().optional(),
  })).optional(),
  certifications: z.array(z.object({
    id: z.string(),
    name: z.string(),
    year: z.number(),
    issuer: z.string().optional(),
  })).optional(),
  languages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    proficiency: z.enum(['basic', 'conversational', 'fluent', 'native']),
  })).optional(),
  hobbies: z.array(z.string()).optional(),
  publications: z.array(z.object({
    id: z.string(),
    title: z.string(),
    journal: z.string(),
    year: z.number().optional(),
    url: z.string().optional(),
  })).optional(),
  volunteerWork: z.array(z.object({
    id: z.string(),
    organization: z.string(),
    role: z.string(),
    description: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })).optional(),
  extracurricularActivities: z.array(z.string()).optional(),
});

export const updateProfileSchema = insertProfileSchema.partial();

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
