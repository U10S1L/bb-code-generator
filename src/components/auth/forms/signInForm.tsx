import { Button, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Firebase from "components/firebase/firebase";
import { errorMessage } from "constants/errors";

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
			<Button
				disabled={!isSignInValid}
				block
				variant="info"
				onClick={() => handleSignIn()}
				style={{ marginBottom: "1rem" }}>
				Login
			</Button>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<Button
					size="sm"
					variant="link"
					style={{ paddingLeft: 0 }}
					onClick={() => onClickForgotPassword()}>
					Forgot Password?
				</Button>
				<Button size="sm" variant="link" onClick={() => onClickSignUp()}>
					New? Create an Account
				</Button>
			</div>
		</Form>
	);
};

export default SignInForm;
