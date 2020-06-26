import React, { useContext, useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import FormRenderer from "../../components/Form/Renderer/formRenderer";
import { AppContext, BBCodeFormType } from "../../context";
import { Button } from "react-bootstrap";

type FormParams = {
    slug: string;
};

type FormProps = RouteComponentProps<FormParams>;

const BBCodeForm: React.FC<FormProps> = ({ match }) => {
    const { state } = useContext(AppContext);

    const [bbCodeForm, setBBCodeForm] = useState<BBCodeFormType>(
        state.forms.find((form) => form.slug === match.params.slug) || {
            uniqueId: "",
            slug: "",
            name: "",
            inputComponents: [],
            rawBBCode: "",
            matchedBBCode: ""
        }
    );

    const generateBBCode = () => {
        const inputComponents = bbCodeForm.inputComponents;
        const matchedBBCode: string = bbCodeForm.matchedBBCode;
        var generatedBBCode = matchedBBCode;

        inputComponents.forEach((inputComponent) => {
            var inputComponentVal = ``;

            if (inputComponent.multi) {
                inputComponent.inputs.forEach((input) => {
                    inputComponent.inputs.indexOf(input) ===
                    inputComponent.inputs.length
                        ? (inputComponentVal += `\n[*] ${input.val}`)
                        : (inputComponentVal += `\n[*] ${input.val}\n`);
                });
            } else {
                inputComponentVal = inputComponent.inputs[0].val;
            }

            generatedBBCode = generatedBBCode.replace(
                inputComponent.uniqueId,
                inputComponentVal
            );
        });

        console.log(generatedBBCode);
    };

    useEffect(() => {
        setBBCodeForm(
            state.forms.find((form) => form.slug === match.params.slug) || {
                uniqueId: "",
                slug: "",
                name: "",
                inputComponents: [],
                rawBBCode: "",
                matchedBBCode: ""
            }
        );
    }, [match.params.slug]);
    return (
        <div>
            <FormRenderer
                bbCodeForm={bbCodeForm}
                onUpdateRenderedBBCodeForm={(updatedBBCodeForm) =>
                    setBBCodeForm(updatedBBCodeForm)
                }
            />
            <Button block onClick={() => generateBBCode()}>
                Generate BBCode
            </Button>
        </div>
    );
};

export default withRouter(BBCodeForm);
