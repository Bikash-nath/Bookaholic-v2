import axios from "axios";

export const getAuthorDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: "AUTHOR_DETAILS_REQUEST" });

		const { data } = await axios.get(`/api/authors/${id}/`);

		dispatch({
			type: "AUTHOR_DETAILS_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "AUTHOR_DETAILS_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const getSimilarAuthors = (id) => async (dispatch) => {
	try {
		dispatch({ type: "SIMILAR_AUTHOR_LIST_REQUEST" });

		const { data } = await axios.get(`/api/authors/${id}/similar/`);

		dispatch({
			type: "SIMILAR_AUTHOR_LIST_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "SIMILAR_AUTHOR_LIST_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const searchAuthors =
	(keyword = "") =>
	async (dispatch) => {
		try {
			dispatch({ type: "AUTHOR_SEARCH_REQUEST" });

			const { data } = await axios.get(`/api/authors/search${keyword}`);

			dispatch({
				type: "AUTHOR_SEARCH_SUCCESS",
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: "AUTHOR_SEARCH_FAIL",
				payload: error.response?.data.error_message
					? error.response.data.error_message
					: error.message,
			});
		}
	};

export const getAuthorList =
	(order = "") =>
	async (dispatch) => {
		try {
			dispatch({ type: "AUTHOR_LIST_REQUEST" });

			const { data } = await axios.get(`/api/authors${order}`);

			dispatch({
				type: "AUTHOR_LIST_SUCCESS",
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: "AUTHOR_LIST_FAIL",
				payload: error.response?.data.error_message
					? error.response.data.error_message
					: error.message,
			});
		}
	};

export const createAuthorReview =
	(authorId, review) => async (dispatch, getState) => {
		try {
			dispatch({ type: "AUTHOR_CREATE_REVIEW_REQUEST" });

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
				`/api/authors/${authorId}/reviews/`,
				review,
				config
			);

			dispatch({
				type: "AUTHOR_CREATE_REVIEW_SUCCESS",
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: "AUTHOR_CREATE_REVIEW_FAIL",
				payload: error.response?.data.error_message
					? error.response.data.error_message
					: error.message,
			});
		}
	};
