import { Button, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Firebase from "components/firebase/firebase";
import { errorMessage } from "constants/errors";
import { useHistory } from "react-router-dom";

type SignUpFormProps = {
	onSignUp: () => void;
};
const SignUpForm = ({ onSignUp }: SignUpFormProps) => {
	const defaultSignUp = {
		username: "",
		email: "",
		password1: "",
		password2: "",
		errorMessage: ""
	};
	const [signUp, setSignUp] = useState<{
		username: string;
		email: string;
		password1: string;
		password2: string;
		errorMessage: string;
	}>(defaultSignUp);
	const [isSignUpValid, setIsSignUpValid] = useState(false);

	const history = useHistory();

	const handleSignUp = () => {
		Firebase()
			// Create user in Firebase Auth
			.createUser(signUp.username, signUp.email, signUp.password1)
			.then(() => {
				setSignUp(defaultSignUp);
				history.replace("/forms/list");
				onSignUp();
			})
			.catch((errorCode) => {
				setSignUp({ ...signUp, errorMessage: errorMessage(errorCode) });
			});
	};

	useEffect(() => {
		setIsSignUpValid(
			signUp.username !== "" &&
				signUp.email !== "" &&
				signUp.password1 !== "" &&
				signUp.password1 === signUp.password2
		);
	}, [signUp]);
	return (
		<Form>
			<Form.Group>
				<Form.Label>Full Name</Form.Label>
				<Form.Control
					placeholder="Character Name"
					value={signUp.username}
					onChange={(e) => setSignUp({ ...signUp, username: e.target.value })}
					type="text"></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label>Email</Form.Label>
				<Form.Control
					value={signUp.email}
					placeholder="Actual email address that you have access to"
					onChange={(e) => setSignUp({ ...signUp, email: e.target.value })}
					type="text"></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label>Password</Form.Label>
				<Form.Control
					autoComplete="new-password"
					value={signUp.password1}
					onChange={(e) => setSignUp({ ...signUp, password1: e.target.value })}
					type="password"></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label>Confirm Password</Form.Label>
				<Form.Control
					autoComplete="new-password"
					value={signUp.password2}
					onChange={(e) => setSignUp({ ...signUp, password2: e.target.value })}
					type="password"></Form.Control>
			</Form.Group>
			<div style={{ color: "red" }}>{signUp.errorMessage}</div>
			<div style={{ display: "flex", justifyContent: "flex-end" }}>
				<Button
					style={{ marginLeft: "auto" }}
					disabled={!isSignUpValid}
					variant="info"
					onClick={() => handleSignUp()}>
					Sign Up
				</Button>
			</div>
		</Form>
	);
};

export default SignUpForm;
