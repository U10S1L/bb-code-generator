import React, { ReactNode, createContext, useEffect, useState } from "react";

import { BBCodeForm } from "types/formTypes";
import Firebase from "components/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export const AuthContext = createContext<{
	authUser: firebase.User | undefined;
	stateForms: BBCodeForm[];
}>({ authUser: undefined, stateForms: [] });

type AuthProviderProps = {
	children: ReactNode;
};
export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [authUser] = useAuthState(Firebase().auth);
	const [stateForms, setStateForms] = useState<BBCodeForm[]>([]);

	useEffect(() => {
		if (authUser) {
			return Firebase()
				.firestore.collection("users")
				.doc(authUser.uid)
				.collection("forms")
				.orderBy("order")
				.onSnapshot((snapshot) => {
					const bbCodeForms: BBCodeForm[] = [];
					snapshot.docs.forEach((doc) => {
						bbCodeForms.push(Firebase().deserializeBBCodeForm(doc.data()));
					});
					Firebase()
						.backfillForms(bbCodeForms)
						.then(() => {
							setStateForms(bbCodeForms);
						});
				});
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
