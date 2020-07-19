import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav } from "react-bootstrap";
import "./navbar.css";
import { Page } from "constants/pages";
import Clock from "react-live-clock";
import logoImage from "images/logo.svg";

type NavigationBarProps = {
	links: Page[];
	style: React.CSSProperties;
};
const NavigationBar = ({ links, style }: NavigationBarProps) => {
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
							link.id !== "home" && (
								<LinkContainer to={link.path} key={i}>
									<Nav.Link>{link.name}</Nav.Link>
								</LinkContainer>
							)
						);
					})}
				</Nav>
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
