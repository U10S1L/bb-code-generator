import {
	AuthUserActions,
	FormsActions,
	authUserReducer,
	formsReducer
} from "./reducers";
import React, { createContext, useEffect, useReducer } from "react";

import { BBCodeFormType } from "types/formTypes";
import Firebase from "components/firebase/firebase";

// Defaults
const forms: BBCodeFormType[] = [];
const authUser: firebase.User | null = null;
const firebase = new Firebase();

// Initial State
type InitialStateType = {
	forms: BBCodeFormType[];
	authUser: firebase.User | null;
	firebase: Firebase;
};
const initialState = (): InitialStateType => {
	const stateString = localStorage.getItem("state");
	if (stateString != null) {
		return { ...JSON.parse(stateString), firebase };
	} else {
		return {
			forms,
			authUser,
			firebase
		};
	}
};

const AppContext = createContext<{
	state: InitialStateType;
	dispatch: React.Dispatch<FormsActions | AuthUserActions>;
}>({ state: initialState(), dispatch: () => null });

const mainReducer = (
	{ forms, authUser, firebase }: InitialStateType,
	action: FormsActions | AuthUserActions
) => ({
	forms: formsReducer(forms, action as FormsActions),
	authUser: authUserReducer(authUser, action as AuthUserActions),
	firebase
});

const AppProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(mainReducer, initialState());

	useEffect(() => {
		localStorage.setItem(
			"state",
			JSON.stringify({ authUser: state.authUser, forms: state.forms })
		);
	}, [state.authUser, state.forms]);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{children}
		</AppContext.Provider>
	);
};

export { AppContext, AppProvider };
