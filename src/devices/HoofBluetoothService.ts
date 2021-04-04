import { observable, runInAction } from 'mobx';

export class HoofBluetoothService {
	private _service: BluetoothRemoteGATTService;
	@observable name: string;
	uuid: BluetoothRemoteGATTService['uuid'];

	@observable.ref
	characteristics: Array<BluetoothRemoteGATTCharacteristic> | null = null;
	constructor(service: BluetoothRemoteGATTService) {
		this._service = service;
		this.name = service.uuid;
		this.uuid = service.uuid;
		fetch(
			`https://teanocrata.github.io/ble-assigned-numbers/uuids/0x${service.uuid
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
				console.warn(`Not found info for UUID ${service.uuid}`);
				console.warn(error);
			});
	}

	setCharacteristics = async (event: any) => {
		event.preventDefault();
		const characteristics = await this._service.getCharacteristics();
		runInAction(() => (this.characteristics = characteristics));
	};
}
