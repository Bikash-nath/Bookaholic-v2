import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Button } from "react-bootstrap";

import { savePaymentMethod } from "../actions/userAccountActions";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";

function PaymentScreen({ location, history }) {
	const cart = useSelector((state) => state.cart);
	const { shippingAddress } = cart;

	if (!shippingAddress.city) history.push("/shipping");

	const [paymentMethod, setPaymentMethod] = useState("PayPal");

	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(savePaymentMethod(paymentMethod));
		history.push("/placeorder");
	};

	return (
		<FormContainer xs={12} md={10} lg={8} className="mt-2">
			<CheckoutSteps step1 step2 step3 />
			<Row>
				<Col lg={8} fluid className="mx-auto">
					<h2 className="my-3">Payment Screen</h2>

					<Form onSubmit={submitHandler}>
						<Form.Group className="mb-3">
							<Form.Label as="legend">Select Method</Form.Label>
							<Form.Check
								type="radio"
								label="PayPal or Credit Card"
								id="paypal"
								name="PayPal"
								checked={paymentMethod === "PayPal"}
								onChange={() => setPaymentMethod("PayPal")}
							/>
							<Form.Check
								type="radio"
								label="Pay on Delievey"
								id="payOnDelivery"
								checked={paymentMethod === "Pay on delivery"}
								onChange={() => setPaymentMethod("Pay on delivery")}
							/>
						</Form.Group>
						<Form.Group as={Row} className="mb-3">
							<Col>
								<Button type="submit" variant="primary">
									Continue
								</Button>
							</Col>
						</Form.Group>
					</Form>
				</Col>
			</Row>
		</FormContainer>
	);
}
export default PaymentScreen;
