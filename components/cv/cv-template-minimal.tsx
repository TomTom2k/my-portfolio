"use client";

import Image from "next/image";
import type { CVData } from "@/lib/cv-types";
import { CVMarkdown } from "./cv-markdown";

export function CVTemplateMinimal({ data }: { data: CVData }) {
  const { personal, experiences, skills, projects } = data;

  return (
    <div
      className="cv-print bg-white text-gray-900 p-10"
      style={{
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <header className="text-center mb-10">
        {personal.avatarUrl && (
          <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border border-gray-200">
            <Image
              src={personal.avatarUrl}
              alt={personal.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        )}
        <h1 className="text-2xl font-light tracking-tight text-gray-900">
          {personal.name}
        </h1>
        <p className="text-gray-500 mt-1">{personal.title}</p>
        <div className="flex justify-center gap-4 mt-3 text-sm text-gray-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      </header>

      {personal.intro && (
        <section className="mb-8 max-w-2xl mx-auto">
          <div className="text-sm text-gray-600 leading-relaxed text-center">
            <CVMarkdown content={personal.intro} />
          </div>
        </section>
      )}

      <div className="space-y-8">
        {experiences.length > 0 && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
              Kinh nghiệm
            </h2>
            <ul className="space-y-6">
              {experiences.map((exp) => (
                <li key={exp.id} className="border-l-2 border-gray-200 pl-4">
                  <span className="font-medium text-gray-900">{exp.title}</span>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {[exp.company, exp.location, exp.dateRange]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {exp.description && (
                    <div className="text-sm text-gray-600 mt-2">
                      <CVMarkdown content={exp.description} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
              Kỹ năng
            </h2>
            <p className="text-sm text-gray-600">
              {skills.map((s, i) => (
                <span key={s.id}>
                  <CVMarkdown content={s.name} inline />
                  {i < skills.length - 1 ? " · " : null}
                </span>
              ))}
            </p>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
              Dự án
            </h2>
            <ul className="space-y-2">
              {projects.map((proj) => (
                <li key={proj.id}>
                  <span className="font-medium text-gray-900">{proj.title}</span>
                  {proj.link && (
                    <a
                      href={proj.link}
                      className="text-gray-500 text-sm ml-2 hover:underline"
                    >
                      {proj.link}
                    </a>
                  )}
                  {proj.description && (
                    <div className="text-sm text-gray-600 mt-0.5">
                      <CVMarkdown content={proj.description} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
