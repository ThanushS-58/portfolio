import { motion } from "framer-motion";
import { Settings, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateId } from "@/lib/utils";
import type { Profile, Skill } from "@shared/schema";

interface SkillsProps {
  data: Partial<Profile>;
  onChange: (data: Partial<Profile>) => void;
}

export default function Skills({ data, onChange }: SkillsProps) {
  // Handle nested skills structure from API response
  let technicalSkillsData = data.technicalSkills;
  if (technicalSkillsData && typeof technicalSkillsData === 'object' && !Array.isArray(technicalSkillsData) && 'technicalSkills' in technicalSkillsData) {
    technicalSkillsData = (technicalSkillsData as any).technicalSkills;
  }
  const technicalSkills = Array.isArray(technicalSkillsData) ? technicalSkillsData : [];

  let softSkillsData = data.softSkills;
  if (softSkillsData && typeof softSkillsData === 'object' && !Array.isArray(softSkillsData) && 'softSkills' in softSkillsData) {
    softSkillsData = (softSkillsData as any).softSkills;
  }
  const softSkills = Array.isArray(softSkillsData) ? softSkillsData : [];

  const addSkill = (type: 'technical' | 'soft') => {
    const newSkill: Skill = {
      id: generateId(),
      name: "",
      level: "beginner",
    };

    if (type === 'technical') {
      onChange({ 
        ...data, 
        technicalSkills: [...technicalSkills, newSkill] 
      });
    } else {
      onChange({ 
        ...data, 
        softSkills: [...softSkills, newSkill] 
      });
    }
  };

  const updateSkill = (type: 'technical' | 'soft', id: string, field: keyof Skill, value: string) => {
    if (type === 'technical') {
      const updatedSkills = technicalSkills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      );
      onChange({ ...data, technicalSkills: updatedSkills });
    } else {
      const updatedSkills = softSkills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      );
      onChange({ ...data, softSkills: updatedSkills });
    }
  };

  const removeSkill = (type: 'technical' | 'soft', id: string) => {
    if (type === 'technical') {
      const updatedSkills = technicalSkills.filter(skill => skill.id !== id);
      onChange({ ...data, technicalSkills: updatedSkills });
    } else {
      const updatedSkills = softSkills.filter(skill => skill.id !== id);
      onChange({ ...data, softSkills: updatedSkills });
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'advanced': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intermediate': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const SkillSection = ({ 
    title, 
    skills, 
    type, 
    color 
  }: { 
    title: string; 
    skills: Skill[]; 
    type: 'technical' | 'soft';
    color: string;
  }) => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <Button 
          onClick={() => addSkill(type)}
          variant="outline"
          size="sm"
          className={`flex items-center ${color} hover:${color}`}
        >
          <Plus className="mr-1" size={14} />
          Add Skill
        </Button>
      </div>

      <div className="space-y-4">
        {skills.length === 0 ? (
          <div className="text-center py-6 text-slate-500 border border-slate-200 rounded-lg">
            <p>No {type} skills yet. Click "Add Skill" to get started.</p>
          </div>
        ) : (
          skills.map((skill, index) => (
            <motion.div 
              key={skill.id}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="flex-1 mr-4">
                <Input
                  className="input-field"
                  placeholder="Skill name"
                  value={skill.name}
                  onChange={(e) => updateSkill(type, skill.id, "name", e.target.value)}
                />
              </div>

              <div className="mr-4">
                <Select 
                  value={skill.level} 
                  onValueChange={(value: any) => updateSkill(type, skill.id, "level", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {skill.name && (
                <div className="mr-4">
                  <span className={`skill-badge ${getSkillLevelColor(skill.level)} px-3 py-1 rounded-full text-xs font-medium border`}>
                    {skill.level}
                  </span>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSkill(type, skill.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={16} />
              </Button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <motion.section 
      id="skills"
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="section-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                <Settings className="text-amber-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Skills</h2>
                <p className="text-slate-600">Your technical and soft skills</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SkillSection 
              title="Technical Skills" 
              skills={technicalSkills} 
              type="technical"
              color="bg-amber-500 text-white"
            />
            
            <SkillSection 
              title="Soft Skills" 
              skills={softSkills} 
              type="soft"
              color="bg-amber-500 text-white"
            />
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
