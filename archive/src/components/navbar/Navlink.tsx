import React from 'react';
import { useNavigate } from 'react-router-dom';

import useSound from 'use-sound';
import hover from '../../assets/sound/hover.wav';
import click from '../../assets/sound/click.wav';
import './Animations.css';

type Props = {
	name: string;
};

export default function Navlink({ name }: Props) {
	const navigate = useNavigate();

	const [playHover] = useSound(hover, { volume: 1, loop: false, interrupt: true });
	const [playClick] = useSound(click, { volume: 1, loop: false, interrupt: true });

	return (
		<div
			onMouseEnter={() => playHover()}
			onClick={() => {
				playClick();
				navigate(`/${name}`);
			}}
			className='clickable'>
			{name}
		</div>
	);
}
