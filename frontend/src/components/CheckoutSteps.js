import React from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Nav } from "react-bootstrap"
import Title from "../components/Title"

function FormContainer({ step1, step2, step3, step4 }) {
   return (
      <div className="center">
         <Nav>
            <Title xs={3} />
            <Nav.Item>
               {step1 ? (
                  <LinkContainer to="/login">
                     <Nav.Link variant="info">
                        <strong>Login</strong>
                     </Nav.Link>
                  </LinkContainer>
               ) : (
                  <Nav.Link disabled>Login</Nav.Link>
               )}
            </Nav.Item>
            <Nav.Item>
               {step2 ? (
                  <LinkContainer to="/shipping">
                     <Nav.Link variant="info">
                        <strong>Shipping</strong>
                     </Nav.Link>
                  </LinkContainer>
               ) : (
                  <Nav.Link disabled>Shipping</Nav.Link>
               )}
            </Nav.Item>
            <Nav.Item>
               {step3 ? (
                  <LinkContainer to="/payment">
                     <Nav.Link variant="info">
                        <strong>Payment</strong>
                     </Nav.Link>
                  </LinkContainer>
               ) : (
                  <Nav.Link disabled>Payment</Nav.Link>
               )}
            </Nav.Item>
            <Nav.Item>
               {step4 ? (
                  <LinkContainer to="/placeorder">
                     <Nav.Link variant="info">
                        <strong>Place Order</strong>
                     </Nav.Link>
                  </LinkContainer>
               ) : (
                  <Nav.Link disabled>Place Order</Nav.Link>
               )}
            </Nav.Item>
         </Nav>
         <hr />
      </div>
   )
}

export default FormContainer
