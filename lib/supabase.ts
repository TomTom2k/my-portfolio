import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Profile {
  id: string;
  name: string;
  title: string;
  experience_years: number;
  intro_text: string | null;
  avatar_url: string | null;
  cv_url: string | null;
  email: string | null;
  about_paragraph_1: string | null;
  about_paragraph_2: string | null;
  footer_text: string | null;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface NavigationLink {
  id: string;
  name: string;
  hash: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface Experience {
  id: string;
  title: string;
  location: string | null;
  description: string | null;
  icon_type: string;
  date_range: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  image_url: string | null;
  link: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
}
