import { useEffect, useState } from 'react';
import Font from 'react-font';
import { motion } from 'framer-motion';

type SectionProps = {
	title: string;
	content: string;
};
type ListSectionProps = {
	title: string;
	content: string[];
};

export type Section = {
	title: string;
	type: 'Single' | 'List' | 'Header';
	content: string | string[];
};

type Props = {
	input: Section[];
};

function transform(item: Section) {
	switch (item.type) {
		case 'Header':
			return <Header title={item.title} />;
		case 'List':
			// @ts-expect-error meow
			return <ListSection title={item.title} content={item.content} />;
		case 'Single':
			// @ts-expect-error meow
			return <Section title={item.title} content={item.content} />;
		default:
			return null;
	}
}

export default function ProjectContent({ input }: Props) {
	const [items, setItems] = useState([]);
	// transform the input into their respective components
	useEffect(() => {
		const inputTransformed = [];
		input.forEach((item) => {
			inputTransformed.push(transform(item));
		});
		setItems(inputTransformed);
	}, [input]);
	return (
		<Font family='Avenir' weight={250}>
			<motion.div
				initial={{ opacity: 0, x: 400 }}
				animate={{ opacity: 1, x: 0, transition: { ease: 'circOut', delay: 0.6 } }}
				exit={{ opacity: 0, x: 400, transition: { duration: 0.6, ease: 'circIn', delay: 0.2 } }}
				transition={{ duration: 0.5 }}
				style={{
					display: 'flex',
					fontSize: 20,
					flexDirection: 'column',
					gap: 0,
					marginRight: '10%',
				}}>
				{items.map((item) => item)}
			</motion.div>
		</Font>
	);
}

function Section({ title, content }: SectionProps) {
	return (
		<div>
			<div style={{ color: 'white', paddingBottom: 4, fontWeight: 700 }}>{title}</div>
			<div style={{ color: '#EEE', paddingBottom: 24, fontWeight: 200, fontSize: 18 }}>{content}</div>
		</div>
	);
}

function ListSection({ title, content }: ListSectionProps) {
	return (
		<div>
			<div style={{ color: '#CECECE', paddingBottom: 4 }}>{title}</div>
			<div style={{ color: 'white', paddingBottom: 24 }}>
				{content.map((item) => (
					<div>{item}</div>
				))}
			</div>
		</div>
	);
}

function Header({ title }: { title: string }) {
	return (
		<div>
			<div style={{ color: '#fff', paddingBottom: 20, paddingTop: 16, fontSize: 28, fontWeight: 700 }}>
				{title}
			</div>
		</div>
	);
}
