import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { userStats, achievements } from '@/data/dummyData';
import {
  Target,
  TrendingUp,
  Flame,
  BookOpen,
  Play,
  BarChart3,
  Award,
  Star
} from 'lucide-react';

interface DashboardProps {
  onStartQuiz: () => void;
  onViewAnalytics: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartQuiz, onViewAnalytics }) => {
  const { t } = useLanguage();

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
              {t('dashboard.welcome')}, Student! 🎉
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

      {/* Study Recommendations */}
      <Card className="p-6 card-elevated animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Recommended for You</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-medium text-primary mb-2">📚 Mathematics Review</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Practice algebra and geometry concepts
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Start Practice
            </Button>
          </div>
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
            <h4 className="font-medium text-success mb-2">🔬 Science Quiz</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Test your physics and chemistry knowledge
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Take Quiz
            </Button>
          </div>
          <div className="p-4 bg-achievement/5 border border-achievement/20 rounded-lg">
            <h4 className="font-medium text-achievement mb-2">🌍 Geography Challenge</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Explore world capitals and landmarks
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Explore
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;