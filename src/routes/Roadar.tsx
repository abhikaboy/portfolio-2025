import React from 'react';
import ProjectHeader from '../project/ProjectHeader';
import ProjectSidebar from '../project/ProjectSidebar';
import header from '../assets/projects/roadar/roadar-header.png';
import { Section } from '../project/ProjectContent';
import ProjectContent from '../project/ProjectContent';
import Back from '../components/Back';
import { motion } from 'motion/react';
import flows from '../assets/projects/roadar/flows.png';
import screens from '../assets/projects/roadar/screens.png';
import screens2 from '../assets/projects/roadar/screens2.png';
import { Text } from 'react-font';

export default function Roadar() {
	const sidebarData: Section[] = [
		{
			title: 'Event',
			type: 'Single',
			content: 'HackBeanPot 2025',
		},
		{
			title: 'Timeline',
			type: 'Single',
			content: 'Feb 8 - 9: 24 Hours',
		},
		{
			title: 'Role',
			type: 'Single',
			content: 'Software Engineer',
		},
		{
			title: 'Team',
			type: 'List',
			content: ['Abhik Ray', 'Lok Ye Young', 'Bobby Palazzi', 'Dennis Liu', 'Job V'],
		},
		{
			title: 'Stack',
			type: 'List',
			content: ['Go', 'React Native', 'Expo', 'MongoDB', 'Nix', 'Web Sockets'],
		},
	];
	const contentData: Section[] = [
		{
			title: 'Introduction',
			type: 'Single',
			content: `Roadar is an application my team and I built within 24 hours to try and crowdsource roadside assistance. 
        We wanted to build a mobile app that would allow drivers to be able to request immediate, or scheduled assistance 
        from mechanics in order to perform either routine or emergency fixes. `,
		},
		{
			title: 'Overview',
			type: 'Header',
			content: '',
		},
		{
			title: 'Social Impact',
			type: 'Single',
			content: `One of the biggest things we wanted to ensure within our project was that it was impactful and we would be helping people
      We learned that mechanics earn an meager wage of $22 / hour despite all of their hard work. Companies like AAA have their executives earn 
      millions of dollars while their employees are underpaid. Roadar is to mechanics what Uber is to drivers.
      `,
		},
		{
			title: 'Features & Challenges',
			type: 'Header',
			content: '',
		},
		{
			title: 'Job Creation',
			type: 'Single',
			content: `Drivers can make requests depending on their service type. On the home page, drivers can select from a variety of options, input the job urgency, and select their budget.`,
		},
		{
			title: 'WebSockets',
			type: 'Single',
			content: `One of the biggest features of Roadar is the ability for mechanics to go 'online' and receive repair requests in real time. Similar to how Uber works, 
      the mechanics would get a pop up in real time to accept or deny requests. We considered creating a microservice for our websockets, but ultimately figured out a method to have our http server and web socket connection listen in parallel.
      We also make use of MongoDB change streams to detect changes to the database and send it out to the appropriate clients.`,
		},
		{
			title: 'Authentication',
			type: 'Single',
			content: `Another challenge was supporting Apple OAuth to support both types of accounts - drivers and mechanics. Eventually once we solidified how to pass around the user state to our app properly, we were successfully able to support both of our users properly.`,
		},
	];

	return (
		<div style={{ width: '100vw', overflow: 'hidden' }}>
			<ProjectHeader
				img={header}
				text='Crowdsourcing Roadside Assistance in an Uber-styled mobile app to both help mechanics and make our streets safer'
			/>
			<Back />
			<div style={{ paddingLeft: '10%', marginTop: '10%', display: 'flex', flexDirection: 'row', gap: '10%' }}>
				<div style={{ width: '50vw' }}>
					<ProjectSidebar input={sidebarData} />
				</div>
				<ProjectContent input={contentData} />
			</div>
			<div
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					paddingLeft: '10%',
					paddingRight: '10%',
					alignItems: 'center',
				}}>
				<h1 style={{ fontSize: '3rem', marginTop: '10%', marginBottom: '5%', color: '#fff' }}>
					Featured Screens
				</h1>
				<motion.img
					src={screens}
					style={{
						width: '100%',
					}}
					initial={{ opacity: 0, x: 0, scale: 0.75 }}
					whileInView={{
						opacity: 1,
						x: 0,
						scale: 1,
					}}
				/>
				<h1 style={{ fontSize: '3rem', marginTop: '10%', marginBottom: '5%', color: '#fff' }}>User Flows</h1>
				<motion.img
					src={flows}
					style={{
						width: '100%',
					}}
					initial={{ opacity: 0, x: 0, scale: 0.75 }}
					whileInView={{
						opacity: 1,
						x: 0,
						scale: 1,
					}}
				/>

				<h1 style={{ fontSize: '3rem', marginTop: '10%', marginBottom: '5%', color: '#fff' }}>Future Plans</h1>
				<motion.img
					src={screens2}
					style={{
						width: '100%',
					}}
					initial={{ opacity: 0, x: 0, scale: 0.75 }}
					whileInView={{
						opacity: 1,
						x: 0,
						scale: 1,
					}}
				/>
			</div>
			<div
				style={{
					height: '30vh',
				}}></div>
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
				<motion.img
					initial={{ opacity: 0, filter: 'hue-rotate(0deg) brightness(1)' }}
					whileInView={{
						opacity: 1,
						filter: 'hue-rotate(0deg) brightness(1)',
						transition: { duration: 0.5, delay: 0.5 },
					}}
					src={icon}
					style={{ width: '60%', height: '20%', marginLeft: '-10%', marginTop: '-5%' }}
				/>
				<motion.div
					initial={{ opacity: 0, x: 200 }}
					whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: 'circOut' } }}
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
						{'Learning Outcomes #' + number}
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
				</motion.div>
			</div>
		</div>
	);
}
