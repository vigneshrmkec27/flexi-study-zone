import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { analyticsData, userStats } from '@/data/dummyData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, BookOpen, Award, Calendar } from 'lucide-react';

const Analytics: React.FC = () => {
  const { t } = useLanguage();

  const pieData = analyticsData.subjectPerformance.map((item, index) => ({
    ...item,
    fill: [
      'hsl(217, 91%, 60%)',
      'hsl(142, 76%, 36%)',
      'hsl(25, 95%, 53%)',
      'hsl(260, 100%, 60%)',
      'hsl(0, 84%, 60%)',
      'hsl(220, 14%, 65%)',
      'hsl(45, 93%, 47%)'
    ][index % 7]
  }));

  const weeklyActivity = [
    { day: 'Mon', quizzes: 3, time: 45 },
    { day: 'Tue', quizzes: 2, time: 30 },
    { day: 'Wed', quizzes: 4, time: 60 },
    { day: 'Thu', quizzes: 1, time: 15 },
    { day: 'Fri', quizzes: 5, time: 75 },
    { day: 'Sat', quizzes: 3, time: 45 },
    { day: 'Sun', quizzes: 2, time: 30 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-gradient mb-2">
          {t('analytics.title')} 📊
        </h1>
        <p className="text-muted-foreground">
          Track your learning journey and progress over time
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        <Card className="p-6 card-elevated">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Score</p>
              <p className="text-2xl font-bold">{userStats.totalScore.toLocaleString()}</p>
              <Badge variant="secondary" className="text-xs mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% this week
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 card-elevated">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              <p className="text-2xl font-bold">{userStats.accuracy}%</p>
              <Badge variant="secondary" className="text-xs mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +3% improvement
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 card-elevated">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-xl">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Study Time</p>
              <p className="text-2xl font-bold">24h</p>
              <Badge variant="secondary" className="text-xs mt-1">
                This month
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 card-elevated">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-achievement/10 rounded-xl">
              <BookOpen className="w-6 h-6 text-achievement" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quizzes</p>
              <p className="text-2xl font-bold">{userStats.completedQuizzes}</p>
              <Badge variant="secondary" className="text-xs mt-1">
                Completed
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Over Time */}
        <Card className="p-6 card-elevated animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">{t('analytics.scoreOverTime')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.scoreOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [value, 'Score']}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(217, 91%, 60%)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(217, 91%, 60%)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Accuracy Trend */}
        <Card className="p-6 card-elevated animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-success" />
            <h3 className="text-lg font-semibold">{t('analytics.accuracyTrend')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.accuracyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              />
              <YAxis domain={[70, 95]} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [`${value}%`, 'Accuracy']}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="hsl(142, 76%, 36%)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card className="p-6 card-elevated animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-achievement" />
            <h3 className="text-lg font-semibold">{t('analytics.subjectPerformance')}</h3>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="score"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full lg:w-1/2 space-y-2">
              {analyticsData.subjectPerformance.map((subject, index) => (
                <div key={subject.subject} className="flex items-center justify-between p-2 rounded">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pieData[index].fill }}
                    />
                    <span className="text-sm">{subject.subject}</span>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={
                      subject.score >= 90 ? 'bg-success/20 text-success' :
                      subject.score >= 80 ? 'bg-warning/20 text-warning' :
                      'bg-secondary'
                    }
                  >
                    {subject.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Weekly Activity */}
        <Card className="p-6 card-elevated animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Weekly Activity</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quizzes" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Learning Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <Card className="p-6 card-gradient">
          <div className="text-center">
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Strongest Subject</h3>
            <p className="text-2xl font-bold text-success">Mathematics</p>
            <p className="text-sm text-muted-foreground">92% average score</p>
          </div>
        </Card>

        <Card className="p-6 card-gradient">
          <div className="text-center">
            <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-warning" />
            </div>
            <h3 className="font-semibold mb-2">Improvement Area</h3>
            <p className="text-2xl font-bold text-warning">History</p>
            <p className="text-sm text-muted-foreground">82% - focus needed</p>
          </div>
        </Card>

        <Card className="p-6 card-gradient">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Best Study Time</h3>
            <p className="text-2xl font-bold text-primary">Afternoon</p>
            <p className="text-sm text-muted-foreground">2-4 PM peak performance</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;