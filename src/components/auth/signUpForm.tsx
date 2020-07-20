import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";

import FirebaseContext from "context/firebaseContext";
import { useHistory } from "react-router-dom";

const SignUpForm = () => {
	const defaultSignUpInfo = {
		username: "",
		email: "",
		password1: "",
		password2: "",
		errorMessage: ""
	};
	const [signUpInfo, setSignUpInfo] = useState<{
		username: string;
		email: string;
		password1: string;
		password2: string;
		errorMessage: string;
	}>(defaultSignUpInfo);
	const [isSignUpInfoValid, setIsSignUpInfoValid] = useState(false);

	const firebaseContext = useContext(FirebaseContext);

	let history = useHistory();

	const signUp = () => {
		firebaseContext
			?.doCreateUserWithEmailAndPassword(signUpInfo.email, signUpInfo.password1)
			.then((response) => {
				if (response.authUser) {
					setSignUpInfo(defaultSignUpInfo);
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
								signUpInfo.email;
							break;
						default:
							errorMessage = "There was an issue creating your account.";
					}
					setSignUpInfo({ ...signUpInfo, errorMessage });
				}
			});
	};

	useEffect(() => {
		setIsSignUpInfoValid(
			signUpInfo.username !== "" &&
				signUpInfo.email !== "" &&
				signUpInfo.password1 !== "" &&
				signUpInfo.password1 === signUpInfo.password2
		);
	}, [signUpInfo]);
	return (
		<Form>
			<Form.Group>
				<Form.Label>Full Name</Form.Label>
				<Form.Control
					placeholder="Character Name"
					value={signUpInfo.username}
					onChange={(e) =>
						setSignUpInfo({ ...signUpInfo, username: e.target.value })
					}
					type="text"></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label>Email</Form.Label>
				<Form.Control
					value={signUpInfo.email}
					placeholder="Actual email address that you have access to"
					onChange={(e) =>
						setSignUpInfo({ ...signUpInfo, email: e.target.value })
					}
					type="text"></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label>Password</Form.Label>
				<Form.Control
					value={signUpInfo.password1}
					onChange={(e) =>
						setSignUpInfo({ ...signUpInfo, password1: e.target.value })
					}
					type="password"></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label>Confirm Password</Form.Label>
				<Form.Control
					value={signUpInfo.password2}
					onChange={(e) =>
						setSignUpInfo({ ...signUpInfo, password2: e.target.value })
					}
					type="password"></Form.Control>
			</Form.Group>
			<div style={{ color: "red" }}>{signUpInfo.errorMessage}</div>
			<Button
				disabled={!isSignUpInfoValid}
				variant="success"
				onClick={() => signUp()}>
				Sign Up
			</Button>
			Forgot Password?
		</Form>
	);
};

export default SignUpForm;
