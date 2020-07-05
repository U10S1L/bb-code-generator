import { BBCodeFormType } from "./context";
//  https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm
type ActionMap<M extends { [index: string]: any }> = {
	[Key in keyof M]: M[Key] extends undefined
		? {
				type: Key;
		  }
		: {
				type: Key;
				payload: M[Key];
		  };
};

export enum Types {
	// Forms
	UpdateForms = "UPDATE_FORMS",
	AddForm = "ADD_FORM",
	UpdateForm = "UPDATE_FORM",
	DeleteForm = "DELETE_FORM",
	DeleteAllForms = "DELETE_ALL_FORMS"
}

// Payloads
type FormsPayload = {
	[Types.UpdateForms]: BBCodeFormType[];
	[Types.AddForm]: BBCodeFormType;
	[Types.UpdateForm]: BBCodeFormType;
	[Types.DeleteForm]: BBCodeFormType;
	[Types.DeleteAllForms]: null;
};

// Actions
export type FormsActions = ActionMap<FormsPayload>[keyof ActionMap<
	FormsPayload
>];

export const formsReducer = (
	state: BBCodeFormType[],
	action: FormsActions
): BBCodeFormType[] => {
	switch (action.type) {
		case Types.UpdateForms:
			return action.payload;
		case Types.AddForm:
			return state.concat(action.payload);

		case Types.UpdateForm:
			return state.map((origBBCodeForm) => {
				return origBBCodeForm.uniqueId === action.payload.uniqueId
					? action.payload
					: origBBCodeForm;
			});
		case Types.DeleteForm:
			return state.filter(
				(bbCodeForm) => bbCodeForm.uniqueId !== action.payload.uniqueId
			);
		case Types.DeleteAllForms:
			return [];
		default:
			return state;
	}
};
