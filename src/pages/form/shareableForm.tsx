import { useHistory, useParams } from "react-router-dom";

import Firebase from "components/firebase/firebase";
import { useEffect } from "react";

const ShareableForm = () => {
	const params = useParams<{ userUid: string; formUid: string }>();
	const history = useHistory();

	useEffect(() => {
		Firebase()
			.getUserForm(params.userUid, params.formUid)
			.then((form) => {
				localStorage.setItem("newBBCodeForm", JSON.stringify(form));
				history.replace("/forms/new");
			});
	}, [history, params.formUid, params.userUid]);

	return null;
};
export default ShareableForm;
