import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps, useHistory, useLocation } from "react-router-dom";

import { AppContext } from "context/context";
import { LinkContainer } from "react-router-bootstrap";

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
	let location = useLocation<any>();
	const from = location.state?.from;

	const handleSignIn = () => {
		state.firebase
			.doSignInWithEmailAndPassword(signIn.email, signIn.password)
			.then((response) => {
				if (!response.errorCode) {
					// Yay signed in success
					history.replace("/forms/list");
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
					autoComplete="username"
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
					autoComplete="current-password"
					type="password"
					value={signIn.password}
					onChange={(e) => setSignIn({ ...signIn, password: e.target.value })}
				/>
			</Form.Group>
			<div style={{ color: "red" }}>{signIn.errorMessage}</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					textAlign: "right"
				}}>
				<LinkContainer to={"/auth/forgotPassword"} style={{ paddingRight: 0 }}>
					<Button variant="link">Forgot Password?</Button>
				</LinkContainer>
				<div>
					<LinkContainer to={"/auth/signup"} style={{ marginRight: "1rem" }}>
						<Button variant="secondary">Sign Up</Button>
					</LinkContainer>
					<Button
						disabled={!isSignInValid}
						variant="success"
						onClick={() => handleSignIn()}>
						Sign In
					</Button>
				</div>
			</div>
		</Form>
	);
};

export default SignInForm;
