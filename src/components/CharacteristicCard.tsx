import React from 'react';

import { Button, Card, Checkbox } from '@blueprintjs/core';

import { observer } from 'mobx-react';
import { HoofBluetoothCharacteristic } from '../devices/HoofBluetoothCharacteristic';
import { observable, runInAction } from 'mobx';

interface Props {
	characteristic: HoofBluetoothCharacteristic;
}

@observer
export default class CharacteristicCard extends React.Component<Props> {
	@observable data?: DataView;
	@observable toggle: boolean = false;

	handleRead = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		event.preventDefault();
		try {
			const data = await this.props.characteristic.readValue();
			runInAction(() => (this.data = data));
		} catch (error) {
			console.error(error);
		}
	};

	handleToggle = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		event.preventDefault();
		try {
			this.props.characteristic
				.writeValue(Uint8Array.of(this.toggle ? 0 : 1))
				.then(() => runInAction(() => (this.toggle = !this.toggle)));
		} catch (error) {
			console.error(error);
		}
	};

	render() {
		const { characteristic } = this.props;

		return (
			<Card>
				<header>{characteristic.name}</header>
				<section>
					<Checkbox
						disabled
						label="broadcast"
						checked={characteristic.properties.broadcast}
					/>
					<Checkbox
						disabled
						label="read"
						checked={characteristic.properties.read}
					/>
					<Checkbox
						disabled
						label="writeWithoutResponse"
						checked={characteristic.properties.writeWithoutResponse}
					/>
					<Checkbox
						disabled
						label="write"
						checked={characteristic.properties.write}
					/>
					<Checkbox
						disabled
						label="notify"
						checked={characteristic.properties.notify}
					/>
					<Checkbox
						disabled
						label="indicate"
						checked={characteristic.properties.indicate}
					/>
					<Checkbox
						disabled
						label="authenticatedSignedWrites"
						checked={characteristic.properties.authenticatedSignedWrites}
					/>
					<Checkbox
						disabled
						label="reliableWrite"
						checked={characteristic.properties.reliableWrite}
					/>
					<Checkbox
						disabled
						label="writableAuxiliaries"
						checked={characteristic.properties.writableAuxiliaries}
					/>
				</section>
				<footer>
					{characteristic.properties.read && (
						<Button onClick={this.handleRead} text="Read" />
					)}
					<span>{this.data?.getInt8(0)}</span>
					{characteristic.properties.write && (
						<Button
							onClick={this.handleToggle}
							icon={this.toggle ? 'volume-up' : 'volume-off'}
						/>
					)}
				</footer>
			</Card>
		);
	}
}
