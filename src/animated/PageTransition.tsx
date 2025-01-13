import React from 'react';
import { motion } from 'framer-motion';
import { containerVariant } from '../main.tsx';
export default function PageTransition({ children }: { children: React.ReactNode }) {
	return (
		<motion.div variants={containerVariant} initial='hidden' animate='enter' exit='exit' style={{ color: '#fff' }}>
			{children}
		</motion.div>
	);
}
