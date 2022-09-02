import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
	Row,
	Col,
	Container,
	Image,
	ListGroup,
	Button,
	Card,
} from "react-bootstrap";

import { createOrder } from "../actions/orderActions";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";

function PlaceOrderScreen({ history }) {
	const orderCreate = useSelector((state) => state.orderCreate);
	const { order, error, success } = orderCreate;

	const cart = useSelector((state) => state.cart);

	if (!cart.paymentMethod) {
		// redirect to Payment Screen to set paymentMethod when this page is reloaded
		history.push("/payment");
	}
	const dispatch = useDispatch();

	useEffect(() => {
		if (success) {
			history.push(`/order/${order.id}`);
			dispatch({ type: "ORDER_CREATE_RESET" });
		}
	}, [success, history, order, dispatch]);

	const placeOrder = () => {
		dispatch(
			createOrder({
				orderItems: cart.cartItems,
				shippingAddress: cart.shippingAddress,
				paymentMethod: cart.paymentMethod,
				itemsPrice: cart.itemsPrice,
				savings: cart.savings,
				shippingPrice: cart.shippingPrice,
				totalPrice: cart.totalPrice,
			})
		);
	};

	cart.itemsPrice = Math.round(
		cart.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
	);
	cart.savings =
		Math.round(
			cart.cartItems.reduce(
				(acc, item) => acc + item.qty * item.orignalPrice,
				0
			)
		) - cart.itemsPrice;
	cart.shippingPrice = Math.round(
		cart.itemsPrice >= 500 || cart.cartItems.length === 0 ? 0 : 50
	);
	cart.totalPrice = Math.round(
		Number(cart.itemsPrice) + Number(cart.shippingPrice)
	);

	// style={{ marginLeft: "0.8rem" }}

	return (
		<Container fluid className="mt-2">
			<CheckoutSteps step1 step2 step3 step4 />
			<h2 className="mt-2">Place Order</h2>
			<Row>
				<Col md={8}>
					<ListGroup horizontal>
						<ListGroup.Item as={Col} md={6}>
							<h4 style={{ display: "inline" }}>Shipping address{"  "}</h4>
							<Link to={"/login?redirect=shipping"} className="link">
								Change
							</Link>
							<ListGroup.Item>
								<Row>{cart.shippingAddress.fullName}</Row>
								<Row>
									{cart.shippingAddress.building},{"  "}
									{cart.shippingAddress.area}
								</Row>
								<Row>
									{cart.shippingAddress.city},{"  "}
									{cart.shippingAddress.state}
								</Row>
								<Row>
									{cart.shippingAddress.pincode},{"  India"}
								</Row>
								<Row>Mobile no: {cart.shippingAddress.mobileNo}</Row>
							</ListGroup.Item>
						</ListGroup.Item>
						<ListGroup.Item as={Col}>
							<h4 style={{ display: "inline" }}>Payment Method{"  "}</h4>
							<Link to={"/login?redirect=payment"} className="link">
								Change
							</Link>
							<Row className="p-2">
								<strong>{cart.paymentMethod}</strong>
							</Row>
						</ListGroup.Item>
					</ListGroup>

					<h4 style={{ marginTop: "1rem" }}>Order Items</h4>
					{cart.cartItems.length === 0 ? (
						<Message variant="info">Your cart is empty</Message>
					) : (
						<ListGroup as={Row} variant="flush" className="m-0">
							{cart.cartItems.map((item, index) => (
								<ListGroup.Item key={index}>
									<Row>
										<Col md={2}>
											<Link to={`/book/${item.bookId}`}>
												<Image
													src={item.image}
													alt={item.title}
													style={{
														maxHeight: "8rem",
													}}
													className="book-sm-img"
													fluid
													rounded
												/>
											</Link>
										</Col>
										<Col md={5}>
											<Row className="mb-2">
												<Link to={`/books/${item.bookId}`} className="link">
													<h6>{item.title}</h6>
												</Link>
											</Row>
											<Row className="mb-2 mx-1">by {item.authorName}</Row>
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
														(₹{item.orignalPrice})
													</strike>
													{"  "}₹{item.price} X {item.qty} = ₹
													{item.qty * item.price}
												</Col>
											</Row>
											<Row className="green" style={{ fontSize: "1rem" }}>
												<Col xs={5} className="mx-0">
													You save: ₹
													{Math.round(
														item.qty * (item.orignalPrice - item.price)
													)}
												</Col>
												<Col xs={3} className="mx-0">
													({item.discount}%)
												</Col>
											</Row>
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</Col>

				<Col md={4}>
					<Card>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>
										Subtotal (
										{cart.cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
										items)
									</Col>
									<Col className="right">₹{cart.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Savings</Col>
									<Col className="green right">
										{cart.cartItems.length > 0 ? `- ₹${cart.savings}` : "--"}
									</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col className="right">₹{cart.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row className="red" style={{ fontSize: "1.2rem" }}>
									<Col>Total</Col>
									<Col className="right">₹{cart.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							{error && (
								<ListGroup.Item>
									<Message variant="danger">{error}</Message>
								</ListGroup.Item>
							)}
							<ListGroup.Item>
								<Row>
									<Button
										className="btn-block"
										disabled={cart.cartItems.length === 0}
										onClick={placeOrder}
									>
										<strong>Place Order</strong>
									</Button>
								</Row>
							</ListGroup.Item>
						</ListGroup>
					</Card>
					<Card className="mt-3">
						<ListGroup>
							{cart.totalPrice >= 500 ? (
								<ListGroup.Item variant="success">
									Promotiion applied: Free delivery on items over 500
								</ListGroup.Item>
							) : (
								<ListGroup.Item variant="info">
									Add items worth ₹{500 - cart.totalPrice} for Free delivery
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
export default PlaceOrderScreen;
