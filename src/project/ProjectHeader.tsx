import React from 'react';
import { Text } from 'react-font';
type Props = {
	img: string;
	text: string;
};

export default function ProjectHeader({ img, text }: Props) {
	return (
		<div style={{ width: '100vw' }}>
			<img src={img} style={{ width: '100%' }} />
			<Text
				family='DM Sans'
				weight={300}
				style={{
					textAlign: 'left',
					fontSize: 36,
					color: 'white',
					width: '85%',
					paddingLeft: '10%',
					paddingRight: '10%',
					marginTop: '-3%',
				}}>
				{text}
			</Text>
		</div>
	);
}
