import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";

import { AppContext } from "context/context";
import Form from "pages/form/form";
import ProtectedRoute from "components/auth/protectedRoute";
import pages from "constants/pages";

const SwitchRoutes = () => {
	const { state } = useContext(AppContext);

	return (
		<Switch>
			{state.forms.map((bbCodeForm, i) => (
				<ProtectedRoute key={i} path="/form/:uid" component={Form} exact />
			))}
			{pages.map((page, i) =>
				page.protected ? (
					<ProtectedRoute key={i} path={page.path}>
						<page.component />
					</ProtectedRoute>
				) : (
					<Route key={i} path={page.path} render={() => <page.component />} />
				)
			)}
		</Switch>
	);
};

export default SwitchRoutes;
