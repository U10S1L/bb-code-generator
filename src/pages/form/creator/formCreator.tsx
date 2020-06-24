import "./formCreator.css";
import React, { Fragment, useState, useEffect, useContext } from "react";
import { AppContext, BBCodeFormType } from "../../../context";
import FormSetupCreator from "../../../components/Form/Creator/Setup/formSetupCreator";
import FormInputCreator from "../../../components/Form/Creator/Input/formInputCreator";
import FormBBCodeMatch from "../../../components/Form/Creator/BBCode/Match/formBBCodeMatch";
import FormBBCodeUpload from "../../../components/Form/Creator/BBCode/Upload/formBBCodeUpload";
import Help from "../../../components/Help/help";
import { useHistory } from "react-router-dom";
import { InputComponentProps } from "../../../types/form";
import { Button } from "react-bootstrap";
import arrayMove from "array-move";
import { Types } from "../../../reducers";
var slugify = require("slugify");

export enum FormCreationStep {
    FORM_SETUP,
    INPUT_CREATION,
    BBCODE_UPLOAD,
    BBCODE_MATCH
}

const FormCreator = () => {
    const { dispatch } = useContext(AppContext);
    const [formCreationStep, setFormCreationStep] = useState(
        FormCreationStep.FORM_SETUP
    );
    const [newBBCodeForm, setNewBBCodeForm] = useState<BBCodeFormType>({
        uniqueId: "",
        slug: "",
        name: "",
        inputComponents: [],
        rawBBCode: "",
        matchedBBCode: ""
    });
    let history = useHistory();

    // Form Creation Step
    const incrementFormCreationStep = (): void => {
        switch (formCreationStep) {
            case FormCreationStep.FORM_SETUP:
                setFormCreationStep(FormCreationStep.INPUT_CREATION);
                break;
            case FormCreationStep.INPUT_CREATION:
                setFormCreationStep(FormCreationStep.BBCODE_UPLOAD);
                break;
            case FormCreationStep.BBCODE_UPLOAD:
                setFormCreationStep(FormCreationStep.BBCODE_MATCH);
                break;
            case FormCreationStep.BBCODE_MATCH:
                dispatch({
                    type: Types.AddForm,
                    payload: {
                        ...newBBCodeForm,
                        uniqueId: `{<${newBBCodeForm.name}>_${
                            Math.floor(Math.random() * (9999 - 0)) + 0
                        }}`,
                        slug: slugify(newBBCodeForm.name)
                    }
                });
                localStorage.setItem("newBBCodeForm", JSON.stringify({}));
                history.push(`/form/${slugify(newBBCodeForm.name)}`);
                break;
        }
    };
    const decrementFormCreationStep = (): void => {
        switch (formCreationStep) {
            case FormCreationStep.INPUT_CREATION:
                setFormCreationStep(FormCreationStep.FORM_SETUP);
                break;
            case FormCreationStep.BBCODE_UPLOAD:
                setFormCreationStep(FormCreationStep.INPUT_CREATION);
                break;
            case FormCreationStep.BBCODE_MATCH:
                setFormCreationStep(FormCreationStep.BBCODE_UPLOAD);
                break;
        }
    };

    // Form Name
    const updateFormName = (newName: string): void => {
        setNewBBCodeForm({
            ...newBBCodeForm,
            name: newName
        });
    };

    // Form Input Components
    const addSelectedInputComponent = (
        inputComponent: InputComponentProps
    ): void => {
        if (newBBCodeForm.inputComponents == null) {
            setNewBBCodeForm({
                ...newBBCodeForm,
                inputComponents: [inputComponent]
            });
        } else {
            setNewBBCodeForm({
                ...newBBCodeForm,
                inputComponents: newBBCodeForm.inputComponents.concat(
                    inputComponent
                )
            });
        }
    };
    const updateSelectedInputComponent = (
        newInputComponent: InputComponentProps
    ): void => {
        setNewBBCodeForm({
            ...newBBCodeForm,
            inputComponents: newBBCodeForm.inputComponents.map(
                (currInputComponent) =>
                    currInputComponent.uniqueId === newInputComponent.uniqueId
                        ? newInputComponent
                        : currInputComponent
            )
        });
    };
    const removeSelectedInputComponent = (
        selectedInputComponentUniqueId: string
    ) => {
        setNewBBCodeForm({
            ...newBBCodeForm,
            inputComponents: newBBCodeForm.inputComponents.filter(
                (selectedInput) =>
                    selectedInput.uniqueId !== selectedInputComponentUniqueId
            )
        });
    };
    const reorderSelectedInputComponents = (sortObject: {
        oldIndex: number;
        newIndex: number;
    }) => {
        setNewBBCodeForm({
            ...newBBCodeForm,
            inputComponents: arrayMove(
                newBBCodeForm.inputComponents,
                sortObject.oldIndex,
                sortObject.newIndex
            )
        });
    };

    // Form BB Code
    const updateRawBBCode = (rawBBCode: string) => {
        setNewBBCodeForm({
            ...newBBCodeForm,
            rawBBCode,
            matchedBBCode: rawBBCode
        });
    };

    const updateMatchedBBCode = (matchedBBCode: string) => {
        setNewBBCodeForm({ ...newBBCodeForm, matchedBBCode });
    };

    useEffect(() => {
        if (newBBCodeForm.name !== "") {
            localStorage.setItem(
                "newBBCodeForm",
                JSON.stringify(newBBCodeForm)
            );
        } else {
            const newBBCodeFormStorageString = localStorage.getItem(
                "newBBCodeForm"
            );
            if (newBBCodeFormStorageString != null) {
                setNewBBCodeForm(JSON.parse(newBBCodeFormStorageString));
            }
        }
    }, [newBBCodeForm]);

    return (
        <Fragment>
            {formCreationStep === FormCreationStep.FORM_SETUP && (
                <FormSetupCreator
                    val={newBBCodeForm.name}
                    setVal={updateFormName}
                />
            )}

            {formCreationStep === FormCreationStep.INPUT_CREATION && (
                <FormInputCreator
                    newBBCodeForm={newBBCodeForm}
                    addInput={addSelectedInputComponent}
                    updateInput={updateSelectedInputComponent}
                    removeInput={removeSelectedInputComponent}
                    reorderSelectedInputComponents={
                        reorderSelectedInputComponents
                    }
                />
            )}
            {formCreationStep === FormCreationStep.BBCODE_UPLOAD && (
                <FormBBCodeUpload
                    rawBBCode={newBBCodeForm.rawBBCode}
                    setRawBBCode={updateRawBBCode}
                />
            )}
            {formCreationStep === FormCreationStep.BBCODE_MATCH && (
                <FormBBCodeMatch
                    selectedInputComponents={newBBCodeForm.inputComponents}
                    matchedBBCode={newBBCodeForm.matchedBBCode}
                    setMatchedBBCode={updateMatchedBBCode}
                />
            )}
            <div className="row mt-auto">
                {formCreationStep !== FormCreationStep.FORM_SETUP && (
                    <Button
                        className="btn btn-default col"
                        variant="dark"
                        onClick={() => decrementFormCreationStep()}>
                        Back
                    </Button>
                )}
                <Button
                    className="btn btn-default col"
                    variant="dark"
                    onClick={() => incrementFormCreationStep()}
                    disabled={
                        (formCreationStep === FormCreationStep.FORM_SETUP &&
                            newBBCodeForm.name === "") ||
                        (formCreationStep === FormCreationStep.INPUT_CREATION &&
                            (newBBCodeForm.inputComponents == null ||
                                newBBCodeForm.inputComponents.length === 0)) ||
                        (formCreationStep === FormCreationStep.BBCODE_UPLOAD &&
                            newBBCodeForm.rawBBCode === "")
                    }>
                    {formCreationStep === FormCreationStep.FORM_SETUP &&
                        "Start"}
                    {(formCreationStep === FormCreationStep.INPUT_CREATION ||
                        formCreationStep === FormCreationStep.BBCODE_UPLOAD) &&
                        "Next"}
                    {formCreationStep === FormCreationStep.BBCODE_MATCH &&
                        "Save"}
                </Button>
            </div>
        </Fragment>
    );
};
export default FormCreator;
