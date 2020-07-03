import React, { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { DropEvent, FileRejection } from "react-dropzone";

const baseStyle: React.CSSProperties = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	padding: "20px",
	borderWidth: 2,
	borderRadius: 2,
	borderColor: "#aaaaaa",
	borderStyle: "dashed",
	backgroundColor: "#fafafa",
	color: "#bdbdbd",
	outline: "none",
	transition: "border .24s ease-in-out"
};

const activeStyle: React.CSSProperties = {
	borderColor: "#2196f3"
};

const acceptStyle: React.CSSProperties = {
	borderColor: "#00e676"
};

const rejectStyle: React.CSSProperties = {
	borderColor: "#ff1744"
};
type UploaderProps = {
	onDrop: <T extends File>(
		acceptedFiles: T[],
		fileRejections: FileRejection[],
		event: DropEvent
	) => void;
};
const Uploader = ({ onDrop }: UploaderProps) => {
	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject
	} = useDropzone({
		onDrop,
		noClick: true,
		multiple: false,
		accept: "application/json"
	});

	const dropzoneStyle = useMemo(
		() => ({
			...baseStyle,
			...(isDragActive ? activeStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {})
		}),
		[isDragActive, isDragReject, isDragAccept]
	);

	return (
		<div {...getRootProps({ style: dropzoneStyle })} className="form-control">
			<input {...getInputProps()} />
			{!isDragActive && !isDragAccept && !isDragReject && (
				<span>Drop file here</span>
			)}
			{isDragAccept && <span>Drop file here</span>}
			{isDragReject && <span>Invalid File Type</span>}
		</div>
	);
};

type UploaderModalProps = {} & UploaderProps;
export const UploaderModal = ({ onDrop }: UploaderModalProps) => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Modal Title</Modal.Title>
			</Modal.Header>
			<Modal.Body>Modal Body</Modal.Body>
		</Modal>
	);
};

export default Uploader;
