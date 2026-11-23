import React from 'react';
import topLight from '../assets/lights/Ellipse 3.png';
import botLight from '../assets/lights/Ellipse 4.png';
import Font from 'react-font';
import ExperienceBar from '../components/ExperienceBar';
import PageTransition from '../animated/PageTransition';
import { motion } from 'framer-motion';
import '../components/backgrounds/Lights.css';

export default function Experiences() {
	return (
		<PageTransition pageName='Experiences'>
			<motion.div style={{ color: '#fff', top: '0px' }}>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}>
					<img
						src={topLight}
						alt='top'
						className='pulseOpacity'
						style={{
							width: '100vw',
							top: 0,
							left: 0,
							position: 'fixed',
							zIndex: 10,
							filter: 'hue-rotate(20deg)',
							pointerEvents: 'none',
						}}
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
							title='Software Engineer Intern'
							description='Atlas Stream Processing (Engine) -> Building a new Query Operator to improve lookup performance in Stream Processing pipelines'
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
							title='Software & Strategy Lead'
							description='Building World Class Robotics Software'
						/>
					</div>
				</Font>
				<img
					src={botLight}
					className='pulseOpacity'
					style={{ width: '100vw', position: 'absolute', top: '80vh' }}
				/>
			</motion.div>
		</PageTransition>
	);
}
