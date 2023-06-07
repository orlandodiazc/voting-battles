import clsx from "clsx";
import Input from "./input";
import { useBoardSelector } from "../hooks/hooks";

export default function Player({
  breakValues,
  playerId,
  stageId,
}: {
  breakValues: number[];
  playerId: number;
  stageId: number;
}) {
  const { values, extraValues } = useBoardSelector(
    (state) => state.scores[playerId][stageId]
  );
  const playerTotal =
    values.reduce((acc, curr) => acc + Number(curr), 0) +
    (extraValues?.reduce((acc, curr) => acc + (curr ? 1 : 0), 0) ?? 0);
  return (
    <>
      {values.map((value, idx) => {
        const padding = breakValues.some((breakIdx) => breakIdx === idx)
          ? "border-s-14"
          : "border-s";

        const maxValue = idx >= values.length - 3 ? 2 : 4;
        return (
          <td
            className={clsx(padding, "text-center border-transparent")}
            key={idx}
          >
            <Input
              playerId={playerId}
              inputId={idx}
              stageId={stageId}
              value={value}
              maxValue={maxValue}
            />
          </td>
        );
      })}
      <td className="text-center align-top">
        <input
          className="w-8 h-8 text-center text-background rounded disabled:bg-muted-foreground"
          disabled={true}
          value={playerTotal}
        />
      </td>
    </>
  );
}
