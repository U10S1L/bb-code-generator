import "./toast.css";
import "react-toastify/dist/ReactToastify.css";

import { toast } from "react-toastify";

export const InfoToast = (message) => {
	return toast.info(message, {
		position: toast.POSITION.TOP_CENTER,
		autoClose: 2500
	});
};

export const ErrorToast = (message) => {
	return toast.error(message, {
		position: toast.POSITION.TOP_CENTER,
		autoClose: 2000
	});
};
