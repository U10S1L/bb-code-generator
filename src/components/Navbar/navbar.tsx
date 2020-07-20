import "./navbar.css";

import { Nav, Navbar } from "react-bootstrap";
import React, { useContext, useEffect } from "react";

import { AppContext } from "context/context";
import Clock from "react-live-clock";
import FirebaseContext from "context/firebaseContext";
import { LinkContainer } from "react-router-bootstrap";
import { Page } from "constants/pages";
import SignOutButton from "components/auth/signOutButton";
import { Types } from "types/contextTypes";
import logoImage from "images/logo.svg";

type NavigationBarProps = {
	links: Page[];
	style: React.CSSProperties;
};
const NavigationBar = ({ links, style }: NavigationBarProps) => {
	const { state, dispatch } = useContext(AppContext);
	const firebaseContext = useContext(FirebaseContext);
	useEffect(() => {
		firebaseContext?.auth.onAuthStateChanged((authUser) => {
			if (authUser != null) {
				console.log("sending authuser to the dispatcher", authUser);
				dispatch({ type: Types.UpdateAuthUser, payload: authUser });
			} else {
				dispatch({ type: Types.DeleteAuthUser, payload: null });
			}
		});
	}, []);
	return (
		<Navbar variant="dark" bg="dark" expand="sm" id="navbar" style={style}>
			<LinkContainer to={"/"} exact>
				<Navbar.Brand>
					<img
						alt="logo"
						style={{ width: "9rem" }}
						src={logoImage}
						className="img-fluid"></img>
				</Navbar.Brand>
			</LinkContainer>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					{links.map((link, i) => {
						return (
							link.id !== "home" &&
							link.id !== "signIn" &&
							link.id !== "signUp" && (
								<LinkContainer to={link.path} key={i}>
									<Nav.Link>{link.name}</Nav.Link>
								</LinkContainer>
							)
						);
					})}
				</Nav>
				<LinkContainer to={"/auth/signin"}>
					<Nav.Link>Sign In</Nav.Link>
				</LinkContainer>
				<SignOutButton />
				<span
					style={{
						color: "rgba(255,255,255,.5)",
						fontWeight: "normal",
						textTransform: "uppercase"
					}}
					className="text-muted small">
					<Clock
						timezone={"GMT"}
						format={"DD/MMM/YYYY HH:mm:ss"}
						ticking={true}
					/>{" "}
					<span className="text-muted">(GMT)</span>
				</span>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavigationBar;
