import { Button, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ForgotPasswordForm from "./forms/forgotPasswordForm";
import SignInForm from "components/auth/forms/signInForm";
import SignOutButton from "components/auth/forms/signOutButton";
import SignUpForm from "components/auth/forms/signUpForm";

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
	const [modalState, setModalState] = useState<Form>(Form.SignIn);

	useEffect(() => {
		setModalState(!user ? Form.SignIn : Form.SignOut);
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
				{modalState !== Form.SignIn && modalState !== Form.SignOut && (
					<Button variant="link" onClick={() => setModalState(Form.SignIn)}>
						<FontAwesomeIcon icon="arrow-left"></FontAwesomeIcon>
					</Button>
				)}
				<h4 style={{ textAlign: "center" }}>{modalState}</h4>
				<Button
					variant="link"
					onClick={() => {
						onClose();
					}}>
					<FontAwesomeIcon icon="times" />
				</Button>
			</Modal.Header>
			<Modal.Body>
				{modalState === Form.SignIn && (
					<SignInForm
						onClickSignUp={() => setModalState(Form.SignUp)}
						onClickForgotPassword={() => setModalState(Form.ForgotPassword)}
						onSignIn={() => {
							onClose();
						}}
					/>
				)}
				{modalState === Form.SignUp && <SignUpForm />}
				{modalState === Form.ForgotPassword && <ForgotPasswordForm />}
				{modalState === Form.SignOut && (
					<SignOutButton onSignOut={() => onClose()} />
				)}
			</Modal.Body>
			<Modal.Footer></Modal.Footer>
		</Modal>
	);
};

export default AuthModal;
