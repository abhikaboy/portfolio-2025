import React from 'react';
import { Text } from 'react-font';
import { motion } from 'framer-motion';

type Props = {
	img: string;
	text: string;
};

export default function ProjectHeader({ img, text }: Props) {
	return (
		<motion.div
			style={{ width: '100vw' }}
			initial={{ opacity: 0, y: -800 }}
			transition={{ duration: 0.5, ease: 'circOut', delay: 0.5 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -800, transition: { duration: 0.5, ease: 'circIn' } }}>
			<img src={img} style={{ width: '100%' }} />
			<Text
				family='DM Sans'
				weight={300}
				style={{
					textAlign: 'left',
					fontSize: 36,
					color: 'white',
					width: '85%',
					paddingLeft: '10%',
					paddingRight: '10%',
					marginTop: '-3%',
				}}>
				{text}
			</Text>
		</motion.div>
	);
}
