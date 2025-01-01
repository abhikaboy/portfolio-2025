import Font from 'react-font';
type Props = {
	children: string;
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
