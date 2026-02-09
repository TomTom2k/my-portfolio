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

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
  is_active: boolean;
}

const iconOptions = [
  { value: "BsLinkedin", label: "LinkedIn" },
  { value: "FaGithubSquare", label: "GitHub" },
  { value: "FaTwitter", label: "Twitter/X" },
  { value: "FaFacebook", label: "Facebook" },
  { value: "FaInstagram", label: "Instagram" },
  { value: "FaYoutube", label: "YouTube" },
  { value: "FaTiktok", label: "TikTok" },
  { value: "FaDribbble", label: "Dribbble" },
  { value: "FaBehance", label: "Behance" },
  { value: "FaMedium", label: "Medium" },
  { value: "FaDiscord", label: "Discord" },
  { value: "FaTelegram", label: "Telegram" },
];

export default function SocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([
    {
      id: "1",
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/nguyen-thanh-tin-b6640b271/",
      icon: "BsLinkedin",
      order: 1,
      is_active: true,
    },
    {
      id: "2",
      platform: "GitHub",
      url: "https://github.com/TomTom2k",
      icon: "FaGithubSquare",
      order: 2,
      is_active: true,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    icon: "BsLinkedin",
  });

  const handleAdd = () => {
    setEditingLink(null);
    setFormData({ platform: "", url: "", icon: "BsLinkedin" });
    setIsOpen(true);
  };

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
    });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.platform || !formData.url) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (editingLink) {
      setLinks((prev) =>
        prev.map((l) => (l.id === editingLink.id ? { ...l, ...formData } : l)),
      );
      toast.success("Đã cập nhật link!");
    } else {
      const newLink: SocialLink = {
        id: Date.now().toString(),
        ...formData,
        order: links.length + 1,
        is_active: true,
      };
      setLinks((prev) => [...prev, newLink]);
      toast.success("Đã thêm link mới!");
    }

    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast.success("Đã xóa link!");
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
          <h1 className="text-3xl font-bold tracking-tight">Social Links</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các liên kết mạng xã hội hiển thị trên portfolio
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
                {editingLink ? "Sửa Social Link" : "Thêm Social Link"}
              </DialogTitle>
              <DialogDescription>
                Thêm hoặc sửa liên kết mạng xã hội
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="platform">Tên nền tảng</Label>
                <Input
                  id="platform"
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      platform: e.target.value,
                    }))
                  }
                  placeholder="LinkedIn, GitHub, Twitter..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <select
                  id="icon"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
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

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Social Links</CardTitle>
          <CardDescription>Kéo thả để sắp xếp thứ tự hiển thị</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Nền tảng</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Icon</TableHead>
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
                  <TableCell className="font-medium">{link.platform}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {link.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {link.icon}
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
