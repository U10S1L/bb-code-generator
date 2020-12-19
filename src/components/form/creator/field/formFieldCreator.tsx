import "./formFieldCreator.css";

import {
	Button,
	Col,
	Form,
	FormControl,
	InputGroup,
	Modal,
	Row
} from "react-bootstrap";
import { Field, Input } from "types/formTypes";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { BBCodeForm } from "types/formTypes";
import FieldComponent from "components/field/fieldComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormPreviewer from "components/form/previewer/formPreviewer";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import InputType from "components/field/inputType";
import { QuestionMarkTooltip } from "components/help/tooltip/tooltips";

const defaultFieldTypes: Field[] = [
	{
		uniqueId: "",
		defaultVal: "",
		fieldType: { typeCode: "shortText", typeName: "Single Line" },
		inputs: [{ val: "" }]
	},
	{
		uniqueId: "",
		defaultVal: "",
		fieldType: { typeCode: "longText", typeName: "Multi Line" },
		inputs: [{ val: "" }]
	},
	{
		uniqueId: "",
		defaultVal: "",
		multiStar: true,
		fieldType: { typeCode: "listItem", typeName: "List Items [*]" },
		inputs: [{ val: "" }]
	},
	{
		uniqueId: "",
		defaultVal: "",
		fieldType: { typeCode: "date", typeName: "Date" },
		inputs: [{ val: "" }]
	},
	{
		uniqueId: "",
		defaultVal: "",
		fieldType: { typeCode: "time", typeName: "Time" },
		inputs: [{ val: "" }]
	},
	{
		uniqueId: "",
		defaultVal: "",
		fieldType: { typeCode: "dateTime", typeName: "Date & Time" },
		inputs: [{ val: "" }]
	},
	{
		uniqueId: "",
		defaultVal: " ",
		fieldType: { typeCode: "dropdown", typeName: "Dropdown" },
		inputs: [{ val: "" }],
		selectOptions: [" ", ""]
	},
	{
		uniqueId: "",
		defaultVal: "",
		fieldType: { typeCode: "checkbox", typeName: "Checkbox" },
		inputs: [{ val: "false" }]
	},
	{
		uniqueId: "",
		defaultVal: JSON.stringify({ text: "", link: "" }),
		fieldType: { typeCode: "url", typeName: "Hyperlink" },
		inputs: [{ val: JSON.stringify({ text: "", link: "" }) }]
	}
];

