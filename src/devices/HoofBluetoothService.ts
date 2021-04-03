import { observable, runInAction } from 'mobx';

export class HoofBluetoothService {
	private _service: BluetoothRemoteGATTService;
	name: string;
	uuid: BluetoothRemoteGATTService['uuid'];

	@observable.ref
	characteristics: Array<BluetoothRemoteGATTCharacteristic> | null = null;
	constructor(service: BluetoothRemoteGATTService) {
		this._service = service;
		this.name = service.uuid;
		this.uuid = service.uuid;
	}

	setCharacteristics = async (event: any) => {
		event.preventDefault();
		const characteristics = await this._service.getCharacteristics();
		runInAction(() => (this.characteristics = characteristics));
	};
}
