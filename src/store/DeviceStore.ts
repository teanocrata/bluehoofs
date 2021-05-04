import {SnackbarQueueMessage} from '@rmwc/snackbar';
import { makeAutoObservable } from 'mobx';
import type { TStore } from '.';
import { GenericBluetoothDevice } from '../devices/GenericBluetoothDevice';
import { iTagBluetoothDevice } from '../devices/iTagBluetoothDevice';
import { MiBluetoothDevice } from '../devices/MiBluetoothDevice';

export class DeviceStore {
	private store: TStore;
	private bluetoothLayer: Bluetooth | null = null;
	devices: Array<MiBluetoothDevice | iTagBluetoothDevice> = [];
	constructor(store: TStore) {
		makeAutoObservable(this);
		this.store = store;
		if ('bluetooth' in navigator) {
			navigator.bluetooth.getAvailability().then(isBluetoothAvailable => {
				console.log(
					`> Bluetooth is ${isBluetoothAvailable ? 'available' : 'unavailable'}`
				);
				this.bluetoothLayer = navigator.bluetooth;
			});

			if ('onavailabilitychanged' in navigator.bluetooth) {
				console.log('add availabilitychanged event handler');
				navigator.bluetooth.addEventListener('availabilitychanged', event => {
					console.log(
						`> Bluetooth is ${
							(event as any).value ? 'available' : 'unavailable'
						}`
					);
					if ((event as any).value) {
						this.bluetoothLayer = navigator.bluetooth;
					} else {
						this.bluetoothLayer = null;
					}
				});
			}
		}
	}

	getDevice = (deviceId: string) => {
		return this.devices.find(device => device.id === deviceId);
	};

	get isBluetoothAvailable() {
		return this.bluetoothLayer !== null;
	}

	removeDevice = (device: MiBluetoothDevice | iTagBluetoothDevice) => {
		this.devices.splice(this.devices.indexOf(device), 1);
		// TODO: device.dispose();
	};

	addDevice = () => {
		if (!this.bluetoothLayer) {
			throw new Error("Can't use bluetooth");
		}
		this.bluetoothLayer
			.requestDevice({
				acceptAllDevices: true,
				optionalServices: [
					...MiBluetoothDevice.optionalServices,
					...iTagBluetoothDevice.optionalServices,
				],
			})
			.then(this.updateDevice)
			.catch(error => {
				console.log(error);
			});
	};

	updateDevice = (device: BluetoothDevice) => {
		const currentDevice = this.getDevice(device.id);
		if (currentDevice) {
			currentDevice.setServer(null);
		} else {
			this.createDevice(device);
		}
	};

	createDevice = (bluethoothDevice: BluetoothDevice) => {
		const device = bluethoothDevice.name?.startsWith('iTAG')
			? new iTagBluetoothDevice(this, bluethoothDevice)
			: bluethoothDevice.name?.startsWith('MI')
			? new MiBluetoothDevice(this, bluethoothDevice)
			: new GenericBluetoothDevice(this, bluethoothDevice);
		this.devices.push(device);
		return device;
	};

	notify = (message: SnackbarQueueMessage) => this.store.uiStore.notify(message); 
}
