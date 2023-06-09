import { TabsContent } from "@radix-ui/react-tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import Board from "./components/board";
import PlayerSums from "./components/player-sums";
import Replica from "./components/replica";
import Results from "./components/results";
import Settings from "./components/settings";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { useBoardSelector } from "./hooks/hooks";

type ReplicaT = { element: JSX.Element; triggerValue: string };

export default function App() {
	const stageNames = useBoardSelector((state) =>
		state.settings.stages.regular.map((stage) => stage.name)
	);
	const [value, setValue] = useState("Incremental");
	const [replicas, setReplicas] = useState<ReplicaT[]>([]);
	const tabListRef = useRef<HTMLDivElement | null>(null);

	const getTriggers = useCallback((): HTMLElement[] => {
		if (!tabListRef.current) return [];
		return Array.from(
			tabListRef.current.querySelectorAll("[data-radix-collection-item]")
		);
	}, [tabListRef]);

	useEffect(() => {
		if (replicas.length === 0) return;
		setValue(replicas[replicas.length - 1].triggerValue);
	}, [replicas]);

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
		<main className="min-h-screen max-w-xl mx-auto">
			<Tabs value={value} onValueChange={(value) => setValue(value)} asChild>
				<section className="overflow-x-auto">
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
							{replicas.map(({ triggerValue }, idx) => (
								<TabsTrigger key={idx} value={triggerValue}>
									{triggerValue}
								</TabsTrigger>
							))}
						</TabsList>
						<button onClick={() => handleClick("RIGHT")} tabIndex={-1}>
							<MdChevronRight size={26} />
						</button>
					</div>
					<div className="flex flex-col h-[150px] justify-center w-[560px]">
						<Board />
						<TabsContent value="Results">
							<Results
								newReplica={() => {
									setReplicas(
										replicas.concat({
											triggerValue: `Replica ${replicas.length + 1}`,
											element: <Replica />,
										})
									);
								}}
							/>
						</TabsContent>
						{replicas.map(({ element, triggerValue }, idx) => (
							<TabsContent value={triggerValue} key={idx}>
								{element}
							</TabsContent>
						))}
						<PlayerSums tabValue={value} />
					</div>
				</section>
			</Tabs>
			<section>
				<Settings />
			</section>
		</main>
	);
}
