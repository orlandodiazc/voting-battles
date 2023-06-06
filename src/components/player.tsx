import clsx from "clsx";
import Input from "./input";
import { useBoardSelector } from "../hooks/hooks";

export default function Player({
  breakValues,
  playerId,
  stageId,
  values,
}: {
  breakValues: number[];
  playerId: number;
  stageId: number;
  values: string[];
}) {
  const stage = useBoardSelector((state) => state.scores[playerId][stageId]);
  const totalPlayer =
    stage.values.reduce((acc, curr) => acc + Number(curr), 0) +
    (stage.extraValues?.reduce((acc, curr) => acc + (curr ? 1 : 0), 0) ?? 0);
  return (
    <>
      {values.map((value, idx) => {
        const padding = breakValues.some((breakIdx) => breakIdx - 1 === idx)
          ? "pe-4"
          : "pe-0.5";

        const maxValue = idx >= values.length - 3 ? 2 : 4;
        return (
          <td className={clsx(padding, "text-center")} key={idx}>
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
          className="w-8 h-8 text-center bg-foreground text-background rounded disabled:bg-gray-500"
          disabled={true}
          value={totalPlayer}
        />
      </td>
    </>
  );
}
