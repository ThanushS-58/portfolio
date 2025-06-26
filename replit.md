# AI-Powered Resume Builder & Screening System

## Overview

This is a comprehensive full-stack resume management platform that combines profile creation, AI-powered resume generation, and intelligent resume screening capabilities. Built with a modern web stack, the application serves as a complete solution for both job seekers creating tailored resumes and recruiters analyzing candidate profiles. The system features a React frontend with Node.js/Express backend, in-memory storage for rapid development, and sophisticated local AI algorithms for resume processing.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and interactions
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **File Uploads**: Multer for handling profile photo uploads
- **Development**: Hot reload with tsx for development server

## Key Components

### Core Application Features

#### 1. Profile Management Dashboard
- **Comprehensive Forms**: 8 sections covering personal info, education, experience, projects, skills, awards, certifications, and additional information
- **Real-time Auto-save**: Debounced updates with instant UI feedback
- **Responsive Design**: Mobile-first approach with collapsible sidebar navigation
- **File Upload**: Profile photo upload with preview and validation
- **Form Validation**: Client-side validation with immediate error feedback

#### 2. AI-Powered Resume Creator
- **Smart Resume Generation**: Automatically creates professional resumes from profile data
- **Job-Specific Tailoring**: Customizes content based on target company and job description
- **Multiple Templates**: Professional, modern, minimal, and technical resume formats
- **Intelligent Content Selection**: Prioritizes relevant experience, skills, and projects
- **Export Capabilities**: Download as text files with print-ready formatting
- **Career Objective Generation**: AI-crafted objectives based on profile and job requirements

#### 3. Intelligent Resume Screener
- **Bulk Resume Processing**: Upload and analyze multiple resumes simultaneously
- **Job Requirements Matching**: Compare resumes against specific job descriptions
- **Scoring Algorithm**: Calculate match percentages based on skills, experience, and education
- **Candidate Categorization**: Automatically classify candidates as highly-suitable, moderate-fit, or needs-improvement
- **Skills Gap Analysis**: Identify missing technical and soft skills
- **Export Results**: Generate CSV reports for HR workflow integration
- **Detailed Candidate Profiles**: Comprehensive analysis with strengths, weaknesses, and recommendations

### Technical Architecture

#### Database Layer
- **Storage**: In-memory storage (MemStorage) for rapid development and testing
- **Schema**: Comprehensive profile model with JSONB-style nested structures
- **Data Models**: Strongly typed interfaces for Education, Experience, Projects, Skills, Awards, Certifications, Languages, Publications, and Volunteer Work
- **API Layer**: Full CRUD operations with Zod validation

#### Frontend Components
- **Modular Design**: Section-based profile form components with smooth animations
- **Navigation**: Dynamic sidebar with profile sections and resume tools
- **State Management**: React Query for server state with optimistic updates
- **UI Components**: Shadcn/ui component library with custom styling
- **Responsive Layout**: Adaptive design for desktop and mobile devices

## Application Workflows

### Profile Management Flow
1. **User Input**: User fills out comprehensive profile sections through intuitive forms
2. **Auto-save**: Changes are automatically saved with debounced API calls for seamless experience
3. **Validation**: Client-side validation provides immediate feedback with error highlighting
4. **Storage**: Data is stored in memory with structured interfaces for rapid development
5. **State Management**: React Query manages caching, synchronization, and optimistic updates
6. **Real-time Updates**: UI updates immediately while background saves occur

### Resume Creation Flow
1. **Profile Analysis**: System analyzes user's complete profile data
2. **Job Targeting**: User provides target company, job title, and description
3. **Content Tailoring**: AI algorithms extract relevant skills and experiences
4. **Template Selection**: Choose from professional, modern, minimal, or technical formats
5. **Generation**: Intelligent resume generation with optimized content structure
6. **Preview & Export**: Real-time preview with download capabilities in multiple formats

### Resume Screening Flow
1. **Job Setup**: Define job requirements, company details, and required qualifications
2. **Resume Upload**: Bulk upload of candidate resumes (PDF, DOCX, TXT supported)
3. **AI Processing**: Advanced text analysis extracts candidate information
4. **Matching Algorithm**: Calculate compatibility scores based on multiple factors
5. **Categorization**: Automatic classification into suitability categories
6. **Results Export**: Generate detailed reports and CSV exports for HR workflows

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm and drizzle-kit for database operations
- **UI**: @radix-ui components for accessible UI primitives
- **Forms**: @hookform/resolvers with Zod for form validation
- **Queries**: @tanstack/react-query for server state management
- **Animation**: framer-motion for UI animations

### Development Tools
- **TypeScript**: Full type safety across the stack
- **Vite**: Fast development server and build tool
- **PostCSS**: CSS processing with Tailwind
- **ESBuild**: Fast bundling for production builds

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` starts both frontend and backend
- **Hot Reload**: Vite provides instant updates during development
- **Database**: Connects to hosted PostgreSQL instance

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild bundles Node.js server
- **Deployment**: Configured for Replit autoscale deployment
- **Port Configuration**: Listens on port 5000, external port 80

### Database Management
- **Schema**: Managed through Drizzle migrations
- **Push Command**: `npm run db:push` applies schema changes
- **Environment**: DATABASE_URL required for connection

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- June 26, 2025. Enhanced Dynamic Skills and Profile Features:
  - Added LeetCode and HackerRank URL fields to profile personal information section
  - Implemented dynamic career objective generator with 2025 industry trending skills
  - Created comprehensive skills database with AI/ML, cloud, cybersecurity, and emerging technologies
  - Enhanced resume creator with intelligent skill matching based on job descriptions
  - Integrated real-time skill trend analysis (AI collaboration, quantum computing, edge computing)
  - Added field-specific career objective templates for different technology domains
  - Improved skill extraction from job descriptions for better resume targeting
  - Successfully migrated from Replit Agent to standard Replit environment

- June 20, 2025. Complete AI-Powered Resume System Implementation:
  - Fixed resume formatting with proper alignment (name left at top, right at bottom after "Place:")
  - Implemented comprehensive AI-powered resume analysis without external dependencies
  - Enhanced skill extraction with advanced pattern matching for technical and soft skills
  - Added modern CSS animations (float, slide, fade, glow effects) across all components
  - Created intelligent resume screening with detailed candidate scoring and recommendations
  - Fixed Word document generation to match exact preview content with proper alignment
  - Removed unwanted content after "Place:" in resume format
  - Added gradient text effects and glass morphism UI design
  - Improved mobile PDF and Word document download functionality
  - Enhanced contact information and education extraction accuracy
  - Added AI-driven insights and improvement suggestions for candidates

## Previous Updates
- June 16, 2025. Initial setup
- June 16, 2025. Fixed critical resume generation, profile photo upload, and download functionality