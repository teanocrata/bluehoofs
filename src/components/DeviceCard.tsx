import React from 'react';

import { Button, Card, IActionProps, Switch } from '@blueprintjs/core';
import { MdBluetooth, MdBluetoothConnected } from 'react-icons/md';

import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { MiBluetoothDevice } from '../devices/MiBluetoothDevice';
import ServiceCard from './ServiceCard';

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

	handleScan = () => {
		this.props.device.scan();
	};

	handleRemove: IActionProps['onClick'] = event =>
		this.props.onRemove(this.props.device);

	render() {
		const { device } = this.props;

		return (
			<Card interactive>
				<Button icon="cross" onClick={this.handleRemove} />
				<h5>{device.name}</h5>
				{device.gatt ? <MdBluetoothConnected /> : <MdBluetooth />}
				<Switch
					disabled={this.connecting}
					checked={device.gatt !== null}
					onChange={this.handleToggleConnect}
				/>
				<Button disabled={!device.gatt} onClick={this.handleScan} text="Scan" />
				{device.primaryServices &&
					device.primaryServices.map(service => (
						<ServiceCard key={service.uuid} service={service} />
					))}
			</Card>
		);
	}
}
