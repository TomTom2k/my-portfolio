import React from 'react';
import { CgWorkAlt } from 'react-icons/cg';
import { FaReact } from 'react-icons/fa';
import { LuGraduationCap } from 'react-icons/lu';
import vnmusicImg from '@/public/vnmusic.png';
import aiStudioImg from '@/public/ai-studio.png';

export const links = [
	{
		name: 'Home',
		hash: '#home',
	},
	{
		name: 'About',
		hash: '#about',
	},
	{
		name: 'Projects',
		hash: '#projects',
	},
	{
		name: 'Skills',
		hash: '#skills',
	},
	{
		name: 'Experience',
		hash: '#experience',
	},
	{
		name: 'Contact',
		hash: '#contact',
	},
] as const;

export const experiencesData = [
	{
		title: 'TANCA.io - Front-End Developer',
		location: 'Ho Chi Minh, Vietnam',
		description:
			'Built web/mobile features (news feed, calendar, e-signature, Bitrix24, ...) with React/React Native. Handled new features, bug fixes, and teamwork using Postman, Figma, GitLab.',
		icon: React.createElement(FaReact),
		date: '3/2024 - 9/2025',
	},
	{
		title: 'CMC Media - Front-End Developer',
		location: 'Ha Noi, Vietnam',
		description:
			'Worked with PHP Laravel on bug fixes, layout updates, multi-language, and mobile responsiveness. Adapted quickly, collaborating with design/dev teams.',
		icon: React.createElement(CgWorkAlt),
		date: '2/2025 - 9/2025',
	},
] as const;

export const projectsData = [
	{
		title: 'VNMusic',
		description:
			'I worked as a mobile developer on the VNMusic app for 3 months. The app lets users stream music, create playlists, and get notifications about new releases, similar to Spotify. I focused on building core music streaming and user interaction features to ensure a smooth experien',
		tags: ['React Native', 'TypeScript', 'One Signal', 'Redux'],
		imageUrl: vnmusicImg,
		link: 'https://drive.google.com/drive/folders/1Zaw7i-p-gUc6Xx7sR1rie6Q_Gm_oIl3P?usp=sharing',
	},
	{
		title: 'Automation Tool Studio',
		description:
			'I worked on a project that converts user prompts into stories, generating characters, images, videos, sound, and voiceovers to create short videos. I focused on building a responsive, user-friendly interface for mobile and desktop, with dark/light modes and multi-language support for better accessibility.',
		tags: ['NextJs', 'Shadcn', 'Tailwind', 'i18n', 'websockets'],
		imageUrl: aiStudioImg,
		link: 'https://drive.google.com/drive/folders/1kXY7FVsGotmquPcAUZv20uUY6Zs83s-e?usp=sharing',
	},
] as const;

export const skillsData = [
	'HTML',
	'CSS',
	'JavaScript',
	'TypeScript',
	'React',
	'Next.js',
	'Node.js',
	'Git',
	'Tailwind',
	'Socket.io',
	'MongoDB',
	'Redux',
	'Nestjs',
	'React Native',
	'Express',
	'PostgreSQL',
	'Python',
	'Django',
] as const;
