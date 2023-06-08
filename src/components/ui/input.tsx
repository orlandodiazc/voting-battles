import isHotkey from "is-hotkey";
import { ChangeEvent } from "react";

import { useBoardDispatch, useBoardSelector } from "../../hooks/hooks";
import { addVote, StageType } from "../../redux/slices/boardSlice";
import {
	getNextFocused,
	getPrevFocused,
	RovingTabindexItem,
	useRovingTabindex,
} from "../roving";

export default function Input({
	inputId,
	playerId,
	stageId,
	value,
	maxValue,
	type,
}: {
	inputId: number;
	maxValue: number;
	playerId: number;
	stageId: number;
	type?: "regular" | "replica";
	value: string;
}) {
	const regularLength = useBoardSelector(
		(state) => state.settings.stages.regular.length
	);
	const isSwitchOrder = useBoardSelector(
		(state) => state.settings.options.isSwitchReplicaPlayers
	);

	let focusLocation = { rowId: -1, cellId: -1 };
	if (type === "regular") {
		focusLocation = {
			rowId: stageId % 2 === 0 ? playerId : playerId === 0 ? 1 : 0,
			cellId: inputId,
		};
	} else if (type === "replica") {
		focusLocation = {
			rowId:
				(regularLength + stageId) % 2 === (isSwitchOrder ? 1 : 0)
					? playerId
					: playerId === 0
					? 1
					: 0,
			cellId: inputId,
		};
	}
	const { getOrderedItems, getRovingProps } = useRovingTabindex(focusLocation);

	const regularStageType = useBoardSelector(
		(state) => state.settings.stages.regular[stageId].type
	);
	const stageType: StageType = type === "replica" ? "4X4" : regularStageType;
	const dispatch = useBoardDispatch();

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		let currentValue = e.target.value;
		if (currentValue.length >= 2 && currentValue.slice(-2) !== ".5") {
			currentValue = currentValue.slice(-1);
		}
		if (Number(currentValue) > maxValue) currentValue = maxValue.toString();
		if (Number(currentValue) < 0) currentValue = "0";
		dispatch(
			addVote({ playerId, stageId, inputId, newValue: currentValue, type })
		);
	}

	return (
		<input
			type="number"
			className="w-8 h-8 text-center bg-foreground text-background rounded"
			step="0.5"
			value={value}
			onChange={handleChange}
			{...getRovingProps<"input">({
				onKeyDown: (e) => {
					if (isHotkey(["+", "-", "e"], e)) {
						e.preventDefault();
					}

					if (isHotkey(["backspace", "delete"], e)) {
						e.preventDefault();
						dispatch(
							addVote({ playerId, stageId, inputId, newValue: "", type })
						);
					}

					if (isHotkey("space", e) || e.code === "NumpadDecimal") {
						e.preventDefault();
						if (value.slice(-2) === ".5" || value === "4") return;

						dispatch(
							addVote({
								playerId,
								stageId,
								inputId,
								newValue: `${value ? value : "0"}.5`,
								type,
							})
						);
					}
					if (isHotkey(["right", "tab", "left"], e)) {
						const items = getOrderedItems();
						let nextItem: RovingTabindexItem | undefined;
						if (isHotkey(["right", "tab"], e)) {
							e.preventDefault();
							nextItem = getNextFocused(items, focusLocation, stageType);
						} else if (isHotkey("left", e)) {
							nextItem = getPrevFocused(items, focusLocation, stageType);
						}
						nextItem?.element.focus();
					}
				},
			})}
		/>
	);
}
