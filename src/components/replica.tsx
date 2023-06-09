import { useBoardSelector } from "../hooks/hooks";
import Player from "./player";
import TableBody from "./ui/vote-table";

export default function Replica({ replicaId }: { replicaId: number }) {
	const players = useBoardSelector((state) => state.settings.players);
	const { setup } = useBoardSelector((state) => state.settings.stages.replica);
	const scores = useBoardSelector((state) => state.scores.replicas);
	const draftPlayers = replicaId % 2 === 0 ? players : [...players].reverse();
	return (
		<>
			<TableBody setup={setup}>
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
		</>
	);
}
