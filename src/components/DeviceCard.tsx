import React from 'react';

import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { MiBluetoothDevice } from '../devices/MiBluetoothDevice';
import ServiceCard from './ServiceCard';
import {
	Card,
	CardActionIcon,
	CardActionIcons,
	CardActions,
	CardPrimaryAction,
} from '@rmwc/card';

import '@rmwc/typography/styles';
import { Typography } from '@rmwc/typography';
interface Props {
	device: MiBluetoothDevice;
	onRemove: (device: MiBluetoothDevice) => void;
}

@observer
export default class DeviceCard extends React.Component<Props> {
	@observable connecting: boolean = false;

	@action toggleConnecting = () => (this.connecting = !this.connecting);

	handleToggleConnect = () => {
		if (this.props.device.gatt) {
			this.props.device.disconnect();
		} else {
			this.toggleConnecting();
			this.props.device.connect().then(this.toggleConnecting);
		}
	};

	handleRemove = () => this.props.onRemove(this.props.device);

	render() {
		const { device } = this.props;

		return (
			<Card>
				<CardPrimaryAction>
					<Typography use="headline6" tag="h2">
						{device.name}
					</Typography>
					{device.primaryServices &&
						device.primaryServices.map(service => (
							<ServiceCard key={service.uuid} service={service} />
						))}
				</CardPrimaryAction>
				<CardActions>
					<CardActionIcons>
						<CardActionIcon
							icon="bluetooth"
							onIcon="bluetooth_connected"
							onClick={this.handleToggleConnect}
						/>
						<CardActionIcon icon="delete" onClick={this.handleRemove} />
					</CardActionIcons>
				</CardActions>
			</Card>
		);
	}
}
