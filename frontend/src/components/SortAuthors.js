import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Row, Col, Form } from "react-bootstrap";

function SortAuthors({ fetchAuthors, keyword }) {
	const [sortType, setSortType] = useState("-rating");

	const dispatch = useDispatch();
	const isMounted = useRef(false);
	const history = useHistory();
	const path = history.location.pathname;

	useEffect(() => {
		if (isMounted.current) {
			if (keyword)
				history.push(path + `?keyword=${keyword}&sortBy=${sortType}&page=1`);
			else history.push(path + `?sortBy=${sortType}&page=1`);
		} else {
			isMounted.current = true;
		}
	}, [sortType, keyword, fetchAuthors, history, dispatch]);

	return (
		<Col className="right" xs="auto">
			<Row>
				<Col>Sort By: </Col>
				<Col xs={3}>
					<Form.Control
						as="select"
						className="mx-2"
						value={sortType}
						placeholder="Select sort type"
						id="sortTypeSelect"
						required
						custom
						onChange={(e) => {
							setSortType(e.target.value);
						}}
					>
						<option value="-rating">Rating</option>
						<option value="-total_followers">BestSellers</option>
						<option value="price">Price</option>
						<option value="name">Name</option>
					</Form.Control>
				</Col>
			</Row>
		</Col>
	);
}

export default SortAuthors;
