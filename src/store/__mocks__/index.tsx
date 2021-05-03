import type { TStore } from '..';

export const useStore = (): TStore => ({
	uiStore: {
		...({ store: {} } as any),
		themeOptions: {},
		theme: 'baseline',
		section: 'main',
		closeMainMenu: jest.fn(),
		isMainMenuOpen: false,
		openMainMenu: jest.fn(),
		setSection: jest.fn(),
		toggleTheme: jest.fn(),
		messages: {
			array: [],
			push: jest.fn(),
			empty: jest.fn(),
			remove: jest.fn(),
			on: jest.fn(),
			off: jest.fn(),
		},
		notify: jest.fn(),
	},
	deviceStore: {
		...({ store: {} } as any),
		addDevice: jest.fn(),
		bluetoothLayer: null,
		createDevice: jest.fn(),
		devices: [],
		getDevice: jest.fn(),
		isBluetoothAvailable: false,
		removeDevice: jest.fn(),
		updateDevice: jest.fn(),
	},
	userStore: {
		...({ store: {} } as any),
		login: jest.fn(),
		user: null,
	},
});
