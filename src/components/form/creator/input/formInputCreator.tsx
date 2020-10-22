import "./formInputCreator.css";

import {
	Button,
	Col,
	Form,
	FormControl,
	InputGroup,
	Modal,
	Row
} from "react-bootstrap";
import { InputComponentProps, InputTypeProps } from "types/formTypes";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { BBCodeFormType } from "types/formTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormPreviewer from "components/form/previewer/formPreviewer";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import InputComponent from "components/inputComponents/inputComponent";
import InputType from "components/inputComponents/inputType";
import { QuestionMarkTooltip } from "components/help/tooltip/tooltips";

const inputIconMap = {
	shortText: "text-width" as IconProp,
	longText: "text-height" as IconProp,
	listItem: "circle" as IconProp,
	date: "calendar-alt" as IconProp,
	time: "clock" as IconProp,
	dateTime: "calendar-times" as IconProp,
	dropdown: "caret-square-down" as IconProp,
	checkbox: "check-square" as IconProp,
	url: "link" as IconProp
};

const inputComponentChoiceList: InputComponentProps[] = [
	{
		uniqueId: "",
		defaultVal: "",
		type: "shortText",
		typeName: "Single Line",
		inputs: [{ type: "shortText", val: "" }]
	},
	{
		uniqueId: "",
		defaultVal: "",
		type: "longText",
		typeName: "Multi Line",
		inputs: [{ type: "longText", val: "" }]
	},
	{
		uniqueId: "",
		defaultVal: "",
		multiStar: true,
		type: "listItem",
		typeName: "List Items [*]",
		inputs: [{ type: "listItem", val: "" }]
	},
	{
		uniqueId: "",
		defaultVal: "",
		type: "date",
		typeName: "Date",
		inputs: [{ type: "date", val: "" }]
	},
	{
		uniqueId: "",
		defaultVal: "",
		type: "time",
		typeName: "Time",
		inputs: [{ type: "time", val: "" }]
	},
	{
		uniqueId: "",
		defaultVal: "",
		type: "dateTime",
		typeName: "Date & Time",
		inputs: [{ type: "dateTime", val: "" }]
	},
	{
		uniqueId: "",
		defaultVal: " ",
		type: "dropdown",
		typeName: "Dropdown",
		inputs: [{ type: "dropdown", val: "" }],
		selectOptions: [" ", ""]
	},
	{
		uniqueId: "",
		defaultVal: "",
		type: "checkbox",
		typeName: "Checkbox",
		inputs: [{ type: "checkbox", val: "false" }]
	},
	{
		uniqueId: "",
		defaultVal: JSON.stringify({ text: "", link: "" }),
		type: "url",
		typeName: "Hyperlink",
		inputs: [{ type: "url", val: JSON.stringify({ text: "", link: "" }) }]
	}
];

type FormInputCreatorProps = {
	newBBCodeForm: BBCodeFormType;
	addInput: (inputType: InputComponentProps) => void;
	updateInput: (newInputComponent: InputComponentProps) => void;
	removeInput: (i: string) => void;
	reorderSelectedInputComponents: (sortObject: {
		oldIndex: number;
		newIndex: number;
	}) => void;
};

type InputComponentModalProps = {
	visible: boolean;
	inputComponent?: InputComponentProps;
	editMode?: boolean;
	handleCancel?: () => void;
	handleSubmit?: (inputComponent: InputComponentProps) => void;
	deleteInput?: (uniqueId: string) => void;
};

