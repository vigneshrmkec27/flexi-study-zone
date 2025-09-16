import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import React, { useState } from "react";
import Login from "@/components/Login";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import Quiz from "@/components/Quiz";
import Leaderboard from "@/components/Leaderboard";
import Achievements from "@/components/Achievements";
import Analytics from "@/components/Analytics";
import ARVRExperience from "@/components/ARVRExperience";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setCurrentPage('dashboard');
  };

  const handleQuizComplete = (score: number, accuracy: number) => {
    // In a real app, this would update user stats
    console.log('Quiz completed:', { score, accuracy });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            onStartQuiz={() => setCurrentPage('quiz')}
            onViewAnalytics={() => setCurrentPage('analytics')}
          />
        );
      case 'quiz':
        return <Quiz onQuizComplete={handleQuizComplete} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'achievements':
        return <Achievements />;
      case 'analytics':
        return <Analytics />;
      case 'ar':
        return <ARVRExperience />;
      default:
        return (
          <Dashboard
            onStartQuiz={() => setCurrentPage('quiz')}
            onViewAnalytics={() => setCurrentPage('analytics')}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {!isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Layout
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onLogout={handleLogout}
              username={username}
            >
              {renderCurrentPage()}
            </Layout>
          )}
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
