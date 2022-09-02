import axios from "axios";

export const login = (username, password) => async (dispatch) => {
	try {
		dispatch({ type: "USER_LOGIN_REQUEST" });
		const config = {
			headers: {
				"Content-type": "application/json",
			},
		};
		username = username.split("@")[0];
		const { data } = await axios.post(
			"/api/users/login/",
			{ username, password },
			config
		);

		dispatch({
			type: "USER_LOGIN_SUCCESS",
			payload: data,
		});

		localStorage.setItem("userInfo", JSON.stringify(data));
	} catch (error) {
		dispatch({
			type: "USER_LOGIN_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const logout = () => (dispatch) => {
	localStorage.removeItem("userInfo");
	dispatch({ type: "USER_LOGOUT" });
	dispatch({ type: "USER_DETAILS_RESET" }); //Reset Logged In user details in store (for form).
	dispatch({ type: "ORDERS_LIST_RESET" });
	dispatch({ type: "CART_CLEAR_ITEMS" });
	dispatch({ type: "WISHLIST_CLEAR_ITEMS" });
	dispatch({ type: "USER_LIST_RESET" });
};

export const register =
	(firstName, lastName, email, password) => async (dispatch) => {
		try {
			dispatch({ type: "USER_REGISTER_REQUEST" });
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};

			const { data } = await axios.post(
				"/api/users/register/",
				{ firstName, lastName, email, password },
				config
			);

			dispatch({
				type: "USER_REGISTER_SUCCESS",
				payload: data,
			});

			dispatch({
				type: "USER_LOGIN_SUCCESS",
				payload: data,
			});

			localStorage.setItem("userInfo", JSON.stringify(data));
		} catch (error) {
			dispatch({
				type: "USER_REGISTER_FAIL",
				payload: error.response?.data.error_message
					? error.response.data.error_message
					: error.message,
			});
		}
	};

export const getUserAccount = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: "USER_ACCOUNT_REQUEST",
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

		const { data } = await axios.get("/api/users/account/", config);

		dispatch({
			type: "USER_ACCOUNT_SUCCESS",
			payload: data,
		});

		localStorage.setItem("userInfo", JSON.stringify(data));
	} catch (error) {
		dispatch({
			type: "USER_ACCOUNT_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

//To update user profile based on user object
export const updateUserAccount = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: "USER_UPDATE_ACCOUNT_REQUEST",
		});

		const {
			userLogin: { userInfo },
		} = getState();

		var formData = new FormData();
		for (var key in user) {
			formData.append(key, user[key]);
		}

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put("/api/users/update/", formData, config);

		dispatch({
			type: "USER_UPDATE_ACCOUNT_SUCCESS",
			payload: data,
		});

		dispatch({
			type: "USER_LOGIN_SUCCESS",
			payload: data,
		});

		localStorage.setItem("userInfo", JSON.stringify(data));
	} catch (error) {
		dispatch({
			type: "USER_UPDATE_ACCOUNT_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const deleteUser = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: "USER_DELETE_REQUEST",
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

		const { data } = await axios.delete(`/api/users/delete/${id}`, config);

		dispatch({
			type: "USER_DELETE_SUCCESS",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "USER_DELETE_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const getUserList = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: "USER_LIST_REQUEST",
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

		const { data } = await axios.get("/api/users/list/", config);

		dispatch({
			type: "USER_LIST_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "USER_LIST_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const getAddressList = () => async (dispatch, getState) => {
	try {
		dispatch({ type: "ADDRESS_LIST_REQUEST" });

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get("/api/users/address/get/", config);
		dispatch({
			type: "ADDRESS_LIST_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "ADDRESS_LIST_FAIL",
			payload:
				error.response && error.response.data.error_message
					? error.response.data.error_message
					: error.message,
		});
	}
};

export const createAddress = (address) => async (dispatch) => {
	try {
		dispatch({ type: "ADDRESS_CREATE_REQUEST" });

		const { data } = await axios.post("/api/users/address/add/", {
			address,
		});
		dispatch({
			type: "ADDRESS_CREATE_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "ADDRESS_CREATE_FAIL",
			payload:
				error.response && error.response.data.error_message
					? error.response.data.error_message
					: error.message,
		});
	}
};

export const updateAddress = (address) => async (dispatch) => {
	try {
		dispatch({ type: "ADDRESS_UPDATE_REQUEST" });

		const { data } = await axios.put("/api/users/address/update/", {
			address,
		});
		dispatch({
			type: "ADDRESS_UPDATE_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "ADDRESS_UPDATE_FAIL",
			payload:
				error.response && error.response.data.error_message
					? error.response.data.error_message
					: error.message,
		});
	}
};

export const deleteAddress = (addressId) => async (dispatch) => {
	try {
		dispatch({ type: "ADDRESS_DELETE_REQUEST" });
		const { data } = await axios.delete(
			`/api/users/address/delete/${addressId}`
		);

		dispatch({
			type: "ADDRESS_DELETE_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "ADDRESS_DELETE_FAIL",
			payload:
				error.response && error.response.data.error_message
					? error.response.data.error_message
					: error.message,
		});
	}
};

export const makeDefaultAddress = (addressId) => async (dispatch) => {
	try {
		dispatch({ type: "ADDRESS_DEFAULT_REQUEST" });
		const { data } = await axios.delete(
			`/api/users/address/delete/${addressId}`
		);

		dispatch({
			type: "ADDRESS_DEFAULT_SUCCESS",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "ADDRESS_DEFAULT_FAIL",
			payload:
				error.response && error.response.data.error_message
					? error.response.data.error_message
					: error.message,
		});
	}
};

export const savePaymentMethod = (data) => (dispatch) => {
	dispatch({
		type: "SAVE_PAYMENT_METHOD",
		payload: data,
	});

	localStorage.setItem("paymentMethod", JSON.stringify(data));
};

export const getUnreadNotifications = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: "USER_GET_NOTIFICATIONS_REQUEST",
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

		const { data } = await axios.get("/api/users/notifications/", config);

		dispatch({
			type: "USER_GET_NOTIFICATIONS_SUCCESS",
			payload: data.unread,
		});
	} catch (error) {
		dispatch({
			type: "USER_GET_NOTIFICATIONS_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};

export const updateReadNotifications =
	(notificationId) => async (dispatch, getState) => {
		try {
			dispatch({
				type: "USER_UPDATE_NOTIFICATIONS_REQUEST",
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
				"/api/users/notifications/update/",
				{ notificationId },
				config
			);

			dispatch({
				type: "USER_UPDATE_NOTIFICATIONS_SUCCESS",
				payload: Number(data.notification_id),
			});
		} catch (error) {
			dispatch({
				type: "USER_UPDATE_NOTIFICATIONS_FAIL",
				payload: error.response?.data.error_message
					? error.response.data.error_message
					: error.message,
			});
		}
	};

export const deleteNotifications = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: "USER_DELETE_NOTIFICATIONS_REQUEST",
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

		const { data } = await axios.delete(
			"/api/users/notifications/delete/",
			config
		);

		dispatch({
			type: "USER_DELETE_NOTIFICATIONS_SUCCESS",
		});
	} catch (error) {
		dispatch({
			type: "USER_DELETE_NOTIFICATIONS_FAIL",
			payload: error.response?.data.error_message
				? error.response.data.error_message
				: error.message,
		});
	}
};
