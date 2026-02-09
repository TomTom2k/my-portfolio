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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { getSkills, createRecord, updateRecord, deleteRecord } from "@/lib/api";
import { Skill } from "@/lib/supabase";

const categories = ["Frontend", "Backend", "Mobile", "Database", "Tools"];

export default function SkillsPage() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Skill | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", category: "Frontend" });

  const loadSkills = async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      toast.error("Không thể tải danh sách skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ name: "", category: "Frontend" });
    setIsOpen(true);
  };

  const handleEdit = (item: Skill) => {
    setEditingItem(item);
    setFormData({ name: item.name, category: item.category || "Frontend" });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Vui lòng điền tên skill");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
      };

      if (editingItem) {
        await updateRecord("skills", editingItem.id, payload);
        toast.success("Đã cập nhật skill!");
      } else {
        await createRecord("skills", {
          ...payload,
          order: skills.length + 1,
          is_active: true,
        });
        toast.success("Đã thêm skill mới!");
      }
      setIsOpen(false);
      loadSkills();
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa skill này?")) return;

    try {
      await deleteRecord("skills", id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      toast.success("Đã xóa skill!");
    } catch (error: any) {
      toast.error(`Lỗi xóa: ${error.message}`);
    }
  };

  const toggleActive = async (skill: Skill) => {
    try {
      const newStatus = !skill.is_active;
      // Optimistic update
      setSkills((prev) =>
        prev.map((s) =>
          s.id === skill.id ? { ...s, is_active: newStatus } : s,
        ),
      );

      await updateRecord("skills", skill.id, { is_active: newStatus });
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
      loadSkills();
    }
  };

  const groupedSkills = categories.reduce(
    (acc, cat) => {
      acc[cat] = skills.filter((s) => s.category === cat);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

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
                    <span className="mr-1" onClick={() => toggleActive(skill)}>
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
