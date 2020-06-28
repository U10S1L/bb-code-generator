import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SuccessToast = (message) => {
	return toast.success(message, {
		position: toast.POSITION.TOP_RIGHT
	});
};

export const ErrorToast = (message) => {
	return toast.error(message, {
		position: toast.POSITION.TOP_RIGHT
	});
};
