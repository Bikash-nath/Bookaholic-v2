export const userLoginReducer = (state = {}, action) => {
	switch (action.type) {
		case "USER_LOGIN_REQUEST":
			return { loading: true };

		case "USER_LOGIN_SUCCESS":
			return {
				loading: false,
				userInfo: action.payload,
			};

		case "USER_LOGIN_FAIL":
			return { loading: false, error: action.payload };

		case "USER_LOGOUT":
			return {};

		default:
			return state;
	}
};

export const userRegisterReducer = (state = { userInfo: {} }, action) => {
	switch (action.type) {
		case "USER_REGISTER_REQUEST":
			return { loading: true };

		case "USER_REGISTER_SUCCESS":
			return {
				loading: false,
				userInfo: action.payload,
			};

		case "USER_REGISTER_FAIL":
			return { loading: false, error: action.payload };

		case "USER_LOGOUT":
			return {};

		default:
			return state;
	}
};

export const userAccountReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case "USER_ACCOUNT_REQUEST":
			return { ...state, loading: true };

		case "USER_ACCOUNT_SUCCESS":
			return {
				loading: false,
				success: true,
				user: action.payload,
			};

		case "USER_ACCOUNT_FAIL":
			return { loading: false, error: action.payload };

		case "USER_ACCOUNT_RESET":
			return { user: {} };

		default:
			return state;
	}
};

export const userUpdateAccountReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case "USER_UPDATE_ACCOUNT_REQUEST":
			return { loading: true };

		case "USER_UPDATE_ACCOUNT_SUCCESS":
			return {
				loading: false,
				success: true,
				user: action.payload,
			};

		case "USER_UPDATE_ACCOUNT_FAIL":
			return { loading: false, error: action.payload };

		case "USER_UPDATE_ACCOUNT_RESET":
			return {};

		default:
			return state;
	}
};

export const userDeleteReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case "USER_DELETE_REQUEST":
			return { loading: true };

		case "USER_DELETE_SUCCESS":
			return {
				loading: false,
				success: true,
				message: action.payload,
			};

		case "USER_DELETE_FAIL":
			return { loading: false, error: action.payload };

		case "USER_DELETE_RESET":
			return { users: [] };

		default:
			return state;
	}
};

export const userListReducer = (state = { users: [] }, action) => {
	switch (action.type) {
		case "USER_LIST_REQUEST":
			return { loading: true };

		case "USER_LIST_SUCCESS":
			return {
				loading: false,
				users: action.payload,
			};

		case "USER_LIST_FAIL":
			return { loading: false, error: action.payload };

		case "USER_LIST_RESET":
			return { users: [] };

		default:
			return state;
	}
};

export const addressReducer = (state = { addressList: [] }, action) => {
	switch (action.type) {
		case "ADDRESS_LIST_REQUEST":
			return { loadingList: true, addressList: state.addressList };

		case "ADDRESS_LIST_SUCCESS":
			return {
				loadingList: false,
				addressList: action.payload,
			};

		case "ADDRESS_LIST_FAIL":
			return { loadingList: false, errorList: action.payload };

		case "ADDRESS_CREATE_REQUEST":
			return { loadingCreate: true, addressList: state.addressList };

		case "ADDRESS_CREATE_SUCCESS":
			return {
				loadingCreate: false,
				addressList: [...state.addressList, action.payload],
			};

		case "ADDRESS_CREATE_FAIL":
			return { loadingCreate: false, errorCreate: action.payload };

		case "ADDRESS_UPDATE_REQUEST":
			return { loadingUpdate: true, addressList: state.addressList };

		case "ADDRESS_UPDATE_SUCCESS":
			return {
				loadingUpdate: false,
				addressList: [
					...state.addressList.filter(
						(addr) => addr.addressId !== action.payload.addressId
					),
					action.payload,
				],
			};

		case "ADDRESS_UPDATE_FAIL":
			return { loadingUpdate: false, errorUpdate: action.payload };

		case "ADDRESS_DELETE_REQUEST":
			return { loadingUpdate: true, addressList: state.addressList };

		case "ADDRESS_DELETE_SUCCESS":
			return {
				loadingUpdate: false,
				addressList: state.addressList.filter(
					(addr) => addr.addressId !== action.payload.addressId
				),
			};

		case "ADDRESS_DELETE_FAIL":
			return { loadingUpdate: false, errorUpdate: action.payload };

		case "ADDRESS_DEFAULT_REQUEST":
			return { loadingDefault: true, addressList: state.addressList };

		case "ADDRESS_DEFAULT_SUCCESS":
			return { loadingDefault: false, defaultAddress: action.payload };

		case "ADDRESS_DEFAULT_FAIL":
			return { loadingDefault: false, errorDefault: action.payload };

		default:
			return state;
	}
};

export const paymentMethodReducer = (state = { paymentMethod: [] }, action) => {
	switch (action.type) {
		case "SAVE_PAYMENT_METHOD_REQUEST":
			return { loading: true, paymentMethod: state.paymentMethod };

		case "SAVE_PAYMENT_METHOD_SUCCESS":
			return {
				loading: false,
				paymentMethod: action.payload,
			};

		case "SAVE_PAYMENT_METHOD_FAIL":
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const userNotificationsReducer = (
	state = { notifications: [] },
	action
) => {
	switch (action.type) {
		case "USER_GET_NOTIFICATIONS_REQUEST":
			return { loadingList: true, notifications: [] };

		case "USER_GET_NOTIFICATIONS_SUCCESS":
			return {
				loadingList: false,
				notifications: action.payload,
			};

		case "USER_GET_NOTIFICATIONS_FAIL":
			return { loadingList: false, errorList: action.payload };

		case "USER_UPDATE_NOTIFICATIONS_REQUEST":
			return { loadingUpdate: true, notifications: state.notifications };

		case "USER_UPDATE_NOTIFICATIONS_SUCCESS":
			return {
				loadingUpdate: false,
				notifications: state.notifications.filter(
					(n) => n.id !== action.payload
				),
			};

		case "USER_UPDATE_NOTIFICATIONS_FAIL":
			return { loadingUpdate: false, errorUpdate: action.payload };

		case "USER_DELETE_NOTIFICATIONS_REQUEST":
			return { loadingDelete: true, notifications: state.notifications };

		case "USER_DELETE_NOTIFICATIONS_SUCCESS":
			return {
				loadingDelete: false,
				notifications: [],
			};

		case "USER_DELETE_NOTIFICATIONS_FAIL":
			return { loadingDelete: false, errorDelete: action.payload };

		default:
			return state;
	}
};
