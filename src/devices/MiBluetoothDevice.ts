import { HoofBluetoothDevice } from './HoofBluetoothDevice';

import MI_GATT_PROFILE from './MiProfile.json';
export class MiBluetoothDevice extends HoofBluetoothDevice {
	static get memberUUID() {
		return 0xfee0;
	}

	static get optionalServices() {
		return Object.keys(MI_GATT_PROFILE);
	}
}
