import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { exportProfileToPDF } from "@/lib/pdfExport";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Download, Save, Clock, Loader2 } from "lucide-react";

import PersonalInfo from "@/components/profile-sections/personal-info";
import Education from "@/components/profile-sections/education";
import Experience from "@/components/profile-sections/experience";
import Projects from "@/components/profile-sections/projects";
import Skills from "@/components/profile-sections/skills";
import Awards from "@/components/profile-sections/awards";
import Certifications from "@/components/profile-sections/certifications";
import AdditionalInfo from "@/components/profile-sections/additional-info";
import CocurricularActivities from "@/components/profile-sections/cocurricular-activities";
import CodingProfiles from "@/components/profile-sections/coding-profiles";

import type { Profile, InsertProfile, UpdateProfile } from "@shared/schema";

interface ProfileFormProps {
  activeSection: string;
}

export default function ProfileForm({ activeSection }: ProfileFormProps) {
  const [profileData, setProfileData] = useState<Partial<Profile>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get first profile (demo purposes - in real app you'd get by user ID)
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profiles"],
    select: (data: Profile[]) => data[0] || null,
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: InsertProfile) => {
      const response = await apiRequest("POST", "/api/profiles", data);
      return response.json();
    },
    onSuccess: (newProfile) => {
      queryClient.setQueryData(["/api/profiles"], [newProfile]);
      setLastSaved(new Date());
      toast({
        title: "Profile Created",
        description: "Your profile has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfile) => {
      if (!profile?.id) throw new Error("No profile ID");
      const response = await apiRequest("PUT", `/api/profiles/${profile.id}`, data);
      return response.json();
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["/api/profiles"], [updatedProfile]);
      setLastSaved(new Date());
      setIsAutoSaving(false);
    },
    onError: (error) => {
      setIsAutoSaving(false);
      toast({
        title: "Auto-save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Auto-save functionality
  const debouncedSave = useCallback(
    debounce((data: Partial<Profile>) => {
      if (profile?.id) {
        setIsAutoSaving(true);
        updateProfileMutation.mutate(data);
      }
    }, 2000),
    [profile?.id, updateProfileMutation]
  );

  const handleDataChange = (section: string, data: any) => {
    let updatedData;
    
    if (section === "personal") {
      updatedData = { ...profileData, ...data };
    } else if (["education", "experience", "projects", "awards", "certifications"].includes(section)) {
      // For array sections, data contains the full profile object with updated array
      updatedData = { ...profileData, [section]: data[section] };
    } else if (section === "skills") {
      // Skills section has technicalSkills and softSkills
      updatedData = { 
        ...profileData, 
        technicalSkills: data.technicalSkills,
        softSkills: data.softSkills
      };
    } else if (section === "additional") {
      // Additional Info section has multiple arrays
      updatedData = { 
        ...profileData, 
        languages: data.languages,
        hobbies: data.hobbies,
        publications: data.publications,
        volunteerWork: data.volunteerWork
      };
    } else {
      updatedData = { ...profileData, [section]: data };
    }
    
    setProfileData(updatedData);
    
    if (profile?.id) {
      debouncedSave(updatedData);
    }
  };

  const handleSave = async () => {
    try {
      if (!profileData.fullName || !profileData.email) {
        toast({
          title: "Missing Information",
          description: "Please fill in at least your name and email.",
          variant: "destructive",
        });
        return;
      }

      if (profile?.id) {
        updateProfileMutation.mutate(profileData);
      } else {
        createProfileMutation.mutate(profileData as InsertProfile);
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your profile.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = async () => {
    const currentProfile = profile || profileData;
    
    if (!currentProfile.fullName || !currentProfile.email) {
      toast({
        title: "Missing Information",
        description: "Please complete your basic profile information before exporting.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      const fileName = await exportProfileToPDF(currentProfile as Profile);
      toast({
        title: "Export Successful",
        description: `Profile exported as ${fileName}`,
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your profile to PDF.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const currentProfile = profile || profileData;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        className="mb-8 animate-fade-in-up"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="card-hover glass-effect border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="animate-slide-in-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Profile Management
                </h1>
                <p className="text-slate-600">Build and customize your professional profile with AI-powered insights</p>
              </div>
              <div className="flex items-center space-x-4 animate-slide-in-right">
                <Button variant="outline" className="button-glow card-hover">
                  <Eye className="mr-2" size={16} />
                  Preview
                </Button>
                <Button 
                  variant="outline" 
                  className="button-glow card-hover"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 animate-float" size={16} />
                  )}
                  Export PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          {activeSection === "personal" && (
            <PersonalInfo 
              data={currentProfile} 
              onChange={(data) => handleDataChange("personal", data)}
            />
          )}
          {activeSection === "education" && (
            <Education 
              data={currentProfile} 
              onChange={(data) => handleDataChange("education", data)}
            />
          )}
          {activeSection === "experience" && (
            <Experience 
              data={currentProfile} 
              onChange={(data) => handleDataChange("experience", data)}
            />
          )}
          {activeSection === "projects" && (
            <Projects 
              data={currentProfile} 
              onChange={(data) => handleDataChange("projects", data)}
            />
          )}
          {activeSection === "skills" && (
            <Skills 
              data={currentProfile} 
              onChange={(data) => handleDataChange("skills", data)}
            />
          )}
          {activeSection === "awards" && (
            <Awards 
              data={currentProfile} 
              onChange={(data) => handleDataChange("awards", data)}
            />
          )}
          {activeSection === "certifications" && (
            <Certifications 
              data={currentProfile} 
              onChange={(data) => handleDataChange("certifications", data)}
            />
          )}
          {activeSection === "additional" && (
            <AdditionalInfo 
              data={currentProfile} 
              onChange={(data) => handleDataChange("additional", data)}
            />
          )}
          {activeSection === "cocurricular" && currentProfile?.id && (
            <CocurricularActivities profileId={currentProfile.id} />
          )}
          {activeSection === "coding" && currentProfile?.id && (
            <CodingProfiles profileId={currentProfile.id} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action Bar */}
      <motion.div 
        className="mt-8 fade-in"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="section-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-slate-600">
                {isAutoSaving ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Auto-saving...
                  </>
                ) : lastSaved ? (
                  <>
                    <Clock className="mr-2" size={16} />
                    Auto-saved {lastSaved.toLocaleTimeString()}
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={16} />
                    No changes saved yet
                  </>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="btn-secondary">
                  <Eye className="mr-2" size={16} />
                  Preview Profile
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="btn-secondary"
                >
                  {isExporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2" size={16} />
                  )}
                  Export as PDF
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={createProfileMutation.isPending || updateProfileMutation.isPending}
                  className="btn-primary"
                >
                  {(createProfileMutation.isPending || updateProfileMutation.isPending) ? (
                    <>
                      <div className="spinner mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={16} />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
