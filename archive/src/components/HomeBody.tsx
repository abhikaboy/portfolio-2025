import React, { useState } from 'react';
import HomeText from './HomeText';
import Font, { Text } from 'react-font';
import './backgrounds/Lights.css';
import { useNavigate } from 'react-router-dom';

export default function HomeBody() {
	const [scroll, setScroll] = useState(0);
	const navigate = useNavigate();
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
				<Font family={'Instrument Sans'}>
					<div
						style={{
							fontSize: '4.5rem',
							color: '#fff',
							width: '70vw',
							zIndex: 0,
							fontWeight: 600,
							marginBottom: '10px',
							marginTop: 20,
							letterSpacing: '-0.02em',
						}}>
						<div>
							I craft products, experiences &{' '}
							<div
								style={{
									display: 'inline-block',
									filter: 'drop-shadow(0px 0px 5px #fff)',
								}}>
								vibes
							</div>
						</div>
					</div>
				</Font>
				<Text
					family={'Instrument Sans'}
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
			<HomeText>I've started my journey loving technology & code with a passion for building products</HomeText>

			<HomeText>
				Somewhere along the way I realized, in order to be the best at that, I have to learn to think like a
				designer
			</HomeText>
			<HomeText>
				Delving into interaction design, I've learned how the two overlapped and developed a love for product
			</HomeText>
			<HomeText>
				Taking the pillars of Tech, Design, and Product, I want to apply what I've learned to build not just the
				products
			</HomeText>
			<HomeText>But the systems and frameworks that will power the future.</HomeText>
			<HomeText>All while having fun and meeting awesome people along the way :)</HomeText>
			<HomeText>
				<div style={{ flex: 1, flexDirection: 'column' }}>
					Take a look at some of my experiences that have shaped who I am!
					<div
						onClick={() => {
							navigate('/experiences');
						}}
						onMouseEnter={() => console.log('hover')}
						style={{
							color: '#fff',
							fontSize: '1.2rem',
							fontWeight: 400,
							cursor: 'pointer',
							marginTop: '10px',
							filter: 'drop-shadow(0px 0px 5px #fff)',
							zIndex: 100,
							position: 'relative',
						}}
						className='clickable'>
						View Experiences {'->'}
					</div>
				</div>
			</HomeText>
			<div>osdfiughoa</div>
		</div>
	);
}
