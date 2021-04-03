import React, { ReactElement } from 'react';

import { observer } from 'mobx-react';
import { observable, ObservableMap, runInAction, action } from 'mobx';

import { Button, Icon, NonIdealState } from '@blueprintjs/core';

import DeviceCard from './DeviceCard';
import { MiBluetoothDevice } from './MiBluetoothDevice';

import css from './Configuration.module.css';

@observer
export default class Configuration extends React.Component {
	@observable devices: ObservableMap<
		string,
		MiBluetoothDevice
	> = new ObservableMap();

	@observable bluetoothAvailable: boolean = false;

	addDevice = () => {
		navigator.bluetooth
			.requestDevice({
				filters: [{ services: [MiBluetoothDevice.memberUUID] }],
				optionalServices: MiBluetoothDevice.optionalServices,
			})
			.then(device =>
				runInAction(() => {
					const currentDevice = this.devices.get(device.id);
					if (currentDevice) {
						currentDevice.updateDevice(device);
					} else {
						this.devices.set(device.id, new MiBluetoothDevice(device));
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

	render() {
		const devices: Array<ReactElement> = [];
		this.devices.forEach(device => {
			devices.push(<DeviceCard key={device.id} device={device} />);
		});

		return (
			<div className={css.configuration}>
				<div className={css.devices}>{devices}</div>
				{this.bluetoothAvailable ? (
					<Button
						className={css.addButton}
						fill
						minimal
						onClick={this.addDevice}
					>
						<Icon icon="add" iconSize={100} intent="primary" />
					</Button>
				) : (
					<NonIdealState icon="offline" title="Bluetooth is not available" />
				)}
			</div>
		);
	}
}
