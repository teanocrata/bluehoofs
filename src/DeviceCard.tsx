import React from 'react';

import { Card, Switch } from '@blueprintjs/core';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { MiBluetoothDevice } from './MiBluetoothDevice';

interface Props {
	device: MiBluetoothDevice;
	connected?: boolean;
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

	render() {
		const { device, connected } = this.props;

		return (
			<Card interactive={true}>
				<h5>{device.name}</h5>
				<Switch
					disabled={this.connecting}
					checked={connected}
					onChange={this.handleToggleConnect}
				/>
			</Card>
		);
	}
}
