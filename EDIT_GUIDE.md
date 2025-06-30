# Portfolio Editing Guide

This guide shows you exactly where to edit your personal information in the portfolio website.

## 1. Adding Your Profile Photo

### Option A: Upload Photo File
1. Save your profile photo as `profile.jpg` in the `public` folder
2. The website will automatically use it

### Option B: Use Online Photo URL
1. Open `public/index.html`
2. Find line 76: `<img src="profile.jpg"`
3. Replace `profile.jpg` with your photo URL

## 2. Personal Information (Lines 48-135 in public/index.html)

### Name and Title
- Line 49: `Hi, I'm <span class="gradient-text">Thanush S</span>`
- Line 51: `B.Tech IT Student & Aspiring Software Developer`
- Line 23: `<span class="logo-text">Thanush S</span>`

### Hero Description
- Lines 52-55: Update your introduction text

### Contact Information
- Line 122: Birth date
- Line 126: Location  
- Line 130: Phone number
- Line 134: Email address

### Social Links
- Line 61: LinkedIn URL
- Line 64: GitHub URL
- Line 67: Email

## 3. About Section (Lines 104-155)

### Career Objective
- Lines 105-108: Update your career goals

### Professional Summary  
- Lines 111-115: Update your background description

### Areas of Interest
- Lines 141-145: Update your technical interests

### Hobbies
- Lines 151-153: Update your hobbies

## 4. Education Section (Lines 169-176)

- Line 169: Degree name
- Line 170: College name
- Line 172: Duration
- Line 173: CGPA/Grade
- Line 175: Description

## 5. Experience Section (Lines 190-200)

For each job/internship:
- Line 190: Job title
- Line 191: Company name
- Line 192: Duration
- Line 195: Job description
- Lines 197-200: Skills gained

## 6. Projects Section (Around lines 250-350)

For each project:
- Project title
- Description
- Technologies used
- Key features

## 7. Skills Section (Around lines 400-500)

### Technical Skills
Update skill names and proficiency levels (Beginner, Intermediate, Advanced, Expert)

### Soft Skills
Update the soft skills icons and names

## 8. Awards Section (Around lines 600-700)

For each award:
- Award name
- Event/Organization
- Year
- Description

## 9. Contact Section (Around lines 800-900)

- Phone number
- Email
- LinkedIn
- GitHub
- Location

## Quick Edit Commands

To edit any section quickly:
1. Open `public/index.html`
2. Use Ctrl+F (or Cmd+F) to search for the text you want to change
3. Replace with your information
4. Save the file

The website will automatically update when you refresh the browser!