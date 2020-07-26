import { Button, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ForgotPasswordForm from "./forms/forgotPasswordForm";
import SignInForm from "components/auth/forms/signInForm";
import SignOutButton from "components/auth/forms/signOutButton";
import SignUpForm from "components/auth/forms/signUpForm";
import { format } from "path";

type AuthModalProps = {
	visible: boolean;
	onClose: () => void;
	user?: firebase.User | null;
};

enum Form {
	SignIn = "Sign In",
	SignUp = "Sign Up",
	SignOut = "Sign Out",
	ForgotPassword = "Forgot Password"
}
const AuthModal = ({ visible, onClose, user }: AuthModalProps) => {
	const [modalState, setModalState] = useState<{ form: Form }>({
		form: Form.SignIn
	});

	useEffect(() => {
		setModalState({ ...modalState, form: !user ? Form.SignIn : Form.SignOut });
	}, [user, visible]);

	return (
		<Modal
			show={visible}
			// onHide={handleClose}
			animation={false}
			backdrop="static"
			keyboard={false}
			centered>
			<Modal.Header
				style={{
					display: "flex",
					justifyContent: "space-between",
					flexDirection: "row",
					alignItems: "center"
				}}>
				{modalState.form !== Form.SignIn && modalState.form !== Form.SignOut && (
					<Button
						variant="link"
						onClick={() => setModalState({ ...modalState, form: Form.SignIn })}>
						<FontAwesomeIcon icon="arrow-left"></FontAwesomeIcon>
					</Button>
				)}
				<h4 style={{ textAlign: "center" }}>{modalState.form}</h4>
				<Button
					variant="link"
					onClick={() => {
						onClose();
					}}>
					<FontAwesomeIcon icon="times" />
				</Button>
			</Modal.Header>
			<Modal.Body>
				{modalState.form === Form.SignIn && (
					<SignInForm
						onClickSignUp={() =>
							setModalState({ ...modalState, form: Form.SignUp })
						}
						onClickForgotPassword={() =>
							setModalState({ ...modalState, form: Form.ForgotPassword })
						}
						onSignIn={() => {
							onClose();
						}}
					/>
				)}
				{modalState.form === Form.SignUp && <SignUpForm />}
				{modalState.form === Form.ForgotPassword && <ForgotPasswordForm />}
				{modalState.form === Form.SignOut && (
					<SignOutButton onSignOut={() => onClose()} />
				)}
			</Modal.Body>
			<Modal.Footer></Modal.Footer>
		</Modal>
	);
};

export default AuthModal;
