import isHotkey from "is-hotkey";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
  FocusEvent,
  MouseEvent,
  KeyboardEvent,
  ComponentPropsWithoutRef,
  ElementType,
  MutableRefObject,
} from "react";
import { StageType } from "../redux/slices/boardSlice";

type Location = { rowId: number; cellId: number };

export type RovingTabindexItem = {
  location: Location;
  element: HTMLElement;
};

function focusFirst(candidates: HTMLElement[]) {
  const previousFocus = document.activeElement;
  while (document.activeElement === previousFocus && candidates.length > 0) {
    candidates.shift()?.focus();
  }
}

type RovingTabindexContext = {
  currentRovingTabindexValue: Location | null;
  setFocusableId: (location: Location) => void;
  onShiftTab: () => void;
  getOrderedItems: () => RovingTabindexItem[];
  elements: MutableRefObject<Map<Location, HTMLElement>>;
};

const RovingTabindexContext = createContext<RovingTabindexContext>({
  currentRovingTabindexValue: null,
  setFocusableId: () => {},
  onShiftTab: () => {},
  getOrderedItems: () => [],
  elements: { current: new Map<Location, HTMLElement>() },
});

const NODE_SELECTOR = "data-roving-tabindex-node";
const ROOT_SELECTOR = "data-roving-tabindex-root";
export const NOT_FOCUSABLE_SELECTOR = "data-roving-tabindex-not-focusable";

type RovingTabindexRootBaseProps<T> = {
  children: ReactNode | ReactNode[];
  active: Location | null;
  as?: T;
};

type RovingTabindexRootProps<T extends ElementType> =
  RovingTabindexRootBaseProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof RovingTabindexRootBaseProps<T>>;

export function RovingTabindexRoot<T extends ElementType>({
  children,
  active,
  as,
  ...props
}: RovingTabindexRootProps<T>) {
  const Component = as || "div";
  const [isShiftTabbing, setIsShiftTabbing] = useState(false);
  const [currentRovingTabindexValue, setCurrentRovingTabindexValue] =
    useState<Location | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const elements = useRef<Map<Location, HTMLElement>>(new Map());

  const getOrderedItems = useCallback(() => {
    if (!rootRef.current) return [];
    const domElements = Array.from(
      rootRef.current.querySelectorAll(
        `:where([${NODE_SELECTOR}=true]):not(:where([${NOT_FOCUSABLE_SELECTOR}=true] *))`
      )
    );

    return Array.from(elements.current)
      .sort((a, b) => domElements.indexOf(a[1]) - domElements.indexOf(b[1]))
      .map(([location, element]) => ({ location, element }));
  }, []);

  return (
    <RovingTabindexContext.Provider
      value={{
        setFocusableId: function (location: Location) {
          setCurrentRovingTabindexValue(location);
        },
        onShiftTab: function () {
          setIsShiftTabbing(true);
        },
        currentRovingTabindexValue,
        getOrderedItems,
        elements,
      }}
    >
      <Component
        {...{ [ROOT_SELECTOR]: true }}
        tabIndex={isShiftTabbing ? -1 : 0}
        onFocus={(e) => {
          if (e.target !== e.currentTarget) return;
          if (isShiftTabbing) return;
          const orderedItems = getOrderedItems();
          if (orderedItems.length === 0) return;

          const candidates = [
            elements.current.get(
              currentRovingTabindexValue ?? { rowId: -1, cellId: -1 }
            ),
            elements.current.get(active ?? { rowId: -1, cellId: -1 }),
            ...orderedItems.map((i) => i.element),
          ].filter((element): element is HTMLElement => element != null);

          focusFirst(candidates);
        }}
        onBlur={() => setIsShiftTabbing(false)}
        ref={rootRef}
        {...props}
      >
        {children}
      </Component>
    </RovingTabindexContext.Provider>
  );
}

export function getNextFocusableId(
  orderedItems: RovingTabindexItem[],
  location: Location
): RovingTabindexItem | undefined {
  const currIndex = orderedItems.findIndex(
    (item) => item.location === location
  );
  return orderedItems.at(currIndex === orderedItems.length ? 0 : currIndex + 1);
}

export function getNextFocused(
  orderedItems: RovingTabindexItem[],
  location: Location,
  type: StageType
): RovingTabindexItem | undefined {
  const { rowId, cellId } = location;
  let locationDraft = { rowId: -1, cellId: -1 };
  const itemsLength = orderedItems.length;
  switch (type) {
    case "MINUTE":
    case "MINUTE_ANS": {
      const currIndex = orderedItems.findIndex(
        ({ location: checkedLocation }) =>
          checkedLocation.rowId === rowId && checkedLocation.cellId === cellId
      );
      return orderedItems.at(
        currIndex === orderedItems.length ? 0 : currIndex + 1
      );
    }
    case "4X4": {
      if (itemsLength / 2 - 1 === cellId && rowId === 0) {
        locationDraft = { rowId: 1, cellId: location.cellId - 2 };
      } else if (cellId < itemsLength / 2 - 3) {
        locationDraft =
          location.rowId === 0
            ? { ...location, rowId: 1 }
            : { rowId: 0, cellId: location.cellId + 1 };
      } else {
        locationDraft = { ...location, cellId: location.cellId + 1 };
      }

      return orderedItems.find(
        ({ location: checkedLocation }) =>
          checkedLocation.rowId === locationDraft.rowId &&
          checkedLocation.cellId === locationDraft.cellId
      );
    }
    case "8X8": {
      if (cellId >= orderedItems.length / 2 - 3) {
        if (orderedItems.length / 2 - 1 === cellId && rowId === 0) {
          locationDraft = { rowId: 1, cellId: location.cellId - 2 };
        } else {
          locationDraft = { ...location, cellId: location.cellId + 1 };
        }
      } else {
        if (location.cellId % 2 === 0) {
          locationDraft = { ...location, cellId: cellId + 1 };
        } else if (rowId === 0) {
          locationDraft = { rowId: 1, cellId: cellId - 1 };
        } else {
          locationDraft = { rowId: 0, cellId: cellId + 1 };
        }
      }

      if (itemsLength / 2 - 1 === cellId && rowId === 0) {
        locationDraft = { rowId: 1, cellId: cellId - 2 };
      } else if (cellId >= itemsLength / 2 - 3 || location.cellId % 2 === 0) {
        locationDraft = { ...location, cellId: cellId + 1 };
      } else {
        locationDraft =
          rowId === 0
            ? { rowId: 1, cellId: cellId - 1 }
            : { rowId: 0, cellId: cellId + 1 };
      }

      return orderedItems.find(
        ({ location: checkedLocation }) =>
          checkedLocation.rowId === locationDraft.rowId &&
          checkedLocation.cellId === locationDraft.cellId
      );
    }
    default:
  }
}

