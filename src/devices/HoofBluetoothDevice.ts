import { observable, makeObservable, action, computed } from 'mobx';
import {TStore} from '../store';
import { HoofBluetoothService } from './HoofBluetoothService';

export abstract class HoofBluetoothDevice {
	_device: BluetoothDevice;
	_deviceStore: TStore['deviceStore'] | null = null;
	id: BluetoothDevice['id'];
	name: BluetoothDevice['name'];

	connecting: boolean = false;
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
			delete: action,
			connecting: observable,
			toggleConnecting: action,
			connected: computed
		});
		this._deviceStore = deviceStore;
		this._device = device;
		this.id = device.id;
		this.name = device.name;
		device.addEventListener('gattserverdisconnected', this.onDisconnected);
		this.connect();
	}
	info: any | null = null;

	get connected() {
		return this.gatt !== null;
	}

	toggleConnecting = () => this.connecting = !this.connecting;

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
		this.toggleConnecting();
		if (this.gatt) {
			this._deviceStore?.notify({
				body: `Trying to connect allready connected gatt server ${this.id}`,
				icon: 'warning'
			});
			this.toggleConnecting();
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
		} finally {
			this.toggleConnecting();
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
