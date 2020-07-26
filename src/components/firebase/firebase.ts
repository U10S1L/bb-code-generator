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
		updateUser,
		saveForm,
		streamUserForms,
		getUserForm,
		deleteUserForm,
		deserializeBBCodeForm,
		batchUpdateForms
	};
};

// All API methods shall return a Promise. Errors return a translatable code.

export const createUser = (email: string, password: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		Firebase()
			.auth.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				Firebase().firestore.collection("users").doc(authUser.user!.uid).set({
					email
				});
			})
			.then(() => resolve())
			.catch((error) => {
				reject(error.code);
			});
	});
};

export const signIn = (
	email?: string | null,
	password?: string | null
): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!email || !password) {
			reject("general/missing-arguments");
		} else {
			Firebase()
				.auth.signInWithEmailAndPassword(email, password)
				.then(() => resolve())
				.catch((error) => {
					reject(error.code);
				});
		}
	});
};

export const signOut = (): Promise<any> => {
	return new Promise((resolve, reject) => {
		Firebase()
			.auth.signOut()
			.then(() => resolve())
			.catch((error) => reject(error.code));
	});
};
export const passwordReset = (email: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		Firebase()
			.auth.sendPasswordResetEmail(email)
			.then(() => resolve())
			.catch((error) => {
				reject(error.code);
			});
	});
};
export const updateUser = (
	password: string,
	email?: string | null
): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (email) {
			updateEmail(email).then(() => {
				if (password) {
					updatePassword(password)
						.then(() => resolve())
						.catch((error) => reject(error.code));
				}
			});
		} else if (password) {
			updatePassword(password)
				.then(() => resolve())
				.catch((error) => reject(error.code));
		}
	});
};

const updateEmail = (email: string) => {
	return new Promise((resolve, reject) => {
		if (!Firebase().auth.currentUser) {
			reject("auth/access-denied");
		} else {
			Firebase()
				.auth.currentUser!.updateEmail(email)
				.then(() => resolve())
				.catch((error) => reject(error));
		}
	});
};

const updatePassword = (password: string) => {
	return new Promise((resolve, reject) => {
		if (!Firebase().auth.currentUser) {
			reject("auth/access-denied");
		} else {
			Firebase()
				.auth.currentUser!.updatePassword(password)
				.then(() => resolve())
				.catch((error) => reject(error));
		}
	});
};

export const saveForm = (
	currentFormUid: string | null,
	bbCodeForm: BBCodeFormType,
	userUid?: string
): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!userUid) {
			reject("auth/access-denied");
		} else {
			const serializedBBCodeForm = serializeBBCodeForm(bbCodeForm);
			const collRef = Firebase()
				.firestore.collection("users")
				.doc(userUid)
				.collection("forms");

			if (currentFormUid === null) {
				/* New User Form */
				collRef
					.doc(bbCodeForm.uid)
					.set(serializedBBCodeForm, { merge: true })
					.then(() => resolve())
					.catch((error) => {
						reject(error.code);
					});
			} else {
				/* Updates to existing User Form */
				if (bbCodeForm.uid === currentFormUid) {
					// No changes to form name/UID.
					console.log("normal update to same document");
					collRef
						.doc(currentFormUid)
						.set(serializedBBCodeForm, { merge: true })
						.then(() => resolve())
						.catch((error) => reject(error.code));
				} else {
					// Changes to form name/UID. Requires deletion & recreation of Document.
					console.log("deleting and recreating");
					collRef
						.doc(currentFormUid)
						.delete()
						.then(() => {
							collRef
								.doc(bbCodeForm.uid)
								.set(serializedBBCodeForm)
								.then(() => resolve())
								.catch((error) => {
									reject(error.code);
								});
						});
				}
			}
		}
	});
};

export const batchUpdateForms = (
	bbCodeForms: BBCodeFormType[],
	userUid?: string
): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!userUid) {
			reject("auth/access-denied");
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
			return batch
				.commit()
				.then(() => resolve())
				.catch((error) => reject(error.code));
		}
	});
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
	return new Promise((resolve, reject) => {
		if (!userUid || !formUid) {
			reject("auth/access-denied");
		} else {
			Firebase()
				.firestore.collection("users")
				.doc(userUid)
				.collection("forms")
				.doc(formUid)
				.get()
				.then((doc) => {
					resolve(deserializeBBCodeForm(doc.data()));
				})
				.catch((error) => {
					reject(error.code);
				});
		}
	});
};
export const deleteUserForm = (userFormUID: string): Promise<any> => {
	const currUser = Firebase().auth.currentUser;
	return new Promise((resolve, reject) => {
		Firebase()
			.firestore.collection("users")
			.doc(currUser!.uid)
			.collection("forms")
			.doc(userFormUID)
			.delete()
			.then(() => resolve())
			.catch((error) => {
				reject(error.code);
			});
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
