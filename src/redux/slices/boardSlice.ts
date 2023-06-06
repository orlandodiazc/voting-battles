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
};

type Stage = { totalPlayer: number; values: string[]; extraValues?: boolean[] };
type Player = Stage[];
type BoardState = { settings: Settings; scores: Player[] };

const settings: Settings = {
  stages: [
    { name: "Incremental", setup: [6], type: "MINUTE" },
    { name: "Random", setup: [6], type: "8X8" },
    { name: "Libre 1", setup: [6], type: "MINUTE_ANS" },
    { name: "Libre 2", setup: [6], type: "MINUTE_ANS" },
    { name: "Deluxe", setup: [2, 5], type: "4X4" },
    { name: "Results", setup: [6], type: "RESULTS" },
  ],
  players: [
    { id: 0, name: "Chuty" },
    { id: 1, name: "Bnet" },
  ],
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
    setVote: (
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
      // state.scores[playerId][stageId].totalPlayer = state.scores[playerId][
      //   stageId
      // ].values.reduce((acc, curr) => acc + Number(curr), 0);
    },
    setAnswer: (
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
      // const totalExtra =
      //   newExtraValues?.reduce((acc, curr) => acc + (curr ? 1 : 0), 0) ?? 0;
      // state.scores[playerId][stageId].totalPlayer =
      //   state.scores[playerId][stageId].values.reduce(
      //     (acc, curr) => acc + Number(curr),
      //     0
      //   ) + totalExtra;
    },
  },
});

export const { setVote, setAnswer } = boardSlice.actions;
export default boardSlice.reducer;
