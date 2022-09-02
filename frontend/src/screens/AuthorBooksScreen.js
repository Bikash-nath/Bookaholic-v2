import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getAuthorDetails, getAuthorList } from "../actions/authorActions";
import BooksRow from "../components/BooksRow";
import Loader from "../components/Loader";
import Message from "../components/Message";

function AuthorBooksScreen({ match, history, keyword }) {
	const [selectedAuthor, setSelectedAuthor] = useState(match.params.id); //selectedAuthor=author.id

	const authorDetails = useSelector((state) => state.authorDetails);
	const { author, loading, error } = authorDetails;

	const authorList = useSelector((state) => state.authorList);
	const { authors, loading: loadingAuthors } = authorList;

	const dispatch = useDispatch();

	useEffect(() => {
		// if(selectedAuthor)
		dispatch(getAuthorDetails(selectedAuthor));
		// else dispatch(getAuthorDetails(selectedAuthor))
		dispatch(getAuthorList());
	}, [selectedAuthor, dispatch]);

	const filterAuthors = () => {
		return authors.filter((author) => author.id !== selectedAuthor);
	};

	return (
		<Container fluid className="mt-5">
			{loading || loadingAuthors || !author?.books?.length ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<Container fluid>
					<Link to="/" className="link">
						<Button className="btn btn-light my-2">Go Back</Button>
					</Link>
					<Row className="mb-0">
						<Col xs={4} className="pr-0">
							<h3 style={{ display: "inline" }}>
								Books from{" "}
								<Link to={`/author/${author.id}`} className="link">
									{author.name}
								</Link>
							</h3>
						</Col>
						<Col className="right">
							<Form.Group className="p-3">
								<Form.Label className="mx-2">
									<h6>Other authors </h6>
								</Form.Label>
								<Form.Control
									as="select"
									id="categorySelect"
									value={selectedAuthor}
									onChange={(e) => {
										setSelectedAuthor(e.target.value);
									}}
									custom
									className="mx-2 py-1"
								>
									{filterAuthors().map((author) => (
										<option value={author.id}>{author.name}</option>
									))}
								</Form.Control>
							</Form.Group>
						</Col>
					</Row>

					{[...Array(4).keys()].map((i) => (
						<BooksRow books={author.books.slice(6 * i, 6 * (i + 1))} />
					))}
				</Container>
			)}
		</Container>
	);
}

export default AuthorBooksScreen;
