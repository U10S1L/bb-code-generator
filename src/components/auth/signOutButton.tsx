import { Button } from "react-bootstrap";
import Firebase from "components/firebase/firebase";
import React from "react";

const SignOutButton = () => {
	const handleSignOut = () => {
		Firebase().signOut();
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
