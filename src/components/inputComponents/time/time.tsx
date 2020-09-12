import "../dateTimePicker.css";

import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import { InputTypeProps } from "types/formTypes";

export const Time = ({ readOnly, val, setVal }: InputTypeProps) => {
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
				setVal && setVal(date?.toString());
			}}
			popperPlacement="auto"
			timeFormat={"HH:mm"}
			dateFormat={"HH:mm"}
			placeholderText="HH:MM"
			isClearable
			timeIntervals={5}
			openToDate={openToDate}
			showTimeSelect
			showTimeSelectOnly
			readOnly={readOnly}
			fixedHeight
			className="form-control"
		/>
	);
};
