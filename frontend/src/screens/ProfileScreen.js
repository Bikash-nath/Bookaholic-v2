import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Form, Button, Image, InputGroup } from "react-bootstrap";

import {
	getUserAccount,
	updateUserAccount,
	getUnreadNotifications,
} from "../actions/userAccountActions";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";

function ProfileScreen({ history }) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [mobileNo, setMobileNo] = useState("");
	const [gender, setGender] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [message, setMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [selectedImage, setSelectedImage] = useState({});
	const [updatePassword, setUpdatePassword] = useState(false);
	const [fetchUser, setFetchUser] = useState(true);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userAccount = useSelector((state) => state.userAccount);
	const { user, loading, error } = userAccount;

	//To update useEffect when updateUserAccount action is dispatched.
	const userUpdateAccount = useSelector((state) => state.userUpdateAccount);
	const { userUpdate, success, error: updateError } = userUpdateAccount;

	const dispatch = useDispatch();

	useEffect(() => {
		if (!userInfo) {
			history.push("/login");
		} else {
			if ((!user?.id || success) && fetchUser) {
				dispatch({ type: "USER_UPDATE_PROFILE_RESET" });
				dispatch(getUserAccount());
				dispatch(getUnreadNotifications());
				setFetchUser(false);
				if (success) setMessage("Profile updated successfully");
				else setMessage("");
			} else {
				setFirstName(user.first_name);
				setLastName(user.last_name);
				setMobileNo(user.profile.mobile_no || "");
				setGender(user.profile.gender || "");
				setEmail(user.email);
				setConfirmPassword("");
				setNewPassword("");
				setConfirmNewPassword("");
			}
		}
	}, [user, userInfo, success, history, dispatch]);

	const submitHandler = (e) => {
		e.preventDefault();
		setMessage("");
		setErrorMessage(""); //reset password error message

		if (updatePassword) {
			if (confirmPassword === newPassword) {
				setErrorMessage("Both Passwords are same! Provide new password");
			} else if (newPassword !== confirmNewPassword) {
				setErrorMessage("Both Passwords are not same");
			} else {
				dispatch(
					updateUserAccount({
						id: user.id,
						confirmPassword,
						newPassword,
					})
				);
			}
		} else {
			dispatch(
				updateUserAccount({
					id: user.id,
					firstName,
					lastName,
					email,
					mobileNo,
					gender,
					confirmPassword,
					profile_id: user.profile.id,
					avatar: selectedImage,
				})
			);
		}
		setFetchUser(true);
	};

	const onChangeHandler = (e) => {
		console.log(selectedImage);
		setSelectedImage(e.target.files[0]);
		console.log("Img:", e.target.files[0].name);
		console.log(selectedImage);
	};

	return (
		<FormContainer xs={12} md={9} lg={7}>
			<Col md={12} className="mt-5">
				<h2>My Profile</h2>
				{loading ? (
					<Loader />
				) : error || !user?.id ? (
					<div>{error && <Message variant="danger">{error}</Message>}</div>
				) : (
					<Row>
						{updateError && <Message variant="danger">{updateError}</Message>}
						{errorMessage ? (
							<Message variant="danger">{errorMessage}</Message>
						) : (
							success &&
							message && <Message variant="success">{message}</Message>
						)}
						<Col lg={4} md={3} className="mt-5">
							<Row className="mb-3">
								<Link
									className="link"
									onClick={() => {
										setUpdatePassword(false);
										setMessage("");
									}}
								>
									<em>
										<strong>Profile</strong>
									</em>
								</Link>
							</Row>
							<Row className="mb-2">
								<Link to="/addresslist" className="link">
									Addresses
								</Link>
							</Row>
							<Row className="mb-2">
								<Link to="/orders" className="link">
									Order & Returns
								</Link>
							</Row>
						</Col>
						<Col lg={8} md={9} className="mt-5">
							<Form onSubmit={submitHandler}>
								{!updatePassword ? (
									<>
										<Form.Group as={Row} className="mb-3 mx-auto">
											<Col xs={6} sm={5} md={4}>
												<Image
													src={user.profile.avatar}
													alt={user.first_name}
													roundedCircle
													fluid
												/>
											</Col>
										</Form.Group>
										<Row className="mb-2">
											<label htmlFor={user.id}>Update profile picture</label>
											<input
												type="file"
												id={user.id}
												onChange={(e) => onChangeHandler(e)}
											/>
										</Row>

										<Row className="mb-2">
											<Form.Group as={Col}>
												<Form.Label className="mb-0">First name</Form.Label>
												<Form.Control
													type="name"
													placeholder=""
													value={firstName}
													onChange={(e) => setFirstName(e.target.value)}
												/>
											</Form.Group>
											<Form.Group as={Col}>
												<Form.Label className="mb-0">Last name</Form.Label>
												<Form.Control
													type="name"
													placeholder=""
													value={lastName}
													onChange={(e) => setLastName(e.target.value)}
												/>
											</Form.Group>
										</Row>
										<Form.Group className="mb-2" controlId="email">
											<Form.Label>Email address</Form.Label>
											<Form.Control
												type="email"
												placeholder=""
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
										</Form.Group>

										<Row className="mb-2">
											<Form.Group as={Col} xs={7}>
												<Form.Label className="mb-0">Mobile Number</Form.Label>
												<InputGroup>
													<InputGroup.Text>+91</InputGroup.Text>
													<Form.Control
														placeholder={
															!user.profile.mobileNo ? "Register Mobile No" : ""
														}
														id="mobileNo"
														value={mobileNo}
														onChange={(e) => setMobileNo(e.target.value)}
													/>
												</InputGroup>
											</Form.Group>

											<Form.Group as={Col}>
												<Form.Label className="mb-0">Gender</Form.Label>
												<br />
												<Form.Control
													as="select"
													id="genderSelect"
													placeholder="Select a Gender"
													custom
													value={gender}
													onChange={(e) => setGender(e.target.value)}
												>
													{["Male", "Female", "Transgender"].map((gender) => (
														<option value={gender} key={gender}>
															{gender}
														</option>
													))}
												</Form.Control>
											</Form.Group>
										</Row>
										<Form.Group className="mb-2" controlId="password">
											<Form.Label className="mb-0">
												Confirm Current Password
											</Form.Label>
											<Form.Control
												required
												type="password"
												placeholder="Enter Password"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
											/>
										</Form.Group>
										<Form.Group as={Row} className="mb-2">
											<Col>
												<Button type="submit" variant="success">
													Update Profile
												</Button>
											</Col>
										</Form.Group>
										<Form.Group as={Row} className="my-3">
											<Col>
												<Button
													type=""
													onClick={() => {
														setUpdatePassword(true);
														setMessage("");
													}}
													variant="warning"
												>
													Change Password
												</Button>
											</Col>
										</Form.Group>
									</>
								) : (
									<Row>
										<Form.Group className="mb-2" controlId="password">
											<Form.Label className="mb-0">
												Confirm Current Password
											</Form.Label>
											<Form.Control
												required
												type="password"
												placeholder="Current Password"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
											/>
										</Form.Group>
										<Form.Group className="mb-4" controlId="passwordConfirm">
											<Form.Label className="mb-0">New Password</Form.Label>
											<Form.Control
												required
												type="password"
												placeholder="New Password"
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
											/>
										</Form.Group>
										<Form.Group className="mb-4" controlId="passwordConfirm">
											<Form.Label className="mb-0">
												Reenter New Password
											</Form.Label>
											<Form.Control
												required
												type="password"
												placeholder="Confirm New Password"
												value={confirmNewPassword}
												onChange={(e) => setConfirmNewPassword(e.target.value)}
											/>
										</Form.Group>
										<Form.Group as={Row} className="mb-2">
											<Col>
												<Button type="submit" variant="success">
													Update Password
												</Button>
											</Col>
										</Form.Group>
									</Row>
								)}
							</Form>
						</Col>
					</Row>
				)}
			</Col>
		</FormContainer>
	);
}
export default ProfileScreen;
