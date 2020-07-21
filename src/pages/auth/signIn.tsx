import { useHistory, useLocation } from "react-router-dom";

import React from "react";
import SignInForm from "components/auth/signInForm";

const SignIn = () => {
	return (
		<div>
			<SignInForm />
		</div>
	);
};

export default SignIn;
