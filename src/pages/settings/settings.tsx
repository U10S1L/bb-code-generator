import React, { useState, useEffect, useContext } from "react";
import { AppContext, UserType } from "../../context";
import { Types } from "../../reducers";
import { Row, Col, Form, Button } from "react-bootstrap";
import { successToast } from "../../components/Toast/toast";
const Settings = () => {
    const [user, setUser] = useState<UserType>({
        firstName: "",
        lastName: "",
        badgeNumber: ""
    });
    const { state, dispatch } = useContext(AppContext);

    const handleChange = (e: any) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const saveUser = () => {
        dispatch({
            type: Types.UpdateUser,
            payload: user
        });
        successToast("Saved User");
    };

    useEffect(() => {
        setUser(state.user);
    }, [state]);
    return (
        <div className="component-wrapper flex-grow-1">
            <Row>
                <Col xs={12}>
                    <h3 className="header">Settings</h3>
                </Col>
            </Row>
            <Row className="flex-grow-1">
                <Col xs={12}>
                    <h4>User</h4>
                    <Form>
                        <Form.Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={user.firstName}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={user.lastName}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Badge Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="badgeNumber"
                                        value={user.badgeNumber}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Button variant="primary" onClick={saveUser}>
                                    Save User
                                </Button>
                            </Col>
                        </Form.Row>
                    </Form>
                </Col>
                <Col xs={12}>
                    <h4>Forms</h4>
                    <Row>
                        <Col xs={4}>
                            <Button>Download Forms</Button>
                        </Col>
                        <Col xs={4}>
                            <Button variant="danger">Clear All Data</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Settings;
