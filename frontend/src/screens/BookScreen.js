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
	Modal,
	Form,
	Tooltip,
	OverlayTrigger,
} from "react-bootstrap";

import {
	getBookDetails,
	getSimilarBooks,
	createBookReview,
} from "../actions/bookActions";
import { getUserDetail, favouriteBook } from "../actions/userDetailActions";
import BooksRow from "../components/BooksRow";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";

function BookScreen({ match, history }) {
	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [bookDesc, setBookDesc] = useState("");
	const [authorDesc, setAuthorDesc] = useState("");
	const [pincode, setPincode] = useState(0);
	const [pincodeSubmitted, setPincodeSubmitted] = useState(false);
	const [pincodeLoading, setPincodeLoading] = useState(false);
	const [favourited, setFavourited] = useState(false);
	const [sellerModal, setSellerModal] = useState(false);
	const [selectedSeller, setSelectedSeller] = useState(0);

	const bookId = Number(match.params.id);

	const dispatch = useDispatch();

	const bookDetails = useSelector((state) => state.bookDetails);
	const { book, loading, error } = bookDetails;

	const similarBookList = useSelector((state) => state.similarBookList);
	const { similarBooks, booksLoading, booksError } = similarBookList;

	const userDetail = useSelector((state) => state.userDetail);
	const { user, success: userDetailSuccess } = userDetail;

	const userFavouriteBook = useSelector((state) => state.userFavouriteBook);
	const { userBooks, success: userBooksSuccess } = userFavouriteBook;

	const bookCreateReview = useSelector((state) => state.bookCreateReview);
	const {
		loading: loadingReview,
		success: successReview,
		error: errorReview,
	} = bookCreateReview;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const login = userInfo ? true : false;

	useEffect(() => {
		if (book.id !== bookId) {
			dispatch(getBookDetails(bookId));
			dispatch(getSimilarBooks(bookId));
			// setPincodeSubmitted(false);
		} else {
			setSelectedSeller(book.sellerbook?.seller.id);
		}
		if (successReview) {
			setRating(0);
			setComment("");
			dispatch({ type: "BOOK_CREATE_REVIEW_RESET" });
		}
	}, [book, bookId, successReview, dispatch]);

	useEffect(() => {
		if (userBooks?.length !== user?.books?.length && userBooksSuccess) {
			dispatch(getUserDetail("profile"));
			dispatch(getBookDetails(bookId));
		} else if (userDetailSuccess) {
			const bookIds = user?.books?.map((book) => book.id);
			setFavourited(bookIds?.includes(bookId));
		}
	}, [user, userBooks, userDetailSuccess, userBooksSuccess, dispatch]);

	const favouriteBookHandler = () => {
		dispatch(favouriteBook(book.id));
	};

	const addToCartHandler = () => {
		history.push(`/cart/${bookId}?qty=${qty}&seller=${selectedSeller}`);
	};

	const addToWishListHandler = () => {
		history.push(`/wishlist/${bookId}`);
	};

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(createBookReview(bookId, { rating, comment }));
	};

	const getGenreBooks = (genre) => {
		history.push(`/books/genre/${genre}`);
	};

	const pincodeHandler = (e) => {
		e.preventDefault();
		setPincodeLoading(true);
		setPincodeSubmitted(false);
		setTimeout(() => {
			setPincodeLoading(false);
			setPincodeSubmitted(true);
		}, 300);
	};

	const openInNewTab = (url) => {
		const newWindow = window.open(url, "_blank", "noopener", "noreferrer");
		if (newWindow) newWindow.opener = null;
	};

	const date = new Date(new Date().setDate(new Date().getDate() + 7));

	const renderTooltip = (props) => {
		return (
			<Tooltip id="button-tooltip" {...props}>
				{login
					? !favourited
						? "Add to favourite"
						: "Remove from favourite"
					: "Please Login to continue"}
			</Tooltip>
		);
	};
	// style={{ borderRadius: "50%" }}

	return (
		<Container fluid className="pt-4 mt-3">
			{loading || booksLoading || !book?.id ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : booksError ? (
				<Message variant="danger">{booksError}</Message>
			) : (
				<Container fluid>
					<Row>
						<Col
							fluid
							xs={6}
							md={3}
							className="p-0 m-0"
							style={{ marginLeft: "auto" }}
						>
							<Col xs={10}>
								<Link to="/home" className="link">
									<Button className="btn btn-light p-1 mt-2">Go Back</Button>
								</Link>
							</Col>
							<Row className="mb-1">
								<Col xs={{ offset: 10 }}>
									{favourited ? (
										<OverlayTrigger placement="top" overlay={renderTooltip}>
											<Button
												onClick={() => favouriteBookHandler(book.id)}
												className="px-2 py-1 m-0 btn-success"
											>
												<i className="fas fa-heart" />
											</Button>
										</OverlayTrigger>
									) : (
										<OverlayTrigger placement="top" overlay={renderTooltip}>
											<Button
												disabled={login === false}
												onClick={() => favouriteBookHandler(book.id)}
												className="p-0 m-0 btn-light"
											>
												<Image src="static/icons/Fav-Book.png" fluid rounded />
											</Button>
										</OverlayTrigger>
									)}
								</Col>
							</Row>
							<Image
								className="p-0 m-0"
								src={book.image}
								alt={book.title}
								style={{ width: "100%" }}
								fluid
							/>
							<ListGroup horizontal className="mx-0">
								<Row>
									<Col xs={6} className="py-2 px-1">
										<Button
											disabled={book.sellerbook.count_in_stock <= 0}
											onClick={addToCartHandler}
											className="p-1"
											style={{ height: "100%", width: "100%" }}
										>
											<Row>
												<Col xs={8} className="center">
													<strong className="bold center">Add to cart</strong>
												</Col>
												<Col xs={4} variant="dark">
													<i className="fas fa-cart-plus fa-2x float-right" />
												</Col>
											</Row>
										</Button>
									</Col>
									<Col xs={6} className="py-2 px-1">
										<Button
											variant="warning"
											disabled={login === false}
											className="py-0"
											onClick={addToWishListHandler}
										>
											<Row>
												<Col xs={7} md={8} className="p-1 pr-0">
													<strong className="bold">Add to Wishlist</strong>
												</Col>
												<Col xs={5} md={4} className="p-1 my-0 mr-1">
													<Image
														src="static/icons/wishlist.png"
														fluid
														rounded
													/>
												</Col>
											</Row>
										</Button>
									</Col>
								</Row>
							</ListGroup>
						</Col>

						<Col xs={6} lg={4} className="mt-5">
							<ListGroup variant="flush">
								<h3 className="mx-2 pb-0">{book.title}</h3>

								<Row className="m-1">
									<Col xs={8} md="auto">
										<Rating
											value={book.rating}
											text={`${book.num_reviews} reviews`}
											color={"#f8e825"}
										/>
									</Col>
									<Col>({book.num_reviews} reviews)</Col>
								</Row>
								<Row className="m-1">
									<Col className="red" xs="auto">
										<strong style={{ fontSize: "1.2rem" }}>
											₹{Math.round(book.sellerbook.price)}
										</strong>
									</Col>
									<Col
										className="grey"
										style={{ fontSize: "1.1rem" }}
										xs="auto"
									>
										<strike>₹{book.orignal_price}</strike>
									</Col>
									<Col
										className="green"
										style={{ fontSize: "1.1rem" }}
										xs="auto"
									>
										<strong>{book.sellerbook.discount}% off</strong>
									</Col>
								</Row>
								<Row className="m-1" style={{ fontSize: "1.1rem" }}>
									{book.sellerbook.count_in_stock > 30 ? (
										<h6 className="green">
											<strong>In Stock</strong>
										</h6>
									) : book.sellerbook.count_in_stock > 10 ? (
										<h6 className="yellow">
											<strong style={{ color: "orange" }}>
												Only a few left
											</strong>
										</h6>
									) : book.sellerbook.count_in_stock === 0 ? (
										<Row className="red">
											<strong style={{ fontSize: "1rem" }}>Out of stock</strong>
										</Row>
									) : (
										<h6 className="red">
											<strong>
												Only {book.sellerbook.count_in_stock} left in stock
											</strong>
										</h6>
									)}
								</Row>

								{book.sellerbook.count_in_stock > 0 && (
									<Row className="m-1 mt-2">
										<Col xs={4}>
											<strong>Quantity</strong>
										</Col>
										<Col xs="auto" className="mx-0 px-0">
											<Form.Control
												as="select"
												value={qty}
												className="p-1 select-menu"
												custom
												onChange={(e) => setQty(e.target.value)}
											>
												{[
													...Array(
														book.sellerbook.count_in_stock > 5
															? 5
															: book.sellerbook.count_in_stock
													).keys(),
												].map((x) => (
													<option key={x + 1} value={x + 1}>
														{x + 1}
													</option>
												))}
											</Form.Control>
										</Col>
									</Row>
								)}
								{book.formats && (
									<Row className="m-1">
										<Col>
											{book.formats?.map((ele, i) => (
												<Button
													key={i}
													onClick={() => openInNewTab(ele.link)}
													className="mx-2 p-2 my-1"
													variant="btn btn-warning"
												>
													<strong>{ele.format}</strong>
												</Button>
											))}
										</Col>
									</Row>
								)}
								<Row className="m-1">
									<strong> Language: {book.language}</strong>
								</Row>

								<ListGroup.Item className="mx-0 mt-4">
									<Row>
										<Col xs={4} className="ml-2 px-0">
											Delievery to
										</Col>
										<Col xs={8}>
											<Form onSubmit={pincodeHandler}>
												<Row>
													<Col xs={12} md={8} className="px-0 mx-0">
														<Form.Group className="px-1 mx-0">
															<Form.Control
																required
																placeholder="6 digits PIN code"
																value={pincode}
																onChange={(e) => {
																	setPincodeSubmitted(false);
																	setPincode(e.target.value);
																}}
															/>
														</Form.Group>
													</Col>
													<Col xs={5} md={4} className="px-0 mx-0">
														<Form.Group className="px-1 mx-0">
															<Button
																type="submit"
																variant="primary"
																className="mx-0 p-1"
																disabled={
																	pincode < 100000 || pincode >= 1000000
																}
															>
																Check
															</Button>
														</Form.Group>
													</Col>
												</Row>
											</Form>
										</Col>
									</Row>
								</ListGroup.Item>

								<ListGroup.Item>
									{pincodeLoading && <Loader />}
									{pincodeSubmitted && (
										<Row className="mb-2">
											<Col xs={4}>
												<i className="fas fa-truck fa-2x" />
											</Col>
											<Col className="pt-0 px-0">
												Expected delievery by{" "}
												<strong style={{ display: "block" }}>
													{date.getDate()}-{date.getMonth() + 1}-
													{date.getFullYear()}
												</strong>
											</Col>
										</Row>
									)}
									<Row className="mb-2">
										<Col xs={4} className="pl-1">
											<strong>Sold by</strong>
										</Col>
										<Col xs={6} className="px-0">
											<Link to="" className="link">
												{book.sellerbook.seller.name}{" "}
											</Link>
											({book.sellerbook.seller.rating})
										</Col>
										<Col
											xs={2}
											onClick={() => setSellerModal(true)}
											className="px-0"
										>
											<Link className="link">Change</Link>
										</Col>
									</Row>
									<Row className="m-1">
										<Col xs={4} className="pl-1">
											<i className="fas fa-exchange-alt fa-2x" />
										</Col>
										<Col className="px-0">
											{book.sellerbook.replacement} days exchange
										</Col>
									</Row>
								</ListGroup.Item>
							</ListGroup>
						</Col>
						<Modal show={sellerModal} onHide={() => setSellerModal(false)}>
							<Modal.Header closeButton>
								<Modal.Title>Seller Details</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Row>
									<h5>{book.sellerbook.seller.name}</h5>
								</Row>
								<Row>Rating: {book.sellerbook.seller.rating})</Row>
								<Row>{book.sellerbook.seller.replacement} days exchange</Row>
								<Row>Seller since: {book.sellerbook.seller.joined}</Row>
								<Row>Address: {book.sellerbook.seller.address}</Row>
							</Modal.Body>
							<Modal.Footer>
								<Button
									variant="secondary"
									onClick={() => setSellerModal(false)}
								>
									Close
								</Button>
							</Modal.Footer>
						</Modal>

						<Col xs={12} lg={5} className="mt-5">
							<ListGroup>
								<ListGroup.Item>
									<h4>Book Details</h4>
								</ListGroup.Item>
								<ListGroup horizontal>
									<ListGroup.Item
										as={Col}
										style={{ height: "2.4rem" }}
										xs={5}
										className="py-1"
										variant="dark"
									>
										Author
									</ListGroup.Item>
									<ListGroup.Item
										as={Col}
										className="py-1"
										style={{ height: "2.4rem" }}
									>
										<Link to={`/author/${book.author.id}`} className="link">
											<strong>{book.author.name}</strong>
										</Link>
									</ListGroup.Item>
								</ListGroup>
								<ListGroup horizontal>
									<ListGroup.Item
										as={Col}
										style={{ height: "2.4rem" }}
										xs={5}
										className="py-1"
										variant="dark"
									>
										ISBN-10
									</ListGroup.Item>
									<ListGroup.Item
										as={Col}
										className="py-1"
										style={{ height: "2.4rem" }}
									>
										{book.ISBN_10}
									</ListGroup.Item>
								</ListGroup>
								<ListGroup horizontal>
									<ListGroup.Item
										as={Col}
										style={{ height: "2.4rem" }}
										xs={5}
										className="py-1"
										variant="dark"
									>
										ISBN-13
									</ListGroup.Item>
									<ListGroup.Item
										as={Col}
										className="py-1"
										style={{ height: "2.4rem" }}
									>
										{book.ISBN_13}
									</ListGroup.Item>
								</ListGroup>

								<ListGroup horizontal>
									<ListGroup.Item
										as={Col}
										xs={5}
										className="py-1"
										variant="dark"
									>
										Publisher
									</ListGroup.Item>
									<ListGroup.Item as={Col} className="py-1">
										{book.publisher}
									</ListGroup.Item>
								</ListGroup>

								<ListGroup horizontal>
									<ListGroup.Item
										as={Col}
										xs={5}
										className="py-1"
										variant="dark"
									>
										Publication date
									</ListGroup.Item>
									<ListGroup.Item
										as={Col}
										className="py-1"
										style={{ height: "2.4rem" }}
									>
										{book.publication_date}
									</ListGroup.Item>
								</ListGroup>

								<ListGroup horizontal>
									<ListGroup.Item
										as={Col}
										style={{ height: "2.4rem" }}
										xs={5}
										className="py-1"
										variant="dark"
									>
										Pages
									</ListGroup.Item>
									<ListGroup.Item
										as={Col}
										className="py-1"
										style={{ height: "2.4rem" }}
									>
										{book.pages}
									</ListGroup.Item>
								</ListGroup>

								<ListGroup horizontal>
									<ListGroup.Item
										as={Col}
										xs={5}
										style={{ height: "2.4rem" }}
										className="py-1"
										variant="dark"
									>
										Genres
									</ListGroup.Item>
									<ListGroup.Item
										as={Col}
										className="py-1"
										style={{ height: "2.4rem" }}
									>
										{book.genres?.map((ele, i) => (
											<Button
												key={i}
												onClick={() => getGenreBooks(ele.genre)}
												variant="dark"
												className="mx-1 p-1"
											>
												{ele.genre}
											</Button>
										))}
									</ListGroup.Item>
								</ListGroup>
								{book.weight > 0 && (
									<ListGroup horizontal>
										<ListGroup.Item
											as={Col}
											xs={5}
											style={{ height: "2.4rem" }}
											className="py-1"
											variant="dark"
										>
											Weight
										</ListGroup.Item>
										<ListGroup.Item
											as={Col}
											className="py-1"
											style={{ height: "2.4rem" }}
										>
											{book.weight} g
										</ListGroup.Item>
									</ListGroup>
								)}

								{book.dimensions && (
									<ListGroup horizontal>
										<ListGroup.Item
											as={Col}
											xs={5}
											style={{ height: "2.4rem" }}
											className="py-1"
											variant="dark"
										>
											Dimensions
										</ListGroup.Item>
										<ListGroup.Item
											as={Col}
											className="py-1"
											style={{ height: "2.4rem" }}
										>
											{book.dimensions} cms
										</ListGroup.Item>
									</ListGroup>
								)}

								<ListGroup horizontal>
									<ListGroup.Item
										as={Col}
										style={{ height: "2.4rem" }}
										xs={5}
										className="py-1"
										variant="dark"
									>
										Reading age
									</ListGroup.Item>
									<ListGroup.Item
										as={Col}
										className="py-1"
										style={{ height: "2.4rem" }}
									>
										{book.age_group}
									</ListGroup.Item>
								</ListGroup>

								<ListGroup horizontal>
									<ListGroup.Item
										as={Col}
										xs={5}
										className="py-1"
										variant="dark"
									>
										Country Code
									</ListGroup.Item>
									<ListGroup.Item as={Col}>{book.origin}</ListGroup.Item>
								</ListGroup>

								{book.bestseller_rank && (
									<ListGroup horizontal>
										<ListGroup.Item
											as={Col}
											xs={5}
											className="py-1"
											variant="dark"
										>
											Bestseller rank
										</ListGroup.Item>
										<ListGroup.Item
											as={Col}
											className="py-1"
											style={{ height: "2.4rem" }}
										>
											{book.bestseller_rank}
										</ListGroup.Item>
									</ListGroup>
								)}
							</ListGroup>
						</Col>
					</Row>
					<Row className="mt-5">
						<Col xs={8} md={6}>
							<h4>Reviews</h4>
							<ListGroup variant="flush">
								{book.reviews.length === 0 && (
									<ListGroup.Item className="mx-0">
										<Message variant="info">No Reviews</Message>
									</ListGroup.Item>
								)}

								{book.reviews.map((review) => (
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

									{login ? (
										<Form onSubmit={submitHandler}>
											<Form.Group className="m-1" controlId="rating">
												<Form.Label>Rating </Form.Label>
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
						<Col md={6} className="p-3">
							{book.description && (
								<ListGroup as={Row} variant="flush">
									<ListGroup.Item>
										<h4>Book Overview</h4>
										<p className="description">
											{!bookDesc
												? book.description?.substring(0, 360) + "..."
												: book.description}
										</p>
										<Row>
											<Link
												onClick={(e) => {
													setBookDesc(!bookDesc);
													e.preventDefault();
												}}
												hidden={bookDesc}
												className="link"
											>
												Read More
											</Link>
											<Link
												onClick={(e) => {
													setBookDesc(!bookDesc);
													e.preventDefault();
												}}
												hidden={!bookDesc}
												className="link"
											>
												Read Less
											</Link>
										</Row>
									</ListGroup.Item>
								</ListGroup>
							)}

							<ListGroup as={Row} className="py-3">
								<ListGroup.Item className="py-0">
									<Row style={{ paddingBottom: "1rem" }}>
										<Col xs={4}>
											<Link to={`/author/${book.author?.id}`}>
												<Image
													src={book.author?.image_sm}
													alt={book.author?.name}
													className="author-img"
													fluid
													roundedCircle
												/>
											</Link>
										</Col>
										<Col>
											<Row style={{ padding: "0.5em 0rem" }}>
												<h4>
													<Link
														to={`/author/${book.author?.id}`}
														className="link"
													>
														{book.author?.name}
													</Link>
												</h4>
											</Row>
											<Row>
												<h6>{book.author?.total_followers} followers</h6>
											</Row>
										</Col>
									</Row>
									<p className="description">
										{!authorDesc
											? book.author?.biography?.substring(0, 320) + "..."
											: book.author?.biography}
									</p>
									<Row>
										<Link
											onClick={(e) => {
												setAuthorDesc(!authorDesc);
												e.preventDefault();
											}}
											hidden={authorDesc}
											className="link"
										>
											Read More
										</Link>
										<Link
											onClick={(e) => {
												setAuthorDesc(!authorDesc);
												e.preventDefault();
											}}
											hidden={!authorDesc}
											className="link"
										>
											Read Less
										</Link>
									</Row>
								</ListGroup.Item>
							</ListGroup>
						</Col>
					</Row>
					<h3>Readers Also Bought</h3>
					<BooksRow books={[...new Set(similarBooks)]} />
				</Container>
			)}
		</Container>
	);
}
export default BookScreen;
