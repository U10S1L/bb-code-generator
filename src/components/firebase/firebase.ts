import "firebase/auth";
import "firebase/firestore";

import app, { firestore } from "firebase/app";

import { BBCodeFormType } from "types/formTypes";

const config =
	process.env.NODE_ENV === "production"
		? {
				apiKey: process.env.REACT_APP_PROD_API_KEY,
				authDomain: process.env.REACT_APP_PROD_AUTH_DOMAIN,
				databaseURL: process.env.REACT_APP_PROD_DATABASE_URL,
				projectId: process.env.REACT_APP_PROD_PROJECT_ID,
				storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET,
				messagingSenderId: process.env.REACT_APP_PROD_MESSAGING_SENDER_ID
		  }
		: {
				apiKey: process.env.REACT_APP_DEV_API_KEY,
				authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
				databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
				projectId: process.env.REACT_APP_DEV_PROJECT_ID,
				storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
				messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID
		  };

const Firebase = () => {
	if (!app.apps.length) {
		app.initializeApp(config);
	}
	const auth = app.auth();
	const firestore = app.firestore();

	return {
		auth,
		firestore,
		createUser,
		signIn,
		signOut,
		passwordReset,
		passwordUpdate,
		saveForm,
		streamUserForms,
		getUserForm,
		deleteUserForm,
		deserializeBBCodeForm,
		batchUpdateForms
	};
};

/* User API */
export const createUser = (
	username: string,
	email: string,
	password: string
): Promise<any> => {
	return Firebase()
		.auth.createUserWithEmailAndPassword(email, password)
		.then((authUser) => {
			Firebase().firestore.collection("users").doc(authUser.user!.uid).set({
				username,
				email
			});
		})
		.catch((error) => {
			return error.code;
		});
};

/* Auth API */
export const signIn = (email: string, password: string): Promise<any> => {
	return Firebase()
		.auth.signInWithEmailAndPassword(email, password)
		.catch((error) => {
			throw error.code;
		});
};
export const signOut = () => {
	Firebase().auth.signOut();
};
export const passwordReset = (email: string): Promise<any> =>
	Firebase()
		.auth.sendPasswordResetEmail(email)
		.catch((error) => {
			throw Error(error.code);
		});
export const passwordUpdate = (password: string) =>
	Firebase().auth.currentUser?.updatePassword(password);

export const saveForm = (
	bbCodeForm: BBCodeFormType,
	userUid?: string
): Promise<any> => {
	if (userUid) {
		const serializedBBCodeForm = serializeBBCodeForm(bbCodeForm);
		return Firebase()
			.firestore.collection("users")
			.doc(userUid)
			.collection("forms")
			.doc(bbCodeForm.uid)
			.set(serializedBBCodeForm, { merge: true });
	} else {
		throw Error("auth/authentication-failed");
	}
};

export const batchUpdateForms = (
	bbCodeForms: BBCodeFormType[],
	userUid?: string
): Promise<any> => {
	if (!userUid) {
		throw Error("auth/authentication-failed");
	} else {
		const batch = Firebase().firestore.batch();
		bbCodeForms.forEach((form) => {
			batch.set(
				Firebase()
					.firestore.collection("users")
					.doc(userUid)
					.collection("forms")
					.doc(form.uid),
				serializeBBCodeForm(form),
				{ merge: true }
			);
		});
		return batch.commit();
	}
};

export const streamUserForms = (
	observer: (snapshot: firestore.QuerySnapshot) => void,
	userUid?: string
) => {
	Firebase()
		.firestore.collection("users")
		.doc(userUid)
		.collection("forms")
		.orderBy("order")
		.onSnapshot((snapshot) => observer(snapshot));
};

export const getUserForm = (userUid: string, formUid: string): Promise<any> => {
	if (!userUid || !formUid) {
		throw Error("auth/access-denied");
	} else {
		return Firebase()
			.firestore.collection("users")
			.doc(userUid)
			.collection("forms")
			.doc(formUid)
			.get()
			.then((doc) => {
				return deserializeBBCodeForm(doc.data());
			})
			.catch((error) => {
				throw Error(error);
			});
	}
};
export const deleteUserForm = (userFormUID: string): Promise<any> => {
	const currUser = Firebase().auth.currentUser;
	return Firebase()
		.firestore.collection("users")
		.doc(currUser!.uid)
		.collection("forms")
		.doc(userFormUID)
		.delete()
		.catch((error) => {
			console.log(error);
		});
};

const serializeBBCodeForm = (bbCodeForm: BBCodeFormType) => {
	return {
		...bbCodeForm,
		inputComponents: JSON.stringify(bbCodeForm.inputComponents)
	};
};

export const deserializeBBCodeForm = (serializedForm: any): BBCodeFormType => {
	let bbCodeForm: BBCodeFormType = {
		...serializedForm,
		inputComponents: JSON.parse(serializedForm.inputComponents)
	};

	return bbCodeForm;
};

export default Firebase;
