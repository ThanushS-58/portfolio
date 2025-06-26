import { useEffect } from 'react';
import { detectProfessionalField, getColorPalette, applyColorPalette } from '@/lib/colorPalettes';

export function useDynamicColorPalette(profile: any) {
  const field = detectProfessionalField(profile);
  const palette = getColorPalette(field);
  
  useEffect(() => {
    if (profile) {
      applyColorPalette(palette);
    }
  }, [profile, palette]);
  
  return { field, palette };
}