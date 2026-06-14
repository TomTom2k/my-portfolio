"use client";

import type { CVData, CVTemplateId } from "@/lib/cv-types";
import { CVTemplateClassic } from "./cv-template-classic";
import { CVTemplateModern } from "./cv-template-modern";
import { CVTemplateMinimal } from "./cv-template-minimal";

export function CVPreview({
  data,
  templateId,
}: {
  data: CVData;
  templateId: CVTemplateId;
}) {
  const templates = {
    classic: CVTemplateClassic,
    modern: CVTemplateModern,
    minimal: CVTemplateMinimal,
  };
  const Template = templates[templateId];
  return (
    <div className="flex justify-center bg-muted/30 p-4 rounded-lg overflow-auto min-h-0 h-full">
      <div id="cv-print-area">
        <Template data={data} />
      </div>
    </div>
  );
}
