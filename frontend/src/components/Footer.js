import React from "react"
import { Link } from "react-router-dom"
import { Row, Col, Container } from "react-bootstrap"

function Footer() {
	const openInNewTab = (e, url) => {
		e.preventDefault()
		var newWindow = null
		if (!url.includes("https")) {
			newWindow = window.open("http://127.0.0.1:8000" + url, "_blank", "noopener, noreferrer")
		} else {
			newWindow = window.open(url, "_blank", "noopener, noreferrer")
		}
		if (newWindow) newWindow.opener = null
	}

	return (
		<Container fluid className="footer mt-4">
			<Row>
				<Col xs={{ offset: 1, span: 5 }} md={{ offset: 1, span: 2 }} className="py-2">
					<h5 style={{ color: "#515A5A" }}>About</h5>
					<ul className="list-unstyled">
						<li>
							<Link onClick={(e) => openInNewTab(e, "/documents/about/")} className="link">
								About us
							</Link>
						</li>
						<li>
							<Link onClick={(e) => openInNewTab(e, "/documents/contact/")} className="link">
								Contact us
							</Link>
						</li>
					</ul>
				</Col>
				<Col xs={{ span: 5 }} md={{ offset: 1, span: 2 }} className="py-2">
					<h5 style={{ color: "#515A5A" }}>Help</h5>
					<ul className="list-unstyled">
						<li>
							<Link onClick={(e) => openInNewTab(e, "/documents/faq/")} className="link">
								Cancellation & Returns
							</Link>
						</li>
						<li>
							<Link onClick={(e) => openInNewTab(e, "/documents/faq/")} className="link">
								FAQ
							</Link>
						</li>
					</ul>
				</Col>
				<Col xs={{ offset: 1, span: 5 }} md={{ offset: 1, span: 2 }} className="py-2">
					<h5 style={{ color: "#515A5A" }}>Policy</h5>
					<ul className="list-unstyled">
						<li>
							<Link onClick={(e) => openInNewTab(e, "/documents/t&c/")} className="link">
								Terms & Conditions
							</Link>
						</li>
						<li>
							<Link onClick={(e) => openInNewTab(e, "/documents/privacy/")} className="link">
								Privacy
							</Link>
						</li>
					</ul>
				</Col>
				<Col xs={{ span: 5 }} md={{ offset: 1, span: 2 }} className="py-2">
					<h5 style={{ color: "#515A5A" }}>Social</h5>
					<ul className="list-unstyled">
						<li>
							<Link
								onClick={(e) => openInNewTab(e, "https://www.facebook.com/Bookaholic-216954937000263")}
								className="link"
							>
								Facebook
							</Link>
						</li>
					</ul>
				</Col>
			</Row>
			<div className="footer-bottom">
				<p className="center">&copy;{new Date().getFullYear()} Copyright to Bookaholic</p>
			</div>
		</Container>
	)
}

export default Footer
