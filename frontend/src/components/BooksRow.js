import React from "react"
import { Row, Col } from "react-bootstrap"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import Book from "../components/Book"

function BooksRow({ books }) {
   var settings = {
      infinite: true,
      arrows: true,
      speed: 200,
      slidesToShow: 6,
      slidesToScroll: 6,
      initialSlide: 0,
      responsive: [
         {
            breakpoint: 1024,
            settings: {
               slidesToShow: 6,
               slidesToScroll: 6,
               infinite: true,
               dots: true,
               arrows: true,
            },
         },
         {
            breakpoint: 600,
            settings: {
               slidesToShow: 4,
               slidesToScroll: 4,
               initialSlide: 4,
               arrows: true,
            },
         },
         {
            breakpoint: 480,
            settings: {
               slidesToShow: 2,
               slidesToScroll: 2,
            },
         },
      ],
   }

   return books?.length > 6 ? (
      <Row className="mb-3 px-5">
         <Slider {...settings}>
            {books?.map((book) => (
               <Col key={book.id} xs={6} sm={5} md={3} lg={2} xl={2} className="px-1">
                  <Book book={book} />
               </Col>
            ))}
         </Slider>
      </Row>
   ) : (
      <Row className="mb-3 px-5">
         {books?.map((book) => (
            <Col key={book.id} xs={6} sm={5} md={3} lg={2} xl={2} className="px-1">
               <Book book={book} />
            </Col>
         ))}
      </Row>
   )
}

export default BooksRow

/*
   return (
      <Slider {...settings}>
         {books?.map((book) => (
            <div>
               <Book book={book} />
            </div>
         ))}
      </Slider>
   )
*/
