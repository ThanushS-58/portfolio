import { motion } from "framer-motion";
import { PlusCircle, Plus, Trash2, Globe, Heart, BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateId } from "@/lib/utils";
import type { Profile, Language, Publication, VolunteerWork } from "@shared/schema";

interface AdditionalInfoProps {
  data: Partial<Profile>;
  onChange: (data: Partial<Profile>) => void;
}

export default function AdditionalInfo({ data, onChange }: AdditionalInfoProps) {
  // Handle nested data structures from API response
  let languagesData = data.languages;
  if (languagesData && typeof languagesData === 'object' && !Array.isArray(languagesData) && 'languages' in languagesData) {
    languagesData = (languagesData as any).languages;
  }
  const languages = Array.isArray(languagesData) ? languagesData : [];

  let hobbiesData = data.hobbies;
  if (hobbiesData && typeof hobbiesData === 'object' && !Array.isArray(hobbiesData) && 'hobbies' in hobbiesData) {
    hobbiesData = (hobbiesData as any).hobbies;
  }
  const hobbies = Array.isArray(hobbiesData) ? hobbiesData : [];

  let publicationsData = data.publications;
  if (publicationsData && typeof publicationsData === 'object' && !Array.isArray(publicationsData) && 'publications' in publicationsData) {
    publicationsData = (publicationsData as any).publications;
  }
  const publications = Array.isArray(publicationsData) ? publicationsData : [];

  let volunteerWorkData = data.volunteerWork;
  if (volunteerWorkData && typeof volunteerWorkData === 'object' && !Array.isArray(volunteerWorkData) && 'volunteerWork' in volunteerWorkData) {
    volunteerWorkData = (volunteerWorkData as any).volunteerWork;
  }
  const volunteerWork = Array.isArray(volunteerWorkData) ? volunteerWorkData : [];

  // Language Management
  const addLanguage = () => {
    const newLanguage: Language = {
      id: generateId(),
      name: "",
      proficiency: "basic",
    };
    onChange({ ...data, languages: [...languages, newLanguage] });
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    const updatedLanguages = languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    onChange({ ...data, languages: updatedLanguages });
  };

  const removeLanguage = (id: string) => {
    const updatedLanguages = languages.filter(lang => lang.id !== id);
    onChange({ ...data, languages: updatedLanguages });
  };

  // Hobby Management
  const addHobby = () => {
    onChange({ ...data, hobbies: [...hobbies, ""] });
  };

  const updateHobby = (index: number, value: string) => {
    const updatedHobbies = hobbies.map((hobby, i) => i === index ? value : hobby);
    onChange({ ...data, hobbies: updatedHobbies });
  };

  const removeHobby = (index: number) => {
    const updatedHobbies = hobbies.filter((_, i) => i !== index);
    onChange({ ...data, hobbies: updatedHobbies });
  };

  // Publication Management
  const addPublication = () => {
    const newPublication: Publication = {
      id: generateId(),
      title: "",
      journal: "",
      year: new Date().getFullYear(),
      url: "",
    };
    onChange({ ...data, publications: [...publications, newPublication] });
  };

  const updatePublication = (id: string, field: keyof Publication, value: string | number) => {
    const updatedPublications = publications.map(pub =>
      pub.id === id ? { ...pub, [field]: value } : pub
    );
    onChange({ ...data, publications: updatedPublications });
  };

  const removePublication = (id: string) => {
    const updatedPublications = publications.filter(pub => pub.id !== id);
    onChange({ ...data, publications: updatedPublications });
  };

  // Volunteer Work Management
  const addVolunteerWork = () => {
    const newVolunteerWork: VolunteerWork = {
      id: generateId(),
      organization: "",
      role: "",
      description: "",
      startDate: "",
      endDate: "",
    };
    onChange({ ...data, volunteerWork: [...volunteerWork, newVolunteerWork] });
  };

  const updateVolunteerWork = (id: string, field: keyof VolunteerWork, value: string) => {
    const updatedVolunteerWork = volunteerWork.map(vol =>
      vol.id === id ? { ...vol, [field]: value } : vol
    );
    onChange({ ...data, volunteerWork: updatedVolunteerWork });
  };

  const removeVolunteerWork = (id: string) => {
    const updatedVolunteerWork = volunteerWork.filter(vol => vol.id !== id);
    onChange({ ...data, volunteerWork: updatedVolunteerWork });
  };

  return (
    <motion.section 
      id="additional"
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="section-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mr-4">
                <PlusCircle className="text-rose-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Additional Information</h2>
                <p className="text-slate-600">Languages, hobbies, and other details</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Languages Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Globe className="text-rose-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold text-slate-800">Languages</h3>
                  </div>
                  <Button 
                    onClick={addLanguage}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <Plus className="mr-1" size={14} />
                    Add Language
                  </Button>
                </div>

                <div className="space-y-4">
                  {languages.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 border border-slate-200 rounded-lg">
                      <Globe className="mx-auto mb-2" size={32} />
                      <p>No languages yet.</p>
                    </div>
                  ) : (
                    languages.map((lang, index) => (
                      <motion.div 
                        key={lang.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <div className="flex-1 mr-4">
                          <Input
                            className="input-field"
                            placeholder="Language"
                            value={lang.name}
                            onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                          />
                        </div>
                        <div className="mr-4">
                          <Select 
                            value={lang.proficiency} 
                            onValueChange={(value: any) => updateLanguage(lang.id, "proficiency", value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="conversational">Conversational</SelectItem>
                              <SelectItem value="fluent">Fluent</SelectItem>
                              <SelectItem value="native">Native</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLanguage(lang.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Hobbies Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Heart className="text-rose-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold text-slate-800">Hobbies & Interests</h3>
                  </div>
                  <Button 
                    onClick={addHobby}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <Plus className="mr-1" size={14} />
                    Add Hobby
                  </Button>
                </div>

                <div className="space-y-4">
                  {hobbies.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 border border-slate-200 rounded-lg">
                      <Heart className="mx-auto mb-2" size={32} />
                      <p>No hobbies yet.</p>
                    </div>
                  ) : (
                    hobbies.map((hobby, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-center p-4 border border-slate-200 rounded-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Input
                          className="input-field flex-1 mr-4"
                          placeholder="Hobby or interest"
                          value={hobby}
                          onChange={(e) => updateHobby(index, e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHobby(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Publications Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BookOpen className="text-rose-600 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800">Publications</h3>
                </div>
                <Button 
                  onClick={addPublication}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1" size={14} />
                  Add Publication
                </Button>
              </div>

              <div className="space-y-4">
                {publications.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 border border-slate-200 rounded-lg">
                    <BookOpen className="mx-auto mb-2" size={32} />
                    <p>No publications yet.</p>
                  </div>
                ) : (
                  publications.map((pub, index) => (
                    <motion.div 
                      key={pub.id}
                      className="border border-slate-200 rounded-lg p-6"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Input
                          className="input-field"
                          placeholder="Publication title"
                          value={pub.title}
                          onChange={(e) => updatePublication(pub.id, "title", e.target.value)}
                        />
                        <Input
                          className="input-field"
                          placeholder="Journal/Platform"
                          value={pub.journal}
                          onChange={(e) => updatePublication(pub.id, "journal", e.target.value)}
                        />
                        <Input
                          type="number"
                          className="input-field"
                          placeholder="Year"
                          value={pub.year || ""}
                          onChange={(e) => updatePublication(pub.id, "year", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <Input
                        type="url"
                        className="input-field mb-4"
                        placeholder="Publication URL (optional)"
                        value={pub.url || ""}
                        onChange={(e) => updatePublication(pub.id, "url", e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePublication(pub.id)}
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
            </div>

            {/* Volunteer Work Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="text-rose-600 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800">Volunteer Work</h3>
                </div>
                <Button 
                  onClick={addVolunteerWork}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1" size={14} />
                  Add Volunteer Work
                </Button>
              </div>

              <div className="space-y-4">
                {volunteerWork.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 border border-slate-200 rounded-lg">
                    <Users className="mx-auto mb-2" size={32} />
                    <p>No volunteer work yet.</p>
                  </div>
                ) : (
                  volunteerWork.map((vol, index) => (
                    <motion.div 
                      key={vol.id}
                      className="border border-slate-200 rounded-lg p-6"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input
                          className="input-field"
                          placeholder="Organization"
                          value={vol.organization}
                          onChange={(e) => updateVolunteerWork(vol.id, "organization", e.target.value)}
                        />
                        <Input
                          className="input-field"
                          placeholder="Role"
                          value={vol.role}
                          onChange={(e) => updateVolunteerWork(vol.id, "role", e.target.value)}
                        />
                        <Input
                          type="date"
                          className="input-field"
                          placeholder="Start Date"
                          value={vol.startDate || ""}
                          onChange={(e) => updateVolunteerWork(vol.id, "startDate", e.target.value)}
                        />
                        <Input
                          type="date"
                          className="input-field"
                          placeholder="End Date"
                          value={vol.endDate || ""}
                          onChange={(e) => updateVolunteerWork(vol.id, "endDate", e.target.value)}
                        />
                      </div>
                      <Textarea
                        className="input-field mb-4"
                        rows={3}
                        placeholder="Description of volunteer work"
                        value={vol.description}
                        onChange={(e) => updateVolunteerWork(vol.id, "description", e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVolunteerWork(vol.id)}
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
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
