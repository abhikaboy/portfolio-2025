import React from 'react';
import ProjectHeader from '../project/ProjectHeader';
import ProjectSidebar from '../project/ProjectSidebar';
import header from '../assets/projects/musicmantle/musicmantle-header.png';
import { Section } from '../project/ProjectContent';
import ProjectContent from '../project/ProjectContent';
import Back from '../components/Back';

export default function MusicMantle() {
	const sidebarData: Section[] = [
		{
			title: 'Timeline',
			type: 'Single',
			content: 'December 2024',
		},
		{
			title: 'Role',
			type: 'Single',
			content: 'Engineer',
		},
		{
			title: 'Team',
			type: 'List',
			content: ['(2) Software Engineer'],
		},
		{
			title: 'Stack',
			type: 'List',
			content: ['Python', 'MongoDB', 'FastAPI', 'React', 'Tailwind CSS'],
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
			content: `Platnm has an internal catalogue of songs that we’re able to pull and populate via the Spotify API. We’re polling new albums and songs to build out database and dynamically fetching when a user requests media data we dont immediately have. 
`,
		},
	];

	return (
		<div style={{ width: '100vw', overflow: 'hidden' }}>
			<ProjectHeader img={header} text='An interactive guessing game powered by semantic search' />
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
