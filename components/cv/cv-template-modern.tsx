"use client";

import Image from "next/image";
import type { CVData } from "@/lib/cv-types";
import { CVMarkdown } from "./cv-markdown";

export function CVTemplateModern({ data }: { data: CVData }) {
  const { personal, experiences, skills, projects } = data;
  const accent = "hsl(221, 83%, 53%)"; // primary blue

  return (
    <div
      className="cv-print bg-white text-gray-900 overflow-hidden"
      style={{
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "grid",
        gridTemplateColumns: "28mm 1fr",
      }}
    >
      {/* Sidebar */}
      <aside
        className="p-4 text-white"
        style={{ backgroundColor: accent }}
      >
        {personal.avatarUrl && (
          <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white/30">
            <Image
              src={personal.avatarUrl}
              alt={personal.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        )}
        <h1 className="text-lg font-bold leading-tight text-center">
          {personal.name}
        </h1>
        <p className="text-sm text-white/90 text-center mt-1">{personal.title}</p>

        <div className="mt-6 space-y-3 text-sm">
          {personal.email && (
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider">Email</p>
              <p className="break-all">{personal.email}</p>
            </div>
          )}
          {personal.phone && (
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider">Điện thoại</p>
              <p>{personal.phone}</p>
            </div>
          )}
          {personal.location && (
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider">Địa chỉ</p>
              <p>{personal.location}</p>
            </div>
          )}
        </div>

        {skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
              Kỹ năng
            </h3>
            <ul className="space-y-1 text-sm">
              {skills.map((s) => (
                <li key={s.id}>
                  <CVMarkdown content={s.name} inline />
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="p-6">
        {personal.intro && (
          <section className="mb-5">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: accent }}
            >
              Giới thiệu
            </h2>
            <CVMarkdown content={personal.intro} />
          </section>
        )}

        {experiences.length > 0 && (
          <section className="mb-5">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: accent }}
            >
              Kinh nghiệm
            </h2>
            <ul className="space-y-4">
              {experiences.map((exp) => (
                <li key={exp.id}>
                  <div
                    className="font-semibold text-gray-900"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {exp.title}
                  </div>
                  <div className="flex justify-between items-baseline gap-2 text-sm text-gray-600">
                    <span>
                      {[exp.company, exp.location].filter(Boolean).join(" • ")}
                    </span>
                    <span className="text-gray-500 text-xs">{exp.dateRange}</span>
                  </div>
                  {exp.description && (
                    <div className="text-sm text-gray-700 mt-1">
                      <CVMarkdown content={exp.description} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: accent }}
            >
              Dự án
            </h2>
            <ul className="space-y-3">
              {projects.map((proj) => (
                <li key={proj.id}>
                  <span className="font-semibold text-gray-900">{proj.title}</span>
                  {proj.link && (
                    <a
                      href={proj.link}
                      className="text-xs ml-2 hover:underline"
                      style={{ color: accent }}
                    >
                      Link
                    </a>
                  )}
                  {proj.description && (
                    <div className="text-sm text-gray-700 mt-0.5">
                      <CVMarkdown content={proj.description} />
                    </div>
                  )}
                  {proj.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${accent}20`,
                            color: accent,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
