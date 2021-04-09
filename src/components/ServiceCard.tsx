import React from 'react';

import { Card } from '@blueprintjs/core';

import { observer } from 'mobx-react';
import { HoofBluetoothService } from '../devices/HoofBluetoothService';
import CharacteristicCard from './CharacteristicCard';

interface Props {
	service: HoofBluetoothService;
}

@observer
export default class ServiceCard extends React.Component<Props> {
	handleGetCharacteristics = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		event.preventDefault();
		if (!this.props.service.characteristics) {
			this.props.service.setCharacteristics();
		}
	};
	render() {
		const { service } = this.props;

		return (
			<Card
				interactive={!service.characteristics}
				onClick={this.handleGetCharacteristics}
			>
				{service.name}
				{(service.characteristics || []).map(characteristic => (
					<CharacteristicCard
						key={characteristic.uuid}
						characteristic={characteristic}
					/>
				))}
			</Card>
		);
	}
}