const FormInputCreator = ({
	newBBCodeForm,
	addInput,
	updateInput,
	removeInput,
	reorderSelectedInputComponents
}: FormInputCreatorProps) => {
	const [inputComponentModalProps, setInputComponentModalProps] = useState<
		InputComponentModalProps
	>({
		editMode: false,
		visible: false
	});

	const addNewInputComponent = (inputComponent: InputComponentProps) => {
		setInputComponentModalProps({
			editMode: false,
			inputComponent,
			visible: true
		});
	};

	const editInputComponent = (inputComponent: InputComponentProps) => {
		setInputComponentModalProps({
			editMode: true,
			inputComponent,
			visible: true
		});
	};

	const handleSaveInput = (inputComponent: InputComponentProps) => {
		if (!inputComponentModalProps.editMode) {
			// Add New
			inputComponent.uniqueId = `{<${inputComponent.label}>_${
				Math.floor(Math.random() * (9999 - 0)) + 0
			}}`;
			addInput(inputComponent);
		} else {
			// Update Existing
			updateInput(inputComponent);
		}
		setInputComponentModalProps({ editMode: false, visible: false });
	};

	return (
		<Row>
			<Col xs={12} md={2} className="input-selector-container">
				<h4 className="header">Field Types</h4>
				<div className="input-selector">
					<label className="mt-1" />
					<div className="input-types">
						{inputComponentChoiceList.map((inputComponent, i) => {
							return (
								<div key={i} className="btn-col">
									<Button
										onClick={() => addNewInputComponent(inputComponent)}
										variant="primary"
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											width: "100%"
										}}>
										<span style={{ textAlign: "left" }}>
											{inputComponent.typeName}
										</span>
										<FontAwesomeIcon
											icon={inputIconMap[inputComponent.type]}
											fixedWidth
										/>
									</Button>
								</div>
							);
						})}
					</div>
				</div>
			</Col>
			<Col xs={12} md={10}>
				<div className="header">
					<h4 style={{ fontWeight: "bold" }}>Preview</h4>
				</div>

				<FormPreviewer
					bbCodeForm={newBBCodeForm}
					onReorderSelectedInputComponent={reorderSelectedInputComponents}
					onEditSelectedInputComponent={(inputComponent) =>
						editInputComponent(inputComponent)
					}
				/>
			</Col>

			{inputComponentModalProps.visible && (
				<InputComponentModal
					inputComponent={inputComponentModalProps.inputComponent}
					editMode={inputComponentModalProps.editMode}
					visible={inputComponentModalProps.visible}
					handleSubmit={handleSaveInput}
					deleteInput={(uniqueId: string) => {
						removeInput(uniqueId);
						setInputComponentModalProps({ visible: false, editMode: false });
					}}
					handleCancel={() =>
						setInputComponentModalProps({
							editMode: false,
							visible: false
						})
					}
				/>
			)}
		</Row>
	);
};

