import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Code, Trophy, Star, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { CodingProfile } from "@shared/schema";

interface CodingProfilesProps {
  profileId: number;
}

const CODING_PLATFORMS = [
  { value: "leetcode", label: "LeetCode", icon: "🟢" },
  { value: "hackerrank", label: "HackerRank", icon: "🟢" },
  { value: "codechef", label: "CodeChef", icon: "🟤" },
  { value: "codeforces", label: "Codeforces", icon: "🔴" },
  { value: "atcoder", label: "AtCoder", icon: "⚪" },
  { value: "topcoder", label: "TopCoder", icon: "🔵" },
  { value: "geeksforgeeks", label: "GeeksforGeeks", icon: "🟢" },
  { value: "hackerearth", label: "HackerEarth", icon: "🔵" }
];

export default function CodingProfiles({ profileId }: CodingProfilesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: codingProfiles = [], isLoading } = useQuery<CodingProfile[]>({
    queryKey: [`/api/profiles/${profileId}/coding-profiles`]
  });

  const createProfileMutation = useMutation({
    mutationFn: async (profile: Omit<CodingProfile, 'id'>) => {
      const response = await apiRequest("POST", `/api/profiles/${profileId}/coding-profiles`, profile);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${profileId}/coding-profiles`] });
      toast({ title: "Coding profile added successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CodingProfile> & { id: string }) => {
      const response = await apiRequest("PUT", `/api/profiles/${profileId}/coding-profiles/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${profileId}/coding-profiles`] });
    }
  });

  const deleteProfileMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/profiles/${profileId}/coding-profiles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${profileId}/coding-profiles`] });
      toast({ title: "Coding profile deleted" });
    }
  });

  const addCodingProfile = () => {
    const newProfile = {
      platform: "leetcode",
      username: "",
      profileUrl: "",
      ranking: 0,
      problemsSolved: 0,
      contestRating: 0,
      achievements: "",
      badges: []
    };
    createProfileMutation.mutate(newProfile);
  };

  const updateProfile = (id: string, field: keyof CodingProfile, value: any) => {
    updateProfileMutation.mutate({ id, [field]: value });
  };

  const deleteProfile = (id: string) => {
    deleteProfileMutation.mutate(id);
  };

  const generateProfileUrl = (platform: string, username: string) => {
    const baseUrls: Record<string, string> = {
      leetcode: "https://leetcode.com/",
      hackerrank: "https://www.hackerrank.com/profile/",
      codechef: "https://www.codechef.com/users/",
      codeforces: "https://codeforces.com/profile/",
      atcoder: "https://atcoder.jp/users/",
      topcoder: "https://www.topcoder.com/members/",
      geeksforgeeks: "https://auth.geeksforgeeks.org/user/",
      hackerearth: "https://www.hackerearth.com/@"
    };
    return username ? `${baseUrls[platform] || ""}${username}` : "";
  };

  if (isLoading) {
    return (
      <Card className="section-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Code className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Coding Profiles</h2>
                <p className="text-slate-600">Your competitive programming and coding achievements</p>
              </div>
            </div>
            <Button 
              onClick={addCodingProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={createProfileMutation.isPending}
            >
              <Plus className="mr-2" size={16} />
              Add Profile
            </Button>
          </div>

          <div className="space-y-6">
            {codingProfiles.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border border-slate-200 rounded-lg">
                <Code className="mx-auto mb-4" size={48} />
                <p className="text-lg mb-2">No coding profiles yet</p>
                <p className="text-sm">Add your competitive programming profiles and achievements</p>
              </div>
            ) : (
              codingProfiles.map((profile, index) => {
                const platformInfo = CODING_PLATFORMS.find(p => p.value === profile.platform);
                const profileUrl = profile.profileUrl || generateProfileUrl(profile.platform, profile.username);
                
                return (
                  <motion.div 
                    key={profile.id}
                    className="p-6 border border-slate-200 rounded-lg bg-white"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{platformInfo?.icon || "🔗"}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">
                            {platformInfo?.label || profile.platform}
                          </h3>
                          {profileUrl && (
                            <a 
                              href={profileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                            >
                              <ExternalLink size={12} className="mr-1" />
                              View Profile
                            </a>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProfile(profile.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deleteProfileMutation.isPending}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-sm font-semibold text-slate-700 mb-2">
                          Platform *
                        </Label>
                        <Select 
                          value={profile.platform} 
                          onValueChange={(value) => updateProfile(profile.id, "platform", value)}
                        >
                          <SelectTrigger className="input-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CODING_PLATFORMS.map((platform) => (
                              <SelectItem key={platform.value} value={platform.value}>
                                <span className="flex items-center">
                                  <span className="mr-2">{platform.icon}</span>
                                  {platform.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="block text-sm font-semibold text-slate-700 mb-2">
                          Username *
                        </Label>
                        <Input
                          className="input-field"
                          placeholder="Your username on the platform"
                          value={profile.username}
                          onChange={(e) => updateProfile(profile.id, "username", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-semibold text-slate-700 mb-2">
                          Profile URL
                        </Label>
                        <Input
                          className="input-field"
                          placeholder="Direct link to your profile"
                          value={profile.profileUrl || ""}
                          onChange={(e) => updateProfile(profile.id, "profileUrl", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-semibold text-slate-700 mb-2">
                          Current Ranking
                        </Label>
                        <Input
                          type="number"
                          className="input-field"
                          placeholder="Your current rank"
                          value={profile.ranking || ""}
                          onChange={(e) => updateProfile(profile.id, "ranking", parseInt(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-semibold text-slate-700 mb-2">
                          Problems Solved
                        </Label>
                        <Input
                          type="number"
                          className="input-field"
                          placeholder="Number of problems solved"
                          value={profile.problemsSolved || ""}
                          onChange={(e) => updateProfile(profile.id, "problemsSolved", parseInt(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-semibold text-slate-700 mb-2">
                          Contest Rating
                        </Label>
                        <Input
                          type="number"
                          className="input-field"
                          placeholder="Your contest rating"
                          value={profile.contestRating || ""}
                          onChange={(e) => updateProfile(profile.id, "contestRating", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label className="block text-sm font-semibold text-slate-700 mb-2">
                        Achievements & Recognition
                      </Label>
                      <Textarea
                        className="input-field"
                        rows={3}
                        placeholder="Notable achievements, contest wins, certifications, etc."
                        value={profile.achievements || ""}
                        onChange={(e) => updateProfile(profile.id, "achievements", e.target.value)}
                      />
                    </div>

                    {(profile.ranking || profile.problemsSolved || profile.contestRating) && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
                          <Trophy className="mr-1" size={16} />
                          Statistics
                        </h4>
                        <div className="flex flex-wrap gap-4 text-sm">
                          {profile.ranking && (
                            <span className="flex items-center text-yellow-600">
                              <Star size={14} className="mr-1" />
                              Rank: {profile.ranking.toLocaleString()}
                            </span>
                          )}
                          {profile.problemsSolved && (
                            <span className="text-green-600">
                              Problems: {profile.problemsSolved.toLocaleString()}
                            </span>
                          )}
                          {profile.contestRating && (
                            <span className="text-blue-600">
                              Rating: {profile.contestRating}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}