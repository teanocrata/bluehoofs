import { Toaster } from '@blueprintjs/core';
import { observable, action } from 'mobx';

export abstract class HoofBluetoothDevice {
	_device: BluetoothDevice;
	id: BluetoothDevice['id'];
	name: BluetoothDevice['name'];

	@observable.ref gatt: BluetoothRemoteGATTServer | null = null;
	@observable.ref
	primaryServices: Array<BluetoothRemoteGATTService> | null = null;
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
	) => (this.primaryServices = services);

	onDisconnected: BluetoothDeviceEventHandlers['ongattserverdisconnected'] = event => {
		Toaster.create().show({
			message: `${(event.target as BluetoothDevice).name} disconected`,
			intent: 'danger',
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

	scan = async () => {
		if (!this.primaryServices) {
			await this.connect();
		}

		const info = await Promise.all(
			this.primaryServices!.map(async service => {
				try {
					const characteristics = await Promise.all(
						((await service?.getCharacteristics()) || []).map(
							async characteristic => {
								let descriptorsInfo: Array<{
									uuid: string;
									type: string;
									value: string | undefined;
									readedValue: string;
									characteristicuuid: string;
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
