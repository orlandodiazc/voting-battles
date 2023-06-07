import { useBoardSelector } from "../hooks/hooks";
import { ReactNode } from "react";
import { Player } from "../redux/slices/boardSlice";

function Cell({ children }: { children: ReactNode }) {
  return <td className="border p-2">{children}</td>;
}

function PlayerRow({
  playerScores,
  playerName,
}: {
  playerScores: Player;
  playerName: string;
}) {
  const stageScores = playerScores.map(
    ({ values, extraValues }) =>
      values.reduce((acc, curr) => acc + Number(curr), 0) +
      (extraValues?.reduce((acc, curr) => acc + (curr ? 1 : 0), 0) ?? 0),
    0
  );

  const playerBoardTotal = stageScores.reduce((acc, curr) => acc + curr, 0);
  return (
    <tr>
      <Cell>{playerName}</Cell>
      {stageScores.map((value, idx) => (
        <Cell key={idx}>{value}</Cell>
      ))}
      <Cell>{playerBoardTotal}</Cell>
    </tr>
  );
}

export default function Results() {
  const stageNames = useBoardSelector((state) =>
    state.settings.stages.map((stage) => stage.name)
  );
  const playerNames = useBoardSelector((state) => state.settings.players);
  const scores = useBoardSelector((state) => state.scores);

  return (
    <>
      <h2 className="-ms-2 mb-2">Resultados</h2>
      <table className="text-sm text-center max-w-xl">
        <thead>
          <tr>
            <th></th>
            {stageNames.map((name, idx) => (
              <th
                key={idx}
                className="bg-muted border px-2 py-1 whitespace-nowrap"
              >
                {name}
              </th>
            ))}
            <th className="bg-muted border px-2 py-1 whitespace-nowrap">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {scores.map((player, idx) => (
            <PlayerRow
              key={idx}
              playerScores={player}
              playerName={playerNames[idx].name}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
