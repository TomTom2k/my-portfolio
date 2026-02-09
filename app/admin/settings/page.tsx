"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, ExternalLink } from "lucide-react";

export default function SettingsPage() {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã copy!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Cấu hình và hướng dẫn sử dụng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supabase Configuration</CardTitle>
          <CardDescription>Cấu hình kết nối Supabase database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>NEXT_PUBLIC_SUPABASE_URL</Label>
            <div className="flex gap-2">
              <Input placeholder="https://your-project.supabase.co" disabled />
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>NEXT_PUBLIC_SUPABASE_ANON_KEY</Label>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                disabled
              />
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Tạo file{" "}
            <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> và
            thêm các biến môi trường trên.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>
            Hướng dẫn tạo database trên Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground shrink-0">
              1
            </div>
            <div>
              <p className="font-medium">Tạo project Supabase</p>
              <p className="text-sm text-muted-foreground">
                Truy cập{" "}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Supabase Dashboard
                  <ExternalLink className="h-3 w-3" />
                </a>{" "}
                và tạo project mới
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground shrink-0">
              2
            </div>
            <div>
              <p className="font-medium">Chạy SQL Schema</p>
              <p className="text-sm text-muted-foreground">
                Vào SQL Editor, copy nội dung file{" "}
                <code className="bg-muted px-1 py-0.5 rounded">
                  supabase/schema.sql
                </code>{" "}
                và chạy
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => handleCopy("supabase/schema.sql")}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy path
              </Button>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground shrink-0">
              3
            </div>
            <div>
              <p className="font-medium">Lấy API credentials</p>
              <p className="text-sm text-muted-foreground">
                Vào Settings → API để lấy URL và anon key
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Integration</CardTitle>
          <CardDescription>Kết nối CRM với portfolio website</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sau khi hoàn tất cấu hình Supabase, bạn cần cập nhật portfolio
            website để fetch dữ liệu từ database thay vì hardcode.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Thêm Supabase client vào portfolio
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Cập nhật các components để fetch data
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Test và deploy
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
