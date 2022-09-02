export const bookBestSellerReducer = (
	state = { bestSellerBooks: [] },
	action
) => {
	switch (action.type) {
		case "BOOK_BESTSELLER_LIST_REQUEST":
			return { loadingBestSellers: true, ...state, bestSellerBooks: [] };

		case "BOOK_BESTSELLER_LIST_SUCCESS":
			return {
				loadingBestSellers: false,
				bestSellerBooks: action.payload.books,
				bestSellerPage: action.payload.page,
				bestSellerPages: action.payload.pages,
			};

		case "BOOK_BESTSELLER_LIST_FAIL":
			return { loadingBestSellers: false, errorBestSellers: action.payload };

		default:
			return state;
	}
};

export const bookIndianReducer = (state = { indianBooks: [] }, action) => {
	switch (action.type) {
		case "BOOK_INDIAN_LIST_REQUEST":
			return { loadingIndianBooks: true, ...state, indianBooks: [] };

		case "BOOK_INDIAN_LIST_SUCCESS":
			return {
				loadingIndianBooks: false,
				indianBooks: action.payload.books,
				indianPage: action.payload.page,
				indianPages: action.payload.pages,
			};

		case "BOOK_INDIAN_LIST_FAIL":
			return { loadingIndianBooks: false, errorIndianBooks: action.payload };

		default:
			return state;
	}
};

export const bookGenreReducer = (state = { books: [] }, action) => {
	switch (action.type) {
		case "BOOK_GENRE_LIST_REQUEST":
			return { loading: true, books: [] };

		case "BOOK_GENRE_LIST_SUCCESS":
			return {
				loading: false,
				books: action.payload.books,
				page: action.payload.page,
				pages: action.payload.pages,
			};

		case "BOOK_GENRE_LIST_FAIL":
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const bookSearchListReducer = (
	state = { searchedBooks: [] },
	action
) => {
	switch (action.type) {
		case "BOOK_SEARCH_REQUEST":
			return { loading: true, books: [] };

		case "BOOK_SEARCH_SUCCESS":
			return {
				loading: false,
				searchedBooks: action.payload.books,
				page: action.payload.page,
				pages: action.payload.pages,
				totalBooks: action.payload.total_books,
			};

		case "BOOK_SEARCH_FAIL":
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const bookDetailsReducer = (
	state = { book: { reviews: [] } },
	action
) => {
	switch (action.type) {
		case "BOOK_DETAILS_REQUEST":
			return { loading: true, ...state };

		case "BOOK_DETAILS_SUCCESS":
			return {
				loading: false,
				book: action.payload,
			};

		case "BOOK_DETAILS_FAIL":
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const similarBookListReducer = (
	state = { similarBooks: [] },
	action
) => {
	switch (action.type) {
		case "SIMILAR_BOOK_LIST_REQUEST":
			return { loading: true, similarBooks: [] };

		case "SIMILAR_BOOK_LIST_SUCCESS":
			return {
				loading: false,
				similarBooks: action.payload,
			};

		case "SIMILAR_BOOK_LIST_FAIL":
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const bookCreateReviewReducer = (state = {}, action) => {
	switch (action.type) {
		case "BOOK_CREATE_REVIEW_REQUEST":
			return { loading: true, ...state };

		case "BOOK_CREATE_REVIEW_SUCCESS":
			return {
				loading: false,
				success: true,
			};

		case "BOOK_CREATE_REVIEW_FAIL":
			return { loading: false, error: action.payload };

		case "BOOK_CREATE_REVIEW_RESET":
			return {};

		default:
			return state;
	}
};
