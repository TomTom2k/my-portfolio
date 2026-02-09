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

// Create a Supabase client with no caching for GET requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        cache: "no-store",
      });
    },
  },
});

// --- Fetch Functions ---

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from("profile").select("*").single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  return data;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching social links:", error);
    return [];
  }
  return data || [];
}

export async function getNavigationLinks(): Promise<NavigationLink[]> {
  const { data, error } = await supabase
    .from("navigation_links")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching navigation links:", error);
    return [];
  }
  return data || [];
}

export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
  return data || [];
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return data || [];
}

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
  return data || [];
}

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

// --- Generic Admin Actions ---

export async function updateRecord(table: string, id: string, updates: any) {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createRecord(table: string, record: any) {
  const { data, error } = await supabase
    .from(table)
    .insert(record)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRecord(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) throw error;
}

export async function updateListOrder(table: string, items: any[]) {
  const { error } = await supabase
    .from(table)
    .upsert(items, { onConflict: "id" });

  if (error) throw error;
}

// Specific helper for profile since it's common
export async function updateProfile(id: string, updates: Partial<Profile>) {
  return updateRecord("profile", id, updates);
}

// --- Storage Actions ---

export async function uploadFile(bucket: string, file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return data.publicUrl;
}
