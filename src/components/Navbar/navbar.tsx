import "./navbar.css";

import { Button, Nav, Navbar } from "react-bootstrap";
import React, { useState } from "react";

import AuthModal from "components/auth/authModal";
import Firebase from "components/firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";
import { Page } from "constants/pages";
import SignOutButton from "components/auth/forms/signOutButton";
import { useAuthState } from "react-firebase-hooks/auth";

type NavigationBarProps = {
	links: Page[];
	style: React.CSSProperties;
};
const NavigationBar = ({ links, style }: NavigationBarProps) => {
	const [modal, setModal] = useState<{ visible: boolean }>({
		visible: false
	});
	const [user] = useAuthState(Firebase().auth);
	return (
		<>
			<AuthModal
				user={user}
				visible={modal.visible}
				onClose={() => setModal({ ...modal, visible: false })}
			/>
			<Navbar variant="dark" bg="dark" expand="sm" id="navbar" style={style}>
				<LinkContainer to={"/"} exact>
					<Navbar.Brand>
						<h3 style={{ fontWeight: "bold" }}>
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

						<Button
							style={{ marginLeft: "auto" }}
							variant={user ? "success" : "secondary"}
							onClick={() => setModal({ ...modal, visible: true })}>
							<FontAwesomeIcon icon="user" color="white" />
						</Button>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</>
	);
};

export default NavigationBar;
