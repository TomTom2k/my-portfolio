"use client";

import { useEffect, useState } from "react";
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
import { Save, Loader2, Upload, FileIcon } from "lucide-react";
import { getProfile, updateProfile, uploadFile } from "@/lib/api";
import { Profile } from "@/lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({
    name: "",
    title: "",
    experience_years: 0,
    intro_text: "",
    email: "",
    avatar_url: "",
    cv_url: "",
    about_paragraph_1: "",
    about_paragraph_2: "",
    footer_text: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        toast.error("Không thể tải thông tin profile");
      } finally {
        setInitialLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (field: keyof Profile, value: string | number) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (
    field: "avatar_url" | "cv_url",
    file: File,
  ) => {
    const isAvatar = field === "avatar_url";
    if (isAvatar) setUploadingAvatar(true);
    else setUploadingCV(true);

    try {
      // Lưu ý: Bạn cần tạo bucket tên là 'portfolio' trong Supabase Storage và đặt chế độ Public
      const publicUrl = await uploadFile("portfolio", file);
      handleChange(field, publicUrl);
      toast.success(`Đã tải lên ${isAvatar ? "Avatar" : "CV"} thành công!`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Lỗi tải lên: ${error.message || "Đã có lỗi xảy ra"}`);
    } finally {
      if (isAvatar) setUploadingAvatar(false);
      else setUploadingCV(false);
    }
  };

  const handleSave = async () => {
    if (!profile.id) {
      toast.error("Không tìm thấy ID profile");
      return;
    }

    setLoading(true);
    try {
      const { updated_at, ...updates } = profile;
      await updateProfile(profile.id, updates);
      toast.success("Profile đã được cập nhật!");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(`Lỗi: ${error.message || "Không thể cập nhật profile"}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
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
                value={profile.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Chức danh</Label>
              <Input
                id="title"
                value={profile.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experience_years">Số năm kinh nghiệm</Label>
              <Input
                id="experience_years"
                type="number"
                value={profile.experience_years || 0}
                onChange={(e) =>
                  handleChange(
                    "experience_years",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="intro_text">Giới thiệu ngắn</Label>
              <Textarea
                id="intro_text"
                value={profile.intro_text || ""}
                onChange={(e) => handleChange("intro_text", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email liên hệ</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ""}
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
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label>Avatar</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-full bg-muted overflow-hidden border">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload("avatar_url", file);
                    }}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Label
                    htmlFor="avatar-upload"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Tải lên Avatar mới
                  </Label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Hỗ trợ: JPG, PNG, WEBP. Tối đa 2MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-2 border-t pt-6">
              <Label>CV (PDF)</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted border">
                  <FileIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {profile.cv_url ? (
                      <a
                        href={profile.cv_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-primary hover:underline truncate max-w-xs"
                      >
                        File CV hiện tại
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Chưa có file CV
                      </span>
                    )}
                    {uploadingCV && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload("cv_url", file);
                    }}
                    className="hidden"
                    id="cv-upload"
                  />
                  <Label
                    htmlFor="cv-upload"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Tải lên CV mới
                  </Label>
                </div>
              </div>
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
                value={profile.about_paragraph_1 || ""}
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
                value={profile.about_paragraph_2 || ""}
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
                value={profile.footer_text || ""}
                onChange={(e) => handleChange("footer_text", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
