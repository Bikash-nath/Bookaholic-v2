import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button, Form, InputGroup } from "react-bootstrap";

function SearchBox() {
	const [keyword, setKeyword] = useState("");
	const [searchType, setSearchType] = useState("Books");
	const [debouncedTerm, setDebouncedTerm] = useState(keyword);

	const history = useHistory();

	const path = history.location.pathname;

	const setPath = () => {
		if (keyword) {
			searchType === "Authors"
				? history.push(`/authors/?keyword=${keyword}&page=1`)
				: history.push(`/books/?keyword=${keyword}&page=1`);
		} else if (searchType) {
			searchType === "Authors"
				? history.push("/authors/")
				: searchType === "Books"
				? history.push("/books/")
				: searchType === "Ebooks"
				? history.push("/books/Ebooks/")
				: history.push(path);
		}
	};

	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedTerm(keyword);
		}, 1000);

		return () => {
			clearTimeout(timerId);
		};
	}, [keyword]);

	useEffect(() => {
		if (debouncedTerm) {
			setPath();
		}
	}, [debouncedTerm]); //don't add setPath as dependency of useEffect; CallBack hell

	return (
		<Form
			onSubmit={(e) => {
				e.preventDefault();
				setPath();
			}}
			className="mx-1"
		>
			<Form.Group>
				<Row>
					<Col xs={10} className="p-1">
						<InputGroup>
							<InputGroup.Text className="m-0 p-0">
								<Form.Control
									as="select"
									value={searchType}
									className="m-0 select-menu btn btn-light"
									placeholder={searchType}
									custom
									onChange={(e) => {
										e.preventDefault();
										setSearchType(e.target.value);
									}}
								>
									<option key="authors" value="Authors">
										Authors
									</option>
									<option key="books" value="Books">
										Books
									</option>
									<option key="ebooks" value="Ebooks">
										Ebooks
									</option>
								</Form.Control>
							</InputGroup.Text>
							<Form.Control
								type="text"
								name="q"
								onChange={(e) => {
									e.preventDefault();
									setKeyword(e.target.value);
								}}
								className="ml-sm-5"
								placeholder={
									searchType === "Authors"
										? "Search Authors"
										: "Search Books by title, author, ISBN or genre"
								}
							/>
						</InputGroup>
					</Col>

					<Col className="my-1 px-0 mx-0">
						<Button
							type="submit"
							variant="warning"
							className="p-1 pt-2"
							id="SearchButton"
						>
							<svg width="24px" height="24px">
								<path d="M11.618 9.897l4.224 4.212c.092.09.1.23.02.312l-1.464 1.46c-.08.08-.222.072-.314-.02L9.868 11.66M6.486 10.9c-2.42 0-4.38-1.955-4.38-4.367 0-2.413 1.96-4.37 4.38-4.37s4.38 1.957 4.38 4.37c0 2.412-1.96 4.368-4.38 4.368m0-10.834C2.904.066 0 2.96 0 6.533 0 10.105 2.904 13 6.486 13s6.487-2.895 6.487-6.467c0-3.572-2.905-6.467-6.487-6.467 " />
							</svg>
						</Button>
					</Col>
				</Row>
			</Form.Group>
		</Form>
	);
}

export default SearchBox;
