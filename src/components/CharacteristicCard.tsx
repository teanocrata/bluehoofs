import React from 'react';

import { Button, Card, Switch } from '@blueprintjs/core';

import { observer } from 'mobx-react';
import { HoofBluetoothCharacteristic } from '../devices/HoofBluetoothCharacteristic';

interface Props {
	characteristic: HoofBluetoothCharacteristic;
}

@observer
export default class CharacteristicCard extends React.Component<Props> {
	render() {
		const { characteristic } = this.props;

		return (
			<Card>
				<header>{characteristic.name}</header>
				<section>
					<Switch
						readOnly
						label="broadcast"
						checked={characteristic.properties.broadcast}
					/>
					<Switch
						readOnly
						label="read"
						checked={characteristic.properties.read}
					/>
					<Switch
						readOnly
						label="writeWithoutResponse"
						checked={characteristic.properties.writeWithoutResponse}
					/>
					<Switch
						readOnly
						label="write"
						checked={characteristic.properties.write}
					/>
					<Switch
						readOnly
						label="notify"
						checked={characteristic.properties.notify}
					/>
					<Switch
						readOnly
						label="indicate"
						checked={characteristic.properties.indicate}
					/>
					<Switch
						readOnly
						label="authenticatedSignedWrites"
						checked={characteristic.properties.authenticatedSignedWrites}
					/>
					<Switch
						readOnly
						label="reliableWrite"
						checked={characteristic.properties.reliableWrite}
					/>
					<Switch
						readOnly
						label="writableAuxiliaries"
						checked={characteristic.properties.writableAuxiliaries}
					/>
				</section>
				<footer>
					<Button onClick={() => console.log(characteristic)} text="Log" />
				</footer>
			</Card>
		);
	}
}
