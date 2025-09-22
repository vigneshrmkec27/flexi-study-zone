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
  Zap
} from 'lucide-react';

interface DashboardProps {
  onStartQuiz: () => void;
  onViewAnalytics: () => void;
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

const Dashboard: React.FC<DashboardProps> = ({ onStartQuiz, onViewAnalytics }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalScore: 0,
    accuracy: 85,
    currentStreak: 0,
    completedQuizzes: 0,
    level: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserStats();
    }
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

      {/* Enhanced Study Recommendations */}
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
          <div className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/30 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="text-3xl mb-3">📚</div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Mathematics</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">Algebra, Geometry, Calculus</p>
            <Button size="sm" variant="outline" className="w-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
              Start Learning
            </Button>
          </div>
          
          <div className="group p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border border-green-200/50 dark:border-green-800/30 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="text-3xl mb-3">🔬</div>
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Science</h4>
            <p className="text-sm text-green-700 dark:text-green-300 mb-4">Physics, Chemistry, Biology</p>
            <Button size="sm" variant="outline" className="w-full group-hover:bg-green-100 dark:group-hover:bg-green-900/30">
              Explore Science
            </Button>
          </div>
          
          <div className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-800/30 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="text-3xl mb-3">🌍</div>
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Geography</h4>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">Countries, Capitals, Rivers</p>
            <Button size="sm" variant="outline" className="w-full group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30">
              Discover World
            </Button>
          </div>
          
          <div className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border border-orange-200/50 dark:border-orange-800/30 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="text-3xl mb-3">📖</div>
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">More Subjects</h4>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">History, Literature, Art, Music</p>
            <Button size="sm" variant="outline" className="w-full group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30">
              View All
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;