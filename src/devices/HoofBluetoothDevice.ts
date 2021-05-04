import { observable, makeObservable, action } from 'mobx';
import {TStore} from '../store';
import { HoofBluetoothService } from './HoofBluetoothService';

export abstract class HoofBluetoothDevice {
	_device: BluetoothDevice;
	_deviceStore: TStore['deviceStore'] | null = null;
	id: BluetoothDevice['id'];
	name: BluetoothDevice['name'];

	gatt: BluetoothRemoteGATTServer | null = null;
	primaryServices: Array<HoofBluetoothService> | null = null;
	constructor(deviceStore: TStore['deviceStore'], device: BluetoothDevice) {
		makeObservable(this, {
			gatt: observable.ref,
			primaryServices: observable.ref,
			info: observable,
			setServer: action,
			setInfo: action,
			setPrimaryServices: action,
			delete: action
		});
		this._deviceStore = deviceStore;
		this._device = device;
		this.id = device.id;
		this.name = device.name;
		device.addEventListener('gattserverdisconnected', this.onDisconnected);
	}
	info: any | null = null;

	setServer = (gattServer: BluetoothRemoteGATTServer | null) => {
		this.gatt = gattServer;
		this.setPrimaryServices(null);
	};

	setInfo = (info: any) => (this.info = info);

	setPrimaryServices = (services: Array<BluetoothRemoteGATTService> | null) =>
		(this.primaryServices =
			services?.map(service => new HoofBluetoothService(service)) || null);

	onDisconnected: BluetoothDeviceEventHandlers['ongattserverdisconnected'] = event => {
		this._deviceStore?.notify({
			body: `${(event.target as BluetoothDevice).name} disconected`,
			icon: 'warning',
		});
		this.setServer(null);
	};

	connect = async () => {
		if (this.gatt) {
			this._deviceStore?.notify({
				body: `Trying to connect allready connected gatt server ${this.id}`,
				icon: 'warning'
			});
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
			this._deviceStore?.notify({
				body: `Error while trying to connect ${this.name}`,
				icon: 'error'
			});
			console.error(error);
		}
	};

	disconnect = () => {
		this._device.gatt?.disconnect();
	};

	delete = () => {
		this.disconnect();
		this._deviceStore?.removeDevice(this);
	}
}
