import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
	Row,
	Col,
	Image,
	Button,
	ListGroup,
	Container,
	Card,
} from "react-bootstrap";

import {
	getOrderDetails,
	payOrder,
	cancelOrder,
} from "../actions/orderActions";
import { getUnreadNotifications } from "../actions/userAccountActions";
import { PayPalButton } from "react-paypal-button-v2";
import Message from "../components/Message";
import Loader from "../components/Loader";

function OrderScreen({ match }) {
	const orderId = match.params.id;

	const orderDetails = useSelector((state) => state.orderDetails);
	const { order, error, loading } = orderDetails;

	const orderPay = useSelector((state) => state.orderPay);
	const { loading: loadingPay, success: successPay } = orderPay;

	const orderCancel = useSelector((state) => state.orderCancel);
	const { success: successCancel, message } = orderCancel;

	if (!loading && !error) {
		order.itemsPrice = order.order_items
			.reduce((acc, item) => acc + item.qty * item.price, 0)
			.toFixed(2);
	}

	const dispatch = useDispatch();

	const [sdkReady, setSdkReady] = useState(false);

	useEffect(() => {
		if (!order || order.id !== Number(orderId) || successPay || successCancel) {
			dispatch({ type: "ORDER_PAY_RESET" });
			dispatch(getOrderDetails(orderId));
			dispatch(getUnreadNotifications());
			if (successCancel) dispatch(cancelOrder(orderId));
		} else if (!order.is_paid) {
			if (!window.paypal) {
				//if paypal script isn't present in page
				addPayPalScript();
			} else {
				setSdkReady(true);
			}
		}
	}, [order, orderId, successCancel, successPay, sdkReady, dispatch]);

	const successPaymentHandler = (paymentResult) => {
		dispatch(payOrder(orderId, paymentResult));
	};

	const cancelOrderHandler = () => {
		dispatch(cancelOrder(orderId));
	};

	const addPayPalScript = () => {
		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src = script.src =
			"https://www.paypal.com/sdk/js?client-id=AQjlDnVuDQUHVw7qhvoRtcM0cew-nX-U3A8lP7awQGiPL0RvjNXM09umYMfH7R8zp2hIXu5JjVZ7iK3m";
		script.async = true;
		script.onload = () => {
			setSdkReady(true);
		};
		document.body.appendChild(script);
	};

	return (
		<Container fluid className="pt-5">
			{loading || order === {} ? (
				<Loader />
			) : error ? (
				<Message variant="danger" margin="my-2">
					{error}
				</Message>
			) : message ? (
				<Message variant="info" margin="my-2">
					{message}
				</Message>
			) : (
				<div>
					<h1>Order No.- {order.id}</h1>
					<Row>
						<Col xs={12} md={8}>
							<ListGroup horizontal className="my-0">
								<ListGroup.Item
									xs={7}
									md={6}
									as={Col}
									className="pb-0 my-0"
									style={{ position: "relative" }}
								>
									<h4 style={{ display: "inline" }}>Shipping address{"  "}</h4>
									<Link to={"/login?redirect=shipping"} className="link">
										Change
									</Link>
									<ListGroup.Item className="my-0">
										<Row>{order.shipping_address.fullName}</Row>
										<Row>
											{order.shipping_address.building},{"  "}
											{order.shipping_address.area}
										</Row>
										<Row>
											{order.shipping_address.city},{"  "}
											{order.shipping_address.state}
										</Row>
										<Row>
											{order.shipping_address.pincode},{"  India"}
										</Row>
										<Row>Mobile no: {order.shipping_address.mobile_no}</Row>
									</ListGroup.Item>
									<ListGroup.Item className="p-0 m-0">
										{order.is_delivered ? (
											<Message variant="success" margin="my-0">
												<strong>
													Delivered on {order.delivered_at.substring(0, 10)} at{" "}
													{order.delivered_at.substring(11, 16)}
												</strong>
											</Message>
										) : (
											<Message variant="danger" margin="my-0">
												<strong>Not Delivered</strong>
											</Message>
										)}
									</ListGroup.Item>
								</ListGroup.Item>
								<ListGroup.Item
									xs={5}
									md={6}
									className="pb-0 my-0"
									style={{ position: "relative" }}
								>
									<Row>
										<Col>
											<h4 style={{ display: "inline" }}>Payment Method </h4>
											<Link to={"/login?redirect=payment"} className="link">
												<span>Change</span>
											</Link>
										</Col>
										<ListGroup.Item className="">
											<strong>{order.payment_method}</strong>
										</ListGroup.Item>
										<ListGroup.Item className="mt-5 pt-4 m-0 p-0">
											{order.is_paid ? (
												<Message variant="success" margin="my-0">
													<strong>
														Paid on {order.paid_at.substring(0, 10)} at{" "}
														{order.paid_at.substring(11, 16)}
													</strong>
												</Message>
											) : (
												<Message variant="danger" margin="my-0">
													<strong>Not Paid</strong>
												</Message>
											)}
										</ListGroup.Item>
									</Row>
								</ListGroup.Item>
							</ListGroup>

							<h4 style={{ marginTop: "1rem" }}>Order Items</h4>
							{order.order_items.length === 0 ? (
								<Message variant="info">Your Order items is empty.</Message>
							) : (
								<ListGroup as={Row} variant="flush" className="m-0">
									{order.order_items.map((item, index) => (
										<ListGroup.Item key={index} style={{ height: "100%" }}>
											<Row className="ml-3">
												<Col md={2}>
													<Col xs={12} md={9}>
														<Link to={`/book/${item.book}`}>
															<Image
																src={item.image}
																alt={item.title}
																className="book-sm-img"
																fluid
																rounded
															/>
														</Link>
													</Col>
												</Col>
												<Col md={5}>
													<Row className="mb-2">
														<Link to={`/book/${item.book}`} className="link">
															<h5>{item.title}</h5>
														</Link>
													</Row>
													<Row className="mb-2">
														<Col>
															by{" "}
															<Link
																to={`/author/${item.author}`}
																className="link"
															>
																{item.author_name}{" "}
															</Link>
														</Col>
													</Row>
													<Row className="mb-2">
														<Col>{item.format}</Col>
													</Row>
												</Col>
												<Col md={5}>
													<Row>
														<Col
															className="red"
															style={{ fontSize: "1.1rem" }}
															md="auto"
														>
															<strike className="grey">
																(₹
																{Math.round(
																	Number(item.price) +
																		(item.price * item.discount) /
																			(100 - item.discount)
																)}
																)
															</strike>
															{"  "}₹{item.price} X {item.qty} = ₹
															{item.qty * item.price}
														</Col>
													</Row>
													<Row className="green" style={{ fontSize: "1rem" }}>
														<Col xs={5}>
															You save: ₹
															{Math.round(
																item.qty *
																	((item.price * item.discount) /
																		(100 - item.discount))
															)}
														</Col>
														<Col>({item.discount}%)</Col>
													</Row>
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</Col>

						<Col xs={12} md={4}>
							<Card>
								<ListGroup variant="flush">
									<ListGroup.Item>
										<h2>Order Summary</h2>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Subtotal ({order.order_items.length} Items)</Col>
											<Col className="right">
												₹{order.total_price - order.shipping_price}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Savings</Col>
											<Col className="green right">
												{order.order_items.length > 0
													? `- ₹${order.total_savings}`
													: "--"}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Shipping</Col>
											<Col className="right">₹{order.shipping_price}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item className="mt-1 mb-1 red">
										<Row className="red" style={{ fontSize: "1.3rem" }}>
											<Col>Total</Col>
											<Col className="right">₹{order.total_price}</Col>
										</Row>
									</ListGroup.Item>
									{!order.is_paid && (
										<ListGroup.Item>
											{loadingPay && <Loader />}
											{!sdkReady ? (
												<Loader />
											) : (
												<PayPalButton
													amount={order.total_price}
													onSuccess={successPaymentHandler}
												/>
											)}
										</ListGroup.Item>
									)}
								</ListGroup>
							</Card>

							{!order.is_delivered && (
								<Row className="mt-2">
									<Col className="center">
										<Button
											onClick={() => cancelOrderHandler(order.id)}
											variant="danger"
											className="px-4"
											style={{ fontSize: "1.2rem" }}
										>
											<i className="fas fa-times-circle" /> Cancel Order
										</Button>
									</Col>
								</Row>
							)}
						</Col>
					</Row>
				</div>
			)}
		</Container>
	);
}
export default OrderScreen;
