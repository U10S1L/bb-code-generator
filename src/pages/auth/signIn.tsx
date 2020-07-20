import { LinkContainer } from "react-router-bootstrap";
import React from "react";
import SignInForm from "components/auth/signInForm";

const SignIn = () => {
	return (
		<div>
			No account yet? <SignInForm />
			<LinkContainer to={"/auth/signup"}>
				<span>Sign Up!</span>
			</LinkContainer>
		</div>
	);
};

export default SignIn;
