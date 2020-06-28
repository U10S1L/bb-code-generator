import "./styles.css";

// import "./bootstrap-flatly.css";
import React, { useState, useContext, useEffect } from "react";
import NavigationBar from "./components/Navbar/navbar";
import { ToastContainer, Slide } from "react-toastify";
import { Container } from "react-bootstrap";
import { AppProvider, AppContext } from "./context";
// Site Pages
import pages from "./constants/pages";
// FontAwesome
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faTimes,
	faQuestionCircle,
	faClipboard,
	faEdit,
	faCheck,
	faEye,
	faArrowLeft,
	faBars,
	faPlus,
	faMinus,
	faSearch
} from "@fortawesome/free-solid-svg-icons";
import SwitchRoutes from "./SwitchRoutes";

// FontAwesome Library Setup
library.add(
	faTimes,
	faQuestionCircle,
	faClipboard,
	faEdit,
	faCheck,
	faEye,
	faArrowLeft,
	faBars,
	faPlus,
	faMinus,
	faSearch
);

const App = () => {
	const { state } = useContext(AppContext);
	const [setForms] = useState(state.forms);

	useEffect(() => {
		setForms(state.forms);
	}, [state]);

	return (
		<AppProvider>
			<Container style={{ backgroundColor: "white", minHeight: "100vh" }}>
				<NavigationBar links={pages} style={{ margin: "0 -15px" }} />
				<ToastContainer
					hideProgressBar={true}
					autoClose={2500}
					transition={Slide}
				/>
				<SwitchRoutes />
			</Container>
		</AppProvider>
	);
};

export default App;
