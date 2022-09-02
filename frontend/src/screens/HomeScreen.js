import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getBestSellerBooks, getIndianBooks } from "../actions/bookActions";
import { getAuthorList } from "../actions/authorActions";
import Carousels from "../components/Carousel";
import BooksRow from "../components/BooksRow";
import AuthorsRow from "../components/AuthorsRow";
import Loader from "../components/Loader";
import Message from "../components/Message";

function HomeScreen({ history }) {
	const dispatch = useDispatch();

	const bookBestSeller = useSelector((state) => state.bookBestSeller);
	const { bestSellerBooks, loadingBestSellers, errorBestSellers } =
		bookBestSeller;

	const bookIndian = useSelector((state) => state.bookIndian);
	const { indianBooks, loadingIndianBooks, errorIndianBooks } = bookIndian;

	const authorList = useSelector((state) => state.authorList);
	const { authors, loadingAuthors, errorAuthors } = authorList;

	useEffect(() => {
		dispatch(getBestSellerBooks());
		dispatch(getIndianBooks());
		dispatch(getAuthorList());
	}, [dispatch]);

	const getGenreBooks = (genre) => {
		history.push(`/books/genre/${genre}`);
	};

	const topGenreList = [
		"Action & Adventures",
		"Crime & Thriller",
		"Literature & Fiction",
		"Sci-fi & Fantasy",
		"Children & Young Adult",
		"Biographies & Memoirs",
		"Romance",
		"Indian Writing",
		"Business & Economics",
		"Family & Personal Development",
		"Study Aids & Exam Prep",
		"Politics & Social Sciences",
	];

	const topSeriesList = ["Harry Potter", "Fifty Shades", "Wimpy Kid"];

	return (
		<Container fluid className="mt-5 pt-2">
			{(loadingBestSellers || loadingIndianBooks || loadingAuthors) &&
			authors?.length ? (
				<Loader />
			) : errorBestSellers ? (
				<Message variant="danger">{errorBestSellers}</Message>
			) : errorIndianBooks ? (
				<Message variant="danger">{errorIndianBooks}</Message>
			) : errorAuthors ? (
				<Message variant="danger">{errorAuthors}</Message>
			) : (
				<>
					<Container fluid>
						<Carousels />
						<Row className="mt-4 pt-2">
							<Col>
								<h3 className="mb-0">Best sellers</h3>
							</Col>
							<Col className="right pt-4">
								<Link to={"/books/bestsellers/"} className="link">
									<h6>
										<strong>All Best sellers</strong>
									</h6>
								</Link>
							</Col>
						</Row>
						<BooksRow books={bestSellerBooks} />

						<Row className="mt-4 pt-2">
							<Col>
								<h3 className="mb-0">India reading</h3>
							</Col>
							<Col className="right pt-4">
								<Link to={"/books/indian-books/"} className="link">
									<h6>
										<strong>All Indian Books</strong>
									</h6>
								</Link>
							</Col>
						</Row>

						<BooksRow books={indianBooks} />

						<Row className="my-2">
							<h3 className="mb-0">Shop by Genre</h3>
							{topGenreList.map((genre, i) => (
								<Col key={i} xs={3} sm={3} md={2} lg={1} xl={1}>
									<Link
										onClick={() => getGenreBooks(genre)}
										to={`/books/genre/${genre}/`}
									>
										<Image
											src={"static/icons/" + genre.split(" ")[0] + ".png"}
											alt={genre}
											roundedCircle
											fluid
										/>
									</Link>
									<Link onClick={() => getGenreBooks(genre)} className="link">
										<Row
											className="center"
											style={{ fontSize: "0.9rem", padding: "0 0.5rem" }}
										>
											{genre}
										</Row>
									</Link>
								</Col>
							))}
						</Row>

						<Row className="mt-4">
							<Col>
								<h3 className="mb-0">Featured Authors</h3>
							</Col>
							<Col className="right pt-4">
								<Link to={"/authors/"} className="link">
									<h6>
										<strong>All Authors</strong>
									</h6>
								</Link>
							</Col>
						</Row>
						<AuthorsRow authors={authors?.slice(0, 8)} slides={8} />

						<Row className="mt-4">
							<h3 className="mb-0">Featured Series</h3>
							{topSeriesList.map((series, i) => (
								<Col key={i} xs={6} md={4} lg={3}>
									<Link onClick={() => getGenreBooks(series)}>
										<Image
											src={"static/icons/" + series.split(" ")[0] + ".png"}
											alt={series}
											rounded
											fluid
										/>
									</Link>
								</Col>
							))}
						</Row>
					</Container>
				</>
			)}
		</Container>
	);
}

export default HomeScreen;
