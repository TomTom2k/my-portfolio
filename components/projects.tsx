"use client";

import React from "react";
import SectionHeading from "./section-heading";
import ProjectCard from "./project-card";
import { useSectionInView } from "@/lib/hooks";
import { Project as ProjectType } from "@/lib/supabase";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

interface ProjectsProps {
  projects: ProjectType[];
}

export default function Projects({ projects }: ProjectsProps) {
  const { ref } = useSectionInView("Projects", 0.5);

  // Duplicate projects if there are few items to ensure smooth infinite loop
  const displayProjects = React.useMemo(() => {
    if (projects.length === 0) return [];
    // Ensure we have enough items for smooth looping
    if (projects.length < 6) {
      return [...projects, ...projects, ...projects, ...projects];
    }
    return projects;
  }, [projects]);

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28 w-full">
      <SectionHeading>My projects</SectionHeading>
      <div className="w-full px-4 xl:px-0 max-w-[80rem] mx-auto">
        <style jsx global>{`
          .project-swiper .swiper-wrapper {
            transition-timing-function: linear !important;
          }
        `}</style>
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={true}
          speed={3000}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 80,
            modifier: 1,
            slideShadows: false,
            scale: 0.9,
          }}
          navigation={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[EffectCoverflow, Navigation, Autoplay]}
          className="pb-16 !overflow-visible project-swiper"
        >
          {displayProjects.map((project, index) => (
            <SwiperSlide
              key={`${project.id}-${index}`}
              className="!w-[85%] sm:!w-[35rem] lg:!w-[40rem] !h-auto transition-all duration-300"
            >
              <div className="h-full flex items-center justify-center p-2 shadow-sm rounded-lg">
                <ProjectCard {...project} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
