import React, { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { MiBluetoothDevice } from '../devices/MiBluetoothDevice';
import { ServiceCard } from './ServiceCard';
import {
	Card,
	CardActionIcon,
	CardActionIcons,
	CardActions,
	CardPrimaryAction,
} from '@rmwc/card';

import { Typography } from '@rmwc/typography';

import css from './DeviceCard.module.css';
interface Props {
	device: MiBluetoothDevice;
	onRemove: (device: MiBluetoothDevice) => void;
}

export const DeviceCard = observer(({ device, onRemove }: Props) => {
	const [connecting, setConnecting] = useState(false);

	const toggleConnecting = () => setConnecting(!connecting);

	const handleToggleConnect = () => {
		if (device.gatt) {
			device.disconnect();
		} else {
			toggleConnecting();
			device.connect().then(toggleConnecting);
		}
	};

	const handleRemove = () => onRemove(device);

	return (
		<Card>
			<CardPrimaryAction>
				<div className={css.content}>
					<Typography use="headline6" tag="h2">
						{device.name}
					</Typography>
					{device.primaryServices &&
						device.primaryServices.map(service => (
							<ServiceCard key={service.uuid} service={service} />
						))}
				</div>
			</CardPrimaryAction>
			<CardActions>
				<CardActionIcons>
					<CardActionIcon
						icon="bluetooth"
						onIcon="bluetooth_connected"
						onClick={handleToggleConnect}
					/>
					<CardActionIcon icon="delete" onClick={handleRemove} />
				</CardActionIcons>
			</CardActions>
		</Card>
	);
});
