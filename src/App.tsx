import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";

import Player from "./components/player";

const settings = {
  stages: [
    { name: "Incremental", setup: [6] },
    { name: "Random", setup: [6] },
    { name: "Libre 1", setup: [6] },
    { name: "Libre 2", setup: [6] },
    { name: "Deluxe", setup: [2, 5] },
  ],
  playersName: ["Chuty", "Bnet"],
};

function createInputList(setup: number[]) {
  const length = setup.reduce((acc, curr) => acc + curr, 0);
  return Array(length + 3).fill("");
}

const initialScores = Array(2).fill([
  ...settings.stages.map(({ setup }) => createInputList(setup)),
]);

export default function App() {
  const [index, setIndex] = useState(0);
  function updateIndex(newIndex: number) {
    if (newIndex < 0 || newIndex > settings.stages.length - 1) return;
    setIndex(newIndex);
  }
  const [scores, setScores] = useState<string[][][]>(initialScores);
  function updateBoard(
    stageId: number,
    playerId: number,
    newValue: string,
    inputId: number
  ) {
    setScores((prev) =>
      prev.map((player, idx) => {
        if (idx !== playerId) return player;
        return player.map((stage, idx) => {
          if (idx !== stageId) return stage;
          return stage.map((prevValue, idx) => {
            if (idx !== inputId) return prevValue;
            return newValue;
          });
        });
      })
    );
  }
  return (
    <main className="min-h-screen grid place-content-center">
      <section className="bg-slate-900 px-8 py-6 rounded-lg">
        <Tabs
          value={settings.stages[index].name}
          onValueChange={(value) =>
            setIndex(settings.stages.findIndex((stage) => stage.name === value))
          }
        >
          {settings.stages.map(({ name: stageName, setup }, stageIdx) => {
            const breakValues = setup.map((value, idx) =>
              setup.slice(0, idx + 1).reduce((a, b) => a + b)
            );

            return (
              <TabsContent value={stageName} key={stageIdx}>
                <h2 className="mb-2">{stageName}</h2>
                <table className="border-separate border-spacing-0.5">
                  <thead>
                    <tr className="text-[10px] text-center">
                      <td
                        colSpan={setup.reduce((acc, curr) => acc + curr, 1)}
                      ></td>
                      <td>Tecnicas</td>
                      <td>Flow</td>
                      <td>Escena</td>
                      <td>Total</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="[&>*:nth-last-child(-n+4)]:px-1.5">
                      <td className="pe-4">name</td>
                      <Player
                        playerId={0}
                        changeBoard={(playerId, value, inputId) => {
                          updateBoard(stageIdx, playerId, value, inputId);
                        }}
                        breakValues={breakValues}
                        values={scores[0][stageIdx]}
                      />
                    </tr>
                  </tbody>
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
