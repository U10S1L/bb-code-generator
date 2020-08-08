import "./home.css";

import { Button, Col, Jumbotron, Row } from "react-bootstrap";
import React, { useState } from "react";

import AuthModal from "components/auth/authModal";
import Firebase from "components/firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthState } from "react-firebase-hooks/auth";

type FeatureTextProps = {
	text: string;
	type: "good" | "bad";
};
const FeatureText = ({ text, type }: FeatureTextProps) => {
	function textHtml(text: string) {
		return { __html: text };
	}
	return (
		<h5 style={{ padding: ".5rem 0" }}>
			<FontAwesomeIcon
				icon={type === "good" ? "check" : "times"}
				color={type === "good" ? "#46a989" : "#bd3f5d"}
				style={{ marginRight: ".75rem" }}
			/>
			<span dangerouslySetInnerHTML={textHtml(text)} />
		</h5>
	);
};

const Home = () => {
	const [modal, setModal] = useState<{ visible: boolean }>({
		visible: false
	});
	const [user] = useAuthState(Firebase().auth);
	return (
		<>
			<AuthModal
				user={user}
				visible={modal.visible}
				onClose={() => setModal({ ...modal, visible: false })}
			/>
			<Row
				className="d-none d-lg-flex comparison-image-text-wrapper"
				style={{ marginTop: "1rem" }}>
				<Col xs={1}>
					<div
						style={{
							writingMode: "vertical-lr",
							transform: "rotate(180deg)",
							marginLeft: "auto",
							fontWeight: "bold",
							fontSize: "3rem"
						}}>
						BEFORE
					</div>
				</Col>
				<Col xs={6} className="comparison-image-wrapper">
					<img
						src="https://i.imgur.com/TnWUslD.png"
						alt="before-shitty-bbcode"
						className="img-fluid "
					/>
				</Col>
				<Col>
					<FeatureText type="bad" text="Outdated and clunky text editor" />
					<FeatureText type="bad" text="Accidentally lose your work" />
					<FeatureText
						type="bad"
						text="A BBCode Generator tool <i>may</i> exist"
					/>
				</Col>
			</Row>
			<Row>
				<Jumbotron
					fluid
					style={{
						backgroundColor: "lightgrey",
						flex: "1",
						margin: "1rem 0",
						padding: "2.5rem",
						display: "flex",
						flexDirection: "column",
						alignItems: "center"
					}}>
					<h2 style={{ textAlign: "center" }}>
						Create forms that generate BBCode.
						<br />
						For <b>all</b> your paperwork.
					</h2>
					{!user && (
						<Button
							size="lg"
							variant="success"
							style={{ marginTop: "2rem" }}
							onClick={() => setModal({ ...modal, visible: true })}>
							Get Started
						</Button>
					)}
				</Jumbotron>
			</Row>
			<Row className="d-none d-lg-flex comparison-image-text-wrapper">
				<Col xs={1}>
					<div
						style={{
							writingMode: "vertical-lr",
							transform: "rotate(180deg)",
							marginLeft: "auto",
							fontWeight: "bold",
							fontSize: "3rem"
						}}>
						AFTER
					</div>
				</Col>
				<Col xs={6} className="comparison-image-wrapper">
					<img
						src="https://i.imgur.com/uhmh7r0.png"
						alt="after-nice-bbcodeform"
						className="img-fluid"
					/>
				</Col>
				<Col>
					<FeatureText type="good" text="Modern and sleek form interface" />
					<FeatureText type="good" text="Never lose your work again" />
					<FeatureText
						type="good"
						text="A BBCode Generator tool <i>does</i> exist"
					/>
				</Col>
				{/* <Col xs={1}>
					<div
						style={{
							writingMode: "vertical-lr",
							marginRight: "auto",
							fontWeight: "bold",
							fontSize: "3rem"
						}}>
						AFTER
					</div>
				</Col> */}
			</Row>
		</>
	);
};

export default Home;
