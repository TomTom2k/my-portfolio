"use client";

import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Project as ProjectType } from "@/lib/supabase";

type ProjectProps = ProjectType;

export default function ProjectCard({
  link,
  title,
  description,
  tags,
  image_url,
}: ProjectProps) {
  return (
    <div className="group relative h-[28rem] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900 shadow-xl cursor-default">
      {/* Background Image with Zoom Effect */}
      {image_url ? (
        <Image
          src={image_url}
          alt={`Project: ${title}`}
          fill
          quality={95}
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-900" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

      {/* Content Container */}
      <div className="absolute inset-x-0 bottom-0 p-6 text-white z-20">
        <div className="transform translate-y-4 transition-transform duration-500 ease-in-out group-hover:-translate-y-2">
          <h3 className="text-2xl font-bold font-serif mb-2 flex items-center gap-2 drop-shadow-md">
            {title}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 hover:text-blue-400"
              >
                <FaExternalLinkAlt className="h-4 w-4" />
              </a>
            )}
          </h3>

          {/* Hover Reveal Content */}
          <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-[20rem] group-hover:opacity-100 group-hover:mt-2">
            <p className="mb-4 text-sm text-gray-200 line-clamp-4 leading-relaxed drop-shadow-sm">
              {description}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
