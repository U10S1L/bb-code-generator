import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "context/authContext";
import Firebase from "components/firebase/firebase";
import { SuccessToast } from "components/toast/toast";
import { errorMessage } from "constants/errors";
import { useHistory } from "react-router-dom";

const UpdatePasswordForm = () => {
	const defaultUpdatePassword = {
		currPassword: "",
		password1: "",
		password2: "",
		errorMessage: ""
	};
	const { authUser } = useContext(AuthContext);
	const [updatePassword, setUpdatePassword] = useState(defaultUpdatePassword);
	const [isUpdatePasswordValid, setIsUpdatePasswordValid] = useState(false);
	const history = useHistory();

	const handleUpdatePassword = () => {
		Firebase()
			.signIn(authUser?.email, updatePassword.currPassword)
			.then(() => {
				Firebase().passwordUpdate(updatePassword.password1);
			})
			.then(() => {
				setUpdatePassword(defaultUpdatePassword);
				SuccessToast(
					"Password changed successfully. Redirecting to sign in..."
				);
				setTimeout(() => Firebase().signOut(), 2500);
			})
			.catch((errorCode) => {
				setUpdatePassword({
					...defaultUpdatePassword,
					errorMessage: errorMessage(errorCode)
				});
			});
	};

	useEffect(() => {
		setIsUpdatePasswordValid(
			updatePassword.currPassword !== "" &&
				updatePassword.password1 !== "" &&
				updatePassword.password2 !== "" &&
				updatePassword.password1 === updatePassword.password2
		);
	}, [updatePassword]);
	return (
		<Form>
			<Form.Group>
				<Form.Label>Current Password</Form.Label>
				<Form.Control
					type="password"
					value={updatePassword.currPassword}
					onChange={(e) => {
						setUpdatePassword({
							...updatePassword,
							currPassword: e.target.value
						});
					}}></Form.Control>
			</Form.Group>
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
