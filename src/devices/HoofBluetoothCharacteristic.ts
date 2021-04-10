import { action, computed, observable, runInAction } from 'mobx';

export class HoofBluetoothCharacteristic {
	private _characteristic: BluetoothRemoteGATTCharacteristic;
	@observable name: string;
	@observable value?: DataView;
	uuid: BluetoothRemoteGATTCharacteristic['uuid'];
	readValue: BluetoothRemoteGATTCharacteristic['readValue'] = () =>
		this._characteristic.readValue();

	writeValueWithoutResponse: BluetoothRemoteGATTCharacteristic['writeValueWithoutResponse'] = value =>
		this._characteristic.writeValueWithoutResponse(value);

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
		fetch(
			`https://teanocrata.github.io/ble-assigned-numbers/uuids/0x${characteristic.uuid
				.slice(4, 8)
				.toUpperCase()}.json`
		)
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				const contentType = response.headers.get('content-type');
				if (!contentType || !contentType.includes('application/json')) {
					throw new TypeError("Oops, we haven't got JSON!");
				}
				return response.json();
			})
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

	@computed get alertLevels () {
		if (this.name === 'Alert Level') {
			return [{
				value: 0x00,
				label: 'No Alert'
			},
			{
				value: 0x01,
				label: 'Mild Alert'
			},
			{
				value: 0x02,
				label: 'High Alert'
			}]
		}
		return []
	}
}