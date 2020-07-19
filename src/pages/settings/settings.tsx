import "./settings.css";
import React, { useContext, useState } from "react";
import { AppContext } from "context";
import { Types } from "reducers";
import { Row, Col, Button } from "react-bootstrap";
import { DropEvent, FileRejection } from "react-dropzone";
import Uploader from "components/Uploader/uploader";
import StandardModal from "components/Modals/standardModal";

const Settings = () => {
	const { state, dispatch } = useContext(AppContext);
	const [clearDataWarningVisible, setClearDataWarningVisible] = useState(false);

	const exportState = () => {
		var dataStr =
			"data:text/json;charset=utf-8," +
			encodeURIComponent(JSON.stringify(state));
		var downloadAnchorNode = document.createElement("a");
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute(
			"download",
			`backup_${new Date().getTime()}.json`
		);
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

	const clearAllData = () => {
		dispatch({ type: Types.DeleteAllForms, payload: null });
		setClearDataWarningVisible(false);
		localStorage.clear();
	};

	return (
		<Row>
			<Col xs={12}>
				<div className="header">
					<h3>Settings</h3>
				</div>
			</Col>
			<Col xs={12}>
				<Row>
					<Col xs={4}>
						<h4 className="header">Download a Backup</h4>
						<Button onClick={() => exportState()}>Download</Button>
					</Col>
					<Col xs={4}>
						<h4 className="header">Upload From Backup</h4>
						<Uploader onDrop={onDrop} />
					</Col>
					<Col xs={4}>
						<h4 className="header">Danger Zone</h4>
						<Button
							variant="danger"
							onClick={() => setClearDataWarningVisible(true)}>
							Clear All Data
						</Button>
					</Col>
				</Row>
			</Col>
			<StandardModal
				visible={clearDataWarningVisible}
				handleClose={() => setClearDataWarningVisible(false)}
				handleContinue={clearAllData}
				title="WARNING"
				message="This will erase ALL cached data. You should probably only be doing this if something broke due to a bug. Consider exporting your existing data first."
				closeBtnText="Cancel"
				continueBtnText="Erase ALL Data"
			/>
		</Row>
	);
};

export default Settings;
