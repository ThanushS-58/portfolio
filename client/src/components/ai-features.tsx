import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, Target, Zap, Brain, Eye } from 'lucide-react';
import { Profile } from '@shared/schema';

interface AIFeaturesProps {
  profile: Profile;
}

interface SectionOptimization {
  section: string;
  score: number;
  suggestions: string[];
  impact: 'high' | 'medium' | 'low';
}

interface CareerPath {
  title: string;
  timeline: string;
  skills: string[];
  probability: number;
  description: string;
}

interface SkillVisualization {
  skill: string;
  level: number;
  demand: number;
  growth: number;
  category: string;
}

interface LayoutSuggestion {
  template: string;
  suitability: number;
  reasons: string[];
  preview: string;
}

interface TrendInsight {
  trend: string;
  relevance: number;
  timeframe: string;
  action: string;
  category: 'skills' | 'industry' | 'role';
}

export default function AIFeatures({ profile }: AIFeaturesProps) {
  const [optimizations, setOptimizations] = useState<SectionOptimization[]>([]);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [skillsViz, setSkillsViz] = useState<SkillVisualization[]>([]);
  const [layoutSuggestions, setLayoutSuggestions] = useState<LayoutSuggestion[]>([]);
  const [trendInsights, setTrendInsights] = useState<TrendInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (profile) {
      generateAIInsights();
    }
  }, [profile]);

  const generateAIInsights = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with intelligent recommendations
    setTimeout(() => {
      setOptimizations(generateSectionOptimizations());
      setCareerPaths(generateCareerPaths());
      setSkillsViz(generateSkillVisualization());
      setLayoutSuggestions(generateLayoutSuggestions());
      setTrendInsights(generateTrendInsights());
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateSectionOptimizations = (): SectionOptimization[] => {
    const sections = [
      {
        section: 'Career Objective',
        score: profile.careerObjective ? 85 : 40,
        suggestions: profile.careerObjective 
          ? ['Add specific metrics and goals', 'Mention target companies or industries']
          : ['Create a compelling career objective', 'Focus on value proposition'],
        impact: 'high' as const
      },
      {
        section: 'Technical Skills',
        score: (profile.technicalSkills?.length || 0) > 5 ? 90 : 60,
        suggestions: [
          'Add skill proficiency levels',
          'Include trending technologies',
          'Group skills by category'
        ],
        impact: 'high' as const
      },
      {
        section: 'Projects',
        score: (profile.projects?.length || 0) > 2 ? 80 : 50,
        suggestions: [
          'Add project outcomes and impact',
          'Include technologies used',
          'Mention team size and role'
        ],
        impact: 'medium' as const
      },
      {
        section: 'Experience',
        score: (profile.experience?.length || 0) > 1 ? 85 : 45,
        suggestions: [
          'Quantify achievements with numbers',
          'Use action verbs',
          'Highlight leadership experience'
        ],
        impact: 'high' as const
      }
    ];

    return sections;
  };

  const generateCareerPaths = (): CareerPath[] => {
    const techSkills = profile.technicalSkills || [];
    const hasWebSkills = techSkills.some(skill => 
      ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js'].includes(skill.name)
    );
    const hasDataSkills = techSkills.some(skill => 
      ['Python', 'SQL', 'Machine Learning', 'Data Analysis'].includes(skill.name)
    );

    return [
      {
        title: 'Full Stack Developer',
        timeline: '6-12 months',
        skills: ['React', 'Node.js', 'Database Design', 'API Development'],
        probability: hasWebSkills ? 85 : 65,
        description: 'Develop end-to-end web applications with modern frameworks'
      },
      {
        title: 'Software Engineer',
        timeline: '3-6 months',
        skills: ['Problem Solving', 'Algorithms', 'System Design', 'Testing'],
        probability: 80,
        description: 'Build scalable software solutions and work on complex systems'
      },
      {
        title: 'Data Scientist',
        timeline: '12-18 months',
        skills: ['Machine Learning', 'Statistics', 'Python', 'Data Visualization'],
        probability: hasDataSkills ? 75 : 45,
        description: 'Extract insights from data and build predictive models'
      },
      {
        title: 'Product Manager',
        timeline: '18-24 months',
        skills: ['Strategy', 'Communication', 'Analytics', 'User Research'],
        probability: 60,
        description: 'Lead product development and strategy initiatives'
      }
    ];
  };

  const generateSkillVisualization = (): SkillVisualization[] => {
    const allSkills = [
      ...(profile.technicalSkills || []),
      ...(profile.softSkills || [])
    ];

    return allSkills.map(skill => ({
      skill: skill.name,
      level: skill.level === 'expert' ? 90 : skill.level === 'advanced' ? 75 : 
             skill.level === 'intermediate' ? 60 : 40,
      demand: Math.floor(Math.random() * 40) + 60,
      growth: Math.floor(Math.random() * 30) + 10,
      category: profile.technicalSkills?.includes(skill) ? 'technical' : 'soft'
    }));
  };

  const generateLayoutSuggestions = (): LayoutSuggestion[] => {
    return [
      {
        template: 'Professional',
        suitability: 90,
        reasons: ['Ideal for corporate roles', 'Clean and readable', 'ATS-friendly'],
        preview: 'Traditional format with clear sections'
      },
      {
        template: 'Modern',
        suitability: 85,
        reasons: ['Great for tech roles', 'Visual appeal', 'Stands out'],
        preview: 'Contemporary design with visual elements'
      },
      {
        template: 'Minimal',
        suitability: 75,
        reasons: ['Focus on content', 'Quick to scan', 'Versatile'],
        preview: 'Clean and simple layout'
      },
      {
        template: 'Creative',
        suitability: 60,
        reasons: ['Design roles', 'Unique presentation', 'Portfolio style'],
        preview: 'Creative layout with visual flair'
      }
    ];
  };

  const generateTrendInsights = (): TrendInsight[] => {
    return [
      {
        trend: 'AI/ML Skills in High Demand',
        relevance: 95,
        timeframe: '2024-2025',
        action: 'Consider learning Python and TensorFlow',
        category: 'skills'
      },
      {
        trend: 'Remote Work Continues to Grow',
        relevance: 85,
        timeframe: 'Ongoing',
        action: 'Highlight remote collaboration skills',
        category: 'industry'
      },
      {
        trend: 'Cloud Computing Essential',
        relevance: 90,
        timeframe: '2024+',
        action: 'Get AWS or Azure certification',
        category: 'skills'
      },
      {
        trend: 'Full Stack Developers in Demand',
        relevance: 88,
        timeframe: '2024-2026',
        action: 'Develop both frontend and backend skills',
        category: 'role'
      }
    ];
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card className="card-hover glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            <Brain className="h-5 w-5 animate-float" />
            AI-Powered Career Enhancement Suite
          </CardTitle>
          <p className="text-muted-foreground">
            Advanced AI analysis and recommendations for your professional growth
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="optimizer" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="optimizer" className="button-glow">
                <Target className="h-4 w-4 mr-1" />
                Optimizer
              </TabsTrigger>
              <TabsTrigger value="career" className="button-glow">
                <TrendingUp className="h-4 w-4 mr-1" />
                Career Paths
              </TabsTrigger>
              <TabsTrigger value="skills" className="button-glow">
                <Eye className="h-4 w-4 mr-1" />
                Skills 3D
              </TabsTrigger>
              <TabsTrigger value="layout" className="button-glow">
                <Zap className="h-4 w-4 mr-1" />
                Layout Wizard
              </TabsTrigger>
              <TabsTrigger value="trends" className="button-glow">
                <Sparkles className="h-4 w-4 mr-1" />
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="optimizer" className="space-y-4 animate-slide-in-left">
              <h3 className="text-lg font-semibold">Resume Section Optimizer</h3>
              {isAnalyzing ? (
                <div className="space-y-3">
                  <div className="skeleton h-20 rounded"></div>
                  <div className="skeleton h-20 rounded"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {optimizations.map((opt, index) => (
                    <Card key={index} className="card-hover">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{opt.section}</h4>
                          <div className="flex items-center gap-2">
                            <Progress value={opt.score} className="w-20" />
                            <span className="text-sm font-medium">{opt.score}%</span>
                            <Badge variant={opt.impact === 'high' ? 'default' : 'secondary'}>
                              {opt.impact}
                            </Badge>
                          </div>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {opt.suggestions.map((suggestion, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="career" className="space-y-4 animate-slide-in-right">
              <h3 className="text-lg font-semibold">Intelligent Career Path Recommendations</h3>
              <div className="grid gap-4">
                {careerPaths.map((path, index) => (
                  <Card key={index} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{path.title}</h4>
                        <Badge variant="outline">{path.probability}% match</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{path.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-blue-600">Timeline: {path.timeline}</span>
                        <Progress value={path.probability} className="w-20" />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {path.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4 animate-fade-in-up">
              <h3 className="text-lg font-semibold">Interactive 3D Skills Visualization</h3>
              <div className="grid gap-4">
                {skillsViz.map((skill, index) => (
                  <Card key={index} className="card-hover animate-float" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{skill.skill}</h4>
                        <Badge variant={skill.category === 'technical' ? 'default' : 'secondary'}>
                          {skill.category}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Current Level</span>
                          <span>{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="progress-bar" />
                        <div className="flex items-center justify-between text-sm">
                          <span>Market Demand</span>
                          <span>{skill.demand}%</span>
                        </div>
                        <Progress value={skill.demand} className="h-2 bg-green-100" />
                        <div className="flex items-center justify-between text-sm">
                          <span>Growth Potential</span>
                          <span>+{skill.growth}%</span>
                        </div>
                        <Progress value={skill.growth} className="h-2 bg-purple-100" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4 animate-slide-in-left">
              <h3 className="text-lg font-semibold">Smart Resume Layout Customization Wizard</h3>
              <div className="grid gap-4">
                {layoutSuggestions.map((layout, index) => (
                  <Card key={index} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{layout.template} Template</h4>
                        <div className="flex items-center gap-2">
                          <Progress value={layout.suitability} className="w-20" />
                          <span className="text-sm font-medium">{layout.suitability}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{layout.preview}</p>
                      <div className="flex flex-wrap gap-1">
                        {layout.reasons.map((reason, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="mt-3 button-glow">
                        Apply Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4 animate-slide-in-right">
              <h3 className="text-lg font-semibold">Contextual Career Trend Insights</h3>
              <div className="space-y-4">
                {trendInsights.map((insight, index) => (
                  <Card key={index} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{insight.trend}</h4>
                        <Badge variant={insight.relevance > 90 ? 'default' : 'secondary'}>
                          {insight.relevance}% relevant
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Timeframe:</span>
                          <span>{insight.timeframe}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <Badge variant="outline" className="text-xs">
                            {insight.category}
                          </Badge>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md mt-3">
                          <p className="text-sm font-medium text-blue-800">
                            💡 Recommended Action: {insight.action}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex gap-3">
            <Button onClick={generateAIInsights} disabled={isAnalyzing} className="button-glow progress-bar">
              {isAnalyzing ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-float" />
                  Regenerate AI Insights
                </>
              )}
            </Button>
            <Button variant="outline" className="button-glow">
              <Target className="mr-2 h-4 w-4" />
              Apply All Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}