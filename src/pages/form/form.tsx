import React, { useContext, useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import FormRenderer from "../../components/Form/Renderer/formRenderer";
import { AppContext, BBCodeFormType } from "../../context";
import { Button } from "react-bootstrap";
import FormCreator from "./creator/formCreator";
import { Types } from "../../reducers";
import { SuccessToast } from "../../components/Toast/toast";
import CopyToClipboard from "react-copy-to-clipboard";

type FormParams = {
	slug: string;
};

type FormProps = RouteComponentProps<FormParams>;

const BBCodeForm: React.FC<FormProps> = ({ match }) => {
	const { state, dispatch } = useContext(AppContext);

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

	const [editMode, setEditMode] = useState(false);

	const generateBBCode = (): string => {
		const inputComponents = bbCodeForm.inputComponents;
		const matchedBBCode: string = bbCodeForm.matchedBBCode;
		var generatedBBCode: string = matchedBBCode;

		inputComponents.forEach((inputComponent) => {
			var inputComponentVal = ``;
			if (inputComponent.multi) {
				inputComponent.inputs.forEach((input) => {
					inputComponentVal +=
						inputComponent.inputs.indexOf(input) === 0 ||
						inputComponent.inputs.indexOf(input) ===
							inputComponent.inputs.length
							? `\n[*] ${input.val}\n`
							: `[*] ${input.val}\n`;
				});
			} else {
				inputComponentVal = inputComponent.inputs[0].val;
			}

			generatedBBCode = generatedBBCode.replace(
				inputComponent.uniqueId,
				inputComponentVal
			);
		});
		return generatedBBCode;
	};

	const editBBCodeForm = () => {
		setEditMode(true);
		localStorage.setItem("editBBCodeForm", JSON.stringify(bbCodeForm));
	};
	const saveEdits = (bbCodeForm: BBCodeFormType) => {
		setBBCodeForm(bbCodeForm);
		setEditMode(false);
		dispatch({ type: Types.UpdateForm, payload: bbCodeForm });
		localStorage.removeItem("editBBCodeForm");
	};

	const deleteBBCodeForm = () => {
		// Some kind of warning like you can't undo this. And then navigate to home page
		dispatch({ type: Types.DeleteForm, payload: bbCodeForm });
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
	}, [match.params.slug, state.forms]);
	return !editMode ? (
		<div>
			<div className="header">
				<h3>{bbCodeForm.name}</h3>
				<Button
					className="ml-auto"
					variant="info"
					onClick={() => editBBCodeForm()}>
					Edit Form
				</Button>
				<Button variant="danger" onClick={() => deleteBBCodeForm()}>
					Delete Form
				</Button>
			</div>

			<FormRenderer
				bbCodeForm={bbCodeForm}
				onUpdateBBCodeForm={(updatedBBCodeForm) =>
					setBBCodeForm(updatedBBCodeForm)
				}
			/>
			<CopyToClipboard
				text={generateBBCode()}
				onCopy={() => SuccessToast("BBCode Copied To Clipboard")}>
				<Button>Generate BBCode</Button>
			</CopyToClipboard>
		</div>
	) : (
		<FormCreator editMode={true} saveEdits={saveEdits} />
	);
};

export default withRouter(BBCodeForm);
