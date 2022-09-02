import React from "react"

function Rating({ value, text, color, fontSize }) {
   const nums = [1, 2, 3, 4, 5]
   const stars = nums.map((n) => (
      <span key={n} style={{ fontSize }}>
         <i
            style={{ color: "orange" }}
            className={value >= n ? "fas fa-star" : value >= n - 0.5 ? "fas fa-star-half-alt" : "far fa-star"}
         />
      </span>
   ))
   return <div className="rating">{stars}</div>
}

export default Rating
