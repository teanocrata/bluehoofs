import React from 'react';

import { Button, ButtonGroup, Card, Checkbox } from '@blueprintjs/core';

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
				.writeValueWithoutResponse(
					Uint8Array.of(parseInt(event.currentTarget.id))
				)
				.then(() => runInAction(() => (this.toggle = !this.toggle)));
		} catch (error) {
			console.error(error);
		}
	};

	render() {
		const { characteristic } = this.props;

		return (
			<Card>
				<header>
					<a
						href={`https://teanocrata.github.io/ble-assigned-numbers/uuids/0x${characteristic.uuid
							.slice(4, 8)
							.toUpperCase()}.json`}
					>
						{characteristic.name}
					</a>
				</header>
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
					<ButtonGroup>
						{characteristic.alertLevels.map(({ value }) => (
							<Button
								id={`${value}`}
								key={value}
								onClick={this.handleToggle}
								icon={
									value === 0
										? 'volume-off'
										: value === 1
										? 'volume-down'
										: 'volume-up'
								}
							/>
						))}
					</ButtonGroup>
				</footer>
			</Card>
		);
	}
}
