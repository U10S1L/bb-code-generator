import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

import { BBCodeForm, fieldType } from "types/formTypes";

import app from "firebase/app";
import { getFormProgressString } from "common/utils";

var _ = require("lodash");

const config =
	process.env.NODE_ENV === "production"
		? {
				apiKey: process.env.REACT_APP_PROD_API_KEY,
				authDomain: process.env.REACT_APP_PROD_AUTH_DOMAIN,
				databaseURL: process.env.REACT_APP_PROD_DATABASE_URL,
				projectId: process.env.REACT_APP_PROD_PROJECT_ID,
				storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET,
				messagingSenderId: process.env.REACT_APP_PROD_MESSAGING_SENDER_ID,
				appId: process.env.REACT_APP_PROD_APP_ID,
				measurementId: process.env.REACT_APP_PROD_MEASUREMENT_ID
		  }
		: {
				apiKey: process.env.REACT_APP_DEV_API_KEY,
				authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
				databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
				projectId: process.env.REACT_APP_DEV_PROJECT_ID,
				storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
				messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
				appId: process.env.REACT_APP_DEV_APP_ID,
				measurementId: process.env.REACT_APP_DEV_MEASUREMENT_ID
		  };

const Firebase = () => {
	if (!app.apps.length) {
		app.initializeApp(config);
	}
	const auth = app.auth();
	const firestore = app.firestore();
	const analytics = app.analytics();

	return {
		auth,
		firestore,
		analytics,
		createUser,
		signIn,
		signOut,
		passwordReset,
		updateUser,
		saveForm,
		getShareableForm,
		deleteUserForm,
		deserializeBBCodeForm,
		batchUpdateForms,
		backfillForms
	};
};

const ERR_ACCESS_DENIED = "auth/access-denied";

// All API methods return a Promise. Errors return a translatable error code.

/* User API */
export const createUser = (email: string, password: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		Firebase()
			.auth.createUserWithEmailAndPassword(email, password)
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
			updateEmail(email)
				.then(() => {
					if (password) {
						updatePassword(password)
							.then(() => resolve())
							.catch((error) => reject(error.code));
					} else {
						resolve();
					}
				})
				.catch((error) => reject(error.code));
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
			reject(ERR_ACCESS_DENIED);
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
			reject(ERR_ACCESS_DENIED);
		} else {
			Firebase()
				.auth.currentUser!.updatePassword(password)
				.then(() => resolve())
				.catch((error) => reject(error));
		}
	});
};

