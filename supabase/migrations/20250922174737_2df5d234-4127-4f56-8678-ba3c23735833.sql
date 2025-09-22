-- Add more diverse quizzes for different subjects

-- Mathematics quizzes
INSERT INTO quizzes (title, question, options, correct_answer, difficulty, category, language, points) VALUES
('Algebra Basics', 'What is the value of x in the equation: 2x + 5 = 15?', '["3", "5", "10", "15"]', 1, 'easy', 'Mathematics', 'en', 10),
('Geometry', 'What is the area of a circle with radius 4?', '["8π", "16π", "32π", "64π"]', 1, 'medium', 'Mathematics', 'en', 15),
('Calculus', 'What is the derivative of x²?', '["x", "2x", "x²", "2x²"]', 1, 'hard', 'Mathematics', 'en', 20),
('Fractions', 'What is 3/4 + 1/2?', '["1/4", "5/4", "4/6", "7/8"]', 1, 'easy', 'Mathematics', 'en', 10),

-- Science quizzes
INSERT INTO quizzes (title, question, options, correct_answer, difficulty, category, language, points) VALUES
('Biology', 'What is the powerhouse of the cell?', '["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"]', 1, 'easy', 'Science', 'en', 10),
('Chemistry', 'What is the pH of pure water?', '["6", "7", "8", "9"]', 1, 'medium', 'Science', 'en', 15),
('Physics', 'What is the speed of light in vacuum?', '["3×10⁸ m/s", "3×10⁷ m/s", "3×10⁹ m/s", "3×10⁶ m/s"]', 0, 'hard', 'Science', 'en', 20),
('Astronomy', 'Which planet is closest to the Sun?', '["Venus", "Mercury", "Earth", "Mars"]', 1, 'easy', 'Science', 'en', 10),

-- History quizzes
INSERT INTO quizzes (title, question, options, correct_answer, difficulty, category, language, points) VALUES
('Ancient History', 'Who was the first emperor of Rome?', '["Julius Caesar", "Augustus", "Nero", "Trajan"]', 1, 'medium', 'History', 'en', 15),
('Modern History', 'In which year did the Berlin Wall fall?', '["1987", "1989", "1991", "1993"]', 1, 'medium', 'History', 'en', 15),
('World War I', 'What event triggered World War I?', '["Sinking of Lusitania", "Assassination of Archduke Franz Ferdinand", "German invasion of Belgium", "Russian Revolution"]', 1, 'hard', 'History', 'en', 20),
('American History', 'Who was the first President of the United States?', '["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"]', 1, 'easy', 'History', 'en', 10),

-- Geography quizzes
INSERT INTO quizzes (title, question, options, correct_answer, difficulty, category, language, points) VALUES
('World Capitals', 'What is the capital of Australia?', '["Sydney", "Canberra", "Melbourne", "Perth"]', 1, 'medium', 'Geography', 'en', 15),
('Rivers', 'Which is the longest river in the world?', '["Amazon", "Nile", "Mississippi", "Yangtze"]', 1, 'medium', 'Geography', 'en', 15),
('Mountains', 'What is the highest mountain in the world?', '["K2", "Mount Everest", "Kangchenjunga", "Lhotse"]', 1, 'easy', 'Geography', 'en', 10),
('Countries', 'Which country has the most time zones?', '["Russia", "USA", "China", "France"]', 0, 'hard', 'Geography', 'en', 20),

-- Literature quizzes
INSERT INTO quizzes (title, question, options, correct_answer, difficulty, category, language, points) VALUES
('Classic Literature', 'Who wrote "Pride and Prejudice"?', '["Charlotte Brontë", "Jane Austen", "Emily Dickinson", "Virginia Woolf"]', 1, 'medium', 'Literature', 'en', 15),
('Shakespeare', 'In which play does the character Hamlet appear?', '["Macbeth", "Hamlet", "Romeo and Juliet", "Othello"]', 1, 'easy', 'Literature', 'en', 10),
('Poetry', 'Who wrote "The Road Not Taken"?', '["Walt Whitman", "Robert Frost", "Emily Dickinson", "Langston Hughes"]', 1, 'medium', 'Literature', 'en', 15),

-- Computer Science quizzes
INSERT INTO quizzes (title, question, options, correct_answer, difficulty, category, language, points) VALUES
('Programming', 'What does HTML stand for?', '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"]', 0, 'easy', 'Computer Science', 'en', 10),
('Data Structures', 'Which data structure follows LIFO principle?', '["Queue", "Stack", "Array", "Linked List"]', 1, 'medium', 'Computer Science', 'en', 15),
('Algorithms', 'What is the time complexity of binary search?', '["O(n)", "O(log n)", "O(n²)", "O(1)"]', 1, 'hard', 'Computer Science', 'en', 20),

-- Art quizzes
INSERT INTO quizzes (title, question, options, correct_answer, difficulty, category, language, points) VALUES
('Famous Paintings', 'Who painted the Mona Lisa?', '["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"]', 1, 'easy', 'Art', 'en', 10),
('Art Movements', 'Which art movement was Pablo Picasso associated with?', '["Impressionism", "Cubism", "Surrealism", "Abstract Expressionism"]', 1, 'medium', 'Art', 'en', 15),

-- Music quizzes
INSERT INTO quizzes (title, question, options, correct_answer, difficulty, category, language, points) VALUES
('Classical Music', 'Who composed "The Four Seasons"?', '["Bach", "Vivaldi", "Mozart", "Beethoven"]', 1, 'medium', 'Music', 'en', 15),
('Music Theory', 'How many keys are there on a standard piano?', '["76", "88", "96", "104"]', 1, 'medium', 'Music', 'en', 15);