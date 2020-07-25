import { Button, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Firebase from "components/firebase/firebase";
import { useHistory } from "react-router-dom";

const ForgotPasswordForm = () => {
	const defaultForgotPassword = { email: "", errorMessage: "" };
	const [forgotPassword, setForgotPassword] = useState(defaultForgotPassword);
	const [isForgotPasswordValid, setIsForgotPasswordValid] = useState(false);
	const history = useHistory();

	const handleForgotPassword = () => {
		Firebase()
			.passwordReset(forgotPassword.email)
			.then(() => {
				setForgotPassword(defaultForgotPassword);
				history.push("/auth/signin");
			});
	};

	useEffect(() => {
		setIsForgotPasswordValid(forgotPassword.email !== "");
	}, [forgotPassword]);

	return (
		<Form>
			<Form.Group>
				<Form.Label>Email</Form.Label>
				<Form.Control
					type="text"
					value={forgotPassword.email}
					onChange={(e) => {
						setForgotPassword({ ...forgotPassword, email: e.target.value });
					}}></Form.Control>
			</Form.Group>
			<div style={{ color: "red" }}>{forgotPassword.errorMessage}</div>
			<Button
				disabled={!isForgotPasswordValid}
				variant="primary"
				onClick={() => handleForgotPassword()}>
				Reset My Password
			</Button>
		</Form>
	);
};

export default ForgotPasswordForm;
