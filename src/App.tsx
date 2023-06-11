import { TabsContent } from "@radix-ui/react-tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { twMerge } from "tailwind-merge";

import Board from "./components/board";
import PlayerSums from "./components/player-sums";
import Replica from "./components/replica";
import Results from "./components/results";
import Settings from "./components/settings";
import { Button } from "./components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { useBoardDispatch, useBoardSelector } from "./hooks/hooks";
import { addReplica } from "./redux/slices/boardSlice";

type ReplicaT = { element: JSX.Element; triggerValue: string };

export default function App() {
	const stageNames = useBoardSelector((state) =>
		state.settings.stages.regular.map((stage) => stage.name)
	);
	const [value, setValue] = useState(stageNames[0]);

	const [replicas, setReplicas] = useState<ReplicaT[]>([]);
	const dispatch = useBoardDispatch();

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

	function newReplica() {
		if (replicas.length >= 3) return;
		dispatch(addReplica());
		setReplicas(
			replicas.concat({
				triggerValue: `Replica ${replicas.length + 1}`,
				element: <Replica replicaId={replicas.length} />,
			})
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
		<main className="min-h-screen max-w-xl mx-auto">
			<Tabs value={value} onValueChange={(value) => setValue(value)} asChild>
				<section className="flex flex-col">
					<div className="overflow-x-auto pt-5">
						<Board />
						<TabsContent value="Results">
							<Results />
						</TabsContent>
						{replicas.map(({ element, triggerValue }, idx) => {
							return (
								<TabsContent value={triggerValue} key={idx}>
									{element}
								</TabsContent>
							);
						})}
					</div>
					<div className="h-8 flex justify-center items-center mb-4">
						<PlayerSums tabValue={value} />
						<span
							className={twMerge(
								stageNames.some((stage) => stage === value) && "hidden"
							)}
						>
							<Button onClick={newReplica} disabled={replicas.length === 3}>
								+ Replica
							</Button>
						</span>
					</div>
					<div className="flex justify-between bg-muted px-2 overflow-x-auto border-b-2">
						<button onClick={() => handleClick("LEFT")} tabIndex={-1}>
							<MdChevronLeft size={26} />
						</button>
						<TabsList ref={tabListRef} tabIndex={-1}>
							{stageNames.map((name, idx) => (
								<TabsTrigger
									value={name}
									key={idx}
									className="aspect-square w-8"
								>
									{idx}
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
				</section>
			</Tabs>
			<section>
				<Settings />
			</section>
		</main>
	);
}
