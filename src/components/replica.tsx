import { MdSwapVert } from "react-icons/md";

import { useBoardDispatch, useBoardSelector } from "../hooks/hooks";
import { toggleOption } from "../redux/slices/boardSlice";
import Player from "./player";
import { Button } from "./ui/button";
import TableBody from "./ui/vote-table";

export default function Replica({
	replicaId,
	regularLength,
}: {
	regularLength: number;
	replicaId: number;
}) {
	const dispatch = useBoardDispatch();

	const scores = useBoardSelector((state) => state.scores.replicas);
	const { setup } = useBoardSelector((state) => state.settings.stages.replica);
	const isSwitchOrder = useBoardSelector(
		(state) => state.settings.options.isSwitchReplicaPlayers
	);
	const players = useBoardSelector((state) => state.settings.players);
	const draftPlayers =
		(replicaId + regularLength) % 2 === (isSwitchOrder ? 1 : 0)
			? players
			: [...players].reverse();

	return (
		<div className="flex items-center justify-center gap-2">
			{replicaId === 0 && (
				<span className="-mt-1">
					<Button
						variant={"ghost"}
						title="Cambiar Jugadores"
						onClick={() =>
							dispatch(toggleOption({ option: "TOGGLE_REPLICA_ORDER" }))
						}
					>
						<MdSwapVert size={20} />
					</Button>
				</span>
			)}
			<TableBody setup={setup} stageName={`Replica ${replicaId + 1}`}>
				{draftPlayers.map(({ name, id }) => {
					return (
						<Player
							playerId={id}
							stageId={replicaId}
							setup={setup}
							name={name}
							values={scores[id][replicaId].values}
							key={id}
							type={"replica"}
						/>
					);
				})}
			</TableBody>
		</div>
	);
}
