import React from 'react';
import { motion } from 'framer-motion';
import Font from 'react-font';

type Props = {
	place: string;
	title: string;
	description: string;
	onClick?: () => void;
};

export default function ExperienceBar({ place, title, description, onClick }: Props) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
			onClick={onClick}
			whileHover={{
				scale: 1,
				backgroundColor: '#00bb000a',
				filter: 'drop-shadow(0px 0px 5px #fff)',
				cursor: 'pointer',
			}}
			style={{
				width: '100%',
				height: '10vh',
				padding: 32,
				display: 'flex',
				flexDirection: 'column',
				background: `#00000010`,
				borderRadius: '10px',
				border: '1px solid #00000040',
				filter: 'drop-shadow(0px 0px 5px #000)',
				zIndex: 3,
			}}>
			<Font family='Instrument Sans' weight={600}>
				<div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{place}</div>
			</Font>
			<Font family='Inter' weight={200}>
				<div style={{ marginBottom: 2 }}>{title}</div>
			</Font>
			<Font family='Inter' weight={100}>
				<div>{description}</div>
			</Font>
		</motion.div>
	);
}
