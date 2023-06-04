import clsx from "clsx";
import Input from "./input";

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
  const totalPlayer = values.reduce((acc, curr) => acc + Number(curr), 0);
  return (
    <>
      {values.map((value, idx) => {
        const padding = breakValues.some((breakIdx) => breakIdx === idx)
          ? "ps-2"
          : "ps-0.5";

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
