import { motion } from "framer-motion";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { generateId } from "@/lib/utils";
import type { Profile, Experience } from "@shared/schema";

interface ExperienceProps {
  data: Partial<Profile>;
  onChange: (data: Partial<Profile>) => void;
}

export default function Experience({ data, onChange }: ExperienceProps) {
  // Handle nested experience structure from API response
  let experienceData = data.experience;
  if (experienceData && typeof experienceData === 'object' && !Array.isArray(experienceData) && 'experience' in experienceData) {
    experienceData = (experienceData as any).experience;
  }
  const experience = Array.isArray(experienceData) ? experienceData : [];

  const addExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    };

    onChange({ 
      ...data, 
      experience: [...experience, newExperience] 
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    const updatedExperience = experience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );

    onChange({ ...data, experience: updatedExperience });
  };

  const removeExperience = (id: string) => {
    const updatedExperience = experience.filter(exp => exp.id !== id);
    onChange({ ...data, experience: updatedExperience });
  };

  return (
    <motion.section 
      id="experience"
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="section-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                <Briefcase className="text-emerald-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Work Experience</h2>
                <p className="text-slate-600">Your professional experience</p>
              </div>
            </div>
            <Button 
              onClick={addExperience}
              className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Plus className="mr-2" size={16} />
              Add Experience
            </Button>
          </div>

          <div className="space-y-4">
            {experience.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Briefcase className="mx-auto mb-4" size={48} />
                <p>No work experience entries yet. Click "Add Experience" to get started.</p>
              </div>
            ) : (
              experience.map((exp, index) => (
                <motion.div 
                  key={exp.id}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        Job Title *
                      </Label>
                      <Input
                        className="input-field"
                        placeholder="Senior Software Engineer"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        Company *
                      </Label>
                      <Input
                        className="input-field"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        Start Date
                      </Label>
                      <Input
                        type="date"
                        className="input-field"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        End Date
                      </Label>
                      <Input
                        type="date"
                        className="input-field"
                        value={exp.endDate || ""}
                        disabled={exp.current}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      />
                      <div className="flex items-center mt-2">
                        <Checkbox
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onCheckedChange={(checked) => {
                            updateExperience(exp.id, "current", checked as boolean);
                            if (checked) {
                              updateExperience(exp.id, "endDate", "");
                            }
                          }}
                        />
                        <Label htmlFor={`current-${exp.id}`} className="ml-2 text-sm text-slate-600">
                          I currently work here
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </Label>
                    <Textarea
                      className="input-field"
                      rows={4}
                      placeholder="Describe your responsibilities and achievements"
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(exp.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="mr-1" size={16} />
                      Remove
                    </Button>
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
