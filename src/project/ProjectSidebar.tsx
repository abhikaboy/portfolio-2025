import React from 'react';
import Font from 'react-font';
import { Section } from './ProjectContent';
import { motion } from 'framer-motion';

type SectionProps = {
	title: string;
	content: string;
};
type ListSectionProps = {
	title: string;
	content: string[];
};

type Props = {
	input: Section[];
};

export default function ProjectSidebar({ input }: Props) {
	return (
		<Font family='Avenir' weight={250}>
			<motion.div
				initial={{ opacity: 0, x: -400 }}
				animate={{ opacity: 1, x: 0, transition: { ease: 'circOut', delay: 0.5 } }}
				exit={{ opacity: 0, x: -400, transition: { duration: 0.5, ease: 'circIn', delay: 0.2 } }}
				transition={{ duration: 0.5 }}
				style={{
					display: 'flex',
					fontSize: 16,
					flexDirection: 'column',
					gap: 0,
				}}>
				{input.map((item) => (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
						}}>
						{item.type === 'Single' ? (
							// @ts-expect-error meow
							<SectionComp title={item.title} content={item.content} />
						) : (
							// @ts-expect-error meow
							<ListSection title={item.title} content={item.content} />
						)}
					</div>
				))}
			</motion.div>
		</Font>
	);
}

function SectionComp({ title, content }: SectionProps) {
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
