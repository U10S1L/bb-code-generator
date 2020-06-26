import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { InputComponentProps, InputTypeProps } from "../../types/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputType from "../InputComponents/inputType";

const InputComponent: React.FC<InputComponentProps> = ({
    uniqueId,
    typeName,
    label,
    multi,
    inputs,
    onChangeInputs
}) => {
    const [inputComponentInputs, setInputComponentInputs] = useState<
        InputTypeProps[]
    >(inputs);

    const addNewInput = (inputTypeItem: InputTypeProps, startIndex: number) => {
        // Make a copy of the current inputComponentInputs
        var currInputComponentInputs = inputComponentInputs.concat();
        // Insert new inputTypeItem after the item whose "+" button was clicked
        currInputComponentInputs.splice(startIndex + 1, 0, {
            ...inputTypeItem,
            val: "",
            uniqueId: `{<${inputTypeItem.type}>_${
                Math.floor(Math.random() * (9999 - 0)) + 0
            }}`
        });
        // Update the list of components
        setInputComponentInputs(currInputComponentInputs);
    };
    const removeInput = (inputType: InputTypeProps) => {
        setInputComponentInputs(
            inputComponentInputs.filter((input) => input !== inputType)
        );
    };
    const updateInput = (index: number, value: any) => {
        setInputComponentInputs(
            inputComponentInputs.map((inputComponent, i) =>
                index === i ? { ...inputComponent, val: value } : inputComponent
            )
        );
    };

    useEffect(() => {
        onChangeInputs && onChangeInputs(inputComponentInputs);
    }, [inputComponentInputs]);

    return (
        <Form.Group as={Row}>
            <Form.Label column xs={4}>
                {label}
            </Form.Label>
            <Col xs={8}>
                {inputComponentInputs.map((inputType, i) => {
                    const canAddInput = multi;
                    const canRemoveInput =
                        multi && inputComponentInputs.length !== 1;

                    return (
                        <InputGroup key={i}>
                            {multi && (
                                <InputGroup.Prepend>
                                    <InputGroup.Text>{`${
                                        i + 1
                                    }`}</InputGroup.Text>
                                </InputGroup.Prepend>
                            )}
                            <InputType
                                {...inputType}
                                setVal={(val: any) => updateInput(i, val)}
                            />
                            <InputGroup.Append hidden={!multi}>
                                <Button
                                    onClick={() => removeInput(inputType)}
                                    disabled={!canRemoveInput}>
                                    <FontAwesomeIcon icon="minus" />
                                </Button>
                                <Button
                                    onClick={() => addNewInput(inputType, i)}
                                    disabled={!canAddInput}>
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
