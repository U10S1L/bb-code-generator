import React, { useContext} from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { AppContext } from "../../context";
import "./navbar.css";
import { Page } from "../../constants/pages";

type NavigationBarProps = {
    links: Page[];
};
const NavigationBar = ({ links }: NavigationBarProps) => {
    const { state } = useContext(AppContext);

    return(
        <Navbar variant="dark" bg="dark" expand="sm" id="navbar">
            <LinkContainer to={"/"}>
                <Navbar.Brand>
                    <img className="lspd-logo img-fluid" src="https://i.imgur.com/w6Kdktt.png" alt="LSPD Logo" />
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
