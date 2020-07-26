import { Button, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Firebase from "components/firebase/firebase";
import { errorMessage } from "constants/errors";
import { useHistory } from "react-router-dom";

const UpdatePasswordForm = () => {
	const defaultUpdatePassword = {
		password1: "",
		password2: "",
		errorMessage: ""
	};
	const [updatePassword, setUpdatePassword] = useState(defaultUpdatePassword);
	const [isUpdatePasswordValid, setIsUpdatePasswordValid] = useState(false);
	const history = useHistory();

	const handleUpdatePassword = () => {
		Firebase()
			.passwordUpdate(updatePassword.password1)
			.then(() => {
				setUpdatePassword(defaultUpdatePassword);
			})
			.catch((errorCode) => {
				console.log(errorCode);
				setUpdatePassword({
					...defaultUpdatePassword,
					errorMessage: errorMessage(errorCode)
				});
			});
	};

	useEffect(() => {
		setIsUpdatePasswordValid(
			updatePassword.password1 !== "" &&
				updatePassword.password2 !== "" &&
				updatePassword.password1 === updatePassword.password2
		);
	}, [updatePassword]);

	return (
		<Form>
			<Form.Group>
				<Form.Label>New Password</Form.Label>
				<Form.Control
					type="password"
					value={updatePassword.password1}
					onChange={(e) => {
						setUpdatePassword({ ...updatePassword, password1: e.target.value });
					}}></Form.Control>
			</Form.Group>

			<Form.Group>
				<Form.Label>Confirm New Password</Form.Label>
				<Form.Control
					type="password"
					value={updatePassword.password2}
					onChange={(e) => {
						setUpdatePassword({ ...updatePassword, password2: e.target.value });
					}}></Form.Control>
			</Form.Group>
			<div style={{ color: "red" }}>{updatePassword.errorMessage}</div>
			<Button
				disabled={!isUpdatePasswordValid}
				variant="primary"
				onClick={() => handleUpdatePassword()}>
				Update Password
			</Button>
		</Form>
	);
};

export default UpdatePasswordForm;
