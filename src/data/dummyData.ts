export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  translations: {
    [key: string]: {
      question: string;
      options: string[];
    };
  };
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  accuracy: number;
  avatar: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface UserStats {
  totalScore: number;
  accuracy: number;
  currentStreak: number;
  completedQuizzes: number;
  level: number;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    difficulty: "easy",
    subject: "Mathematics",
    translations: {
      ta: {
        question: "2 + 2 என்ன?",
        options: ["3", "4", "5", "6"]
      },
      hi: {
        question: "2 + 2 क्या है?",
        options: ["3", "4", "5", "6"]
      }
    }
  },
  {
    id: 2,
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correctAnswer: 1,
    difficulty: "easy",
    subject: "Science",
    translations: {
      ta: {
        question: "சூর்యனுக்கு மிக அருகில் உள்ள கிரகம் எது?",
        options: ["வெண்மதி", "புதன்", "பூமி", "செவ்வாய்"]
      },
      hi: {
        question: "सूर्य के सबसे नजदीक कौन सा ग्रह है?",
        options: ["शुक्र", "बुध", "पृथ्वी", "मंगल"]
      }
    }
  },
  {
    id: 3,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    difficulty: "easy",
    subject: "Geography",
    translations: {
      ta: {
        question: "பிரான்சின் தலைநகரம் எது?",
        options: ["லண்டன்", "பெர்லின்", "பாரிஸ்", "மாட்ரிட்"]
      },
      hi: {
        question: "फ्रांस की राजधानी क्या है?",
        options: ["लंदन", "बर्लिन", "पेरिस", "मैड्रिड"]
      }
    }
  },
  {
    id: 4,
    question: "What is 15 × 7?",
    options: ["95", "105", "115", "125"],
    correctAnswer: 1,
    difficulty: "medium",
    subject: "Mathematics",
    translations: {
      ta: {
        question: "15 × 7 என்ன?",
        options: ["95", "105", "115", "125"]
      },
      hi: {
        question: "15 × 7 क्या है?",
        options: ["95", "105", "115", "125"]
      }
    }
  },
  {
    id: 5,
    question: "Which gas makes up most of Earth's atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: 1,
    difficulty: "medium",
    subject: "Science",
    translations: {
      ta: {
        question: "பூமியின் வாயுमंडलத்தில் அதிகம் உள்ள வாயு எது?",
        options: ["ஆக்ஸிஜன்", "நைட்ரஜன்", "கார்பன் டை ஆக்சைடு", "ஹைட்ரஜன்"]
      },
      hi: {
        question: "पृथ्वी के वायुमंडल में सबसे ज्यादा कौन सी गैस है?",
        options: ["ऑक्सीजन", "नाइट्रोजन", "कार्बन डाइऑक्साइड", "हाइड्रोजन"]
      }
    }
  },
  {
    id: 6,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    difficulty: "medium",
    subject: "Literature",
    translations: {
      ta: {
        question: "'Romeo and Juliet' யார் எழுதினார்?",
        options: ["சார்லஸ் டிக்கன்ஸ்", "வில்லியம் ஷேக்ஸ்பியர்", "ஜேன் ஆஸ்டன்", "மார்க் ட்வைன்"]
      },
      hi: {
        question: "'Romeo and Juliet' किसने लिखा?",
        options: ["चार्ल्स डिकेंस", "विलियम शेक्सपियर", "जेन ऑस्टन", "मार्क ट्वेन"]
      }
    }
  },
  {
    id: 7,
    question: "What is the derivative of x²?",
    options: ["x", "2x", "x²", "2x²"],
    correctAnswer: 1,
    difficulty: "hard",
    subject: "Mathematics",
    translations: {
      ta: {
        question: "x² இன் வகைக்கெழு என்ன?",
        options: ["x", "2x", "x²", "2x²"]
      },
      hi: {
        question: "x² का अवकलन क्या है?",
        options: ["x", "2x", "x²", "2x²"]
      }
    }
  },
  {
    id: 8,
    question: "Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Gold", "Aluminum", "Argon"],
    correctAnswer: 1,
    difficulty: "hard",
    subject: "Chemistry",
    translations: {
      ta: {
        question: "'Au' என்ற வேதியியல் குறிீடு கொண்ட தனிமம் எது?",
        options: ["வெள்ளி", "தங்கம்", "அலுमினியம்", "ஆர்கான்"]
      },
      hi: {
        question: "किस तत्व का रासायनिक प्रतीक 'Au' है?",
        options: ["चांदी", "सोना", "एल्यूमिनियम", "आर्गन"]
      }
    }
  },
  {
    id: 9,
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    difficulty: "hard",
    subject: "History",
    translations: {
      ta: {
        question: "இரண்டாம் உலக युद்धம் எந்த ஆண்டில் முடிந்தது?",
        options: ["1944", "1945", "1946", "1947"]
      },
      hi: {
        question: "द्वितीय विश्व युद्ध किस वर्ष समाप्त हुआ?",
        options: ["1944", "1945", "1946", "1947"]
      }
    }
  },
  {
    id: 10,
    question: "What is the speed of light in vacuum?",
    options: ["299,792,458 m/s", "300,000,000 m/s", "299,792,458 km/s", "300,000 km/s"],
    correctAnswer: 0,
    difficulty: "hard",
    subject: "Physics",
    translations: {
      ta: {
        question: "வெற்றிடத்தில் ஒளியின் வேகം என்ன?",
        options: ["299,792,458 m/s", "300,000,000 m/s", "299,792,458 km/s", "300,000 km/s"]
      },
      hi: {
        question: "निर्वात में प्रकाश की गति क्या है?",
        options: ["299,792,458 m/s", "300,000,000 m/s", "299,792,458 km/s", "300,000 km/s"]
      }
    }
  }
];

