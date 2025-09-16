import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { leaderboard } from '@/data/dummyData';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const { t } = useLanguage();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-500/20';
      case 2:
        return 'bg-gradient-to-r from-gray-400/10 to-gray-500/10 border-gray-400/20';
      case 3:
        return 'bg-gradient-to-r from-amber-600/10 to-amber-700/10 border-amber-600/20';
      default:
        return 'bg-card border-border';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-gradient mb-2">
          {t('leaderboard.title')} 🏆
        </h1>
        <p className="text-muted-foreground">
          See how you stack up against other learners
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {leaderboard.slice(0, 3).map((entry, index) => {
          const actualRank = index + 1;
          const isSecondPlace = actualRank === 2;
          const isThirdPlace = actualRank === 3;
          
          return (
            <Card
              key={entry.id}
              className={`p-6 text-center card-elevated animate-slide-up ${
                isSecondPlace ? 'order-1 md:order-0' : 
                isThirdPlace ? 'order-2 md:order-2' : 
                'order-0 md:order-1'
              } ${
                actualRank === 1 ? 'md:scale-110 md:-mt-4' : ''
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="mb-4">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                  actualRank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                  actualRank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                  'bg-gradient-to-r from-amber-500 to-amber-700'
                }`}>
                  <span className="text-2xl">{entry.avatar}</span>
                </div>
                {getRankIcon(actualRank)}
              </div>
              
              <h3 className="font-bold text-lg mb-1">{entry.name}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary">{entry.score.toLocaleString()}</span>
                </div>
                <Badge variant="secondary">
                  {entry.accuracy}% accuracy
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <Card className="card-elevated animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Complete Rankings</h2>
          
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-border font-medium text-muted-foreground text-sm">
            <div className="col-span-1">{t('leaderboard.rank')}</div>
            <div className="col-span-1">Avatar</div>
            <div className="col-span-4">{t('leaderboard.name')}</div>
            <div className="col-span-3">{t('leaderboard.score')}</div>
            <div className="col-span-3">{t('leaderboard.accuracy')}</div>
          </div>
          
          {/* Entries */}
          <div className="space-y-2 mt-4">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.name === 'Student (You)';
              
              return (
                <div
                  key={entry.id}
                  className={`grid grid-cols-12 gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-secondary/50 ${
                    isCurrentUser ? 'bg-primary/5 border border-primary/20' : ''
                  } ${getRankStyle(rank)}`}
                >
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(rank)}
                  </div>
                  
                  <div className="col-span-1 flex items-center">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-sm">{entry.avatar}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-4 flex items-center">
                    <span className={`font-medium ${isCurrentUser ? 'text-primary' : ''}`}>
                      {entry.name}
                      {isCurrentUser && (
                        <Badge variant="outline" className="ml-2 text-xs px-2 py-0">
                          You
                        </Badge>
                      )}
                    </span>
                  </div>
                  
                  <div className="col-span-3 flex items-center">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{entry.score.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-3 flex items-center">
                    <Badge 
                      variant="secondary"
                      className={
                        entry.accuracy >= 90 ? 'bg-success/20 text-success' :
                        entry.accuracy >= 80 ? 'bg-warning/20 text-warning' :
                        'bg-secondary'
                      }
                    >
                      {entry.accuracy}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center card-elevated animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-2xl font-bold text-primary mb-1">
            {leaderboard.find(e => e.name === 'Student (You)')?.score.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">Your Score</p>
        </Card>
        
        <Card className="p-4 text-center card-elevated animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="text-2xl font-bold text-success mb-1">
            #{leaderboard.findIndex(e => e.name === 'Student (You)') + 1}
          </div>
          <p className="text-sm text-muted-foreground">Your Rank</p>
        </Card>
        
        <Card className="p-4 text-center card-elevated animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="text-2xl font-bold text-achievement mb-1">
            {Math.round(leaderboard.reduce((sum, entry) => sum + entry.accuracy, 0) / leaderboard.length)}%
          </div>
          <p className="text-sm text-muted-foreground">Average Accuracy</p>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;