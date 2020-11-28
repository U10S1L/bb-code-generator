// import "styles/custom2.css";

import "styles/darkly.min.css";
import "styles/styles.css";

import { Slide, ToastContainer } from "react-toastify";
import {
	faArrowLeft,
	faArrowRight,
	faBars,
	faBold,
	faBookmark,
	faCalendarAlt,
	faCalendarTimes,
	faCaretRight,
	faCaretSquareDown,
	faCheck,
	faCheckSquare,
	faCircle,
	faClipboard,
	faClock,
	faDownload,
	faEdit,
	faEnvelope as faEnvelopeSolid,
	faExclamationCircle,
	faEye,
	faEyeSlash,
	faFont,
	faImage,
	faItalic,
	faLightbulb,
	faLink,
	faLock,
	faLockOpen,
	faMinus,
	faPencilAlt,
	faPlayCircle,
	faPlus,
	faQuestionCircle,
	faSearch,
	faTextHeight,
	faTextWidth,
	faTimes,
	faUnderline,
	faUndo,
	faUser
} from "@fortawesome/free-solid-svg-icons";

import { AuthProvider } from "context/authContext";
import { Container } from "react-bootstrap";
import NavigationBar from "components/navigationBar/navigationBar";
import React from "react";
import SwitchRoutes from "./SwitchRoutes";
import { faEnvelope as faEnvelopeRegular } from "@fortawesome/free-regular-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import pages from "./constants/pages";

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
	faCaretRight,
	faCheckSquare,
	faLink,
	faCircle,
	faExclamationCircle,
	faLock,
	faLockOpen,
	faUser,
	faPlayCircle,
	faBookmark,
	faImage,
	faUndo,
	faBold,
	faEnvelopeSolid,
	faEyeSlash,
	faImage,
	faItalic,
	faLink,
	faUnderline,
	faEnvelopeRegular,
	faLightbulb,
	faPencilAlt
);

const App = () => {
	return (
		<AuthProvider>
			<NavigationBar links={pages} />
			<Container id="#app-container" style={{ minHeight: "100vh" }}>
				<ToastContainer
					autoClose={2500}
					transition={Slide}
					pauseOnHover
					hideProgressBar
				/>
				<SwitchRoutes />
			</Container>
		</AuthProvider>
	);
};

export default App;
