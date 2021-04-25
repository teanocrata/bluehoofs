import React from 'react';

import { observer } from 'mobx-react';
import { HoofBluetoothService } from '../devices/HoofBluetoothService';
import CharacteristicCard from './CharacteristicCard';
import { Card, CardPrimaryAction } from '@rmwc/card';

interface Props {
	service: HoofBluetoothService;
}

@observer
export default class ServiceCard extends React.Component<Props> {
	componentDidMount() {
		this.props.service.setCharacteristics();
	}
	render() {
		const { service } = this.props;

		return (
			<Card style={{ width: '21rem' }}>
				<CardPrimaryAction>
					{service.name}
					{(service.characteristics || []).map(characteristic => (
						<CharacteristicCard
							key={characteristic.uuid}
							characteristic={characteristic}
						/>
					))}
				</CardPrimaryAction>
			</Card>
		);
	}
}
