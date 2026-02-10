"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Loader2,
  Upload,
} from "lucide-react";
import {
  getProjects,
  createRecord,
  updateRecord,
  deleteRecord,
  uploadFile,
} from "@/lib/api";
import { Project } from "@/lib/supabase";

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    image_url: "",
    link: "",
  });

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error("Không thể tải danh sách dự án");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      tags: "",
      image_url: "",
      link: "",
    });
    setIsOpen(true);
  };

  const handleEdit = (item: Project) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      tags: item.tags ? item.tags.join(", ") : "",
      image_url: item.image_url || "",
      link: item.link || "",
    });
    setIsOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const publicUrl = await uploadFile("portfolio", file);
      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
      toast.success("Tải ảnh thành công!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Lỗi tải ảnh: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error("Vui lòng điền tên project");
      return;
    }

    setIsSaving(true);
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        description: formData.description,
        tags: tagsArray,
        image_url: formData.image_url,
        link: formData.link,
      };

      if (editingItem) {
        await updateRecord("projects", editingItem.id, payload);
        toast.success("Đã cập nhật dự án!");
      } else {
        await createRecord("projects", {
          ...payload,
          order: projects.length + 1,
          is_active: true,
        });
        toast.success("Đã thêm dự án mới!");
      }

      setIsOpen(false);
      loadProjects();
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa dự án này?")) return;

    try {
      await deleteRecord("projects", id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Đã xóa dự án!");
    } catch (error: any) {
      toast.error(`Lỗi xóa: ${error.message}`);
    }
  };

  const toggleActive = async (project: Project) => {
    try {
      const newStatus = !project.is_active;
      // Optimistic update
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, is_active: newStatus } : p,
        ),
      );

      await updateRecord("projects", project.id, { is_active: newStatus });
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
      loadProjects(); // Revert on error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các dự án hiển thị trên portfolio
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Sửa Project" : "Thêm Project"}
              </DialogTitle>
              <DialogDescription>
                Thêm hoặc sửa thông tin dự án
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tên project</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="React, TypeScript, Tailwind"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image_url">Hình ảnh</Label>
                <div className="flex gap-2">
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image_url: e.target.value,
                      }))
                    }
                    placeholder="/project-image.png hoặc https://..."
                  />
                  <div className="relative">
                    <Input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {formData.image_url && (
                  <div className="mt-2 relative w-full h-40 rounded border overflow-hidden">
                    <Image
                      src={formData.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 640px"
                    />
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="link">Demo/Source Link</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, link: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
              >
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={!project.is_active ? "opacity-50" : ""}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {project.title}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </a>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">
                    {project.description}
                  </CardDescription>
                </div>
                <Badge
                  variant={project.is_active ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => toggleActive(project)}
                >
                  {project.is_active ? "Hiển thị" : "Ẩn"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {project.image_url && (
                <div className="mb-4 h-48 w-full rounded-md overflow-hidden border relative">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(project)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1 text-red-500" />
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
