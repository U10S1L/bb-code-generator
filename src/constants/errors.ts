export const errorMessage = (errorCode: string) => {
	switch (errorCode) {
		case "auth/weak-password":
			return "Password must be at least 6 characters long.";
		case "auth/invalid-email":
			return "Invalid email address.";
		case "auth/email-already-in-use":
			return "An account already exists with that email address.";
		case "auth/wrong-password":
			return "Incorrect password.";
		case "auth/user-not-found":
			return "No account exists with that email address.";
		case "permission-denied":
			return "Permission denied.";
		case "auth/access-denied":
			return "Access denied.";
		default:
			return "Internal server error.";
	}
};
