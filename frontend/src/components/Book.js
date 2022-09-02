import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import Rating from "./Rating";

function Book({ book }) {
	return (
		<Card variant="flush" style={{ fontSize: "0.8rem" }} className="rounded">
			<Link className="link" to={`/book/${book.id}`}>
				<Card.Img
					src={book.image}
					alt={book.title}
					className="px-3 py-1 book-img borderless"
				/>
			</Link>
			<Card.Body className="p-0">
				<Link className="link-title" to={`/book/${book.id}`}>
					<Card.Title
						as="div"
						style={{
							fontSize: "0.9rem",
							lineHeight: "1.3rem",
							fontWeight: "600",
							textAlign: "center",
						}}
						className="center px-1 mb-1"
					>
						{book.title.slice(0, 40)}
					</Card.Title>
				</Link>
				<Card.Text className="center my-0" as="div">
					<Row>
						<Col xs="auto" className="px-1">
							<Rating
								value={book.rating}
								text={`${book.num_reviews} reviews`}
								color={"#f8e825"}
								fontSize="0.9rem"
							/>
						</Col>
						<Col xs="auto" className="px-1">
							({book.num_reviews})
						</Col>
					</Row>
				</Card.Text>
				<Row className="mt-0 mx-0 center">
					<Col xs="auto" className="px-1 center">
						<Card.Text className="red" style={{ fontSize: "1rem" }}>
							<strong>₹{Math.round(book.sellerbook.price)}</strong>
						</Card.Text>
					</Col>
					<Col xs="auto" className="px-1 mx-1 center">
						<Card.Text className="grey" style={{ fontSize: "0.9rem" }}>
							<strike>₹{Math.round(book.orignal_price)}</strike>
						</Card.Text>
					</Col>
					<Col xs="auto" className="px-1 center">
						<Card.Text className="green" style={{ fontSize: "0.9rem" }}>
							<strong>₹{Math.round(book.sellerbook.discount)}% off</strong>
						</Card.Text>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
}

export default Book;
