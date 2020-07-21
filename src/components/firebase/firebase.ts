import "firebase/auth";
import "firebase/database";

import app, { FirebaseError } from "firebase/app";

const devConfig = {
	apiKey: process.env.REACT_APP_DEV_API_KEY,
	authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
	projectId: process.env.REACT_APP_DEV_PROJECT_ID,
	storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID
};

const prodConfig = {
	apiKey: process.env.REACT_APP_PROD_API_KEY,
	authDomain: process.env.REACT_APP_PROD_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_PROD_DATABASE_URL,
	projectId: process.env.REACT_APP_PROD_PROJECT_ID,
	storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_PROD_MESSAGING_SENDER_ID
};

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

class Firebase {
	auth: app.auth.Auth;
	db: app.database.Database;

	constructor() {
		if (!app.apps.length) {
			app.initializeApp(config);
		}
		this.auth = app.auth();
		this.db = app.database();
	}

	/* Auth API */
	doCreateUserWithEmailAndPassword = (
		email: string,
		password: string
	): Promise<{
		authUser?: app.auth.UserCredential;
		errorCode?: string;
	}> => {
		return this.auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser: app.auth.UserCredential) => {
				return { authUser };
			})
			.catch((error: FirebaseError) => {
				return { errorCode: error.code };
			});
	};
	doSignInWithEmailAndPassword = (
		email: string,
		password: string
	): Promise<{ errorCode?: string }> => {
		return this.auth
			.signInWithEmailAndPassword(email, password)
			.then(() => {
				return {};
			})
			.catch((error: FirebaseError) => {
				return { errorCode: error.code };
			});
	};
	doSignOut = () => {
		this.auth.signOut();
	};
	doPasswordReset = (email: string): Promise<{ errorCode?: string }> =>
		this.auth
			.sendPasswordResetEmail(email)
			.then(() => {
				return {};
			})
			.catch((error) => {
				return { errorCode: error.code };
			});
	doPasswordUpdate = (password: string) =>
		this.auth.currentUser?.updatePassword(password);

	/* User API */
	// New User
	createUser = (uid: string) => this.db.ref(`users/${uid}`);
	// List of Users
	users = () => this.db.ref(`users`);
}

export default Firebase;
