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
	faMinus,
	faPlus,
	faQuestionCircle,
	faSearch,
	faTextHeight,
	faTextWidth,
	faTimes
} from "@fortawesome/free-solid-svg-icons";

import { AppProvider } from "context/context";
import { Container } from "react-bootstrap";
import NavigationBar from "./components/navbar/navbar";
import React from "react";
import SwitchRoutes from "./SwitchRoutes";
import { library } from "@fortawesome/fontawesome-svg-core";
import pages from "./constants/pages";

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
	faExclamationCircle
);

const App = () => {
	return (
		<AppProvider>
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
		</AppProvider>
	);
};

export default App;
