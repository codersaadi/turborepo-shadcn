"use client";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";

type UseBooleanReturn<T extends string> = {
	[K in `is${Capitalize<T>}`]: boolean;
} & {
	[K in `set${Capitalize<T>}`]: Dispatch<SetStateAction<boolean>>;
};

export const useBoolean = <T extends string>(name: T): UseBooleanReturn<T> => {
	const [state, setState] = useState(false);

	// Memoized state object with inferred types
	const memoizedState = useMemo(() => {
		const stateName = `is${
			name.charAt(0).toUpperCase() + name.slice(1)
		}` as `is${Capitalize<T>}`;
		const setterName = `set${
			name.charAt(0).toUpperCase() + name.slice(1)
		}` as `set${Capitalize<T>}`;

		return {
			[stateName]: state,
			[setterName]: setState,
		} as UseBooleanReturn<T>;
	}, [name, state]);

	return memoizedState;
};
