import { observable, action } from 'mobx';

export class MiBluetoothDevice {
	_device: BluetoothDevice;
	id: BluetoothDevice['id'];
	name: BluetoothDevice['name'];
	@observable gattConnected: boolean;
	constructor(device: BluetoothDevice) {
		this._device = device;
		this.id = device.id;
		this.name = device.name;
		this.gattConnected = device.gatt?.connected || false;
		device.addEventListener('gattserverdisconnected', this.onDisconnected);
	}

	@action updateDevice(device: BluetoothDevice) {
		if (device.id !== this.id) {
			throw new Error(
				`Trying to update device ${this.id} with data from other device ${device.id}`
			);
		}
		this._device = device;
		this.gattConnected = device.gatt?.connected || false;
	}

	onDisconnected = (event: Event) => {
		const device: BluetoothDevice = event.target as any;
		this.updateDevice(device);
	};

	connect = async () => {
		if (this.gattConnected) {
			console.warn(
				`Trying to connect allready connected gatt server ${this.id}`
			);
			return true;
		}
		return this._device.gatt
			?.connect()
			.then(gattServer => {
				console.log(gattServer);
				this.updateDevice(gattServer.device);
				return true;
			})
			.catch(error => {
				console.error('Error while trying to connect ', this.name);
				console.error(error);
				return false;
			});
	};

	disconnect = () => {
		this._device.gatt?.disconnect();
	};
}
