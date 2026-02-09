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

interface NavigationLink {
  id: string;
  name: string;
  hash: string;
  order: number;
  is_active: boolean;
}

export default function NavigationPage() {
  const [links, setLinks] = useState<NavigationLink[]>([
    { id: "1", name: "Home", hash: "#home", order: 1, is_active: true },
    { id: "2", name: "About", hash: "#about", order: 2, is_active: true },
    { id: "3", name: "Projects", hash: "#projects", order: 3, is_active: true },
    { id: "4", name: "Skills", hash: "#skills", order: 4, is_active: true },
    {
      id: "5",
      name: "Experience",
      hash: "#experience",
      order: 5,
      is_active: true,
    },
    { id: "6", name: "Contact", hash: "#contact", order: 6, is_active: true },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationLink | null>(null);
  const [formData, setFormData] = useState({ name: "", hash: "" });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ name: "", hash: "" });
    setIsOpen(true);
  };

  const handleEdit = (item: NavigationLink) => {
    setEditingItem(item);
    setFormData({ name: item.name, hash: item.hash });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.hash) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (editingItem) {
      setLinks((prev) =>
        prev.map((l) => (l.id === editingItem.id ? { ...l, ...formData } : l)),
      );
      toast.success("Đã cập nhật!");
    } else {
      const newItem: NavigationLink = {
        id: Date.now().toString(),
        ...formData,
        order: links.length + 1,
        is_active: true,
      };
      setLinks((prev) => [...prev, newItem]);
      toast.success("Đã thêm mới!");
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast.success("Đã xóa!");
  };

  const toggleActive = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, is_active: !l.is_active } : l)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Navigation</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các menu items trên header
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
                {editingItem ? "Sửa Link" : "Thêm Link"}
              </DialogTitle>
              <DialogDescription>
                Thêm hoặc sửa navigation menu item
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên hiển thị</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="About, Projects, Contact..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hash">Anchor Hash</Label>
                <Input
                  id="hash"
                  value={formData.hash}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hash: e.target.value }))
                  }
                  placeholder="#about, #projects, #contact..."
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
          <CardTitle>Navigation Links</CardTitle>
          <CardDescription>
            Kéo thả để sắp xếp thứ tự hiển thị trên menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Hash</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  </TableCell>
                  <TableCell className="font-medium">{link.name}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {link.hash}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={link.is_active ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleActive(link.id)}
                    >
                      {link.is_active ? "Hiển thị" : "Ẩn"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(link)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(link.id)}
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
