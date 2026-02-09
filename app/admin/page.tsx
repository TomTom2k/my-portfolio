import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderKanban, Lightbulb, Briefcase, Link2 } from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Projects",
    value: "2",
    description: "Active projects",
    icon: FolderKanban,
    href: "/projects",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Skills",
    value: "18",
    description: "Technical skills",
    icon: Lightbulb,
    href: "/skills",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Experience",
    value: "2",
    description: "Work experiences",
    icon: Briefcase,
    href: "/experiences",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Social Links",
    value: "2",
    description: "Connected platforms",
    icon: Link2,
    href: "/social-links",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý nội dung portfolio website của bạn
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Các thao tác thường dùng</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <div className="p-2 rounded-lg bg-blue-100">
                <span className="text-blue-600">👤</span>
              </div>
              <div>
                <p className="font-medium">Cập nhật Profile</p>
                <p className="text-sm text-muted-foreground">
                  Thay đổi thông tin cá nhân, avatar, CV
                </p>
              </div>
            </Link>
            <Link
              href="/projects"
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <div className="p-2 rounded-lg bg-green-100">
                <span className="text-green-600">➕</span>
              </div>
              <div>
                <p className="font-medium">Thêm Project mới</p>
                <p className="text-sm text-muted-foreground">
                  Showcase dự án mới của bạn
                </p>
              </div>
            </Link>
            <Link
              href="/social-links"
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <div className="p-2 rounded-lg bg-purple-100">
                <span className="text-purple-600">🔗</span>
              </div>
              <div>
                <p className="font-medium">Quản lý Social Links</p>
                <p className="text-sm text-muted-foreground">
                  Thêm/xóa các liên kết mạng xã hội
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn</CardTitle>
            <CardDescription>Cách sử dụng CRM</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                1
              </div>
              <div>
                <p className="font-medium">Cấu hình Supabase</p>
                <p className="text-sm text-muted-foreground">
                  Tạo project Supabase và chạy schema.sql
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                2
              </div>
              <div>
                <p className="font-medium">Thêm Environment Variables</p>
                <p className="text-sm text-muted-foreground">
                  Copy .env.local.example và điền credentials
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                3
              </div>
              <div>
                <p className="font-medium">Quản lý nội dung</p>
                <p className="text-sm text-muted-foreground">
                  Sử dụng các trang để thêm/sửa/xóa dữ liệu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
