import "./navbar.css";

import { Nav, Navbar } from "react-bootstrap";
import React, { useContext, useEffect } from "react";

import { AppContext } from "context/context";
import { LinkContainer } from "react-router-bootstrap";
import { NavLink } from "react-router-dom";
import { Page } from "constants/pages";
import SignOutButton from "components/auth/signOutButton";
import { Types } from "types/contextTypes";
import logoImage from "images/logo.svg";
import { useAuthState } from "react-firebase-hooks/auth";

type NavigationBarProps = {
	links: Page[];
	style: React.CSSProperties;
};
const NavigationBar = ({ links, style }: NavigationBarProps) => {
	const { state, dispatch } = useContext(AppContext);
	const [user, loading] = useAuthState(state.firebase.auth);

	useEffect(() => {
		user
			? dispatch({ type: Types.UpdateAuthUser, payload: user })
			: dispatch({ type: Types.DeleteAuthUser, payload: null });
	}, [user, dispatch]);
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
				{!loading ? (
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

						{!state.authUser ? (
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
				) : null}
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavigationBar;
