import isHotkey from "is-hotkey";
import {
  RovingTabindexItem,
  getNextFocusableId,
  getPrevFocusableId,
  useRovingTabindex,
} from "./roving-tabindex";
import { ChangeEvent } from "react";
import { useBoardDispatch } from "../hooks/hooks";
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
  const focusId = playerId.toString() + inputId.toString();
  const { getOrderedItems, getRovingProps } = useRovingTabindex(focusId);

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
          if (isHotkey("+", e) || isHotkey("-", e) || isHotkey("e", e)) {
            e.preventDefault();
          }

          if (isHotkey("backspace", e) || isHotkey("delete", e)) {
            e.preventDefault();
            dispatch(setVote({ playerId, stageId, inputId, newValue: "" }));
          }

          if (isHotkey("space", e) || isHotkey(".", e)) {
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
          if (
            isHotkey("right", e) ||
            isHotkey("tab", e) ||
            isHotkey("left", e)
          ) {
            const items = getOrderedItems();
            let nextItem: RovingTabindexItem | undefined;
            if (isHotkey("right", e) || isHotkey("tab", e)) {
              e.preventDefault();
              nextItem = getNextFocusableId(items, focusId);
            } else if (isHotkey("left", e)) {
              nextItem = getPrevFocusableId(items, focusId);
            }
            nextItem?.element.focus();
          }
        },
      })}
    />
  );
}
