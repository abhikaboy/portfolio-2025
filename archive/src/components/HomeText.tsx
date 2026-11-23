import Font from 'react-font';
import { ReactNode } from 'react';
type Props = {
	children: ReactNode;
};

export default function HomeText({ children }: Props) {
	return (
		<div>
			<Font family='Instrument Sans'>
				<div style={{ color: '#fff', fontSize: '2.5rem', width: '70vw' }}>{children}</div>
			</Font>
		</div>
	);
}
