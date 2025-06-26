// Dynamic Color Palette System Based on Professional Fields

export interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  gradient: string;
  cardBackground: string;
  hover: string;
}

export const PROFESSIONAL_FIELD_PALETTES: Record<string, ColorPalette> = {
  // Technology & Software Development
  technology: {
    name: "Technology Blue",
    primary: "hsl(210, 100%, 56%)", // Bright blue
    secondary: "hsl(195, 100%, 50%)", // Cyan
    accent: "hsl(240, 100%, 70%)", // Light purple
    background: "hsl(220, 20%, 97%)",
    surface: "hsl(220, 20%, 100%)",
    text: "hsl(220, 20%, 15%)",
    textSecondary: "hsl(220, 10%, 40%)",
    border: "hsl(220, 20%, 90%)",
    gradient: "linear-gradient(135deg, hsl(210, 100%, 56%) 0%, hsl(195, 100%, 50%) 100%)",
    cardBackground: "hsl(220, 30%, 98%)",
    hover: "hsl(210, 100%, 60%)"
  },

  // Healthcare & Medical
  healthcare: {
    name: "Medical Green",
    primary: "hsl(160, 60%, 45%)", // Medical green
    secondary: "hsl(180, 50%, 55%)", // Teal
    accent: "hsl(200, 80%, 60%)", // Light blue
    background: "hsl(160, 20%, 97%)",
    surface: "hsl(160, 20%, 100%)",
    text: "hsl(160, 30%, 15%)",
    textSecondary: "hsl(160, 15%, 40%)",
    border: "hsl(160, 20%, 90%)",
    gradient: "linear-gradient(135deg, hsl(160, 60%, 45%) 0%, hsl(180, 50%, 55%) 100%)",
    cardBackground: "hsl(160, 25%, 98%)",
    hover: "hsl(160, 60%, 50%)"
  },

  // Finance & Banking
  finance: {
    name: "Professional Navy",
    primary: "hsl(220, 80%, 35%)", // Navy blue
    secondary: "hsl(200, 70%, 45%)", // Steel blue
    accent: "hsl(45, 90%, 55%)", // Gold
    background: "hsl(220, 15%, 97%)",
    surface: "hsl(220, 15%, 100%)",
    text: "hsl(220, 30%, 15%)",
    textSecondary: "hsl(220, 15%, 40%)",
    border: "hsl(220, 15%, 90%)",
    gradient: "linear-gradient(135deg, hsl(220, 80%, 35%) 0%, hsl(200, 70%, 45%) 100%)",
    cardBackground: "hsl(220, 20%, 98%)",
    hover: "hsl(220, 80%, 40%)"
  },

  // Creative & Design
  creative: {
    name: "Creative Purple",
    primary: "hsl(270, 70%, 55%)", // Purple
    secondary: "hsl(300, 65%, 60%)", // Magenta
    accent: "hsl(320, 80%, 65%)", // Pink
    background: "hsl(270, 15%, 97%)",
    surface: "hsl(270, 15%, 100%)",
    text: "hsl(270, 30%, 15%)",
    textSecondary: "hsl(270, 15%, 40%)",
    border: "hsl(270, 15%, 90%)",
    gradient: "linear-gradient(135deg, hsl(270, 70%, 55%) 0%, hsl(300, 65%, 60%) 100%)",
    cardBackground: "hsl(270, 20%, 98%)",
    hover: "hsl(270, 70%, 60%)"
  },

  // Marketing & Communications
  marketing: {
    name: "Vibrant Orange",
    primary: "hsl(25, 85%, 55%)", // Orange
    secondary: "hsl(45, 90%, 60%)", // Yellow-orange
    accent: "hsl(5, 80%, 60%)", // Red-orange
    background: "hsl(25, 20%, 97%)",
    surface: "hsl(25, 20%, 100%)",
    text: "hsl(25, 30%, 15%)",
    textSecondary: "hsl(25, 15%, 40%)",
    border: "hsl(25, 20%, 90%)",
    gradient: "linear-gradient(135deg, hsl(25, 85%, 55%) 0%, hsl(45, 90%, 60%) 100%)",
    cardBackground: "hsl(25, 25%, 98%)",
    hover: "hsl(25, 85%, 60%)"
  },

  // Education & Academia
  education: {
    name: "Academic Burgundy",
    primary: "hsl(345, 60%, 45%)", // Burgundy
    secondary: "hsl(15, 70%, 55%)", // Rust
    accent: "hsl(30, 80%, 60%)", // Warm orange
    background: "hsl(345, 15%, 97%)",
    surface: "hsl(345, 15%, 100%)",
    text: "hsl(345, 30%, 15%)",
    textSecondary: "hsl(345, 15%, 40%)",
    border: "hsl(345, 15%, 90%)",
    gradient: "linear-gradient(135deg, hsl(345, 60%, 45%) 0%, hsl(15, 70%, 55%) 100%)",
    cardBackground: "hsl(345, 20%, 98%)",
    hover: "hsl(345, 60%, 50%)"
  },

  // Legal & Law
  legal: {
    name: "Legal Charcoal",
    primary: "hsl(200, 25%, 25%)", // Dark gray-blue
    secondary: "hsl(220, 30%, 35%)", // Slate
    accent: "hsl(45, 100%, 50%)", // Gold
    background: "hsl(200, 10%, 97%)",
    surface: "hsl(200, 10%, 100%)",
    text: "hsl(200, 25%, 15%)",
    textSecondary: "hsl(200, 15%, 40%)",
    border: "hsl(200, 10%, 90%)",
    gradient: "linear-gradient(135deg, hsl(200, 25%, 25%) 0%, hsl(220, 30%, 35%) 100%)",
    cardBackground: "hsl(200, 15%, 98%)",
    hover: "hsl(200, 25%, 30%)"
  },

  // Engineering & Manufacturing
  engineering: {
    name: "Industrial Steel",
    primary: "hsl(190, 40%, 40%)", // Steel blue
    secondary: "hsl(210, 45%, 50%)", // Blue steel
    accent: "hsl(35, 85%, 55%)", // Safety orange
    background: "hsl(190, 15%, 97%)",
    surface: "hsl(190, 15%, 100%)",
    text: "hsl(190, 30%, 15%)",
    textSecondary: "hsl(190, 15%, 40%)",
    border: "hsl(190, 15%, 90%)",
    gradient: "linear-gradient(135deg, hsl(190, 40%, 40%) 0%, hsl(210, 45%, 50%) 100%)",
    cardBackground: "hsl(190, 20%, 98%)",
    hover: "hsl(190, 40%, 45%)"
  },

  // Default/General
  default: {
    name: "Classic Blue",
    primary: "hsl(220, 70%, 50%)",
    secondary: "hsl(200, 65%, 55%)",
    accent: "hsl(240, 75%, 60%)",
    background: "hsl(220, 15%, 97%)",
    surface: "hsl(220, 15%, 100%)",
    text: "hsl(220, 25%, 15%)",
    textSecondary: "hsl(220, 15%, 40%)",
    border: "hsl(220, 15%, 90%)",
    gradient: "linear-gradient(135deg, hsl(220, 70%, 50%) 0%, hsl(200, 65%, 55%) 100%)",
    cardBackground: "hsl(220, 20%, 98%)",
    hover: "hsl(220, 70%, 55%)"
  }
};

