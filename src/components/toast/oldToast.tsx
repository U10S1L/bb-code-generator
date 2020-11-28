import "./oldToast.css";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import { toast } from "react-toastify";

const toastMap = {
	default: toast.dark,
	success: toast.success,
	error: toast.error
};

interface IToast {
	message: string;
	type?: "success" | "error";
}
export const DefaultToast = ({ message, type }: IToast) => {
	return toastMap[type || "default"](message, {
		position: "bottom-right",
		autoClose: 2500
	});
};

// export const DefaultToast = (message) => {
// 	return toast.success(message, {
// 		position: toast.POSITION.BOTTOM_RIGHT,
// 		autoClose: 3000
// 	});
// };

// export const SuccessToast = (message) => {
// 	return toast.success(message, {
// 		position: toast.POSITION.BOTTOM_RIGHT,
// 		autoClose: 3000
// 	})
// }

// export const ErrorToast = (message) => {
// 	return toast.error(message, {
// 		position: toast.POSITION.BOTTOM_RIGHT,
// 		autoClose: 2000
// 	});
// };
