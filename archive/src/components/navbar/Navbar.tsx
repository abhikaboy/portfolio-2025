import React, { useEffect, useState } from 'react';
import Font from 'react-font';
import { Howler } from 'howler';

import Navlink from './Navlink';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
	const [show, setShow] = useState(true);
	const location = useLocation();
	const [isPaused, setIsPaused] = useState(false);
	const [pausedId, setPausedId] = useState(null);

	useEffect(() => {
		if (location.pathname.includes('/Projects/')) {
			setShow(false);
		} else {
			setShow(true);
		}
	}, [location.pathname]);

	// Track pause/play state of the most recently played Howl
	useEffect(() => {
		const interval = setInterval(() => {
			const lastPlayed = [...Howler._howls].reverse().find((h) => h._playLock || h.playing() || h._wasPlayed);
			if (lastPlayed) {
				setIsPaused(!lastPlayed.playing() && lastPlayed._wasPlayed);
			} else {
				setIsPaused(false);
			}
		}, 300);
		return () => clearInterval(interval);
	}, []);

	return (
		show && (
			<>
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
								alignItems: 'center',
							}}>
							<Navlink name='Home' />
							<Navlink name='Experiences' />
							<Navlink name='Projects' />
							{/* <Navlink name='Everything' /> */}
						</div>
					</Font>
				</div>

				{/* Audio Controls Floating Div */}
				<div
					style={{
						position: 'fixed',
						bottom: '5%',
						right: '5%',
						display: 'flex',
						gap: 16,
						zIndex: 100,
					}}>
					{/* Pause/Resume: Toggle based on state */}
					<button
						onClick={() => {
							const lastPlayed = [...Howler._howls]
								.reverse()
								.find((h) => h._playLock || h.playing() || h._wasPlayed);
							if (lastPlayed) {
								if (isPaused) {
									if (pausedId) {
										lastPlayed.play(pausedId);
										setPausedId(null);
									} else {
										lastPlayed.play();
									}
								} else {
									// Pause and store the id
									const id = lastPlayed._sounds.find((s) => s.playing()).id;
									lastPlayed.pause(id);
									setPausedId(id);
								}
							}
						}}
						style={{ border: 'none', background: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}
						title={isPaused ? 'Resume' : 'Pause'}>
						{isPaused ? '▶️' : '⏸'}
					</button>
					{/* Stop: Stop all Howls */}
					<button
						onClick={() => Howler.stop()}
						style={{ border: 'none', background: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}
						title='Stop'>
						⏹
					</button>
					{/* Restart: Stop all, then play the most recently played Howl if any */}
					<button
						onClick={() => {
							Howler.stop();
							const lastPlayed = [...Howler._howls]
								.reverse()
								.find((h) => h._playLock || h.playing() || h._wasPlayed);
							if (lastPlayed) lastPlayed.play();
						}}
						style={{ border: 'none', background: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}
						title='Restart'>
						⏯
					</button>
				</div>
			</>
		)
	);
}
