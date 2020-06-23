import React from "react";
import { BBCodeFormType } from "../../../context";
import InputComponent from "../../InputComponents/inputComponent";
import { Form, Button } from "react-bootstrap";

type FormRendererProps = {
    bbCodeForm: BBCodeFormType;
};

const FormRenderer = ({ bbCodeForm }: FormRendererProps) => {
    return (
        <Form>
            <h4>{bbCodeForm.name}</h4>
            {bbCodeForm.inputComponents != null &&
                bbCodeForm.inputComponents.map((inputComponent, i) => {
                    return <InputComponent {...inputComponent} key={i} />;
                })}
            <Button block>Generate BBCode</Button>
        </Form>
    );
};

export default FormRenderer;