// Field detection keywords
export const FIELD_KEYWORDS: Record<string, string[]> = {
  technology: [
    'software', 'developer', 'programmer', 'engineer', 'tech', 'it', 'computer',
    'web', 'mobile', 'frontend', 'backend', 'fullstack', 'devops', 'ai', 'ml',
    'data scientist', 'cybersecurity', 'cloud', 'javascript', 'python', 'react'
  ],
  healthcare: [
    'doctor', 'nurse', 'medical', 'healthcare', 'physician', 'therapist',
    'pharmacist', 'dentist', 'surgeon', 'clinic', 'hospital', 'patient care',
    'health', 'medicine', 'clinical', 'biomedical'
  ],
  finance: [
    'finance', 'banking', 'accounting', 'financial', 'investment', 'analyst',
    'controller', 'cpa', 'audit', 'treasury', 'risk', 'compliance',
    'portfolio', 'wealth', 'insurance', 'credit'
  ],
  creative: [
    'designer', 'artist', 'creative', 'graphic', 'ui', 'ux', 'visual',
    'photographer', 'animator', 'illustrator', 'branding', 'advertising',
    'media', 'art director', 'creative director'
  ],
  marketing: [
    'marketing', 'sales', 'business development', 'communications', 'pr',
    'social media', 'digital marketing', 'content', 'campaign', 'brand',
    'customer success', 'growth', 'seo', 'sem'
  ],
  education: [
    'teacher', 'professor', 'educator', 'academic', 'instructor', 'tutor',
    'education', 'school', 'university', 'curriculum', 'training',
    'learning', 'research', 'scholar'
  ],
  legal: [
    'lawyer', 'attorney', 'legal', 'law', 'counsel', 'paralegal', 'litigation',
    'corporate law', 'contract', 'compliance', 'legal advisor', 'judge'
  ],
  engineering: [
    'engineer', 'engineering', 'mechanical', 'electrical', 'civil', 'chemical',
    'manufacturing', 'industrial', 'quality', 'production', 'operations',
    'maintenance', 'project manager'
  ]
};

