"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "Thanh Tin",
    title: "Frontend Developer",
    experience_years: 2,
    intro_text:
      "I enjoy building sites & apps. My tech stack is React (Next.js).",
    email: "ngthanhtin68@gmail.com",
    avatar_url: "/avatar.webp",
    cv_url: "/ThanhTinCV.pdf",
    about_paragraph_1:
      "I am a software developer with a degree in Software Engineering and over 2 years of experience. I have worked in both onsite and remote roles and have handled freelance projects for both web and mobile apps. I enjoy solving challenging problems and am always eager to learn new technologies.",
    about_paragraph_2:
      "My tech stack includes React, Next.js, NestJS, React Native, and TypeScript. I am known for my quick adaptability, strong learning attitude, and ability to work well in a team. I am looking for a dynamic environment with interesting projects to further grow and contribute.",
    footer_text:
      "Built with React & Next.js, TypeScript, Tailwind CSS, Framer Motion, React Email & Resend, Vercel hosting.",
  });

  const handleChange = (field: string, value: string | number) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    // TODO: Save to Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Profile đã được cập nhật!");
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý thông tin cá nhân của bạn
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>
              Thông tin hiển thị trên phần giới thiệu
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Chức danh</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experience_years">Số năm kinh nghiệm</Label>
              <Input
                id="experience_years"
                type="number"
                value={profile.experience_years}
                onChange={(e) =>
                  handleChange("experience_years", parseInt(e.target.value))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="intro_text">Giới thiệu ngắn</Label>
              <Textarea
                id="intro_text"
                value={profile.intro_text}
                onChange={(e) => handleChange("intro_text", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email liên hệ</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>Avatar và CV của bạn</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                value={profile.avatar_url}
                onChange={(e) => handleChange("avatar_url", e.target.value)}
                placeholder="https://example.com/avatar.jpg hoặc /avatar.webp"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cv_url">CV URL</Label>
              <Input
                id="cv_url"
                value={profile.cv_url}
                onChange={(e) => handleChange("cv_url", e.target.value)}
                placeholder="https://example.com/cv.pdf hoặc /ThanhTinCV.pdf"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Section</CardTitle>
            <CardDescription>Nội dung phần giới thiệu bản thân</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="about_paragraph_1">Đoạn 1</Label>
              <Textarea
                id="about_paragraph_1"
                rows={4}
                value={profile.about_paragraph_1}
                onChange={(e) =>
                  handleChange("about_paragraph_1", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="about_paragraph_2">Đoạn 2</Label>
              <Textarea
                id="about_paragraph_2"
                rows={4}
                value={profile.about_paragraph_2}
                onChange={(e) =>
                  handleChange("about_paragraph_2", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Footer</CardTitle>
            <CardDescription>Nội dung phần cuối trang</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="footer_text">Footer text</Label>
              <Textarea
                id="footer_text"
                value={profile.footer_text}
                onChange={(e) => handleChange("footer_text", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
