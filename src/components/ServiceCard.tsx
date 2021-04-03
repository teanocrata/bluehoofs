import React from 'react';

import { Card } from '@blueprintjs/core';

import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

interface Props {
	service: BluetoothRemoteGATTService;
}

@observer
export default class ServiceCard extends React.Component<Props> {
	@observable connecting: boolean = false;

	@action toggleConnecting = () => (this.connecting = !this.connecting);

	handleToggleConnect = () => {};

	handleScan = () => {};

	render() {
		const { service } = this.props;

		return (
			<Card key={service.uuid} interactive>
				{service.uuid}
			</Card>
		);
	}
}
