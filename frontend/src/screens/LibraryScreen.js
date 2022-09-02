import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Row,
	Col,
	Button,
	Image,
	Card,
	Form,
	ListGroup,
	Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import {
	getUserDetail,
	followAuthor,
	favouriteBook,
	favouriteGenreList,
} from "../actions/userDetailActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

function LibraryScreen({ history }) {
	const dispatch = useDispatch();

	const [fetchUser, setFetchUser] = useState(true);
	const [editAuthors, setEditAuthors] = useState(false);
	const [editBooks, setEditBooks] = useState(false);
	const [editGenres, setEditGenres] = useState(false);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo, loading, error } = userLogin;

	const userDetail = useSelector((state) => state.userDetail);
	const { user, loading: detailLoading, error: detailError } = userDetail;

	const [newGenreList, setNewGenreList] = useState([]);

	useEffect(() => {
		if (!userInfo) {
			history.push("/login");
		}
		//user is not logged in.
		else if (!user?.id || fetchUser) {
			dispatch({ type: "USER_UPDATE_PROFILE_RESET" });
			dispatch(getUserDetail("profile"));
			setFetchUser(false);
		} else {
			setNewGenreList(user.genres?.map((obj) => obj.genre));
		}
	}, [fetchUser, user, userInfo, history, dispatch]);

	const unfollowAuthorHandler = (authorId) => {
		dispatch(followAuthor(authorId));
		setFetchUser(true);
	};

	const removeBookHandler = (bookId) => {
		dispatch(favouriteBook(bookId));
		setFetchUser(true);
	};

	const getGenreBooks = (genre) => {
		history.push(`/books/genre/${genre}`);
	};

	const editNewGenreList = (genre) => {
		if (newGenreList?.includes(genre)) {
			setNewGenreList(newGenreList.filter((g) => g !== genre));
		} else {
			setNewGenreList([...newGenreList, genre]);
		}
		// setNewGenreList(genres);
	};

	const submitFavouriteGenres = () => {
		dispatch(favouriteGenreList(newGenreList));
		setEditGenres(false);
		setFetchUser(true);
	};

	const createGenreList = () => {
		const genreList = [
			"Action & Adventures",
			"Art & Crafts",
			"Biographies & Memoirs",
			"Business & Economics",
			"Children & Young Adult",
			"Comics & Mangas",
			"Computers & Internet",
			"Crime & Thriller",
			"Family & Lifestyle",
			"Film & Photography",
			"Health & Medicine",
			"History",
			"Horror & Paranormal",
			"Humor & Comedy",
			"Indian Writing",
			"Language & Writing",
			"Law & Politics",
			"Literature & Fiction",
			"Love & Romance",
			"Music",
			"Mystery & Suspence",
			"Personal Development",
			"Poetry",
			"Religion & Spirituality",
			"Science & Technology",
			"Sci-fi & Fantasy",
			"Society & Social Sciences",
			"Sports & Games",
			"Study Aids & Exam Prep",
			"Travel",
		];
		var genres = user.genres?.map((obj) => obj.genre);
		genreList.forEach((genre) => {
			genres = genres.filter(
				(g) => genre !== g //deleting duplicate genres in final list
			);
		});
		return [...genreList, ...genres].sort();
	};

	const sortUserGenres = () => {
		if (!user.genres) return [];
		var userGenres = user.genres?.map((obj) => obj.genre);
		return userGenres.sort();
	};

	return (
		<Container xs={12} md={9} lg={6} className="mt-5 mx-3" fluid>
			<h2>My Library</h2>
			{loading || detailLoading ? (
				<Loader />
			) : error || detailError || !user ? (
				<Message variant="danger">{detailError}</Message>
			) : (
				<div>
					<Row className="pt-4">
						<Col md={3}>
							<h4>Authors you follow</h4>
							<hr />
						</Col>
						{!editAuthors && user.authors?.length > 0 && (
							<Col>
								<Button
									onClick={(e) => setEditAuthors(true)}
									className="p-1 px-2"
								>
									Edit
								</Button>
							</Col>
						)}
					</Row>
					{user.authors?.length === 0 ? (
						<Col>
							<Message variant="info">
								You are not following any authors.
							</Message>
						</Col>
					) : (
						<ListGroup className="mb-4">
							<Row>
								{user.authors?.map((author) => (
									<Col key={author.id} xs={4} sm={3} lg={2} className="my-1">
										<Card variant="flush" className="rounded">
											<Col className="center">
												<Link to={`/author/${author.id}`}>
													<Image
														src={author.image_sm}
														alt={author.name}
														className="author-img"
														fluid
														roundedCircle
													/>
												</Link>
											</Col>
											<Card.Body className="p-0">
												<Link to={`/author/${author.id}`} className="link">
													<Row className="center">{author.name}</Row>
												</Link>
											</Card.Body>
										</Card>
										{editAuthors && (
											<Row>
												<Col className="center">
													<Button
														onClick={() => unfollowAuthorHandler(author.id)}
														variant="warning"
														className="p-1 mt-2"
													>
														Unfollow
													</Button>
												</Col>
											</Row>
										)}
									</Col>
								))}
							</Row>
						</ListGroup>
					)}

					<Row className="pt-4">
						<Col md={3}>
							<h4>Your favourite Books</h4>
							<hr />
						</Col>
						{!editBooks && user.books?.length > 0 && (
							<Col>
								<Button
									onClick={(e) => setEditBooks(true)}
									className="p-1 px-2"
								>
									Edit
								</Button>
							</Col>
						)}
					</Row>
					{user.books?.length === 0 ? (
						<Col>
							<Message variant="info">
								You do not have any favourite book.
							</Message>
						</Col>
					) : (
						<ListGroup className="mb-4">
							<Row>
								{user.books?.map((book) => (
									<Col
										key={book.id}
										className="mx-1"
										xs={4}
										sm={4}
										md={3}
										lg={2}
										xl={1}
									>
										<Link to={`/book/${book.id}`}>
											<Image
												src={book.image}
												alt={book.title}
												className="book-img"
												fluid
											/>
										</Link>
										<Link to={`/book/${book.id}`} className="link-title">
											<Row className="center" style={{ fontSize: "0.9rem" }}>
												{book.title.length > 25
													? book.title.substring(0, 30) + "..."
													: book.title}
											</Row>
										</Link>
										{editBooks && (
											<Row>
												<Col className="center">
													<Button
														variant="warning"
														onClick={() => removeBookHandler(book.id)}
														className="p-1 py-0 my-1"
													>
														Remove
													</Button>
												</Col>
											</Row>
										)}
									</Col>
								))}
							</Row>
						</ListGroup>
					)}

					<Row className="pt-4">
						<Col md={3}>
							<h4>Your favourite Genres</h4>
							<hr />
						</Col>
						{!editGenres && user.genres?.length > 0 ? (
							<Col className="mx-2">
								<Button
									onClick={(e) => setEditGenres(true)}
									className="p-1 px-2"
								>
									Edit
								</Button>
							</Col>
						) : (
							user.genres?.length > 0 && (
								<Col className="mx-2">
									<Button
										onClick={(e) => submitFavouriteGenres()}
										variant="success"
										className="p-1 px-2"
									>
										Save Edit
									</Button>
								</Col>
							)
						)}
					</Row>
					{user.genres?.length === 0 ? (
						<Col>
							<Message variant="info">
								You do not have any favourite genre.
							</Message>
						</Col>
					) : (
						<Row>
							{!editGenres ? (
								<>
									{sortUserGenres().map((genre) => (
										<Col xs="auto" className="mx-2 my-2" key={genre}>
											<Button
												variant="dark"
												className="m-1"
												onClick={() => getGenreBooks(genre)}
											>
												{genre}
											</Button>
										</Col>
									))}
								</>
							) : (
								<>
									{createGenreList().map((genre) => (
										<Col className="" xl={3} md={4} sm={6}>
											<ListGroup key={genre}>
												<ListGroup.Item
													as={Col}
													variant={
														newGenreList?.includes(genre)
															? "success"
															: "primary"
													}
													xs="auto"
													className="m-2 px-3"
												>
													<Form.Check
														inline
														id={genre}
														type="checkbox"
														checked={
															newGenreList?.includes(genre) ? true : false
														}
														label={genre}
														onChange={(e) => editNewGenreList(e.target.id)}
													/>
												</ListGroup.Item>
											</ListGroup>
										</Col>
									))}
								</>
							)}
						</Row>
					)}
				</div>
			)}
		</Container>
	);
}
export default LibraryScreen;
