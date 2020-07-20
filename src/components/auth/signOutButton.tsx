import React, { useContext } from "react";

import { AppContext } from "context/context";
import { Button } from "react-bootstrap";

const SignOutButton = () => {
	const { state } = useContext(AppContext);

	return (
		<Button variant="link" onClick={() => state.firebase.doSignOut()}>
			Sign Out
		</Button>
	);
};

export default SignOutButton;
