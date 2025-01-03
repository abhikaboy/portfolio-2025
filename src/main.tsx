import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Experiences from './routes/Experiences.tsx';
import Projects from './routes/Projects.tsx';
import Navbar from './components/navbar/Navbar.tsx';
import Everything from './routes/Everything.tsx';
createRoot(document.getElementById('root')!).render(
	<Router>
		<Navbar />
		<Routes>
			<Route path='/' element={<App />} />
			<Route path='/Home' element={<App />} />
			<Route path='/Experiences' element={<Experiences />} />
			<Route path='/Projects' element={<Projects />} />
			<Route path='/Everything' element={<Everything />} />
		</Routes>
	</Router>,
);
