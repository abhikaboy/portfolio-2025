import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

export const AnimatedOutlet = (): React.JSX.Element => {
	const location = useLocation();
	const element = useOutlet();

	return (
		<AnimatePresence mode='popLayout'>
			{element && React.cloneElement(element, { key: location.key })}
		</AnimatePresence>
	);
};
