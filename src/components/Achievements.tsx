import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { achievements } from '@/data/dummyData';
import { Trophy, Lock, Calendar, Star } from 'lucide-react';

const Achievements: React.FC = () => {
  const { t } = useLanguage();

  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);
  const completionPercentage = Math.round((earnedAchievements.length / achievements.length) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header with Progress */}
      <div className="text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-gradient mb-4">
          {t('achievements.title')} 🏆
        </h1>
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {earnedAchievements.length} of {achievements.length} achievements unlocked
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <Card className="p-6 text-center card-elevated">
          <div className="w-16 h-16 bg-gradient-to-r from-success to-success-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-success mb-1">{earnedAchievements.length}</div>
          <p className="text-sm text-muted-foreground">{t('achievements.earned')}</p>
        </Card>

        <Card className="p-6 text-center card-elevated">
          <div className="w-16 h-16 bg-gradient-to-r from-muted to-muted/80 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-muted-foreground mb-1">{lockedAchievements.length}</div>
          <p className="text-sm text-muted-foreground">{t('achievements.locked')}</p>
        </Card>

        <Card className="p-6 text-center card-elevated">
          <div className="w-16 h-16 bg-gradient-to-r from-achievement to-achievement-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-achievement mb-1">{completionPercentage}%</div>
          <p className="text-sm text-muted-foreground">Complete</p>
        </Card>
      </div>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-success" />
            Earned Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedAchievements.map((achievement, index) => (
              <Card
                key={achievement.id}
                className="p-6 card-elevated hover:scale-105 transition-transform duration-300 animate-bounce-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 animate-pulse-glow">
                    {achievement.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {achievement.description}
                  </p>
                  {achievement.earnedDate && (
                    <Badge className="achievement-badge">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(achievement.earnedDate).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Lock className="w-6 h-6 text-muted-foreground" />
            Locked Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedAchievements.map((achievement, index) => (
              <Card
                key={achievement.id}
                className="p-6 card-elevated opacity-60 animate-fade-in"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 grayscale">
                    {achievement.icon}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-bold text-lg text-muted-foreground">
                      {achievement.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Categories */}
      <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-2xl font-semibold mb-6">Achievement Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 card-gradient">
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Learning</h3>
              <p className="text-xs text-muted-foreground">
                2 of 3 earned
              </p>
              <Progress value={67} className="mt-2 h-2" />
            </div>
          </Card>

          <Card className="p-4 card-gradient">
            <div className="text-center">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="font-semibold mb-1">Subject Mastery</h3>
              <p className="text-xs text-muted-foreground">
                1 of 3 earned
              </p>
              <Progress value={33} className="mt-2 h-2" />
            </div>
          </Card>

          <Card className="p-4 card-gradient">
            <div className="text-center">
              <div className="text-2xl mb-2">🔥</div>
              <h3 className="font-semibold mb-1">Consistency</h3>
              <p className="text-xs text-muted-foreground">
                0 of 1 earned
              </p>
              <Progress value={0} className="mt-2 h-2" />
            </div>
          </Card>

          <Card className="p-4 card-gradient">
            <div className="text-center">
              <div className="text-2xl mb-2">🌟</div>
              <h3 className="font-semibold mb-1">Special</h3>
              <p className="text-xs text-muted-foreground">
                2 of 2 earned
              </p>
              <Progress value={100} className="mt-2 h-2" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements;