import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	Row,
	Col,
	Image,
	ListGroup,
	Form,
	Button,
	Card,
	Container,
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";

import {
	getCartItems,
	addToCart,
	removeFromCart,
	addToWishList,
} from "../actions/userDetailActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

function CartScreen({ match, location, history }) {
	const bookId = match.params.id;
	const qty = location.search
		? Number(location.search.split("=")[1].split("&")[0])
		: "";
	const sellerId = location.search ? Number(location.search.split("=")[2]) : "";
	const dispatch = useDispatch();

	const cart = useSelector((state) => state.cart);
	const {
		cartItems,
		message,
		loadingList,
		loadingAdd,
		loadingRemove,
		errorList,
		errorAdd,
		errorRemove,
	} = cart;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const login = userInfo ? true : false;

	useEffect(() => {
		if (bookId) {
			dispatch(addToCart(bookId, sellerId, qty, "book"));
		} else if (userInfo) {
			dispatch(getCartItems());
		}
	}, [bookId, qty, sellerId, userInfo, dispatch]);

	const removeFromCartHandler = (id) => {
		dispatch(removeFromCart(id));
	};

	const deleteAllCartHandler = (totalItems) => {
		cartItems.forEach((item) => {
			dispatch(removeFromCart(item.book.id));
		});
		dispatch({ type: "CART_CLEAR_ITEMS" });
		localStorage.removeItem("cartItems");
	};

	const moveToWishListHandler = (id) => {
		dispatch(removeFromCart(id));
		dispatch(addToWishList(id));
	};

	const moveAllToWishListHandler = (totalItems) => {
		cartItems.forEach((item) => {
			dispatch(addToWishList(item.book.id, totalItems));
			dispatch(removeFromCart(item.book.id));
		});
		dispatch({ type: "CART_CLEAR_ITEMS" });
		localStorage.removeItem("cartItems");
	};

	const checkOutHandler = () => {
		history.push("/login?redirect=shipping/addresslist");
	};

	if (cartItems?.length > 0) {
		cart.itemsPrice = Math.round(
			cartItems?.reduce(
				(acc, item) => acc + item.quantity * Number(item.book.sellerbook.price),
				0
			)
		);
		cart.savings =
			Math.round(
				cartItems?.reduce(
					(acc, item) => acc + item.quantity * Number(item.book.orignal_price),
					0
				)
			) - cart.itemsPrice;

		cart.shippingPrice = Math.round(
			cart.itemsPrice >= 500 || cartItems.length === 0 ? 0 : 50
		);
		cart.totalPrice = Math.round(
			Number(cart.itemsPrice) + Number(cart.shippingPrice)
		);
	} else if (cartItems) {
		cart.itemsPrice = 0;
		cart.savings = 0;
		cart.shippingPrice = 0;
		cart.totalPrice = 0;
	}

	const deleteTooltip = (props) => (
		<Tooltip id="delete-tooltip" {...props}>
			Delete this item from Cart
		</Tooltip>
	);

	const wishListTooltip = (props) => (
		<Tooltip id="wishList-tooltip" {...props}>
			{login ? "Move this item to Wish-list" : "Please Login to continue"}
		</Tooltip>
	);

	return (
		<Container fluid className="pt-5">
			<Row className="my-2">
				<h2>Shopping Cart</h2>
				{loadingList || loadingAdd || loadingRemove ? (
					<Loader />
				) : errorList || errorAdd || errorRemove ? (
					<Message variant="danger">
						{errorList || errorAdd || errorRemove}
					</Message>
				) : (
					<>
						<Col xs={12} md={8}>
							{cartItems.length === 0 ? (
								<Message variant="info">
									Your Cart is empty{"\t\n"}
									<Link to="/" className="btn btn-light my-1 link">
										Go Back
									</Link>
								</Message>
							) : (
								<ListGroup variant="flush">
									{message && <Message variant="info">{message}</Message>}
									<ListGroup.Item>
										<Row>
											<Col>
												<Button
													className="btn-block"
													variant="info"
													disabled={cartItems.length === 0 || login === false}
													onClick={() =>
														moveAllToWishListHandler(cartItems.length)
													}
												>
													Move All items to Wishlist
												</Button>
												<Button
													className="btn-block float-right"
													variant="danger"
													disabled={cartItems.length === 0}
													onClick={() => deleteAllCartHandler(cartItems.length)}
												>
													Delete all items
												</Button>
											</Col>
										</Row>
									</ListGroup.Item>

									{cartItems.map((item) => (
										<ListGroup.Item key={item.id} className="py-2">
											<Row>
												<Col xs={4} lg={3} className="my-1">
													<Col xl={7}>
														<Link to={`/book/${item.book.id}`}>
															<Image
																src={item.book.image}
																alt={item.book.title}
																style={{ maxHeight: "12rem" }}
																fluid
																rounded
															/>
														</Link>
													</Col>
												</Col>
												<Col xs={8} lg="auto">
													<Row className="my-1">
														<Link to={`/book/${item.book.id}`} className="link">
															<h5>{item.book.title}</h5>
														</Link>
													</Row>
													<Row className="mb-1">
														<Col>
															by{" "}
															<Link
																to={`/author/${item.book.author.id}`}
																className="link"
															>
																{item.book.author.name}
															</Link>
														</Col>
													</Row>
													<Row className="mb-1">
														<Col>{item.book.format}</Col>
													</Row>
													<Row>
														<Col xs="auto">
															{item.book.sellerbook.count_in_stock > 50 ? (
																<Row className="green">
																	<strong>In Stock</strong>
																</Row>
															) : item.book.sellerbook.count_in_stock > 7 ? (
																<Row style={{ color: "orange" }}>
																	<strong>Only a few left</strong>
																</Row>
															) : item.book.sellerbook.count_in_stock === 0 ? (
																<Row className="red">
																	<strong style={{ fontSize: "1rem" }}>
																		Out of stock
																	</strong>
																</Row>
															) : (
																<Row className="red">
																	<strong style={{ fontSize: "1rem" }}>
																		Only {item.book.sellerbook.count_in_stock}{" "}
																		left in stock
																	</strong>
																</Row>
															)}
														</Col>
													</Row>

													<Row className="mb-1">
														<Col
															className="red"
															xs="auto"
															style={{ fontSize: "1.3rem" }}
														>
															₹{item.book.sellerbook.price}
														</Col>
														<Col className="grey" xs="auto">
															<strike>₹{item.book.orignal_price}</strike>
														</Col>
														<Col className="green" xs="auto">
															{item.book.sellerbook.discount}% off
														</Col>
													</Row>
													<ListGroup horizontal className="mt-1 p-0 border-0">
														<ListGroup.Item className="mx-0 p-0 border-0">
															Qty:{" "}
															<Form.Control
																as="select"
																value={item.quantity}
																className="m-1 select-menu"
																custom
																onChange={(e) => {
																	dispatch(
																		addToCart(
																			item.book.id,
																			item.seller,
																			Number(e.target.value)
																		)
																	);
																}}
															>
																{[
																	...Array(
																		item.book.sellerbook.count_in_stock > 5
																			? 5
																			: item.book.sellerbook.count_in_stock
																	).keys(),
																].map((x) => (
																	<option key={x + 1} value={x + 1}>
																		{x + 1}
																	</option>
																))}
															</Form.Control>
														</ListGroup.Item>
														<ListGroup.Item className="py-0 border-0">
															<OverlayTrigger
																placement="bottom"
																overlay={wishListTooltip}
															>
																<Button
																	variant="warning"
																	className="px-3 py-1"
																	disabled={login === false}
																	onClick={() =>
																		moveToWishListHandler(item.book.id)
																	}
																>
																	<i
																		variant="danger"
																		className="fas fa-heart fa-lg"
																	/>
																</Button>
															</OverlayTrigger>
														</ListGroup.Item>
														<ListGroup.Item className="py-0 border-0">
															<OverlayTrigger
																placement="bottom"
																overlay={deleteTooltip}
															>
																<Button
																	variant="danger"
																	className="px-3 py-1"
																	onClick={() =>
																		removeFromCartHandler(item.book.id, login)
																	}
																>
																	<i className="fas fa-trash fa-lg" />
																</Button>
															</OverlayTrigger>
														</ListGroup.Item>
													</ListGroup>
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</Col>
						<Col md={4} className="mt-2">
							<Card>
								<ListGroup variant="flush">
									<ListGroup.Item className="py-0">
										<h3>Cart Summary</h3>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>
												Subtotal{" "}
												{cartItems.length > 0
													? cartItems?.reduce(
															(acc, item) => acc + item.quantity,
															0
													  )
													: "0"}{" "}
												items
											</Col>
											<Col className="right">₹{cart.itemsPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Savings:</Col>
											<Col className="green right">
												{cartItems.length > 0 ? `- ₹${cart.savings}` : "--"}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Shipping:</Col>
											<Col className="right">₹{cart.shippingPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row
											className="mt-1 mb-1 red"
											style={{ fontSize: "1.3rem" }}
										>
											<Col>Total:</Col>
											<Col className="right">₹{cart.totalPrice}</Col>
										</Row>
									</ListGroup.Item>

									<ListGroup.Item>
										<Button
											className="btn-block"
											disabled={cartItems.length === 0}
											onClick={checkOutHandler}
										>
											Proceed To CheckOut
										</Button>
									</ListGroup.Item>
								</ListGroup>
							</Card>
							<Card className="mt-3">
								<ListGroup>
									{cart.itemsPrice >= 500 ? (
										<ListGroup.Item variant="success">
											Your order is eligible for Free delivery
										</ListGroup.Item>
									) : (
										<ListGroup.Item variant="info">
											Add items worth ₹{500 - cart.itemsPrice} for Free delivery
										</ListGroup.Item>
									)}
								</ListGroup>
							</Card>
						</Col>
					</>
				)}
			</Row>
		</Container>
	);
}
export default CartScreen;
