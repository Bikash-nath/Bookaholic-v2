import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Container } from "react-bootstrap";

import { getUserList, deleteUser } from "../actions/userAccountActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

function UserListScreen({ history }) {
	const dispatch = useDispatch();

	const userList = useSelector((state) => state.userList);
	const { users, loading, error } = userList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDelete = useSelector((state) => state.userDelete);
	let { success: successDelete, message } = userDelete;

	useEffect(() => {
		if (userInfo?.is_admin) {
			dispatch(getUserList());
		} else {
			history.push("/login");
		}
	}, [userInfo, history, successDelete, dispatch]);

	const deleteHandler = (id) => {
		const input = window.prompt("Type CONFIRM to the this user account.");
		if (input.toUpperCase() === "CONFIRM") {
			dispatch(deleteUser(id));
			setTimeout(() => {
				if (successDelete) {
					message = "";
				}
			}, 2500);
		}
	};

	return (
		<Container fluid className="mt-4 pt-3">
			<h1>Users</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<div>
					{successDelete && <Message variant="info">{message}</Message>}
					<Table striped bordered hover responsive className="table-sm">
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>EMAIL</th>
								<th>ADMIN</th>
								<th>EDIT</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.id}>
									<td>{user.id}</td>
									<td>
										{user.first_name} {user.last_name}
									</td>
									<td>{user.email || user.mobile_no}</td>
									<td>
										{user.is_admin ? (
											<i className="fas fa-check" style={{ color: "green" }} />
										) : (
											<i className="fas fa-check" style={{ color: "grey" }} />
										)}
									</td>

									<td>
										<LinkContainer to={`/admin/user/${user.id}`}>
											<Button variant="light" className="btn-sm">
												<i className="fas fa-edit" />
											</Button>
										</LinkContainer>
										<Button
											variant="danger"
											className="btn-sm"
											onClick={() => deleteHandler(user.id)}
											hidden={user.id === userInfo.id}
										>
											<i className="fas fa-trash" />
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			)}
		</Container>
	);
}
export default UserListScreen;
