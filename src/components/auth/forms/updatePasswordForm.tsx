import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "context/authContext";
import Firebase from "components/firebase/firebase";
import { SuccessToast } from "components/toast/toast";
import { errorMessage } from "constants/errors";

const UpdateUserForm = () => {
	const { authUser } = useContext(AuthContext);
	const defaultUpdateUser = {
		name: authUser?.displayName,
		email: authUser?.email,
		currPassword: "",
		newPassword1: "",
		newPassword2: "",
		errorMessage: ""
	};
	const [updateUser, setUpdateUser] = useState(defaultUpdateUser);
	const [isUpdateUserValid, setIsUpdateUserValid] = useState(false);

	const handleUpdateUser = () => {
		Firebase()
			.signIn(authUser?.email, updateUser.currPassword)
			.then(() => {
				Firebase().updateUser(
					updateUser.newPassword1 !== ""
						? updateUser.newPassword1
						: updateUser.currPassword,
					updateUser.email,
					updateUser.name
				);
			})
			.then(() => {
				setUpdateUser(defaultUpdateUser);
				SuccessToast("Account updated successfully.");
				setTimeout(() => Firebase().signOut(), 2500);
			})
			.catch((errorCode) => {
				setUpdateUser({
					...defaultUpdateUser,
					errorMessage: errorMessage(errorCode)
				});
			});
	};

	useEffect(() => {
		setIsUpdateUserValid(
			updateUser.name !== "" &&
				updateUser.email !== "" &&
				updateUser.currPassword !== "" &&
				updateUser.newPassword1 !== "" &&
				updateUser.newPassword2 !== "" &&
				updateUser.newPassword1 === updateUser.newPassword2
		);
	}, [updateUser]);
	return (
		<Form>
			<Form.Group>
				<Form.Label>Current Password</Form.Label>
				<Form.Control
					type="password"
					value={updateUser.currPassword}
					onChange={(e) => {
						setUpdateUser({
							...updateUser,
							currPassword: e.target.value
						});
					}}></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label>New Password</Form.Label>
				<Form.Control
					type="password"
					value={updateUser.newPassword1}
					onChange={(e) => {
						setUpdateUser({ ...updateUser, newPassword1: e.target.value });
					}}></Form.Control>
			</Form.Group>

			<Form.Group>
				<Form.Label>Confirm New Password</Form.Label>
				<Form.Control
					type="password"
					value={updateUser.newPassword2}
					onChange={(e) => {
						setUpdateUser({ ...updateUser, newPassword2: e.target.value });
					}}></Form.Control>
			</Form.Group>
			<div style={{ color: "red" }}>{updateUser.errorMessage}</div>
			<Button
				disabled={!isUpdateUserValid}
				variant="info"
				onClick={() => handleUpdateUser()}>
				Update Account
			</Button>
		</Form>
	);
};

export default UpdateUserForm;
