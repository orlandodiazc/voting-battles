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
      <section className="bg-slate-900 px-6 py-8 rounded-lg min-w-[600px] max-w-xl grid">
        <Tabs
          value={stages[index].name}
          onValueChange={(value) =>
            setIndex(stages.findIndex((stage) => stage.name === value))
          }
        >
          <Board />
          <div className="flex justify-center">
            <button onClick={() => updateIndex(index - 1)}>
              <MdChevronLeft size={26} />
            </button>
            <TabsList>
              {stages.map(({ name }, idx) => (
                <TabsTrigger value={name} key={idx}>
                  {name === "Results" ? name : idx}
                </TabsTrigger>
              ))}
            </TabsList>
            <button onClick={() => updateIndex(index + 1)}>
              <MdChevronRight size={26} />
            </button>
          </div>
        </Tabs>
      </section>
    </main>
  );
}
