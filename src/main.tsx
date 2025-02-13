import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Experiences from './routes/Experiences.tsx';
import Projects from './routes/Projects.tsx';
import Everything from './routes/Everything.tsx';
import Couplet from './routes/Couplet.tsx';
import Platnm from './routes/Platnm.tsx';
import MusicMantle from './routes/MusicMantle.tsx';
import { OutletWrapper } from './animated/OutletWrapper.tsx';
import Relay from './routes/Relay.tsx';
import Roadar from './routes/Roadar.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <OutletWrapper />,
		children: [
			{
				path: '/',
				element: <App />,
			},
			{
				path: '/Home',
				element: <App />,
			},
			{
				path: '/Projects',
				element: <Projects />,
			},
			{
				path: '/Experiences',
				element: <Experiences />,
			},
			{
				path: '/Everything',
				element: <Everything />,
			},
			{
				path: '/Projects/Couplet',
				element: <Couplet />,
			},
			{
				path: 'Projects/Platnm',
				element: <Platnm />,
			},
			{
				path: 'Projects/MusicMantle',
				element: <MusicMantle />,
			},
			{
				path: 'Projects/Relay',
				element: <Relay />,
			},
			{
				path: 'Projects/Roadar',
				element: <Roadar />,
			},
			{
				path: 'Projects/CollaborativeSpreadsheet',
				element: <Relay />,
			},
		],
	},
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);

export const containerVariant = {
	hidden: { opacity: 0 },
	enter: { opacity: 1, transition: { delay: 0, duration: 0.4, ease: 'circOut' } },
	exit: { opacity: 0, transition: { delay: 0, duration: 0.2, ease: 'circOut' } },
};
