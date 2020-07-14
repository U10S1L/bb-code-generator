import "./home.css";
import React from "react";
import { Row, Col } from "react-bootstrap";

const Home = () => {
	return (
		<Row>
			<Col xs={12}>
				<h3 style={{ textAlign: "center" }}>
					Create easy to use forms that generate BBCode. For
					<b> all</b> of your paperwork.
				</h3>

				<div style={{ display: "flex" }}>
					<img
						src="https://i.imgur.com/CqrxUdP.png"
						alt="comparitive logo"
						className="img-fluid"
						style={{ margin: "auto", flex: "1" }}></img>
				</div>
			</Col>
		</Row>
	);
};

export default Home;
