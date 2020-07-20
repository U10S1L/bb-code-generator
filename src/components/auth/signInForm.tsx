import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";

import FirebaseContext from "context/firebaseContext";
import { useHistory } from "react-router-dom";

const SignInForm = () => {
	const defaultSignInInfo = {
		email: "",
		password: "",
		errorMessage: ""
	};
	const [signInInfo, setSignInInfo] = useState(defaultSignInInfo);
	const [isSignInValid, setIsSignInValid] = useState(false);

	const firebaseContext = useContext(FirebaseContext);

	let history = useHistory();

	const signIn = () => {
		firebaseContext
			?.doSignInWithEmailAndPassword(signInInfo.email, signInInfo.password)
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
					setSignInInfo({ ...signInInfo, errorMessage });
				}
			});
	};

	useEffect(() => {
		setIsSignInValid(
			defaultSignInInfo.email !== null && defaultSignInInfo.password !== null
		);
	}, [signInInfo]);

	return (
		<Form>
			<Form.Group>
				<Form.Label>Email</Form.Label>
				<Form.Control
					type="text"
					value={signInInfo.email}
					onChange={(e) => {
						setSignInInfo({ ...signInInfo, email: e.target.value });
					}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Password</Form.Label>
				<Form.Control
					type="password"
					value={signInInfo.password}
					onChange={(e) =>
						setSignInInfo({ ...signInInfo, password: e.target.value })
					}
				/>
			</Form.Group>
			<Button
				disabled={!isSignInValid}
				variant="success"
				onClick={() => signIn()}>
				Sign In
			</Button>
			Forgot Password?
		</Form>
	);
};

export default SignInForm;
