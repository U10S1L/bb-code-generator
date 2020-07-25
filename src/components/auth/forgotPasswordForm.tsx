import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";

import { AppContext } from "context/context";
import { useHistory } from "react-router-dom";

const ForgotPasswordForm = () => {
	const defaultForgotPassword = { email: "", errorMessage: "" };
	const [forgotPassword, setForgotPassword] = useState(defaultForgotPassword);
	const [isForgotPasswordValid, setIsForgotPasswordValid] = useState(false);
	let history = useHistory();

	const { state } = useContext(AppContext);

	const handleForgotPassword = () => {
		state.firebase.passwordReset(forgotPassword.email).then(() => {
			setForgotPassword(defaultForgotPassword);
			history.replace("/auth/signin");
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
