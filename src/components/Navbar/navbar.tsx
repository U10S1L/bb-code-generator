import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Image } from "react-bootstrap";
import "./navbar.css";
import { Page } from "../../constants/pages";
import Clock from "react-live-clock";

type NavigationBarProps = {
	links: Page[];
	style: React.CSSProperties;
};
const NavigationBar = ({ links, style }: NavigationBarProps) => {
	return (
		<Navbar variant="dark" bg="dark" expand="sm" id="navbar" style={style}>
			<LinkContainer to={"/"} exact>
				<Navbar.Brand>
					<Image
						style={{ width: "10rem" }}
						src="https://media.discordapp.net/attachments/726623599200305192/726843029620785172/Untitled.png?width=717&height=152"></Image>
				</Navbar.Brand>
			</LinkContainer>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					{links.map((link, i) => {
						return (
							link.id !== "home" && (
								<LinkContainer to={link.path} key={i} exact>
									<Nav.Link>{link.name}</Nav.Link>
								</LinkContainer>
							)
						);
					})}
				</Nav>
				<span style={{ color: "white" }}>
					<Clock timezone={"GMT"} />
				</span>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavigationBar;
