import { motion } from "framer-motion";
import { Award, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { generateId } from "@/lib/utils";
import type { Profile, Certification } from "@shared/schema";

interface CertificationsProps {
  data: Partial<Profile>;
  onChange: (data: Partial<Profile>) => void;
}

export default function Certifications({ data, onChange }: CertificationsProps) {
  // Handle nested certifications structure from API response
  let certificationsData = data.certifications;
  if (certificationsData && typeof certificationsData === 'object' && !Array.isArray(certificationsData) && 'certifications' in certificationsData) {
    certificationsData = (certificationsData as any).certifications;
  }
  const certifications = Array.isArray(certificationsData) ? certificationsData : [];

  const addCertification = () => {
    const newCertification: Certification = {
      id: generateId(),
      name: "",
      year: new Date().getFullYear(),
      issuer: "",
    };

    onChange({ 
      ...data, 
      certifications: [...certifications, newCertification] 
    });
  };

  const updateCertification = (id: string, field: keyof Certification, value: string | number) => {
    const updatedCertifications = certifications.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    );

    onChange({ ...data, certifications: updatedCertifications });
  };

  const removeCertification = (id: string) => {
    const updatedCertifications = certifications.filter(cert => cert.id !== id);
    onChange({ ...data, certifications: updatedCertifications });
  };

  return (
    <motion.section 
      id="certifications"
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="section-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                <Award className="text-teal-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Certifications</h2>
                <p className="text-slate-600">Your professional certifications</p>
              </div>
            </div>
            <Button 
              onClick={addCertification}
              className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              <Plus className="mr-2" size={16} />
              Add Certification
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.length === 0 ? (
              <div className="col-span-full text-center py-8 text-slate-500">
                <Award className="mx-auto mb-4" size={48} />
                <p>No certifications yet. Click "Add Certification" to showcase your credentials.</p>
              </div>
            ) : (
              certifications.map((cert, index) => (
                <motion.div 
                  key={cert.id}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="mb-4">
                    <Label className="block text-sm font-semibold text-slate-700 mb-2">
                      Certification Name *
                    </Label>
                    <Input
                      className="input-field"
                      placeholder="Certification name"
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <Label className="block text-sm font-semibold text-slate-700 mb-2">
                      Issuing Organization
                    </Label>
                    <Input
                      className="input-field"
                      placeholder="AWS, Google, Microsoft, etc."
                      value={cert.issuer || ""}
                      onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
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
                      value={cert.year}
                      onChange={(e) => updateCertification(cert.id, "year", parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(cert.id)}
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
