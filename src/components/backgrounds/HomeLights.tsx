import React from 'react';
import top from '../../assets/lights/Ellipse 1.png';
import topRight from '../../assets/lights/Ellipse 2.png';
import botLeft from '../../assets/lights/Star 1.png';
import useSound from 'use-sound';
import song from '../../assets/sound/tunnelvision.mp3';
import hover from '../../assets/sound/hover.wav';
import click from '../../assets/sound/click.wav';

import red from '../../assets/lights/red.png';
import headphone from '../../assets/headphone.png';
import { AnimatePresence, motion } from 'motion/react';

import './Lights.css';
import Font from 'react-font';

const customStyles = {
	position: 'absolute' as const,
	top: '50%',
	left: '50%',
	right: 'auto',
	bottom: 'auto',
	marginRight: '-50%',
	transform: 'translate(-50%, -50%)',
	backgroundColor: '#000014',
	padding: '5%',
	borderRadius: '10px',
	width: '50%',
};

type Props = {
	setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	playing: boolean;
};

export default function HomeLights({ setPlaying, playing }: Props) {
	const [playSong] = useSound(song, { volume: 0.25, loop: true });
	const [playHover] = useSound(hover, { volume: 1, loop: false, interrupt: true });
	const [playClick] = useSound(click, { volume: 1, loop: false, interrupt: true });
	const [pulseSize, setPulseSize] = React.useState(false);
	const [popup, setPopup] = React.useState(true);

	return (
		<div style={{ position: 'absolute', width: '100vw', height: '100vh', overflow: 'clip', top: 0 }}>
			<AnimatePresence>
				<div className='front'>
					<motion.div
						animate={{ opacity: 1 }}
						initial={{ opacity: 0 }}
						exit={{ opacity: 0 }}
						key='modal'
						transition={{ duration: 0.5, delay: 1 }}>
						{popup && (
							<motion.div style={customStyles}>
								<Font family='Instrument Sans'>
									<div
										style={{
											flex: 1,
											display: 'flex',
											flexDirection: 'row',
											gap: '50px',
											color: '#fff',
										}}>
										<img src={headphone} alt='red' style={{ width: '200px', height: '200px' }} />
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												gap: '10px',
												margin: 'auto',
											}}>
											<div style={{ fontWeight: 900, fontSize: '3rem' }}>Immersion</div>
											<div>
												A core principle behind this portfolio is the idea of audio immersion.
												We'd highly recommend putting on some headphones. Thanks!
											</div>
											<div>
												<motion.button
													onMouseEnter={() => playHover()}
													whileHover={{
														scale: 1.1,
														backgroundColor: '#00bbff40',
														cursor: 'pointer',
													}}
													style={{
														padding: '10px 24px 10px 24px',
														borderRadius: '10px',
														backgroundColor: '#00bbff00',
														border: '1px solid #00bbff',
														color: '#fff',
													}}
													onClick={() => {
														if (!playing) {
															playClick();
															setPopup(false);
															setTimeout(() => {
																playSong();
																setPlaying(true);
																setTimeout(() => {
																	setPulseSize(true);
																}, 15000);
															}, 500);
														}
													}}>
													I'm Plugged In!
												</motion.button>
											</div>
										</div>
									</div>
								</Font>
							</motion.div>
						)}
					</motion.div>
				</div>
				{popup && (
					<motion.div
						animate={{ opacity: 1 }}
						initial={{ opacity: 0 }}
						exit={{ opacity: 0 }}
						key='bg'
						transition={{ ease: 'easeIn', duration: 0.5 }}
						style={{
							width: '100vw',
							height: '100vh',
							backgroundColor: 'rgba(0,0,0,0.9)',
							zIndex: 2,
							position: 'absolute',
							top: 0,
							left: 0,
						}}
					/>
				)}
			</AnimatePresence>
			<img src={top} alt='top' style={{ position: 'absolute', top: '-100px', left: '100' }} />
			<img src={topRight} alt='top' style={{ position: 'absolute', top: '-250px', right: '0' }} />
			<img src={top} alt='top' className='pulse' style={{ position: 'absolute', top: '500', right: '0' }} />
			<img src={botLeft} alt='top' style={{ position: 'absolute', bottom: '-150px', left: '0' }} />

			<img
				src={red}
				alt='top'
				className={pulseSize ? 'pulseBeat' : 'pulseBeatSmall'}
				style={{ position: 'absolute', bottom: '0%', left: '0%', opacity: playing ? 1 : 0, zIndex: -1 }}
			/>
		</div>
	);
}
