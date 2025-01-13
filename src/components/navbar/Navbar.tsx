import React, { useEffect, useState } from 'react';
import Font from 'react-font';

import Navlink from './Navlink';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
	const [show, setShow] = useState(true);
	const location = useLocation();

	useEffect(() => {
		if (location.pathname.includes('/Projects/')) {
			setShow(false);
		} else {
			setShow(true);
		}
	}, [location.pathname]);

	return (
		show && (
			<div
				style={{
					backgroundColor: '#00000020',
					padding: 24,
					borderRadius: '10px',
					position: 'fixed',
					top: '5%',
					right: '5%',
					color: '#fff',
					zIndex: 10,
				}}>
				<Font family='Instrument Sans'>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: '24px',
						}}>
						<Navlink name='Home' />
						<Navlink name='Experiences' />
						<Navlink name='Projects' />
						<Navlink name='Everything' />
					</div>
				</Font>
			</div>
		)
	);
}
