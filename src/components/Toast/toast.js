import "./toast.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SuccessToast = (message) => {
	return toast.info(message, {
		position: toast.POSITION.TOP_CENTER,
		autoClose: 2000
	});
};

export const ErrorToast = (message) => {
	return toast.error(message, {
		position: toast.POSITION.TOP_CENTER,
		autoClose: 2000
	});
};
