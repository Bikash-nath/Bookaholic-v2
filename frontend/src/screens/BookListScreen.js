import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";

import {
	getBestSellerBooks,
	getIndianBooks,
	searchBooks,
} from "../actions/bookActions";
import BooksRow from "../components/BooksRow";
import SortBooks from "../components/SortBooks";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";

function BookListScreen({ history }) {
	const bookSearchList = useSelector((state) => state.bookSearchList);
	const { searchedBooks, loadingSearch, errorSearch, page, pages, totalBooks } =
		bookSearchList;

	const bookBestSeller = useSelector((state) => state.bookBestSeller);
	const {
		bestSellerBooks,
		loadingBestSellers,
		errorBestSellers,
		bestSellerPage,
		bestSellerPages,
	} = bookBestSeller;

	const bookIndian = useSelector((state) => state.bookIndian);
	const {
		indianBooks,
		loadingIndianBooks,
		errorIndianBooks,
		indianPage,
		indianPages,
	} = bookIndian;

	const search = history.location.search;
	const keyword = search.split("?keyword=")[1]?.split("&")[0];
	const path = history.location.pathname;

	const dispatch = useDispatch();

	useEffect(() => {
		if (keyword) {
			dispatch(searchBooks(search));
		} else if (path.includes("/indian-books")) {
			dispatch(getIndianBooks(search));
		} else {
			dispatch(getBestSellerBooks(search));
		}
	}, [search, dispatch]);

	return (
		<Container fluid className="mt-5 pt-2">
			{keyword ? (
				loadingSearch || searchedBooks?.length === 0 ? (
					<Loader />
				) : errorSearch ? (
					<Message variant="danger">{errorSearch}</Message>
				) : (
					<Container fluid>
						<Row className="mb-3">
							<Col>
								<h3>{`${totalBooks} results for '${keyword}'`}</h3>
							</Col>
							<SortBooks fetchBooks={searchBooks} keyword={keyword} />
						</Row>
						{[...Array(4).keys()].map((i) => (
							<BooksRow books={searchedBooks?.slice(6 * i, 6 * (i + 1))} />
						))}
						<Paginate page={page} pages={pages} keyword={keyword} />
					</Container>
				)
			) : path.includes("/indian-books") ? (
				loadingIndianBooks ? (
					<Loader />
				) : errorIndianBooks ? (
					<Message variant="danger">{errorIndianBooks}</Message>
				) : (
					<Container fluid>
						<Row className="mt-4 py-2">
							<Col>
								<h3 className="mb-0">India reading Books</h3>
							</Col>
							<SortBooks fetchBooks={getIndianBooks} />
						</Row>

						{[...Array(4).keys()].map((i) => (
							<BooksRow books={indianBooks?.slice(6 * i, 6 * (i + 1))} />
						))}

						<Paginate page={indianPage} pages={indianPages} />
					</Container>
				)
			) : loadingBestSellers ? (
				<Loader />
			) : errorBestSellers ? (
				<Message variant="danger">{errorBestSellers}</Message>
			) : (
				<Container fluid>
					<Row className="mt-4 py-2">
						<Col>
							<h3 className="mb-0">Best sellers</h3>
						</Col>
						<SortBooks fetchBooks={getBestSellerBooks} />
					</Row>
					{[...Array(4).keys()].map((i) => (
						<BooksRow books={bestSellerBooks?.slice(6 * i, 6 * (i + 1))} />
					))}

					<Paginate page={bestSellerPage} pages={bestSellerPages} />
				</Container>
			)}
		</Container>
	);
}

export default BookListScreen;
