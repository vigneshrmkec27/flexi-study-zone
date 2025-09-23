import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { achievements } from '@/data/dummyData';
import {
  Target,
  TrendingUp,
  Flame,
  BookOpen,
  Play,
  BarChart3,
  Award,
  Star,
  User,
  Clock,
  Trophy,
  Zap,
  Users,
  Brain,
  Sparkles,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  onStartQuiz: () => void;
  onViewAnalytics: () => void;
  onViewSubject?: (category: string) => void;
}

interface UserProfile {
  display_name: string | null;
  total_score: number;
  current_streak: number;
  longest_streak: number;
}

interface UserStats {
  totalScore: number;
  accuracy: number;
  currentStreak: number;
  completedQuizzes: number;
  level: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartQuiz, onViewAnalytics, onViewSubject }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalScore: 0,
    accuracy: 85,
    currentStreak: 0,
    completedQuizzes: 0,
    level: 1
  });
  const [categories, setCategories] = useState<Array<{category: string, quiz_count: number}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserStats();
    }
    fetchCategories();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, total_score, current_streak, longest_streak')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setUserProfile(data);
        setUserStats(prev => ({
          ...prev,
          totalScore: data.total_score || 0,
          currentStreak: data.current_streak || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch quiz attempts to calculate stats
      const { data: attempts, error } = await supabase
        .from('quiz_attempts')
        .select('is_correct, points_earned')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching quiz attempts:', error);
        return;
      }

      if (attempts && attempts.length > 0) {
        const correctAnswers = attempts.filter(attempt => attempt.is_correct).length;
        const accuracy = Math.round((correctAnswers / attempts.length) * 100);
        const totalEarned = attempts.reduce((sum, attempt) => sum + (attempt.points_earned || 0), 0);
        const level = Math.floor(totalEarned / 100) + 1;

        setUserStats(prev => ({
          ...prev,
          accuracy,
          completedQuizzes: attempts.length,
          level,
          totalScore: totalEarned
        }));
      }
    } catch (error) {
      console.error('Error calculating user stats:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('category')
        .order('category');

      if (error) throw error;

      // Count quizzes per category
      const categoryMap = new Map();
      data?.forEach(item => {
        const count = categoryMap.get(item.category) || 0;
        categoryMap.set(item.category, count + 1);
      });

      const categoryStats = Array.from(categoryMap.entries()).map(([category, quiz_count]) => ({
        category,
        quiz_count
      }));

      setCategories(categoryStats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      'Mathematics': '📊',
      'Science': '🔬',
      'History': '🏛️',
      'Geography': '🌍',
      'Literature': '📚',
      'Computer Science': '💻',
      'Art': '🎨',
      'Music': '🎵'
    };
    return emojis[category] || '📖';
  };

  const getUserDisplayName = () => {
    if (userProfile?.display_name) {
      return userProfile.display_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Student';
  };

  const stats = [
    {
      title: 'Total Score',
      value: userStats.totalScore.toLocaleString(),
      icon: Trophy,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+12% this week'
    },
    {
      title: 'Accuracy Rate',
      value: `${userStats.accuracy}%`,
      icon: Target,
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: '+5% improvement'
    },
    {
      title: 'Learning Streak',
      value: `${userStats.currentStreak} days`,
      icon: Flame,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      trend: 'Keep it up!'
    },
    {
      title: 'Quizzes Completed',
      value: userStats.completedQuizzes.toString(),
      icon: BookOpen,
      color: 'text-achievement',
      bgColor: 'bg-achievement/10',
      trend: `${userStats.completedQuizzes} total`
    }
  ];

  const recentAchievements = achievements.filter(a => a.earned).slice(-3);
  const progressToNextLevel = ((userStats.totalScore % 100) / 100) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section - Enhanced */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8 animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/20">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Hi {getUserDisplayName()}! 👋
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Ready to continue your learning journey?
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning" />
                <span className="font-semibold">Level {userStats.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">{userStats.currentStreak} day streak</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress to Level {userStats.level + 1}</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {Math.round(progressToNextLevel)}%
                </Badge>
              </div>
              <Progress value={progressToNextLevel} className="h-3 w-full max-w-md" />
              <p className="text-xs text-muted-foreground">
                {100 - Math.round(progressToNextLevel)} points to next level
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={onStartQuiz} size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
              <Play className="w-5 h-5 mr-2" />
              Start Quiz
            </Button>
            <Button onClick={onViewAnalytics} variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index}
            className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-secondary/30 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor} ring-2 ring-white/20`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Badge variant="secondary" className="text-xs opacity-75">
                  {stat.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Achievements & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <Card className="p-6 bg-gradient-to-br from-background to-secondary/20 border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-achievement" />
            <h3 className="text-lg font-semibold">Recent Achievements</h3>
          </div>
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{achievement.name}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                <Badge className="bg-achievement/20 text-achievement border-achievement/30">
                  {achievement.earnedDate}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Learning Streak */}
        <Card className="p-6 bg-gradient-to-br from-background to-secondary/20 border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-warning" />
            <h3 className="text-lg font-semibold">Learning Streak</h3>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-warning to-warning/80 rounded-full mb-4">
              <span className="text-3xl font-bold text-white">{userStats.currentStreak}</span>
            </div>
            <p className="text-lg font-medium">Days in a row!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Keep learning to maintain your streak 🔥
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full ${
                    i < userStats.currentStreak ? 'bg-warning' : 'bg-secondary'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Subject Categories - Real Data */}
      <Card className="p-8 bg-gradient-to-br from-background to-secondary/20 border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Star className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Subject Categories</h3>
            <p className="text-muted-foreground">Choose your next learning adventure</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div 
              key={cat.category}
              className="group p-6 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 border border-primary/20 hover:border-primary/30 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => onViewSubject?.(cat.category)}
            >
              <div className="text-3xl mb-3">{getCategoryEmoji(cat.category)}</div>
              <h4 className="font-semibold text-foreground mb-2">{cat.category}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {cat.quiz_count} quiz{cat.quiz_count !== 1 ? 'es' : ''} available
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full group-hover:bg-primary/10 group-hover:border-primary/30"
              >
                Start Learning
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Community */}
        <Card className="p-6 bg-gradient-to-br from-background to-secondary/20 border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Study Community</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Top Performer This Week</p>
                <p className="text-sm text-muted-foreground">Sarah completed 25 quizzes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New Challenge Available</p>
                <p className="text-sm text-muted-foreground">Mathematics Speed Round</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Weekly Challenge */}
        <Card className="p-6 bg-gradient-to-br from-background to-secondary/20 border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-warning" />
            <h3 className="text-lg font-semibold">Weekly Challenge</h3>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-warning to-warning/80 rounded-full mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Mixed Topics Challenge</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Answer 20 questions from different subjects
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>3/20</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
            <Button size="sm" className="bg-gradient-to-r from-warning to-warning/80">
              Continue Challenge
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="p-6 bg-gradient-to-br from-background to-secondary/20 border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.9s' }}>
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Quick Stats</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">{categories.length}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Subjects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">{categories.reduce((sum, cat) => sum + cat.quiz_count, 0)}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Quizzes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning mb-1">{userStats.currentStreak}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-achievement mb-1">{userStats.level}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Current Level</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;