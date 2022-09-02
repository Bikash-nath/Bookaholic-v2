import axios from "axios"

export const createOrder = (order) => async (dispatch, getState) => {
   try {
      dispatch({
         type: "ORDER_CREATE_REQUEST",
      })

      const {
         userLogin: { userInfo },
      } = getState()

      const config = {
         headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
         },
      }

      const { data } = await axios.post("/api/orders/add/", order, config)

      dispatch({
         type: "ORDER_CREATE_SUCCESS",
         payload: data,
      })

      dispatch({
         type: "CART_CLEAR_ITEMS",
         payload: data,
      })

      localStorage.removeItem("cartItems")
   } catch (error) {
      dispatch({
         type: "ORDER_CREATE_FAIL",
         payload: error.response?.data.error_message ? error.response.data.error_message : error.message,
      })
   }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
   try {
      dispatch({
         type: "ORDER_DETAILS_REQUEST",
      })

      const {
         userLogin: { userInfo },
      } = getState()

      const config = {
         headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
         },
      }

      const { data } = await axios.get(`/api/orders/${id}/`, config)

      dispatch({
         type: "ORDER_DETAILS_SUCCESS",
         payload: data,
      })
   } catch (error) {
      dispatch({
         type: "ORDER_DETAILS_FAIL",
         payload: error.response?.data.error_message ? error.response.data.error_message : error.message,
      })
   }
}

export const payOrder = (id, paymentResult) => async (dispatch, getState) => {
   try {
      dispatch({
         type: "ORDER_PAY_REQUEST",
      })

      const {
         userLogin: { userInfo },
      } = getState()

      const config = {
         headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
         },
      }

      const { data } = await axios.put(`/api/orders/${id}/pay/`, paymentResult, config)

      dispatch({
         type: "ORDER_PAY_SUCCESS",
         payload: data,
      })
   } catch (error) {
      dispatch({
         type: "ORDER_PAY_FAIL",
         payload: error.response?.data.error_message ? error.response.data.error_message : error.message,
      })
   }
}

export const getOrderList = () => async (dispatch, getState) => {
   try {
      dispatch({
         type: "ORDER_LIST_REQUEST",
      })

      const {
         userLogin: { userInfo },
      } = getState()

      const config = {
         headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
         },
      }

      const { data } = await axios.get(`/api/orders/myorders/`, config)

      dispatch({
         type: "ORDER_LIST_SUCCESS",
         payload: data,
      })
   } catch (error) {
      dispatch({
         type: "ORDER_LIST_FAIL",
         payload: error.response?.data.error_message ? error.response.data.error_message : error.message,
      })
   }
}

export const cancelOrder = (orderId) => async (dispatch, getState) => {
   try {
      dispatch({
         type: "ORDER_CANCEL_REQUEST",
      })

      const {
         userLogin: { userInfo },
      } = getState()

      const config = {
         headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
         },
      }

      const { data } = await axios.delete(`/api/orders/cancel/${orderId}/`, config)

      dispatch({
         type: "ORDER_CANCEL_SUCCESS",
         payload: data.message,
      })
   } catch (error) {
      dispatch({
         type: "ORDER_CANCEL_FAIL",
         payload: error.response?.data.error_message ? error.response.data.error_message : error.message,
      })
   }
}

export const cancelOrderItem = (orderItemId) => async (dispatch, getState) => {
   try {
      dispatch({
         type: "ORDER_ITEM_CANCEL_REQUEST",
      })

      const {
         userLogin: { userInfo },
      } = getState()

      const config = {
         headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
         },
      }

      const { data } = await axios.delete(`/api/orders/cancelitem/${orderItemId}/`, config)

      dispatch({
         type: "ORDER_ITEM_CANCEL_SUCCESS",
         payload: data.message,
      })
   } catch (error) {
      dispatch({
         type: "ORDER_ITEM_CANCEL_FAIL",
         payload: error.response?.data.error_message ? error.response.data.error_message : error.message,
      })
   }
}
