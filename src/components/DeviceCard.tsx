import React from 'react';

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
}

export const DeviceCard = observer(({ device }: Props) => (
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
					icon={device.connected ? 'bluetooth_connected' : 'bluetooth'}
					onClick={device.connected ? device.disconnect : device.connect}
					disabled={device.connecting}
				/>
				<CardActionIcon icon="delete" onClick={device.delete} />
			</CardActionIcons>
		</CardActions>
	</Card>
));
