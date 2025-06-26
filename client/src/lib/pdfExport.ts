import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Profile } from '@shared/schema';

export const exportProfileToPDF = async (profile: Profile) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('times', isBold ? 'bold' : 'normal');
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    for (let i = 0; i < lines.length; i++) {
      if (y + (i * fontSize * 0.35) > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(lines[i], x, y + (i * fontSize * 0.35));
    }
    return y + (lines.length * fontSize * 0.35) + 5;
  };

  // Header with name (right-aligned)
  pdf.setFontSize(16);
  pdf.setFont('times', 'bold');
  const nameWidth = pdf.getTextWidth(profile.fullName || 'Profile');
  pdf.text(profile.fullName || 'Profile', pageWidth - margin - nameWidth, yPosition);
  yPosition += 10;

  // Contact Information (left-aligned)
  pdf.setFontSize(12);
  pdf.setFont('times', 'normal');
  if (profile.phone) {
    yPosition = addWrappedText(profile.phone, margin, yPosition, pageWidth - 2 * margin);
  }
  if (profile.email) {
    yPosition = addWrappedText(profile.email, margin, yPosition, pageWidth - 2 * margin);
  }
  if (profile.linkedinUrl) {
    yPosition = addWrappedText(`LinkedIn: ${profile.linkedinUrl}`, margin, yPosition, pageWidth - 2 * margin);
  }
  if (profile.githubUrl) {
    yPosition = addWrappedText(`Github: ${profile.githubUrl}`, margin, yPosition, pageWidth - 2 * margin);
  }
  yPosition += 10;

  // Career Objective
  if (profile.careerObjective) {
    yPosition = addWrappedText('Career Objective:', margin, yPosition, pageWidth - 2 * margin, 14, true);
    yPosition = addWrappedText(profile.careerObjective, margin, yPosition, pageWidth - 2 * margin);
    yPosition += 5;
  }

  // Educational Qualification
  if (profile.education && profile.education.length > 0) {
    yPosition = addWrappedText('Educational Qualification:', margin, yPosition, pageWidth - 2 * margin, 14, true);
    
    profile.education.forEach(edu => {
      const educationText = `${edu.degree || 'Degree'} (${edu.startYear || 'Year'}-${edu.endYear || 'Year'})`;
      yPosition = addWrappedText(educationText, margin, yPosition, pageWidth - 2 * margin);
      yPosition = addWrappedText(edu.institution || 'Institution', margin, yPosition, pageWidth - 2 * margin);
      if (edu.grade) {
        yPosition = addWrappedText(`CGPA: ${edu.grade}`, margin, yPosition, pageWidth - 2 * margin);
      }
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Area of Interest
  if (profile.areasOfInterest && profile.areasOfInterest.length > 0) {
    yPosition = addWrappedText('Area of Interest:', margin, yPosition, pageWidth - 2 * margin, 14, true);
    profile.areasOfInterest.forEach(interest => {
      yPosition = addWrappedText(interest, margin, yPosition, pageWidth - 2 * margin);
    });
    yPosition += 5;
  }

  // Skill Set
  yPosition = addWrappedText('Skill Set:', margin, yPosition, pageWidth - 2 * margin, 14, true);
  
  // Soft Skills
  if (profile.softSkills && profile.softSkills.length > 0) {
    yPosition = addWrappedText('Soft Skills:', margin, yPosition, pageWidth - 2 * margin, 12, true);
    profile.softSkills.forEach(skill => {
      const skillName = typeof skill === 'object' ? skill.name : skill;
      yPosition = addWrappedText(`• ${skillName}`, margin + 5, yPosition, pageWidth - 2 * margin - 5);
    });
  }

  // Technical Skills
  if (profile.technicalSkills && profile.technicalSkills.length > 0) {
    yPosition = addWrappedText('Technical Skills:', margin, yPosition, pageWidth - 2 * margin, 12, true);
    profile.technicalSkills.forEach(skill => {
      const skillName = typeof skill === 'object' ? skill.name : skill;
      const skillLevel = typeof skill === 'object' ? skill.level : 'intermediate';
      yPosition = addWrappedText(`• ${skillName} (${skillLevel})`, margin + 5, yPosition, pageWidth - 2 * margin - 5);
    });
  }
  yPosition += 5;

  // Projects
  if (profile.projects && profile.projects.length > 0) {
    yPosition = addWrappedText('Projects Done:', margin, yPosition, pageWidth - 2 * margin, 14, true);
    profile.projects.forEach(project => {
      yPosition = addWrappedText(`Title: ${project.name}`, margin, yPosition, pageWidth - 2 * margin);
      if (project.technologies) {
        yPosition = addWrappedText(`Technologies: ${project.technologies.join(', ')}`, margin, yPosition, pageWidth - 2 * margin);
      }
      yPosition = addWrappedText(`Description: ${project.description}`, margin, yPosition, pageWidth - 2 * margin);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Awards and Achievements
  if (profile.awards && profile.awards.length > 0) {
    yPosition = addWrappedText('Awards and Achievements:', margin, yPosition, pageWidth - 2 * margin, 14, true);
    profile.awards.forEach(award => {
      yPosition = addWrappedText(`• ${award.name} (${award.year})`, margin + 5, yPosition, pageWidth - 2 * margin - 5);
    });
    yPosition += 5;
  }

  // Certifications
  if (profile.certifications && profile.certifications.length > 0) {
    yPosition = addWrappedText('Certifications:', margin, yPosition, pageWidth - 2 * margin, 14, true);
    profile.certifications.forEach(cert => {
      yPosition = addWrappedText(`Certified in ${cert.name}`, margin, yPosition, pageWidth - 2 * margin);
    });
    yPosition += 5;
  }

  // Personal Details
  yPosition = addWrappedText('Personal Details:', margin, yPosition, pageWidth - 2 * margin, 14, true);
  if (profile.fatherName) {
    yPosition = addWrappedText(`Father's name: ${profile.fatherName}`, margin, yPosition, pageWidth - 2 * margin);
  }
  if (profile.motherName) {
    yPosition = addWrappedText(`Mother's name: ${profile.motherName}`, margin, yPosition, pageWidth - 2 * margin);
  }
  if (profile.hobbies && profile.hobbies.length > 0) {
    yPosition = addWrappedText(`Hobbies: ${profile.hobbies.join(', ')}`, margin, yPosition, pageWidth - 2 * margin);
  }
  if (profile.address) {
    yPosition = addWrappedText(`Address: ${profile.address}`, margin, yPosition, pageWidth - 2 * margin);
  }

  // Date and Place
  yPosition += 10;
  yPosition = addWrappedText(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition, pageWidth - 2 * margin);
  yPosition = addWrappedText(`Place: \t\t\t\t\t\t\t\t\t\t\t\t${profile.fullName || '[Name]'}`, margin, yPosition, pageWidth - 2 * margin);

  // Create blob and download for mobile devices
  const fileName = `${profile.fullName?.replace(/\s+/g, '_') || 'Profile'}_Resume.pdf`;
  
  try {
    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // For mobile devices, create a blob URL and trigger download
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      
      // Create temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      // For desktop, use regular save method
      pdf.save(fileName);
    }
    
    return fileName;
  } catch (error) {
    console.error('PDF download error:', error);
    // Fallback to regular save method
    pdf.save(fileName);
    return fileName;
  }
};