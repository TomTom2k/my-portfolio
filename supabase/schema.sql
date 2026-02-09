-- Portfolio CRM Database Schema
-- Run this in Supabase SQL Editor

-- Profile Table (chỉ 1 record)
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  intro_text TEXT,
  avatar_url TEXT,
  cv_url TEXT,
  email VARCHAR(255),
  about_paragraph_1 TEXT,
  about_paragraph_2 TEXT,
  footer_text TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Social Links Table (Dynamic Array)
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Navigation Links Table
CREATE TABLE IF NOT EXISTS navigation_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  hash VARCHAR(50) NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  location VARCHAR(100),
  description TEXT,
  icon_type VARCHAR(50) DEFAULT 'work',
  date_range VARCHAR(50),
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  link TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (optional - for public read access)
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read" ON profile FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON social_links FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON navigation_links FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON skills FOR SELECT USING (true);

-- Insert initial profile record
INSERT INTO profile (name, title, experience_years, intro_text, email)
VALUES ('Thanh Tin', 'Frontend Developer', 2, 'I enjoy building sites & apps. My tech stack is React (Next.js).', 'ngthanhtin68@gmail.com')
ON CONFLICT DO NOTHING;

-- Insert initial navigation links
INSERT INTO navigation_links (name, hash, "order") VALUES
('Home', '#home', 1),
('About', '#about', 2),
('Projects', '#projects', 3),
('Skills', '#skills', 4),
('Experience', '#experience', 5),
('Contact', '#contact', 6);

-- Insert initial social links
INSERT INTO social_links (platform, url, icon, "order") VALUES
('LinkedIn', 'https://www.linkedin.com/in/nguyen-thanh-tin-b6640b271/', 'BsLinkedin', 1),
('GitHub', 'https://github.com/TomTom2k', 'FaGithubSquare', 2);

-- Insert initial experiences
INSERT INTO experiences (title, location, description, icon_type, date_range, "order") VALUES
('TANCA.io - Front-End Developer', 'Ho Chi Minh, Vietnam', 'Built web/mobile features (news feed, calendar, e-signature, Bitrix24, ...) with React/React Native. Handled new features, bug fixes, and teamwork using Postman, Figma, GitLab.', 'react', '3/2024 - 9/2025', 1),
('CMC Media - Front-End Developer', 'Ha Noi, Vietnam', 'Worked with PHP Laravel on bug fixes, layout updates, multi-language, and mobile responsiveness. Adapted quickly, collaborating with design/dev teams.', 'work', '2/2025 - 9/2025', 2);

-- Insert initial projects
INSERT INTO projects (title, description, tags, link, "order") VALUES
('VNMusic', 'I worked as a mobile developer on the VNMusic app for 3 months. The app lets users stream music, create playlists, and get notifications about new releases.', ARRAY['React Native', 'TypeScript', 'One Signal', 'Redux'], 'https://drive.google.com/drive/folders/1Zaw7i-p-gUc6Xx7sR1rie6Q_Gm_oIl3P', 1),
('Automation Tool Studio', 'I worked on a project that converts user prompts into stories, generating characters, images, videos, sound, and voiceovers to create short videos.', ARRAY['NextJs', 'Shadcn', 'Tailwind', 'i18n', 'websockets'], 'https://drive.google.com/drive/folders/1kXY7FVsGotmquPcAUZv20uUY6Zs83s-e', 2);

-- Insert initial skills
INSERT INTO skills (name, category, "order") VALUES
('HTML', 'Frontend', 1),
('CSS', 'Frontend', 2),
('JavaScript', 'Frontend', 3),
('TypeScript', 'Frontend', 4),
('React', 'Frontend', 5),
('Next.js', 'Frontend', 6),
('React Native', 'Mobile', 7),
('Node.js', 'Backend', 8),
('Nestjs', 'Backend', 9),
('Express', 'Backend', 10),
('MongoDB', 'Database', 11),
('PostgreSQL', 'Database', 12),
('Git', 'Tools', 13),
('Tailwind', 'Frontend', 14),
('Socket.io', 'Backend', 15),
('Redux', 'Frontend', 16),
('Python', 'Backend', 17),
('Django', 'Backend', 18);
