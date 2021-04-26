import React from 'react';

import { observer } from 'mobx-react';
import { observable, action, makeObservable } from 'mobx';
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

export const DeviceCard = observer(
	class DeviceCard extends React.Component<Props> {
		connecting: boolean = false;

		toggleConnecting = () => (this.connecting = !this.connecting);

		handleToggleConnect = () => {
			if (this.props.device.gatt) {
				this.props.device.disconnect();
			} else {
				this.toggleConnecting();
				this.props.device.connect().then(this.toggleConnecting);
			}
		};

		handleRemove = () => this.props.onRemove(this.props.device);

		constructor(props: Props) {
			super(props);

			makeObservable(this, {
				connecting: observable,
				toggleConnecting: action,
			});
		}

		render() {
			const { device } = this.props;

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
								onClick={this.handleToggleConnect}
							/>
							<CardActionIcon icon="delete" onClick={this.handleRemove} />
						</CardActionIcons>
					</CardActions>
				</Card>
			);
		}
	}
);
