import { useEffect, useState } from 'react';
import './App.css';
import HomeLights from './components/backgrounds/HomeLights';
import HomeBody from './components/HomeBody';

import PageTransition from './animated/PageTransition';

function App() {
	const [playing, setPlaying] = useState(false);
	useEffect(() => {
		function transformScroll(event) {
			if (!event.deltaY) {
				return;
			}

			event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
			event.preventDefault();
		}

		const element = document.scrollingElement || document.documentElement;
		element.addEventListener('wheel', transformScroll);
	}, []);

	return (
		<PageTransition>
			<div style={{ backgroundColor: '#000', height: '100vh', minWidth: '100vw' }}>
				<HomeBody />
				<div style={{ position: 'fixed', top: 0 }}>
					<HomeLights setPlaying={setPlaying} playing={playing} />
				</div>
			</div>
		</PageTransition>
	);
}

export default App;
