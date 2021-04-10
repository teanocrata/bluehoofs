import { action, observable, runInAction } from 'mobx';

export class HoofBluetoothCharacteristic {
	private _characteristic: BluetoothRemoteGATTCharacteristic;
	@observable name: string;
	@observable value?: DataView;
	uuid: BluetoothRemoteGATTCharacteristic['uuid'];
	readValue: BluetoothRemoteGATTCharacteristic['readValue'] = () =>
		this._characteristic.readValue();

	writeValue: BluetoothRemoteGATTCharacteristic['writeValue'] = value =>
		this._characteristic.writeValue(value);

	@action updateCharacteristicValue = (event: Event) => {
		this.value = (event?.target as any).value.getUint8(0);
	};

	properties: BluetoothRemoteGATTCharacteristic['properties'];

	@observable.ref
	characteristics: Array<BluetoothRemoteGATTCharacteristic> | null = null;
	constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
		this._characteristic = characteristic;
		this.name = characteristic.uuid;
		this.uuid = characteristic.uuid;
		this.properties = characteristic.properties;
		if (this.properties.notify) {
			this._characteristic.startNotifications().then(_ => {
				console.log('> Notifications started');
				this._characteristic.addEventListener(
					'characteristicvaluechanged',
					console.log
				);
			});
		}
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
