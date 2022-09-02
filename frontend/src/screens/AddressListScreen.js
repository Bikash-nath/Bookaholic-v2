import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Row,
	Col,
	ListGroup,
	Button,
	Card,
	Container,
	Tooltip,
	Modal,
	OverlayTrigger,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import {
	getAddressList,
	deleteAddress,
	makeDefaultAddress,
} from "../actions/userAccountActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

function AddressListScreen({ match, location, history }) {
	const [deleteAddressModal, setDeleteAddressModal] = useState(false);

	const dispatch = useDispatch();

	const {
		addressList,
		loadingList,
		loadingCreate,
		loadingUpdate,
		loadingDefault,
		defaultAddress,
		errorList,
		errorCreate,
		errorUpdate,
		errorDefault,
	} = useSelector((state) => state.address);

	useEffect(() => {
		dispatch(getAddressList());
	}, [defaultAddress, dispatch]);

	const path = window.location.hash;

	const addressEditHandler = (addressId) => {
		path.includes("/shipping")
			? history.push(`/shipping/address/edit/${addressId}`)
			: history.push(`/address/edit/${addressId}`);
	};

	const addressAddHandler = () => {
		path.includes("/shipping")
			? history.push("/shipping/address/add")
			: history.push("/address/add");
	};

	const deleteTooltip = (props) => (
		<Tooltip id="delete-tooltip" {...props}>
			Delete this Address
		</Tooltip>
	);

	return (
		<Container fluid className="pt-5">
			<h2>Your Addresses</h2>
			{loadingList ||
			loadingCreate ||
			loadingUpdate ||
			loadingDefault ||
			!addressList ? (
				<Loader />
			) : errorList || errorCreate || errorUpdate || errorDefault ? (
				<div>
					{errorList ||
						errorCreate ||
						errorUpdate ||
						(errorDefault && (
							<Message variant="danger">
								{errorList || errorCreate || errorUpdate || errorDefault}
							</Message>
						))}
				</div>
			) : addressList.length === 0 ? (
				<Message variant="info">
					You do not have any address
					<Link to="/" className="btn btn-light my-1 link">
						Go Back
					</Link>
				</Message>
			) : (
				<Row>
					<ListGroup>
						<Row>
							{addressList?.map((address) => (
								<>
									{/*key={address.id}*/}
									<Col xl={4} md={6}>
										<Card className="m-1">
											<ListGroup.Item className="my-0">
												<Row>{address.fullName}</Row>
												<Row>
													{address.building},{"  "}
													{address.area}
												</Row>
												<Row>
													{address.city},{"  "}
													{address.state}
												</Row>
												<Row>
													{address.pincode},{"  India"}
												</Row>
												<Row>Mobile no: {address.mobile_no}</Row>

												<Row className="my-1 mx-0">
													<Col className="my-1 mx-0">
														<Button
															onClick={() => addressEditHandler(address.id)}
															variant="info"
														>
															{path.includes("/shipping")
																? "Continue"
																: "Edit Address"}
														</Button>
													</Col>
													<Col className="my-1 mx-0">
														<OverlayTrigger
															placement="bottom"
															overlay={deleteTooltip}
														>
															<Button
																onClick={() => {
																	console.log("Address Delete:", address.id);
																	deleteAddress(address.id);
																}}
																variant="danger"
															>
																Delete Address
															</Button>
														</OverlayTrigger>
													</Col>
												</Row>
												<Row className="my-1 mx-0">
													<Col>
														{!address.default && (
															<Button
																onClick={() => {
																	console.log("Default Delete:", address.id);
																	makeDefaultAddress(address.id);
																}}
																variant="secondary"
															>
																Make Default Address
															</Button>
														)}
													</Col>
												</Row>
											</ListGroup.Item>
										</Card>
									</Col>

									<Modal
										show={deleteAddressModal === address.id}
										onHide={() => setDeleteAddressModal(false)}
									>
										<Modal.Header closeButton>
											<Modal.Title>Delete Address</Modal.Title>
										</Modal.Header>
										<Modal.Body>Do you want to delete this address?</Modal.Body>
										<Modal.Footer>
											<Button
												variant="secondary"
												onClick={() => setDeleteAddressModal(false)}
											>
												Close
											</Button>
											<Button
												variant="danger"
												onClick={() => deleteAddress(address.id)}
											>
												<strong>Delete</strong>
											</Button>
										</Modal.Footer>
									</Modal>
								</>
							))}
						</Row>
					</ListGroup>
				</Row>
			)}

			<Button
				onClick={() => addressAddHandler()}
				variant="primary"
				className="mt-3 px-4"
			>
				<strong>Add New Address</strong>
			</Button>
		</Container>
	);
}

export default AddressListScreen;
