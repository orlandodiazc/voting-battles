import clsx from "clsx";
import Input from "./input";

export default function Player({
  breakValues,
  playerId,
  values,
  changeBoard,
}: {
  totalInputLength: number;
  breakValues: number[];
  playerId: number;
  values: string[];
  changeBoard: (playerId: number, value: string, inputId: number) => void;
}) {
  return (
    <>
      {values.map((value, idx) => {
        const padding = breakValues.some((breakIdx) => breakIdx === idx)
          ? "ps-2"
          : "ps-0.5";
        return (
          <td className={clsx(padding)} key={idx}>
            <Input
              id={idx}
              value={value}
              changeValue={(value, inputId) =>
                changeBoard(playerId, value, inputId)
              }
            />
          </td>
        );
      })}
      <td className="text-center">
        <input
          className="w-8 h-8 text-center bg-foreground text-background rounded disabled:bg-gray-500"
          disabled={true}
          defaultValue="0"
        />
      </td>
    </>
  );
}
