import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	Row,
	Col,
	Image,
	Container,
	ListGroup,
	Button,
	Card,
	Form,
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";

import {
	getAuthorDetails,
	getSimilarAuthors,
	createAuthorReview,
} from "../actions/authorActions";
import { getUserDetail, followAuthor } from "../actions/userDetailActions";
import BooksRow from "../components/BooksRow";
import AuthorsRow from "../components/AuthorsRow";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";

function AuthorScreen({ match, history }) {
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [readMore, setReadMore] = useState(false);
	const [following, setFollowing] = useState(false);

	const authorDetails = useSelector((state) => state.authorDetails);
	const { author, loading, error } = authorDetails;

	const authorCreateReview = useSelector((state) => state.authorCreateReview);
	const {
		loading: loadingReview,
		success: successReview,
		error: errorReview,
	} = authorCreateReview;

	const authorSimilarList = useSelector((state) => state.authorSimilarList);
	const { authors, authorsLoading, authorsError } = authorSimilarList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDetail = useSelector((state) => state.userDetail);
	const { user, success: userDetailSuccess } = userDetail;

	const userFollowAuthor = useSelector((state) => state.userFollowAuthor);
	const { userAuthors, success: userAuthorsSuccess } = userFollowAuthor;

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAuthorDetails(match.params.id));
		dispatch(getUserDetail("profile"));
		dispatch(getSimilarAuthors(match.params.id));

		if (successReview) {
			setRating(0);
			setComment("");
			dispatch({ type: "AUTHOR_CREATE_REVIEW_RESET" });
		}
	}, [match, successReview, dispatch]);

	useEffect(() => {
		if (userAuthors?.length !== user?.authors?.length && userAuthorsSuccess) {
			dispatch(getUserDetail("profile"));
			dispatch(getAuthorDetails(match.params.id));
		} else if (userDetailSuccess) {
			const authorIds = user.authors?.map((author) => author.id);
			setFollowing(authorIds?.includes(Number(match.params.id)));
		}
	}, [
		user,
		userAuthors,
		userDetailSuccess,
		userAuthorsSuccess,
		dispatch,
		match,
	]);

	const followAuthorHandler = () => {
		dispatch(followAuthor(author.id));
	};

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(createAuthorReview(match.params.id, { rating, comment }));
	};

	const uniqueAuthors = () => {
		const ids = authors.map((author) => author.id);
		return authors.filter(({ id }, i) => !ids.includes(id, i + 1));
	};

	const getGenreBooks = (genre) => {
		history.push(`/books/genre/${genre}`);
	};

	const openInNewTab = (url) => {
		const newWindow = window.open(url, "_blank", "noopener, noreferrer");
		if (newWindow) newWindow.opener = null;
	};

	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			{!following
				? "Get new release updates and Improved reccomendations"
				: "Stop following this author"}
		</Tooltip>
	);

	return (
		<Container className="pt-4 mt-3" fluid>
			<Link to="/" className="link">
				<Button className="btn btn-light my-3">Go Back</Button>
			</Link>
			{loading || authorsLoading || !author?.id ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : authorsError ? (
				<Message variant="danger">{authorsError}</Message>
			) : (
				<Container xs={12} md={11} fluid>
					<Row className="mx-3">
						<Col xs={4}>
							<Col lg={{ span: 10, offset: 1 }}>
								<Card>
									<Image
										src={author.image_lg}
										alt={author.title}
										rounded
										fluid
										style={{
											width: "auto",
											height: "auto",
										}}
									/>
									<Card.Body>
										<Row>
											<Col xs={12} className="mb-3 center">
												<strong>Followers:</strong> {author.total_followers}
											</Col>
										</Row>
										<Row>
											<Col className="center">
												{following ? (
													<OverlayTrigger
														placement="bottom"
														overlay={renderTooltip}
													>
														<Button
															type="submit"
															className="center btn-success"
															onClick={followAuthorHandler}
															varaint="success"
														>
															<i className="fas fa-check-circle" />
															<strong> Following</strong>
														</Button>
													</OverlayTrigger>
												) : (
													<OverlayTrigger
														placement="bottom"
														overlay={renderTooltip}
													>
														<Button
															type="submit"
															className="center"
															disabled={!userInfo}
															onClick={followAuthorHandler}
															variant="info"
														>
															<i className="fas fa-plus-circle" />
															<strong> Follow</strong>
														</Button>
													</OverlayTrigger>
												)}
											</Col>
										</Row>
									</Card.Body>
								</Card>
							</Col>
						</Col>

						<Col xs={7}>
							<ListGroup as={Row}>
								<ListGroup.Item className="py-0 my-0">
									<h2>{author.name}</h2>
									<Row className="mb-2">
										<Col xs={8} md={5} lg={3}>
											<Rating
												value={author.rating}
												className="center"
												text={`${author.num_reviews} reviews`}
												color={"#f8e825"}
											/>
										</Col>
										<Col className="mx-0 px-0">({author.num_reviews})</Col>
									</Row>
								</ListGroup.Item>

								<ListGroup.Item>
									<Row className="mb-2">
										<Col xs={4} className="mb-0">
											<strong>Born in</strong>{" "}
										</Col>
										<Col xs={6}>{author.origin}</Col>
									</Row>
									<Row className="mb-2">
										<Col xs={4}></Col>
										<Col xs={6}>{author.dob}</Col>
									</Row>
									<Row className="mb-2">
										<Col xs={4}>
											<strong>Total books</strong>
										</Col>
										<Col xs={6}>{author.total_books}</Col>
									</Row>

									<Row className="mb-2">
										<Col xs={4}>
											<strong>Genres</strong>
										</Col>
										<Col xs="auto">
											{author.genres?.map((ele) => (
												<Button
													id={ele.id}
													onClick={() => getGenreBooks(ele.genre)}
													variant="dark"
													className="mx-1 p-1 px-2"
												>
													{ele.genre}
												</Button>
											))}
										</Col>
									</Row>
									{author.website && (
										<Row className="mb-2">
											<Col xs={4}>
												<strong>Website</strong>
											</Col>
											<Col xs={6}>
												<Link
													onClick={() => openInNewTab(author.website)}
													className="link"
												>
													{author.website}
												</Link>
											</Col>
										</Row>
									)}
									{author.twitter && (
										<Row className="mb-2">
											<Col xs={4}>
												<strong>Twitter</strong>
											</Col>
											<Col xs={6}>
												<Link
													onClick={() =>
														openInNewTab(
															`https://www.twitter.com/${author.twitter}`
														)
													}
													className="link"
												>
													{author.twitter}
												</Link>
											</Col>
										</Row>
									)}
								</ListGroup.Item>
							</ListGroup>

							<ListGroup variant="flush" as={Row}>
								<ListGroup.Item>
									<p className="description">
										{!readMore
											? author.biography?.substring(0, 500)
											: author.biography}
									</p>
									<Link
										onClick={(e) => {
											setReadMore(!readMore);
											e.preventDefault();
										}}
										hidden={readMore}
									>
										Read More
									</Link>
									<Link
										onClick={(e) => {
											setReadMore(!readMore);
											e.preventDefault();
										}}
										hidden={!readMore}
									>
										Read Less
									</Link>
								</ListGroup.Item>
							</ListGroup>
						</Col>
					</Row>
					<Row className="mt-4">
						<Col xs={12} lg={8} md={{ offset: 4 }}>
							<h4>Reviews</h4>
							<ListGroup variant="flush">
								{author.reviews.length === 0 && (
									<ListGroup.Item className="mx-0">
										<Message variant="info">No Reviews</Message>
									</ListGroup.Item>
								)}
								{author.reviews.map((review) => (
									<ListGroup.Item key={review.id}>
										<Row style={{ height: "1.5rem" }}>
											<Col>
												<strong>{review.name}</strong>
											</Col>
											<Col className="right">
												<p>{review.created_at?.substring(0, 10)}</p>
											</Col>
										</Row>
										<Row className="mb-2">
											<Rating value={review.rating} color="#f8e825" />
										</Row>
										<p>
											{review.comment.length > 120
												? review.comment.substring(0, 120) + "..."
												: review.comment}
											<Row>
												<Link>Read More</Link>
											</Row>
										</p>
									</ListGroup.Item>
								))}
							</ListGroup>

							<ListGroup variant="flush">
								<ListGroup.Item>
									<h4>Write a review</h4>
									{loadingReview && <Loader />}
									{successReview && (
											<Message variant="success">
												Review submitted successfully.
											</Message>
										) &&
										setTimeout(() => {
											<Message>''</Message>;
										}, 2600)}
									{errorReview && (
										<Message variant="danger">{errorReview}.</Message>
									)}

									{userInfo ? (
										<Form onSubmit={submitHandler}>
											<Form.Group className="m-1" controlId="rating">
												<Form.Label>Rating</Form.Label>
												<Form.Control
													as="select"
													className="mx-2"
													value={rating}
													custom
													onChange={(e) => {
														setRating(e.target.value);
													}}
												>
													<option>Select a rating</option>
													<option value="1">1 - Poor</option>
													<option value="2">2 - Fair</option>
													<option value="3">3 - Good</option>
													<option value="4">4 - Very Good</option>
													<option value="5">5 - Excellent</option>
												</Form.Control>
											</Form.Group>
											<Form.Group className="m-1" controlId="comment">
												<Form.Label>Review</Form.Label>

												<Form.Control
													as="textarea"
													row="5"
													value={comment}
													onChange={(e) => {
														setComment(e.target.value);
													}}
												></Form.Control>
											</Form.Group>
											<Form.Group as={Row} className="my-2">
												<Col>
													<Button
														type="submit"
														disabled={loadingReview}
														variant="primary"
													>
														Submit
													</Button>
												</Col>
											</Form.Group>
										</Form>
									) : (
										<Message variant="info">
											Please{" "}
											<Link to="/login" className="link">
												Login
											</Link>{" "}
											to write a review.
										</Message>
									)}
								</ListGroup.Item>
							</ListGroup>
						</Col>
					</Row>

					<Row className="mt-4 py-2">
						<Col>
							<h4>Books from {author.name}</h4>
						</Col>
						<Col className="right">
							<Link to={`/books/author/${author.id}`} className="link">
								<h6>
									<strong>View all books</strong>
								</h6>
							</Link>
						</Col>
					</Row>
					<BooksRow books={author.books.slice(0, 12)} />

					<Row className="mt-4">
						<h3>Similar Authors</h3>
						<AuthorsRow authors={uniqueAuthors()} slides={6} />
					</Row>
				</Container>
			)}
		</Container>
	);
}
export default AuthorScreen;
