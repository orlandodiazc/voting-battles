import isHotkey from "is-hotkey";
import {
	ComponentPropsWithoutRef,
	createContext,
	ElementType,
	FocusEvent,
	KeyboardEvent,
	MouseEvent,
	MutableRefObject,
	ReactNode,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";

import { StageType } from "../redux/slices/boardSlice";

type Location = { cellId: number; rowId: number };

export type RovingTabindexItem = {
	element: HTMLElement;
	location: Location;
};

function focusFirst(candidates: HTMLElement[]) {
	const previousFocus = document.activeElement;
	while (document.activeElement === previousFocus && candidates.length > 0) {
		candidates.shift()?.focus();
	}
}

type RovingTabindexContext = {
	currentRovingTabindexValue: Location | null;
	elements: MutableRefObject<Map<Location, HTMLElement>>;
	getOrderedItems: () => RovingTabindexItem[];
	onShiftTab: () => void;
	setFocusableId: (location: Location) => void;
};

const RovingTabindexContext = createContext<RovingTabindexContext>({
	currentRovingTabindexValue: null,
	setFocusableId: () => undefined,
	onShiftTab: () => undefined,
	getOrderedItems: () => [],
	elements: { current: new Map<Location, HTMLElement>() },
});

const NODE_SELECTOR = "data-roving-tabindex-node";
const ROOT_SELECTOR = "data-roving-tabindex-root";
export const NOT_FOCUSABLE_SELECTOR = "data-roving-tabindex-not-focusable";

type RovingTabindexRootBaseProps<T> = {
	active: Location | null;
	as?: T;
	children: ReactNode | ReactNode[];
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
							currentRovingTabindexValue ?? { rowId: 0, cellId: 0 }
						),
						elements.current.get(active ?? { rowId: 0, cellId: 0 }),
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

function getItemToFocus(
	orderedItems: RovingTabindexItem[],
	locationDraft: Location
): RovingTabindexItem | undefined {
	return orderedItems.find(
		(element) =>
			element.location.rowId === locationDraft.rowId &&
			element.location.cellId === locationDraft.cellId
	);
}

export function getNextFocused(
	orderedItems: RovingTabindexItem[],
	location: Location,
	type: StageType
): RovingTabindexItem | undefined {
	let locationDraft = { rowId: -1, cellId: -1 };
	const itemsLength = orderedItems.length;
	const isLastExtra = itemsLength / 2 - 1 === location.cellId;
	const isRowZero = location.rowId === 0;
	switch (type) {
		case "MINUTE":
		case "MINUTE_ANS": {
			const currIndex = orderedItems.findIndex(
				(element) =>
					element.location.rowId === location.rowId &&
					element.location.cellId === location.cellId
			);
			if (location.rowId === 1 && isLastExtra) return;
			return orderedItems.at(currIndex === itemsLength ? 0 : currIndex + 1);
		}
		case "4X4": {
			if (isLastExtra && isRowZero) {
				locationDraft = { rowId: 1, cellId: location.cellId - 2 };
			} else if (location.cellId < itemsLength / 2 - 3) {
				locationDraft = isRowZero
					? { ...location, rowId: 1 }
					: { rowId: 0, cellId: location.cellId + 1 };
			} else {
				locationDraft = { ...location, cellId: location.cellId + 1 };
			}

			return getItemToFocus(orderedItems, locationDraft);
		}
		case "8X8": {
			if (isLastExtra && isRowZero) {
				locationDraft = { rowId: 1, cellId: location.cellId - 2 };
			} else if (
				location.cellId >= itemsLength / 2 - 3 ||
				location.cellId % 2 === 0
			) {
				locationDraft = { ...location, cellId: location.cellId + 1 };
			} else {
				locationDraft = isRowZero
					? { rowId: 1, cellId: location.cellId - 1 }
					: { rowId: 0, cellId: location.cellId + 1 };
			}

			return getItemToFocus(orderedItems, locationDraft);
		}
	}
	return undefined;
}

export function getPrevFocused(
	orderedItems: RovingTabindexItem[],
	location: Location,
	type: StageType
): RovingTabindexItem | undefined {
	let locationDraft = { rowId: -1, cellId: -1 };
	const itemsLength = orderedItems.length;
	const isRowZero = location.rowId === 0;
	const isFirstExtra = orderedItems.length / 2 - 3 === location.cellId;
	switch (type) {
		case "MINUTE":
		case "MINUTE_ANS": {
			const currIndex = orderedItems.findIndex(
				(element) =>
					element.location.rowId === location.rowId &&
					element.location.cellId === location.cellId
			);
			if (isRowZero && location.cellId === 0) return;
			return orderedItems.at(currIndex === itemsLength ? 0 : currIndex - 1);
		}
		case "4X4": {
			if (isFirstExtra) {
				locationDraft = isRowZero
					? (locationDraft = { rowId: 1, cellId: location.cellId - 1 })
					: (locationDraft = { rowId: 0, cellId: location.cellId + 2 });
			} else if (location.cellId > orderedItems.length / 2 - 3) {
				locationDraft = { ...location, cellId: location.cellId - 1 };
			} else {
				locationDraft = isRowZero
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
			if (isFirstExtra && !isRowZero) {
				locationDraft = locationDraft = {
					rowId: 0,
					cellId: location.cellId + 2,
				};
			} else if (
				location.cellId > orderedItems.length / 2 - 3 ||
				location.cellId % 2 === 1
			) {
				locationDraft = { ...location, cellId: location.cellId - 1 };
			} else {
				locationDraft = isRowZero
					? { rowId: 1, cellId: location.cellId - 1 }
					: { rowId: 0, cellId: location.cellId + 1 };
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

export function getFirstFocusableId(
	orderedItems: RovingTabindexItem[]
): RovingTabindexItem | undefined {
	return orderedItems.at(0);
}

export function getLastFocusableId(
	orderedItems: RovingTabindexItem[]
): RovingTabindexItem | undefined {
	return orderedItems.at(-1);
}

export function useRovingTabindex(location: Location) {
	const {
		currentRovingTabindexValue,
		setFocusableId,
		onShiftTab,
		getOrderedItems,
		elements,
	} = useContext(RovingTabindexContext);

	return {
		getOrderedItems,
		isFocusable:
			currentRovingTabindexValue?.rowId === location.rowId &&
			currentRovingTabindexValue.cellId === location.cellId,
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
			tabIndex:
				currentRovingTabindexValue?.rowId === location.rowId &&
				currentRovingTabindexValue.cellId === location.cellId
					? 0
					: -1,
		}),
	};
}
