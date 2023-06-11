import { twMerge } from "tailwind-merge";

import { useBoardSelector, usePlayersTotal } from "../hooks/hooks";

export default function PlayerSums({ tabValue }: { tabValue: string }) {
	const playerScores = usePlayersTotal();
	const players = useBoardSelector((state) => state.settings.players);
	const isPlayerTotalHidden = useBoardSelector(
		(state) => state.settings.options.isHideTotalPlayer
	);
	const regularStages = useBoardSelector(
		(state) => state.settings.stages.regular
	);
	const isRegularStage = regularStages.some(({ name }) => name === tabValue);
	return (
		<div
			className={twMerge(
				"flex justify-center items-center h-full gap-3 text-xs bg-muted self-center px-3 py-2 leading-none rounded-t-sm",
				(isPlayerTotalHidden || !isRegularStage) && "hidden"
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
