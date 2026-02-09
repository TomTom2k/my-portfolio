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
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  order: number;
  is_active: boolean;
}

const categories = ["Frontend", "Backend", "Mobile", "Database", "Tools"];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([
    { id: "1", name: "HTML", category: "Frontend", order: 1, is_active: true },
    { id: "2", name: "CSS", category: "Frontend", order: 2, is_active: true },
    {
      id: "3",
      name: "JavaScript",
      category: "Frontend",
      order: 3,
      is_active: true,
    },
    {
      id: "4",
      name: "TypeScript",
      category: "Frontend",
      order: 4,
      is_active: true,
    },
    { id: "5", name: "React", category: "Frontend", order: 5, is_active: true },
    {
      id: "6",
      name: "Next.js",
      category: "Frontend",
      order: 6,
      is_active: true,
    },
    {
      id: "7",
      name: "React Native",
      category: "Mobile",
      order: 7,
      is_active: true,
    },
    {
      id: "8",
      name: "Node.js",
      category: "Backend",
      order: 8,
      is_active: true,
    },
    { id: "9", name: "Nestjs", category: "Backend", order: 9, is_active: true },
    {
      id: "10",
      name: "Express",
      category: "Backend",
      order: 10,
      is_active: true,
    },
    {
      id: "11",
      name: "MongoDB",
      category: "Database",
      order: 11,
      is_active: true,
    },
    {
      id: "12",
      name: "PostgreSQL",
      category: "Database",
      order: 12,
      is_active: true,
    },
    { id: "13", name: "Git", category: "Tools", order: 13, is_active: true },
    {
      id: "14",
      name: "Tailwind",
      category: "Frontend",
      order: 14,
      is_active: true,
    },
    {
      id: "15",
      name: "Socket.io",
      category: "Backend",
      order: 15,
      is_active: true,
    },
    {
      id: "16",
      name: "Redux",
      category: "Frontend",
      order: 16,
      is_active: true,
    },
    {
      id: "17",
      name: "Python",
      category: "Backend",
      order: 17,
      is_active: true,
    },
    {
      id: "18",
      name: "Django",
      category: "Backend",
      order: 18,
      is_active: true,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({ name: "", category: "Frontend" });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ name: "", category: "Frontend" });
    setIsOpen(true);
  };

  const handleEdit = (item: Skill) => {
    setEditingItem(item);
    setFormData({ name: item.name, category: item.category });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error("Vui lòng điền tên skill");
      return;
    }

    if (editingItem) {
      setSkills((prev) =>
        prev.map((s) => (s.id === editingItem.id ? { ...s, ...formData } : s)),
      );
      toast.success("Đã cập nhật!");
    } else {
      const newItem: Skill = {
        id: Date.now().toString(),
        ...formData,
        order: skills.length + 1,
        is_active: true,
      };
      setSkills((prev) => [...prev, newItem]);
      toast.success("Đã thêm mới!");
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    toast.success("Đã xóa!");
  };

  const toggleActive = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s)),
    );
  };

  const groupedSkills = categories.reduce(
    (acc, cat) => {
      acc[cat] = skills.filter((s) => s.category === cat);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các kỹ năng hiển thị trên portfolio
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Sửa Skill" : "Thêm Skill"}
              </DialogTitle>
              <DialogDescription>Thêm hoặc sửa kỹ năng</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên skill</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="React, TypeScript, ..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg">{category}</CardTitle>
              <CardDescription>
                {groupedSkills[category]?.length || 0} skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {groupedSkills[category]?.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant={skill.is_active ? "default" : "secondary"}
                    className="group cursor-pointer pl-3 pr-1 py-1"
                  >
                    <span
                      className="mr-1"
                      onClick={() => toggleActive(skill.id)}
                    >
                      {skill.name}
                    </span>
                    <button
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleEdit(skill)}
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(skill.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
