import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
	bookBestSellerReducer,
	bookIndianReducer,
	bookGenreReducer,
	bookDetailsReducer,
	similarBookListReducer,
	bookSearchListReducer,
	bookCreateReviewReducer,
} from "./reducers/bookReducers";
import {
	authorDetailsReducer,
	authorSimilarListReducer,
	authorListReducer,
	authorSearchListReducer,
	authorCreateReviewReducer,
} from "./reducers/authorReducers";
import {
	userLoginReducer,
	userRegisterReducer,
	userAccountReducer,
	userUpdateAccountReducer,
	userListReducer,
	userDeleteReducer,
	addressReducer,
	paymentMethodReducer,
	userNotificationsReducer,
} from "./reducers/userAccountReducers";
import {
	userDetailReducer,
	userFollowAuthorReducer,
	userFavouriteBookReducer,
	userFavouriteGenreReducer,
	userFavouriteGenreListReducer,
	cartReducer,
	wishListReducer,
} from "./reducers/userDetailReducers";
import {
	orderCreateReducer,
	orderDetailsReducer,
	orderPayReducer,
	orderListReducer,
	orderCancelReducer,
	orderItemCancelReducer,
} from "./reducers/orderReducers";

const reducer = combineReducers({
	bookBestSeller: bookBestSellerReducer,
	bookIndian: bookIndianReducer,
	bookGenre: bookGenreReducer,
	bookDetails: bookDetailsReducer,
	similarBookList: similarBookListReducer,
	bookSearchList: bookSearchListReducer,
	bookCreateReview: bookCreateReviewReducer,

	authorDetails: authorDetailsReducer,
	authorSimilarList: authorSimilarListReducer,
	authorList: authorListReducer,
	authorSearchList: authorSearchListReducer,
	authorCreateReview: authorCreateReviewReducer,

	userLogin: userLoginReducer,
	userRegister: userRegisterReducer,
	userAccount: userAccountReducer,
	userUpdateAccount: userUpdateAccountReducer,
	userList: userListReducer,
	userDelete: userDeleteReducer,
	address: addressReducer,
	paymentMethod: paymentMethodReducer,
	userNotifications: userNotificationsReducer,

	userDetail: userDetailReducer,
	userFollowAuthor: userFollowAuthorReducer,
	userFavouriteBook: userFavouriteBookReducer,
	userFavouriteGenre: userFavouriteGenreReducer,
	userFavouriteGenreList: userFavouriteGenreListReducer,
	cart: cartReducer,
	wishList: wishListReducer,

	orderCreate: orderCreateReducer,
	orderDetails: orderDetailsReducer,
	orderPay: orderPayReducer,
	orderList: orderListReducer,
	orderCancel: orderCancelReducer,
	orderItemCancel: orderItemCancelReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
	? JSON.parse(localStorage.getItem("userInfo"))
	: null;

const cartItemsFromStorage = localStorage.getItem("cartItems")
	? JSON.parse(localStorage.getItem("cartItems"))
	: [];

const addressFromStorage = localStorage.getItem("address")
	? JSON.parse(localStorage.getItem("address"))
	: {};

const initialState = {
	cart: { cartItems: cartItemsFromStorage },
	userLogin: { userInfo: userInfoFromStorage },
	addressList: [addressFromStorage],
};

const middleware = [thunk];

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
