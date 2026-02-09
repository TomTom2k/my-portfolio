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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  location: string;
  description: string;
  icon_type: string;
  date_range: string;
  order: number;
  is_active: boolean;
}

const iconOptions = [
  { value: "work", label: "💼 Work" },
  { value: "react", label: "⚛️ React" },
  { value: "education", label: "🎓 Education" },
];

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      title: "TANCA.io - Front-End Developer",
      location: "Ho Chi Minh, Vietnam",
      description:
        "Built web/mobile features (news feed, calendar, e-signature, Bitrix24, ...) with React/React Native.",
      icon_type: "react",
      date_range: "3/2024 - 9/2025",
      order: 1,
      is_active: true,
    },
    {
      id: "2",
      title: "CMC Media - Front-End Developer",
      location: "Ha Noi, Vietnam",
      description:
        "Worked with PHP Laravel on bug fixes, layout updates, multi-language, and mobile responsiveness.",
      icon_type: "work",
      date_range: "2/2025 - 9/2025",
      order: 2,
      is_active: true,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    icon_type: "work",
    date_range: "",
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      location: "",
      description: "",
      icon_type: "work",
      date_range: "",
    });
    setIsOpen(true);
  };

  const handleEdit = (item: Experience) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      location: item.location,
      description: item.description,
      icon_type: item.icon_type,
      date_range: item.date_range,
    });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      toast.error("Vui lòng điền tiêu đề");
      return;
    }

    if (editingItem) {
      setExperiences((prev) =>
        prev.map((e) => (e.id === editingItem.id ? { ...e, ...formData } : e)),
      );
      toast.success("Đã cập nhật!");
    } else {
      const newItem: Experience = {
        id: Date.now().toString(),
        ...formData,
        order: experiences.length + 1,
        is_active: true,
      };
      setExperiences((prev) => [...prev, newItem]);
      toast.success("Đã thêm mới!");
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    toast.success("Đã xóa!");
  };

  const toggleActive = (id: string) => {
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_active: !e.is_active } : e)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experiences</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý kinh nghiệm làm việc
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
                {editingItem ? "Sửa Experience" : "Thêm Experience"}
              </DialogTitle>
              <DialogDescription>
                Thêm hoặc sửa kinh nghiệm làm việc
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề (Vị trí - Công ty)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Frontend Developer - Company Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Địa điểm</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Ho Chi Minh, Vietnam"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date_range">Thời gian</Label>
                <Input
                  id="date_range"
                  value={formData.date_range}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      date_range: e.target.value,
                    }))
                  }
                  placeholder="3/2024 - 9/2025"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="icon_type">Icon</Label>
                <select
                  id="icon_type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.icon_type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      icon_type: e.target.value,
                    }))
                  }
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
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
                  placeholder="Mô tả công việc đã làm..."
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

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Experience</CardTitle>
          <CardDescription>Kéo thả để sắp xếp thứ tự hiển thị</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  </TableCell>
                  <TableCell className="font-medium max-w-[250px]">
                    <div className="truncate">{exp.title}</div>
                  </TableCell>
                  <TableCell>{exp.location}</TableCell>
                  <TableCell>{exp.date_range}</TableCell>
                  <TableCell>
                    <Badge
                      variant={exp.is_active ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleActive(exp.id)}
                    >
                      {exp.is_active ? "Hiển thị" : "Ẩn"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(exp)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
