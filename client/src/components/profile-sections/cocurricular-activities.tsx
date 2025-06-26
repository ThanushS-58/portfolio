import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Users, Calendar, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateId } from "@/lib/utils";
import type { CocurricularActivity } from "@shared/schema";

interface CocurricularActivitiesProps {
  profileId: number;
}

export default function CocurricularActivities({ profileId }: CocurricularActivitiesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery<CocurricularActivity[]>({
    queryKey: [`/api/profiles/${profileId}/cocurricular`]
  });

  const createActivityMutation = useMutation({
    mutationFn: async (activity: Omit<CocurricularActivity, 'id'>) => {
      const response = await apiRequest("POST", `/api/profiles/${profileId}/cocurricular`, activity);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${profileId}/cocurricular`] });
      toast({ title: "Activity added successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateActivityMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CocurricularActivity> & { id: string }) => {
      const response = await apiRequest("PUT", `/api/profiles/${profileId}/cocurricular/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${profileId}/cocurricular`] });
    }
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/profiles/${profileId}/cocurricular/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${profileId}/cocurricular`] });
      toast({ title: "Activity deleted" });
    }
  });

  const addActivity = () => {
    const newActivity = {
      activity: "",
      role: "",
      description: "",
      startDate: "",
      endDate: "",
      achievements: ""
    };
    createActivityMutation.mutate(newActivity);
  };

  const updateActivity = (id: string, field: keyof CocurricularActivity, value: string) => {
    updateActivityMutation.mutate({ id, [field]: value });
  };

  const deleteActivity = (id: string) => {
    deleteActivityMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Card className="section-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.section 
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
                <Users className="text-rose-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Co-Curricular Activities</h2>
                <p className="text-slate-600">Extracurricular activities and achievements</p>
              </div>
            </div>
            <Button 
              onClick={addActivity}
              className="bg-rose-600 hover:bg-rose-700 text-white"
              disabled={createActivityMutation.isPending}
            >
              <Plus className="mr-2" size={16} />
              Add Activity
            </Button>
          </div>

          <div className="space-y-6">
            {activities.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border border-slate-200 rounded-lg">
                <Users className="mx-auto mb-4" size={48} />
                <p className="text-lg mb-2">No co-curricular activities yet</p>
                <p className="text-sm">Add your extracurricular activities and achievements</p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <motion.div 
                  key={activity.id}
                  className="p-6 border border-slate-200 rounded-lg bg-white"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Award className="text-rose-600 mr-2" size={20} />
                      <h3 className="text-lg font-semibold text-slate-800">Activity {index + 1}</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteActivity(activity.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={deleteActivityMutation.isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        Activity Name *
                      </Label>
                      <Input
                        className="input-field"
                        placeholder="e.g., Basketball Team Captain"
                        value={activity.activity}
                        onChange={(e) => updateActivity(activity.id, "activity", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        Role/Position
                      </Label>
                      <Input
                        className="input-field"
                        placeholder="e.g., Captain, Member, Organizer"
                        value={activity.role || ""}
                        onChange={(e) => updateActivity(activity.id, "role", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        Start Date
                      </Label>
                      <Input
                        type="date"
                        className="input-field"
                        value={activity.startDate || ""}
                        onChange={(e) => updateActivity(activity.id, "startDate", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        End Date
                      </Label>
                      <Input
                        type="date"
                        className="input-field"
                        value={activity.endDate || ""}
                        onChange={(e) => updateActivity(activity.id, "endDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </Label>
                    <Textarea
                      className="input-field"
                      rows={3}
                      placeholder="Describe your responsibilities and contributions"
                      value={activity.description || ""}
                      onChange={(e) => updateActivity(activity.id, "description", e.target.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <Label className="block text-sm font-semibold text-slate-700 mb-2">
                      Achievements & Recognition
                    </Label>
                    <Textarea
                      className="input-field"
                      rows={2}
                      placeholder="Awards, recognitions, or notable achievements"
                      value={activity.achievements || ""}
                      onChange={(e) => updateActivity(activity.id, "achievements", e.target.value)}
                    />
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