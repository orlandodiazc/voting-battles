import { TabsContent } from "@radix-ui/react-tabs";
import { useBoardDispatch, useBoardSelector } from "../hooks/hooks";
import { RovingTabindexRoot } from "./roving-tabindex";
import React from "react";
import Player from "./player";
import { setAnswer } from "../redux/slices/boardSlice";

export default function Board() {
  const { stages, players } = useBoardSelector((state) => state.settings);
  const scores = useBoardSelector((state) => state.scores);

  const dispatch = useBoardDispatch();
  return (
    <div className="grid justify-center items-start h-[121px]">
      {stages.map((stage, stageIdx) => {
        const breakValues = stage.setup.map((value, idx) =>
          stage.setup.slice(0, idx + 1).reduce((a, b) => a + b)
        );
        const draftPlayers =
          stageIdx % 2 === 0 ? players : [...players].reverse();
        return (
          <TabsContent
            tabIndex={-1}
            value={stage.name}
            key={stageIdx}
            className="relative"
          >
            <h2 className="absolute -inset-4">{stage.name}</h2>
            <table className="border-separate border-spacing-0.5">
              <thead>
                <tr className="text-[10px] text-center">
                  <td
                    colSpan={stage.setup.reduce((acc, curr) => acc + curr, 1)}
                  ></td>
                  <td>Tecnicas</td>
                  <td>Flow</td>
                  <td>Escena</td>
                  <td>Total</td>
                </tr>
              </thead>
              <RovingTabindexRoot as="tbody" active={{ rowId: 0, cellId: 0 }}>
                {draftPlayers.map(({ id: playerId, name }) => (
                  <React.Fragment key={playerId}>
                    <tr
                      className="[&>*:nth-last-child(-n+4)]:px-1.5 align-top"
                      key={playerId}
                    >
                      <td className="align-middle pe-2 w-[5ch]">{name}</td>
                      <Player
                        playerId={playerId}
                        stageId={stageIdx}
                        breakValues={breakValues}
                        values={scores[playerId][stageIdx].values}
                      />
                    </tr>
                    {stage.type === "MINUTE_ANS" &&
                      name === draftPlayers[1].name && (
                        <tr>
                          <td colSpan={1}></td>
                          {scores[playerId][stageIdx].extraValues?.map(
                            (value, checkboxIdx) => (
                              <td key={checkboxIdx} className="text-center">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={() =>
                                    dispatch(
                                      setAnswer({
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
          </TabsContent>
        );
      })}
    </div>
  );
}
