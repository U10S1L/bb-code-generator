import React, { useMemo } from "react";
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
	styles?: React.CSSProperties;
};
const Uploader = ({ onDrop, styles }: UploaderProps) => {
	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject
	} = useDropzone({
		onDrop,
		multiple: false,
		accept: "application/json"
	});

	const dropzoneStyle = useMemo(
		() => ({
			...baseStyle,
			...styles,
			...(isDragActive ? activeStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {})
		}),
		[isDragActive, isDragReject, isDragAccept, styles]
	);

	return (
		<div {...getRootProps({ style: dropzoneStyle })} className="form-control">
			<input {...getInputProps()} />
			{!isDragActive && !isDragAccept && !isDragReject && (
				<span>Drop .json file here</span>
			)}
			{isDragAccept && <span>Drop .json file here</span>}
			{isDragReject && <span>Invalid File Type</span>}
		</div>
	);
};

export default Uploader;
