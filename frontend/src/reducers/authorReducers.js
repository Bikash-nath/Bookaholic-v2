export const authorDetailsReducer = (
	state = { author: { reviews: [] } },
	action
) => {
	switch (action.type) {
		case "AUTHOR_DETAILS_REQUEST":
			return { loading: true, ...state };

		case "AUTHOR_DETAILS_SUCCESS":
			return {
				loading: false,
				author: action.payload,
			};

		case "AUTHOR_DETAILS_FAIL":
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const authorSimilarListReducer = (state = { authors: [] }, action) => {
	switch (action.type) {
		case "SIMILAR_AUTHOR_LIST_REQUEST":
			return { loading: true, authors: [] };

		case "SIMILAR_AUTHOR_LIST_SUCCESS":
			return {
				loading: false,
				authors: action.payload,
			};

		case "SIMILAR_AUTHOR_LIST_FAIL":
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const authorListReducer = (state = { authors: [] }, action) => {
	switch (action.type) {
		case "AUTHOR_LIST_REQUEST":
			return { loadingAuthors: true, authors: [] };

		case "AUTHOR_LIST_SUCCESS":
			return {
				loadingAuthors: false,
				authors: action.payload.authors,
				page: action.payload.page,
				pages: action.payload.pages,
			};

		case "AUTHOR_LIST_FAIL":
			return { loadingAuthors: false, errorAuthors: action.payload };

		default:
			return state;
	}
};

export const authorSearchListReducer = (
	state = { searchedAuthors: [] },
	action
) => {
	switch (action.type) {
		case "AUTHOR_SEARCH_REQUEST":
			return { loading: true, authors: [] };

		case "AUTHOR_SEARCH_SUCCESS":
			return {
				loading: false,
				searchedAuthors: action.payload.authors,
				page: action.payload.page,
				pages: action.payload.pages,
				totalAuthors: action.payload.total_authors,
			};

		case "AUTHOR_SEARCH_FAIL":
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const authorCreateReviewReducer = (state = {}, action) => {
	switch (action.type) {
		case "AUTHOR_CREATE_REVIEW_REQUEST":
			return { loading: true, ...state };

		case "AUTHOR_CREATE_REVIEW_SUCCESS":
			return {
				loading: false,
				success: true,
			};

		case "AUTHOR_CREATE_REVIEW_FAIL":
			return { loading: false, error: action.payload };

		case "AUTHOR_CREATE_REVIEW_RESET":
			return {};

		default:
			return state;
	}
};
