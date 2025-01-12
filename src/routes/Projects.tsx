import React from 'react';
import topLight from '../assets/lights/Ellipse 3.png';
import botLight from '../assets/lights/Ellipse 4.png';
import Font from 'react-font';
import { AnimatePresence, motion } from 'motion/react';
import ExperienceBar from '../components/ExperienceBar';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
	const projectData = [
		{
			place: 'Couplet',
			title: 'React Native, Expo, Golang, Postgres',
			description: 'A dating app to match users based on events and real experiences',
		},
		{
			place: 'Platnm',
			title: 'React Native, Expo, Golang, Postgres, Supabase',
			description: 'The one-stop shop for all musical discourse',
		},
		{
			place: 'Music Mantle',
			title: 'Python, Typescript, Nix',
			description: 'Leveraging Vector Search to create an interactive game',
		},
		{
			place: 'Relay',
			title: 'React Native, Expo, GraphQL, Express, MongoDB',
			description: 'Website for Professional Business Fraternity at Northeastern',
		},
		{
			place: 'Collaborative Spreadsheet',
			title: 'React, MongoDB, Express',
			description: 'A collaborative spreadsheet featuring real-time collaboration, graphs, and an audit log',
		},

		{
			place: 'FRC Scouting',
			title: 'React',
			description: 'An offline way to record and analyze competitive data and drive meaningful insights',
		},
		{
			place: 'Chi Sigma Website',
			title: 'React, Storybook, Tailwind',
			description: 'Website for Professional Business Fraternity at Northeastern',
		},
		{
			place: 'Relay Chrome Extension',
			title: 'React, Axios',
			description: 'Website for Professional Business Fraternity at Northeastern',
		},
		{
			place: 'Learnmyfretboard',
			title: 'React',
			description: 'Helping guitarists learn their fretboard interactively',
		},
		{
			place: 'Relay Desktop Client',
			title: 'React, Electron, GraphQL, Express, MongoDB',
			description: 'Website for Professional Business Fraternity at Northeastern',
		},

		{
			place: 'Chi Sigma Deliberator',
			title: 'React',
			description: 'Creating a fair way to review applicants',
		},
		{
			place: 'VSCode Shortcuts',
			title: 'Node.js',
			description: 'Shortcuts to speed up the process of writing FRC code',
		},
		{
			place: 'Venusian Village',
			title: 'Pygame',
			description: 'Simulating life on venus. AIGOHackathon Winner.',
		},
	];
	const navigate = useNavigate();
	return (
		<AnimatePresence>
			<div style={{ color: '#fff' }}>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}>
					<img
						src={topLight}
						alt='top'
						style={{
							width: '100vw',
							top: '0',
							position: 'absolute',
							filter: 'hue-rotate(90deg) saturate(3)',
						}}
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}>
					<img
						src={topLight}
						alt='top'
						style={{
							width: '100vw',
							top: '100vh',
							right: '-10vw',
							position: 'absolute',
							transform: 'rotate(90deg)',
							filter: 'hue-rotate(90deg) saturate(5) blur(100px)',
						}}
					/>
				</motion.div>
				<Font family='Instrument Sans'>
					<div style={{ textAlign: 'center', fontSize: '2rem', marginTop: '12%', fontWeight: 'bold' }}>
						<div style={{ fontSize: '1rem', fontWeight: '400' }}>03.</div>
						Projects
					</div>
					<div style={{ textAlign: 'center', marginTop: '2%' }}>Showing {projectData.length} projects</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '10px',
							marginTop: '3%',
							paddingLeft: '20%',
							paddingRight: '20%',
						}}>
						{projectData.map(({ place, title, description }, index) => (
							<ExperienceBar
								place={place}
								title={title}
								description={description}
								key={index}
								onClick={() => navigate(`./${place.replace(' ', '')}`)}
							/>
						))}
					</div>
				</Font>
				<img
					src={botLight}
					style={{
						width: '100vw',
						position: 'absolute',
						transform: 'translateY(-90%)',
						filter: 'hue-rotate(30deg) saturate(3)',
					}}
				/>
			</div>
		</AnimatePresence>
	);
}
