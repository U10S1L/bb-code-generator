import { Route, Switch } from "react-router-dom";

import Form from "pages/form/form";
import ProtectedRoute from "components/auth/protectedRoute";
import React from "react";
import ShareableForm from "pages/form/shareableForm";
import pages from "constants/pages";

const SwitchRoutes = () => {
	return (
		<Switch>
			<ProtectedRoute path="/form/:uid" children={<Form />} exact />
			<ProtectedRoute
				path="/form/shareable/:userUid/:formUid"
				exact
				children={<ShareableForm />}
			/>
			{pages.map((page, i) =>
				page.protected ? (
					<ProtectedRoute
						key={i}
						path={page.path}
						exact
						children={<page.component />}
					/>
				) : (
					<Route key={i} path={page.path}>
						<page.component />
					</Route>
				)
			)}
		</Switch>
	);
};

export default SwitchRoutes;
