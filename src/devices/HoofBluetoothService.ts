import { observable, runInAction, makeObservable } from 'mobx';
import { HoofBluetoothCharacteristic } from './HoofBluetoothCharacteristic';

export class HoofBluetoothService {
	private _service: BluetoothRemoteGATTService;
	name: string;
	uuid: BluetoothRemoteGATTService['uuid'];

	characteristics: Array<HoofBluetoothCharacteristic> | null = null;
	constructor(service: BluetoothRemoteGATTService) {
		makeObservable(this, {
			name: observable,
			characteristics: observable.ref,
		});

		this._service = service;
		this.name = service.uuid;
		this.uuid = service.uuid;
		fetch(
			`https://teanocrata.github.io/ble-assigned-numbers/uuids/0x${service.uuid
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
				console.warn(`Not found info for UUID ${service.uuid}`);
				console.warn(error);
			});
		this.setCharacteristics();
	}

	setCharacteristics = async () => {
		const characteristics = await this._service.getCharacteristics();
		runInAction(
			() =>
				(this.characteristics = characteristics.map(
					characteristic => new HoofBluetoothCharacteristic(characteristic)
				))
		);
	};
}
