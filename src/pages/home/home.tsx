import "./home.css";
import React from "react";
import { Row, Col, Card, CardDeck, Jumbotron } from "react-bootstrap";

const Home = () => {
	return (
		<Row>
			<Col xs={12} className="mt-4 mb-4">
				<h2 className="home-header">How You Write BBCode</h2>
				<div>
					<img
						src="https://i.imgur.com/CqrxUdP.png"
						alt="comparitive logo"
						className="img-fluid"
						style={{ margin: "auto", flex: "1" }}></img>
				</div>
			</Col>
			<Jumbotron
				style={{
					backgroundColor: "#20354c",
					color: "white",
					width: "100%",
					borderRadius: 0,
					margin: "3rem auto",
					textAlign: "center"
				}}>
				<h2>
					Now supporting <b>every</b> BBCode Form.
				</h2>
				<p className="small">Yes, even the ones that don't exist yet.</p>
			</Jumbotron>
			<Col xs={12} className="mb-3">
				<h2 className="home-header">4 Easy Steps</h2>
				<CardDeck>
					<Card bg="primary" text="white" className="steps-card">
						<Card.Img variant="top" src="https://i.imgur.com/zZYrUkw.png" />
						<Card.Body>
							<Card.Title>
								<h6 style={{ fontWeight: "bold" }}>1: Name the form.</h6>
							</Card.Title>
						</Card.Body>
					</Card>
					<Card bg="primary" text="white" className="steps-card">
						<Card.Img variant="top" src="https://i.imgur.com/KfVk3IH.png" />
						<Card.Body>
							<Card.Title>
								<h6 style={{ fontWeight: "bold" }}>2: Add the inputs.</h6>
							</Card.Title>
						</Card.Body>
					</Card>
					<Card bg="primary" text="white" className="steps-card">
						<Card.Img variant="top" src="https://i.imgur.com/X6iOVlj.png" />
						<Card.Body>
							<Card.Title>
								<h6 style={{ fontWeight: "bold" }}>3: Paste the BBCode.</h6>
							</Card.Title>
						</Card.Body>
					</Card>
					<Card bg="primary" text="white" className="steps-card">
						<Card.Img variant="top" src="https://i.imgur.com/FCaveZl.png" />
						<Card.Body>
							<Card.Title>
								<h6 style={{ fontWeight: "bold" }}>
									4: Match the{" "}
									<span role="img" aria-label="id">
										🆔s
									</span>
								</h6>
							</Card.Title>
						</Card.Body>
					</Card>
				</CardDeck>
			</Col>
		</Row>
	);
};

export default Home;
