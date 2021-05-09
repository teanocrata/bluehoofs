import React from 'react';

import { observer } from 'mobx-react-lite';
import { HoofBluetoothService } from '../devices/HoofBluetoothService';
import { CharacteristicCard } from './CharacteristicCard';
import { Card, CardPrimaryAction } from '@rmwc/card';

interface Props {
	service: HoofBluetoothService;
}

export const ServiceCard = observer(({ service }: Props) => (
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
));
