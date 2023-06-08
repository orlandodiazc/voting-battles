import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";

import { useBoardDispatch, useBoardSelector } from "../hooks/hooks";
import { changeStageType } from "../redux/slices/boardSlice";
import AnswerInputs from "./answer-input-list";
import Player from "./player";
import TableBody from "./ui/vote-table";

export default function Board() {
	const { stages, players } = useBoardSelector((state) => state.settings);
	const scores = useBoardSelector((state) => state.scores.regular);
	const dispatch = useBoardDispatch();
	return (
		<>
			{stages.regular.map(({ name, setup, type }, stageIdx) => {
				const draftPlayers =
					stageIdx % 2 === 0 ? players : [...players].reverse();
				return (
					<TabsContent
						tabIndex={-1}
						value={name}
						key={stageIdx}
						className="flex flex-col justify-center items-center"
					>
						<TableBody setup={setup} stageName={name}>
							{draftPlayers.map(({ id: playerId, name }) => {
								const { values, extraValues } = scores[playerId][stageIdx];
								return (
									<React.Fragment key={playerId}>
										<Player
											playerId={playerId}
											stageId={stageIdx}
											setup={setup}
											values={values}
											extraValues={extraValues}
											name={name}
											type="regular"
										/>
										{type === "MINUTE_ANS" &&
											playerId === draftPlayers[1].id && (
												<AnswerInputs playerId={playerId} stageIdx={stageIdx} />
											)}
									</React.Fragment>
								);
							})}
						</TableBody>
						{name === "Random" && (
							<span className="absolute left-16 top-[114px] text-xs">
								<label className="flex items-center gap-0.5">
									<input
										type="checkbox"
										onChange={() =>
											dispatch(
												changeStageType({
													stageId: stageIdx,
													newType: type === "8X8" ? "MINUTE" : "8X8",
												})
											)
										}
									/>
									Minuto Libre
								</label>
							</span>
						)}
					</TabsContent>
				);
			})}
		</>
	);
}
