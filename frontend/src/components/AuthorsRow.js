import React from "react";
import { Row, Col } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Author from "../components/Author";

function AuthorsRow({ authors, slides }) {
	var settings = {
		infinite: true,
		arrows: true,
		speed: 150,
		slidesToShow: slides,
		slidesToScroll: slides,
		initialSlide: 0,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: slides,
					slidesToScroll: slides,
					infinite: true,
					dots: true,
					arrows: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 5,
					initialSlide: 5,
					arrows: true,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				},
			},
		],
	};

	return authors?.length >= slides ? (
		<Row className="mb-2 mt-0">
			<Slider {...settings}>
				{authors?.map((author) => (
					<Col key={author.id} className="px-1 my-1">
						<Author author={author} />
					</Col>
				))}
			</Slider>
		</Row>
	) : (
		<Row className="mb-2">
			{authors?.map((author) => (
				<Col
					key={author.id}
					xs={6}
					sm={5}
					md={3}
					lg={2}
					xl={2}
					className="px-1"
				>
					<Author author={author} />
				</Col>
			))}
		</Row>
	);
}

export default AuthorsRow;
