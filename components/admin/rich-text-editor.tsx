"use client";

import { useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List } from "lucide-react";

type InsertType = "bold" | "italic" | "bullet";

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  rows = 4,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = useCallback(
    (type: InsertType) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const text = value;
      const selected = text.slice(start, end);

      let newText: string;
      let newCursor: number;

      switch (type) {
        case "bold":
          if (selected) {
            newText = text.slice(0, start) + `**${selected}**` + text.slice(end);
            newCursor = end + 4;
          } else {
            newText = text.slice(0, start) + "****" + text.slice(start);
            newCursor = start + 2;
          }
          break;
        case "italic":
          if (selected) {
            newText = text.slice(0, start) + `*${selected}*` + text.slice(end);
            newCursor = end + 2;
          } else {
            newText = text.slice(0, start) + "**" + text.slice(start);
            newCursor = start + 1;
          }
          break;
        case "bullet": {
          const insert = start === 0 || text[start - 1] === "\n" ? "- " : "\n- ";
          newText = text.slice(0, start) + insert + text.slice(start);
          newCursor = start + insert.length;
          break;
        }
        default:
          return;
      }

      if (type === "bullet" && newText === value) return;
      onChange(newText);
      ta.focus();
      requestAnimationFrame(() => {
        ta.setSelectionRange(newCursor, newCursor);
      });
    },
    [value, onChange]
  );

  return (
    <div className={className}>
      <div className="flex items-center gap-1 border border-input rounded-t-md bg-muted/50 px-1 py-0.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => insertMarkdown("bold")}
          title="In đậm (**text**)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => insertMarkdown("italic")}
          title="In nghiêng (*text*)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => insertMarkdown("bullet")}
          title="Bullet (- item)"
        >
          <List className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground ml-2 border-l pl-2">
          Markdown: **đậm** *nghiêng* - bullet
        </span>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="rounded-t-none border-t-0 focus-visible:ring-2"
      />
    </div>
  );
}
