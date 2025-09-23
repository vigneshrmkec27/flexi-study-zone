import React, { useState } from 'react';
import Dashboard from './Dashboard';
import RealAnalytics from './RealAnalytics';
import SubjectQuizzes from './SubjectQuizzes';
import Quiz from './Quiz';

type ViewState = 'dashboard' | 'analytics' | 'subject' | 'quiz';

interface QuizData {
  id: string;
  title: string;
  question: string;
  options: any;
  difficulty: string;
  points: number;
  category: string;
}

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);

  const handleViewAnalytics = () => {
    setCurrentView('analytics');
  };

  const handleViewSubject = (category: string) => {
    console.log('handleViewSubject called with:', category);
    setSelectedCategory(category);
    setCurrentView('subject');
    console.log('State updated - currentView: subject, selectedCategory:', category);
  };

  const handleStartQuiz = (quiz?: QuizData) => {
    if (quiz) {
      setSelectedQuiz(quiz);
    }
    setCurrentView('quiz');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCategory('');
    setSelectedQuiz(null);
  };

  const handleBackToSubject = () => {
    setCurrentView('subject');
    setSelectedQuiz(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'analytics':
        return <RealAnalytics />;
      case 'subject':
        return (
          <SubjectQuizzes
            category={selectedCategory}
            onBack={handleBackToDashboard}
            onStartQuiz={handleStartQuiz}
          />
        );
      case 'quiz':
        return (
          <Quiz onQuizComplete={(score, accuracy) => {
            console.log('Quiz completed:', score, accuracy);
            handleBackToDashboard();
          }} />
        );
      default:
        return (
          <Dashboard
            onStartQuiz={handleStartQuiz}
            onViewAnalytics={handleViewAnalytics}
            onViewSubject={handleViewSubject}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Debug info - remove in production */}
      <div className="fixed top-0 right-0 bg-red-500 text-white p-2 text-xs z-50">
        Current View: {currentView} | Category: {selectedCategory}
      </div>
      {renderCurrentView()}
    </div>
  );
};

export default MainApp;