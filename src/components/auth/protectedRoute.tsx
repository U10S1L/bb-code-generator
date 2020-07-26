import React, { useEffect } from "react";
import { Route, useHistory } from "react-router-dom";

import Firebase from "components/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const ProtectedRoute = ({ children, ...rest }: any) => {
	const [authUser, authUserLoading] = useAuthState(Firebase().auth);

	const history = useHistory();
	useEffect(() => {
		if (!authUserLoading && !authUser) {
			history.push("/auth/signin");
		}
	}, [authUserLoading, authUser, history]);
	return !authUserLoading ? <Route {...rest} children={children} /> : null;
};

export default ProtectedRoute;
