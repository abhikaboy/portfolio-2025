import React from 'react';
import ProjectHeader from '../project/ProjectHeader';
import ProjectSidebar from '../project/ProjectSidebar';
import header from '../assets/projects/couplet/couplet-header.png';
import { Section } from '../project/ProjectContent';
import ProjectContent from '../project/ProjectContent';
import screens from '../assets/projects/couplet/couplet-screens.png';
import heart from '../assets/projects/couplet/couplet-Logo.png';
import chain from '../assets/projects/couplet/ticketChain.png';
import guy from '../assets/projects/couplet/couplet-guy.png';
import bg2 from '../assets/projects/couplet/bg2.png';
import screen from '../assets/projects/couplet/cropped-phones.png';

import { useNavigate } from 'react-router-dom';
import { Text } from 'react-font';
export default function Couplet() {
	const navigate = useNavigate();
	const sidebarData: Section[] = [
		{
			title: 'Organization',
			type: 'Single',
			content: 'Generate Product Development Studio',
		},
		{
			title: 'Timeline',
			type: 'Single',
			content: 'January - April 2024',
		},
		{
			title: 'Role',
			type: 'Single',
			content: 'Software Engineer',
		},
		{
			title: 'Team',
			type: 'List',
			content: [
				'(1) Product Manager',
				'(2) Technical Leads',
				'(7) Software Engineers',
				'(1) Design Lead',
				'(4) UI/UX Designers',
			],
		},
		{
			title: 'Stack',
			type: 'List',
			content: ['Go', 'React Native', 'Expo', 'PostgreSQL', 'Docker'],
		},
	];
	const contentData: Section[] = [
		{
			title: 'Introduction',
			type: 'Single',
			content:
				'Couplet aims to redefine the dating app experience by moving away from the typical swipe culture. The app focuses on creating genuine connections among users based on shared experiences rather than superficial appearances. The goal is to provide a contemporary platform for fostering authentic relationships, be it romantic or platonic.',
		},
		{
			title: 'Overview',
			type: 'Header',
			content: '',
		},
		{
			title: 'Interest-First Matching',
			type: 'Single',
			content: `Couplet is less reliant on physical appearances and focuses predominantly on
matching people based on shared interests. While users are required to have at least two photos in a
profile, this is not the primary driver of the match. Couplet seeks to disrupt the swipe culture
prominent in the current dating app landscape.
`,
		},
	];
	return (
		<div style={{ width: '100vw', overflow: 'hidden' }}>
			<ProjectHeader
				img={header}
				text='Helping people find authentic real-world connections while supporting non-profit arts businesses in
              Boston'
			/>
			<div
				onClick={() => navigate('./Projects')}
				style={{
					backgroundColor: '#00000040',
					position: 'fixed',
					top: '5%',
					left: '5%',
					padding: '10px',
					borderRadius: '10px',
					color: '#fff',
				}}>
				{'-'}
			</div>
			<div style={{ paddingLeft: '10%', marginTop: '10%', display: 'flex', flexDirection: 'row', gap: '10%' }}>
				<div style={{ width: '50vw' }}>
					<ProjectSidebar input={sidebarData} />
				</div>
				<ProjectContent input={contentData} />
			</div>
			<div style={{ marginTop: '10%' }}>
				<LearningOutcome
					number={'1'}
					title={`SQL isn't Scary`}
					content='This was my first real introduction to relational databases. Coming from a strict NoSQL background, I definitely learned a lot here on how to actually interact with databases. Typically, people learn SQL first and its considered a simple tool to pick up, but I honestly was afraid of it for the longest time.'
					content2='Why? Because i didn’t know it. I knew how to accomplish the same functionality with other tools, so I would always opt for those and avoided this at all costs. However, being pushed outside my comfort zone I realized the perspective of relational data and how to model data as such'
					background={screens}
					icon={heart}
				/>
			</div>
			<img src={chain} style={{ width: '100%', height: '10%', marginTop: '-5%' }} />
			<div style={{ marginTop: '-5%' }}>
				<LearningOutcome
					number={'2'}
					title={`Golang is awesome`}
					content='This was my first real introduction to relational databases. Coming from a strict NoSQL background, I definitely learned a lot here on how to actually interact with databases. Typically, people learn SQL first and its considered a simple tool to pick up, but I honestly was afraid of it for the longest time.'
					content2=''
					background={bg2}
					icon={guy}
				/>
				<img src={chain} style={{ width: '100%', height: '10%', marginTop: '-5%' }} />
				<div
					style={{
						width: '100%',
						height: '60vh',
						backgroundColor: '#000',
						marginTop: '5%',
					}}>
					<img src={screen} style={{ width: '100%' }} />
				</div>
			</div>
		</div>
	);
}

function LearningOutcome({
	number,
	title,
	content,
	content2,
	background,
	icon,
}: {
	number: string;
	title: string;
	content: string;
	content2: string;
	background: string;
	icon: string;
}) {
	return (
		<div
			style={{
				backgroundImage: `url(${background})`,
				width: '100%',
				height: '90vh',
			}}>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<img src={icon} style={{ width: '60%', height: '20%', marginLeft: '-10%', marginTop: '-5%' }} />
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						margin: 'auto',
						marginLeft: '-10%',
						marginTop: '10%',
						paddingRight: '10%',
						color: '#fff',
						gap: 0,
					}}>
					<Text family='Avenir' style={{ fontSize: 20, margin: '0' }}>
						Learning Outcomes #{number}
					</Text>
					<Text family='Avenir' weight={700} style={{ fontSize: 40, margin: '0' }}>
						{title}
					</Text>
					<Text family='Avenir' style={{ fontSize: 20, marginTop: 16 }}>
						{content}
					</Text>
					<Text family='Avenir' style={{ fontSize: 20, marginTop: 16 }}>
						{content2}
					</Text>
				</div>
			</div>
		</div>
	);
}
