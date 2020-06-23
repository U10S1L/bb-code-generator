import React from "react";
import { Form } from "react-bootstrap";
import { InputTypeProps } from "../../../types/form";

const LongText = ({ placeholder, readOnly, val, setVal }: InputTypeProps) => {
    return (
        <Form.Control
            as="textarea"
            readOnly={readOnly}
            value={val}
            onChange={(e) => setVal && setVal(e.target.value)}
            placeholder={placeholder}
        />
    );
};

export default LongText;
