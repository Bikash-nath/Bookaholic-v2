import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";

import {
	login,
	getUserAccount,
	getUnreadNotifications,
} from "../actions/userAccountActions";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Title from "../components/Title";

function LoginScreen({ location, history }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const dispatch = useDispatch();
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo, loading, error } = userLogin;

	useEffect(() => {
		if (userInfo) {
			dispatch(getUserAccount());
			dispatch(getUnreadNotifications());
		}
	}, [userInfo, dispatch]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(login(email, password));
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
		<FormContainer xs={12} md={9} lg={4}>
			<Title xs={3} />

			<h2 className="my-3">Sign In</h2>
			{loading && <Loader />}
			{error && <Message variant="danger">{error}</Message>}
			<h4>Discover & Read more</h4>
			<br />
			<Form onSubmit={submitHandler}>
				<Form.Group className="mb-3" controlId="email">
					<Form.Label>Username or Email address</Form.Label>
					<Form.Control
						required
						type="text"
						placeholder=""
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="password">
					<Form.Label>Password</Form.Label>
					<Form.Control
						required
						type="password"
						placeholder=""
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Form.Group>
					By continuing, you agree to Bookaholic's{" "}
					<Link
						onClick={() => openInNewTab("/documents/t&c/")}
						className="link"
					>
						Conditions of Use and Privacy Notice.
					</Link>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicCheckbox">
					<Form.Check type="checkbox" label="Keep me signed in" />
				</Form.Group>
				<Form.Group as={Row} className="mb-3">
					<Col>
						<Button variant="primary" type="submit" className="account-btn">
							Sign in
						</Button>
					</Col>
				</Form.Group>
			</Form>
			<Row className="py-3">
				<Col>New to Bookaholic?</Col>
			</Row>
			<Link to={userInfo ? `/login?redirect=/` : "/register"} className="link">
				<Button className="account-btn">Create your Bookaholic Account</Button>
			</Link>
		</FormContainer>
	);
}
export default LoginScreen;
