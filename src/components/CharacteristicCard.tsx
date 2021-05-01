import React, { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { HoofBluetoothCharacteristic } from '../devices/HoofBluetoothCharacteristic';
import { runInAction } from 'mobx';

import { Button } from '@rmwc/button';
import { Card, CardActionIcon, CardActionIcons, CardActions } from '@rmwc/card';
import { List, ListItem, ListItemPrimaryText, ListItemText } from '@rmwc/list';

interface Props {
	characteristic: HoofBluetoothCharacteristic;
}

export const CharacteristicCard = observer(({ characteristic }: Props) => {
	const [data, setData] = useState(undefined as DataView | undefined);
	const [toggle, setToggle] = useState(false);

	const handleRead = async (
		event: React.MouseEvent<HTMLElement, MouseEvent>
	) => {
		event.preventDefault();
		try {
			const data = await characteristic.readValue();
			runInAction(() => setData(data));
		} catch (error) {
			console.error(error);
		}
	};

	const handleToggle = async (
		event: React.MouseEvent<HTMLElement, MouseEvent>
	) => {
		event.preventDefault();
		try {
			characteristic
				.writeValueWithoutResponse(
					Uint8Array.of(parseInt(event.currentTarget.id))
				)
				.then(() => runInAction(() => setToggle(!toggle)));
		} catch (error) {
			console.error(error);
		}
	};

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
			<List>
				<ListItem activated={characteristic.properties.broadcast}>
					<ListItemText>
						<ListItemPrimaryText>broadcast</ListItemPrimaryText>
					</ListItemText>
				</ListItem>
				<ListItem activated={characteristic.properties.read}>
					<ListItemText>
						<ListItemPrimaryText>read</ListItemPrimaryText>
					</ListItemText>
				</ListItem>
				<ListItem activated={characteristic.properties.writeWithoutResponse}>
					<ListItemText>
						<ListItemPrimaryText>writeWithoutResponse</ListItemPrimaryText>
					</ListItemText>
				</ListItem>
				<ListItem activated={characteristic.properties.write}>
					<ListItemText>
						<ListItemPrimaryText>write</ListItemPrimaryText>
					</ListItemText>
				</ListItem>
				<ListItem activated={characteristic.properties.notify}>
					<ListItemText>
						<ListItemPrimaryText>notify</ListItemPrimaryText>
					</ListItemText>
				</ListItem>
				<ListItem activated={characteristic.properties.indicate}>
					<ListItemText>
						<ListItemPrimaryText>indicate</ListItemPrimaryText>
					</ListItemText>
				</ListItem>
				<ListItem
					activated={characteristic.properties.authenticatedSignedWrites}
				>
					<ListItemText>
						<ListItemPrimaryText>authenticatedSignedWrites</ListItemPrimaryText>
					</ListItemText>
				</ListItem>
				<ListItem activated={characteristic.properties.reliableWrite}>
					<ListItemText>
						<ListItemPrimaryText>reliableWrite</ListItemPrimaryText>
					</ListItemText>
				</ListItem>
				<ListItem activated={characteristic.properties.writableAuxiliaries}>
					<ListItemText>
						<ListItemPrimaryText>writableAuxiliaries</ListItemPrimaryText>
					</ListItemText>
				</ListItem>
			</List>
			<CardActions>
				{characteristic.properties.read && (
					<Button onClick={handleRead} label="Read" />
				)}
				<span>{data?.getInt8(0)}</span>
				<CardActionIcons>
					{characteristic.alertLevels.map(({ value }) => (
						<CardActionIcon
							id={`${value}`}
							key={value}
							onClick={handleToggle}
							icon={
								value === 0
									? 'volume_off'
									: value === 1
									? 'volume_down'
									: 'volume_up'
							}
						/>
					))}
				</CardActionIcons>
			</CardActions>
		</Card>
	);
});
