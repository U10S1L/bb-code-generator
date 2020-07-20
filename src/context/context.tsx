import {
	AuthUserActions,
	FormsActions,
	authUserReducer,
	formsReducer
} from "./reducers";
import React, {
	createContext,
	useContext,
	useEffect,
	useReducer,
	useState
} from "react";

import { BBCodeFormType } from "types/formTypes";
import FirebaseContext from "context/firebaseContext";

// Defaults
const forms: BBCodeFormType[] = [];
const authUser = null;
// Initial State
type InitialStateType = {
	forms: BBCodeFormType[];
	authUser: null | any;
};
const initialState = (): InitialStateType => {
	const stateString = localStorage.getItem("state");
	if (stateString != null) {
		return JSON.parse(stateString);
	} else {
		return {
			forms,
			authUser
		};
	}
};

const AppContext = createContext<{
	state: InitialStateType;
	dispatch: React.Dispatch<FormsActions | AuthUserActions>;
}>({ state: initialState(), dispatch: () => null });

const mainReducer = (
	{ forms, authUser }: InitialStateType,
	action: FormsActions | AuthUserActions
) => ({
	forms: formsReducer(forms, action as FormsActions),
	authUser: authUserReducer(authUser, action as AuthUserActions)
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
