import React, { useState } from 'react';

import { Helmet, HelmetProvider } from 'react-helmet-async';

import { Configuration } from '../components/Configuration';

import './App.css';
import css from './App.module.css';

import { Chip, ChipOnInteractionEventT } from '@rmwc/chip';
import { ThemeProvider } from '@rmwc/theme';
import { SimpleTopAppBar, TopAppBarFixedAdjust } from '@rmwc/top-app-bar';
import { SnackbarQueue } from '@rmwc/snackbar';
import { messages, notify } from '../notificationsQueue';
import { observer } from 'mobx-react-lite';
import { Drawer, DrawerContent } from '@rmwc/drawer';
import { List, ListItem, ListItemGraphic, ListItemText } from '@rmwc/list';
import { Avatar } from '@rmwc/avatar';
import { useStore } from '../store';

declare var google: {
	accounts: {
		id: {
			initialize: (config: any) => void;
			prompt: (callback: (notification: any) => void) => void;
			revoke: (email: string, callback: (done: any) => void) => void;
		};
	};
};

export const App = observer(() => {
	const { uiStore } = useStore();

	const setSection = (event: React.MouseEvent<HTMLElement>) => {
		uiStore.setSection((event.target as Element).id as typeof uiStore.section);
	};

	const [user, setUser] = useState(
		null as { [key: string]: string | boolean | number } | null
	);

	const login = () => {
		if (!user) {
			google.accounts.id.initialize({
				client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
				context: 'use',
				nonce: '',
				auto_select: 'true',
				callback: (response: any) => setUser(parseJwt(response.credential)),
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
			google.accounts.id.revoke(user.email as string, _done => {
				notify({
					body: 'Revoked',
				});
				setUser(null);
			});
		}
	};

	const openTag = (_e: ChipOnInteractionEventT) =>
		window.open(
			`https://github.com/teanocrata/bluehoofs/releases/tag/v${process.env.REACT_APP_VERSION}`
		);

	return (
		<HelmetProvider>
			<ThemeProvider className={css.app} options={uiStore.themeOptions}>
				<Helmet>
					<title>Blue hoofs</title>
					<meta name="description" content="Mi band 2 for hoofs friends" />
				</Helmet>
				<SimpleTopAppBar
					fixed
					title="Blue hoofs"
					navigationIcon
					onNav={uiStore.openMainMenu}
					endContent={
						<Chip
							onInteraction={openTag}
							label={process.env.REACT_APP_VERSION}
						/>
					}
					actionItems={[
						{
							icon: 'dark_mode',
							onIcon: 'light_mode',
							onClick: uiStore.toggleTheme,
						},
						{
							icon: 'account_circle',
							onIcon: (
								<Avatar src={user ? (user.picture as string) : undefined} />
							),
							onClick: login,
						},
					]}
				/>
				<TopAppBarFixedAdjust />
				<Drawer
					modal
					open={uiStore.isMainMenuOpen}
					onClose={uiStore.closeMainMenu}
				>
					<DrawerContent>
						<List>
							<ListItem
								id="main"
								activated={uiStore.section === 'main'}
								onClick={setSection}
							>
								<ListItemGraphic />
								<ListItemText>Main</ListItemText>
							</ListItem>
							<ListItem
								id="settings"
								activated={uiStore.section === 'settings'}
								onClick={setSection}
							>
								<ListItemGraphic icon="settings" />
								<ListItemText>Settings</ListItemText>
							</ListItem>
						</List>
					</DrawerContent>
				</Drawer>
				{uiStore.section === 'settings' && <Configuration />}
				<SnackbarQueue messages={messages} />
			</ThemeProvider>
		</HelmetProvider>
	);
});

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
