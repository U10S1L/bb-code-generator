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

// Formats Date object to DD/MMM/YYYY
export const formatDateTime = (dateTime: Date): string => {
	return `${dateTime.getDate().toString()}/${getMonthString(
		dateTime.getMonth()
	)}/${dateTime.getFullYear()} ${dateTime
		.getHours()
		.toString()
		.padStart(2, "0")}:${dateTime.getMinutes()}`;
};
