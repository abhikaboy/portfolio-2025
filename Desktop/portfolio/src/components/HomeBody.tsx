import React, { useState } from 'react';
import HomeText from './HomeText';
import Font, { Text } from 'react-font';
import './backgrounds/Lights.css';

export default function HomeBody({ playing }: { playing: boolean }) {
	const [scroll, setScroll] = useState(0);

	const handleScroll = () => {
		setScroll(window.scrollX);
		console.log(scroll);
	};

	window.addEventListener('scroll', handleScroll);

	return (
		<div
			style={{
				flex: 1,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				height: '90vh',
				gap: '50vw',
				// transform: `translateX(${scroll}px)`,
			}}>
			<div style={{ display: 'flex', flexDirection: 'column', marginLeft: '15%' }}>
				<Font family='Instrument Sans'>
					<div
						style={{
							color: '#fff',
							position: 'fixed',
							opacity: scroll / 1000,
						}}>
						01. Philosophy
					</div>
				</Font>
				<Text
					style={{
						fontSize: '4.5rem',
						color: '#fff',
						width: '70vw',
						zIndex: 0,
						fontWeight: 600,
						marginBottom: '10px',
						marginTop: 20,
					}}
					family={'Instrument Sans'}>
					I craft products, experiences &{' '}
					<div
						style={{
							display: 'inline-block',
							filter: 'drop-shadow(0px 0px 5px #fff)',
						}}>
						vibes
					</div>
				</Text>
				<Text
					family={'Instrument Sans'}
					className={playing ? 'pulseBeatSmall' : ''}
					style={{
						color: '#fff',
						textAlign: 'left',
						alignSelf: 'flex-start',
						fontSize: '1.5rem',
						marginTop: 0,
						filter: 'drop-shadow(0px 0px 5px #fff)',
					}}>
					beak
				</Text>
			</div>
			<HomeText>Let me tell you about myself</HomeText>
			<HomeText>My personal philosophy is basically derived from One Piece:</HomeText>
			<HomeText>“Learn about yourself, learn about the world, and become strong!” - Dracule Mihawk</HomeText>
			<HomeText>
				That being said, I’m 19 and I have a lot to learn - and I love doing exactly that. Put on your
				headphones and enjoy the rest :)
			</HomeText>

			<div>asd</div>
		</div>
	);
}
