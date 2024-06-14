import { Link } from 'react-router-dom'
import Rating from '@mui/material/Rating';
import React from 'react'
import './ProductCard.css'

const ProductCard = ({product}) => {
    const options = {
        value: Number(product.ratings),
        readOnly: true,
        precision: 0.5,
    }
  return (
    <Link className="productCard" to={`/shop/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <Rating {...options} />{" "}
      </div>
      <span>{`$${product.price}`}</span>
    </Link>
  )
}

export default ProductCard