import { useCallback, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";

import { useBoardSelector } from "./hooks/hooks";
import Board from "./components/board";
import Settings from "./components/settings";
import clsx from "clsx";

export default function App() {
  const stageNames = useBoardSelector((state) =>
    state.settings.stages.map((stage) => stage.name)
  );
  const players = useBoardSelector((state) => state.settings.players);
  const [value, setValue] = useState("Incremental");
  const tabListRef = useRef<HTMLDivElement | null>(null);

  const getTriggers = useCallback((): HTMLElement[] => {
    if (!tabListRef.current) return [];
    return Array.from(
      tabListRef.current.querySelectorAll("[data-radix-collection-item]")
    );
  }, [tabListRef]);

  function handleClick(direction: "LEFT" | "RIGHT") {
    const domTriggers = getTriggers();
    const currIndex = domTriggers.findIndex((el) => el.dataset.value === value);
    const newValue = domTriggers.at(
      currIndex + (direction === "RIGHT" ? 1 : currIndex === 0 ? 0 : -1)
    )?.dataset.value;
    if (!newValue) return;
    setValue(newValue);
  }
  return (
    <main className="min-h-screen grid place-content-center">
      <Tabs value={value} onValueChange={(value) => setValue(value)} asChild>
        <section className="w-[560px]">
          <div className="flex justify-between bg-muted px-2">
            <button onClick={() => handleClick("LEFT")} tabIndex={-1}>
              <MdChevronLeft size={26} />
            </button>
            <TabsList ref={tabListRef} tabIndex={-1}>
              {stageNames.map((name, idx) => (
                <TabsTrigger value={name} key={idx}>
                  {name}
                </TabsTrigger>
              ))}
              <TabsTrigger value="Results" className="text-yellow-600">
                R
              </TabsTrigger>
            </TabsList>
            <button onClick={() => handleClick("RIGHT")} tabIndex={-1}>
              <MdChevronRight size={26} />
            </button>
          </div>
          <div className="h-40">
            <Board tabValue={value} />
            <div
              className={clsx(
                "flex justify-center gap-2 text-sm",
                value === "Results" && "hidden"
              )}
            >
              <span>TOTAL</span>
              {players.map(({ name, id }) => (
                <span key={id}>{name}:</span>
              ))}
            </div>
          </div>
        </section>
      </Tabs>
      <section>
        <Settings />
      </section>
    </main>
  );
}
