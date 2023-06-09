import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";

import { useBoardDispatch, useBoardSelector } from "../hooks/hooks";
import { toggleAnswer } from "../redux/slices/boardSlice";
import Player from "./player";
import { RovingTabindexRoot } from "./roving-tabindex";

export default function Board() {
	const { stages, players } = useBoardSelector((state) => state.settings);
	const scores = useBoardSelector((state) => state.scores);
	const dispatch = useBoardDispatch();
	return (
		<>
			{stages.normal.map(({ name, setup, type }, stageIdx) => {
				const breakValues = setup.map((value, idx) =>
					setup.slice(0, idx + 1).reduce((a, b) => a + b)
				);
				const draftPlayers =
					stageIdx % 2 === 0 ? players : [...players].reverse();
				return (
					<TabsContent
						tabIndex={-1}
						value={name}
						key={stageIdx}
						className="flex justify-center items-end"
					>
						<div className="h-[113px]">
							<table className="border-separate border-spacing-px mx-auto">
								<thead>
									<tr className="text-[10px] text-center">
										<th
											colSpan={setup.reduce((acc, curr) => acc + curr, 1)}
										></th>
										<th className="border-s-8 border-transparent">Tecnicas</th>
										<th>Flow</th>
										<th>Escena</th>
										<th>Total</th>
									</tr>
								</thead>
								<RovingTabindexRoot as="tbody" active={{ rowId: 0, cellId: 0 }}>
									{draftPlayers.map(({ id: playerId, name }) => (
										<React.Fragment key={playerId}>
											<tr
												className="[&>*:nth-last-child(-n+4)]:px-1.5"
												key={playerId}
											>
												<td className="align-middle pe-2 max-w-[10ch] font-mono text-right text-sm text-ellipsis overflow-hidden whitespace-nowrap">
													{name}
												</td>
												<Player
													playerId={playerId}
													stageId={stageIdx}
													breakValues={breakValues}
												/>
											</tr>
											{type === "MINUTE_ANS" &&
												playerId === draftPlayers[1].id && (
													<tr>
														<td colSpan={1}></td>
														{scores[playerId][stageIdx].extraValues?.map(
															(value, checkboxIdx) => (
																<td
																	key={checkboxIdx}
																	className="text-center p-0"
																>
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
															)
														)}
													</tr>
												)}
										</React.Fragment>
									))}
								</RovingTabindexRoot>
							</table>
						</div>
					</TabsContent>
				);
			})}
		</>
	);
}