const fieldTypeIconsMap = {
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

type FormFieldCreatorProps = {
	newBBCodeForm: BBCodeForm;
	addField: (field: Field) => void;
	updateField: (newField: Field) => void;
	removeField: (i: string) => void;
	reorderField: (sortObject: { oldIndex: number; newIndex: number }) => void;
};

type FieldModalProps = {
	visible: boolean;
	field?: Field;
	editMode?: boolean;
	handleCancel?: () => void;
	handleSubmit?: (field: Field) => void;
	deleteInput?: (uniqueId: string) => void;
};

const FormFieldCreator = ({
	newBBCodeForm,
	addField,
	updateField,
	removeField,
	reorderField
}: FormFieldCreatorProps) => {
	const [fieldModalProps, setFieldModalProps] = useState<FieldModalProps>({
		editMode: false,
		visible: false
	});

	const addNewField = (field: Field) => {
		setFieldModalProps({
			editMode: false,
			field,
			visible: true
		});
	};

	const editField = (field: Field) => {
		setFieldModalProps({
			editMode: true,
			field,
			visible: true
		});
	};

	const handleSaveInput = (field: Field) => {
		if (!fieldModalProps.editMode) {
			// Add New
			field.uniqueId = `{<${field.label}>_${
				Math.floor(Math.random() * (9999 - 0)) + 0
			}}`;
			addField(field);
		} else {
			// Update Existing
			updateField(field);
		}
		setFieldModalProps({ editMode: false, visible: false });
	};

	return (
		<Row>
			<Col xs={12} sm={3} xl={2} className="input-selector-container">
				<h5 className="header">Field Types</h5>
				<div className="input-selector">
					<label className="mt-1" />
					<div className="input-types">
						{defaultFieldTypes.map((field, i) => {
							return (
								<div key={i} className="btn-col">
									<Button
										onClick={() => addNewField(field)}
										variant="primary"
										style={{
											display: "flex",
											alignItems: "center"
										}}>
										<FontAwesomeIcon
											icon={fieldTypeIconsMap[field.fieldType.typeCode]}
											style={{ marginRight: "2rem" }}
											fixedWidth
										/>

										<span
											className="d-block d-sm-none d-md-block"
											style={{ textAlign: "left" }}>
											{field.fieldType.typeName}
										</span>
									</Button>
								</div>
							);
						})}
					</div>
				</div>
			</Col>
			<Col xs={12} sm={9} xl={10}>
				<h5 className="header">Preview</h5>
				<FormPreviewer
					bbCodeForm={newBBCodeForm}
					onReorderSelectedField={reorderField}
					onEditSelectedField={(field) => editField(field)}
				/>
			</Col>

			{fieldModalProps.visible && (
				<FieldModal
					field={fieldModalProps.field}
					editMode={fieldModalProps.editMode}
					visible={fieldModalProps.visible}
					handleSubmit={handleSaveInput}
					deleteInput={(uniqueId: string) => {
						removeField(uniqueId);
						setFieldModalProps({ visible: false, editMode: false });
					}}
					handleCancel={() =>
						setFieldModalProps({
							editMode: false,
							visible: false
						})
					}
				/>
			)}
		</Row>
	);
};

const FieldModal = ({
	field,
	visible,
	editMode,
	handleCancel,
	handleSubmit,
	deleteInput
}: FieldModalProps) => {
	const [label, setLabel] = useState(field?.label ? field.label : "");
	const [description, setDescription] = useState(
		field?.description ? field.description : ""
	);
	const [defaultVal, setDefaultVal] = useState(field ? field.defaultVal : "");
	const [multi, setMulti] = useState(field?.multi ? field.multi : false);
	const [multiStar, setMultiStar] = useState(
		field?.multiStar ? field.multiStar : false
	);
	const [inputs, setInputs] = useState(field ? field.inputs : []);

	const labelRef = useRef<HTMLInputElement>(null!);

	const [labelValid, setLabelValid] = useState(true);

	// Form Validation
	const isValidLabel = useCallback(() => {
		return label && label !== "";
	}, [label]);

	const submitForm = () => {
		if (field === undefined) {
			return null;
		} else if (!isValidLabel()) {
			setLabelValid(false);
		} else {
			let newField: Field = {
				...field,
				label,
				description,
				defaultVal,
				multi,
				multiStar,
				selectOptions
			};
			handleSubmit && handleSubmit(newField);
		}
	};

	const [selectOptions, setSelectOptions] = useState(
		field ? field.selectOptions : []
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
		// Field Label validation
		if (!labelValid) {
			setLabelValid(isValidLabel() as boolean);
			labelRef.current.focus();
		}
	}, [label, labelValid, isValidLabel]);

	useEffect(() => {
		// Sets defaults on the Fields
		var inputsWithDefaults = field
			? field.inputs.map((input) => {
					return { ...input, val: defaultVal };
			  })
			: [];
		setInputs(inputsWithDefaults);
	}, [defaultVal, field]);

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
				{field && (
					<div style={{ marginBottom: "1rem" }}>
						<h6 className="text-muted"> Type: {field.fieldType.typeName} </h6>
					</div>
				)}
				{field && label && (
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
							<Form.Group>
								<Form.Label>
									<span
										style={{
											fontWeight: "bold"
										}}>{`${label}`}</span>
									<div className="small text-muted">{description}</div>
								</Form.Label>
								<FieldComponent
									{...field}
									label={label}
									multi={multi}
									multiStar={multiStar}
									defaultVal={defaultVal}
									description={description}
									inputs={inputs}
									selectOptions={selectOptions}
									onUpdateInputs={(inputs: Input[]) => setInputs(inputs)}
								/>
							</Form.Group>
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
								disabled={field?.fieldType.typeCode === "listItem"}
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
								disabled={field?.fieldType.typeCode === "listItem"}
								style={{ marginRight: ".5rem" }}
							/>
							<QuestionMarkTooltip
								id="multi"
								text="Same as multi, but each value will generate with a [*] in front of it."
								styles={{ marginLeft: 0 }}
							/>
						</div>
					</Form.Group>
					{field &&
						field?.fieldType.typeCode !== "dropdown" &&
						field?.fieldType.typeCode !== "time" &&
						field?.fieldType.typeCode !== "date" &&
						field?.fieldType.typeCode !== "dateTime" && (
							<Form.Group>
								<Form.Label style={{ display: "flex", alignItems: "center" }}>
									Default
									<QuestionMarkTooltip
										id="defaultValue"
										text="Setting a default will auto-populate the field's value."
									/>
								</Form.Label>
								<InputType
									typeCode={field.fieldType.typeCode}
									inputProps={{
										val: defaultVal,
										onUpdateVal: (val: string) => setDefaultVal(val)
									}}
								/>
							</Form.Group>
						)}
					{field?.fieldType.typeCode === "dropdown" && (
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
				{editMode && (
					<Button
						variant="danger"
						onClick={() => field && deleteInput && deleteInput(field.uniqueId)}>
						Delete
					</Button>
				)}
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

export default FormFieldCreator;
