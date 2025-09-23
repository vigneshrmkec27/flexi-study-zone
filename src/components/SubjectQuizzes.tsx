import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  Play,
  Clock,
  Star,
  Trophy,
  Brain,
  Target,
  Zap,
  BookOpen
} from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  question: string;
  options: any; // Will be parsed from JSON
  difficulty: string;
  points: number;
  category: string;
}

interface SubjectQuizzesProps {
  category: string;
  onBack: () => void;
  onStartQuiz: (quiz: Quiz) => void;
}

interface UserProgress {
  completed: number;
  total: number;
  averageScore: number;
  streak: number;
}

const SubjectQuizzes: React.FC<SubjectQuizzesProps> = ({ category, onBack, onStartQuiz }) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completed: 0,
    total: 0,
    averageScore: 0,
    streak: 0
  });
  const [loading, setLoading] = useState(true);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchQuizzes();
    if (user) {
      fetchUserProgress();
    }
  }, [category, user]);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('category', category)
        .order('difficulty', { ascending: true });

      if (error) throw error;
      
      // Parse the options JSON and ensure proper format
      const formattedQuizzes = (data || []).map(quiz => ({
        ...quiz,
        options: Array.isArray(quiz.options) ? quiz.options : JSON.parse(quiz.options as string)
      }));
      
      setQuizzes(formattedQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      // Get user's attempts for this category
      const { data: attempts, error } = await supabase
        .from('quiz_attempts')
        .select(`
          quiz_id,
          is_correct,
          points_earned,
          quizzes!inner(category)
        `)
        .eq('user_id', user?.id)
        .eq('quizzes.category', category);

      if (error) throw error;

      const completed = new Set(attempts?.map(a => a.quiz_id) || []);
      setCompletedQuizzes(completed);

      const totalPoints = attempts?.reduce((sum, a) => sum + (a.points_earned || 0), 0) || 0;
      const averageScore = attempts?.length ? Math.round(totalPoints / attempts.length) : 0;

      // Calculate streak (consecutive correct answers in recent attempts)
      const recentAttempts = attempts?.slice(-10) || [];
      let currentStreak = 0;
      for (let i = recentAttempts.length - 1; i >= 0; i--) {
        if (recentAttempts[i].is_correct) {
          currentStreak++;
        } else {
          break;
        }
      }

      setUserProgress({
        completed: completed.size,
        total: quizzes.length,
        averageScore,
        streak: currentStreak
      });
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-success/20 text-success border-success/30';
      case 'medium': return 'bg-warning/20 text-warning border-warning/30';
      case 'hard': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-secondary/20 text-secondary-foreground border-secondary/30';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return <Star className="w-4 h-4" />;
      case 'medium': return <Zap className="w-4 h-4" />;
      case 'hard': return <Brain className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
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

  const progressPercentage = userProgress.total > 0 ? (userProgress.completed / userProgress.total) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Subject Overview */}
      <Card className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl">{getCategoryEmoji(category)}</div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {category}
            </h1>
            <p className="text-muted-foreground text-lg">
              Master your knowledge with {quizzes.length} interactive quizzes
            </p>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{userProgress.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{userProgress.averageScore}</div>
            <div className="text-sm text-muted-foreground">Avg Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{userProgress.streak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-achievement">{Math.round(progressPercentage)}%</div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {userProgress.completed} of {userProgress.total} quizzes
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </Card>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz, index) => {
          const isCompleted = completedQuizzes.has(quiz.id);
          
          return (
            <Card 
              key={quiz.id}
              className={`p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                isCompleted ? 'bg-success/5 border-success/20' : 'hover:border-primary/30'
              }`}
              onClick={() => onStartQuiz(quiz)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getDifficultyColor(quiz.difficulty)}`}>
                      {getDifficultyIcon(quiz.difficulty)}
                    </div>
                    <div>
                      <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                    </div>
                  </div>
                  {isCompleted && (
                    <Trophy className="w-5 h-5 text-success" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {quiz.question}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4" />
                    <span>{quiz.points} points</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="group-hover:bg-primary group-hover:text-primary-foreground"
                    variant={isCompleted ? "secondary" : "default"}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isCompleted ? 'Retry' : 'Start'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {quizzes.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Quizzes Available</h3>
          <p className="text-muted-foreground">
            There are currently no quizzes available for {category}. Check back later!
          </p>
        </Card>
      )}
    </div>
  );
};

export default SubjectQuizzes;