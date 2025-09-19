import React, { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Globe, Home, BookOpen, Trophy, BarChart3, Glasses, Award, Menu, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Dashboard from '@/components/Dashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import Quiz from '@/components/Quiz';
import Leaderboard from '@/components/Leaderboard';
import Achievements from '@/components/Achievements';
import Analytics from '@/components/Analytics';
import ARVRExperience from '@/components/ARVRExperience';

interface LayoutProps {
  children: ReactNode;
}

interface UserProfile {
  display_name: string;
  role: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, role')
      .eq('user_id', user.id)
      .single();

    if (data && !error) {
      setProfile(data);
    }
  };

  const handleQuizComplete = (score: number, accuracy: number) => {
    console.log('Quiz completed:', { score, accuracy });
    // TODO: Update user stats in database
  };

  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin';

  const navigationItems = isTeacher 
    ? [
        { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
        { id: 'analytics', label: t('nav.analytics'), icon: BarChart3 },
      ]
    : [
        { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
        { id: 'quiz', label: t('nav.quiz'), icon: BookOpen },
        { id: 'leaderboard', label: t('nav.leaderboard'), icon: Trophy },
        { id: 'achievements', label: t('nav.achievements'), icon: Award },
        { id: 'analytics', label: t('nav.analytics'), icon: BarChart3 },
        { id: 'ar', label: t('nav.ar'), icon: Glasses },
      ];

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
    { value: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  ];

  const renderCurrentPage = () => {
    if (isTeacher) {
      switch (currentPage) {
        case 'dashboard':
          return <TeacherDashboard />;
        case 'analytics':
          return <Analytics />;
        default:
          return <TeacherDashboard />;
      }
    }
    
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border/40 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-achievement rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gradient">EduLearn</h1>
                  <p className="text-sm text-muted-foreground">
                    {profile?.display_name || user?.email} {isTeacher ? '(Teacher)' : ''}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="p-4 border-b border-border/40">
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Language</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span>{option.flag}</span>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    currentPage === item.id 
                      ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-glow' 
                      : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/40">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={signOut}
            >
              <LogOut className="w-5 h-5" />
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border/40 p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-semibold capitalize">
              {navigationItems.find(item => item.id === currentPage)?.label || currentPage}
            </h2>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default Layout;