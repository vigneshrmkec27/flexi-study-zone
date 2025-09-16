import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Users, Trophy, Brain } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === 'student' && password === '1234') {
      onLogin(username);
    } else {
      setError(t('login.error'));
    }
    setIsLoading(false);
  };

  const features = [
    { icon: Brain, title: 'Adaptive Learning', description: 'AI-powered personalized quizzes' },
    { icon: Users, title: 'Collaborative', description: 'Learn with peers worldwide' },
    { icon: Trophy, title: 'Achievements', description: 'Earn badges and climb leaderboards' },
    { icon: BookOpen, title: 'Multi-subject', description: 'Comprehensive learning materials' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-achievement/10">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Features */}
        <div className="space-y-8 animate-fade-in">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-gradient mb-4">
              {t('login.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('login.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-gradient animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex justify-center lg:justify-end animate-slide-up">
          <Card className="w-full max-w-md p-8 card-elevated">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-achievement rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{t('login.title')}</h2>
              </div>

              {error && (
                <Alert variant="destructive" className="animate-bounce-in">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">{t('login.username')}</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="student"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">{t('login.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="1234"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-hero"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  t('login.loginButton')
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Demo credentials: <code className="bg-muted px-2 py-1 rounded">student / 1234</code>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;