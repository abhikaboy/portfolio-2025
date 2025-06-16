import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { containerVariant } from '../main.tsx';

export default function PageTransition({ children, pageName }: { children: React.ReactNode; pageName?: string }) {
	const [showContent, setShowContent] = useState(!pageName);
	const [showName, setShowName] = useState(!!pageName);

	useEffect(() => {
		if (!pageName) return;
		const t1 = setTimeout(() => setShowName(false), 1400); // fade out after 1.4s
		const t2 = setTimeout(() => setShowContent(true), 1600); // show content after fade out
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, [pageName]);

	return (
		<motion.div
			variants={containerVariant}
			initial='hidden'
			animate='enter'
			exit='exit'
			style={{ color: '#fff', overflow: 'clip', width: '100vw', minHeight: '100vh', position: 'relative' }}>
			{pageName && showName && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						background: 'rgba(0,0,0,0.95)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 99999,
					}}>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 1, 1, 0] }}
						transition={{ duration: 1.4, times: [0, 0.107, 0.893, 1] }}
						style={{
							color: 'white',
							fontSize: '2.5rem',
							fontWeight: 700,
							textAlign: 'center',
							filter: 'drop-shadow(0px 0px 10px rgba(255,255,255,0.5))',
						}}>
						{pageName}
					</motion.div>
				</div>
			)}
			{showContent && children}
		</motion.div>
	);
}
