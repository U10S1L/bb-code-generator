import { BBCodeFormType } from "types/formTypes";

var slugify = require("slugify");

export const getFormUid = (formName: string) => {
	return slugify(formName, { lowercase: true });
};

const getMonthString = (monthNumber: number) => {
	switch (monthNumber) {
		case 0:
			return "JAN";
		case 1:
			return "FEB";
		case 2:
			return "MAR";
		case 3:
			return "APR";
		case 4:
			return "MAY";
		case 5:
			return "JUN";
		case 6:
			return "JUL";
		case 7:
			return "AUG";
		case 8:
			return "SEP";
		case 9:
			return "OCT";
		case 10:
			return "NOV";
		case 11:
			return "DEC";
	}
};

export const getDateString = (date: Date): string => {
	if (!isNaN(date.getDate())) {
		return `${date.getDate()}/${getMonthString(
			date.getMonth()
		)}/${date.getFullYear()}`;
	} else {
		return "";
	}
};

export const getTimeString = (date: Date): string => {
	if (!isNaN(date.getDate())) {
		return `${date
			.getHours()
			.toString()
			.padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
	} else {
		return "";
	}
};

export const formatDateTimeWithSeconds = (dateTime: Date): string => {
	if (!isNaN(dateTime.getDate())) {
		return `${dateTime.getDate().toString()}/${getMonthString(
			dateTime.getMonth()
		)}/${dateTime.getFullYear()} ${dateTime
			.getHours()
			.toString()
			.padStart(2, "0")}:${dateTime
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${dateTime.getSeconds().toString().padStart(2, "0")}`;
	} else {
		return "";
	}
};
// Format Url
export const formatUrl = (url: { link: string; text: string }): string => {
	return `[url=${url.link}]${url.text}[/url]`;
};

// Format BBCodeForms with Defaults
export const getFormWithDefaultVals = (
	bbCodeForm: BBCodeFormType | undefined
): BBCodeFormType | undefined => {
	if (!bbCodeForm) {
		return undefined;
	} else {
		return {
			...bbCodeForm,
			inputComponents: bbCodeForm.inputComponents.map((inputComponent) => {
				return {
					...inputComponent,
					inputs: inputComponent.inputs.map((input, i) => {
						return {
							...input,
							val: inputComponent.defaultVal,
							uniqueId: genInputUniqueId(inputComponent.uniqueId, i)
						};
					})
				};
			})
		};
	}
};

export const getFormProgressString = (bbCodeForm: BBCodeFormType): string => {
	return `formProgress_${bbCodeForm.uid}`;
};

export const parseBookmarkLink = (bookmarkLink: string): string => {
	if (
		bookmarkLink.indexOf("http://") === -1 &&
		bookmarkLink.indexOf("https://") === -1
	) {
		return `//${bookmarkLink}`;
	} else {
		return bookmarkLink;
	}
};

export const genInputUniqueId = (
	inputComponentUniqueId: string,
	index: number
) => {
	return `{${inputComponentUniqueId}_input_${index}}`;
};
