import { AuthUserActions, FormsActions, formsReducer } from "./reducers";
import React, { createContext, useEffect, useReducer } from "react";

import { BBCodeFormType } from "types/formTypes";
import Firebase from "components/firebase/firebase";
import { Types } from "types/contextTypes";
import { firestore } from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// Defaults
const forms: BBCodeFormType[] = [];
const firebase = Firebase();

// Initial State
type InitialStateType = {
	forms: BBCodeFormType[];
	firebase: typeof firebase;
};
const initialState = (): InitialStateType => {
	const stateString = localStorage.getItem("state");
	if (stateString != null) {
		return { ...JSON.parse(stateString), firebase };
	} else {
		return {
			forms,
			firebase
		};
	}
};

const AppContext = createContext<{
	state: InitialStateType;
	dispatch: React.Dispatch<FormsActions | AuthUserActions>;
}>({ state: initialState(), dispatch: () => null });

const mainReducer = (
	{ forms, firebase }: InitialStateType,
	action: FormsActions | AuthUserActions
) => ({
	forms: formsReducer(forms, action as FormsActions),
	firebase
});

const AppProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(mainReducer, initialState());
	const [user] = useAuthState(state.firebase.auth);

	useEffect(() => {
		localStorage.setItem("state", JSON.stringify({ forms: state.forms }));
	}, [state.forms]);

	useEffect(() => {
		const unsub = () => {
			if (user) {
				state.firebase.streamUserForms(
					(snapshot: firestore.QuerySnapshot<firestore.DocumentData>) => {
						const bbCodeForms: BBCodeFormType[] = [];
						snapshot.docs.forEach((doc) => {
							bbCodeForms.push(
								state.firebase.deserializeBBCodeForm(doc.data())
							);
						});
						dispatch({ type: Types.UpdateForms, payload: bbCodeForms });
					},
					user.uid
				);
				dispatch({ type: Types.UpdateAuthUser, payload: user });
			} else {
				dispatch({ type: Types.UpdateForms, payload: [] });
				dispatch({ type: Types.DeleteAuthUser, payload: null });
			}
		};
		return unsub();
	}, [user, state.firebase]);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{children}
		</AppContext.Provider>
	);
};

export { AppContext, AppProvider };
