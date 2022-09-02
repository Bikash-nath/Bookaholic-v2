import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { createAddress, updateAddress } from "../actions/userAccountActions";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";

import { getAddressList } from "../actions/userAccountActions";

function AddressEditScreen({ match, history }) {
	const addressId = Number(match.params.id);
	const { addressList } = useSelector((state) => state.address);
	const address = addressList.find((a) => a.id === addressId);

	const screenType = window.location.pathname.includes("/edit")
		? "addressEditScreen"
		: "addressListScreen";

	const dispatch = useDispatch();
	const path = window.history.pathname;

	useEffect(() => {
		if (!addressList.length) {
			dispatch(getAddressList());
		}
	}, [addressId, addressList, dispatch]);

	const [fullName, setFullName] = useState(address.full_name || "");
	const [mobileNo, setMobileNo] = useState(address.mobile_no || "");
	const [pincode, setPincode] = useState(address.pincode || "");
	const [building, setBuilding] = useState(address.building || "");
	const [area, setArea] = useState(address.area || "");
	const [landmark, setLandmark] = useState(address.landmark || "");
	const [city, setCity] = useState(address.city || "");
	const [state, setState] = useState(address.state || "");
	const [addressType, setAddressType] = useState(address.address_type || "");
	const [defaultAddress, setDefaultAddress] = useState(false);

	const submitHandler = (e) => {
		e.preventDefault();
		const newAddress = {
			addressId: address.addressId,
			fullName,
			mobileNo,
			pincode,
			building,
			area,
			landmark,
			city,
			state,
			addressType,
			setDefaultAddress,
		};

		screenType === "addressEditScreen"
			? dispatch(updateAddress(newAddress))
			: dispatch(createAddress(newAddress));

		path.includes("/shipping")
			? history.push("/payment")
			: history.push("/addresslist");
	};

	return (
		<FormContainer xs={12} md={10} lg={8}>
			<CheckoutSteps step1 step2 />
			<Row>
				<Col lg={8} className="mx-auto">
					{screenType === "addressEditScreen" ? (
						<h2 className="my-2">Edit Address</h2>
					) : (
						<h2 className="my-2">Add New Address</h2>
					)}
					<Form onSubmit={submitHandler}>
						<Form.Group className="mb-2" controlId="fullName">
							<Form.Label className="mb-0">Full Name</Form.Label>
							<Form.Control
								required
								type="text"
								placeholder="Enter Full Name"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
							/>
						</Form.Group>

						<Row className="mb-2">
							<Form.Group as={Col} xs={7}>
								<Form.Label className="mb-0">Mobile Number</Form.Label>
								{/*<InputGroup className="mb-2">*/}
								{/*<InputGroup.Text>+91</InputGroup.Text>*/}
								<Form.Control
									required
									placeholder="10-digit mobile number"
									id="mobileNo"
									value={mobileNo}
									onChange={(e) => setMobileNo(e.target.value)}
								/>
								{/*</InputGroup>*/}
							</Form.Group>

							<Form.Group as={Col}>
								<Form.Label className="mb-0">Pincode</Form.Label>
								<Form.Control
									required
									placeholder="6 digits (0-9) PIN code"
									value={pincode}
									onChange={(e) => setPincode(e.target.value)}
								/>
							</Form.Group>
						</Row>

						<Form.Group className="mb-2" controlId="building">
							<Form.Label className="mb-0">
								Flat, House no., Building, Company
							</Form.Label>
							<Form.Control
								required
								type="text"
								placeholder=""
								value={building}
								onChange={(e) => setBuilding(e.target.value)}
							/>
						</Form.Group>

						<Form.Group className="mb-2" controlId="area">
							<Form.Label className="mb-0">Area, Street, Village</Form.Label>
							<Form.Control
								required
								type="text"
								placeholder=""
								value={area}
								onChange={(e) => setArea(e.target.value)}
							/>
						</Form.Group>

						<Form.Group className="mb-2" controlId="Landmark">
							<Form.Label className="mb-0">Landmark</Form.Label>
							<Form.Control
								required
								type="text"
								placeholder="E.g. Near Salbagan market"
								value={landmark}
								onChange={(e) => setLandmark(e.target.value)}
							/>
						</Form.Group>

						<Row className="mb-2">
							<Form.Group as={Col}>
								<Form.Label className="mb-0">City/Town</Form.Label>
								<Form.Control
									required
									type="text"
									placeholder=""
									value={city}
									onChange={(e) => setCity(e.target.value)}
								/>
							</Form.Group>

							<Form.Group as={Col} className="mt-4">
								<Form.Label className="mr-5">State </Form.Label>
								<Form.Control
									as="select"
									className="mx-2"
									id="stateSelect"
									value={state}
									placeholder="Select one state"
									custom
									onChange={(e) => {
										setState(e.target.value);
									}}
								>
									<option>Select a state</option>
									{[
										"Andhra Pradesh",
										"Arunachal pradesh",
										"Assam",
										"Bihar",
										"Chhattisgarh",
										"Goa",
										"Gujarat",
										"Haryana",
										"Himachal Pradesh",
										"Jharkhand",
										"Karnataka",
										"Kerala",
										"Madhya Pradesh",
										"Maharashtra",
										"Manipur",
										"Meghalaya",
										"Mizoram",
										"Nagaland",
										"Odisha",
										"Punjab",
										"Rajasthan",
										"Sikkim",
										"Tamil Nadu",
										"Telangana",
										"Tripura",
										"Uttar Pradesh",
										"Uttarakhand",
										"West bengal",
									].map((st) => (
										<option value={st} key={st}>
											{st}
										</option>
									))}
								</Form.Control>
							</Form.Group>
						</Row>

						<Form.Group className="mb-3">
							<Form.Label className="mt-2">Address Type </Form.Label>
							<Form.Control
								as="select"
								className="mx-2"
								value={addressType}
								placeholder="Select address type"
								id="addressTypeSelect"
								required
								custom
								onChange={() => {
									setAddressType(addressType);
								}}
							>
								<option>Select Address Type</option>
								<option value="Home">Home (7 am- 10 pm delivey)</option>
								<option value="Work">Work (10 am- 6 pm delivey) </option>
							</Form.Control>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Control
								type="checkbox"
								className="mx-2"
								value={defaultAddress}
								id="defaultAddress"
								onChange={() => {
									setDefaultAddress(true);
								}}
							>
								<Form.Label className="mt-2">Set as Default Address</Form.Label>
							</Form.Control>
						</Form.Group>

						<Form.Group>
							<Col>
								<Button type="submit" variant="primary">
									Save Address
								</Button>
							</Col>
						</Form.Group>
					</Form>
				</Col>
			</Row>
		</FormContainer>
	);
}

export default AddressEditScreen;
