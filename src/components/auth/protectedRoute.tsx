import React, { useContext, useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";

import { AppContext } from "context/context";
import { useAuthState } from "react-firebase-hooks/auth";

const ProtectedRoute = ({ children, ...rest }: any) => {
	const { state } = useContext(AppContext);
	const [user] = useAuthState(state.firebase.auth);

	return (
		<Route
			{...rest}
			render={() =>
				user ? (
					children
				) : (
					<Redirect
						to={{
							pathname: "/auth/signin"
						}}
					/>
				)
			}
		/>
	);
};

export default ProtectedRoute;
