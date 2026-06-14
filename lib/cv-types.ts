// Dữ liệu CV - có thể dùng từ portfolio hoặc chỉnh sửa tùy ý

export interface CVPersonal {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  intro: string; // summary / objective
  avatarUrl?: string;
}

export interface CVExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  dateRange: string;
  description: string;
  order: number;
}

export interface CVSkillItem {
  id: string;
  name: string;
  category?: string;
  order: number;
}

export interface CVProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  order: number;
}

export interface CVData {
  personal: CVPersonal;
  experiences: CVExperienceItem[];
  skills: CVSkillItem[];
  projects: CVProjectItem[];
}

export type CVTemplateId = "classic" | "modern" | "minimal";

export const CV_TEMPLATES: { id: CVTemplateId; name: string; description: string }[] = [
  { id: "classic", name: "Cổ điển", description: "Bố cục truyền thống, dễ đọc" },
  { id: "modern", name: "Hiện đại", description: "Thanh nhấn màu, typography rõ ràng" },
  { id: "minimal", name: "Tối giản", description: "Ít màu, nhiều khoảng trắng" },
];

// Map từ dữ liệu portfolio (Supabase) sang CVData
import type { Profile, Experience, Skill, Project } from "./supabase";

export function portfolioToCVData(
  profile: Profile | null,
  experiences: Experience[],
  skills: Skill[],
  projects: Project[]
): CVData {
  const activeExp = experiences.filter((e) => e.is_active).sort((a, b) => a.order - b.order);
  const activeSkills = skills.filter((s) => s.is_active).sort((a, b) => a.order - b.order);
  const activeProjects = projects.filter((p) => p.is_active).sort((a, b) => a.order - b.order);

  return {
    personal: {
      name: profile?.name ?? "",
      title: profile?.title ?? "",
      email: profile?.email ?? "",
      intro: [profile?.intro_text, profile?.about_paragraph_1].filter(Boolean).join("\n\n") ?? "",
      avatarUrl: profile?.avatar_url ?? undefined,
    },
    experiences: activeExp.map((e, i) => ({
      id: e.id,
      title: e.title,
      company: e.location ?? "",
      dateRange: e.date_range ?? "",
      description: e.description ?? "",
      order: e.order ?? i,
    })) as CVExperienceItem[],
    skills: activeSkills.map((s, i) => ({
      id: s.id,
      name: s.name,
      category: s.category ?? undefined,
      order: s.order ?? i,
    })),
    projects: activeProjects.map((p, i) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? "",
      tags: p.tags ?? [],
      link: p.link ?? undefined,
      order: p.order ?? i,
    })),
  };
}
