import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";

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

export default function App() {
  const [index, setIndex] = useState(0);
  function updateIndex(newIndex: number) {
    if (newIndex < 0 || newIndex > settings.stages.length - 1) return;
    setIndex(newIndex);
  }
  return (
    <main className="min-h-screen grid place-content-center">
      <section className="bg-slate-900 px-8 py-6 rounded-lg">
        <Tabs
          value={settings.stages[index].name}
          className="flex flex-col items-center gap-3"
          onValueChange={(value) =>
            setIndex(settings.stages.findIndex((stage) => stage.name === value))
          }
        >
          {settings.stages.map(({ name: stageName }, idx) => (
            <TabsContent value={stageName} key={idx}>
              <h2 className="mb-2">{stageName}</h2>
              <div>
                <div className="inline-flex items-center gap-3">
                  <span>player 1</span>
                  {settings.stages[idx].setup.map((inputsLength) => (
                    <span className="space-x-1">
                      {Array.from(Array(inputsLength).keys()).map(
                        (inputIdx) => (
                          <input
                            value={inputIdx}
                            className="w-8 h-8 rounded text-center bg-foreground text-background"
                          />
                        )
                      )}
                    </span>
                  ))}
                  <span className="text-[10px] flex gap-4">
                    <div className="relative">
                      <span className="text-center absolute -top-[1.5ch] -translate-y-1/2 -translate-x-[1ch] w-[7ch]">
                        Tecnicas
                      </span>
                      <input
                        value="0"
                        className="w-8 h-8 rounded text-center bg-foreground text-background"
                      />
                    </div>
                    <div className="relative">
                      <span className="text-center absolute -top-[1.5ch] -translate-y-1/2 -translate-x-[1ch] w-[7ch]">
                        Flow
                      </span>
                      <input
                        value="0"
                        className="w-8 h-8 rounded text-center bg-foreground text-background"
                      />
                    </div>
                    <div className="relative">
                      <span className="text-center absolute -top-[1.5ch] -translate-y-1/2 -translate-x-[1ch] w-[7ch]">
                        Escena
                      </span>
                      <input
                        value="0"
                        className="w-8 h-8 rounded text-center bg-foreground text-background"
                      />
                    </div>
                  </span>
                </div>
                <div>
                  <span>player 2</span>
                </div>
              </div>
            </TabsContent>
          ))}
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
