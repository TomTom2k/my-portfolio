"use client";

import { useEffect, useState, useCallback } from "react";
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
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { toast } from "sonner";
import {
  Loader2,
  FileText,
  Printer,
  RefreshCw,
  LayoutTemplate,
  Plus,
  Trash2,
  Copy,
  Pencil,
} from "lucide-react";
import { getPortfolioData } from "@/lib/api";
import {
  CVData,
  CV_TEMPLATES,
  CVTemplateId,
  portfolioToCVData,
  type CVPersonal,
  type CVExperienceItem,
  type CVSkillItem,
  type CVProjectItem,
} from "@/lib/cv-types";
import { CVPreview } from "@/components/cv/cv-preview";

const STORAGE_KEY = "portfolio-cv-files";

export interface CVFile {
  id: string;
  name: string;
  data: CVData;
  templateId: CVTemplateId;
  updatedAt: string;
}

const defaultCVData: CVData = {
  personal: {
    name: "",
    title: "",
    email: "",
    intro: "",
  },
  experiences: [],
  skills: [],
  projects: [],
};

function newCvId() {
  return `cv-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadCvListFromStorage(): CVFile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CVFile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCvListToStorage(list: CVFile[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save CV list", e);
  }
}

export default function CVsPage() {
  const [loading, setLoading] = useState(true);
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [currentCvId, setCurrentCvId] = useState<string | null>(null);
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [templateId, setTemplateId] = useState<CVTemplateId>("classic");

  const currentFile = currentCvId
    ? cvFiles.find((f) => f.id === currentCvId)
    : null;

  // Khởi tạo: load từ localStorage hoặc tạo 1 CV mặc định
  useEffect(() => {
    const list = loadCvListFromStorage();
    if (list.length === 0) {
      const first: CVFile = {
        id: newCvId(),
        name: "CV 1",
        data: { ...defaultCVData },
        templateId: "classic",
        updatedAt: new Date().toISOString(),
      };
      setCvFiles([first]);
      setCurrentCvId(first.id);
      setCvData(first.data);
      setTemplateId(first.templateId);
      saveCvListToStorage([first]);
    } else {
      setCvFiles(list);
      const last = list[list.length - 1];
      setCurrentCvId(last.id);
      setCvData(last.data);
      setTemplateId(last.templateId);
    }
    setLoading(false);
  }, []);

  // Đồng bộ cvData/templateId vào file hiện tại và lưu
  const persistCurrentCv = useCallback(() => {
    if (!currentCvId) return;
    setCvFiles((prev) => {
      const next = prev.map((f) =>
        f.id === currentCvId
          ? {
              ...f,
              data: cvData,
              templateId,
              updatedAt: new Date().toISOString(),
            }
          : f
      );
      saveCvListToStorage(next);
      return next;
    });
  }, [currentCvId, cvData, templateId]);

  useEffect(() => {
    if (!currentCvId || cvFiles.length === 0) return;
    persistCurrentCv();
  }, [cvData, templateId, currentCvId]); // eslint-disable-line react-hooks/exhaustive-deps

  const switchToCv = useCallback((id: string) => {
    const file = cvFiles.find((f) => f.id === id);
    if (file) {
      setCurrentCvId(id);
      setCvData(file.data);
      setTemplateId(file.templateId);
    }
  }, [cvFiles]);

  const createNewCv = useCallback((data?: CVData) => {
    const file: CVFile = {
      id: newCvId(),
      name: data ? `${data.personal?.name?.trim() || "CV"} (Portfolio)` : "CV mới",
      data: data ?? JSON.parse(JSON.stringify(defaultCVData)),
      templateId: "classic",
      updatedAt: new Date().toISOString(),
    };
    setCvFiles((prev) => {
      const next = [...prev, file];
      saveCvListToStorage(next);
      return next;
    });
    setCurrentCvId(file.id);
    setCvData(file.data);
    setTemplateId("classic");
    toast.success("Đã tạo CV mới");
  }, []);

  const duplicateCv = useCallback(() => {
    if (!currentFile) return;
    const file: CVFile = {
      id: newCvId(),
      name: `${currentFile.name} (bản sao)`,
      data: JSON.parse(JSON.stringify(currentFile.data)),
      templateId: currentFile.templateId,
      updatedAt: new Date().toISOString(),
    };
    setCvFiles((prev) => {
      const next = [...prev, file];
      saveCvListToStorage(next);
      return next;
    });
    setCurrentCvId(file.id);
    setCvData(file.data);
    setTemplateId(file.templateId);
    toast.success("Đã nhân bản CV");
  }, [currentFile]);

  const deleteCv = useCallback(() => {
    if (!currentCvId || cvFiles.length <= 1) return;
    if (!confirm("Xóa CV này? Không thể hoàn tác.")) return;
    const next = cvFiles.filter((f) => f.id !== currentCvId);
    setCvFiles(next);
    saveCvListToStorage(next);
    const target = next[0];
    setCurrentCvId(target.id);
    setCvData(target.data);
    setTemplateId(target.templateId);
    toast.success("Đã xóa CV");
  }, [currentCvId, cvFiles]);

  const renameCv = useCallback((id: string, name: string) => {
    const trimmed = name.trim() || "CV";
    setCvFiles((prev) => {
      const next = prev.map((f) =>
        f.id === id ? { ...f, name: trimmed, updatedAt: new Date().toISOString() } : f
      );
      saveCvListToStorage(next);
      return next;
    });
  }, []);

  async function loadFromPortfolio(asNew = false) {
    setLoading(true);
    try {
      const { profile, experiences, projects, skills } =
        await getPortfolioData();
      const data = portfolioToCVData(
        profile,
        experiences,
        skills,
        projects
      );
      if (asNew) {
        const name = data.personal?.name?.trim() || "CV từ Portfolio";
        const file: CVFile = {
          id: newCvId(),
          name: `${name} (Portfolio)`,
          data,
          templateId: "classic",
          updatedAt: new Date().toISOString(),
        };
        setCvFiles((prev) => {
          const next = [...prev, file];
          saveCvListToStorage(next);
          return next;
        });
        setCurrentCvId(file.id);
        setCvData(file.data);
        setTemplateId("classic");
        toast.success("Đã tạo CV mới từ Portfolio");
      } else {
        setCvData(data);
        toast.success("Đã cập nhật CV hiện tại từ Portfolio");
      }
    } catch (e) {
      console.error(e);
      toast.error("Không thể tải dữ liệu. Kiểm tra đăng nhập và kết nối.");
    } finally {
      setLoading(false);
    }
  }

  const updatePersonal = (field: keyof CVPersonal, value: string) => {
    setCvData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const updateExperience = (id: string, updates: Partial<CVExperienceItem>) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }));
  };

  const updateSkill = (id: string, updates: Partial<CVSkillItem>) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const updateProject = (id: string, updates: Partial<CVProjectItem>) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  };

  const handlePrint = () => {
    window.print();
    toast.success(
      "Trong hộp thoại in: tắt 'Header and footer' (hoặc 'Đầu trang và chân trang') để file PDF không có ngày/tên trang, rồi chọn Lưu PDF."
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hàng 1: Tiêu đề + nút In / Tải lại Portfolio */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Tạo CV
          </h1>
          <p className="text-muted-foreground mt-2">
            Nhiều file CV — tạo mới hoặc từ Portfolio. Chọn mẫu rồi in hoặc lưu PDF.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => loadFromPortfolio(false)} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tải lại từ Portfolio
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            In / Lưu PDF
          </Button>
        </div>
      </div>

      {/* Hàng 2 — File CV: luôn thấy ngay, sticky khi scroll */}
      <div
        className="sticky top-14 z-20 flex flex-wrap items-center gap-2 rounded-lg border bg-card px-4 py-3 shadow-sm"
        role="region"
        aria-label="Danh sách file CV"
      >
        <span className="text-sm font-medium text-muted-foreground mr-2 shrink-0">File CV:</span>
        {cvFiles.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-1 rounded-lg border bg-muted/30 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => switchToCv(f.id)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentCvId === f.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {f.name}
              </button>
              {cvFiles.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const name = window.prompt("Tên CV:", f.name);
                    if (name != null) renameCv(f.id, name);
                  }}
                  className="p-1.5 text-muted-foreground hover:text-foreground"
                  title="Đổi tên"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              {cvFiles.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (f.id === currentCvId) {
                      deleteCv();
                    } else if (confirm("Xóa CV này?")) {
                      const next = cvFiles.filter((x) => x.id !== f.id);
                      setCvFiles(next);
                      saveCvListToStorage(next);
                      toast.success("Đã xóa CV");
                    }
                  }}
                  className="p-1.5 text-muted-foreground hover:text-destructive"
                  title="Xóa"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => createNewCv()}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Tạo mới
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadFromPortfolio(true)}
            disabled={loading}
            className="gap-1"
          >
            <Copy className="h-4 w-4" />
            Từ Portfolio
          </Button>
      </div>

      {/* Chọn mẫu CV */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            Chọn mẫu CV
          </CardTitle>
          <CardDescription>
            Chọn một trong các template bên dưới. Xem trước bên phải sẽ cập
            nhật theo thời gian thực.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CV_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  templateId === t.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="font-medium block">{t.name}</span>
                <span className="text-sm text-muted-foreground">{t.description}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Split panel — kéo thanh giữa để chỉnh tỉ lệ Edit / Preview */}
      <div className="h-[calc(100vh-14rem)] min-h-[480px] flex flex-col" data-cv-split-panel>
        <PanelGroup direction="horizontal" className="flex-1 gap-0">
          <Panel defaultSize={42} minSize={28} maxSize={70} order={1}>
            <ScrollArea className="h-full w-full rounded-l-lg border border-r-0 p-4 bg-background">
              <div className="space-y-6 pr-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Họ tên, chức danh, email, giới thiệu ngắn
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Họ và tên</Label>
                  <Input
                    value={cvData.personal.name}
                    onChange={(e) => updatePersonal("name", e.target.value)}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Chức danh</Label>
                  <Input
                    value={cvData.personal.title}
                    onChange={(e) => updatePersonal("title", e.target.value)}
                    placeholder="Frontend Developer"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={cvData.personal.email}
                    onChange={(e) => updatePersonal("email", e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Điện thoại</Label>
                  <Input
                    value={cvData.personal.phone ?? ""}
                    onChange={(e) => updatePersonal("phone", e.target.value)}
                    placeholder="0901234567"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Địa chỉ / Location</Label>
                  <Input
                    value={cvData.personal.location ?? ""}
                    onChange={(e) => updatePersonal("location", e.target.value)}
                    placeholder="TP. Hồ Chí Minh"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Giới thiệu / Mục tiêu nghề nghiệp</Label>
                  <RichTextEditor
                    value={cvData.personal.intro}
                    onChange={(v) => updatePersonal("intro", v)}
                    placeholder="Đoạn tóm tắt về bạn... Dùng **in đậm**, *nghiêng*, - bullet."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kinh nghiệm</CardTitle>
                <CardDescription>
                  Chỉnh sửa từng mục. Dữ liệu lấy từ trang Experiences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cvData.experiences.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Chưa có kinh nghiệm. Thêm tại trang Experiences hoặc tải lại
                    từ Portfolio.
                  </p>
                ) : (
                  cvData.experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3 rounded-lg border bg-muted/30 space-y-2"
                    >
                      <Input
                        placeholder="Vị trí / Chức danh"
                        value={exp.title}
                        onChange={(e) =>
                          updateExperience(exp.id, { title: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Công ty / Địa điểm"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, { company: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Thời gian (vd: 2020 - Hiện tại)"
                        value={exp.dateRange}
                        onChange={(e) =>
                          updateExperience(exp.id, { dateRange: e.target.value })
                        }
                      />
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">
                          Mô tả (dùng **đậm**, *nghiêng*, - bullet)
                        </Label>
                        <RichTextEditor
                          value={exp.description}
                          onChange={(v) =>
                            updateExperience(exp.id, { description: v })
                          }
                          placeholder="Mô tả công việc, thành tựu..."
                          rows={5}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kỹ năng</CardTitle>
                <CardDescription>
                  Chỉnh sửa tên/mô tả kỹ năng (rich text). Dữ liệu từ trang Skills.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {cvData.skills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Chưa có kỹ năng. Thêm tại trang Skills.
                  </p>
                ) : (
                  cvData.skills.map((s) => (
                    <div key={s.id}>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Kỹ năng (dùng **đậm**, *nghiêng*, - bullet)
                      </Label>
                      <RichTextEditor
                        value={s.name}
                        onChange={(v) => updateSkill(s.id, { name: v })}
                        placeholder="VD: React, **Node.js** (advanced)..."
                        rows={2}
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dự án</CardTitle>
                <CardDescription>
                  Chỉnh sửa dự án. Dữ liệu từ trang Projects.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cvData.projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Chưa có dự án. Thêm tại trang Projects.
                  </p>
                ) : (
                  cvData.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3 rounded-lg border bg-muted/30 space-y-2"
                    >
                      <Input
                        placeholder="Tên dự án"
                        value={proj.title}
                        onChange={(e) =>
                          updateProject(proj.id, { title: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Link (tùy chọn)"
                        value={proj.link ?? ""}
                        onChange={(e) =>
                          updateProject(proj.id, { link: e.target.value })
                        }
                      />
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">
                          Mô tả (dùng **đậm**, *nghiêng*, - bullet)
                        </Label>
                        <RichTextEditor
                          value={proj.description}
                          onChange={(v) =>
                            updateProject(proj.id, { description: v })
                          }
                          placeholder="Mô tả ngắn..."
                          rows={3}
                        />
                      </div>
                      <Input
                        placeholder="Tags (cách nhau bởi dấu phẩy)"
                        value={(proj.tags ?? []).join(", ")}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            tags: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
              </div>
            </ScrollArea>
          </Panel>
          <PanelResizeHandle className="relative w-3 flex-shrink-0 bg-muted hover:bg-primary/25 transition-colors data-[resize-handle-active]:bg-primary/40 group cursor-col-resize">
            <div className="absolute inset-0 cursor-col-resize" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-muted-foreground group-hover:text-primary pointer-events-none whitespace-nowrap hidden sm:inline">
              ⋮ Kéo
            </span>
          </PanelResizeHandle>
          <Panel defaultSize={58} minSize={30} maxSize={72} order={2}>
            <div className="h-full flex flex-col rounded-r-lg border p-4 pl-5 overflow-hidden">
              <h2 className="text-lg font-semibold mb-2 flex-shrink-0">Xem trước</h2>
              <div className="flex-1 min-h-0 overflow-auto">
                <CVPreview data={cvData} templateId={templateId} />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
