import { BBCodeForm } from "types/formTypes";

// Format BBCodeForms with Defaults
export const getFormWithDefaultVals = (
	bbCodeForm: BBCodeForm | undefined
): BBCodeForm | undefined => {
	if (!bbCodeForm) {
		return undefined;
	} else {
		return {
			...bbCodeForm,
			fields: bbCodeForm.fields.map((field) => {
				return {
					...field,
					inputs: field.inputs.map((input, i) => {
						return {
							...input,
							val: field.defaultVal,
							uniqueId: genInputUniqueId(field.uniqueId, i)
						};
					})
				};
			})
		};
	}
};

export const genInputUniqueId = (fieldUniqueId: string, index: number) => {
	return `{${fieldUniqueId}_input_${index}}`;
};

export const getFormProgressString = (bbCodeForm: BBCodeForm): string => {
	return `formProgress_${bbCodeForm.uid}`;
};

export const getFormProgressTimestamp = (bbCodeForm: BBCodeForm): string => {
	const localStorageFormJson = localStorage.getItem(
		getFormProgressString(bbCodeForm)
	);

	const localStorageForm = localStorageFormJson
		? JSON.parse(localStorageFormJson)
		: null;

	return localStorageForm?.progressTimestamp || null;
};
