import React from 'react';

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Navbar, Tag } from '@blueprintjs/core';

import Configuration from '../components/Configuration';

import styles from './App.module.css';
import './App.css';

function App() {
	const openTag = (_e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
		window.open(
			`https://github.com/teanocrata/bluehoofs/releases/tag/v${process.env.REACT_APP_VERSION}`
		);

	return (
		<HelmetProvider>
			<Helmet>
				<title>Blue hoofs</title>
				<meta name="description" content="Mi band 2 for hoofs friends" />
			</Helmet>
			<Configuration />
			<Navbar fixedToTop className={styles.toBottom}>
				<Navbar.Group align="center" className={styles.center}>
					<Navbar.Heading>
						Blue hoofs{' '}
						<Tag interactive onClick={openTag}>
							{process.env.REACT_APP_VERSION}
						</Tag>
					</Navbar.Heading>
				</Navbar.Group>
			</Navbar>
		</HelmetProvider>
	);
}

export default App;
