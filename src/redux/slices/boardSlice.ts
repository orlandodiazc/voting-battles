import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type StageType = "MINUTE" | "MINUTE_ANS" | "8X8" | "4X4" | "RESULTS";
type Settings = {
	options: {
		isHideTotalPlayer: boolean;
		isHideTotalSum: boolean;
		isSwitchReplicaPlayers: boolean;
	};
	players: { id: number; name: string }[];
	stages: {
		regular: {
			name: string;
			setup: number[];
			type: StageType;
		}[];
		replica: { setup: number[]; type: StageType };
	};
};

type Stage = {
	extraValues?: boolean[];
	values: string[];
};
export type RegularPlayer = Stage[];
type ReplicaStage = { values: string[] };
type BoardState = {
	scores: { regular: RegularPlayer[]; replicas: ReplicaStage[][] };
	settings: Settings;
};

const settings: Settings = {
	stages: {
		regular: [
			{ name: "Incremental", setup: [6], type: "MINUTE" },
			{ name: "Random", setup: [6], type: "8X8" },
			{ name: "Libre 1", setup: [6], type: "MINUTE_ANS" },
			{ name: "Libre 2", setup: [6], type: "MINUTE_ANS" },
			{ name: "Deluxe", setup: [2, 5], type: "4X4" },
		],
		replica: { setup: [5], type: "4X4" },
	},
	players: [
		{ id: 0, name: "MC 1" },
		{ id: 1, name: "MC 2" },
	],
	options: {
		isHideTotalSum: false,
		isHideTotalPlayer: false,
		isSwitchReplicaPlayers: false,
	},
};

const regularScores: RegularPlayer[] = Array<RegularPlayer>(2).fill(
	settings.stages.regular.map(({ setup, type }): Stage => {
		const length = setup.reduce((acc, curr) => acc + curr, 0);
		return {
			values: Array<string>(length + 3).fill(""),
			...(type === "MINUTE_ANS" && { extraValues: Array(length).fill(false) }),
		};
	})
);
const scores = {
	regular: regularScores,
	replicas: [[], []],
};
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
				type?: string;
			}>
		) => {
			const { playerId, stageId, inputId, newValue } = action.payload;
			if (action.payload.type === "regular") {
				state.scores.regular[playerId][stageId].values[inputId] = newValue;
			} else if (action.payload.type === "replica") {
				state.scores.replicas[playerId][stageId].values[inputId] = newValue;
			}
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
			const newExtraValues = state.scores.regular[playerId][
				stageId
			].extraValues?.map((value, idx) => (idx === checkboxId ? !value : value));
			state.scores.regular[playerId][stageId].extraValues = newExtraValues;
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
				option:
					| "TOGGLE_STAGE_SUM"
					| "TOGGLE_PLAYER_TOTAL"
					| "TOGGLE_REPLICA_ORDER";
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
				case "TOGGLE_REPLICA_ORDER":
					state.settings.options.isSwitchReplicaPlayers =
						!state.settings.options.isSwitchReplicaPlayers;
					break;
				default:
			}
		},
		addReplica: (state) => {
			const valueLength = state.settings.stages.replica.setup.reduce(
				(acc, curr) => acc + curr,
				0
			);
			const array = Array<string>(valueLength + 3).fill("");
			state.scores.replicas[0].push({ values: array });
			state.scores.replicas[1].push({ values: array });
		},
	},
});

export const {
	addVote,
	toggleAnswer,
	changePlayerName,
	addReplica,
	toggleOption,
	changeStageType,
} = boardSlice.actions;
export default boardSlice.reducer;
