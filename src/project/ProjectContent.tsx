import React, { useEffect, useState } from 'react';
import Font from 'react-font';

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
			<div
				style={{
					display: 'flex',
					fontSize: 20,
					flexDirection: 'column',
					gap: 0,
					marginRight: '10%',
				}}>
				{items.map((item) => item)}
			</div>
		</Font>
	);
}

function Section({ title, content }: SectionProps) {
	return (
		<div>
			<div style={{ color: '#CECECE', paddingBottom: 4 }}>{title}</div>
			<div style={{ color: 'white', paddingBottom: 24 }}>{content}</div>
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
			<div style={{ color: '#fff', paddingBottom: 8, paddingTop: 16, fontSize: 28, fontWeight: 700 }}>
				{title}
			</div>
		</div>
	);
}
