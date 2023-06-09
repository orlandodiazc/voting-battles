import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type StageType = "MINUTE" | "MINUTE_ANS" | "8X8" | "4X4" | "RESULTS";
type Settings = {
	options: { isHideTotalPlayer: boolean; isHideTotalSum: boolean };
	players: { id: number; name: string }[];
	stages: {
		normal: {
			name: string;
			setup: number[];
			type: StageType;
		}[];
		replicaFormat: { setup: number[]; type: StageType };
	};
};

type Stage = {
	extraValues?: boolean[];
	replicas: string[][];
	totalPlayer: number;
	values: string[];
};
export type Player = Stage[];
type BoardState = { scores: Player[]; settings: Settings };
const settings: Settings = {
	stages: {
		normal: [
			{ name: "Incremental", setup: [6], type: "MINUTE" },
			{ name: "Random", setup: [6], type: "8X8" },
			{ name: "Libre 1", setup: [6], type: "MINUTE_ANS" },
			{ name: "Libre 2", setup: [6], type: "MINUTE_ANS" },
			{ name: "Deluxe", setup: [2, 5], type: "4X4" },
		],
		replicaFormat: { setup: [5], type: "4X4" },
	},
	players: [
		{ id: 0, name: "MC 1" },
		{ id: 1, name: "MC 2" },
	],
	options: { isHideTotalSum: false, isHideTotalPlayer: false },
};

const scores: Player[] = Array<Player>(2).fill(
	settings.stages.normal.map(({ setup, type }): Stage => {
		const length = setup.reduce((acc, curr) => acc + curr, 0);
		return {
			values: Array<string>(length + 3).fill(""),
			replicas: [Array<string>(8).fill("")],
			...(type === "MINUTE_ANS" && { extraValues: Array(length).fill(false) }),
			totalPlayer: 0,
		};
	})
);
const initialState: BoardState = { settings, scores };
export const boardSlice = createSlice({
	name: "board",
	initialState,
	reducers: {
		addVote: (
			state,
			action: PayloadAction<{
				inputId: number;
				newValue: string;
				playerId: number;
				stageId: number;
			}>
		) => {
			const { playerId, stageId, inputId, newValue } = action.payload;
			state.scores[playerId][stageId].values[inputId] = newValue;
		},
		toggleAnswer: (
			state,
			action: PayloadAction<{
				checkboxId: number;
				playerId: number;
				stageId: number;
			}>
		) => {
			const { playerId, stageId, checkboxId } = action.payload;
			const newExtraValues = state.scores[playerId][stageId].extraValues?.map(
				(value, idx) => (idx === checkboxId ? !value : value)
			);
			state.scores[playerId][stageId].extraValues = newExtraValues;
		},
		changePlayerName: (
			state,
			action: PayloadAction<{
				newName: string;
				playerId: number;
			}>
		) => {
			const { playerId, newName } = action.payload;
			state.settings.players[playerId].name =
				newName === "" ? `MC ${playerId + 1}` : newName;
		},
		toggleOption: (
			state,
			action: PayloadAction<{
				option: "TOGGLE_STAGE_SUM" | "TOGGLE_PLAYER_TOTAL";
			}>
		) => {
			const { option } = action.payload;
			switch (option) {
				case "TOGGLE_PLAYER_TOTAL":
					state.settings.options.isHideTotalPlayer =
						!state.settings.options.isHideTotalPlayer;
					break;
				case "TOGGLE_STAGE_SUM":
					state.settings.options.isHideTotalSum =
						!state.settings.options.isHideTotalSum;
					break;
				default:
			}
		},
	},
});

export const { addVote, toggleAnswer, changePlayerName, toggleOption } =
	boardSlice.actions;
export default boardSlice.reducer;
