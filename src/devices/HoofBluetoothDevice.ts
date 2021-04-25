import { observable, action } from 'mobx';
import { notify } from '../notificationsQueue';
import { HoofBluetoothService } from './HoofBluetoothService';

export abstract class HoofBluetoothDevice {
	_device: BluetoothDevice;
	id: BluetoothDevice['id'];
	name: BluetoothDevice['name'];

	@observable.ref gatt: BluetoothRemoteGATTServer | null = null;
	@observable.ref
	primaryServices: Array<HoofBluetoothService> | null = null;
	constructor(device: BluetoothDevice) {
		this._device = device;
		this.id = device.id;
		this.name = device.name;
		device.addEventListener('gattserverdisconnected', this.onDisconnected);
	}
	@observable info: any | null = null;

	@action setServer = (gattServer: BluetoothRemoteGATTServer | null) => {
		this.gatt = gattServer;
		this.setPrimaryServices(null);
	};

	@action setInfo = (info: any) => (this.info = info);

	@action setPrimaryServices = (
		services: Array<BluetoothRemoteGATTService> | null
	) =>
		(this.primaryServices =
			services?.map(service => new HoofBluetoothService(service)) || null);

	onDisconnected: BluetoothDeviceEventHandlers['ongattserverdisconnected'] = event => {
		notify({
			body: `${(event.target as BluetoothDevice).name} disconected`,
			icon: 'warning'
		});
		this.setServer(null);
	};

	connect = async () => {
		if (this.gatt) {
			console.warn(
				`Trying to connect allready connected gatt server ${this.id}`
			);
			return true;
		}

		try {
			const gattServer = (await this._device.gatt?.connect()) || null;
			this.setServer(gattServer);
			if (gattServer) {
				const primaryServices = (await gattServer?.getPrimaryServices()) || [];
				this.setPrimaryServices(primaryServices);
			}
		} catch (error) {
			this.setServer(null);
			this.setPrimaryServices(null);
			console.error('Error while trying to connect ', this.name);
			console.error(error);
		}
	};
	
	disconnect = () => {
		this._device.gatt?.disconnect();
	};
}
