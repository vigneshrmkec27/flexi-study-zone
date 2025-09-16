import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ta' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Login
    'login.title': 'Welcome to EduLearn',
    'login.subtitle': 'Personalized Learning for Every Student',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.loginButton': 'Sign In',
    'login.error': 'Invalid credentials. Use student/1234',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.quiz': 'Quiz',
    'nav.leaderboard': 'Leaderboard',
    'nav.achievements': 'Achievements',
    'nav.analytics': 'Analytics',
    'nav.ar': 'AR/VR',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.progress': 'Your Progress',
    'dashboard.totalScore': 'Total Score',
    'dashboard.accuracy': 'Accuracy',
    'dashboard.streak': 'Current Streak',
    'dashboard.completedQuizzes': 'Completed Quizzes',
    'dashboard.startQuiz': 'Start New Quiz',
    'dashboard.viewAnalytics': 'View Analytics',
    
    // Quiz
    'quiz.title': 'Adaptive Quiz',
    'quiz.question': 'Question',
    'quiz.of': 'of',
    'quiz.correct': 'Correct! Well done!',
    'quiz.incorrect': 'Not quite right. Keep trying!',
    'quiz.nextQuestion': 'Next Question',
    'quiz.finish': 'Finish Quiz',
    'quiz.completed': 'Quiz Completed!',
    'quiz.yourScore': 'Your Score',
    'quiz.newBadge': 'New Badge Earned!',
    'quiz.readAloud': 'Read Aloud',
    
    // Leaderboard
    'leaderboard.title': 'Top Performers',
    'leaderboard.rank': 'Rank',
    'leaderboard.name': 'Name',
    'leaderboard.score': 'Score',
    'leaderboard.accuracy': 'Accuracy',
    
    // Achievements
    'achievements.title': 'Your Achievements',
    'achievements.earned': 'Earned',
    'achievements.locked': 'Locked',
    
    // AR/VR
    'ar.title': 'Immersive Learning',
    'ar.subtitle': 'Experience learning in 3D',
    'ar.viewInAR': 'View in AR',
    'ar.viewInVR': 'View in VR',
    
    // Analytics
    'analytics.title': 'Performance Analytics',
    'analytics.scoreOverTime': 'Score Over Time',
    'analytics.accuracyTrend': 'Accuracy Trend',
    'analytics.subjectPerformance': 'Subject Performance',
  },
  ta: {
    // Login
    'login.title': 'EduLearn இல் நல்வரவு',
    'login.subtitle': 'ஒவ்வொரு மாணவருக்கும் தனிப்பயனாக்கப்பட்ட கற்றல்',
    'login.username': 'பயனர் பெயர்',
    'login.password': 'கடவுச்சொல்',
    'login.loginButton': 'உள்நுழை',
    'login.error': 'தவறான நற்சான்றிதழ்கள். student/1234 பயன்படுத்தவும்',
    
    // Navigation
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.quiz': 'வினாடி வினா',
    'nav.leaderboard': 'தலைமை பலகை',
    'nav.achievements': 'சாதனைகள்',
    'nav.analytics': 'பகுப்பாய்வு',
    'nav.ar': 'AR/VR',
    'nav.logout': 'வெளியேறு',
    
    // Dashboard
    'dashboard.welcome': 'மீண்டும் நல்வரவு',
    'dashboard.progress': 'உங்கள் முன்னேற்றம்',
    'dashboard.totalScore': 'மொத்த மதிப்பெண்',
    'dashboard.accuracy': 'துல்லியம்',
    'dashboard.streak': 'தற்போதைய வரிசை',
    'dashboard.completedQuizzes': 'முடிக்கப்பட்ட வினாக்கள்',
    'dashboard.startQuiz': 'புதிய வினாடி வினா தொடங்கவும்',
    'dashboard.viewAnalytics': 'பகுப்பாய்வு பார்க்கவும்',
    
    // Quiz
    'quiz.title': 'தகவமைப்பு வினாடி வினா',
    'quiz.question': 'கேள்வி',
    'quiz.of': 'இல்',
    'quiz.correct': 'சரி! நல்லது!',
    'quiz.incorrect': 'சரியாக இல்லை. தொடர்ந்து முயற்சிக்கவும்!',
    'quiz.nextQuestion': 'அடுத்த கேள்வி',
    'quiz.finish': 'வினாடி வினா முடிக்கவும்',
    'quiz.completed': 'வினாடி வினா முடிந்தது!',
    'quiz.yourScore': 'உங்கள் മതிப்பെண்',
    'quiz.newBadge': 'புதிய பேட் పெதუயுت!',
    'quiz.readAloud': 'சத்தமாக படிக்கவும்',
    
    // Common translations for other sections...
    'leaderboard.title': 'சிறந்த செயல்பாட்டாளர்கள்',
    'achievements.title': 'உங்கள் சாதनைகள்',
    'ar.title': 'ஈர்க்கும் கற்றல்',
    'analytics.title': 'செயல்திறன் பகுப்பாய்வு',
  },
  hi: {
    // Login
    'login.title': 'EduLearn में आपका स्वागत है',
    'login.subtitle': 'हर छात्र के लिए व्यक्तिगत शिक्षा',
    'login.username': 'उपयोगकर्ता नाम',
    'login.password': 'पासवर्ड',
    'login.loginButton': 'साइन इन करें',
    'login.error': 'गलत क्रेडेंशियल। student/1234 का उपयोग करें',
    
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.quiz': 'प्रश्नोत्तरी',
    'nav.leaderboard': 'लीडरबोर्ड',
    'nav.achievements': 'उपलब्धियां',
    'nav.analytics': 'एनालिटिक्स',
    'nav.ar': 'AR/VR',
    'nav.logout': 'लॉग आउट',
    
    // Dashboard
    'dashboard.welcome': 'वापसी पर स्वागत है',
    'dashboard.progress': 'आपकी प्रगति',
    'dashboard.totalScore': 'कुल स्कोर',
    'dashboard.accuracy': 'सटीकता',
    'dashboard.streak': 'वर्तमान स्ट्रीक',
    'dashboard.completedQuizzes': 'पूर्ण प्रश्नोत्तरी',
    'dashboard.startQuiz': 'नई प्रश्नोत्तरी शुरू करें',
    'dashboard.viewAnalytics': 'एनालिटिक्स देखें',
    
    // Quiz
    'quiz.title': 'अनुकूली प्रश्नोत्तरी',
    'quiz.question': 'प्रश्न',
    'quiz.of': 'का',
    'quiz.correct': 'सही! बहुत बढ़िया!',
    'quiz.incorrect': 'बिल्कुल सही नहीं। कोशिश करते रहें!',
    'quiz.nextQuestion': 'अगला प्रश्न',
    'quiz.finish': 'प्रश्नोत्तरी समाप्त करें',
    'quiz.completed': 'प्रश्नोत्तरी पूर्ण!',
    'quiz.yourScore': 'आपका स्कोर',
    'quiz.newBadge': 'नया बैज अर्जित!',
    'quiz.readAloud': 'जोर से पढ़ें',
    
    // Common translations for other sections...
    'leaderboard.title': 'शीर्ष प्रदर्शनकर्ता',
    'achievements.title': 'आपकी उपलब्धियां',
    'ar.title': 'गहन शिक्षा',
    'analytics.title': 'प्रदर्शन एनालिटिक्स',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};