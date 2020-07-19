import { BBCodeFormType } from "types/formTypes";
import { Types } from "types/contextTypes";
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
