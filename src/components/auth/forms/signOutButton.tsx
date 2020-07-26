import { Button } from "react-bootstrap";
import Firebase from "components/firebase/firebase";
import React from "react";

type SignOutButtonProps = {
	onSignOut: () => void;
};
const SignOutButton = ({ onSignOut }: SignOutButtonProps) => {
	const handleSignOut = () => {
		Firebase()
			.signOut()
			.then(() => {
				onSignOut();
			});
	};

	return (
		<Button variant="info" onClick={() => handleSignOut()}>
			Sign Out
		</Button>
	);
};

export default SignOutButton;