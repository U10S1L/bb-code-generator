import "./navigationBar.css";

import { Button, Nav, Navbar } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import AuthModal from "components/auth/authModal";
import Firebase from "components/firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";
import { NavLink } from "react-router-dom";
import { Page } from "constants/pages";
import { useAuthState } from "react-firebase-hooks/auth";

type NavigationBarProps = {
	links: Page[];
};
const NavigationBar = ({ links }: NavigationBarProps) => {
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
			<Navbar bg="dark" variant="dark" expand="sm" id="navbar">
				<LinkContainer to={"/"} exact>
					<Navbar.Brand>
						<h4 style={{ fontWeight: "bold" }}>
							<span role="img" aria-label="middlefinger">
								🖕
							</span>{" "}
							BBCode
						</h4>
					</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse
					id="basic-navbar-nav"
					style={{ display: "flex", justifyContent: "center" }}>
					<Nav>
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
										<h5>{link.name}</h5>
									</NavLink>
								)
							);
						})}
					</Nav>
				</Navbar.Collapse>
				<div>
					<Button
						variant={user ? "success" : "secondary"}
						onClick={() => setModal({ ...modal, visible: true })}>
						<FontAwesomeIcon icon="user" color="white" fixedWidth />
					</Button>
				</div>
			</Navbar>
		</>
	);
};

export default NavigationBar;
