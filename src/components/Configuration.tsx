import React from 'react';

import { observer } from 'mobx-react-lite';

import { DeviceCard } from './DeviceCard';

import css from './Configuration.module.css';
import { Fab } from '@rmwc/fab';
import { useStore } from '../store';

export const Configuration = observer(() => {
	const { deviceStore } = useStore();

	return (
		<div className={css.configuration}>
			{!deviceStore.isBluetoothAvailable && <h1>No bluetooth available</h1>}
			<div className={css.devices}>
				{deviceStore.devices.map(device => (
					<DeviceCard key={device.id} device={device} />
				))}
			</div>
			<Fab icon="add" onClick={deviceStore.addDevice} />
		</div>
	);
});
