import { HoofBluetoothDevice } from './HoofBluetoothDevice';

import ITAG_GATT_PROFILE from './iTagProfile.json';
export class iTagBluetoothDevice extends HoofBluetoothDevice {
	static get memberUUID() {
		return 0xffe0;
	}

	static get optionalServices() {
		return Object.keys(ITAG_GATT_PROFILE);
	}
}
