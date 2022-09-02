import React from "react"
import { Container, Row, Col } from "react-bootstrap"

function FormContainer({ children, xs, md, lg }) {
   return (
      <Container fluid className="py-2">
         <Row className="justify-content-md-center">
            <Col xs={xs} md={md} lg={lg}>
               {children}
            </Col>
         </Row>
      </Container>
   )
}

export default FormContainer
