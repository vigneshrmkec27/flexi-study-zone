import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { userStats, achievements } from '@/data/dummyData';
import {
  Target,
  TrendingUp,
  Flame,
  BookOpen,
  Play,
  BarChart3,
  Award,
  Star,
  Users,
  Trophy,
  Clock,
  Zap
} from 'lucide-react';

interface DashboardProps {
  onStartQuiz: () => void;
  onViewAnalytics: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartQuiz, onViewAnalytics }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [quizCategories, setQuizCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setProfile(profileData);

        // Fetch unique quiz categories
        const { data: categoriesData } = await supabase
          .from('quizzes')
          .select('category')
          .order('category');

        if (categoriesData) {
          const uniqueCategories = [...new Set(categoriesData.map(item => item.category))];
          setQuizCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const stats = [
    {
      title: t('dashboard.totalScore'),
      value: userStats.totalScore.toLocaleString(),
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: t('dashboard.accuracy'),
      value: `${userStats.accuracy}%`,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: t('dashboard.streak'),
      value: `${userStats.currentStreak} days`,
      icon: Flame,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: t('dashboard.completedQuizzes'),
      value: userStats.completedQuizzes.toString(),
      icon: BookOpen,
      color: 'text-achievement',
      bgColor: 'bg-achievement/10'
    }
  ];

  const recentAchievements = achievements.filter(a => a.earned).slice(-3);
  const progressToNextLevel = ((userStats.level % 10) / 10) * 100;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card-gradient animate-fade-in">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">
              {t('dashboard.welcome')}, {profile?.display_name || 'Student'}! 🎉
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('dashboard.progress')} - Level {userStats.level}
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Progress to Level {userStats.level + 1}</span>
                <Badge variant="secondary">{Math.round(progressToNextLevel)}%</Badge>
              </div>
              <Progress value={progressToNextLevel} className="w-full md:w-80" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={onStartQuiz} className="btn-hero">
              <Play className="w-4 h-4 mr-2" />
              {t('dashboard.startQuiz')}
            </Button>
            <Button onClick={onViewAnalytics} variant="outline" className="hover:bg-secondary">
              <BarChart3 className="w-4 h-4 mr-2" />
              {t('dashboard.viewAnalytics')}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index}
            className="p-6 card-elevated animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Achievements & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <Card className="p-6 card-elevated animate-slide-up" style={{ animationDelay: '0.4s' }}>
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
                <Badge className="achievement-badge">
                  {achievement.earnedDate}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Learning Streak */}
        <Card className="p-6 card-elevated animate-slide-up" style={{ animationDelay: '0.5s' }}>
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

      {/* Available Quiz Categories */}
      <Card className="p-6 card-elevated animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Quiz Categories Available</h3>
          <Badge variant="secondary" className="ml-auto">
            {quizCategories.length} Categories
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quizCategories.map((category, index) => {
            const categoryIcons: { [key: string]: string } = {
              'Mathematics': '🔢',
              'Science': '🔬',
              'History': '📚',
              'Geography': '🌍',
              'Literature': '📖',
              'Computer Science': '💻',
              'Art': '🎨',
              'Music': '🎵'
            };
            
            const categoryColors: { [key: string]: string } = {
              'Mathematics': 'bg-blue-50 border-blue-200 text-blue-700',
              'Science': 'bg-green-50 border-green-200 text-green-700',
              'History': 'bg-purple-50 border-purple-200 text-purple-700',
              'Geography': 'bg-cyan-50 border-cyan-200 text-cyan-700',
              'Literature': 'bg-pink-50 border-pink-200 text-pink-700',
              'Computer Science': 'bg-orange-50 border-orange-200 text-orange-700',
              'Art': 'bg-red-50 border-red-200 text-red-700',
              'Music': 'bg-indigo-50 border-indigo-200 text-indigo-700'
            };

            return (
              <div 
                key={category}
                className={`p-4 border-2 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer ${
                  categoryColors[category] || 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
                style={{ animationDelay: `${0.7 + index * 0.05}s` }}
                onClick={onStartQuiz}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">
                    {categoryIcons[category] || '📝'}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{category}</h4>
                  <p className="text-xs opacity-75">Click to start</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Enhanced Study Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 card-elevated animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Study Community</h3>
              <p className="text-sm text-muted-foreground">Connect with learners</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>Active learners today</span>
              <Badge>1,247</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Your rank this week</span>
              <Badge variant="secondary">#42</Badge>
            </div>
            <Button size="sm" className="w-full mt-4">
              Join Community
            </Button>
          </div>
        </Card>

        <Card className="p-6 card-elevated animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-success/10 rounded-xl">
              <Trophy className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Weekly Challenge</h3>
              <p className="text-sm text-muted-foreground">Limited time event</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>Progress</span>
              <span className="font-medium">3/5 quizzes</span>
            </div>
            <Progress value={60} className="h-2" />
            <div className="flex justify-between items-center text-sm">
              <span>Reward</span>
              <Badge className="bg-yellow-100 text-yellow-800">🏆 Gold Badge</Badge>
            </div>
            <Button size="sm" className="w-full mt-4" variant="outline">
              Continue Challenge
            </Button>
          </div>
        </Card>

        <Card className="p-6 card-elevated animate-slide-up" style={{ animationDelay: '0.9s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-warning/10 rounded-xl">
              <Zap className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Quick Stats</h3>
              <p className="text-sm text-muted-foreground">Today's performance</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>Time studied</span>
              <span className="font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                2h 34m
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Questions answered</span>
              <span className="font-medium">47</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Today's accuracy</span>
              <Badge className="bg-green-100 text-green-800">92%</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;