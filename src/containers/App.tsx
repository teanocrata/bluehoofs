import React from 'react';

import { Helmet, HelmetProvider } from 'react-helmet-async';

import { Configuration } from '../components/Configuration';

import './App.css';
import css from './App.module.css';

import { Chip, ChipOnInteractionEventT } from '@rmwc/chip';
import { ThemeProvider } from '@rmwc/theme';
import { SimpleTopAppBar, TopAppBarFixedAdjust } from '@rmwc/top-app-bar';
import { SnackbarQueue } from '@rmwc/snackbar';
import { observer } from 'mobx-react-lite';
import { Drawer, DrawerContent } from '@rmwc/drawer';
import { List, ListItem, ListItemGraphic, ListItemText } from '@rmwc/list';
import { Avatar } from '@rmwc/avatar';
import { useStore } from '../store';
import {Console} from '../components/Console';

export const App = observer(() => {
	const { uiStore, userStore } = useStore();

	const setSection = (event: React.MouseEvent<HTMLElement>) => {
		uiStore.setSection((event.target as Element).id as typeof uiStore.section);
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
								<Avatar
									src={
										userStore.user
											? (userStore.user.picture as string)
											: undefined
									}
								/>
							),
							onClick: userStore.login,
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
				<Console />
				<SnackbarQueue messages={uiStore.messages} />
			</ThemeProvider>
		</HelmetProvider>
	);
});
