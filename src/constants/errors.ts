export const errorMessage = (errorCode: string) => {
	switch (errorCode) {
		case "auth/weak-password":
			return "Password must be at least 6 characters long.";
		case "auth/invalid-email":
			return "Invalid email address.";
		case "auth/email-already-in-use":
			return "An account already exists with that email address.";
		case "auth/wrong-password":
			return "Incorrect password or email address.";
		case "auth/user-not-found":
			return "No account exists with that email address.";
		default:
			return "Internal server error.";
	}
};