export function getPrevFocused(
  orderedItems: RovingTabindexItem[],
  location: Location,
  type: StageType
): RovingTabindexItem | undefined {
  const { rowId, cellId } = location;

  switch (type) {
    case "MINUTE":
    case "MINUTE_ANS": {
      const currIndex = orderedItems.findIndex(
        ({ location: checkedLocation }) =>
          checkedLocation.rowId === rowId && checkedLocation.cellId === cellId
      );
      return orderedItems.at(
        currIndex === orderedItems.length ? 0 : currIndex - 1
      );
    }
    case "4X4": {
      let locationDraft = { rowId: -1, cellId: -1 };
      if (cellId >= orderedItems.length / 2 - 3) {
        if (orderedItems.length / 2 - 3 === cellId && rowId === 1) {
          locationDraft = { rowId: 0, cellId: location.cellId + 2 };
        } else if (orderedItems.length / 2 - 3 === cellId && rowId === 0) {
          locationDraft = { rowId: 1, cellId: location.cellId - 1 };
        } else {
          locationDraft = { ...location, cellId: location.cellId - 1 };
        }
      } else {
        locationDraft =
          location.rowId === 0
            ? { rowId: 1, cellId: location.cellId - 1 }
            : { ...location, rowId: 0 };
      }

      return orderedItems.find(
        ({ location: checkedLocation }) =>
          checkedLocation.rowId === locationDraft.rowId &&
          checkedLocation.cellId === locationDraft.cellId
      );
    }
    case "8X8": {
      let locationDraft = { rowId: -1, cellId: -1 };
      if (cellId >= orderedItems.length / 2 - 3) {
        if (orderedItems.length / 2 - 3 === cellId && rowId === 1) {
          locationDraft = { rowId: 0, cellId: location.cellId + 2 };
        } else if (orderedItems.length / 2 - 3 === cellId && rowId === 0) {
          locationDraft = { rowId: 1, cellId: location.cellId - 1 };
        } else {
          locationDraft = { ...location, cellId: location.cellId - 1 };
        }
      } else {
        if (!(location.cellId % 2 === 0)) {
          locationDraft = { ...location, cellId: cellId - 1 };
        } else if (rowId === 0) {
          locationDraft = { rowId: 1, cellId: cellId - 1 };
        } else {
          locationDraft = { rowId: 0, cellId: cellId + 1 };
        }
      }
      return orderedItems.find(
        ({ location: checkedLocation }) =>
          checkedLocation.rowId === locationDraft.rowId &&
          checkedLocation.cellId === locationDraft.cellId
      );
    }
    default:
  }
}

export function getPrevFocusableId(
  orderedItems: RovingTabindexItem[],
  location: Location
): RovingTabindexItem | undefined {
  const currIndex = orderedItems.findIndex(
    (item) => item.location === location
  );
  if (currIndex === 0) return;
  return orderedItems.at(currIndex - 1);
}

export function useRovingTabindex(location: Location) {
  const {
    currentRovingTabindexValue,
    setFocusableId,
    onShiftTab,
    getOrderedItems,
    elements,
  } = useContext(RovingTabindexContext);
  const { rowId, cellId } = location;
  return {
    getOrderedItems,
    isFocusable:
      currentRovingTabindexValue?.cellId === cellId &&
      currentRovingTabindexValue?.rowId === rowId,
    getRovingProps: <T extends ElementType>(
      props?: ComponentPropsWithoutRef<T>
    ) => ({
      ...props,
      ref: (element: HTMLElement | null) => {
        if (element) {
          elements.current.set(location, element);
        } else {
          elements.current.delete(location);
        }
      },
      onMouseDown: (e: MouseEvent) => {
        props?.onMouseDown?.(e);
        if (e.target !== e.currentTarget) return;
        setFocusableId(location);
      },
      onKeyDown: (e: KeyboardEvent) => {
        props?.onKeyDown?.(e);
        if (e.target !== e.currentTarget) return;
        if (isHotkey("shift+tab", e)) {
          onShiftTab();
          return;
        }
      },
      onFocus: (e: FocusEvent) => {
        props?.onFocus?.(e);
        if (e.target !== e.currentTarget) return;
        setFocusableId(location);
      },
      [NODE_SELECTOR]: true,
      tabIndex: currentRovingTabindexValue === location ? 0 : -1,
    }),
  };
}
