import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Profile table for basic personal information
export const profile = pgTable('profile', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  location: varchar('location', { length: 100 }),
  birthDate: varchar('birth_date', { length: 20 }),
  careerObjective: text('career_objective'),
  professionalSummary: text('professional_summary'),
  profileImageUrl: varchar('profile_image_url', { length: 500 }),
  linkedinUrl: varchar('linkedin_url', { length: 200 }),
  githubUrl: varchar('github_url', { length: 200 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Education table
export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  degree: varchar('degree', { length: 100 }).notNull(),
  institution: varchar('institution', { length: 200 }).notNull(),
  duration: varchar('duration', { length: 50 }).notNull(),
  grade: varchar('grade', { length: 50 }),
  description: text('description'),
  startYear: integer('start_year'),
  endYear: integer('end_year'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Experience table
export const experience = pgTable('experience', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  company: varchar('company', { length: 100 }).notNull(),
  duration: varchar('duration', { length: 50 }).notNull(),
  description: text('description'),
  skills: text('skills').array(), // Array of skills
  type: varchar('type', { length: 20 }).default('work'), // 'work' or 'volunteer'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  technologies: text('technologies').array(), // Array of technologies
  features: text('features').array(), // Array of features
  projectUrl: varchar('project_url', { length: 500 }),
  githubUrl: varchar('github_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Skills table
export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  level: varchar('level', { length: 20 }).notNull(), // Beginner, Intermediate, Advanced, Expert
  category: varchar('category', { length: 20 }).notNull(), // technical, soft
  percentage: integer('percentage').default(0), // For progress bar (0-100)
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Awards table
export const awards = pgTable('awards', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  event: varchar('event', { length: 100 }),
  year: varchar('year', { length: 10 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 20 }).default('award'), // 'award' or 'certification'
  issuer: varchar('issuer', { length: 100 }), // For certifications
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Interests table
export const interests = pgTable('interests', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  type: varchar('type', { length: 20 }).default('interest'), // 'interest' or 'hobby'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Insert schemas
export const insertProfileSchema = createInsertSchema(profile).omit({ id: true, updatedAt: true });
export const insertEducationSchema = createInsertSchema(education).omit({ id: true, createdAt: true });
export const insertExperienceSchema = createInsertSchema(experience).omit({ id: true, createdAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true, createdAt: true });
export const insertAwardSchema = createInsertSchema(awards).omit({ id: true, createdAt: true });
export const insertInterestSchema = createInsertSchema(interests).omit({ id: true, createdAt: true });

// Types
export type Profile = typeof profile.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type Education = typeof education.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;

export type Experience = typeof experience.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Award = typeof awards.$inferSelect;
export type InsertAward = z.infer<typeof insertAwardSchema>;

export type Interest = typeof interests.$inferSelect;
export type InsertInterest = z.infer<typeof insertInterestSchema>;