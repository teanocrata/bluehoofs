import { makeAutoObservable } from 'mobx';
import type { TStore } from '.';

declare var google: {
	accounts: {
		id: {
			initialize: (config: any) => void;
			prompt: (callback: (notification: any) => void) => void;
			revoke: (email: string, callback: (done: any) => void) => void;
		};
	};
};

export class UserStore {
	private store: TStore;
	user: { [key: string]: string | boolean | number } | null = null;

	constructor(store: TStore) {
		makeAutoObservable(this);
		this.store = store;
	}

	login = () => {
		if (!this.user) {
			google.accounts.id.initialize({
				client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
				context: 'use',
				nonce: '',
				auto_select: 'true',
				callback: (response: any) => this.user = parseJwt(response.credential),
			});
			google.accounts.id.prompt(notification => {
				if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
					this.store.uiStore.notify({
						body: 'Oooops, something went wrong...',
						icon: 'warning',
					});
				}
			});
		} else {
			google.accounts.id.revoke(this.user.email as string, _done => {
				this.store.uiStore.notify({
					body: 'Revoked',
				});
				this.user = null;
			});
		}
	};
}

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
