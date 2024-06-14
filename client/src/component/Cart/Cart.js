import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCartItems } from '../../features/Cart/cartSlice'
import CartCard from './CartCard'
import './Cart.css'
import empty from '../../images/empty-cart.png'
import { useNavigate } from 'react-router-dom'
import { useGetSingleProductMutation } from '../../features/Products/productSlice'
import { toast, Bounce } from 'react-toastify'
import Metadata from '../Layout/Metadata'

const Cart = () => {
    const navigate = useNavigate()
    const [getSingleProduct] = useGetSingleProductMutation()
    const cartItems = useSelector(selectCartItems)
    const subtotal = cartItems.reduce((acc, item) => acc+Number(item.quantity) * Number(item.price), 0)
    const [loading, setLoading] = useState(false)

    if(cartItems.length<=0){
        return (
            <>
            <Metadata title='Cart' />
                <div className='empty-cart'>
                    <img src={empty} alt="" />
                    <div className='empty-cart-des'>
                        <h1>Your cart is empty and sad</h1>
                        <p>Add something to make it happy!</p>
                    </div>
                    <button onClick={()=>navigate('/shop')}>Continue Shopping</button>
                </div>
            </>
        )
    }


    const handleCheckOut = async () => {
        setLoading(true)
        try {
            const productChekcs = await Promise.all(
                cartItems.map(async (item)=>{
                    const { data } = await getSingleProduct(item.productId)
                    return {
                        inStock: data.product.size[item.size] >= item.quantity
                    }
                })
            )

            const allInStock = productChekcs.every(check => check.inStock)
            
            if(allInStock){
                navigate('/login?redirect=checkout')
            } else {
                toast.error("Some products are not available in the given quantity, Please try again after changing the quantity", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                })
            }
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            })
        }
        setLoading(false)
    }

  return (
    <>
        <Metadata title='Cart --Euphoria' />
        <div className='cart-mobile'>
            {/* Header */}
            <div className='cart-header'>
                <p>PRODUCT DETAILS</p>
                <p className='pos-header'>PRICE</p>
                <p className='pos-header'>QUANTITY</p>
                <p className='pos-header'>SHIPPING</p>
                <p className='pos-header'>SUBTOTAL</p>
                <p className='pos-header'>ACTION</p>
            </div>
            {/* Products */}
            <div>
                {cartItems.map((item, i)=> <CartCard key={i} item={item} index={i}/>)}
            </div>
            <div className='cart-total'>
                <p>Sub Total: ${subtotal}</p>
                <p>Grand Total: ${subtotal+15}</p>
            </div>
            <div className='cart-line-container'>
                <div className='cart-line'></div>
            </div>
            <div className='proceed-button-container'>
                <button disabled={loading ? true : false} onClick={handleCheckOut}>Proceed To CheckOut</button>
            </div>
        </div>
    </>
  )
}

export default Cart