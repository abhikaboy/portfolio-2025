import React from 'react';
import topLight from '../assets/lights/Ellipse 3.png';
import botLight from '../assets/lights/Ellipse 4.png';
import Font from 'react-font';
import { AnimatePresence, motion } from 'motion/react';
import ExperienceBar from '../components/ExperienceBar';

export default function Experiences() {
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
						style={{ width: '100vw', top: '0', position: 'absolute', filter: 'hue-rotate(20deg)' }}
					/>
				</motion.div>
				<Font family='Instrument Sans'>
					<div style={{ textAlign: 'center', fontSize: '2rem', marginTop: '12%', fontWeight: 'bold' }}>
						<div style={{ fontSize: '1rem', fontWeight: '400' }}>02.</div>
						Experiences
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '10px',
							marginTop: '3%',
							paddingLeft: '20%',
							paddingRight: '20%',
						}}>
						<ExperienceBar
							place='MongoDB Inc.'
							title='Incoming Software Engineer Intern'
							description='Team N/A'
						/>
						<ExperienceBar
							place='Generate Product Development Studio'
							title='Tech Lead'
							description='Building PlateMate -> Empowering Resturants with Data Driven Insights'
						/>
						<ExperienceBar
							place='Generate Product Development Studio'
							title='Product Lead'
							description='Building Platnm -> The one-stop shop for all musical discourse'
						/>
						<ExperienceBar
							place='Cambridge Mobile Telematics Inc.'
							title='Software Engineer Intern'
							description='CloudApps Team -> Creating a robust audit log to record and modify customer configuations'
						/>
						<ExperienceBar
							place='Relay Apps LLC'
							title='Founder, Engineer'
							description='Building Relay -> Redefining cross-platform communication'
						/>
						<ExperienceBar
							place='Generate Product Development Studio'
							title='Software Engineer'
							description='Building Couplet -> Matching like-minded people based on events and real experiences'
						/>
						<ExperienceBar
							place='RevSpring Inc.'
							title='Software Engineer Intern'
							description='Patient Messaging Team -> Cross-functional development of a new suite of support tools.'
						/>
						<ExperienceBar
							place='FIRST Robotics'
							title='Software & Stratefy Lead'
							description='Building World Class Robotics Software'
						/>
					</div>
				</Font>
				<img src={botLight} style={{ width: '100vw', position: 'absolute', top: '80vh' }} />
			</div>
		</AnimatePresence>
	);
}
