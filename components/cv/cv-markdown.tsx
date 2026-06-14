"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const cvContentClass = "cv-markdown text-sm text-gray-700 leading-relaxed";

export function CVMarkdown({
  content,
  className = "",
  inline = false,
}: {
  content: string;
  className?: string;
  inline?: boolean;
}) {
  if (!content?.trim()) return null;

  const wrapperClass = inline
    ? `${cvContentClass} inline [&_p]:inline [&_ul]:inline [&_li]:inline [&_strong]:font-semibold [&_em]:italic ${className}`
    : `${cvContentClass} ${className}`;
  const Wrapper = inline ? "span" : "div";

  return (
    <Wrapper className={wrapperClass}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) =>
            inline ? (
              <span className="inline">{children}</span>
            ) : (
              <p className="mb-1.5 last:mb-0">{children}</p>
            ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-1.5 space-y-0.5 ml-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-1.5 space-y-0.5 ml-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-0.5">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-700 underline hover:no-underline"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Wrapper>
  );
}
