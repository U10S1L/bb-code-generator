import "./settings.css";

import { Button, Col, Row } from "react-bootstrap";
import React, { useState } from "react";

import StandardModal from "components/modals/standardModal";
import UpdatePasswordForm from "components/auth/updatePasswordForm";

const Settings = () => {
	const [clearDataWarningVisible, setClearDataWarningVisible] = useState(false);

	const clearAllData = () => {
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
					<Col xs={6}>
						<h4 className="header">Manage Account</h4>
						<UpdatePasswordForm />
					</Col>
					<Col xs={6}>
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
				message="This will erase all cached data. You should probably only be doing this if something broke due to a bug."
				closeBtnText="Cancel"
				continueBtnText="Continue"
			/>
		</Row>
	);
};

export default Settings;
