import "./custom2.css";
import "./styles.css";

// import "./bootstrap-flatly.css";
import React from "react";
import NavigationBar from "./components/Navbar/navbar";
import { ToastContainer, Slide } from "react-toastify";
import { Container } from "react-bootstrap";
import { AppProvider } from "./context";
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
	faArrowRight,
	faBars,
	faPlus,
	faMinus,
	faSearch,
	faDownload
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
	faArrowRight,
	faBars,
	faPlus,
	faMinus,
	faSearch,
	faDownload
);

const App = () => {
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
