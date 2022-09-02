import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";

import { searchAuthors, getAuthorList } from "../actions/authorActions";
import AuthorsRow from "../components/AuthorsRow";
import Paginate from "../components/Paginate";
import SortAuthors from "../components/SortAuthors";
import Loader from "../components/Loader";
import Message from "../components/Message";

function AuthorListScreen({ history }) {
	const authorList = useSelector((state) => state.authorList);
	const { authors, page, pages, loadingAuthors, errorAuthors } = authorList;

	const authorSearchList = useSelector((state) => state.authorSearchList);
	const {
		searchedAuthors,
		searchPage,
		searchPages,
		totalAuthors,
		loadingSearch,
		errorSearch,
	} = authorSearchList;

	const search = history.location.search;
	const keyword = search?.split("?keyword=")[1]?.split("&")[0];

	const dispatch = useDispatch();

	useEffect(() => {
		if (keyword) {
			dispatch(searchAuthors(search));
		} else {
			dispatch(getAuthorList(search));
		}
	}, [search, dispatch]);

	return (
		<Container fluid className="mt-5 pt-2">
			{keyword ? (
				loadingSearch || searchedAuthors?.length === 0 ? (
					<Loader />
				) : errorSearch ? (
					<Message variant="danger">{errorSearch}</Message>
				) : (
					<Container fluid>
						<Row className="mb-3">
							<Col xs={10} md={9}>
								<h3>{`${totalAuthors} results for '${keyword}'`}</h3>
							</Col>
							<SortAuthors fetchAuthors={searchAuthors} keyword={keyword} />
						</Row>
						{[...Array(4).keys()].map((i) => (
							<AuthorsRow
								authors={searchedAuthors?.slice(6 * i, 6 * (i + 1))}
							/>
						))}
						<Paginate page={searchPage} pages={searchPages} keyword={keyword} />
					</Container>
				)
			) : loadingAuthors ? (
				<Loader />
			) : errorAuthors ? (
				<Message variant="danger">{errorAuthors}</Message>
			) : (
				<Container fluid>
					<Row className="mt-4 py-2">
						<Col>
							<h3 className="mb-0">All Authors</h3>
						</Col>
						<SortAuthors fetchAuthors={getAuthorList} />
					</Row>

					<AuthorsRow authors={authors} />
					<Paginate page={page} pages={pages} keyword={keyword} />
				</Container>
			)}
		</Container>
	);
}

export default AuthorListScreen;
