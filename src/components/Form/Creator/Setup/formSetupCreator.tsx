import React, { useRef, useEffect } from "react";
import { Row, Col, InputGroup, Form, FormGroup } from "react-bootstrap";

type FormNameCreatorProps = {
    val: string;
    setVal: (name: string) => void;
};

const FormNameCreator = ({ val, setVal }: FormNameCreatorProps) => {
    const formNameRef = useRef<HTMLInputElement>(null!);

    useEffect(() => {
        if (formNameRef.current != null) {
            formNameRef.current.focus();
        }
    });

    return (
        <div className="component-wrapper flex-grow-1">
            <Row>
                <Col xs={12}>
                    <h3 className="header">Setup</h3>
                </Col>
            </Row>
            <Row className="flex-grow-1">
                <Col xs={12}>
                    <InputGroup>
                        <FormGroup>
                            <Form.Label>Form Name</Form.Label>
                            <Form.Control
                                type="text"
                                size="lg"
                                value={val}
                                onChange={(e) => {
                                    setVal(e.target.value);
                                }}
                                ref={formNameRef}
                            />
                        </FormGroup>
                    </InputGroup>
                </Col>
            </Row>
        </div>
    );
};

export default FormNameCreator;
