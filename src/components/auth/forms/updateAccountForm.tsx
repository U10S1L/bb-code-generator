import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "context/authContext";
import Firebase from "components/firebase/firebase";
import { InfoToast } from "components/toast/toast";
import SignOutButton from "./signOutButton";
import { errorMessage } from "constants/errors";

type AccountFormProps = {
	onSignOut: () => void;
	onUpdateAccount: () => void;
};
const AccountForm = ({ onSignOut, onUpdateAccount }: AccountFormProps) => {
	const { authUser } = useContext(AuthContext);
	const defaultUpdateUser = {
		email: "",
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
			.then(() =>
				Firebase().updateUser(
					updateUser.newPassword1 !== ""
						? updateUser.newPassword1
						: updateUser.currPassword,
					updateUser.email
				)
			)
			.then(() => {
				setUpdateUser(defaultUpdateUser);
				InfoToast("Account updated successfully. Redirecting...");
				setTimeout(() => Firebase().signOut(), 2500);
				onUpdateAccount();
			})
			.catch((errorCode) => {
				setUpdateUser({
					...updateUser,
					errorMessage: errorMessage(errorCode)
				});
			});
	};

	useEffect(() => {
		setIsUpdateUserValid(
			(updateUser.currPassword !== "" && updateUser.email !== "") ||
				(updateUser.newPassword1 !== "" &&
					updateUser.newPassword1 === updateUser.newPassword2)
		);
	}, [updateUser]);

	return (
		<Form autoComplete="off">
			<Form.Group>
				<Form.Label>Update Email</Form.Label>
				<Form.Control
					type="email"
					placeholder={authUser?.email || ""}
					value={updateUser.email}
					onChange={(e) => {
						setUpdateUser({ ...updateUser, email: e.target.value });
					}}></Form.Control>
			</Form.Group>
			<hr />
			<Form.Group>
				<Form.Label>Update Password</Form.Label>
				<Form.Control
					type="password"
					placeholder="********"
					autoComplete="new-password"
					value={updateUser.newPassword1}
					onChange={(e) => {
						setUpdateUser({ ...updateUser, newPassword1: e.target.value });
					}}></Form.Control>
			</Form.Group>

			<Form.Group>
				<Form.Label>Confirm Password</Form.Label>
				<Form.Control
					type="password"
					autoComplete="new-password"
					placeholder="********"
					value={updateUser.newPassword2}
					onChange={(e) => {
						setUpdateUser({ ...updateUser, newPassword2: e.target.value });
					}}></Form.Control>
			</Form.Group>
			<br />
			<hr />
			<Form.Group>
				<Form.Label>Current Password *</Form.Label>
				<Form.Control
					type="password"
					value={updateUser.currPassword}
					autoComplete="off"
					onChange={(e) => {
						setUpdateUser({
							...updateUser,
							currPassword: e.target.value
						});
					}}></Form.Control>
			</Form.Group>
			<div style={{ color: "red" }}>{updateUser.errorMessage}</div>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<SignOutButton onSignOut={onSignOut} />
				<Button
					disabled={!isUpdateUserValid}
					variant="info"
					onClick={() => handleUpdateUser()}>
					Update Account
				</Button>
			</div>
		</Form>
	);
};

export default AccountForm;
