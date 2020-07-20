import React, { useContext } from "react";

import { Button } from "react-bootstrap";
import FirebaseContext from "context/firebaseContext";

const SignOutButton = () => {
	const firebaseContext = useContext(FirebaseContext);

	return (
		<Button variant="link" onClick={() => firebaseContext?.doSignOut()}>
			Sign Out
		</Button>
	);
};

export default SignOutButton;