// Detect professional field from profile data
export function detectProfessionalField(profile: any): string {
  if (!profile) return 'default';
  
  const searchText = [
    profile.targetJobTitle || '',
    profile.jobDescription || '',
    profile.professionalSummary || '',
    profile.careerObjective || '',
    ...(profile.experience || []).map((exp: any) => `${exp.title} ${exp.description}`),
    ...(profile.projects || []).map((proj: any) => `${proj.name} ${proj.description}`),
    ...(profile.technicalSkills || []).map((skill: any) => skill.name || skill),
    ...(profile.hardSkills || []).map((skill: any) => skill.name || skill)
  ].join(' ').toLowerCase();

  // Score each field based on keyword matches
  const fieldScores: Record<string, number> = {};
  
  Object.entries(FIELD_KEYWORDS).forEach(([field, keywords]) => {
    fieldScores[field] = keywords.reduce((score, keyword) => {
      const matches = (searchText.match(new RegExp(keyword, 'gi')) || []).length;
      return score + matches;
    }, 0);
  });

  // Find the field with the highest score
  const detectedField = Object.entries(fieldScores)
    .sort(([,a], [,b]) => b - a)[0];

  return detectedField?.[1] > 0 ? detectedField[0] : 'default';
}

// Get color palette for a field
export function getColorPalette(field: string): ColorPalette {
  return PROFESSIONAL_FIELD_PALETTES[field] || PROFESSIONAL_FIELD_PALETTES.default;
}

// Apply color palette to CSS custom properties
export function applyColorPalette(palette: ColorPalette): void {
  const root = document.documentElement;
  
  root.style.setProperty('--color-primary', palette.primary);
  root.style.setProperty('--color-secondary', palette.secondary);
  root.style.setProperty('--color-accent', palette.accent);
  root.style.setProperty('--color-background', palette.background);
  root.style.setProperty('--color-surface', palette.surface);
  root.style.setProperty('--color-text', palette.text);
  root.style.setProperty('--color-text-secondary', palette.textSecondary);
  root.style.setProperty('--color-border', palette.border);
  root.style.setProperty('--color-gradient', palette.gradient);
  root.style.setProperty('--color-card-background', palette.cardBackground);
  root.style.setProperty('--color-hover', palette.hover);
}

// Update CSS custom properties for dynamic theming
export function updateThemeColors(palette: ColorPalette): void {
  if (typeof document === 'undefined') return;
  
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --dynamic-primary: ${palette.primary};
      --dynamic-secondary: ${palette.secondary};
      --dynamic-accent: ${palette.accent};
      --dynamic-background: ${palette.background};
      --dynamic-surface: ${palette.surface};
      --dynamic-text: ${palette.text};
      --dynamic-text-secondary: ${palette.textSecondary};
      --dynamic-border: ${palette.border};
      --dynamic-gradient: ${palette.gradient};
      --dynamic-card-background: ${palette.cardBackground};
      --dynamic-hover: ${palette.hover};
    }
  `;
  
  // Remove existing dynamic theme
  const existing = document.getElementById('dynamic-theme');
  if (existing) existing.remove();
  
  style.id = 'dynamic-theme';
  document.head.appendChild(style);
}