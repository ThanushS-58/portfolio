import { motion } from "framer-motion";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { generateId } from "@/lib/utils";
import type { Profile, Education } from "@shared/schema";

interface EducationProps {
  data: Partial<Profile>;
  onChange: (data: Partial<Profile>) => void;
}

export default function Education({ data, onChange }: EducationProps) {
  // Handle nested education structure from API response
  let educationData = data.education;
  if (educationData && typeof educationData === 'object' && !Array.isArray(educationData) && 'education' in educationData) {
    educationData = (educationData as any).education;
  }
  const education = Array.isArray(educationData) ? educationData : [];

  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      degree: "",
      institution: "",
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      grade: "",
    };

    const updatedEducation = [...education, newEducation];
    onChange({ 
      ...data, 
      education: updatedEducation
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string | number) => {
    const updatedEducation = education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );

    onChange({ ...data, education: updatedEducation });
  };

  const removeEducation = (id: string) => {
    const updatedEducation = education.filter(edu => edu.id !== id);
    onChange({ ...data, education: updatedEducation });
  };

  return (
    <motion.section 
      id="education"
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="section-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <GraduationCap className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Education</h2>
                <p className="text-slate-600">Your academic background</p>
              </div>
            </div>
            <Button 
              onClick={addEducation}
              className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <Plus className="mr-2" size={16} />
              Add Education
            </Button>
          </div>

          <div className="space-y-4">
            {education.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <GraduationCap className="mx-auto mb-4" size={48} />
                <p>No education entries yet. Click "Add Education" to get started.</p>
              </div>
            ) : (
              education.map((edu, index) => (
                <motion.div 
                  key={edu.id}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        Degree *
                      </Label>
                      <Input
                        className="input-field"
                        placeholder="Bachelor of Science in Computer Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        Institution *
                      </Label>
                      <Input
                        className="input-field"
                        placeholder="University Name"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        Start Year
                      </Label>
                      <Input
                        type="number"
                        className="input-field"
                        placeholder="2020"
                        value={edu.startYear}
                        onChange={(e) => updateEducation(edu.id, "startYear", parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        End Year
                      </Label>
                      <Input
                        type="number"
                        className="input-field"
                        placeholder="2024"
                        value={edu.endYear}
                        onChange={(e) => updateEducation(edu.id, "endYear", parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        Grade/GPA
                      </Label>
                      <Input
                        className="input-field"
                        placeholder="3.8/4.0"
                        value={edu.grade || ""}
                        onChange={(e) => updateEducation(edu.id, "grade", e.target.value)}
                      />
                    </div>

                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