const InputComponentModal = ({
	inputComponent,
	visible,
	editMode,
	handleCancel,
	handleSubmit,
	deleteInput
}: InputComponentModalProps) => {
	const [label, setLabel] = useState(
		inputComponent?.label ? inputComponent.label : ""
	);
	const [description, setDescription] = useState(
		inputComponent?.description ? inputComponent.description : ""
	);
	const [defaultVal, setDefaultVal] = useState(
		inputComponent ? inputComponent.defaultVal : ""
	);
	const [multi, setMulti] = useState(
		inputComponent?.multi ? inputComponent.multi : false
	);
	const [multiStar, setMultiStar] = useState(
		inputComponent?.multiStar ? inputComponent.multiStar : false
	);
	const [inputs, setInputs] = useState(
		inputComponent ? inputComponent.inputs : []
	);

	const labelRef = useRef<HTMLInputElement>(null!);

	const [labelValid, setLabelValid] = useState(true);

	// Form Validation
	const isValidLabel = useCallback(() => {
		return label && label !== "";
	}, [label]);

	const submitForm = () => {
		if (inputComponent === undefined) {
			return null;
		} else if (!isValidLabel()) {
			setLabelValid(false);
		} else {
			let newInputComponent: InputComponentProps = {
				...inputComponent,
				label,
				description,
				defaultVal,
				multi,
				multiStar,
				selectOptions
			};
			handleSubmit && handleSubmit(newInputComponent);
		}
	};

	const [selectOptions, setSelectOptions] = useState(
		inputComponent ? inputComponent.selectOptions : []
	);
	const updateSelectOption = (selectOption: string, index: number) => {
		var currSelectOptions = selectOptions?.concat();
		currSelectOptions?.splice(index, 1, selectOption);
		setSelectOptions(currSelectOptions);
	};
	const addSelectOption = (startIndex: number) => {
		// Make a copy of the current Inputs
		var currSelectOptions = selectOptions?.concat();
		// Insert new inputTypeItem after the item whose "+" button was clicked
		currSelectOptions?.splice(startIndex + 1, 0, "");
		// Update the list of components
		setSelectOptions(currSelectOptions);
	};
	const removeSelectOption = (index: number) => {
		var currSelectOptions = selectOptions?.concat();
		currSelectOptions?.splice(index, 1);
		setSelectOptions(currSelectOptions?.concat());
	};

	useEffect(() => {
		// Input Component Label validation
		if (!labelValid) {
			setLabelValid(isValidLabel() as boolean);
			labelRef.current.focus();
		}
	}, [label, labelValid, isValidLabel]);

	useEffect(() => {
		// Sets defaults on the Input Components
		var inputsWithDefaults = inputComponent
			? inputComponent.inputs.map((input) => {
					return { ...input, val: defaultVal };
			  })
			: [];
		setInputs(inputsWithDefaults);
	}, [defaultVal, inputComponent]);

	useEffect(() => {
		if (multi) {
			setMultiStar(false);
		}
	}, [multi]);

	useEffect(() => {
		if (multiStar) {
			setMulti(false);
		}
	}, [multiStar]);

	useEffect(() => {
		labelRef.current.focus();
	}, []);

	return (
		<Modal
			show={visible}
			onHide={handleCancel}
			animation={false}
			centered
			backdrop="static"
			keyboard={false}>
			<Modal.Header style={{ display: "flex" }}>
				{inputComponent?.typeName !== undefined && (
					<div style={{ marginBottom: "1rem" }}>
						<h6 className="text-muted"> Type: {inputComponent.typeName} </h6>
					</div>
				)}
				{inputComponent && label && (
					<div style={{ width: "100%" }}>
						<div className="field-preview">
							<div
								style={{
									display: "flex",
									alignItems: "center",
									marginBottom: ".5rem"
								}}>
								<h5>Field Preview</h5>
								<QuestionMarkTooltip
									id="inputFieldPreview"
									text="See/interact with how this field will look on the form."
								/>
							</div>
							<InputComponent
								{...inputComponent}
								label={label}
								multi={multi}
								multiStar={multiStar}
								defaultVal={defaultVal}
								description={description}
								inputs={inputs}
								selectOptions={selectOptions}
								onUpdateInputs={(inputs: InputTypeProps[]) => setInputs(inputs)}
							/>
						</div>
					</div>
				)}
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group>
						<Form.Label style={{ display: "flex", alignItems: "center" }}>
							<span>Name *</span>
						</Form.Label>
						<Form.Control
							value={label}
							type="text"
							onChange={(e) => setLabel(e.target.value)}
							className={`form-control ${!labelValid && "is-invalid"}`}
							ref={labelRef}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label style={{ display: "flex", alignItems: "center" }}>
							Description
							<QuestionMarkTooltip
								id="description"
								text="Useful for reminders of what to write in the input. Appears below the Name."
							/>
						</Form.Label>
						<Form.Control
							value={description}
							type="text"
							onChange={(e) => setDescription(e.target.value)}
						/>
					</Form.Group>
					<Form.Group>
						<div style={{ display: "flex", alignItems: "center" }}>
							<Form.Check
								inline
								type="switch"
								id="isMulti"
								label="Multi"
								checked={multi}
								onChange={() => setMulti(!multi)}
								disabled={inputComponent?.type === "listItem"}
								style={{ marginRight: ".5rem" }}
							/>
							<QuestionMarkTooltip
								id="multi"
								text="Allows you to add more than one value. Each value will generate on a new line."
								styles={{ marginLeft: 0, marginRight: "2rem" }}
							/>
							<Form.Check
								inline
								type="switch"
								id="isMultiStar"
								label="Multi [*]"
								checked={multiStar}
								onChange={() => setMultiStar(!multiStar)}
								disabled={inputComponent?.type === "listItem"}
								style={{ marginRight: ".5rem" }}
							/>
							<QuestionMarkTooltip
								id="multi"
								text="Same as multi, but each value will generate with a [*] in front of it."
								styles={{ marginLeft: 0 }}
							/>
						</div>
					</Form.Group>
					{inputComponent?.type !== undefined &&
						inputComponent?.type !== "dropdown" &&
						inputComponent?.type !== "time" &&
						inputComponent?.type !== "date" &&
						inputComponent?.type !== "dateTime" && (
							<Form.Group>
								<Form.Label style={{ display: "flex", alignItems: "center" }}>
									Default
									<QuestionMarkTooltip
										id="defaultValue"
										text="Setting a default will auto-populate the field's value."
									/>
								</Form.Label>
								<InputType
									type={inputComponent?.type}
									val={defaultVal}
									onUpdateVal={(val) => setDefaultVal(val)}
								/>
							</Form.Group>
						)}
					{inputComponent?.type === "dropdown" && (
						<Form.Group>
							<Form.Label>Options</Form.Label>
							{selectOptions?.map((selectOption, i) => {
								return (
									i !== 0 && (
										<InputGroup key={i}>
											{
												<InputGroup.Prepend>
													<InputGroup.Text>{`${i}`}</InputGroup.Text>
												</InputGroup.Prepend>
											}
											<FormControl
												type="text"
												value={selectOption}
												onChange={(e) => updateSelectOption(e.target.value, i)}
											/>
											<InputGroup.Append>
												<Button
													onClick={() => removeSelectOption(i)}
													disabled={selectOptions?.length === 2}>
													<FontAwesomeIcon icon="minus" />
												</Button>
												<Button onClick={() => addSelectOption(i)}>
													<FontAwesomeIcon icon="plus" />
												</Button>
											</InputGroup.Append>
										</InputGroup>
									)
								);
							})}
						</Form.Group>
					)}
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="danger"
					onClick={() =>
						inputComponent &&
						deleteInput &&
						deleteInput(inputComponent.uniqueId)
					}>
					Delete
				</Button>
				<Button
					variant="warning"
					onClick={handleCancel}
					style={{ marginRight: "auto" }}>
					Cancel
				</Button>
				<Button variant="success" onClick={submitForm}>
					{editMode ? "Save" : "Add"}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default FormInputCreator;
