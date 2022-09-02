export const userDetailReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case "USER_DETAIL_REQUEST":
			return { user: state.user, loading: true };

		case "USER_DETAIL_SUCCESS":
			return {
				loading: false,
				user: action.payload,
				success: true,
			};

		case "USER_DETAIL_FAIL":
			return { loading: false, error: action.payload };

		case "USER_DETAIL_RESET":
			return { user: {} };

		default:
			return state;
	}
};

export const userFollowAuthorReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case "USER_FOLLOW_AUTHOR_REQUEST":
			return { loading: true };

		case "USER_FOLLOW_AUTHOR_SUCCESS":
			return {
				loading: false,
				success: true,
				userAuthors: action.payload,
			};

		case "USER_FOLLOW_AUTHOR_FAIL":
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const userFavouriteBookReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case "USER_FAVOURITE_BOOK_REQUEST":
			return { loading: true };

		case "USER_FAVOURITE_BOOK_SUCCESS":
			return {
				loading: false,
				success: true,
				userBooks: action.payload,
			};

		case "USER_FAVOURITE_BOOK_FAIL":
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const userFavouriteGenreReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case "USER_FAVOURITE_GENRE_REQUEST":
			return { loading: true };

		case "USER_FAVOURITE_GENRE_SUCCESS":
			return {
				loading: false,
				success: true,
				userGenres: action.payload,
			};

		case "USER_FAVOURITE_GENRE_FAIL":
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const userFavouriteGenreListReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case "USER_FAVOURITE_GENRE_LIST_REQUEST":
			return { loading: true };

		case "USER_FAVOURITE_GENRE_LIST_SUCCESS":
			return {
				loading: false,
				success: true,
				userGenreList: action.payload,
			};

		case "USER_FAVOURITE_GENRE_LIST_FAIL":
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const cartReducer = (state = { cartItems: [] }, action) => {
	switch (action.type) {
		case "CART_ITEM_LIST_REQUEST":
			return { loadingList: true, cartItems: [] };

		case "CART_ITEM_LIST_SUCCESS":
			return {
				loadingList: false,
				cartItems: action.payload,
			};

		case "CART_ITEM_LIST_FAIL":
			return { loadingList: false, errorList: action.payload };

		case "CART_ADD_ITEM_REQUEST":
			return { loadingAdd: true, cartItems: state.cartItems || [] };

		case "CART_ADD_ITEM_SUCCESS":
			const item = action.payload.item;
			let index = -1;

			state.cartItems.forEach((x, i) => {
				if (x.book.id === item.book.id) index = i;
			});

			if (index !== -1) {
				state.cartItems[index] = item;
				return {
					loadingAdd: false,
					message: action.payload.message,
					cartItems: state.cartItems,
				};
			} else
				return {
					loadingAdd: false,
					message: action.payload.message,
					cartItems: [...state.cartItems, item],
				};

		case "CART_ADD_ITEM_FAIL":
			return { loadingAdd: false, errorAdd: action.payload };

		case "CART_REMOVE_ITEM_REQUEST":
			return { loadingRemove: true, cartItems: state.cartItems || [] };

		case "CART_REMOVE_ITEM_SUCCESS":
			return {
				loadingRemove: false,
				cartItems: state.cartItems.filter(
					(item) => item.book.id !== Number(action.payload.book_id)
				),
			};

		case "CART_REMOVE_ITEM_FAIL":
			return { loadingRemove: false, errorRemove: action.payload };

		default:
			return state;
	}
};

export const wishListReducer = (state = { wishListItems: [] }, action) => {
	switch (action.type) {
		case "WISHLIST_ITEMS_REQUEST":
			return { loadingList: true, wishListItems: [] };

		case "WISHLIST_ITEMS_SUCCESS":
			return {
				loadingList: false,
				wishListItems: action.payload,
			};

		case "WISHLIST_ITEMS_FAIL":
			return { loadingList: false, errorList: action.payload };

		case "WISHLIST_ADD_ITEM_REQUEST":
			return { loadingAdd: true, wishListItems: state.wishListItems || [] };

		case "WISHLIST_ADD_ITEM_SUCCESS":
			const item = action.payload.item;
			const itemIds = state.wishListItems.map((item) => item.id);

			if (itemIds.includes(item.id)) {
				return {
					loadingAdd: false,
					wishListItems: state.wishListItems,
					message: action.payload.message,
				};
			} else
				return {
					loadingAdd: false,
					wishListItems: [...state.wishListItems, item],
				};

		case "WISHLIST_ADD_ITEM_FAIL":
			return { loadingAdd: false, errorAdd: action.payload };

		case "WISHLIST_REMOVE_ITEM_REQUEST":
			return { loadingRemove: true, wishListItems: state.wishListItems || [] };

		case "WISHLIST_REMOVE_ITEM_SUCCESS":
			return {
				loadingRemove: false,
				wishListItems: state.wishListItems.filter(
					(item) => item.id !== Number(action.payload.book_id)
				),
			};

		case "WISHLIST_REMOVE_ITEM_FAIL":
			return { loadingRemove: false, errorRemove: action.payload };

		default:
			return state;
	}
};
