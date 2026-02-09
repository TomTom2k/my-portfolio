"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { useSectionInView } from "@/lib/hooks";
import { useTheme } from "@/context/theme-context";
import { Experience as ExperienceType } from "@/lib/supabase";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap, LuCalendarDays, LuMapPin } from "react-icons/lu";
import { motion } from "framer-motion";

interface ExperienceProps {
  experiences: ExperienceType[];
}

// Icon mapping
const iconMap: Record<string, React.ReactElement> = {
  work: <CgWorkAlt />,
  react: <FaReact />,
  graduation: <LuGraduationCap />,
};

export default function Experience({ experiences }: ExperienceProps) {
  const { ref } = useSectionInView("Experience");
  const { theme } = useTheme();

  return (
    <section
      id="experience"
      ref={ref}
      className="scroll-mt-28 mb-28 sm:mb-40 w-full overflow-hidden"
    >
      <SectionHeading>My Experience</SectionHeading>

      <div className="w-full max-w-[60rem] mx-auto px-4 relative">
        {/* Center Vertical Line (Desktop) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2 rounded-full" />

        {/* Left Vertical Line (Mobile) */}
        <div className="md:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 rounded-full" />

        <div className="flex flex-col gap-10 md:gap-0">
          {experiences.map((experience, index) => {
            const isLatest = index === 0;
            const isLeft = index % 2 === 0; // Even index = Left side on desktop

            return (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center md:justify-between w-full group ${
                  !isLeft ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Desktop Spacer (Empty half) */}
                <div className="hidden md:block w-5/12" />

                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10 w-8 h-8 md:w-10 md:h-10">
                  <div
                    className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-4 transition-all duration-300 group-hover:scale-125 z-10
                      ${
                        isLatest
                          ? "bg-blue-600 border-blue-200 dark:border-blue-900 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                          : "bg-gray-200 border-white dark:bg-gray-800 dark:border-gray-900"
                      }`}
                  >
                    {isLatest && (
                      <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 md:w-5 md:h-5 w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Content Card */}
                <div
                  className={`w-full pl-16 md:pl-0 md:w-5/12 ${isLatest ? "md:pt-0" : ""}`}
                >
                  <div
                    className={`p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md 
                    ${
                      isLatest
                        ? "bg-white dark:bg-white/5 border-blue-200 dark:border-blue-800/50"
                        : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/5"
                    }
                  `}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg text-xl border shadow-sm
                          ${
                            isLatest
                              ? "bg-blue-600 text-white border-blue-500"
                              : "bg-gray-50 dark:bg-white/10 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-gray-700"
                          }
                        `}
                        >
                          {iconMap[experience.icon_type] || <CgWorkAlt />}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg md:text-xl capitalize text-gray-900 dark:text-white leading-tight">
                            {experience.title}
                          </h3>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {experience.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-2">
                      {experience.description
                        ?.split(".")
                        .filter((sentence) => sentence.trim().length > 0)
                        .map((sentence, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                          >
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500/60 dark:bg-blue-400/60 flex-shrink-0" />
                            <span>{sentence.trim()}.</span>
                          </li>
                        ))}
                    </ul>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <div
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border
                          ${
                            isLatest
                              ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                              : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/10 dark:text-white/70 dark:border-transparent"
                          }
                       `}
                      >
                        <LuCalendarDays className="w-3.5 h-3.5" />
                        {experience.date_range}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
