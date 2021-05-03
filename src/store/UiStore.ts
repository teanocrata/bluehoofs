import { makeAutoObservable } from 'mobx';
import { createSnackbarQueue } from '@rmwc/snackbar';
import type { TStore } from '.';
import { darkThemeOptions } from './themes';

export class UiStore {
	private store: TStore;
	theme: 'dark' | 'baseline' = 'baseline';
	section: 'settings' | 'main' = 'main';
	isMainMenuOpen: boolean = false;
	messages: ReturnType<typeof createSnackbarQueue>['messages'];
	notify: ReturnType<typeof createSnackbarQueue>['notify'];

	constructor(store: TStore) {
		makeAutoObservable(this);
		this.store = store;
		const { notify, messages } = createSnackbarQueue();
		this.notify = notify;
		this.messages = messages;
	}

	get themeOptions() {
		return this.theme === 'baseline' ? {} : darkThemeOptions;
	}

	toggleTheme = () =>
		(this.theme = this.theme === 'dark' ? 'baseline' : 'dark');

	openMainMenu = () => (this.isMainMenuOpen = true);

	closeMainMenu = () => (this.isMainMenuOpen = false);

	setSection = (section: 'settings' | 'main') => {
		this.section = section;
		this.isMainMenuOpen = false;
	};
}