export const leaderboard: LeaderboardEntry[] = [
  { id: 1, name: "Alex Chen", score: 2450, accuracy: 95, avatar: "👨‍💻" },
  { id: 2, name: "Priya Sharma", score: 2380, accuracy: 92, avatar: "👩‍🎓" },
  { id: 3, name: "Student (You)", score: 2200, accuracy: 88, avatar: "👤" },
  { id: 4, name: "Mohammed Ali", score: 2150, accuracy: 85, avatar: "👨‍🎓" },
  { id: 5, name: "Sarah Johnson", score: 2100, accuracy: 90, avatar: "👩‍💼" },
  { id: 6, name: "Raj Patel", score: 2050, accuracy: 87, avatar: "👨‍🔬" },
  { id: 7, name: "Emily Davis", score: 2000, accuracy: 83, avatar: "👩‍🏫" },
  { id: 8, name: "Carlos Rodriguez", score: 1950, accuracy: 89, avatar: "👨‍🎨" },
];

export const achievements: Achievement[] = [
  {
    id: 1,
    name: "First Quiz",
    description: "Complete your first quiz",
    icon: "🎯",
    earned: true,
    earnedDate: "2024-01-15"
  },
  {
    id: 2,
    name: "Perfect Score",
    description: "Get 100% on any quiz",
    icon: "⭐",
    earned: true,
    earnedDate: "2024-02-01"
  },
  {
    id: 3,
    name: "Speed Learner",
    description: "Complete 5 quizzes in one day",
    icon: "⚡",
    earned: false
  },
  {
    id: 4,
    name: "Math Master",
    description: "Score 90% or higher on 3 math quizzes",
    icon: "🧮",
    earned: true,
    earnedDate: "2024-02-10"
  },
  {
    id: 5,
    name: "Science Explorer",
    description: "Complete all science topics",
    icon: "🔬",
    earned: false
  },
  {
    id: 6,
    name: "Streak Master",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    earned: false
  },
  {
    id: 7,
    name: "Multilingual",
    description: "Take quizzes in all 3 languages",
    icon: "🌍",
    earned: false
  },
  {
    id: 8,
    name: "Top Performer",
    description: "Reach top 3 on leaderboard",
    icon: "🏆",
    earned: true,
    earnedDate: "2024-02-15"
  }
];

export const userStats: UserStats = {
  totalScore: 2200,
  accuracy: 88,
  currentStreak: 5,
  completedQuizzes: 25,
  level: 8
};

export const analyticsData = {
  scoreOverTime: [
    { date: '2024-01-01', score: 1200 },
    { date: '2024-01-08', score: 1350 },
    { date: '2024-01-15', score: 1500 },
    { date: '2024-01-22', score: 1680 },
    { date: '2024-01-29', score: 1820 },
    { date: '2024-02-05', score: 1950 },
    { date: '2024-02-12', score: 2100 },
    { date: '2024-02-19', score: 2200 },
  ],
  accuracyTrend: [
    { date: '2024-01-01', accuracy: 75 },
    { date: '2024-01-08', accuracy: 78 },
    { date: '2024-01-15', accuracy: 80 },
    { date: '2024-01-22', accuracy: 82 },
    { date: '2024-01-29', accuracy: 85 },
    { date: '2024-02-05', accuracy: 86 },
    { date: '2024-02-12', accuracy: 87 },
    { date: '2024-02-19', accuracy: 88 },
  ],
  subjectPerformance: [
    { subject: 'Mathematics', score: 92 },
    { subject: 'Science', score: 88 },
    { subject: 'Geography', score: 85 },
    { subject: 'Literature', score: 90 },
    { subject: 'History', score: 82 },
    { subject: 'Chemistry', score: 86 },
    { subject: 'Physics', score: 89 },
  ]
};