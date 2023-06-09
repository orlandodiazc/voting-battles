import { twMerge } from "tailwind-merge";

import { useBoardSelector, usePlayersTotal } from "../hooks/hooks";

export default function PlayerSums({ tabValue }: { tabValue: string }) {
	const playerScores = usePlayersTotal();
	const players = useBoardSelector((state) => state.settings.players);
	const isHideTotalPlayer = useBoardSelector(
		(state) => state.settings.options.isHideTotalPlayer
	);
	return (
		<div
			className={twMerge(
				"flex justify-center gap-3 text-sm bg-muted self-center px-3 py-2 leading-none rounded",
				(tabValue === "Results" || isHideTotalPlayer) && "hidden"
			)}
		>
			<span>TOTAL</span>
			{players.map(({ name, id }) => (
				<span key={id} className="">
					{name}: {playerScores[id]}
				</span>
			))}
		</div>
	);
}
