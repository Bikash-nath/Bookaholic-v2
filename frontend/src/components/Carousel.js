import { Link } from "react-router-dom"
import { Carousel, Image } from "react-bootstrap"

function Carousels() {
   return (
      <Carousel pause="hover" className="bg-dark">
         <Carousel.Item>
            <Link className="link" to={`/`}>
               <Image src={"static/carousels/Carousel1.png"} alt="Carousel-1" className="img-thumbnail" fluid />
            </Link>
         </Carousel.Item>
         <Carousel.Item>
            <Link className="link" to={"/books/author/2"}>
               <Image src={"static/carousels/Carousel2.png"} alt="Carousel-2" className="img-thumbnail" fluid />
            </Link>
         </Carousel.Item>
         <Carousel.Item>
            <Link className="link" to={"/books/genre/Indian History"}>
               <Image src={"static/carousels/Carousel3.png"} alt="Carousel-3" className="img-thumbnail" fluid />
            </Link>
         </Carousel.Item>
         <Carousel.Item>
            <Link className="link" to={"/books/genre/Study Aids & Exam Prep"}>
               <Image src={"static/carousels/Carousel4.png"} alt="Carousel-3" className="img-thumbnail" fluid />
            </Link>
         </Carousel.Item>
      </Carousel>
   )
}

export default Carousels
