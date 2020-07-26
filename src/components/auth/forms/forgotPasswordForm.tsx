import { Button, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Firebase from "components/firebase/firebase";
import { SuccessToast } from "components/toast/toast";
import { errorMessage } from "constants/errors";

const ForgotPasswordForm = () => {
	const defaultForgotPassword = { email: "", errorMessage: "" };
	const [forgotPassword, setForgotPassword] = useState(defaultForgotPassword);
	const [isForgotPasswordValid, setIsForgotPasswordValid] = useState(false);

	const handleForgotPassword = () => {
		Firebase()
			.passwordReset(forgotPassword.email)
			.then(() => {
				setForgotPassword(defaultForgotPassword);
				SuccessToast("Password reset link sent to email address.");
			})
			.catch((errorCode) => {
				setForgotPassword({
					...forgotPassword,
					errorMessage: errorMessage(errorCode)
				});
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
				variant="info"
				onClick={() => handleForgotPassword()}>
				Reset My Password
			</Button>
		</Form>
	);
};

export default ForgotPasswordForm;
