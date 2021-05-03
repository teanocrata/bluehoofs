import React from 'react';
import { useLocalObservable } from 'mobx-react-lite';

import { DeviceStore } from './DeviceStore';
import { UiStore } from './UiStore';
import { UserStore } from './UserStore';

class RootStore {
	deviceStore: DeviceStore;
	uiStore: UiStore;
	userStore: UserStore;

	constructor() {
		this.deviceStore = new DeviceStore(this);
		this.uiStore = new UiStore(this);
		this.userStore = new UserStore(this);
	}
}

const createStore = () => new RootStore();

export type TStore = ReturnType<typeof createStore>;

const storeContext = React.createContext<TStore | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactChild }) => {
	const store = useLocalObservable(createStore);
	(window as any).store = store;
	return (
		<storeContext.Provider value={store}>{children}</storeContext.Provider>
	);
};

export const useStore = () => {
	const store = React.useContext(storeContext);
	if (!store) {
		throw new Error('useStore must be used within a StoreProvider.');
	}
	return store;
};
