import { createClient } from "@supabase/supabase-js";
import {
  Profile,
  SocialLink,
  NavigationLink,
  Experience,
  Project,
  Skill,
} from "./supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a Supabase client with no caching
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        cache: "no-store",
      });
    },
  },
});

// Fetch Profile
export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from("profile").select("*").single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  return data;
}

// Fetch Social Links
export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching social links:", error);
    return [];
  }
  return data || [];
}

// Fetch Navigation Links
export async function getNavigationLinks(): Promise<NavigationLink[]> {
  const { data, error } = await supabase
    .from("navigation_links")
    .select("*")
    .eq("is_active", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching navigation links:", error);
    return [];
  }
  return data || [];
}

// Fetch Experiences
export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("is_active", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
  return data || [];
}

// Fetch Projects
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_active", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return data || [];
}

// Fetch Skills
export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("is_active", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
  return data || [];
}

// Fetch all portfolio data at once
export async function getPortfolioData() {
  const [profile, socialLinks, navigationLinks, experiences, projects, skills] =
    await Promise.all([
      getProfile(),
      getSocialLinks(),
      getNavigationLinks(),
      getExperiences(),
      getProjects(),
      getSkills(),
    ]);

  return {
    profile,
    socialLinks,
    navigationLinks,
    experiences,
    projects,
    skills,
  };
}
