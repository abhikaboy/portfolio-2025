import React from 'react';
import ProjectHeader from '../project/ProjectHeader';
import ProjectSidebar from '../project/ProjectSidebar';
import header from '../assets/projects/platnm/platnm-header.png';
import { Section } from '../project/ProjectContent';
import ProjectContent from '../project/ProjectContent';
import Back from '../components/Back';

export default function Platnm() {
	const sidebarData: Section[] = [
		{
			title: 'Organization',
			type: 'Single',
			content: 'Generate Product Development Studio',
		},
		{
			title: 'Timeline',
			type: 'Single',
			content: 'Sept - Dec 2024',
		},
		{
			title: 'Role',
			type: 'Single',
			content: 'Product Manager',
		},
		{
			title: 'Team',
			type: 'List',
			content: [
				'(1) Product Manager',
				'(2) Technical Leads',
				'(6) Software Engineers',
				'(1) Design Lead',
				'(4) UI/UX Designers',
			],
		},
		{
			title: 'Stack',
			type: 'List',
			content: ['Go', 'React Native', 'Expo', 'PostgreSQL', 'Nix', 'Supabase'],
		},
	];
	const contentData: Section[] = [
		{
			title: 'Introduction',
			type: 'Single',
			content:
				'Platnm is a project I led during my time as a Product Lead at Generate. Overall, my biggest takeaway was about leadership and bringing a team together to get stuff done. ',
		},
		{
			title: 'Overview',
			type: 'Header',
			content: '',
		},
		{
			title: 'Spotify API Integration',
			type: 'Single',
			content: `Platnm has an internal catalogue of songs that we’re able to pull and populate via the Spotify API. We’re polling new albums and songs to build out database and dynamically fetching when a user requests media data we dont immediately have. 
`,
		},
		{
			title: 'Product Identity',
			type: 'Single',
			content: `
			Platnm is the one-stop shop for all matters related to musical discorse via musical ratings, reviews, and recommendations. A core focus of the scope of the product has been Platnm's social features and how can we create a product that promotes muscial discussion. A big part of that led to creating features related to personalization and facilitating human recommendations.
`,
		},
	];

	return (
		<div style={{ width: '100vw', overflow: 'hidden' }}>
			<ProjectHeader
				img={header}
				text='Giving music lovers am platform to rate, review, and recommend all their favorite songs'
			/>
			<Back />
			<div style={{ paddingLeft: '10%', marginTop: '10%', display: 'flex', flexDirection: 'row', gap: '10%' }}>
				<div style={{ width: '50vw' }}>
					<ProjectSidebar input={sidebarData} />
				</div>
				<ProjectContent input={contentData} />
			</div>
		</div>
	);
}
