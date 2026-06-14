"use client";

import Image from "next/image";
import type { CVData } from "@/lib/cv-types";
import { CVMarkdown } from "./cv-markdown";

const A4_WIDTH = 210; // mm, for print
const A4_HEIGHT = 297;

export function CVTemplateClassic({ data }: { data: CVData }) {
  const { personal, experiences, skills, projects } = data;

  return (
    <div
      className="cv-print bg-white text-gray-900 p-8"
      style={{
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex items-start gap-4">
          {personal.avatarUrl && (
            <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0 border border-gray-300">
              <Image
                src={personal.avatarUrl}
                alt={personal.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {personal.name}
            </h1>
            <p className="text-gray-600 font-medium mt-0.5">{personal.title}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && <span>{personal.phone}</span>}
              {personal.location && <span>{personal.location}</span>}
              {personal.website && (
                <a href={personal.website} className="text-blue-700 underline">
                  {personal.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Summary */}
      {personal.intro && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Giới thiệu
          </h2>
          <CVMarkdown content={personal.intro} />
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3">
            Kinh nghiệm
          </h2>
          <ul className="space-y-4">
            {experiences.map((exp) => (
              <li key={exp.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-gray-900">{exp.title}</span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {exp.dateRange}
                  </span>
                </div>
                {(exp.company || exp.location) && (
                  <p className="text-sm text-gray-600 italic">
                    {[exp.company, exp.location].filter(Boolean).join(" • ")}
                  </p>
                )}
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

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3">
            Kỹ năng
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s.id}
                className="text-sm px-2 py-0.5 bg-gray-100 border border-gray-300 rounded"
              >
                <CVMarkdown content={s.name} inline className="!text-inherit" />
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3">
            Dự án
          </h2>
          <ul className="space-y-3">
            {projects.map((proj) => (
              <li key={proj.id}>
                <span className="font-semibold text-gray-900">{proj.title}</span>
                {proj.link && (
                  <a
                    href={proj.link}
                    className="text-xs text-blue-700 ml-2 hover:underline"
                  >
                    {proj.link}
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
                        className="text-xs px-1.5 py-0.5 bg-gray-100 rounded"
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
    </div>
  );
}
