import React, { useContext } from "react";

import { AppContext } from "context/context";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const SignOutButton = () => {
	const { state } = useContext(AppContext);
	let history = useHistory();

	const handleSignOut = () => {
		state.firebase.doSignOut();
		history.push("/");
	};

	return (
		<Button variant="link" onClick={() => handleSignOut()}>
			Sign Out
		</Button>
	);
};

export default SignOutButton;
