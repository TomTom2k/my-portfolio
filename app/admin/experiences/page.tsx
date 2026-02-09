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
import { Plus, Pencil, Trash2, GripVertical, Loader2 } from "lucide-react";
import {
  getExperiences,
  createRecord,
  updateRecord,
  deleteRecord,
} from "@/lib/api";
import { Experience } from "@/lib/supabase";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateListOrder } from "@/lib/api";

const iconOptions = [
  { value: "work", label: "💼 Work" },
  { value: "react", label: "⚛️ React" },
  { value: "education", label: "🎓 Education" },
];

function SortableRow({
  experience,
  onEdit,
  onDelete,
  onToggle,
}: {
  experience: Experience;
  onEdit: (item: Experience) => void;
  onDelete: (id: string) => void;
  onToggle: (item: Experience) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: experience.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    backgroundColor: isDragging ? "var(--background)" : undefined,
    opacity: isDragging ? 0.8 : 1,
    position: isDragging ? ("relative" as const) : undefined,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-12">
        <div
          {...listeners}
          {...attributes}
          className="cursor-move p-2 hover:bg-muted rounded-md touch-none"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="font-medium max-w-[250px]">
        <div className="truncate">{experience.title}</div>
      </TableCell>
      <TableCell>{experience.location}</TableCell>
      <TableCell>{experience.date_range}</TableCell>
      <TableCell>
        <Badge
          variant={experience.is_active ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => onToggle(experience)}
        >
          {experience.is_active ? "Hiển thị" : "Ẩn"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" onClick={() => onEdit(experience)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(experience.id)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function ExperiencesPage() {
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    icon_type: "work",
    date_range: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setExperiences((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update order in backend
        const updates = newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        updateListOrder("experiences", updates).catch((error) => {
          toast.error("Lỗi cập nhật thứ tự");
          loadExperiences(); // Revert on error
        });

        return newItems;
      });
    }
  };

  const loadExperiences = async () => {
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      toast.error("Không thể tải danh sách kinh nghiệm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

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
      location: item.location || "",
      description: item.description || "",
      icon_type: item.icon_type,
      date_range: item.date_range || "",
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error("Vui lòng điền tiêu đề");
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await updateRecord("experiences", editingItem.id, formData);
        toast.success("Đã cập nhật!");
      } else {
        await createRecord("experiences", {
          ...formData,
          order: experiences.length + 1,
          is_active: true,
        });
        toast.success("Đã thêm mới!");
      }
      setIsOpen(false);
      loadExperiences();
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mục này?")) return;

    try {
      await deleteRecord("experiences", id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      toast.success("Đã xóa!");
    } catch (error: any) {
      toast.error(`Lỗi xóa: ${error.message}`);
    }
  };

  const toggleActive = async (exp: Experience) => {
    try {
      const newStatus = !exp.is_active;
      // Optimistic update
      setExperiences((prev) =>
        prev.map((e) => (e.id === exp.id ? { ...e, is_active: newStatus } : e)),
      );

      await updateRecord("experiences", exp.id, { is_active: newStatus });
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
      loadExperiences();
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

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Experience</CardTitle>
          <CardDescription>Kéo thả để sắp xếp thứ tự hiển thị</CardDescription>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
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
                <SortableContext
                  items={experiences}
                  strategy={verticalListSortingStrategy}
                >
                  {experiences.map((exp) => (
                    <SortableRow
                      key={exp.id}
                      experience={exp}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggle={toggleActive}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
