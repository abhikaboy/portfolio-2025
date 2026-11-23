import { AnimatedOutlet } from './AnimatedOutlet.tsx';
import Navbar from '../components/navbar/Navbar.tsx';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import useSound from 'use-sound';
import { Howler } from 'howler';
import findmyway from '../assets/sound/findmyway.wav';
import babybyme from '../assets/sound/babybyme.mp3';

export function OutletWrapper() {
	// Resume AudioContext on first user interaction
	useEffect(() => {
		if (Howler.ctx && Howler.ctx.state === 'suspended') {
			const resume = () => {
				Howler.ctx.resume();
				window.removeEventListener('click', resume);
				window.removeEventListener('keydown', resume);
				window.removeEventListener('touchstart', resume);
			};
			window.addEventListener('click', resume);
			window.addEventListener('keydown', resume);
			window.addEventListener('touchstart', resume);
		}
	}, []);

	const location = useLocation();
	const [playFindMyWay] = useSound(findmyway, { volume: 0.25, loop: true, interrupt: true });
	const [playBabyByMe, { sound: babyByMeHowl }] = useSound(babybyme, { volume: 0.25, loop: true, interrupt: true });
	const lastSongRef = useRef<'findmyway' | 'babybyme' | 'none'>('none');

	useEffect(() => {
		const path = location.pathname.toLowerCase();
		let nextSong: 'findmyway' | 'babybyme' | null = null;
		if (path.includes('project')) {
			nextSong = 'findmyway';
		} else if (path.includes('experience')) {
			nextSong = 'babybyme';
		}

		if (lastSongRef.current !== nextSong || lastSongRef.current == null) {
			Howler.stop();
			if (nextSong === 'findmyway') {
				playFindMyWay();
			} else if (nextSong === 'babybyme') {
				playBabyByMe();
				if (babyByMeHowl) {
					babyByMeHowl.seek(10);
				} else {
					setTimeout(() => {
						if (babyByMeHowl) babyByMeHowl.seek(15.54);
					}, 100);
				}
			}
			lastSongRef.current = nextSong;
		} else if (nextSong === 'findmyway' && Howler._howls.every((h) => !h.playing())) {
			// If nothing is playing and we should be playing findmyway, play it
			playFindMyWay();
		}
		// No cleanup function here, so song continues if route matches
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	return (
		<>
			<div style={{ width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 100000 }}>
				<Navbar />
			</div>
			<div style={{ width: '100vw' }}>
				<AnimatedOutlet />
			</div>
		</>
	);
}
