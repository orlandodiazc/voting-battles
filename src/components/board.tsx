import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";

import { useBoardSelector } from "../hooks/hooks";
import AnswerInputs from "./answer-input-list";
import Player from "./player";
import TableBody from "./ui/vote-table";

export default function Board() {
	const { stages, players } = useBoardSelector((state) => state.settings);
	const scores = useBoardSelector((state) => state.scores.regular);
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
						className="flex justify-center items-end"
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
										/>
										{type === "MINUTE_ANS" &&
											playerId === draftPlayers[1].id && (
												<AnswerInputs playerId={playerId} stageIdx={stageIdx} />
											)}
									</React.Fragment>
								);
							})}
						</TableBody>
					</TabsContent>
				);
			})}
		</>
	);
}
