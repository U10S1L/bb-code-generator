import "./navbar.css";

import { Nav, Navbar } from "react-bootstrap";

import Firebase from "components/firebase/firebase";
import { LinkContainer } from "react-router-bootstrap";
import { NavLink } from "react-router-dom";
import { Page } from "constants/pages";
import React from "react";
import SignOutButton from "components/auth/signOutButton";
import { useAuthState } from "react-firebase-hooks/auth";

type NavigationBarProps = {
	links: Page[];
	style: React.CSSProperties;
};
const NavigationBar = ({ links, style }: NavigationBarProps) => {
	const [user] = useAuthState(Firebase().auth);
	return (
		<Navbar variant="dark" bg="dark" expand="sm" id="navbar" style={style}>
			<LinkContainer to={"/"} exact>
				<Navbar.Brand>
					<h3>
						<span role="img" aria-label="middlefinger">
							🖕
						</span>{" "}
						BBCode
					</h3>
				</Navbar.Brand>
			</LinkContainer>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav style={{ width: "100%" }}>
					{links.map((link, i) => {
						return (
							(!link.protected || user !== null) &&
							link.id !== "home" &&
							link.id !== "signIn" &&
							link.id !== "signUp" &&
							link.id !== "forgotPassword" && (
								<NavLink
									key={i}
									to={link.path}
									className="nav-link"
									activeClassName="active">
									{link.name}
								</NavLink>
							)
						);
					})}

					{!user ? (
						<NavLink
							to={"/auth/signin"}
							className="nav-link ml-auto"
							activeClassName="active">
							Sign In
						</NavLink>
					) : (
						<SignOutButton />
					)}
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavigationBar;
