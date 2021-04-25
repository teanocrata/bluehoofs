import React from 'react';

import { Helmet, HelmetProvider } from 'react-helmet-async';

import Configuration from '../components/Configuration';

import './App.css';

import { Chip, ChipOnInteractionEventT } from '@rmwc/chip';
import { SimpleTopAppBar, TopAppBarFixedAdjust } from '@rmwc/top-app-bar';
import { SnackbarQueue } from '@rmwc/snackbar';
import { messages } from '../notificationsQueue';

function App() {
	const openTag = (_e: ChipOnInteractionEventT) =>
		window.open(
			`https://github.com/teanocrata/bluehoofs/releases/tag/v${process.env.REACT_APP_VERSION}`
		);

	return (
		<HelmetProvider>
			<Helmet>
				<title>Blue hoofs</title>
				<meta name="description" content="Mi band 2 for hoofs friends" />
			</Helmet>
			<SimpleTopAppBar
				title="Blue hoofs"
				endContent={
					<Chip onInteraction={openTag} label={process.env.REACT_APP_VERSION} />
				}
			/>
			<TopAppBarFixedAdjust />
			<Configuration />
			<SnackbarQueue messages={messages} />
		</HelmetProvider>
	);
}

export default App;
