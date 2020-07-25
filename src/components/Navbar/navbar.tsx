import "./navbar.css";

import { Nav, Navbar } from "react-bootstrap";
import React, { useContext } from "react";

import { AppContext } from "context/context";
import { LinkContainer } from "react-router-bootstrap";
import { NavLink } from "react-router-dom";
import { Page } from "constants/pages";
import SignOutButton from "components/auth/signOutButton";
import logoImage from "images/logo.svg";
import { useAuthState } from "react-firebase-hooks/auth";

type NavigationBarProps = {
	links: Page[];
	style: React.CSSProperties;
};
const NavigationBar = ({ links, style }: NavigationBarProps) => {
	const { state } = useContext(AppContext);
	const [user] = useAuthState(state.firebase.auth);

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
