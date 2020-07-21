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
		state.firebase.doPasswordReset(forgotPassword.email).then((response) => {
			if (!response.errorCode) {
				setForgotPassword(defaultForgotPassword);
				history.replace("/auth/signin");
			} else {
				console.log(response.errorCode);
				var errorMessage = "";
				switch (response.errorCode) {
					case "auth/invalid-email":
						errorMessage = "No account exists with that email address.";
						break;
				}
				setForgotPassword({ ...forgotPassword, errorMessage });
			}
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
