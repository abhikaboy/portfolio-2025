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
			content: `MusicMantle was a project for Northeastern's CS4100 Artificial Intelligence course. The core project is a guessing game where there is a randomly chosen music artist and the player must guess who it is using semantic search terms or other artists.
			The website will rank how close each guess is between 0 and 1 and will guide users from there.`,
		},
		{
			title: 'Process',
			type: 'Header',
			content: '',
		},
		{
			title: 'Data Collection & Filtering',
			type: 'Single',
			content: `Our data was sourced from Kaggle and specifically from the .last fm dataset. However, the dataset was not cleaned and we had to do a lot of manual filtering to get the data to a usable format. We paid attention to important details like how large the artists were, their home country, musical catalogue, and user defined tags.
`,
		},
		{
			title: 'Vector Search',
			type: 'Single',
			content: `After using an OpenAI model to create embeddings based off of all the data we could collection from the artists. We used MongoDB's vector search capabilities to calculate how far a user's query is from our actual hidden artist and ranked the relavence to signify how close the user's guess was to the actual artist.
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
			<iframe
				style={{
					width: '100%',
					marginLeft: '10%',
					marginRight: '10%',
					marginTop: '10%',
					height: '70vh',
					border: 'none',
				}}
				src='https://relay-file-upload.s3-us-east-2.amazonaws.com/to8dixn3fheScreen_Recording_2024-12-07_at_11.28.07_AM.qt'></iframe>
			<div
				style={{
					height: '30vh',
				}}
			/>
		</div>
	);
}
