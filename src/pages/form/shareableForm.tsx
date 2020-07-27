import { useHistory, useParams } from "react-router-dom";

import Firebase from "components/firebase/firebase";
import { InfoToast } from "components/toast/toast";
import { useEffect } from "react";

const ShareableForm = () => {
	const params = useParams<{ userUid: string; formUid: string }>();
	const history = useHistory();

	useEffect(() => {
		Firebase()
			.getShareableForm(params.userUid, params.formUid)
			.then((form) => {
				localStorage.setItem("newBBCodeForm", JSON.stringify(form));
				history.replace("/forms/new");
			})
			.catch((errorCode) => {
				if (errorCode === "permission-denied") {
					InfoToast("You must be signed in to use a Shareable Copy link.");
				}
				history.replace("/");
			});
	}, [history, params.formUid, params.userUid]);

	return null;
};
export default ShareableForm;
