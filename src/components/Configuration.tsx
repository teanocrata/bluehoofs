import React, { ReactElement } from 'react';

import { observer } from 'mobx-react';
import { observable, ObservableMap, runInAction, action } from 'mobx';

import DeviceCard from './DeviceCard';
import { MiBluetoothDevice } from '../devices/MiBluetoothDevice';
import { iTagBluetoothDevice } from '../devices/iTagBluetoothDevice';

import css from './Configuration.module.css';
import { GenericBluetoothDevice } from '../devices/GenericBluetoothDevice';
import { Fab } from '@rmwc/fab';
import '@rmwc/fab/styles';

@observer
export default class Configuration extends React.Component {
	@observable devices: ObservableMap<
		string,
		MiBluetoothDevice | iTagBluetoothDevice
	> = new ObservableMap();

	@observable bluetoothAvailable: boolean = false;

	addDevice = () => {
		navigator.bluetooth
			.requestDevice({
				acceptAllDevices: true,
				optionalServices: [
					...MiBluetoothDevice.optionalServices,
					...iTagBluetoothDevice.optionalServices,
				],
			})
			.then(device =>
				runInAction(() => {
					const currentDevice = this.devices.get(device.id);
					if (currentDevice) {
						currentDevice.setServer(null);
					} else {
						this.devices.set(
							device.id,
							device.name?.startsWith('iTAG')
								? new iTagBluetoothDevice(device)
								: device.name?.startsWith('MI')
								? new MiBluetoothDevice(device)
								: new GenericBluetoothDevice(device)
						);
					}
				})
			)
			.catch(error => {
				console.log(error);
			});
	};

	@action updateBluetoothAvailability = (available: boolean) =>
		(this.bluetoothAvailable = available);

	componentDidMount() {
		if ('bluetooth' in navigator) {
			navigator.bluetooth.getAvailability().then(isBluetoothAvailable => {
				console.log(
					`> Bluetooth is ${isBluetoothAvailable ? 'available' : 'unavailable'}`
				);
				this.updateBluetoothAvailability(isBluetoothAvailable);
			});

			if ('onavailabilitychanged' in navigator.bluetooth) {
				navigator.bluetooth.addEventListener('availabilitychanged', event => {
					console.log(
						`> Bluetooth is ${
							(event as any).value ? 'available' : 'unavailable'
						}`
					);
					this.updateBluetoothAvailability((event as any).value);
				});
			}
		}
	}

	handleRemove = (device: MiBluetoothDevice) => this.devices.delete(device.id);

	render() {
		const devices: Array<ReactElement> = [];
		this.devices.forEach(device => {
			devices.push(
				<DeviceCard
					key={device.id}
					device={device}
					onRemove={this.handleRemove}
				/>
			);
		});

		return (
			<div className={css.configuration}>
				<div className={css.devices}>{devices}</div>
				<Fab icon="add" onClick={this.addDevice} />
			</div>
		);
	}
}
