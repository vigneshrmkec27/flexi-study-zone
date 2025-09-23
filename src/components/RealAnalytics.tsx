import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  Users,
  BookOpen,
  Target,
  Brain,
  Trophy,
  Calendar,
  Zap
} from 'lucide-react';

interface AnalyticsData {
  totalQuizzes: number;
  totalAttempts: number;
  averageScore: number;
  categoryStats: Array<{
    category: string;
    quizCount: number;
    attempts: number;
    averageScore: number;
  }>;
  weeklyProgress: Array<{
    date: string;
    attempts: number;
    score: number;
  }>;
  difficultyDistribution: Array<{
    difficulty: string;
    count: number;
    successRate: number;
  }>;
}

const RealAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      // Get category stats
      const { data: categoryData } = await supabase
        .from('quizzes')
        .select(`
          category,
          quiz_attempts!inner(is_correct, points_earned, user_id)
        `);

      // Get user's quiz attempts
      const { data: userAttempts } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes!inner(category, difficulty)
        `)
        .eq('user_id', user?.id);

      // Get weekly progress (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: weeklyData } = await supabase
        .from('quiz_attempts')
        .select('attempted_at, is_correct, points_earned')
        .eq('user_id', user?.id)
        .gte('attempted_at', sevenDaysAgo.toISOString())
        .order('attempted_at');

      // Process category statistics
      const categoryMap = new Map();
      categoryData?.forEach((quiz: any) => {
        const category = quiz.category;
        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            category,
            quizCount: 0,
            attempts: 0,
            totalScore: 0,
            correctAnswers: 0
          });
        }
        const cat = categoryMap.get(category);
        cat.quizCount++;
        
        quiz.quiz_attempts?.forEach((attempt: any) => {
          cat.attempts++;
          cat.totalScore += attempt.points_earned || 0;
          if (attempt.is_correct) cat.correctAnswers++;
        });
      });

      const categoryStats = Array.from(categoryMap.values()).map(cat => ({
        ...cat,
        averageScore: cat.attempts > 0 ? Math.round(cat.totalScore / cat.attempts) : 0
      }));

      // Process weekly progress
      const weeklyProgress = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dayAttempts = weeklyData?.filter(
          attempt => attempt.attempted_at.split('T')[0] === dateString
        ) || [];
        
        const totalScore = dayAttempts.reduce((sum, att) => sum + (att.points_earned || 0), 0);
        const avgScore = dayAttempts.length > 0 ? Math.round(totalScore / dayAttempts.length) : 0;
        
        weeklyProgress.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          attempts: dayAttempts.length,
          score: avgScore
        });
      }

      // Process difficulty distribution
      const difficultyMap = new Map();
      userAttempts?.forEach((attempt: any) => {
        const difficulty = attempt.quizzes.difficulty;
        if (!difficultyMap.has(difficulty)) {
          difficultyMap.set(difficulty, { total: 0, correct: 0 });
        }
        const diff = difficultyMap.get(difficulty);
        diff.total++;
        if (attempt.is_correct) diff.correct++;
      });

      const difficultyDistribution = Array.from(difficultyMap.entries()).map(([difficulty, stats]) => ({
        difficulty,
        count: stats.total,
        successRate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
      }));

      const totalAttempts = userAttempts?.length || 0;
      const totalScore = userAttempts?.reduce((sum, att) => sum + (att.points_earned || 0), 0) || 0;
      const averageScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;

      setAnalytics({
        totalQuizzes: categoryStats.reduce((sum, cat) => sum + cat.quizCount, 0),
        totalAttempts,
        averageScore,
        categoryStats,
        weeklyProgress,
        difficultyDistribution
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div>Unable to load analytics data.</div>;
  }

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981'];

  return (
    <div className="space-y-8 p-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Attempts</p>
              <p className="text-3xl font-bold text-primary">{analytics.totalAttempts}</p>
            </div>
            <Brain className="w-8 h-8 text-primary/60" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Score</p>
              <p className="text-3xl font-bold text-success">{analytics.averageScore}</p>
            </div>
            <Target className="w-8 h-8 text-success/60" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Quizzes</p>
              <p className="text-3xl font-bold text-warning">{analytics.totalQuizzes}</p>
            </div>
            <BookOpen className="w-8 h-8 text-warning/60" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-achievement/10 to-achievement/5 border-achievement/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Categories</p>
              <p className="text-3xl font-bold text-achievement">{analytics.categoryStats.length}</p>
            </div>
            <Trophy className="w-8 h-8 text-achievement/60" />
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Weekly Progress</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="attempts" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.2}
                name="Quiz Attempts"
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--success))" 
                fill="hsl(var(--success))" 
                fillOpacity={0.2}
                name="Average Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Performance */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Category Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.categoryStats}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="attempts" fill="hsl(var(--primary))" name="Attempts" />
              <Bar dataKey="averageScore" fill="hsl(var(--success))" name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Difficulty Distribution */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Difficulty Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.difficultyDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ difficulty, count }) => `${difficulty}: ${count}`}
              >
                {analytics.difficultyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Stats */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Subject Statistics</h3>
          </div>
          <div className="space-y-4">
            {analytics.categoryStats.map((cat, index) => (
              <div key={cat.category} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="font-medium">{cat.category}</p>
                    <p className="text-sm text-muted-foreground">{cat.quizCount} quizzes available</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{cat.attempts} attempts</Badge>
                  <Badge variant={cat.averageScore >= 70 ? "default" : "destructive"}>
                    {cat.averageScore} avg score
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RealAnalytics;