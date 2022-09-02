import axios from "axios";

export const getUserDetail = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: "USER_DETAIL_REQUEST",
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get("/api/users/detail/", config);
		dispatch({
			type: "USER_DETAIL_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "USER_DETAIL_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const followAuthor = (authorId) => async (dispatch, getState) => {
	try {
		dispatch({
			type: "USER_FOLLOW_AUTHOR_REQUEST",
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(
			"/api/users/follow/author/",
			{ authorId },
			config
		);

		dispatch({
			type: "USER_FOLLOW_AUTHOR_SUCCESS", //to update user profile
			payload: data.authors,
		});
	} catch (error) {
		dispatch({
			type: "USER_FOLLOW_AUTHOR_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const favouriteBook = (bookId) => async (dispatch, getState) => {
	try {
		dispatch({
			type: "USER_FAVOURITE_BOOK_REQUEST",
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(
			"/api/users/favourite/book/",
			{ bookId },
			config
		);

		dispatch({
			type: "USER_FAVOURITE_BOOK_SUCCESS", //to update user profile
			payload: data.books,
		});
	} catch (error) {
		dispatch({
			type: "USER_FAVOURITE_BOOK_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const favouriteGenre = (genre) => async (dispatch, getState) => {
	try {
		dispatch({
			type: "USER_FAVOURITE_GENRE_REQUEST",
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(
			"/api/users/favourite/genre/",
			{ genre },
			config
		);
		dispatch({
			type: "USER_FAVOURITE_GENRE_SUCCESS", //to update user genre
			payload: data.genres,
		});
	} catch (error) {
		dispatch({
			type: "USER_FAVOURITE_GENRE_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const favouriteGenreList = (genreList) => async (dispatch, getState) => {
	try {
		dispatch({
			type: "USER_FAVOURITE_GENRE_LIST_REQUEST",
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(
			"/api/users/favourite/genrelist/",
			{ genreList },
			config
		);
		dispatch({
			type: "USER_FAVOURITE_GENRE_LIST_SUCCESS",
			payload: data.genres,
		});
	} catch (error) {
		dispatch({
			type: "USER_FAVOURITE_GENRE_LIST_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const getCartItems = () => async (dispatch, getState) => {
	try {
		dispatch({ type: "CART_ITEM_LIST_REQUEST" });

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		const { data } = await axios.get("/api/users/cart/", config);

		dispatch({
			type: "CART_ITEM_LIST_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "CART_ITEM_LIST_FAIL",
			payload:
				error.response && error.response.data.error_message
					? error.response.data.error_message
					: error.message,
		});
	}
};

export const addToCart =
	(bookId, sellerId, qty = 1, screen = "cart") =>
	async (dispatch, getState) => {
		try {
			dispatch({ type: "CART_ADD_ITEM_REQUEST" });

			const {
				userLogin: { userInfo },
			} = getState();

			if (userInfo) {
				const config = {
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${userInfo.token}`,
					},
				};
				const { data } = await axios.put(
					"/api/users/cart/add/",
					{
						bookId,
						sellerId,
						qty,
						screen,
					},
					config
				);

				dispatch({
					type: "CART_ADD_ITEM_SUCCESS",
					payload: data,
				});
			} else {
				const {
					bookDetails: { book },
				} = getState();

				const data = {
					bookId: book.id,
					title: book.title,
					authorId: book.author.id,
					authorName: book.author.name,
					image: book.image,
					format: "Paperback",
					price: Math.round(book.sellerbook.price),
					orignalPrice: Number(book.orignal_price),
					discount: book.sellerbook.discount,
					seller: book.sellerbook.seller.name,
					countInStock: book.sellerbook.scount_in_stock,
					qty,
				};

				dispatch({
					type: "CART_ADD_ITEM_SUCCESS",
					payload: data,
				});

				const { cart } = getState();
				localStorage.setItem("cartItems", JSON.stringify(cart.cartItems));
			}
		} catch (error) {
			dispatch({
				type: "CART_ITEM_LIST_FAIL",
				payload:
					error.response && error.response.data.error_message
						? error.response.data.error_message
						: error.message,
			});
		}
	};

export const removeFromCart = (bookId) => async (dispatch, getState) => {
	try {
		dispatch({ type: "CART_REMOVE_ITEM_REQUEST" });

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		if (userInfo) {
			const { data } = await axios.delete(
				`/api/users/cart/remove/${bookId}/`,
				config
			);

			dispatch({
				type: "CART_REMOVE_ITEM_SUCCESS",
				payload: data,
			});
		} else {
			dispatch({
				type: "CART_REMOVE_ITEM_SUCCESS",
				payload: bookId,
			});
			const { cart } = getState();
			localStorage.removeItem("cartItems", JSON.stringify(cart.cartItems));
		}
	} catch (error) {
		dispatch({
			type: "CART_REMOVE_ITEM_FAIL",
			payload:
				error.response && error.response.data.error_message
					? error.response.data.error_message
					: error.message,
		});
	}
};

export const getWishListItems = () => async (dispatch, getState) => {
	try {
		dispatch({ type: "WISHLIST_ITEMS_REQUEST" });
		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		const { data } = await axios.get("/api/users/wishlist/", config);

		dispatch({
			type: "WISHLIST_ITEMS_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "WISHLIST_ITEMS_FAIL",
			payload:
				error.response && error.response.data.error_message
					? error.response.data.error_message
					: error.message,
		});
	}
};

export const addToWishList =
	(bookId, totalItems = 1) =>
	async (dispatch, getState) => {
		try {
			dispatch({ type: "WISHLIST_ADD_ITEM_REQUEST" });

			const {
				userLogin: { userInfo },
			} = getState();

			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${userInfo.token}`,
				},
			};
			const { data } = await axios.put(
				"/api/users/wishlist/add/",
				{
					bookId,
					totalItems,
				},
				config
			);

			dispatch({
				type: "WISHLIST_ADD_ITEM_SUCCESS",
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: "WISHLIST_ADD_ITEM_FAIL",
				payload:
					error.response && error.response.data.error_message
						? error.response.data.error_message
						: error.message,
			});
		}
	};

export const removeFromWishList = (bookId) => async (dispatch, getState) => {
	try {
		dispatch({ type: "WISHLIST_REMOVE_ITEM_REQUEST" });
		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		const { data } = await axios.delete(
			`/api/users/wishlist/remove/${bookId}/`,
			config
		);

		dispatch({
			type: "WISHLIST_REMOVE_ITEM_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "WISHLIST_REMOVE_ITEM_FAIL",
			payload:
				error.response && error.response.data.error_message
					? error.response.data.error_message
					: error.message,
		});
	}
};
