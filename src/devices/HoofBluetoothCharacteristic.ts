import {
	action,
	computed,
	observable,
	runInAction,
	makeObservable,
} from 'mobx';

export class HoofBluetoothCharacteristic {
	private _characteristic: BluetoothRemoteGATTCharacteristic;
	name: string;
	value?: DataView;
	uuid: BluetoothRemoteGATTCharacteristic['uuid'];
	readValue: BluetoothRemoteGATTCharacteristic['readValue'] = () =>
		this._characteristic.readValue();

	writeValueWithoutResponse: BluetoothRemoteGATTCharacteristic['writeValueWithoutResponse'] = value =>
		this._characteristic.writeValueWithoutResponse(value);

	updateCharacteristicValue = (event: Event) => {
		this.value = (event?.target as any).value.getUint8(0);
	};

	properties: BluetoothRemoteGATTCharacteristic['properties'];

	characteristics: Array<BluetoothRemoteGATTCharacteristic> | null = null;
	constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
		makeObservable(this, {
			name: observable,
			value: observable,
			updateCharacteristicValue: action,
			characteristics: observable.ref,
			alertLevels: computed,
		});

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

	get alertLevels() {
		if (this.name === 'Alert Level') {
			return [
				{
					value: 0x00,
					label: 'No Alert',
				},
				{
					value: 0x01,
					label: 'Mild Alert',
				},
				{
					value: 0x02,
					label: 'High Alert',
				},
			];
		}
		return [];
	}

	startNotifications = () => {
		console.log(this._characteristic)
		this._characteristic.addEventListener('characteristicvaluechanged',
				handleNotifications);
		this._characteristic.startNotifications().then(_ => {
			console.log('> Notifications started');
			this._characteristic.addEventListener('characteristicvaluechanged',
				handleNotifications);
		});
	}
}

function handleNotifications(event: any) {
	let value = event.target.value;
	let a = [];
	// Convert raw data bytes to hex values just for the sake of showing something.
	// In the "real" world, you'd use data.getUint8, data.getUint16 or even
	// TextDecoder to process raw data bytes.
	for (let i = 0; i < value.byteLength; i++) {
	  a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
	}
	console.log('> ' + a.join(' '));
  }
