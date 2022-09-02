import React from "react"
import { Link } from "react-router-dom"
import { Col, Card, Image } from "react-bootstrap"

function Author({ author }) {
   return (
      <Card variant="flush" className="rounded">
         <Col className="center">
            <Link className="link-title" to={`/author/${author.id}`}>
               <Image src={author.image_sm} alt={author.name} className="px-3 py-2 author-img" fluid roundedCircle />
            </Link>
         </Col>
         <Card.Body className="p-0">
            <Link className="link" to={`/author/${author.id}`}>
               <Card.Title as="div" style={{ fontSize: "1.1rem" }} className="center px-1 mb-1">
                  {author.name}
               </Card.Title>
            </Link>
         </Card.Body>
      </Card>
   )
}

export default Author