/* Form API */
export const saveForm = (
	currentFormUid: string | null,
	bbCodeForm: BBCodeForm,
	userUid?: string
): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!userUid) {
			reject(ERR_ACCESS_DENIED);
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
					.set(serializedBBCodeForm)
					.then(() => resolve())
					.catch((error) => {
						reject(error.code);
					});
			} else {
				/* Updates to existing User Form */
				if (bbCodeForm.uid === currentFormUid) {
					// No changes to form name/UID.
					collRef
						.doc(currentFormUid)
						.set(serializedBBCodeForm, { merge: true })
						.then(() => resolve())
						.catch((error) => reject(error.code));
				} else {
					// Changes to form name/UID. Requires deletion & recreation of Document.
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
	bbCodeForms: BBCodeForm[],
	userUid?: string
): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!userUid) {
			reject(ERR_ACCESS_DENIED);
		} else {
			const batch = Firebase().firestore.batch();
			bbCodeForms.forEach((form) => {
				batch.set(
					Firebase()
						.firestore.collection("users")
						.doc(userUid)
						.collection("forms")
						.doc(form.uid),
					serializeBBCodeForm(form)
				);
			});
			return batch
				.commit()
				.then(() => resolve())
				.catch((error) => reject(error.code));
		}
	});
};
export const getShareableForm = (
	userUid: string,
	formUid: string
): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!userUid || !formUid) {
			reject(ERR_ACCESS_DENIED);
		} else {
			Firebase()
				.firestore.collection("users")
				.doc(userUid)
				.collection("forms")
				.doc(formUid)
				.get()
				.then((doc) => {
					const deserializedBBCodeForm = deserializeBBCodeForm(doc.data());
					const backfilledBBCodeForm = resolve(
						deserializeBBCodeForm(doc.data())
					);
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

const serializeBBCodeForm = (bbCodeForm: BBCodeForm) => {
	return {
		...bbCodeForm,
		fields: JSON.stringify(bbCodeForm.fields)
	};
};

export const deserializeBBCodeForm = (serializedForm: any): BBCodeForm => {
	let bbCodeForm: BBCodeForm = {
		...serializedForm
	};

	if (serializedForm.fields) {
		bbCodeForm.fields = JSON.parse(serializedForm.fields);
	} else {
		// Support for old forms with the now deprecated inputComponents field
		bbCodeForm.inputComponents = JSON.parse(serializedForm.inputComponents);
	}

	return bbCodeForm;
};

/* Backfill API */
// Backfills for updates or to remove deprecated values/fields occur on a 'go-forward' basis.
export const backfillForms = (formsToBackfill: BBCodeForm[]): Promise<any> => {
	const currUser = Firebase().auth.currentUser;

	const backfilledForms = formsToBackfill.map((bbCodeForm) => {
		const backfilledBBCodeForm = getBackfilledBBCodeForm(bbCodeForm);

		if (_.isEqual(backfilledBBCodeForm, bbCodeForm)) {
			return bbCodeForm;
		} else {
			/* Backfill the form's progress in localStorage */
			const formProgressString = getFormProgressString(bbCodeForm);
			const hasFormProgressInLocalStorage =
				localStorage.getItem(formProgressString) != null;
			if (hasFormProgressInLocalStorage) {
				localStorage.setItem(
					formProgressString,
					JSON.stringify(backfilledBBCodeForm)
				);
			}

			return backfilledBBCodeForm;
		}
	});

	const hasChangesToPropogateToDatabase = !_.isEqual(
		backfilledForms,
		formsToBackfill
	);

	/* Backfill generic local storage forms used for form creation */
	backfillFormCreationProgress();

	return new Promise((resolve, reject) => {
		if (!Firebase().auth.currentUser) {
			reject(ERR_ACCESS_DENIED);
		}

		if (hasChangesToPropogateToDatabase) {
			batchUpdateForms(backfilledForms, currUser?.uid)
				.then(() => resolve())
				.catch((err) => reject(err));
		} else {
			resolve();
		}
	});
};

const getBackfilledBBCodeForm = (form: BBCodeForm): BBCodeForm => {
	// Form
	var backfilledForm: BBCodeForm = _.cloneDeep(form);

	// add: bookmarkLink
	if (!backfilledForm.bookmarkLink) {
		backfilledForm.bookmarkLink = "";
	}

	// rename: fields -> inputComponents
	if (backfilledForm.inputComponents) {
		backfilledForm.fields = backfilledForm.inputComponents;
		delete backfilledForm.inputComponents;
	}

	// Form Fields
	backfilledForm.fields.map((field) => {
		// deprecated: typeIcon
		if (field.typeIcon) {
			delete field["typeIcon"];
		}

		// deprecated: type + typeName -> fieldType
		if (field.type && field.typeName) {
			field.fieldType = {
				typeCode: field.type,
				typeName: field.typeName
			} as fieldType;
			delete field.type;
			delete field.typeName;
		}

		const fieldTypeCode = field.fieldType.typeCode;
		if (
			(fieldTypeCode === "date" ||
				fieldTypeCode === "time" ||
				fieldTypeCode === "dateTime") &&
			field.defaultVal !== ""
		) {
			// populate: defaultVal for date/time objects
			field.defaultVal = "";
		} else if (fieldTypeCode !== "dropdown" && field.selectOptions) {
			// cleanup: selectOptions from fields that aren't dropdowns
			delete field["selectOptions"];
		} else if (fieldTypeCode === "listItem" && !field.multiStar) {
			// populate: multiStar and multi for listItem fields
			field.multiStar = true;
			field.multi = false;
		}

		// Field Inputs
		field.inputs.map((input) => {
			// cleanup: selectOptions from inputs that aren't dropdowns
			if (input.type !== "dropdown" && input.selectOptions) {
				delete input["selectOptions"];
			}
			// deprecated: input type
			if (input.type) {
				delete input.type;
			}
			return input;
		});
		return field;
	});

	return backfilledForm;
};

const backfillFormCreationProgress = () => {
	["newBBCodeForm", "editBBCodeForm"].forEach(
		(formCreationLocalStorageString) => {
			const bbCodeFormJson = localStorage.getItem(
				formCreationLocalStorageString
			);
			const bbCodeForm = bbCodeFormJson ? JSON.parse(bbCodeFormJson) : null;

			if (bbCodeForm) {
				const backfilledBBCodeForm = getBackfilledBBCodeForm(bbCodeForm);
				if (!_.isEqual(backfilledBBCodeForm, bbCodeForm)) {
					localStorage.setItem(
						formCreationLocalStorageString,
						JSON.stringify(backfilledBBCodeForm)
					);
				}
			}
		}
	);
};

export default Firebase;
