import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";

import { AppContext } from "context/context";
import { errorMessage } from "constants/errors";
import { useHistory } from "react-router-dom";

const SignUpForm = () => {
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

	const { state } = useContext(AppContext);

	let history = useHistory();

	const handleSignUp = () => {
		state.firebase
			// Create user in Firebase Auth
			.createUser(signUp.username, signUp.email, signUp.password1)
			.then((errorCode) => {
				if (!errorCode) {
					setSignUp(defaultSignUp);
					history.replace("/forms/list");
				} else {
					setSignUp({ ...signUp, errorMessage: errorMessage(errorCode) });
				}
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
			<Button
				disabled={!isSignUpValid}
				variant="success"
				onClick={() => handleSignUp()}>
				Sign Up
			</Button>
			Forgot Password?
		</Form>
	);
};

export default SignUpForm;
