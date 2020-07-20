import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";

import { AppContext } from "context/context";
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
	const [isSignUpInfoValid, setIsSignUpInfoValid] = useState(false);

	const { state } = useContext(AppContext);

	let history = useHistory();

	const handleSignUp = () => {
		state.firebase
			.doCreateUserWithEmailAndPassword(signUp.email, signUp.password1)
			.then((response) => {
				if (response.authUser) {
					setSignUp(defaultSignUp);
					history.push("/forms/list");
					// Use the auth user
				} else if (response.errorCode) {
					console.log(response.errorCode);
					var errorMessage = "";
					switch (response.errorCode) {
						case "auth/weak-password":
							errorMessage = "Password must be greater than 6 characters.";
							break;
						case "auth/invalid-email":
							errorMessage = "Invalid email address.";
							break;
						case "auth/email-already-in-use":
							errorMessage =
								"An account already exists with the email address " +
								signUp.email;
							break;
						default:
							errorMessage = "There was an issue creating your account.";
					}
					setSignUp({ ...signUp, errorMessage });
				}
			});
	};

	useEffect(() => {
		setIsSignUpInfoValid(
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
				disabled={!isSignUpInfoValid}
				variant="success"
				onClick={() => handleSignUp()}>
				Sign Up
			</Button>
			Forgot Password?
		</Form>
	);
};

export default SignUpForm;
