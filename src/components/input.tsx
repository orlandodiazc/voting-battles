import isHotkey from "is-hotkey";
import {
  RovingTabindexItem,
  getNextFocused,
  getPrevFocusableId,
  getPrevFocused,
  useRovingTabindex,
} from "./roving-tabindex";
import { ChangeEvent } from "react";
import { useBoardDispatch, useBoardSelector } from "../hooks/hooks";
import { setVote } from "../redux/slices/boardSlice";

export default function Input({
  inputId,
  value,
  playerId,
  stageId,
  maxValue,
}: {
  inputId: number;
  value: string;
  playerId: number;
  stageId: number;
  maxValue: number;
}) {
  const focusLocation = {
    rowId: stageId % 2 === 0 ? playerId : playerId === 0 ? 1 : 0,
    cellId: inputId,
  };
  const { getOrderedItems, getRovingProps } = useRovingTabindex(focusLocation);
  const { stages } = useBoardSelector((state) => state.settings);
  const dispatch = useBoardDispatch();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    let currentValue = e.target.value;
    if (currentValue.length >= 2 && currentValue.slice(-2) !== ".5") {
      currentValue = currentValue.slice(-1);
    }
    if (Number(currentValue) > maxValue) currentValue = maxValue.toString();
    if (Number(currentValue) < 0) currentValue = "0";
    dispatch(setVote({ playerId, stageId, inputId, newValue: currentValue }));
  }

  return (
    <input
      type="number"
      className="w-8 h-8 text-center bg-foreground text-background rounded"
      value={value}
      step="0.5"
      onChange={handleChange}
      {...getRovingProps<"input">({
        onKeyDown: (e) => {
          if (isHotkey(["+", "-", "e"], e)) {
            e.preventDefault();
          }

          if (isHotkey(["backspace", "delete"], e)) {
            e.preventDefault();
            dispatch(setVote({ playerId, stageId, inputId, newValue: "" }));
          }

          if (isHotkey("space", e) || e.code === "NumpadDecimal") {
            e.preventDefault();
            if (value.slice(-2) === ".5" || value === "4") return;

            dispatch(
              setVote({
                playerId,
                stageId,
                inputId,
                newValue: `${value ? value : "0"}.5`,
              })
            );
          }
          if (isHotkey(["right", "tab", "left"], e)) {
            const items = getOrderedItems();
            let nextItem: RovingTabindexItem | undefined;
            if (isHotkey(["right", "tab"], e)) {
              e.preventDefault();
              nextItem = getNextFocused(
                items,
                focusLocation,
                stages[stageId].type
              );
            } else if (isHotkey("left", e)) {
              nextItem = getPrevFocused(
                items,
                focusLocation,
                stages[stageId].type
              );
            }
            nextItem?.element.focus();
          }
        },
      })}
    />
  );
}
