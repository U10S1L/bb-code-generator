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

// Formats DateTime object to DD/MMM/YYYY 00:00
export const formatDateTime = (dateTime: Date): string => {
	if (!isNaN(dateTime.getDate())) {
		return `${dateTime.getDate().toString()}/${getMonthString(
			dateTime.getMonth()
		)}/${dateTime.getFullYear()} ${dateTime
			.getHours()
			.toString()
			.padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")}`;
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

// Formats Date object to DD/MMM/YYYY
export const formatDate = (date: Date): string => {
	if (!isNaN(date.getUTCDate())) {
		return ` ${date.getUTCDate().toString()}/${getMonthString(
			date.getMonth()
		)}/${date.getFullYear()} `;
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
) => {
	if (!bbCodeForm) {
		return null;
	} else {
		return {
			...bbCodeForm,
			inputComponents: bbCodeForm.inputComponents.map((inputComponent) => {
				return {
					...inputComponent,
					inputs: inputComponent.inputs.map((input) => {
						return {
							...input,
							val: inputComponent.defaultVal
						};
					})
				};
			})
		};
	}
};
