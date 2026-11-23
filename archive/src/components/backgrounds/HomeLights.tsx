import React, { useRef, useEffect, useState } from 'react';
import top from '../../assets/lights/Ellipse 1.png';
import topRight from '../../assets/lights/Ellipse 2.png';
import botLeft from '../../assets/lights/Star 1.png';
import song from '../../assets/sound/thinkinboutu.mp3';
import { Howler } from 'howler';
import { Howl } from 'howler';

import red from '../../assets/lights/red.png';
import { motion } from 'motion/react';

import './Lights.css';

const customStyles = {
	position: 'absolute' as const,
	top: '50%',
	left: '50%',
	right: 'auto',
	bottom: 'auto',
	marginRight: '-50%',
	transform: 'translate(-50%, -50%)',
	background:
		'linear-gradient(204deg, rgba(0, 0, 0, 0.00) 15.62%, rgba(255, 30, 236, 0.03) 85.92%), rgba(21, 15, 33, 0.7)',
	padding: '5%',
	width: '30vw',
	height: '30vw',
	borderRadius: '312.5rem',
	border: '4px solid rgba(139, 57, 255, 0.75)',
	boxShadow: '0px 4px 250px 200px rgba(0, 0, 0, 0.5)',
};

type Props = {
	setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	playing: boolean;
};

export default function HomeLights({ setPlaying, playing }: Props) {
	const musicRef = useRef(null);
	const [phase, setPhase] = useState<'intro' | 'intro-fading' | 'enjoy' | 'fadeout'>('intro');

	useEffect(() => {
		musicRef.current = new Howl({
			src: [song],
			volume: 0.25,
			loop: true,
		});
		return () => {
			if (musicRef.current) {
				musicRef.current.unload();
			}
		};
	}, []);

	const handlePlay = () => {
		setTimeout(() => setPulseSize(true), 2750);
		setPopup(false);
		if (Howler.ctx.state !== 'running') {
			Howler.ctx.resume().then(() => {
				musicRef.current && musicRef.current.play();
				setPlaying(true);
			});
		} else {
			musicRef.current && musicRef.current.play();
			setPlaying(true);
		}
	};

	const [pulseSize, setPulseSize] = React.useState(false);
	const [popup, setPopup] = React.useState(true);

	if (popup) {
		return (
			<motion.div
				initial={{ opacity: 1 }}
				animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: phase === 'fadeout' ? 0.7 : 0.3 }}
				style={{
					position: 'absolute',
					width: '100vw',
					height: '100vh',
					overflow: 'clip',
					top: 0,
					zIndex: 9999,
					backgroundColor: 'rgba(0,0,0,0.95)',
				}}
				onAnimationComplete={() => {
					if (phase === 'fadeout') setPopup(false);
				}}>
				<div className='front'>
					{/* INTRO PHASE: Text and button */}
					{(phase === 'intro' || phase === 'intro-fading') && (
						<motion.div
							initial={{ opacity: 1 }}
							animate={{ opacity: phase === 'intro' ? 1 : 0 }}
							transition={{ duration: 0.4 }}
							onAnimationComplete={() => {
								if (phase === 'intro-fading') setPhase('enjoy');
							}}>
							<div
								style={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									textAlign: 'center',
									fontFamily: 'Instrument Sans, sans-serif',
								}}>
								<h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'white' }}>Immersion</h1>
								<p style={{ fontSize: '1rem', fontWeight: 400, color: 'white' }}>
									My portfolio has been built with the ideas of sound and immersion in mind- it would
									mean a lot if you grabbed a pair of headphones and listened along{' '}
								</p>
								<button
									onClick={() => {
										setPhase('intro-fading');
										setTimeout(() => setPhase('fadeout'), 2000); // 1s for enjoy, 0.7s for fadeout
										setTimeout(() => {
											setTimeout(() => setPulseSize(true), 2000);
											handlePlay();
										}, 2000);
									}}
									style={{
										backgroundColor: 'white',
										color: 'black',
										padding: '10px 20px',
										borderRadius: '5px',
										border: 'none',
										cursor: 'pointer',
									}}>
									I Understand
								</button>
							</div>
						</motion.div>
					)}

					{/* ENJOY PHASE: Enjoy! text fade in and out */}
					{phase === 'enjoy' && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: [0, 1, 0] }}
							transition={{ duration: 1, times: [0, 0.5, 1] }}
							onAnimationComplete={() => setPhase('fadeout')}
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								color: 'white',
								fontSize: '2.5rem',
								fontWeight: 700,
								textAlign: 'center',
								filter: 'drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.5))',
							}}>
							Enjoy !
						</motion.div>
					)}
				</div>
			</motion.div>
		);
	}
	return (
		<div style={{ position: 'absolute', width: '100vw', height: '100vh', overflow: 'clip', top: 0 }}>
			<div className='front'>
				<motion.div
					animate={{ opacity: 1 }}
					initial={{ opacity: 0 }}
					exit={{ opacity: 0 }}
					key='modal'
					transition={{ duration: 0.5 }}></motion.div>
			</div>

			<div style={{ opacity: 0.75, width: '100vw', overflow: 'clip' }}>
				<motion.img
					src={top}
					alt='top'
					style={{ position: 'absolute', top: '-100px', left: '0' }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.7, delay: 0 }}
				/>
				<motion.img
					src={topRight}
					alt='top'
					style={{ position: 'absolute', top: '-150px', right: '0' }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.5 }}
				/>
				<motion.img
					src={top}
					alt='top'
					className='pulse'
					style={{ position: 'absolute', top: '500', right: '0' }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 1.0 }}
				/>
				<motion.img
					src={botLeft}
					alt='top'
					style={{ position: 'absolute', bottom: '-150px', left: '0' }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.4, delay: 1.5 }}
				/>
			</div>

			<img
				src={red}
				alt='top'
				className={pulseSize ? 'pulseBeat' : 'pulseBeatSmall'}
				style={{ position: 'absolute', bottom: '0%', left: '0%', opacity: playing ? 1 : 0, zIndex: -1 }}
			/>
		</div>
	);
}
