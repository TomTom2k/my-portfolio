'use client';

import React from 'react';
import SectionHeading from './section-heading';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/lib/hooks';

export default function About() {
	const { ref } = useSectionInView('About');

	return (
		<motion.section
			ref={ref}
			className='mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28'
			initial={{ opacity: 0, y: 100 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.175 }}
			id='about'>
			<SectionHeading>About me</SectionHeading>
			<p className='mb-3'>
				I am a software developer with a degree in{' '}
				<span className='font-medium'>Software Engineering</span> and
				over <span className='font-medium'>2 years of experience</span>.
				I have worked in both{' '}
				<span className='font-medium'>onsite</span> and{' '}
				<span className='font-medium'>remote roles</span> and have
				handled <span className='font-medium'>freelance projects</span>{' '}
				for both <span className='font-medium'>web</span> and{' '}
				<span className='font-medium'>mobile apps</span>. I enjoy{' '}
				<span className='italic'>solving challenging problems</span>
				and am always eager to{' '}
				<span className='font-medium'>learn new technologies</span>.
			</p>

			<p>
				My tech stack includes{' '}
				<span className='font-medium'>React</span>,{' '}
				<span className='font-medium'>Next.js</span>,{' '}
				<span className='font-medium'>NestJS</span>,{' '}
				<span className='font-medium'>React Native</span>, and{' '}
				<span className='font-medium'>TypeScript</span>. I am known for{' '}
				my <span className='font-medium'>quick adaptability</span>,{' '}
				<span className='font-medium'>strong learning attitude</span>,
				and{' '}
				<span className='font-medium'>
					ability to work well in a team
				</span>
				. I am looking for a{' '}
				<span className='font-medium'>dynamic environment</span> with{' '}
				<span className='font-medium'>interesting projects</span> to
				further grow and contribute.
			</p>
		</motion.section>
	);
}
