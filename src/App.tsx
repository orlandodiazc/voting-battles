import { useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";

import { useBoardSelector } from "./hooks/hooks";
import Board from "./components/board";

export default function App() {
  const stageNames = useBoardSelector((state) =>
    state.settings.stages.map((stage) => stage.name)
  );
  const [value, setValue] = useState("Incremental");
  const tabListRef = useRef<HTMLDivElement | null>(null);

  function getTriggers(): HTMLElement[] {
    if (!tabListRef.current) return [];
    return Array.from(
      tabListRef.current.querySelectorAll("[data-radix-collection-item]")
    );
  }

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
      <section>
        <div>
          <Tabs value={value} onValueChange={(value) => setValue(value)}>
            <Board />
            <div className="flex justify-center">
              <button onClick={() => handleClick("LEFT")}>
                <MdChevronLeft size={26} />
              </button>
              <TabsList ref={tabListRef}>
                {stageNames.map((name, idx) => (
                  <TabsTrigger value={name} key={idx}>
                    {idx}
                  </TabsTrigger>
                ))}
                <TabsTrigger value="Results">R</TabsTrigger>
              </TabsList>
              <button onClick={() => handleClick("RIGHT")}>
                <MdChevronRight size={26} />
              </button>
            </div>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
