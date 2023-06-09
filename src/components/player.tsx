import { twMerge } from "tailwind-merge";

import { useBoardSelector } from "../hooks/hooks";
import Input from "./input";

export default function Player({
	setup,
	playerId,
	stageId,
	name,
}: {
	name: string;
	playerId: number;
	setup: number[];
	stageId: number;
}) {
	const breakValues = setup.map((value, idx) =>
		setup.slice(0, idx + 1).reduce((a, b) => a + b)
	);

	const { values, extraValues } = useBoardSelector(
		(state) => state.scores.regular[playerId][stageId]
	);
	const isHideTotalSum = useBoardSelector(
		(state) => state.settings.options.isHideTotalSum
	);

	const playerTotal =
		values.reduce((acc, curr) => acc + Number(curr), 0) +
		(extraValues?.reduce((acc, curr) => acc + (curr ? 1 : 0), 0) ?? 0);
	return (
		<tr className="[&>*:nth-last-child(-n+4)]:px-1.5" key={playerId}>
			<td className="align-middle pe-2 max-w-[10ch] font-mono text-right text-sm text-ellipsis overflow-hidden whitespace-nowrap">
				{name}
			</td>
			{values.map((value, idx) => {
				const padding = breakValues.some((breakIdx) => breakIdx === idx)
					? "border-s-14"
					: "border-s";

				const maxValue = idx >= values.length - 3 ? 2 : 4;
				return (
					<td
						className={twMerge(padding, "text-center border-transparent")}
						key={idx}
					>
						<Input
							playerId={playerId}
							inputId={idx}
							stageId={stageId}
							value={value}
							maxValue={maxValue}
						/>
					</td>
				);
			})}
			<td className="text-center align-top">
				<input
					className="w-8 h-8 text-center text-background rounded disabled:bg-popover-foreground"
					disabled={true}
					value={isHideTotalSum ? "-" : playerTotal}
				/>
			</td>
		</tr>
	);
}
