import { motion } from "framer-motion";
import { Code, Plus, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { generateId } from "@/lib/utils";
import type { Profile, Project } from "@shared/schema";

interface ProjectsProps {
  data: Partial<Profile>;
  onChange: (data: Partial<Profile>) => void;
}

export default function Projects({ data, onChange }: ProjectsProps) {
  // Handle nested projects structure from API response
  let projectsData = data.projects;
  if (projectsData && typeof projectsData === 'object' && !Array.isArray(projectsData) && 'projects' in projectsData) {
    projectsData = (projectsData as any).projects;
  }
  const projects = Array.isArray(projectsData) ? projectsData : [];

  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      name: "",
      description: "",
      link: "",
      technologies: [],
    };

    onChange({ 
      ...data, 
      projects: [...projects, newProject] 
    });
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    );

    onChange({ ...data, projects: updatedProjects });
  };

  const removeProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    onChange({ ...data, projects: updatedProjects });
  };

  return (
    <motion.section 
      id="projects"
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="section-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Code className="text-purple-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
                <p className="text-slate-600">Your notable projects and contributions</p>
              </div>
            </div>
            <Button 
              onClick={addProject}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="mr-2" size={16} />
              Add Project
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-8 text-slate-500">
                <Code className="mx-auto mb-4" size={48} />
                <p>No projects yet. Click "Add Project" to showcase your work.</p>
              </div>
            ) : (
              projects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="mb-4">
                    <Label className="block text-sm font-semibold text-slate-700 mb-2">
                      Project Name *
                    </Label>
                    <Input
                      className="input-field"
                      placeholder="Project Name"
                      value={project.name}
                      onChange={(e) => updateProject(project.id, "name", e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <Label className="block text-sm font-semibold text-slate-700 mb-2">
                      Project Link
                    </Label>
                    <div className="relative">
                      <Input
                        type="url"
                        className="input-field pr-10"
                        placeholder="https://project-url.com"
                        value={project.link || ""}
                        onChange={(e) => updateProject(project.id, "link", e.target.value)}
                      />
                      {project.link && (
                        <ExternalLink 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
                          size={16} 
                        />
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="block text-sm font-semibold text-slate-700 mb-2">
                      Technologies Used
                    </Label>
                    <Input
                      className="input-field"
                      placeholder="React, Node.js, MongoDB (comma separated)"
                      value={project.technologies?.join(", ") || ""}
                      onChange={(e) => updateProject(
                        project.id, 
                        "technologies", 
                        e.target.value.split(",").map(tech => tech.trim()).filter(Boolean)
                      )}
                    />
                  </div>

                  <div className="mb-4">
                    <Label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </Label>
                    <Textarea
                      className="input-field"
                      rows={4}
                      placeholder="Describe your project"
                      value={project.description}
                      onChange={(e) => updateProject(project.id, "description", e.target.value)}
                    />
                  </div>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="skill-badge bg-purple-100 text-purple-800 border border-purple-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(project.id)}
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
