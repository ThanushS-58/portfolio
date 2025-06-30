# Thanush S Portfolio Website - replit.md

## Overview

This is a personal portfolio website for Thanush S, built as a static website with a simple Express.js server. The application showcases professional information including education, experience, projects, skills, and contact details based on authentic data from Thanush's profile. It's designed as a single-page application with a modern, responsive interface.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: All content is contained in a single HTML file with CSS styling and JavaScript for interactivity
- **Static Asset Serving**: HTML, CSS, and JavaScript files are served directly from the `/public` directory
- **Responsive Design**: Mobile-first approach using CSS media queries and flexible layouts
- **Modern UI Framework**: Uses Inter font family and Font Awesome icons for a professional appearance
- **Interactive Elements**: Smooth scrolling navigation, animated skill bars, hover effects, and scroll-triggered animations

### Backend Architecture
- **Minimal Express.js Server**: Simple Node.js server using Express framework
- **Static File Serving**: Primary function is to serve static assets from the public directory
- **Single Route Handler**: Basic GET route for the home page that serves the main HTML file
- **Environment Configuration**: Configurable port with fallback to port 3000

## Key Components

### Server Components
1. **Express Server (`server.js`)**
   - Handles static file serving
   - Provides basic routing for the home page
   - Configured to listen on all network interfaces (0.0.0.0)

2. **Package Management (`package.json`)**
   - Minimal dependencies (only Express.js)
   - Start scripts for both production and development
   - MIT license for open-source distribution

### Frontend Components
1. **Main HTML Structure (`public/index.html`)**
   - Complete portfolio layout with semantic HTML
   - Navigation menu with smooth scrolling
   - Multiple sections: hero, about, education, experience, projects, skills, awards, contact
   - SEO optimized with meta tags and Open Graph properties
   - Authentic data from Thanush's profile including:
     - Personal information and contact details
     - B.Tech IT education at M. Kumarasamy College of Engineering
     - Campus Ambassador experience at Careers360
     - Volunteer work and event organization
     - Technical projects including Tour Package Management System and AI Resume Builder
     - Technical and soft skills with proficiency levels
     - Awards and certifications

2. **Styling System (`public/styles.css`)**
   - Modern CSS with custom properties for theming
   - Responsive grid layouts and flexbox
   - Gradient backgrounds and smooth animations
   - Hover effects and transitions
   - Mobile-responsive navigation with hamburger menu

3. **Interactive Features (`public/script.js`)**
   - Mobile navigation toggle
   - Smooth scrolling navigation
   - Scroll-triggered animations
   - Skill bar progress animations
   - Contact form with mailto functionality
   - Active navigation highlighting
   - Performance-optimized scroll handlers

## Data Flow

1. **Request Flow**: Client → Express Server → Static File Handler → HTML/CSS/JS Response
2. **Navigation**: Client-side navigation using anchor links for smooth scrolling between sections
3. **Static Content**: All portfolio data is embedded directly in the HTML structure using authentic profile data
4. **No Database**: Currently uses static content without any data persistence layer
5. **Contact Form**: Uses mailto links to open user's email client with pre-filled message

## External Dependencies

### Runtime Dependencies
- **Express.js (^4.18.2)**: Web application framework for Node.js
- **Node.js**: JavaScript runtime environment

### External Resources
- **Font Awesome CDN**: Icon library for UI elements
- **Google Fonts**: Typography (Inter font family)

### No Database Dependencies
- Currently operates without any database system
- All content is static and embedded in HTML using real profile data

## Portfolio Content

### Personal Information
- Full Name: Thanush S
- Email: thanush205s@gmail.com
- Phone: +91 8248289043
- Location: Karur, Tamil Nadu
- LinkedIn: https://www.linkedin.com/in/thanush-s-464439290/
- GitHub: https://github.com/ThanushS-58/

### Professional Summary
B.Tech Information Technology student with strong foundation in programming, database management, and web development. Experience with C, Python, Java, HTML, CSS, PHP, and SQL. Built real-world applications including personal finance systems, doctor-patient portals, and AI-based resume screeners.

### Key Projects
1. **Tour Package Management System** - Dynamic PHP/MySQL application for tour booking
2. **AI-Powered Resume Builder & Screening System** - Full-stack React/Node.js application with AI capabilities

## Deployment Strategy

### Current Setup
- **Port Configuration**: Uses environment variable PORT or defaults to port 3000
- **Network Binding**: Configured to bind to all network interfaces (0.0.0.0)
- **Static Serving**: Express serves files from the public directory
- **Production Ready**: Start script available for production deployment

### Deployment Considerations
- Can be deployed to any Node.js hosting platform
- Minimal resource requirements due to static nature
- No database setup required for current implementation
- Environment variables can be used for port configuration

## Recent Changes
- June 30, 2025: Migrated from complex resume builder to standalone portfolio
- June 30, 2025: Removed all resume builder components and dependencies
- June 30, 2025: Created clean portfolio structure with authentic data
- June 30, 2025: Added responsive design and interactive features

## User Preferences

Preferred communication style: Simple, everyday language.