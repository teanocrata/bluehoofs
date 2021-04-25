import React from 'react';

import { Helmet, HelmetProvider } from 'react-helmet-async';

import Configuration from '../components/Configuration';

import './App.css';
import css from './App.module.css';

import { Chip, ChipOnInteractionEventT } from '@rmwc/chip';
import { ThemeProvider } from '@rmwc/theme';
import { SimpleTopAppBar, TopAppBarFixedAdjust } from '@rmwc/top-app-bar';
import { SnackbarQueue } from '@rmwc/snackbar';
import { messages } from '../notificationsQueue';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

const darkThemeOptions = {
	primary: '#24aee9',
	secondary: '#e539ff',
	error: '#b00020',
	background: '#212121',
	surface: '#37474F',
	onPrimary: 'rgba(255,255,255,.87)',
	onSecondary: 'rgba(0,0,0,0.87)',
	onSurface: 'rgba(255,255,255,.87)',
	onError: '#fff',
	textPrimaryOnBackground: 'rgba(255, 255, 255, 1)',
	textSecondaryOnBackground: 'rgba(255, 255, 255, 0.7)',
	textHintOnBackground: 'rgba(255, 255, 255, 0.5)',
	textDisabledOnBackground: 'rgba(255, 255, 255, 0.5)',
	textIconOnBackground: 'rgba(255, 255, 255, 0.5)',
	textPrimaryOnLight: 'rgba(0, 0, 0, 0.87)',
	textSecondaryOnLight: 'rgba(0, 0, 0, 0.54)',
	textHintOnLight: 'rgba(0, 0, 0, 0.38)',
	textDisabledOnLight: 'rgba(0, 0, 0, 0.38)',
	textIconOnLight: 'rgba(0, 0, 0, 0.38)',
	textPrimaryOnDark: 'white',
	textSecondaryOnDark: 'rgba(255, 255, 255, 0.7)',
	textHintOnDark: 'rgba(255, 255, 255, 0.5)',
	textDisabledOnDark: 'rgba(255, 255, 255, 0.5)',
	textIconOnDark: 'rgba(255, 255, 255, 0.5)',
};

@observer
export default class App extends React.Component {
	@observable theme: 'dark' | 'baseline' = 'baseline';
	@action toggleMode = () =>
		(this.theme = this.theme === 'dark' ? 'baseline' : 'dark');
	openTag = (_e: ChipOnInteractionEventT) =>
		window.open(
			`https://github.com/teanocrata/bluehoofs/releases/tag/v${process.env.REACT_APP_VERSION}`
		);

	render() {
		return (
			<HelmetProvider>
				<ThemeProvider
					className={css.app}
					options={this.theme === 'baseline' ? {} : darkThemeOptions}
				>
					<Helmet>
						<title>Blue hoofs</title>
						<meta name="description" content="Mi band 2 for hoofs friends" />
					</Helmet>
					<SimpleTopAppBar
						fixed
						title="Blue hoofs"
						endContent={
							<Chip
								onInteraction={this.openTag}
								label={process.env.REACT_APP_VERSION}
							/>
						}
						actionItems={[
							{
								icon: 'dark_mode',
								onIcon: 'light_mode',
								onClick: this.toggleMode,
							},
						]}
					/>
					<TopAppBarFixedAdjust />
					<Configuration />
					<SnackbarQueue messages={messages} />
				</ThemeProvider>
			</HelmetProvider>
		);
	}
}
