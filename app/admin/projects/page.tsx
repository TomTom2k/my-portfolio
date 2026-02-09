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
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image_url: string;
  link: string;
  order: number;
  is_active: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "VNMusic",
      description:
        "I worked as a mobile developer on the VNMusic app for 3 months. The app lets users stream music, create playlists, and get notifications about new releases.",
      tags: ["React Native", "TypeScript", "One Signal", "Redux"],
      image_url: "/vnmusic.png",
      link: "https://drive.google.com/drive/folders/1Zaw7i-p-gUc6Xx7sR1rie6Q_Gm_oIl3P",
      order: 1,
      is_active: true,
    },
    {
      id: "2",
      title: "Automation Tool Studio",
      description:
        "I worked on a project that converts user prompts into stories, generating characters, images, videos, sound, and voiceovers to create short videos.",
      tags: ["NextJs", "Shadcn", "Tailwind", "i18n", "websockets"],
      image_url: "/ai-studio.png",
      link: "https://drive.google.com/drive/folders/1kXY7FVsGotmquPcAUZv20uUY6Zs83s-e",
      order: 2,
      is_active: true,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    image_url: "",
    link: "",
  });

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
      description: item.description,
      tags: item.tags.join(", "),
      image_url: item.image_url,
      link: item.link,
    });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      toast.error("Vui lòng điền tên project");
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingItem) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingItem.id ? { ...p, ...formData, tags: tagsArray } : p,
        ),
      );
      toast.success("Đã cập nhật!");
    } else {
      const newItem: Project = {
        id: Date.now().toString(),
        ...formData,
        tags: tagsArray,
        order: projects.length + 1,
        is_active: true,
      };
      setProjects((prev) => [...prev, newItem]);
      toast.success("Đã thêm mới!");
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success("Đã xóa!");
  };

  const toggleActive = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p)),
    );
  };

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
          <DialogContent className="max-w-lg">
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
                <Label htmlFor="image_url">Image URL</Label>
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
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave}>Lưu</Button>
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
                  onClick={() => toggleActive(project.id)}
                >
                  {project.is_active ? "Hiển thị" : "Ẩn"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.map((tag) => (
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
