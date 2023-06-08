import { useBoardDispatch, useBoardSelector } from "../hooks/hooks";
import { toggleAnswer } from "../redux/slices/boardSlice";

export default function AnswerInputs({
	playerId,
	stageIdx,
}: {
	playerId: number;
	stageIdx: number;
}) {
	const scores = useBoardSelector((state) => state.scores.regular);
	const dispatch = useBoardDispatch();
	return (
		<tr>
			<td colSpan={1}></td>
			{scores[playerId][stageIdx].extraValues?.map((value, checkboxIdx) => (
				<td key={checkboxIdx} className="text-center p-0">
					<input
						type="checkbox"
						checked={value}
						onChange={() =>
							dispatch(
								toggleAnswer({
									playerId,
									stageId: stageIdx,
									checkboxId: checkboxIdx,
								})
							)
						}
					/>
				</td>
			))}
		</tr>
	);
}
