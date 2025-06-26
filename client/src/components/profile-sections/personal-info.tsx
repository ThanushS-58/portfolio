import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Camera, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { validateEmail } from "@/lib/utils";
import type { Profile } from "@shared/schema";

interface PersonalInfoProps {
  data: Partial<Profile>;
  onChange: (data: Partial<Profile>) => void;
}

export default function PersonalInfo({ data, onChange }: PersonalInfoProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof Profile, value: string) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    onChange({ ...data, [field]: value });
  };

  const validateField = (field: keyof Profile, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "email":
        if (value && !validateEmail(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "fullName":
        if (!value.trim()) {
          newErrors.fullName = "Full name is required";
        } else {
          delete newErrors.fullName;
        }
        break;
      case "linkedinUrl":
      case "githubUrl":
        if (value && !value.startsWith("http")) {
          newErrors[field] = "Please enter a valid URL";
        } else {
          delete newErrors[field];
        }
        break;
    }

    setErrors(newErrors);
  };

  const handlePhotoUpload = async (file: File) => {
    if (!data.id) {
      toast({
        title: "Save Profile First",
        description: "Please save your profile before uploading a photo.",
        variant: "destructive",
      });
      return;
    }

    setUploadingPhoto(true);
    
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch(`/api/profiles/${data.id}/photo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      
      // Update the profile data with new photo URL
      const updatedData = { ...data, profilePhotoUrl: result.photoUrl };
      onChange(updatedData);
      
      // Force a re-render by clearing the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast({
        title: "Photo Uploaded",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      handlePhotoUpload(file);
    }
  };

  return (
    <motion.section 
      id="personal"
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="section-card">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <User className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Personal Information</h2>
              <p className="text-slate-600">Your basic personal details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    className={`input-field ${errors.fullName ? 'border-destructive' : ''}`}
                    placeholder="Enter your full name"
                    value={data.fullName || ""}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    onBlur={(e) => validateField("fullName", e.target.value)}
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className={`input-field ${errors.email ? 'border-destructive' : ''}`}
                    placeholder="your.email@example.com"
                    value={data.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={(e) => validateField("email", e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    className="input-field"
                    placeholder="+91 9125637834"
                    value={data.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth" className="block text-sm font-semibold text-slate-700 mb-2">
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className="input-field"
                    value={data.dateOfBirth || ""}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="linkedinUrl" className="block text-sm font-semibold text-slate-700 mb-2">
                    LinkedIn URL
                  </Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    className={`input-field ${errors.linkedinUrl ? 'border-destructive' : ''}`}
                    placeholder="https://linkedin.com/in/username"
                    value={data.linkedinUrl || ""}
                    onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                    onBlur={(e) => validateField("linkedinUrl", e.target.value)}
                  />
                  {errors.linkedinUrl && (
                    <p className="text-destructive text-sm mt-1">{errors.linkedinUrl}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="githubUrl" className="block text-sm font-semibold text-slate-700 mb-2">
                    GitHub URL
                  </Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    className={`input-field ${errors.githubUrl ? 'border-destructive' : ''}`}
                    placeholder="https://github.com/username"
                    value={data.githubUrl || ""}
                    onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                    onBlur={(e) => validateField("githubUrl", e.target.value)}
                  />
                  {errors.githubUrl && (
                    <p className="text-destructive text-sm mt-1">{errors.githubUrl}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="fatherName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Father's Name
                  </Label>
                  <Input
                    id="fatherName"
                    type="text"
                    className="input-field"
                    placeholder="Enter father's name"
                    value={data.fatherName || ""}
                    onChange={(e) => handleInputChange("fatherName", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="motherName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Mother's Name
                  </Label>
                  <Input
                    id="motherName"
                    type="text"
                    className="input-field"
                    placeholder="Enter mother's name"
                    value={data.motherName || ""}
                    onChange={(e) => handleInputChange("motherName", e.target.value)}
                  />
                </div>


              </div>

              <div className="mt-6">
                <Label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">
                  Address
                </Label>
                <Textarea
                  id="address"
                  className="input-field"
                  rows={3}
                  placeholder="Enter your full address"
                  value={data.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <Label htmlFor="place" className="block text-sm font-semibold text-slate-700 mb-2">
                    Place
                  </Label>
                  <Input
                    id="place"
                    className="input-field"
                    placeholder="e.g., Chennai, Mumbai, Bangalore"
                    value={data.place || ""}
                    onChange={(e) => handleInputChange("place", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="areasOfInterest" className="block text-sm font-semibold text-slate-700 mb-2">
                  Areas of Interest
                </Label>
                <Textarea
                  id="areasOfInterest"
                  className="input-field"
                  rows={2}
                  placeholder="List 3 subjects you are well versed in (comma separated)"
                  value={Array.isArray(data.areasOfInterest) ? data.areasOfInterest.join(', ') : data.areasOfInterest || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    onChange({ areasOfInterest: value as any });
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value.trim()) {
                      const interests = value.split(',').map(item => item.trim()).filter(Boolean);
                      onChange({ areasOfInterest: interests });
                    }
                  }}
                />
              </div>

              <div className="mt-6">
                <Label htmlFor="hobbies" className="block text-sm font-semibold text-slate-700 mb-2">
                  Hobbies
                </Label>
                <Textarea
                  id="hobbies"
                  className="input-field"
                  rows={2}
                  placeholder="Your hobbies and interests (comma separated)"
                  value={Array.isArray(data.hobbies) ? data.hobbies.join(', ') : data.hobbies || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    onChange({ hobbies: value as any });
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value.trim()) {
                      const hobbies = value.split(',').map(item => item.trim()).filter(Boolean);
                      onChange({ hobbies: hobbies });
                    }
                  }}
                />
              </div>
            </div>

            {/* Profile Photo Section */}
            <div className="flex flex-col items-center">
              <Label className="block text-sm font-semibold text-slate-700 mb-4">
                Profile Photo
              </Label>
              <div className="relative">
                <motion.img
                  src={data.profilePhotoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"}
                  alt="Profile"
                  className="profile-photo w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
                <Button
                  type="button"
                  size="sm"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 shadow-lg p-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? (
                    <div className="spinner"></div>
                  ) : (
                    <Camera size={16} />
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 flex items-center"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
              >
                <Upload className="mr-2" size={14} />
                {uploadingPhoto ? "Uploading..." : "Change Photo"}
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <Label htmlFor="careerObjective" className="block text-sm font-semibold text-slate-700 mb-2">
                Career Objective
              </Label>
              <Textarea
                id="careerObjective"
                className="input-field"
                rows={3}
                placeholder="Describe your career goals and aspirations"
                value={data.careerObjective || ""}
                onChange={(e) => handleInputChange("careerObjective", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="professionalSummary" className="block text-sm font-semibold text-slate-700 mb-2">
                Professional Summary
              </Label>
              <Textarea
                id="professionalSummary"
                className="input-field"
                rows={4}
                placeholder="Provide a brief overview of your professional background"
                value={data.professionalSummary || ""}
                onChange={(e) => handleInputChange("professionalSummary", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
