import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, TrendingUp, BookOpen, Award, Clock, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const TeacherDashboard: React.FC = () => {
  const { t } = useLanguage();

  // Dummy student progress data
  const studentsProgress = [
    {
      id: 1,
      name: "Alex Chen",
      avatar: "👨‍💻",
      totalScore: 2450,
      accuracy: 95,
      completedQuizzes: 32,
      currentStreak: 12,
      level: 9,
      lastActive: "2 hours ago",
      subjects: {
        Mathematics: 98,
        Science: 92,
        Geography: 95,
        Literature: 94
      }
    },
    {
      id: 2,
      name: "Priya Sharma", 
      avatar: "👩‍🎓",
      totalScore: 2380,
      accuracy: 92,
      completedQuizzes: 28,
      currentStreak: 8,
      level: 8,
      lastActive: "1 day ago",
      subjects: {
        Mathematics: 90,
        Science: 95,
        Geography: 88,
        Literature: 96
      }
    },
    {
      id: 3,
      name: "Mohammed Ali",
      avatar: "👨‍🎓", 
      totalScore: 2150,
      accuracy: 85,
      completedQuizzes: 25,
      currentStreak: 5,
      level: 7,
      lastActive: "3 hours ago",
      subjects: {
        Mathematics: 82,
        Science: 88,
        Geography: 85,
        Literature: 84
      }
    },
    {
      id: 4,
      name: "Sarah Johnson",
      avatar: "👩‍💼",
      totalScore: 2100,
      accuracy: 90,
      completedQuizzes: 30,
      currentStreak: 15,
      level: 8,
      lastActive: "5 hours ago",
      subjects: {
        Mathematics: 93,
        Science: 87,
        Geography: 89,
        Literature: 91
      }
    }
  ];

  const classAnalytics = [
    { date: '2024-01-01', averageScore: 1800, participation: 85 },
    { date: '2024-01-08', averageScore: 1950, participation: 88 },
    { date: '2024-01-15', averageScore: 2100, participation: 90 },
    { date: '2024-01-22', averageScore: 2200, participation: 92 },
    { date: '2024-01-29', averageScore: 2300, participation: 94 },
  ];

  const subjectDistribution = [
    { name: 'Mathematics', value: 25, color: 'hsl(var(--primary))' },
    { name: 'Science', value: 22, color: 'hsl(var(--achievement))' },
    { name: 'Literature', value: 20, color: 'hsl(var(--success))' },
    { name: 'Geography', value: 18, color: 'hsl(var(--warning))' },
    { name: 'History', value: 15, color: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Monitor student progress and class analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">{studentsProgress.length} Active Students</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsProgress.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="w-4 h-4 text-achievement" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2270</div>
            <p className="text-xs text-muted-foreground">+5.2% from last week</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Participation</CardTitle>
            <Target className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Accuracy</CardTitle>
            <Award className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90.5%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Student Progress</TabsTrigger>
          <TabsTrigger value="analytics">Class Analytics</TabsTrigger>
          <TabsTrigger value="subjects">Subject Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          <div className="grid gap-6">
            {studentsProgress.map((student) => (
              <Card key={student.id} className="card-elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-achievement flex items-center justify-center text-xl">
                        {student.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          Last active: {student.lastActive}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Level {student.level}</Badge>
                      <Badge variant="secondary">{student.accuracy}% Accuracy</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{student.totalScore}</div>
                      <div className="text-xs text-muted-foreground">Total Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-achievement">{student.completedQuizzes}</div>
                      <div className="text-xs text-muted-foreground">Quizzes Done</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">{student.currentStreak}</div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning">{student.accuracy}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Subject Performance</h4>
                    {Object.entries(student.subjects).map(([subject, score]) => (
                      <div key={subject} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{subject}</span>
                          <span className="font-medium">{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Class Performance Over Time</CardTitle>
                <CardDescription>Average scores and participation rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={classAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <Line type="monotone" dataKey="averageScore" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="participation" stroke="hsl(var(--achievement))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Student Performance Distribution</CardTitle>
                <CardDescription>Score ranges across all students</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { range: '0-1000', count: 0 },
                    { range: '1000-1500', count: 0 },
                    { range: '1500-2000', count: 1 },
                    { range: '2000-2500', count: 3 },
                    { range: '2500+', count: 0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
                <CardDescription>Quiz attempts by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subjectDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {subjectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Subject Performance Ranking</CardTitle>
                <CardDescription>Average scores by subject</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { subject: 'Mathematics', avgScore: 90.8, color: 'primary' },
                  { subject: 'Literature', avgScore: 90.2, color: 'achievement' },
                  { subject: 'Science', avgScore: 89.5, color: 'success' },
                  { subject: 'Geography', avgScore: 89.2, color: 'warning' },
                  { subject: 'History', avgScore: 85.0, color: 'destructive' },
                ].map((item, index) => (
                  <div key={item.subject} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                      <div>
                        <div className="font-medium">{item.subject}</div>
                        <div className="text-sm text-muted-foreground">Class Average</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{item.avgScore}%</div>
                      <Progress value={item.avgScore} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;