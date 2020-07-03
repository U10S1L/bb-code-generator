import React, { createContext, useReducer, useEffect } from "react";
import { formsReducer, FormsActions } from "./reducers";
import { InputComponentProps } from "./types/form";

export type BBCodeFormType = {
	uniqueId: string;
	slug: string;
	name: string;
	inputComponents: InputComponentProps[];
	rawBBCode: string;
	matchedBBCode: string;
};

// Defaults
const forms: BBCodeFormType[] = [];

// Initial State
export type InitialStateType = {
	forms: BBCodeFormType[];
};
const initialState = (): InitialStateType => {
	const stateString = localStorage.getItem("state");
	if (stateString != null) {
		return JSON.parse(stateString);
	} else {
		return {
			forms
		};
	}
};

const AppContext = createContext<{
	state: InitialStateType;
	dispatch: React.Dispatch<FormsActions>;
}>({ state: initialState(), dispatch: () => null });

const mainReducer = ({ forms }: InitialStateType, action: FormsActions) => ({
	forms: formsReducer(forms, action as FormsActions)
});

const AppProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(mainReducer, initialState());

	useEffect(() => {
		localStorage.setItem("state", JSON.stringify(state));
	}, [state]);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{children}
		</AppContext.Provider>
	);
};

export { AppContext, AppProvider };
