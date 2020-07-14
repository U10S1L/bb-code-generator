import React, { useState, useRef, useEffect } from "react";
import { Row, Col, InputGroup, Form, FormGroup } from "react-bootstrap";
import StandardModal from "../../../Modals/standardModal";
import Uploader from "../../../Uploader/uploader";
import { FileRejection, DropEvent } from "react-dropzone";
import { BBCodeFormType } from "../../../../context";
import { QuestionMarkTooltip } from "../../../Help/Tooltip/tooltips";

type FormNameCreatorProps = {
	val: string;
	setVal: (name: string) => void;
	loadBBCodeForm: (bbCodeForm: BBCodeFormType) => void;
};

const FormNameCreator = ({
	val,
	setVal,
	loadBBCodeForm
}: FormNameCreatorProps) => {
	const [uploaderModalVisible, setUploaderModalVisible] = useState(false);
	const [uploadedBBCodeForm, setUploadedBBCodeForm] = useState<{
		acceptedFiles: File[];
	}>();
	const formNameRef = useRef<HTMLInputElement>(null!);

	const handleCloseUploaderWarningModal = () => {
		setUploaderModalVisible(false);
		setUploadedBBCodeForm(undefined);
	};

	const onDrop = <T extends File>(
		acceptedFiles: T[],
		fileRejections: FileRejection[],
		event: DropEvent
	): void => {
		setUploadedBBCodeForm({ acceptedFiles });
		setUploaderModalVisible(true);
	};

	const loadBBCodeFormFromFile = (): void => {
		uploadedBBCodeForm &&
			uploadedBBCodeForm.acceptedFiles.forEach((file) => {
				const reader = new FileReader();
				reader.onload = () => {
					const binaryStr = reader.result;
					if (binaryStr != null) {
						const bbCodeFormJson = JSON.parse(binaryStr.toString());
						// Send the form via prop function back to formCreator where it'll be loaded in as the newBBCodeForm and in state
						loadBBCodeForm(bbCodeFormJson);
					}
				};
				reader.readAsText(file);
			});
		handleCloseUploaderWarningModal();
	};

	useEffect(() => {
		if (formNameRef.current != null) {
			formNameRef.current.focus();
		}
	});

	return (
		<Row>
			<Col xs={12} lg={8}>
				<h4 className="header">New Form</h4>
				<InputGroup>
					<FormGroup style={{ width: "100%" }}>
						<Form.Control
							type="text"
							size="lg"
							value={val}
							onChange={(e) => {
								setVal(e.target.value);
							}}
							ref={formNameRef}
							placeholder="Name"
						/>
					</FormGroup>
				</InputGroup>
			</Col>
			<Col xs={12} lg={4}>
				<h4 className="header">
					Start From File{" "}
					<QuestionMarkTooltip
						text="If you downloaded an exported form, drop it here to start the setup process from those presets."
						id="startFromFile"
					/>
				</h4>
				<Uploader onDrop={onDrop} styles={{ height: "10rem" }} />
			</Col>
			<StandardModal
				visible={uploaderModalVisible}
				handleClose={() => handleCloseUploaderWarningModal()}
				handleContinue={() => loadBBCodeFormFromFile()}
				title="WARNING"
				message="This action will overwrite any form creation progress you might have. Are you sure you want to continue?"
				closeBtnText="Cancel"
				continueBtnText="Yes, overwrite any existing progress."
			/>
		</Row>
	);
};

export default FormNameCreator;
