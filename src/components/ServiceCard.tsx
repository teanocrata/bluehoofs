import React from 'react';

import { Card } from '@blueprintjs/core';

import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { HoofBluetoothService } from '../devices/HoofBluetoothService';

interface Props {
	service: HoofBluetoothService;
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
			<Card key={service.name} interactive onClick={service.setCharacteristics}>
				{service.name}
				{service.characteristics &&
					service.characteristics.map(characteristic => (
						<Card>{characteristic.uuid}</Card>
					))}
			</Card>
		);
	}
}
