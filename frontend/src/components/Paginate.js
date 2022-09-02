import React from "react";
import { useHistory } from "react-router-dom";

import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Paginate({ pages, page, keyword = "", isAdmin = false }) {
	const sortType = keyword.split("&sortBy=")[1]?.split("&")[0];

	const history = useHistory();
	const path = history.location.pathname;

	const setHref = (x) => {
		if (keyword && sortType) {
			return `${path}?keyword=${keyword}&sortBy=${sortType}&page=${x + 1}`;
		} else if (keyword) {
			return `${path}?keyword=${keyword}&page=${x + 1}`;
		} else if (sortType) {
			return `${path}?sortBy=${sortType}&page=${x + 1}`;
		} else {
			return `${path}?page=${x + 1}`;
		}
	};
	//passing the keyword argument along with page no. from <HomeScreen /> Paginated result based on
	//searched keyword. Or else keyword would reset to '' when pagination button is clicked
	//and it would render Paginated result out of total no. of book pages.

	return (
		pages > 1 && (
			<Pagination bg="primary" variant="dark" expand="lg" collapseOnSelect>
				{[...Array(pages).keys()].map((x) => (
					<LinkContainer to={setHref(x)} key={x + 1}>
						<Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
					</LinkContainer>
				))}
			</Pagination>
		)
	);
}

export default Paginate;
