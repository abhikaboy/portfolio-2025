import React from 'react';
import { Text } from 'react-font';
import { useNavigate } from 'react-router-dom';

export default function Back() {
	const navigate = useNavigate();
	return (
		<Text
			onClick={() => navigate('../Projects')}
			family='DM Sans'
			className='back'
			style={{
				position: 'fixed',
				top: '5%',
				left: '5%',
				padding: '10px',
				borderRadius: '10px',
				color: '#fff',
			}}>
			{'←'}
		</Text>
	);
}
