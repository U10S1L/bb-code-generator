import React, { useContext } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavDropdown, Image } from "react-bootstrap";
import { AppContext } from "../../context";
import "./navbar.css";
import { Page } from "../../constants/pages";

type NavigationBarProps = {
	links: Page[];
	style: React.CSSProperties;
};
const NavigationBar = ({ links, style }: NavigationBarProps) => {
	const { state } = useContext(AppContext);

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
					<NavDropdown title="Forms" id="basic-nav-dropdown">
						{state.forms.map((bbCodeForm, i) => {
							return (
								<LinkContainer to={`/form/${bbCodeForm.slug}`} key={i} exact>
									<NavDropdown.Item>{bbCodeForm.name}</NavDropdown.Item>
								</LinkContainer>
							);
						})}
					</NavDropdown>
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
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavigationBar;
