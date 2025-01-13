import { AnimatedOutlet } from './AnimatedOutlet.tsx';
import Navbar from '../components/navbar/Navbar.tsx';

export function OutletWrapper() {
	return (
		<div>
			<Navbar />
			<AnimatedOutlet />
		</div>
	);
}
