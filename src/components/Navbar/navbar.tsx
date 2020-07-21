import "./navbar.css";

import { Nav, Navbar } from "react-bootstrap";
import React, { useContext, useEffect } from "react";

import { AppContext } from "context/context";
import Clock from "react-live-clock";
import { LinkContainer } from "react-router-bootstrap";
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
	const [user] = useAuthState(state.firebase.auth);

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
				<Nav className="mr-auto">
					{links.map((link, i) => {
						return (
							link.id !== "home" &&
							link.id !== "signIn" &&
							link.id !== "signUp" &&
							link.id !== "forgotPassword" && (
								<LinkContainer to={link.path} key={i}>
									<Nav.Link>{link.name}</Nav.Link>
								</LinkContainer>
							)
						);
					})}
				</Nav>
				{!state.authUser ? (
					<LinkContainer to={"/auth/signin"}>
						<Nav.Link>Sign In</Nav.Link>
					</LinkContainer>
				) : (
					<SignOutButton />
				)}
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
