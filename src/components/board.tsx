import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";

import { useBoardSelector } from "../hooks/hooks";
import AnswerInputs from "./answer-input-list";
import Player from "./player";
import { RovingTabindexRoot } from "./roving-tabindex";
import Table from "./ui/vote-table";

export default function Board() {
	const { stages, players } = useBoardSelector((state) => state.settings);

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
						<Table setup={setup}>
							<RovingTabindexRoot as="tbody" active={{ rowId: 0, cellId: 0 }}>
								{draftPlayers.map(({ id: playerId, name }) => (
									<React.Fragment key={playerId}>
										<Player
											playerId={playerId}
											stageId={stageIdx}
											setup={setup}
											name={name}
										/>
										{type === "MINUTE_ANS" &&
											playerId === draftPlayers[1].id && (
												<AnswerInputs playerId={playerId} stageIdx={stageIdx} />
											)}
									</React.Fragment>
								))}
							</RovingTabindexRoot>
						</Table>
					</TabsContent>
				);
			})}
		</>
	);
}
