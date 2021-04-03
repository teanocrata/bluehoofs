import React from 'react';

import { Button, Card, Switch } from '@blueprintjs/core';

import { observer } from 'mobx-react';
import { HoofBluetoothService } from '../devices/HoofBluetoothService';

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
				{service.characteristics &&
					service.characteristics.map(characteristic => (
						<Card key={characteristic.uuid}>
							<header>{characteristic.uuid}</header>
							<section>
								<Switch
									label="broadcast"
									checked={characteristic.properties.broadcast}
								/>
								<Switch label="read" checked={characteristic.properties.read} />
								<Switch
									label="writeWithoutResponse"
									checked={characteristic.properties.writeWithoutResponse}
								/>
								<Switch
									label="write"
									checked={characteristic.properties.write}
								/>
								<Switch
									label="notify"
									checked={characteristic.properties.notify}
								/>
								<Switch
									label="indicate"
									checked={characteristic.properties.indicate}
								/>
								<Switch
									label="authenticatedSignedWrites"
									checked={characteristic.properties.authenticatedSignedWrites}
								/>
								<Switch
									label="reliableWrite"
									checked={characteristic.properties.reliableWrite}
								/>
								<Switch
									label="writableAuxiliaries"
									checked={characteristic.properties.writableAuxiliaries}
								/>
							</section>
							<footer>
								<Button
									onClick={() => console.log(characteristic)}
									text="Log"
								/>
							</footer>
						</Card>
					))}
			</Card>
		);
	}
}
