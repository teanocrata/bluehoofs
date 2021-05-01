import React from 'react';

import { Helmet, HelmetProvider } from 'react-helmet-async';

import { Configuration } from '../components/Configuration';

import './App.css';
import css from './App.module.css';

import { Chip, ChipOnInteractionEventT } from '@rmwc/chip';
import { ThemeProvider } from '@rmwc/theme';
import { SimpleTopAppBar, TopAppBarFixedAdjust } from '@rmwc/top-app-bar';
import { SnackbarQueue } from '@rmwc/snackbar';
import { messages, notify } from '../notificationsQueue';
import { action, observable, runInAction, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Drawer, DrawerContent } from '@rmwc/drawer';
import { List, ListItem, ListItemGraphic, ListItemText } from '@rmwc/list';
import { Avatar } from '@rmwc/avatar';
import { MiBluetoothDevice } from '../devices/MiBluetoothDevice';
import { iTagBluetoothDevice } from '../devices/iTagBluetoothDevice';

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

type Section = 'settings' | 'main';

declare var google: {
	accounts: {
		id: {
			initialize: (config: any) => void;
			prompt: (callback: (notification: any) => void) => void;
			revoke: (email: string, callback: (done: any) => void) => void;
		};
	};
};

export const App = observer(
	class App extends React.Component<{}> {
		theme: 'dark' | 'baseline' = 'baseline';
		toggleMode = () =>
			(this.theme = this.theme === 'dark' ? 'baseline' : 'dark');

		isMenuOpen: boolean = false;
		openMenu = () => (this.isMenuOpen = true);
		closeMenu = () => (this.isMenuOpen = false);

		section: Section = 'settings';
		setSection = (section: Section) => (this.section = section);

		user: { [key: string]: string | boolean | number } | null = null;

		devices: Map<string, MiBluetoothDevice | iTagBluetoothDevice> = new Map();

		login = () => {
			if (!this.user) {
				google.accounts.id.initialize({
					client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
					context: 'use',
					nonce: '',
					auto_select: 'true',
					callback: (response: any) =>
						runInAction(() => {
							this.user = parseJwt(response.credential);
						}),
				});
				google.accounts.id.prompt(notification => {
					if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
						notify({
							body: 'Oooops, something went wrong...',
							icon: 'warning',
						});
					}
				});
			} else {
				google.accounts.id.revoke(this.user.email as string, _done => {
					notify({
						body: 'Revoked',
					});
					runInAction(() => {
						this.user = null;
					});
				});
			}
		};

		openTag = (_e: ChipOnInteractionEventT) =>
			window.open(
				`https://github.com/teanocrata/bluehoofs/releases/tag/v${process.env.REACT_APP_VERSION}`
			);

		constructor(props: {}) {
			super(props);
			makeObservable(this, {
				theme: observable,
				toggleMode: action,
				isMenuOpen: observable,
				openMenu: action,
				closeMenu: action,
				section: observable,
				setSection: action,
				user: observable,
				devices: observable,
			});
		}

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
							navigationIcon
							onNav={this.openMenu}
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
								{
									icon: 'account_circle',
									onIcon: (
										<Avatar
											src={
												this.user ? (this.user.picture as string) : undefined
											}
										/>
									),
									onClick: this.login,
								},
							]}
						/>
						<TopAppBarFixedAdjust />
						<Drawer modal open={this.isMenuOpen} onClose={this.closeMenu}>
							<DrawerContent>
								<List>
									<ListItem
										activated={this.section === 'main'}
										onClick={() => this.setSection('main')}
									>
										<ListItemGraphic />
										<ListItemText>Main</ListItemText>
									</ListItem>
									<ListItem
										activated={this.section === 'settings'}
										onClick={() => this.setSection('settings')}
									>
										<ListItemGraphic icon="settings" />
										<ListItemText>Settings</ListItemText>
									</ListItem>
								</List>
							</DrawerContent>
						</Drawer>
						{this.section === 'settings' && (
							<Configuration devices={this.devices} />
						)}
						<SnackbarQueue messages={messages} />
					</ThemeProvider>
				</HelmetProvider>
			);
		}
	}
);

function parseJwt(token: string) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(
		atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);

	return JSON.parse(jsonPayload);
}
