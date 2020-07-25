import React, { useContext } from "react";

import { AppContext } from "context/context";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const SignOutButton = () => {
	const { state } = useContext(AppContext);
	let history = useHistory();

	const handleSignOut = () => {
		state.firebase.signOut();
		history.replace("/");
	};

	return (
		<Button
			variant="link"
			style={{ color: "#FFFFFF", opacity: ".5", marginLeft: "auto" }}
			onClick={() => handleSignOut()}>
			Sign Out
		</Button>
	);
};

export default SignOutButton;
