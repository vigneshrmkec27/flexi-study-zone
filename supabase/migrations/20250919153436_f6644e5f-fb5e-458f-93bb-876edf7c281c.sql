-- Create user profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'ta', 'hi')),
  total_score INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of options
  correct_answer INTEGER NOT NULL, -- Index of correct option
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ta', 'hi')),
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_attempts table to track user progress
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken INTEGER, -- in seconds
  difficulty_at_attempt TEXT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  condition_type TEXT NOT NULL, -- 'score', 'streak', 'quiz_count', etc.
  condition_value INTEGER NOT NULL,
  points INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create analytics table for tracking daily stats
CREATE TABLE public.daily_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  active_users INTEGER DEFAULT 0,
  total_quizzes_attempted INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for quizzes (public read access)
CREATE POLICY "Anyone can view quizzes" ON public.quizzes FOR SELECT USING (true);

-- RLS Policies for quiz_attempts
CREATE POLICY "Users can view their own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements (public read)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for analytics (public read for charts)
CREATE POLICY "Anyone can view analytics" ON public.daily_analytics FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample achievements
INSERT INTO public.achievements (name, description, icon, condition_type, condition_value, points) VALUES
  ('First Steps', 'Complete your first quiz', '🎯', 'quiz_count', 1, 50),
  ('Getting Started', 'Complete 5 quizzes', '🚀', 'quiz_count', 5, 100),
  ('Quiz Master', 'Complete 25 quizzes', '👑', 'quiz_count', 25, 250),
  ('Streak Starter', 'Get a 3-day streak', '🔥', 'streak', 3, 100),
  ('On Fire', 'Get a 7-day streak', '🌟', 'streak', 7, 200),
  ('High Scorer', 'Score 500 total points', '💎', 'score', 500, 150),
  ('Perfectionist', 'Get 10 perfect scores', '⭐', 'perfect_count', 10, 300);

-- Insert sample quizzes (English)
INSERT INTO public.quizzes (title, question, options, correct_answer, difficulty, category, language, points) VALUES
  ('Basic Math', 'What is 2 + 2?', '["2", "3", "4", "5"]', 2, 'easy', 'Mathematics', 'en', 10),
  ('Colors', 'What color do you get when you mix red and blue?', '["Green", "Purple", "Orange", "Yellow"]', 1, 'easy', 'Science', 'en', 10),
  ('Geography', 'What is the capital of France?', '["London", "Berlin", "Paris", "Madrid"]', 2, 'medium', 'Geography', 'en', 15),
  ('History', 'In which year did World War II end?', '["1944", "1945", "1946", "1947"]', 1, 'medium', 'History', 'en', 15),
  ('Science', 'What is the chemical symbol for gold?', '["Go", "Gd", "Au", "Ag"]', 2, 'hard', 'Science', 'en', 20),
  ('Literature', 'Who wrote "Romeo and Juliet"?', '["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"]', 1, 'medium', 'Literature', 'en', 15),
  ('Math Advanced', 'What is the square root of 144?', '["10", "11", "12", "13"]', 2, 'medium', 'Mathematics', 'en', 15),
  ('Physics', 'What is the speed of light?', '["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "301,000,000 m/s"]', 0, 'hard', 'Science', 'en', 20);

-- Insert sample Tamil quizzes
INSERT INTO public.quizzes (title, question, options, correct_answer, difficulty, category, language, points) VALUES
  ('அடிப்படை கணிதம்', '2 + 2 என்னவாகும்?', '["2", "3", "4", "5"]', 2, 'easy', 'Mathematics', 'ta', 10),
  ('வண்ணங்கள்', 'சிவப்பு மற்றும் நீலம் கலந்தால் என்ன நிறம் கிடைக்கும்?', '["பச்சை", "ஊதா", "ஆரஞ்சு", "மஞ்சள்"]', 1, 'easy', 'Science', 'ta', 10),
  ('புவியியல்', 'பிரான்சின் தலைநகரம் எது?', '["லண்டன்", "பெர்லின்", "பாரிஸ்", "மாட்ரிட்"]', 2, 'medium', 'Geography', 'ta', 15);

-- Insert sample Hindi quizzes  
INSERT INTO public.quizzes (title, question, options, correct_answer, difficulty, category, language, points) VALUES
  ('बुनियादी गणित', '2 + 2 क्या होता है?', '["2", "3", "4", "5"]', 2, 'easy', 'Mathematics', 'hi', 10),
  ('रंग', 'लाल और नीले को मिलाने से कौन सा रंग बनता है?', '["हरा", "बैंगनी", "नारंगी", "पीला"]', 1, 'easy', 'Science', 'hi', 10),
  ('भूगोल', 'फ्रांस की राजधानी क्या है?', '["लंदन", "बर्लिन", "पैरिस", "मैड्रिड"]', 2, 'medium', 'Geography', 'hi', 15);