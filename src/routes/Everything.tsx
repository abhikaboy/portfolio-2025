/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect } from 'react';

import topLight from '../assets/lights/Ellipse 3.png';
import botLight from '../assets/lights/Ellipse 4.png';
import Font from 'react-font';
import { motion } from 'motion/react';
import ExperienceBar from '../components/ExperienceBar';
import Markdown from 'react-markdown';

import adonny from '../blog/adonny.md';
import elyssia from '../blog/elyssia.md';
import go from '../blog/go.md';
import nix from '../blog/nix.md';
import sql from '../blog/sql.md';
import linalg from '../blog/linalg.md';
import PageTransition from '../animated/PageTransition';

export default function Everything() {
	const records = [
		{
			data: adonny,
			title: 'AdonisJS Notes',
			description: 'Notes while picking up AdonisJS, an MVC framework for Node.js',
		},
		{
			data: elyssia,
			title: 'Elyssia Notes',
			description: 'Notes while picking up Elyssia, a Bun express alternative',
		},
		{
			data: go,
			title: 'Go Notes',
			description: 'Notes while picking up Go, a highly performance programming language',
		},
		{
			data: nix,
			title: 'Nix Notes',
			description: 'Notes while picking up Nix, a package manager for Linux',
		},
		{
			data: sql,
			title: 'SQL Notes',
			description: 'Notes while picking up SQL, a language for interacting with databases',
		},
		{
			data: linalg,
			title: 'Linear Algebra Notes',
			description: 'Notes while learning Linear Algebra',
		},
	];

	const [document, setDocument] = React.useState('');
	const [selected, setSelected] = React.useState(-1);

	const [showLeft, setShowLeft] = React.useState(true);

	useEffect(() => {
		if (selected === -1) return;
		console.log(selected);
		async function fetchData() {
			console.log(showLeft);
			setDocument(await fetch(records[selected].data).then(async (res) => await res.text()));
			setTimeout(() => setLoading(false), 100);
			setShowLeft(false);
		}
		fetchData();
	}, [selected]);

	const [loading, setLoading] = React.useState(true);

	return (
		<PageTransition>
			<div style={{ color: '#fff', minHeight: '100vh' }}>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}>
					<img
						src={topLight}
						alt='top'
						style={{
							width: '100vw',
							top: '0',
							position: 'absolute',
							filter: 'hue-rotate(-120deg) saturate(100)',
						}}
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}>
					<img
						src={topLight}
						alt='top'
						style={{
							width: '100vw',
							top: '100vh',
							right: '-10vw',
							position: 'absolute',
							transform: 'rotate(90deg)',
							filter: 'hue-rotate(-120deg) saturate(100) blur(100px)',
						}}
					/>
				</motion.div>
				<Font family='Instrument Sans'>
					<div style={{ textAlign: 'center', fontSize: '2rem', marginTop: '12%', fontWeight: 'bold' }}>
						<div style={{ fontSize: '1rem', fontWeight: '400' }}>04.</div>
						Everything I Know
					</div>
					<div style={{ textAlign: 'center', marginTop: '2%', marginBottom: '2%' }}>
						Showing {records.length} Records
					</div>
					<div style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginTop: '1%' }}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '10px',
								marginLeft: '-3%',
								paddingLeft: document ? '6%' : '20%',
								paddingRight: document ? '6%' : '20%',
								flexBasis: document ? '10%' : '100%',
							}}>
							{records.map(({ title, description }, index) => (
								<ExperienceBar
									place={title}
									title={description}
									description={''}
									key={index}
									onClick={() => setSelected(index)}
								/>
							))}
						</div>
						{!loading && (
							<div
								style={{
									width: '100%',
									height: '100%',
									overflow: 'auto',
									flexBasis: '70%',
									backgroundColor: 'rgba(0,0,0,0.1)',
									zIndex: 2,
									border: '1px solid #000',
									padding: '24px',
									marginRight: 32,
									borderRadius: '10px',
									color: '#fff',
								}}>
								<Markdown>{document}</Markdown>
							</div>
						)}
					</div>
				</Font>
				<img
					src={botLight}
					style={{
						width: '100vw',
						position: 'absolute',
						transform: 'translateY(00%)',
						filter: 'hue-rotate(-140deg) saturate(10)',
					}}
				/>
			</div>
		</PageTransition>
	);
}
