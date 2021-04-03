import React from 'react';

import { Button, Card, Switch } from '@blueprintjs/core';
import { MdBluetooth, MdBluetoothConnected } from 'react-icons/md';

import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { MiBluetoothDevice } from '../devices/MiBluetoothDevice';

interface Props {
	device: MiBluetoothDevice;
}

@observer
export default class DeviceCard extends React.Component<Props> {
	@observable connecting: boolean = false;

	@action toggleConnecting = () => (this.connecting = !this.connecting);

	handleToggleConnect = () => {
		if (this.props.device.gattConnected) {
			this.props.device.disconnect();
		} else {
			this.toggleConnecting();
			this.props.device.connect().then(this.toggleConnecting);
		}
	};

	handleScan = () => {
		this.props.device.scan();
	};

	render() {
		const { device } = this.props;

		return (
			<Card interactive>
				<h5>{device.name}</h5>
				{device.gattConnected ? <MdBluetoothConnected /> : <MdBluetooth />}
				<Switch
					disabled={this.connecting}
					checked={device.gattConnected}
					onChange={this.handleToggleConnect}
				/>
				<Button
					disabled={!device.gattServer}
					onClick={this.handleScan}
					text="Scan"
				/>
				{device.services &&
					device.services.map(service => (
						<Card key={service.uuid} interactive>
							{service.uuid}
						</Card>
					))}
			</Card>
		);
	}
}
