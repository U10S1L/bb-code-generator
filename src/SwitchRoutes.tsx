import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";

import { AppContext } from "context/context";
import Form from "pages/form/form";
import pages from "constants/pages";

// This must be a separate component (as opposed to being in App.tsx) because we need access to Context
const SwitchRoutes = () => {
	const { state } = useContext(AppContext);

	return (
		<Switch>
			{state.forms.map((bbCodeForm, i) => (
				<Route key={i} path="/form/:slug" component={Form} exact />
			))}
			{pages.map((page, i) => (
				<Route
					key={i}
					path={page.path}
					render={() => <page.component />}
					exact
				/>
			))}
		</Switch>
	);
};

export default SwitchRoutes;
