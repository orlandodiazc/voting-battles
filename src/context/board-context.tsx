import { ReactNode, Reducer, createContext, useReducer } from "react";

type ReducerAction =
  | {
      type: "SET_VOTE";
      payload: {
        playerId: number;
        stageId: number;
        inputId: number;
        newValue: string;
      };
    }
  | {
      type: "SET_PLAYER_STAGE_TOTAL" | "ADD_EXTRA";
      payload: {
        playerId: number;
        stageId: number;
      };
    };

type Settings = {
  stages: {
    name: string;
    setup: number[];
    isResponse: boolean;
    extraValues?: boolean[];
  }[];
  playersName: string[];
};
type Stage = { totalPlayer: number; values: string[] };
type Player = Stage[];
type ReducerState = { settings: Settings; scores: Player[] };

const boardReducer: Reducer<ReducerState, ReducerAction> = (state, action) => {
  switch (action.type) {
    case "SET_VOTE":
      return {
        ...state,
        scores: state.scores.map((player, idx) => {
          if (idx !== action.payload.playerId) return player;
          return player.map((stage, idx) => {
            if (idx !== action.payload.stageId) return stage;
            return {
              ...stage,
              values: stage.values.map((prevValue, idx) => {
                if (idx !== action.payload.inputId) return prevValue;
                return action.payload.newValue;
              }),
            };
          });
        }),
      };
    case "SET_PLAYER_STAGE_TOTAL":
      return {
        ...state,
        scores: state.scores.map((player, idx) => {
          if (idx !== action.payload.playerId) return player;
          return player.map((stage, idx) => {
            if (idx !== action.payload.stageId) return stage;
            return {
              ...stage,
              totalPlayer: stage.values.reduce(
                (acc, curr) => acc + Number(curr),
                0
              ),
            };
          });
        }),
      };
    case "ADD_EXTRA":
      return {
        ...state,
        scores: state.scores.map((player, idx) => {
          if (idx !== action.payload.playerId) return player;
          return player.map((stage, idx) => {
            if (idx !== action.payload.stageId) return stage;
            return {
              ...stage,
              totalPlayer: stage.totalPlayer + 1,
            };
          });
        }),
      };
    default:
      return state;
  }
};

const settings: Settings = {
  stages: [
    { name: "Incremental", setup: [6], isResponse: false },
    { name: "Random", setup: [6], isResponse: false },
    { name: "Libre 1", setup: [6], isResponse: true },
    { name: "Libre 2", setup: [6], isResponse: true },
    { name: "Deluxe", setup: [2, 5], isResponse: false },
  ],
  playersName: ["Chuty", "Bnet"],
};

const scores: Player[] = Array(2).fill([
  ...settings.stages.map(({ setup, isResponse }) => {
    const length = setup.reduce((acc, curr) => acc + curr, 0);
    return {
      values: Array(length + 3).fill(""),
      ...(isResponse && { extraValues: Array(length).fill(false) }),
      totalPlayer: 0,
    };
  }),
]);

const initialValue: { settings: Settings; scores: Player[] } = {
  settings,
  scores,
};
type BoardContext = {
  settings: Settings;
  scores: Player[];
  setVote: (
    playerId: number,
    stageId: number,
    inputId: number,
    newValue: string
  ) => void;
};
export const BoardContext = createContext<BoardContext>({
  scores,
  settings,
  setVote: () => undefined,
});

export const BoardContextProvider = ({ children }: { children: ReactNode }) => {
  const [board, boardDispatch] = useReducer(boardReducer, initialValue);
  function setVote(
    playerId: number,
    stageId: number,
    inputId: number,
    newValue: string
  ) {
    boardDispatch({
      type: "SET_VOTE",
      payload: { playerId, stageId, inputId, newValue },
    });
    boardDispatch({
      type: "SET_PLAYER_STAGE_TOTAL",
      payload: { playerId, stageId },
    });
  }
  const { settings, scores } = board;
  return (
    <BoardContext.Provider value={{ scores, settings, setVote }}>
      {children}
    </BoardContext.Provider>
  );
};
export default BoardContext;
