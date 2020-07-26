import "styles/custom2.css";
import "styles/styles.css";

import { Slide, ToastContainer } from "react-toastify";
import {
	faArrowLeft,
	faArrowRight,
	faBars,
	faCalendarAlt,
	faCalendarTimes,
	faCaretSquareDown,
	faCheck,
	faCheckSquare,
	faCircle,
	faClipboard,
	faClock,
	faDownload,
	faEdit,
	faExclamationCircle,
	faEye,
	faFont,
	faLink,
	faLock,
	faLockOpen,
	faMinus,
	faPlus,
	faQuestionCircle,
	faSearch,
	faTextHeight,
	faTextWidth,
	faTimes,
	faUser
} from "@fortawesome/free-solid-svg-icons";

import { AuthProvider } from "context/authContext";
import { Container } from "react-bootstrap";
import NavigationBar from "components/navigationBar/navigationBar";
import React from "react";
import SwitchRoutes from "./SwitchRoutes";
import { library } from "@fortawesome/fontawesome-svg-core";
import pages from "./constants/pages";

// import "./bootstrap-flatly.css";

// FontAwesome

// Site Pages

// FontAwesome Library Setup
library.add(
	faTimes,
	faQuestionCircle,
	faClipboard,
	faEdit,
	faCheck,
	faEye,
	faArrowLeft,
	faArrowRight,
	faBars,
	faPlus,
	faMinus,
	faSearch,
	faDownload,
	faFont,
	faTextWidth,
	faTextHeight,
	faCalendarTimes,
	faCalendarAlt,
	faClock,
	faCaretSquareDown,
	faCheckSquare,
	faLink,
	faCircle,
	faExclamationCircle,
	faLock,
	faLockOpen,
	faUser
);

const App = () => {
	return (
		<AuthProvider>
			<Container
				id="#app-container"
				style={{ backgroundColor: "white", minHeight: "100vh" }}>
				<NavigationBar links={pages} style={{ margin: "0 -15px" }} />
				<ToastContainer
					hideProgressBar={true}
					autoClose={2500}
					transition={Slide}
				/>
				<SwitchRoutes />
			</Container>
		</AuthProvider>
	);
};

export default App;
