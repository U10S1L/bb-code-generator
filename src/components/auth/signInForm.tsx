import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";

import { AppContext } from "context/context";
import { useHistory } from "react-router-dom";

const SignInForm = () => {
	const defaultSignIn = {
		email: "",
		password: "",
		errorMessage: ""
	};
	const [signIn, setSignIn] = useState(defaultSignIn);
	const [isSignInValid, setIsSignInValid] = useState(false);

	const { state } = useContext(AppContext);

	let history = useHistory();

	const handleSignIn = () => {
		state.firebase
			.doSignInWithEmailAndPassword(signIn.email, signIn.password)
			.then((response) => {
				if (!response.errorCode) {
					// Yay signed in success
					history.push("/forms/list");
				} else {
					console.log(response.errorCode);
					var errorMessage = "There was an error signing into your account.";
					switch (response.errorCode) {
						case "auth/invalid-email":
						case "auth/wrong-password":
							errorMessage = "Incorrect password or email address.";
					}
					setSignIn({ ...signIn, errorMessage });
				}
			});
	};

	useEffect(() => {
		setIsSignInValid(
			defaultSignIn.email !== null && defaultSignIn.password !== null
		);
	}, [signIn, defaultSignIn.email, defaultSignIn.password]);

	return (
		<Form>
			<Form.Group>
				<Form.Label>Email</Form.Label>
				<Form.Control
					type="text"
					value={signIn.email}
					onChange={(e) => {
						setSignIn({ ...signIn, email: e.target.value });
					}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Password</Form.Label>
				<Form.Control
					type="password"
					value={signIn.password}
					onChange={(e) => setSignIn({ ...signIn, password: e.target.value })}
				/>
			</Form.Group>
			<Button
				disabled={!isSignInValid}
				variant="success"
				onClick={() => handleSignIn()}>
				Sign In
			</Button>
			Forgot Password?
		</Form>
	);
};

export default SignInForm;
