import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import './CartCard.css'
import { useDispatch } from 'react-redux';
import { decreaseCount, deleteCartItem, increaseCount } from '../../features/Cart/cartSlice';
import {useNavigate} from 'react-router-dom'


const CartCard = ({item, index}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleProduct = () => {
        navigate(`/shop/${item.productId}`)
    }

    const handleIncrease = () => {
        if(item.quantity >= item.stock){
            return;
        }
        dispatch(increaseCount(index))
    }

  return (
    <>
        <div className='cart-card'>
            <div className='cart-details'>
                <div className='cart-image' >
                    <img src={item.image} alt="" />
                </div>
                <div className='cart-product-name' onClick={handleProduct}>
                    <h3>{item.name}</h3>
                    <p>Size: {item.size}</p>
                </div>
            </div>
            {/* Price */}
            <div className='pos'>
                ${item.price}
            </div>
            {/* Quantity */}
            <div className='pos cart-item-qnt'> 
                <button disabled={item.quantity === 1} onClick={()=>dispatch(decreaseCount(index))}>-</button>  
                {item.quantity}
                <button onClick={handleIncrease}>+</button>
            </div>
            <div className='pos cart-item-qnt-mobile'> 
                <button disabled={item.quantity === 1} onClick={()=>dispatch(decreaseCount(index))}>-</button>  
                {item.quantity}
                <button onClick={handleIncrease}>+</button>
            </div>
            {/* Shipping */}
            <div className='pos'>
                $15
            </div>
            {/* Subtototal */}
            <div className='pos'>
                {item.price*item.quantity + 15}
            </div>
            {/* Action */}
            <div className='pos'>
                <DeleteIcon className='cart-delete-btn' onClick={()=>dispatch(deleteCartItem(index))} />
            </div>
        </div>
    </>
  )
}

export default CartCard