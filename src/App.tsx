import React, { useContext, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";

import { RovingTabindexRoot } from "./components/roving-tabindex";
import Player from "./components/player";
import { BoardContext } from "./context/board-context";

// const settings = {
//   stages: [
//     { name: "Incremental", setup: [6], isResponse: false },
//     { name: "Random", setup: [6], isResponse: false },
//     { name: "Libre 1", setup: [6], isResponse: true },
//     { name: "Libre 2", setup: [6], isResponse: true },
//     { name: "Deluxe", setup: [2, 5], isResponse: false },
//   ],
//   playersName: ["Chuty", "Bnet"],
// };

// function createInputList(setup: number[]) {
//   const length = setup.reduce((acc, curr) => acc + curr, 0);
//   return Array(length + 3).fill("");
// }

// const initialScores = Array(2).fill([
//   ...settings.stages.map(({ setup }) => createInputList(setup)),
// ]);
export default function App() {
  const { scores, settings } = useContext(BoardContext);

  const [index, setIndex] = useState(0);
  function updateIndex(newIndex: number) {
    if (newIndex < 0 || newIndex > settings.stages.length - 1) return;
    setIndex(newIndex);
  }

  // const [scores, setScores] = useState<string[][][]>(initialScores);
  // function updateBoard(
  //   stageId: number,
  //   playerId: number,
  //   newValue: string,
  //   inputId: number
  // ) {
  //   setScores((prev) =>
  //     prev.map((player, idx) => {
  //       if (idx !== playerId) return player;
  //       return player.map((stage, idx) => {
  //         if (idx !== stageId) return stage;
  //         return stage.map((prevValue, idx) => {
  //           if (idx !== inputId) return prevValue;
  //           return newValue;
  //         });
  //       });
  //     })
  //   );
  // }
  return (
    <main className="min-h-screen grid place-content-center">
      <section className="bg-slate-900 px-8 py-6 rounded-lg">
        <Tabs
          value={settings.stages[index].name}
          onValueChange={(value) =>
            setIndex(settings.stages.findIndex((stage) => stage.name === value))
          }
        >
          {settings.stages.map((stage, stageIdx) => {
            const totalInputLength = stage.setup.reduce(
              (acc, curr) => acc + curr,
              0
            );
            const breakValues = stage.setup.map((value, idx) =>
              stage.setup.slice(0, idx + 1).reduce((a, b) => a + b)
            );
            const players =
              stageIdx % 2 === 0
                ? settings.playersName
                : [...settings.playersName].reverse();

            return (
              <TabsContent tabIndex={-1} value={stage.name} key={stageIdx}>
                <h2 className="mb-2">{stage.name}</h2>
                <table className="border-separate border-spacing-0.5">
                  <thead>
                    <tr className="text-[10px] text-center">
                      <td colSpan={totalInputLength + 1}></td>
                      <td>Tecnicas</td>
                      <td>Flow</td>
                      <td>Escena</td>
                      <td>Total</td>
                    </tr>
                  </thead>
                  <RovingTabindexRoot as="tbody" active="00">
                    {players.map((name, playerIdx) => (
                      <React.Fragment key={playerIdx}>
                        <tr
                          className="[&>*:nth-last-child(-n+4)]:px-1.5 align-top"
                          key={playerIdx}
                        >
                          <td className="pt-1">{name}</td>
                          <Player
                            playerId={playerIdx}
                            stageId={stageIdx}
                            breakValues={breakValues}
                            values={scores[playerIdx][stageIdx].values}
                          />
                        </tr>
                        {stage.isResponse && name === players[1] && (
                          <tr>
                            <td colSpan={1}></td>
                            {Array.from(Array(totalInputLength).keys()).map(
                              (checkboxIdx) => (
                                <td key={checkboxIdx} className="text-center">
                                  <input type="checkbox" />
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
          <div className="inline-flex items-center gap-1">
            <button onClick={() => updateIndex(index - 1)}>
              <MdChevronLeft size={30} />
            </button>
            <TabsList>
              {settings.stages.map(({ name: stageName }, idx) => (
                <TabsTrigger value={stageName} key={idx}>
                  {idx}
                </TabsTrigger>
              ))}
            </TabsList>
            <button onClick={() => updateIndex(index + 1)}>
              <MdChevronRight size={30} />
            </button>
          </div>
        </Tabs>
      </section>
    </main>
  );
}
