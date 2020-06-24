import "./styles.css";

// import "./bootstrap-flatly.css";
import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import Form from "./pages/form/form";
import { Switch, Route } from "react-router-dom";
import NavigationBar from "./components/Navbar/navbar";
import { ToastContainer, Slide } from "react-toastify";
import { Container } from "react-bootstrap";
import { AppProvider, AppContext, SiteTheme } from "./context";
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
import $ from "jquery";

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
    const [mainMinHeight, setMainMinHeight] = useState<string>("calc(100vh)");
    const { state } = useContext(AppContext);
    const [forms, setForms] = useState(state.forms);

    useLayoutEffect(() => {
        const navHeight = $("#navbar").outerHeight();
        const mainMinHeight = `calc(100vh - ${navHeight}px`;
        setMainMinHeight(mainMinHeight);
    }, []);

    useEffect(() => {
        setForms(state.forms);
    }, [state.forms, forms]);

    // Themeing
    console.log(state.user.theme);
    return (
        <AppProvider>
            <div
                className="app-container"
                style={{ backgroundColor: "#2C3E50" }}>
                <Container style={{ backgroundColor: "white" }} fluid>
                    <NavigationBar
                        links={pages}
                        style={{ margin: "0 -15px" }}
                    />

                    <ToastContainer
                        hideProgressBar={true}
                        autoClose={2500}
                        transition={Slide}
                    />
                    <Container style={{ minHeight: mainMinHeight }} fluid>
                        <Switch>
                            {state.forms.map((bbCodeForm, i) => (
                                <Route
                                    key={i}
                                    path="/form/:slug"
                                    component={Form}
                                    exact
                                />
                            ))}
                            {pages.map((page, i) => (
                                <Route
                                    key={i}
                                    path={page.path}
                                    render={() => <page.component />}
                                    exact
                                />
                            ))}
                        </Switch>
                    </Container>
                </Container>
            </div>
        </AppProvider>
    );
};

export default App;
