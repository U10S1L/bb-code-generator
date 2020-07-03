import "./settings.css";
import React, { useContext } from "react";
import { AppContext } from "../../context";
import { Types } from "../../reducers";
import { Row, Col, Button } from "react-bootstrap";
import { DropEvent, FileRejection } from "react-dropzone";
import Uploader from "../../components/Uploader/uploader";

const Settings = () => {
	const { state, dispatch } = useContext(AppContext);

	const exportState = () => {
		var dataStr =
			"data:text/json;charset=utf-8," +
			encodeURIComponent(JSON.stringify(state));
		var downloadAnchorNode = document.createElement("a");
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", "bbCodeGeneratorExport.json");
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	};

	const onDrop = <T extends File>(
		acceptedFiles: T[],
		fileRejections: FileRejection[],
		event: DropEvent
	): void => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onload = () => {
				const binaryStr = reader.result;
				if (binaryStr != null) {
					const stateJson = JSON.parse(binaryStr.toString());
					dispatch({
						type: Types.UpdateForms,
						payload: stateJson.forms
					});
				}
			};
			reader.readAsText(file);
		});
	};

	return (
		<div className="component-wrapper flex-grow-1">
			<Row>
				<Col xs={12}>
					<h3 className="header">Settings</h3>
				</Col>
			</Row>
			<Row className="flex-grow-1">
				<Col xs={12}>
					<h4>Forms</h4>
					<Row>
						<Col xs={4}>
							<Button onClick={() => exportState()}>Download</Button>
						</Col>
						<Col xs={4}>
							<Uploader onDrop={onDrop} />
						</Col>
						<Col xs={4}>
							<Button variant="danger">Clear All Data</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</div>
	);
};

export default Settings;
