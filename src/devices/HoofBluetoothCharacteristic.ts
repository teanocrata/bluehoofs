import { observable, runInAction } from 'mobx';

export class HoofBluetoothCharacteristic {
	private _characteristic: BluetoothRemoteGATTCharacteristic;
	@observable name: string;
	uuid: BluetoothRemoteGATTCharacteristic['uuid'];

	properties: BluetoothRemoteGATTCharacteristic['properties'];

	@observable.ref
	characteristics: Array<BluetoothRemoteGATTCharacteristic> | null = null;
	constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
		this._characteristic = characteristic;
		this.name = characteristic.uuid;
		this.uuid = characteristic.uuid;
		this.properties = characteristic.properties;
		fetch(
			`https://teanocrata.github.io/ble-assigned-numbers/uuids/0x${characteristic.uuid
				.slice(4, 8)
				.toUpperCase()}.json`
		)
			.then(response => response.json())
			.then(data =>
				runInAction(() => {
					this.name = data.for;
				})
			)
			.catch(error => {
				console.warn(`Not found info for UUID ${characteristic.uuid}`);
				console.warn(error);
			});
	}
}
