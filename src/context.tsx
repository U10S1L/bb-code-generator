import React, { createContext, useReducer, useEffect } from "react";
import {
	userReducer,
	formsReducer,
	UserActions,
	FormsActions
} from "./reducers";
import { InputComponentProps } from "./types/form";

// Types
export enum SiteTheme {
	LIGHT,
	DARK
}
export type UserType = {
	firstName: string;
	lastName: string;
	badgeNumber: string;
	theme: SiteTheme;
};
export type BBCodeFormType = {
	uniqueId: string;
	slug: string;
	name: string;
	inputComponents: InputComponentProps[];
	rawBBCode: string;
	matchedBBCode: string;
};

// Defaults
const user = {
	firstName: "",
	lastName: "",
	badgeNumber: "",
	theme: SiteTheme.LIGHT
};
const forms: BBCodeFormType[] = [];

// Initial State
export type InitialStateType = {
	user: UserType;
	forms: BBCodeFormType[];
};
const initialState = (): InitialStateType => {
	const stateString = localStorage.getItem("state");
	if (stateString != null) {
		return JSON.parse(stateString);
	} else {
		return {
			user,
			forms
		};
	}
};

const AppContext = createContext<{
	state: InitialStateType;
	dispatch: React.Dispatch<UserActions | FormsActions>;
}>({ state: initialState(), dispatch: () => null });

const mainReducer = (
	{ user, forms }: InitialStateType,
	action: UserActions | FormsActions
) => ({
	user: userReducer(user, action as UserActions),
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
