import React, { ReactNode, createContext, useEffect, useState } from "react";

import { BBCodeFormType } from "types/formTypes";
import Firebase from "components/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export const AuthContext = createContext<{
	authUser: firebase.User | undefined;
	stateForms: BBCodeFormType[];
}>({ authUser: undefined, stateForms: [] });

type AuthProviderProps = {
	children: ReactNode;
};
export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [authUser] = useAuthState(Firebase().auth);
	const [stateForms, setStateForms] = useState<BBCodeFormType[]>([]);

	useEffect(() => {
		if (authUser) {
			Firebase().streamUserForms((snapshot) => {
				const bbCodeForms: BBCodeFormType[] = [];
				snapshot.docs.forEach((doc) => {
					bbCodeForms.push(Firebase().deserializeBBCodeForm(doc.data()));
				});
				setStateForms(bbCodeForms);
			}, authUser.uid);
		} else {
			setStateForms([]);
		}
	}, [authUser]);

	return (
		<AuthContext.Provider value={{ authUser, stateForms }}>
			{children}
		</AuthContext.Provider>
	);
};
