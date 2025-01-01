import { useState } from 'react';
import './App.css';
import HomeLights from './components/backgrounds/HomeLights';
import HomeBody from './components/HomeBody';

import Navbar from './components/navbar/Navbar';

function App() {
	const [playing, setPlaying] = useState(false);

	return (
		<div style={{ backgroundColor: '#000', height: '100vh', minWidth: '100vw' }}>
			<Navbar />
			<HomeBody playing={playing} />
			<div style={{ position: 'fixed', top: 0 }}>
				<HomeLights setPlaying={setPlaying} playing={playing} />
			</div>
		</div>
	);
}

export default App;
