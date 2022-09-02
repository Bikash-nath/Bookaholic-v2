import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row, Col, ListGroup, Button, Modal } from "react-bootstrap";

import {
	getUnreadNotifications,
	updateReadNotifications,
	deleteNotifications,
} from "../actions/userAccountActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

function Notification({ showModal, setShowModal, handleClose }) {
	const userNotifications = useSelector((state) => state.userNotifications);
	const {
		notifications,
		loadingList,
		loadingUpdate,
		loadingDelete,
		errorList,
		errorUpdate,
		errorDelete,
	} = userNotifications;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		if (!userInfo) {
			history.push("/login");
		} else {
			dispatch(getUnreadNotifications());
		}
	}, [userInfo, dispatch, history]);

	const clearNotifications = () => {
		deleteNotifications();
	};
	return (
		<Modal
			show={showModal}
			onHide={handleClose}
			dialogClassName="modal-position-right"
		>
			{loadingList || loadingUpdate || loadingDelete ? (
				<Loader />
			) : errorList || errorUpdate || errorDelete ? (
				<Message variant="danger">
					{errorList || errorUpdate || errorDelete}
				</Message>
			) : notifications?.length === 0 ? (
				<Message variant="info" margin="my-0">
					Your notification list is empty.
				</Message>
			) : (
				<div>
					<Modal.Header closeButton>
						<Modal.Title>Notifications</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<ListGroup>
							{notifications.map((notification) => (
								<ListGroup.Item key={notification.id} className="py-1">
									<Row>
										<Col md={notification.is_unread ? 10 : 12}>
											<Row>
												<Col>
													<strong>{notification.title}</strong>
												</Col>
											</Row>
											<Row>
												<Col>
													<Row>{notification.body}</Row>
												</Col>
											</Row>
										</Col>
										{notification.is_unread && (
											<Col md={2} className="p-0 m-0 right">
												<Button
													variant="warning"
													onClick={() =>
														updateReadNotifications(notification.id)
													}
													className="btn-sm p-0 px-1"
												>
													<i class="fa-brands fa-readme" />
												</Button>
											</Col>
										)}
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="secondary"
							className="my-0"
							onClick={clearNotifications}
						>
							Clear All <i className="fas fa-trash fa-md" />
						</Button>
						<Button
							variant="secondary"
							className="my-0"
							onClick={() => setShowModal(false)}
						>
							Close
						</Button>
					</Modal.Footer>
				</div>
			)}
		</Modal>
	);
}
export default Notification;
