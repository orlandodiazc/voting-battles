import { ReactNode } from "react";

import { useBoardSelector } from "../hooks/hooks";
import { RegularPlayer } from "../redux/slices/boardSlice";

function Cell({ children }: { children: ReactNode }) {
	return <td className="border whitespace-nowrap p-1 text-sm">{children}</td>;
}

function PlayerRow({
	playerScores,
	playerName,
}: {
	playerName: string;
	playerScores: RegularPlayer;
}) {
	const stageScores = playerScores.map(
		({ values, extraValues }) =>
			values.reduce((acc, curr) => acc + Number(curr), 0) +
			(extraValues?.reduce((acc, curr) => acc + (curr ? 1 : 0), 0) ?? 0),
		0
	);

	const playerBoardTotal = stageScores.reduce((acc, curr) => acc + curr, 0);
	return (
		<tr>
			<Cell>{playerName}</Cell>
			{stageScores.map((value, idx) => (
				<Cell key={idx}>{value}</Cell>
			))}
			<Cell>{playerBoardTotal}</Cell>
		</tr>
	);
}

export default function Results() {
	const stageNames = useBoardSelector((state) =>
		state.settings.stages.regular.map((stage) => stage.name)
	);
	const playerNames = useBoardSelector((state) => state.settings.players);
	const scores = useBoardSelector((state) => state.scores);

	return (
		<div className="flex justify-center items-center relative h-[113px]">
			<h2 className="absolute text-sm text-destructive -top-2 left-8">
				Resultados
			</h2>
			<table className="text-sm text-center mx-auto mt-3">
				<thead>
					<tr>
						<th></th>
						{stageNames.map((name, idx) => (
							<th
								key={idx}
								className="bg-muted border text-xs px-2 py-1 whitespace-nowrap"
							>
								{name}
							</th>
						))}
						<th className="bg-muted border text-xs px-2 py-1 whitespace-nowrap">
							Total
						</th>
					</tr>
				</thead>
				<tbody>
					{scores.regular.map((player, idx) => (
						<PlayerRow
							key={idx}
							playerScores={player}
							playerName={playerNames[idx].name}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}
