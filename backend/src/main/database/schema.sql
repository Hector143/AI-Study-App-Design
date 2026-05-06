-- QuizoraAI Database Schema
-- Optimized for MySQL 8.0

CREATE DATABASE IF NOT EXISTS quizora_db;
USE quizora_db;

-- 1. AUTHENTICATION MODULE
-- Supports "Login" and "Create Account" screens including OAuth providers
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255), -- Nullable for Social Login (Google/GitHub)
    auth_provider ENUM('local', 'google', 'github') DEFAULT 'local',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. GAMIFICATION MODULE
-- Powers the Dashboard Cards: Streaks, Total XP, Accuracy, and Quiz count
CREATE TABLE IF NOT EXISTS user_stats (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    total_xp INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    overall_accuracy DECIMAL(5, 2) DEFAULT 0.00,
    total_quizzes_completed INT DEFAULT 0,
    last_quiz_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. CONTENT MODULE
-- Powers the Subject Grid (General Science, Math, etc.)
CREATE TABLE IF NOT EXISTS subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    icon_name VARCHAR(50), -- Reference to Lucide/React icons
    tags VARCHAR(255), -- e.g., "Biology, Chemistry"
    question_count INT DEFAULT 10
);

-- 4. ACTIVITY LOG MODULE
-- Powers the "Recent Activity" sidebar and Progress Bars
CREATE TABLE IF NOT EXISTS quiz_attempts (
    attempt_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    score_obtained INT NOT NULL,
    max_score INT NOT NULL,
    accuracy_percentage INT NOT NULL,
    xp_earned INT DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 5. INITIAL DATA SEEDING (Matches your UI)
INSERT INTO subjects (title, description, difficulty, icon_name, tags) VALUES 
('General Science', 'Explore biology, chemistry, physics and more', 'Medium', 'flask', 'Biology, Chemistry'),
('Mathematics', 'Numbers, algebra, geometry & calculus', 'Hard', 'ruler', 'Algebra, Geometry'),
('Programming', 'Code, algorithms & computer science', 'Medium', 'terminal', 'Web, Algorithms'),
('World History', 'Ancient civilizations to modern events', 'Medium', 'globe', 'Ancient, Modern');