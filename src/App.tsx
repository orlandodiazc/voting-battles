import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";

import { useBoardSelector } from "./hooks/hooks";
import Board from "./components/board";

export default function App() {
  const { stages } = useBoardSelector((state) => state.settings);

  const [index, setIndex] = useState(0);
  function updateIndex(newIndex: number) {
    if (newIndex < 0 || newIndex > stages.length - 1) return;
    setIndex(newIndex);
  }

  return (
    <main className="min-h-screen grid place-content-center">
      <section className="bg-slate-900 px-8 py-6 rounded-lg">
        <Tabs
          value={stages[index].name}
          onValueChange={(value) =>
            setIndex(stages.findIndex((stage) => stage.name === value))
          }
        >
          <Board />
          <div className="inline-flex items-center gap-1">
            <button onClick={() => updateIndex(index - 1)}>
              <MdChevronLeft size={30} />
            </button>
            <TabsList>
              {stages.map(({ name }, idx) => (
                <TabsTrigger value={name} key={idx}>
                  {name}
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
