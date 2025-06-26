import { motion } from "framer-motion";
import { Trophy, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { generateId } from "@/lib/utils";
import type { Profile, Award } from "@shared/schema";

interface AwardsProps {
  data: Partial<Profile>;
  onChange: (data: Partial<Profile>) => void;
}

export default function Awards({ data, onChange }: AwardsProps) {
  // Handle nested awards structure from API response
  let awardsData = data.awards;
  if (awardsData && typeof awardsData === 'object' && !Array.isArray(awardsData) && 'awards' in awardsData) {
    awardsData = (awardsData as any).awards;
  }
  const awards = Array.isArray(awardsData) ? awardsData : [];

  const addAward = () => {
    const newAward: Award = {
      id: generateId(),
      name: "",
      year: new Date().getFullYear(),
      description: "",
    };

    onChange({ 
      ...data, 
      awards: [...awards, newAward] 
    });
  };

  const updateAward = (id: string, field: keyof Award, value: string | number) => {
    const updatedAwards = awards.map(award =>
      award.id === id ? { ...award, [field]: value } : award
    );

    onChange({ ...data, awards: updatedAwards });
  };

  const removeAward = (id: string) => {
    const updatedAwards = awards.filter(award => award.id !== id);
    onChange({ ...data, awards: updatedAwards });
  };

  return (
    <motion.section 
      id="awards"
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="section-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Trophy className="text-yellow-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Awards & Recognition</h2>
                <p className="text-slate-600">Your achievements and awards</p>
              </div>
            </div>
            <Button 
              onClick={addAward}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Plus className="mr-2" size={16} />
              Add Award
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awards.length === 0 ? (
              <div className="col-span-full text-center py-8 text-slate-500">
                <Trophy className="mx-auto mb-4" size={48} />
                <p>No awards yet. Click "Add Award" to showcase your achievements.</p>
              </div>
            ) : (
              awards.map((award, index) => (
                <motion.div 
                  key={award.id}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="mb-4">
                    <Label className="block text-sm font-semibold text-slate-700 mb-2">
                      Award Name *
                    </Label>
                    <Input
                      className="input-field"
                      placeholder="Award name"
                      value={award.name}
                      onChange={(e) => updateAward(award.id, "name", e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <Label className="block text-sm font-semibold text-slate-700 mb-2">
                      Year
                    </Label>
                    <Input
                      type="number"
                      className="input-field"
                      placeholder="2024"
                      value={award.year}
                      onChange={(e) => updateAward(award.id, "year", parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="mb-4">
                    <Label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </Label>
                    <Textarea
                      className="input-field"
                      rows={3}
                      placeholder="Describe the award and why you received it"
                      value={award.description || ""}
                      onChange={(e) => updateAward(award.id, "description", e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAward(award.id)}
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
