import "react-datepicker/dist/react-datepicker.css";
import "../dateTimePicker.css";

import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import { Input } from "types/formTypes";

export const TDate = ({ readOnly, val, onUpdateVal }: Input) => {
	const [openToDate, setOpenToDate] = useState<Date>();
	useEffect(() => {
		const utc = new Date();
		setOpenToDate(
			new Date(
				utc.getUTCFullYear(),
				utc.getUTCMonth(),
				utc.getUTCDate(),
				utc.getUTCHours(),
				utc.getUTCMinutes(),
				utc.getUTCSeconds(),
				utc.getUTCMilliseconds()
			)
		);
	}, []);

	return (
		<DatePicker
			selected={val && !isNaN(new Date(val).getDate()) ? new Date(val) : null}
			onChange={(date) => {
				onUpdateVal && onUpdateVal(date?.toString());
			}}
			popperPlacement="auto"
			dateFormat={"dd/MMM/yyyy"}
			dateFormatCalendar={"MMM yyyy"}
			placeholderText="DD/MMM/YYYY"
			isClearable
			openToDate={openToDate}
			readOnly={readOnly}
			fixedHeight
			className="form-control"
		/>
	);
};
