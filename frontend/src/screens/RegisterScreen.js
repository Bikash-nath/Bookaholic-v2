import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";

import {
	register,
	getUserAccount,
	getUnreadNotifications,
} from "../actions/userAccountActions";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Title from "../components/Title";

function RegisterScreen({ location, history }) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");

	const dispatch = useDispatch();
	const userRegister = useSelector((state) => state.userRegister);
	const { userInfo, loading, error } = userRegister;

	useEffect(() => {
		if (userInfo) {
			dispatch(getUserAccount());
			dispatch(getUnreadNotifications());
		}
	}, [userInfo, dispatch]);

	const submitHandler = (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setMessage("Passwords did not match.");
		} else {
			dispatch(register(firstName, lastName, email, password));
		}
	};

	const openInNewTab = (url) => {
		const newWindow = window.open(
			"http://127.0.0.1:8000" + url,
			"_blank",
			"noopener, noreferrer"
		);
		if (newWindow) newWindow.opener = null;
	};

	return (
		<FormContainer xs={12} md={8} lg={5} xl={4} className="mt-2">
			<Title xs={3} />

			<h2 className="my-3">Sign up</h2>
			{message && <Message variant="danger">{message}</Message>}
			{loading && <Loader />}
			{error && <Message variant="danger">{error}</Message>}

			<Form onSubmit={submitHandler}>
				<Row className="mb-2">
					<Form.Group as={Col}>
						<Form.Label>First name</Form.Label>
						<Form.Control
							required
							type="name"
							placeholder="First name"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
					</Form.Group>
					<Form.Group as={Col}>
						<Form.Label>Last name</Form.Label>
						<Form.Control
							required
							type="name"
							placeholder="Last Name"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</Form.Group>
				</Row>

				<Form.Group className="mb-2" controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control
						required
						type="email"
						placeholder="email@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-2" controlId="password">
					<Form.Label>Password</Form.Label>
					<Form.Control
						required
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="confirmPassword">
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						required
						type="password"
						placeholder="Confirm Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="agreeCheckbox">
					<Form.Check
						required
						label=<p>
							Agree to
							<Link
								onClick={() => openInNewTab("/documents/t&c/")}
								className="link"
							>
								{" "}
								Terms and conditions
							</Link>
						</p>
						feedback="You must agree before signing in."
					/>
				</Form.Group>

				<Form.Group className="mb-4" controlId="signCheckbox">
					<Form.Check type="checkbox" label="Keep me signed in" />
				</Form.Group>

				<Form.Group as={Row} className="mb-2">
					<Col>
						<Button type="submit" variant="primary" className="account-btn">
							<strong>Sign up</strong>
						</Button>
					</Col>
				</Form.Group>
			</Form>
			<Row className="py-3">
				<Col>
					<h6>
						Have an Account?{" "}
						<Link
							to={userInfo ? "/login?redirect=/" : "/login"}
							className="link"
						>
							Sign In
						</Link>
					</h6>
				</Col>
			</Row>
		</FormContainer>
	);
}
export default RegisterScreen;
