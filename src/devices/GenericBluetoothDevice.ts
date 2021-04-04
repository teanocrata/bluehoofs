import { HoofBluetoothDevice } from './HoofBluetoothDevice';

export class GenericBluetoothDevice extends HoofBluetoothDevice {
	static get memberUUID() {
		return null;
	}

	static get optionalServices() {
		return [];
	}
}
