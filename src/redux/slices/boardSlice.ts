import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type StageType = "MINUTE" | "MINUTE_ANS" | "8X8" | "4X4" | "RESULTS";
type Settings = {
  stages: {
    name: string;
    setup: number[];
    type: StageType;
  }[];
  players: { id: number; name: string }[];
  options: { isHideTotalSum: boolean; isHideTotalPlayer: boolean };
};

type Stage = { totalPlayer: number; values: string[]; extraValues?: boolean[] };
export type Player = Stage[];
type BoardState = { settings: Settings; scores: Player[] };

const settings: Settings = {
  stages: [
    { name: "Incremental", setup: [6], type: "MINUTE" },
    { name: "Random", setup: [6], type: "8X8" },
    { name: "Libre 1", setup: [6], type: "MINUTE_ANS" },
    { name: "Libre 2", setup: [6], type: "MINUTE_ANS" },
    { name: "Deluxe", setup: [2, 5], type: "4X4" },
  ],
  players: [
    { id: 0, name: "MC 1" },
    { id: 1, name: "MC 2" },
  ],
  options: { isHideTotalSum: false, isHideTotalPlayer: false },
};

const scores: Player[] = Array(2).fill([
  ...settings.stages.map(({ setup, type }) => {
    const length = setup.reduce((acc, curr) => acc + curr, 0);
    return {
      values: Array(length + 3).fill(""),
      ...(type === "MINUTE_ANS" && { extraValues: Array(length).fill(false) }),
      totalPlayer: 0,
    };
  }),
]);
const initialState: BoardState = { settings, scores };
export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addVote: (
      state,
      action: PayloadAction<{
        playerId: number;
        stageId: number;
        inputId: number;
        newValue: string;
      }>
    ) => {
      const { playerId, stageId, inputId, newValue } = action.payload;
      state.scores[playerId][stageId].values[inputId] = newValue;
    },
    toggleAnswer: (
      state,
      action: PayloadAction<{
        playerId: number;
        stageId: number;
        checkboxId: number;
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
        playerId: number;
        newName: string;
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
