import React, { useState } from "react";
import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { InputComponentProps, InputTypeProps } from "../../types/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputType from "../InputComponents/inputType";

const InputComponent: React.FC<InputComponentProps> = ({ uniqueId, typeName, label, multi, inputs }) => {
    const [inputCompomentInputs, setInputComponentInputs] = useState<InputTypeProps[]>(inputs);

    const addNewInput = (inputTypeItem: InputTypeProps) => {
        console.log(inputTypeItem);
        setInputComponentInputs(
            inputCompomentInputs.concat({
                ...inputTypeItem,
                val: "",
                uniqueId: `{<${inputTypeItem.type}>_${Math.floor(Math.random() * (9999 - 0)) + 0}}`
            })
        );
    };

    const removeInput = (inputType: InputTypeProps) => {
        setInputComponentInputs(inputCompomentInputs.filter((input) => input !== inputType));
    };

    const updateInput = (index: number, value: any) => {
        setInputComponentInputs(
            inputCompomentInputs.map((inputComponent, i) =>
                index === i ? { ...inputComponent, val: value } : inputComponent
            )
        );
    };

    return (
        <Form.Group as={Row}>
            <Form.Label column xs={4}>
                {label}
            </Form.Label>
            <Col xs={8}>
                {inputCompomentInputs.map((inputType, i) => {
                    const canAddInput = multi && i === inputCompomentInputs.length - 1;
                    const canRemoveInput = multi;

                    return (
                        <InputGroup key={i}>
                            {multi && (
                                <InputGroup.Prepend>
                                    <InputGroup.Text>{`${i + 1}`}</InputGroup.Text>
                                </InputGroup.Prepend>
                            )}
                            <InputType {...inputType} setVal={(val: any) => updateInput(i, val)} />
                            <InputGroup.Append hidden={!multi}>
                                <Button onClick={() => removeInput(inputType)} disabled={!canRemoveInput}>
                                    <FontAwesomeIcon icon="minus" />
                                </Button>
                                <Button onClick={() => addNewInput(inputType)} disabled={!canAddInput}>
                                    <FontAwesomeIcon icon="plus" />
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    );
                })}
            </Col>
        </Form.Group>
    );
};

export default InputComponent;
