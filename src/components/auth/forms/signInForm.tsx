import { Button, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Firebase from "components/firebase/firebase";
import { errorMessage } from "constants/errors";
import { useHistory } from "react-router-dom";

type SignInFormProps = {
	onClickSignUp: () => void;
	onClickForgotPassword: () => void;
	onSignIn: () => void;
};
const SignInForm = ({
	onClickSignUp,
	onClickForgotPassword,
	onSignIn
}: SignInFormProps) => {
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
				onSignIn();
			})
			.catch((errorCode) => {
				setSignIn({ ...signIn, errorMessage: errorMessage(errorCode) });
			});
	};

	useEffect(() => {
		setIsSignInValid(signIn.email !== "" && signIn.password !== "");
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
				<Button
					variant="link"
					style={{ paddingRight: 0 }}
					onClick={() => onClickForgotPassword()}>
					Forgot Password?
				</Button>
				<div>
					<Button
						style={{ marginRight: "1rem" }}
						variant="secondary"
						onClick={() => onClickSignUp()}>
						Sign Up
					</Button>
					<Button
						disabled={!isSignInValid}
						variant="info"
						onClick={() => handleSignIn()}>
						Sign In
					</Button>
				</div>
			</div>
		</Form>
	);
};

export default SignInForm;
