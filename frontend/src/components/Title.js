import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image } from "react-bootstrap";

function Title({ xs }) {
	return (
		<Link className="link" to="/home">
			<span className="title p-0 m-0">
				<Row style={{ width: "22rem" }}>
					<Col xs={xs}>
						<Image src="static/icons/bookaholic.png" fluid roundedCircle />
					</Col>
					<Col xs="auto">
						<h1 className="center title">Bookaholic</h1>
					</Col>
				</Row>
			</span>
		</Link>
	);
}
export default Title;
