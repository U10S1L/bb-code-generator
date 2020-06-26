import React, { useEffect, useState } from "react";
import { BBCodeFormType } from "../../../context";
import InputComponent from "../../InputComponents/inputComponent";
import { Form } from "react-bootstrap";
import { InputTypeProps, InputComponentProps } from "../../../types/form";

type FormRendererProps = {
    bbCodeForm: BBCodeFormType;
    onUpdateRenderedBBCodeForm: (bbCodeForm: BBCodeFormType) => void;
};

const FormRenderer = ({
    bbCodeForm,
    onUpdateRenderedBBCodeForm
}: FormRendererProps) => {
    const [renderedBBCodeForm, setRenderedBBCodeForm] = useState(bbCodeForm);

    const onUpdateInputComponentInputs = (
        inputComponentIndex: number,
        inputComponentInputs: InputTypeProps[]
    ) => {
        // Make a copy of the current Rendered BB Code Form
        var newInputComponents = renderedBBCodeForm.inputComponents.concat();
        newInputComponents[inputComponentIndex].inputs = inputComponentInputs;

        setRenderedBBCodeForm({
            ...renderedBBCodeForm,
            inputComponents: newInputComponents
        });
    };

    useEffect(() => {
        onUpdateRenderedBBCodeForm(renderedBBCodeForm);
    }, [renderedBBCodeForm]);

    useEffect(() => {
        setRenderedBBCodeForm(bbCodeForm);
    }, [bbCodeForm]);

    return (
        <div className="container">
            <Form>
                <h4>{renderedBBCodeForm.name}</h4>
                {renderedBBCodeForm.inputComponents != null &&
                    renderedBBCodeForm.inputComponents.map(
                        (inputComponent, i) => {
                            return (
                                <InputComponent
                                    {...inputComponent}
                                    key={i}
                                    onChangeInputs={(updatedInputs) =>
                                        onUpdateInputComponentInputs(
                                            i,
                                            updatedInputs
                                        )
                                    }
                                />
                            );
                        }
                    )}
            </Form>
        </div>
    );
};

export default FormRenderer;
