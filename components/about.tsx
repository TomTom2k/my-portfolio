"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { Profile } from "@/lib/supabase";

interface AboutProps {
  profile: Profile | null;
}

export default function About({ profile }: AboutProps) {
  const { ref } = useSectionInView("About");

  // Use CRM data or fallback
  const paragraph1 =
    profile?.about_paragraph_1 ||
    `I am a software developer with a degree in Software Engineering and over ${profile?.experience_years || 2} years of experience. I have worked in both onsite and remote roles and have handled freelance projects for both web and mobile apps. I enjoy solving challenging problems and am always eager to learn new technologies.`;

  const paragraph2 =
    profile?.about_paragraph_2 ||
    `My tech stack includes React, Next.js, NestJS, React Native, and TypeScript. I am known for my quick adaptability, strong learning attitude, and ability to work well in a team. I am looking for a dynamic environment with interesting projects to further grow and contribute.`;

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <p className="mb-3">{paragraph1}</p>
      <p>{paragraph2}</p>
    </motion.section>
  );
}
