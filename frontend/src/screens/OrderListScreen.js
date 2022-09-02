import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	Row,
	Col,
	Container,
	ListGroup,
	Form,
	Button,
	Image,
	Modal,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import {
	getOrderList,
	cancelOrderItem,
	cancelOrder,
} from "../actions/orderActions";
import { getUnreadNotifications } from "../actions/userAccountActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

function OrderListScreen({ history }) {
	const [cancelOrderModal, setCancelOrderModal] = useState(false);
	const [trackOrderModal, setTrackOrderModal] = useState(false);

	const orderList = useSelector((state) => state.orderList);
	const { orders, loading: loadingOrders, error: errorOrders } = orderList; //destructure w/ diff. name

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const orderItemCancel = useSelector((state) => state.orderItemCancel);
	const { success } = orderItemCancel;

	const orderCancel = useSelector((state) => state.orderCancel);
	const { success: successOrder } = orderCancel;

	const dispatch = useDispatch();

	useEffect(() => {
		if (!userInfo) {
			history.push("/login");
		}
		//user is logged in.
		else {
			dispatch(getOrderList());
			dispatch(getUnreadNotifications());
		}
	}, [success, successOrder, userInfo, history, dispatch]);

	const cancelOrderItemHandler = (orderItemId) => {
		dispatch(cancelOrderItem(orderItemId));
	};

	const cancelOrderHandler = (orderId) => {
		// setCancelOrderModal(true);
		dispatch(cancelOrder(orderId));
		setCancelOrderModal(false);
	};

	return (
		<Container fluid className="pt-5">
			<h2>My Orders</h2>
			{loadingOrders ? (
				<Loader />
			) : errorOrders || !orders ? (
				<Message variant="danger">{errorOrders}</Message>
			) : orders?.length === 0 ? (
				<Message variant="info">Your order list is empty.</Message>
			) : (
				<Container>
					{orders.map((order) => (
						<ListGroup key={order.id} as={Col} xs={12} md={11} className="mb-4">
							<ListGroup.Item variant="dark" className="py-1">
								<Row>
									<Col md={3}>
										<Row>
											<strong className="center">Name</strong>
										</Row>
										<Row className="center">{order.address.full_name}</Row>
									</Col>
									<Col md={3}>
										<Row>
											<strong className="center">Order Placed</strong>
										</Row>
										<Row className="center">
											{order.ordered_at?.substring(0, 10)}
										</Row>
									</Col>

									<Col md={2}>
										<Row>
											<strong className="center">Total</strong>
										</Row>
										<Row className="center">{order.total_price}</Row>
									</Col>

									<Col md={2} className="center py-2">
										<Button
											variant="success"
											disabled={!order.is_paid}
											className="btn-sm px-3 "
											onClick={() => setTrackOrderModal(true)}
										>
											<i className="fas fa-map-marker-alt" />
											<strong> Track</strong>
										</Button>
									</Col>
									<Col md={2} className="py-2">
										<LinkContainer to={`/order/${order.id}`}>
											<Button className="btn-sm">
												<i className="fas fa-info-circle" />
												<strong> Order Details</strong>
											</Button>
										</LinkContainer>
									</Col>
								</Row>
							</ListGroup.Item>

							<Modal
								show={cancelOrderModal === order.id}
								onHide={() => setCancelOrderModal(false)}
							>
								<Modal.Header closeButton>
									<Modal.Title>Cancel order</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									Do you want to cancel last item in this order
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="secondary"
										onClick={() => setCancelOrderModal(false)}
									>
										Close
									</Button>
									<Button
										variant="danger"
										onClick={() => cancelOrderHandler(order.id)}
									>
										<strong>Cancel order</strong>
									</Button>
								</Modal.Footer>
							</Modal>

							<Modal
								show={trackOrderModal === order.id}
								onHide={() => setTrackOrderModal(false)}
								centered
							>
								<Modal.Header closeButton>
									<Modal.Title className="my-0">
										<strong>
											{order.is_delivered
												? "Delivered successfully"
												: order.is_paid
												? `Expected Delivery on ${order.arriving_at?.substring(
														0,
														10
												  )}`
												: "Payment not completed"}
										</strong>
									</Modal.Title>
								</Modal.Header>
								{order.is_paid && (
									<Modal.Body>
										<Row className="mb-2 mx-1">
											<Form.Check
												type="checkbox"
												defaultChecked
												label={`Ordered on ${order.ordered_at?.substring(
													0,
													10
												)} at ${order.ordered_at?.substring(11, 16)}`}
												id="ordered"
											/>
										</Row>
										{order.is_dispatched && (
											<Row className="mb-2 mx-1">
												<Form.Check
													type="checkbox"
													checked={order.is_dispatched}
													label={`Dispatched on ${order.dispatched_at?.substring(
														0,
														10
													)} at ${order.dispatched_at?.substring(11, 16)}`}
													id="dispatched"
												/>
											</Row>
										)}
										{order.is_shipped && (
											<Row className="mb-2 mx-1">
												<Form.Check
													type="checkbox"
													checked={order.is_shipped}
													label={`Shipped on ${order.shipped_at?.substring(
														0,
														10
													)} at ${order.shipped_at?.substring(11, 16)}`}
													id="shipped"
												/>
											</Row>
										)}
										{order.is_delivered && (
											<Row className="mb-2 mx-1">
												<Form.Check
													type="checkbox"
													checked={order.is_delivered}
													label={`Delivered on ${order.delivered_at?.substring(
														0,
														10
													)} at ${order.delivered_at?.substring(11, 16)}`}
													id="delivered"
												/>
											</Row>
										)}
									</Modal.Body>
								)}
								<Modal.Footer>
									<Button
										variant="secondary"
										className="my-0"
										onClick={() => setTrackOrderModal(false)}
									>
										Close
									</Button>
								</Modal.Footer>
							</Modal>

							{order.order_items.map((item) => (
								<ListGroup.Item className="py-1" key={item.id}>
									<Row>
										<Col md={1}>
											<Link to={`/book/${item.book}`}>
												<Image
													className=""
													src={item.image}
													alt={item.title}
													fluid
													rounded
												/>
											</Link>
										</Col>
										<Col md={5} className="ml-2">
											<Row className="mb-2">
												<Link to={`/books/${item.book}`} className="link">
													<h5>{item.title}</h5>
												</Link>
											</Row>
											<Row className="mb-2">
												<Col>
													by{" "}
													<Link to={`/author/${item.author}`} className="link">
														{item.author_name}{" "}
													</Link>
												</Col>
											</Row>
											<Row className="mb-2">
												<Col>{item.format}</Col>
											</Row>
										</Col>
										<Col md={3}>
											<Row>
												<Col
													className="green"
													style={{ fontSize: "1rem" }}
													md="auto"
												>
													<strong>
														₹{item.price} X {item.qty} = ₹
														{item.qty * item.price}
													</strong>
												</Col>
											</Row>
										</Col>

										<Col md={3}>
											{order.is_cancelled ? (
												<Row className="red">
													<strong>
														<i className="fas fa-dot-circle" /> Cancelled
													</strong>
												</Row>
											) : !order.is_paid ? (
												<Row>
													<strong
														className="red my-1 mx-auto"
														style={{ fontSize: "1rem" }}
													>
														<Col lg={{ offset: 1 }}>
															<i className="fas fa-dot-circle" /> Pending (Not
															Paid)
														</Col>
													</strong>
												</Row>
											) : order.is_delivered ? (
												<div>
													<Row className="center green mb-1">
														<strong>
															<i className="fas fa-dot-circle" /> Delivered on{" "}
															{order.delivered_at?.substring(0, 10)}
														</strong>
													</Row>
													<Row>
														<Col className="center" md={{ span: 12 }}>
															<LinkContainer to={`/book/${item.book}`}>
																<Button
																	variant="info"
																	className="btn-sm mb-1 px-2"
																>
																	Rate & Review Book
																</Button>
															</LinkContainer>
														</Col>
													</Row>
													<Row>
														<Col className="center" md={{ span: 12 }}>
															<LinkContainer to={`/book/${item.book}`}>
																<Button
																	variant="warning"
																	className="btn-sm px-4"
																>
																	Buy Again
																</Button>
															</LinkContainer>
														</Col>
													</Row>
												</div>
											) : order.is_shipped ? (
												<Row className="my-1">
													<strong className="order-info">
														<i className="fas fa-dot-circle" /> Shipped on{" "}
														{order.shipped_at?.substring(0, 10)}
													</strong>
												</Row>
											) : (
												order.is_dispatched && (
													<Row className="my-1">
														<strong className="order-info">
															<i className="fas fa-dot-circle" /> Dispatched on{" "}
															{order.dispatched_at?.substring(0, 10)}
														</strong>
													</Row>
												)
											)}
											{!order.is_delivered && !order.is_cancelled && (
												<Row>
													<Col md={{ span: 12 }} className="center">
														<Button
															onClick={() => {
																order.order_items.length === 1
																	? setCancelOrderModal(order.id)
																	: cancelOrderItemHandler(item.id);
															}}
															variant="danger"
															className="btn-sm px-3"
														>
															<i className="fas fa-times" />
															<strong> Cancel Item</strong>
														</Button>
													</Col>
												</Row>
											)}
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					))}
				</Container>
			)}
		</Container>
	);
}
export default OrderListScreen;
