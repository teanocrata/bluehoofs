import React, { useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';

import { DeviceCard } from './DeviceCard';
import { MiBluetoothDevice } from '../devices/MiBluetoothDevice';
import { iTagBluetoothDevice } from '../devices/iTagBluetoothDevice';

import css from './Configuration.module.css';
import { GenericBluetoothDevice } from '../devices/GenericBluetoothDevice';
import { Fab } from '@rmwc/fab';

interface Props {
	devices: Map<string, MiBluetoothDevice | iTagBluetoothDevice>;
}

export const Configuration = observer(({ devices }: Props) => {
	const [bluetoothAvailable, setBluetoothAvailable] = useState(false);

	useEffect(() => {
		if ('bluetooth' in navigator) {
			navigator.bluetooth.getAvailability().then(isBluetoothAvailable => {
				console.log(
					`> Bluetooth is ${isBluetoothAvailable ? 'available' : 'unavailable'}`
				);
				updateBluetoothAvailability(isBluetoothAvailable);
			});

			if ('onavailabilitychanged' in navigator.bluetooth) {
				navigator.bluetooth.addEventListener('availabilitychanged', event => {
					console.log(
						`> Bluetooth is ${
							(event as any).value ? 'available' : 'unavailable'
						}`
					);
					updateBluetoothAvailability((event as any).value);
				});
			}
		}
	});
	const addDevice = () => {
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
					const currentDevice = devices.get(device.id);
					if (currentDevice) {
						currentDevice.setServer(null);
					} else {
						devices.set(
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

	const updateBluetoothAvailability = (available: boolean) =>
		setBluetoothAvailable(available);

	const handleRemove = (device: MiBluetoothDevice) => devices.delete(device.id);

	return (
		<div className={css.configuration}>
			{!bluetoothAvailable && <h1>No bluetooth available</h1>}
			<div className={css.devices}>
				{[...devices.values()].map(device => (
					<DeviceCard key={device.id} device={device} onRemove={handleRemove} />
				))}
			</div>
			<Fab icon="add" onClick={addDevice} />
		</div>
	);
});
