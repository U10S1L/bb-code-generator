import React from "react";
import { Modal, Button } from "react-bootstrap";
type StandardModalProps = {
	visible: boolean;
	handleClose: () => void;
	handleContinue?: () => void;
	title: string;
	message?: string;
	closeBtnText: string;
	continueBtnText: string;
};
const StandardModal = ({
	visible,
	handleClose,
	handleContinue,
	message,
	title,
	closeBtnText,
	continueBtnText
}: StandardModalProps) => {
	return (
		<Modal
			show={visible}
			onHide={handleClose}
			animation={false}
			backdrop="static"
			keyboard={false}
			centered>
			<Modal.Header>
				<h3>{title}</h3>
			</Modal.Header>
			<Modal.Body>{message}</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={handleClose} className="mr-auto">
					{closeBtnText}
				</Button>
				<Button
					variant="success"
					onClick={() => {
						handleContinue && handleContinue();
						handleClose();
					}}>
					{continueBtnText}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default StandardModal;
