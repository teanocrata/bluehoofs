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
	render() {
		const { service } = this.props;

		return (
			<Card interactive onClick={service.setCharacteristics}>
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
