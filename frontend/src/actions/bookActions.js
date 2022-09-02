import axios from "axios";

export const getBestSellerBooks =
	(order = "") =>
	async (dispatch) => {
		try {
			dispatch({ type: "BOOK_BESTSELLER_LIST_REQUEST" });

			const { data } = await axios.get(`/api/books/bestseller/${order}`);

			dispatch({
				type: "BOOK_BESTSELLER_LIST_SUCCESS",
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: "BOOK_BESTSELLER_LIST_FAIL",
				payload:
					error.response && error.response.data.error_message
						? error.response.data.error_message
						: error.message,
			});
		}
	};

export const getIndianBooks =
	(order = "") =>
	async (dispatch) => {
		try {
			dispatch({ type: "BOOK_INDIAN_LIST_REQUEST" });

			const { data } = await axios.get(`/api/books/indian/${order}`);

			dispatch({
				type: "BOOK_INDIAN_LIST_SUCCESS",
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: "BOOK_INDIAN_LIST_FAIL",
				payload:
					error.response && error.response.data.error_message
						? error.response.data.error_message
						: error.message,
			});
		}
	};

export const getGenreBooks =
	(genre, order = "") =>
	async (dispatch) => {
		try {
			dispatch({ type: "BOOK_GENRE_LIST_REQUEST" });

			const { data } = await axios.get(`/api/books/genre/${genre}/${order}`);

			dispatch({
				type: "BOOK_GENRE_LIST_SUCCESS",
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: "BOOK_GENRE_LIST_FAIL",
				payload: error.response?.data.error_message
					? error.response.data.error_message
					: error.message,
			});
		}
	};

export const searchBooks =
	(keyword = "") =>
	async (dispatch) => {
		try {
			dispatch({ type: "BOOK_SEARCH_REQUEST" });

			const { data } = await axios.get(`/api/books/search/${keyword}`);

			dispatch({
				type: "BOOK_SEARCH_SUCCESS",
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: "BOOK_SEARCH_FAIL",
				payload: error.response?.data.error_message
					? error.response.data.error_message
					: error.message,
			});
		}
	};

export const getSimilarBooks = (id) => async (dispatch) => {
	try {
		dispatch({ type: "SIMILAR_BOOK_LIST_REQUEST" });

		const { data } = await axios.get(`/api/books/${id}/similar/`);

		dispatch({
			type: "SIMILAR_BOOK_LIST_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "SIMILAR_BOOK_LIST_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const getBookDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: "BOOK_DETAILS_REQUEST" });

		const { data } = await axios.get(`/api/books/${id}`);

		dispatch({
			type: "BOOK_DETAILS_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "BOOK_DETAILS_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const createBookReview =
	(bookId, review) => async (dispatch, getState) => {
		try {
			dispatch({ type: "BOOK_CREATE_REVIEW_REQUEST" });

			const {
				userLogin: { userInfo },
			} = getState();

			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${userInfo.token}`,
				},
			};
			const { data } = await axios.post(
				`/api/books/${bookId}/reviews/`,
				review,
				config
			);

			dispatch({
				type: "BOOK_CREATE_REVIEW_SUCCESS",
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: "BOOK_CREATE_REVIEW_FAIL",
				payload: error.response?.data.error_message
					? error.response.data.error_message
					: error.message,
			});
		}
	};
