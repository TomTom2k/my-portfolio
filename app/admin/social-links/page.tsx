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
  getSocialLinks,
  createRecord,
  updateRecord,
  deleteRecord,
} from "@/lib/api";
import { SocialLink } from "@/lib/supabase";

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
  { value: "SiGmail", label: "Gmail" },
  { value: "BsGlobe", label: "Website" },
];

export default function SocialLinksPage() {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    icon: "BsLinkedin",
  });

  const loadLinks = async () => {
    try {
      const data = await getSocialLinks();
      setLinks(data);
    } catch (error) {
      toast.error("Không thể tải danh sách social links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

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

  const handleSave = async () => {
    if (!formData.platform || !formData.url) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsSaving(true);
    try {
      if (editingLink) {
        await updateRecord("social_links", editingLink.id, formData);
        toast.success("Đã cập nhật link!");
      } else {
        await createRecord("social_links", {
          ...formData,
          order: links.length + 1,
          is_active: true,
        });
        toast.success("Đã thêm link mới!");
      }
      setIsOpen(false);
      loadLinks();
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa link này?")) return;
    try {
      await deleteRecord("social_links", id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      toast.success("Đã xóa link!");
    } catch (error: any) {
      toast.error(`Lỗi xóa: ${error.message}`);
    }
  };

  const toggleActive = async (link: SocialLink) => {
    try {
      const newStatus = !link.is_active;
      // Optimistic update
      setLinks((prev) =>
        prev.map((l) =>
          l.id === link.id ? { ...l, is_active: newStatus } : l,
        ),
      );

      await updateRecord("social_links", link.id, { is_active: newStatus });
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
      loadLinks(); // Revert
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
                      onClick={() => toggleActive(link)}
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
