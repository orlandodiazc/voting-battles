import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../redux/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useBoardDispatch: () => AppDispatch = useDispatch;
export const useBoardSelector: TypedUseSelectorHook<RootState> = useSelector;

export function usePlayersTotal() {
	const scores = useBoardSelector((state) => state.scores);
	const playerScores = scores.map((player) =>
		player.reduce(
			(acc, { values, extraValues }) =>
				acc +
				values.reduce((acc, curr) => acc + Number(curr), 0) +
				(extraValues?.reduce((acc, curr) => acc + (curr ? 1 : 0), 0) ?? 0),
			0
		)
	);
	return playerScores;
}
