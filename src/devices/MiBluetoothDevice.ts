import { Toaster } from '@blueprintjs/core';
import { observable, action } from 'mobx';

import MI_GATT_PROFILE from './MiProfile.json';
export class MiBluetoothDevice {
	static get memberUUID() {
		return 0xfee0;
	}

	static get optionalServices() {
		return Object.keys(MI_GATT_PROFILE);
	}

	_device: BluetoothDevice;
	id: BluetoothDevice['id'];
	name: BluetoothDevice['name'];
	@observable gattConnected: boolean;
	@observable.ref gattServer: BluetoothRemoteGATTServer | null = null;
	@observable.ref services: Array<BluetoothRemoteGATTService> | null = null;
	constructor(device: BluetoothDevice) {
		this._device = device;
		this.id = device.id;
		this.name = device.name;
		this.gattConnected = device.gatt?.connected || false;
		device.addEventListener('gattserverdisconnected', this.onDisconnected);
	}
	@observable info: any | null = null;

	@action updateDevice(device: BluetoothDevice) {
		if (device.id !== this.id) {
			throw new Error(
				`Trying to update device ${this.id} with data from other device ${device.id}`
			);
		}
		this._device = device;
		this.gattConnected = device.gatt?.connected || false;
	}

	@action setServer = (gattServer: BluetoothRemoteGATTServer | null) =>
		(this.gattServer = gattServer);

	@action setInfo = (info: any) => (this.info = info);

	@action setServices = (services: Array<BluetoothRemoteGATTService> | null) =>
		(this.services = services);

	onDisconnected: BluetoothDeviceEventHandlers['ongattserverdisconnected'] = event => {
		Toaster.create().show({
			message: `${(event.target as BluetoothDevice).name} disconected`,
			intent: 'danger',
		});
		this.updateDevice(event.target as BluetoothDevice);
	};

	connect = async () => {
		if (this.gattConnected) {
			console.warn(
				`Trying to connect allready connected gatt server ${this.id}`
			);
			return true;
		}

		try {
			const gattServer = (await this._device.gatt?.connect()) || null;
			this.setServer(gattServer);
			if (gattServer) {
				this.updateDevice(gattServer.device);
				const primaryServices = (await gattServer?.getPrimaryServices()) || [];
				this.setServices(primaryServices);
			}
		} catch (error) {
			this.setServer(null);
			this.setServices(null);
			console.error('Error while trying to connect ', this.name);
			console.error(error);
		}
	};

	scan = async () => {
		if (!this.gattServer) {
			await this.connect();
		}

		const primaryServices = (await this.gattServer?.getPrimaryServices()) || [];
		this.setServices(primaryServices);

		Object.keys(MI_GATT_PROFILE).forEach(
			uuid =>
				!primaryServices.some(primaryService => uuid === primaryService.uuid) &&
				console.warn(
					`${uuid} - ${
						MI_GATT_PROFILE[uuid as keyof typeof MI_GATT_PROFILE]
					} not found in primary services`
				)
		);

		const info = await Promise.all(
			primaryServices.map(async service => {
				try {
					const serviceDefinition =
						MI_GATT_PROFILE[service.uuid as keyof typeof MI_GATT_PROFILE];
					const charactericticUUIDs = new Set(
						serviceDefinition?.characteristics.map(
							characterictic => characterictic.uuid
						)
					);
					const characteristics = await Promise.all(
						((await service?.getCharacteristics()) || []).map(
							async characteristic => {
								let descriptorsInfo: Array<{
									uuid: string;
									type: string;
									value: string | undefined;
									readedValue: string;
									characteristicuuid: string;
									found: boolean;
								}> = [];
								try {
									const descriptors = await characteristic.getDescriptors();
									descriptorsInfo = await Promise.all(
										descriptors.map(async descriptor => ({
											uuid: descriptor.uuid,
											type: 'descriptor',
											value:
												descriptor.value &&
												new TextDecoder().decode(descriptor.value),
											readedValue: new TextDecoder().decode(
												await descriptor.readValue()
											),
											characteristicuuid: descriptor.characteristic.uuid,
											found: charactericticUUIDs.has(descriptor.uuid),
										}))
									);
								} catch (error) {
									console.error(error);
								}

								return {
									uuid: characteristic.uuid,
									type: 'characteristic',
									value:
										characteristic.value &&
										new TextDecoder().decode(characteristic.value),
									readedValue: new TextDecoder().decode(
										await characteristic.readValue()
									),
									descriptorsInfo,
									properties: characteristic.properties,
									serviceuuid: characteristic.service?.uuid,
									found: charactericticUUIDs.has(characteristic.uuid),
								};
							}
						)
					);
					return {
						uuid: service?.uuid,
						characteristics,
						primary: service?.isPrimary,
						device: service?.device,
					};
				} catch (error) {
					console.error(error);
					return {
						uuid: service?.uuid,
						error: { ...error, message: error.message },
					};
				}
			})
		);
		this.setInfo(info);
		return info;
	};

	disconnect = () => {
		this._device.gatt?.disconnect();
	};
}
