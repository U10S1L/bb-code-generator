import "./settings.css";
import React, { useState, useEffect, useContext } from "react";
import { AppContext, UserType, SiteTheme } from "../../context";
import { Types } from "../../reducers";
import { Form, Row, Col, Button } from "react-bootstrap";
import { SuccessToast } from "../../components/Toast/toast";
import { DropEvent, FileRejection } from "react-dropzone";
import Uploader from "../../components/Uploader/uploader";

const Settings = () => {
    const { state, dispatch } = useContext(AppContext);
    const [user, setUser] = useState<UserType>(state.user);

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
        SuccessToast("Saved User");
    };

    const exportState = () => {
        var dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(state));
        var downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute(
            "download",
            "bbCodeGeneratorExport.json"
        );
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const onDrop = <T extends File>(
        acceptedFiles: T[],
        fileRejections: FileRejection[],
        event: DropEvent
    ): void => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const binaryStr = reader.result;
                if (binaryStr != null) {
                    const stateJson = JSON.parse(binaryStr.toString());
                    dispatch({
                        type: Types.UpdateUser,
                        payload: stateJson.user
                    });
                    dispatch({
                        type: Types.UpdateForms,
                        payload: stateJson.forms
                    });
                }
            };
            reader.readAsText(file);
        });
    };
    useEffect(() => {
        console.log(state.user);
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
                            <Button onClick={() => exportState()}>
                                Download
                            </Button>
                        </Col>
                        <Col xs={4}>
                            <Uploader onDrop={onDrop} />
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
