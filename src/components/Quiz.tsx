import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { questions, Question, achievements } from '@/data/dummyData';
import { Volume2, Trophy, Star, CheckCircle, XCircle } from 'lucide-react';

interface QuizProps {
  onQuizComplete: (score: number, accuracy: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ onQuizComplete }) => {
  const { language, t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [newBadgeEarned, setNewBadgeEarned] = useState<string | null>(null);

  // Text-to-Speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Initialize quiz with adaptive difficulty
  useEffect(() => {
    const easyQuestions = questions.filter(q => q.difficulty === 'easy').slice(0, 3);
    const mediumQuestions = questions.filter(q => q.difficulty === 'medium').slice(0, 4);
    const hardQuestions = questions.filter(q => q.difficulty === 'hard').slice(0, 3);
    
    setQuizQuestions([...easyQuestions, ...mediumQuestions, ...hardQuestions]);
  }, []);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);

    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsAnswerCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      
      // Check for achievements
      if (correctAnswers + 1 === 1 && !achievements.find(a => a.id === 1)?.earned) {
        setNewBadgeEarned("First Quiz");
      }
      if (correctAnswers + 1 === quizQuestions.length && !achievements.find(a => a.id === 2)?.earned) {
        setNewBadgeEarned("Perfect Score");
      }
    }

    // Adaptive difficulty adjustment
    if (currentQuestionIndex < 3) { // Easy questions
      if (correct) {
        setDifficulty('medium');
      }
    } else if (currentQuestionIndex < 7) { // Medium questions
      if (correct) {
        setDifficulty('hard');
      } else {
        setDifficulty('easy');
      }
    }

    // Auto-advance after feedback
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowFeedback(false);
      } else {
        finishQuiz();
      }
    }, 2000);
  };

  const finishQuiz = () => {
    const accuracy = Math.round((correctAnswers / quizQuestions.length) * 100);
    const score = correctAnswers * 100;
    setShowResult(true);
    onQuizComplete(score, accuracy);
  };

  const getQuestionText = () => {
    if (!currentQuestion) return '';
    
    if (language !== 'en' && currentQuestion.translations[language]) {
      return currentQuestion.translations[language].question;
    }
    return currentQuestion.question;
  };

  const getOptionText = (index: number) => {
    if (!currentQuestion) return '';
    
    if (language !== 'en' && currentQuestion.translations[language]) {
      return currentQuestion.translations[language].options[index];
    }
    return currentQuestion.options[index];
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showResult) {
    const accuracy = Math.round((correctAnswers / quizQuestions.length) * 100);
    const score = correctAnswers * 100;

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center card-elevated animate-bounce-in">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-success to-success-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gradient mb-2">
              {t('quiz.completed')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('quiz.yourScore')}: {score} ({accuracy}% accuracy)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
            <div className="p-4 bg-warning/10 rounded-lg">
              <div className="text-2xl font-bold text-warning">{quizQuestions.length - correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="p-4 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>

          {newBadgeEarned && (
            <Alert className="mb-6 bg-achievement/10 border-achievement/20">
              <Star className="h-4 w-4 text-achievement" />
              <AlertDescription className="text-achievement font-medium">
                🎉 {t('quiz.newBadge')} "{newBadgeEarned}"!
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={() => window.location.reload()} 
            className="btn-hero"
          >
            Take Another Quiz
          </Button>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gradient">{t('quiz.title')}</h1>
          <Badge variant="outline" className="px-3 py-1">
            {t('quiz.question')} {currentQuestionIndex + 1} {t('quiz.of')} {quizQuestions.length}
          </Badge>
        </div>
        <Progress value={progress} className="w-full" />
        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
          <span>Progress: {Math.round(progress)}%</span>
          <Badge 
            variant="secondary" 
            className={
              difficulty === 'easy' ? 'bg-success/20 text-success' :
              difficulty === 'medium' ? 'bg-warning/20 text-warning' :
              'bg-destructive/20 text-destructive'
            }
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
        </div>
      </div>

      <Card className="p-8 card-elevated animate-slide-up">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold mb-4 flex-1">
              {getQuestionText()}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => speakText(getQuestionText())}
              className="flex-shrink-0"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {t('quiz.readAloud')}
            </Button>
          </div>
          
          <Badge variant="outline" className="mb-4">
            {currentQuestion.subject}
          </Badge>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((_, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showFeedback}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                showFeedback
                  ? index === currentQuestion.correctAnswer
                    ? 'quiz-option-correct'
                    : selectedAnswers[currentQuestionIndex] === index
                    ? 'quiz-option-incorrect'
                    : 'quiz-option'
                  : selectedAnswers[currentQuestionIndex] === index
                  ? 'border-primary bg-primary/10'
                  : 'quiz-option'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  showFeedback && index === currentQuestion.correctAnswer
                    ? 'bg-success border-success'
                    : showFeedback && selectedAnswers[currentQuestionIndex] === index && index !== currentQuestion.correctAnswer
                    ? 'bg-destructive border-destructive'
                    : selectedAnswers[currentQuestionIndex] === index
                    ? 'bg-primary border-primary'
                    : 'border-border'
                }`}>
                  {showFeedback && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                  {showFeedback && selectedAnswers[currentQuestionIndex] === index && index !== currentQuestion.correctAnswer && (
                    <XCircle className="w-4 h-4 text-white" />
                  )}
                  {!showFeedback && selectedAnswers[currentQuestionIndex] === index && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="flex-1">{getOptionText(index)}</span>
              </div>
            </button>
          ))}
        </div>

        {showFeedback && (
          <Alert className={`mt-6 animate-bounce-in ${
            isAnswerCorrect ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'
          }`}>
            <AlertDescription className={`font-medium ${
              isAnswerCorrect ? 'text-success' : 'text-warning'
            }`}>
              {isAnswerCorrect ? '🎉 ' + t('quiz.correct') : '💪 ' + t('quiz.incorrect')}
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
};

export default Quiz;