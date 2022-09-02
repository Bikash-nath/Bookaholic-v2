import React from "react";
import { Container } from "react-bootstrap";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import HomeScreen from "./screens/HomeScreen";
import BookScreen from "./screens/BookScreen";
import GenreBooksScreen from "./screens/GenreBooksScreen";
import AuthorScreen from "./screens/AuthorScreen";
import AuthorListScreen from "./screens/AuthorListScreen";
import AuthorBooksScreen from "./screens/AuthorBooksScreen";
import BookListScreen from "./screens/BookListScreen";
import CartScreen from "./screens/CartScreen";
import WishListScreen from "./screens/WishListScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LibraryScreen from "./screens/LibraryScreen";
import OrderListScreen from "./screens/OrderListScreen";
import AddressListScreen from "./screens/AddressListScreen";
import AddressEditScreen from "./screens/AddressEditScreen";
import PaymentScreen from "./screens/PaymentScreen";
import OrderScreen from "./screens/OrderScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import UserListScreen from "./screens/UserListScreen";

function App() {
	const paths = [
		"/home",
		"/profile",
		"/library",
		"/book/:id",
		"/books/",
		"/author/:id",
		"/authors/",
		"/cart/:id?",
		"/wishlist/:id?",
		"/order/:id",
		"/orders",
		"/profile",
		"/addresslist",
		"/shipping/addresslist",
		"/address/edit/:id",
		"/shipping/address/edit/:id",
		"/library",
		"/admin/userlist",
	];
	return (
		<Router>
			<ScrollToTop />
			<Route path={paths} component={Header} />
			<main className="py-3">
				<Container fluid>
					<Switch>
						<Route path="/home" component={HomeScreen} />
						<Route
							path="/books/author/:id"
							component={AuthorBooksScreen}
							exact
						/>
						<Route path="/book/:id" component={BookScreen} exact />
						<Route
							path="/books/genre/:genre"
							component={GenreBooksScreen}
							exact
						/>
						<Route path={"/books/"} component={BookListScreen} />

						<Route path="/author/:id" component={AuthorScreen} exact />
						<Route path="/authors/" component={AuthorListScreen} exact />

						<Route path="/cart/:id?" component={CartScreen} exact />
						<Route path="/wishlist/:id?" component={WishListScreen} exact />
						<Route path="/payment" component={PaymentScreen} />
						<Route path="/placeorder" component={PlaceOrderScreen} />
						<Route path="/order/:id" component={OrderScreen} />
						<Route path="/orders" component={OrderListScreen} />
						<Route
							path={["/shipping/addresslist", "/addresslist"]}
							component={AddressListScreen}
							exact
						/>
						<Route
							path={["/shipping/address/edit/:id", "/address/edit/:id"]}
							component={AddressEditScreen}
						/>

						<Route path="/login" component={LoginScreen} />
						<Route path="/register" component={RegisterScreen} />
						<Route path="/profile" component={ProfileScreen} />
						<Route path="/library" component={LibraryScreen} />
						<Route path="/admin/userlist" component={UserListScreen} />
					</Switch>
				</Container>
			</main>

			<Route path={paths} component={Footer} />
		</Router>
	);
}

export default App;
