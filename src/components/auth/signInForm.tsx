import { Button, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Firebase from "components/firebase/firebase";
import { LinkContainer } from "react-router-bootstrap";
import { errorMessage } from "constants/errors";
import { useHistory } from "react-router-dom";

const SignInForm = () => {
	const defaultSignIn = {
		email: "",
		password: "",
		errorMessage: ""
	};
	const [signIn, setSignIn] = useState(defaultSignIn);
	const [isSignInValid, setIsSignInValid] = useState(false);
	const history = useHistory();
	const handleSignIn = () => {
		Firebase()
			.signIn(signIn.email, signIn.password)
			.then(() => {
				history.push("/forms/list");
			})
			.catch((errorCode) => {
				setSignIn({ ...signIn, errorMessage: errorMessage(errorCode) });
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
