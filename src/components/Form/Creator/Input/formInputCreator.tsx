import "./formInputCreator.css";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputComponentProps } from "../../../../types/form";
import {
    Container,
    Row,
    Col,
    Form,
    Card,
    InputGroup,
    Button
} from "react-bootstrap";
import {
    SortableContainer,
    SortableElement,
    SortableHandle
} from "react-sortable-hoc";
import FormPreviewer from "../../Previewer/formPreviewer";
import { BBCodeFormType } from "../../../../context";

const DragHandle = SortableHandle(() => (
    <div className="drag-handle">
        <FontAwesomeIcon icon="bars" />
    </div>
));

type SelectedInputComponentProps = {
    inputComponent: InputComponentProps;
    deleteSelf: () => void;
    updateSelf: (inputComponent: InputComponentProps) => void;
};

const SelectedInputComponent = SortableElement(
    ({
        inputComponent,
        deleteSelf,
        updateSelf
    }: SelectedInputComponentProps) => {
        const [inEditMode, setInEditMode] = useState(false);
        const [label, setLabel] = useState(inputComponent.label);

        const handleToggleEditMode = () => {
            if (inEditMode) {
                updateSelf({
                    ...inputComponent,
                    label
                });
            }
            setInEditMode(!inEditMode);
        };

        useEffect(() => {
            setLabel(inputComponent.label);
        }, [inputComponent]);
        return (
            <Card className="selected-input-component">
                <Card.Body>
                    <Card.Title className="title">
                        <InputGroup>
                            <Form.Control
                                as="textarea"
                                className="title-text"
                                name="label"
                                disabled={!inEditMode}
                                plaintext={!inEditMode}
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                            />
                            <Button
                                variant={!inEditMode ? "secondary" : "success"}
                                onClick={() => handleToggleEditMode()}>
                                <FontAwesomeIcon
                                    icon={!inEditMode ? "edit" : "check"}
                                />
                            </Button>
                            {inEditMode && (
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        setInEditMode(false);
                                        deleteSelf();
                                    }}>
                                    <FontAwesomeIcon icon="times" />
                                </Button>
                            )}
                        </InputGroup>
                    </Card.Title>
                    <Card.Subtitle className="type-text text-muted">
                        {inputComponent.typeName}
                        {inputComponent.multi ? " (Multi)" : null}
                    </Card.Subtitle>
                </Card.Body>
                <Card.Footer className="footer">
                    <DragHandle />
                </Card.Footer>
            </Card>
        );
    }
);

type SortableSelectedInputComponentsProps = {
    inputComponents: InputComponentProps[];
    removeInput: (uniqueId: string) => void;
    updateInput: (inputComponent: InputComponentProps) => void;
};

const SortableSelectedInputComponents = SortableContainer(
    ({
        inputComponents,
        removeInput,
        updateInput
    }: SortableSelectedInputComponentsProps) => {
        return (
            <ul>
                {inputComponents &&
                    inputComponents.map((inputComponent, index) => (
                        <SelectedInputComponent
                            index={index}
                            key={index}
                            inputComponent={inputComponent}
                            deleteSelf={() =>
                                removeInput(inputComponent.uniqueId)
                            }
                            updateSelf={(inputComponent) =>
                                updateInput(inputComponent)
                            }
                        />
                    ))}
            </ul>
        );
    }
);

const inputComponentChoiceList: InputComponentProps[] = [
    {
        uniqueId: "",
        typeName: "Short Text",
        inputs: [{ type: "shortText", val: "" }],
        onChangeInputs: undefined
    },
    {
        uniqueId: "",
        typeName: "Long Text",
        inputs: [{ type: "longText", val: "" }],
        onChangeInputs: undefined
    },
    {
        uniqueId: "",
        typeName: "Number",
        inputs: [{ type: "number", val: "" }],
        onChangeInputs: undefined
    }
];

type FormInputCreatorProps = {
    newBBCodeForm: BBCodeFormType;
    addInput: (inputType: InputComponentProps) => void;
    updateInput: (inputComponent: InputComponentProps) => void;
    removeInput: (i: string) => void;
    reorderSelectedInputComponents: (sortObject: {
        oldIndex: number;
        newIndex: number;
    }) => void;
};

const FormInputCreator = (props: FormInputCreatorProps) => {
    const [inputName, setInputName] = useState<string>("");
    const [inputNameValid, setInputNameValid] = useState<boolean>(true);
    const [isMulti, setIsMulti] = useState(false);
    const inputNameRef = useRef<HTMLInputElement>(null!);

    const onClickInputComponent = (inputComponent: InputComponentProps) => {
        if (isValidInputName(inputName)) {
            let newInputComponent: InputComponentProps = {
                ...inputComponent,
                uniqueId: `{<${inputName}>_${
                    Math.floor(Math.random() * (9999 - 0)) + 0
                }}`,
                multi: isMulti,
                label: inputName
            };

            newInputComponent.inputs = inputComponent.inputs.map((input) => ({
                ...input,
                uniqueId: `{<${input.type}>_${
                    Math.floor(Math.random() * (9999 - 0)) + 0
                }}`
            }));

            props.addInput(newInputComponent);

            // Sanitization
            setIsMulti(false);
            setInputName("");
        } else {
            setInputNameValid(false);
        }
    };

    const isValidInputName = (inputName: string) => {
        return inputName && inputName !== "";
    };

    useEffect(() => {
        inputNameRef.current.focus();

        if (!inputNameValid) {
            setInputNameValid(isValidInputName(inputName) as boolean);
        }
    }, [inputName, inputNameValid]);

    return (
        <div className="component-wrapper flex-grow-1">
            <Row>
                <Col xs={12}>
                    <h3 className="header">Add Inputs</h3>
                </Col>
            </Row>
            <Row className="flex-grow-1">
                <Col xs={12} sm={2} className="input-selector-container">
                    <div className="input-selector">
                        <label className="mt-1" />
                        <Form.Control
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            type="text"
                            className={`form-control ${
                                !inputNameValid && "is-invalid"
                            }`}
                            ref={inputNameRef}
                            placeholder="Label"
                        />
                        <Form.Check
                            type="switch"
                            id="isMulti"
                            label="Multi"
                            checked={isMulti}
                            onChange={() => setIsMulti(!isMulti)}
                        />
                        <div className="input-types">
                            {inputComponentChoiceList.map(
                                (inputComponent, i) => {
                                    return (
                                        <div key={i} className="btn-col">
                                            <button
                                                onClick={() =>
                                                    onClickInputComponent(
                                                        inputComponent
                                                    )
                                                }
                                                type="button"
                                                className="btn btn-primary">
                                                {inputComponent.typeName}
                                            </button>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={10}>
                    <Container fluid>
                        <Row>
                            <Col xs={12} md={4}>
                                <h4 className="header">Selected Inputs</h4>
                                <SortableSelectedInputComponents
                                    inputComponents={
                                        props.newBBCodeForm.inputComponents
                                    }
                                    removeInput={props.removeInput}
                                    updateInput={props.updateInput}
                                    onSortEnd={
                                        props.reorderSelectedInputComponents
                                    }
                                    useDragHandle
                                />
                            </Col>
                            <Col xs={12} md={8}>
                                <h4 className="header">Preview</h4>
                                <FormPreviewer
                                    bbCodeForm={props.newBBCodeForm}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </div>
    );
};

export default FormInputCreator;
