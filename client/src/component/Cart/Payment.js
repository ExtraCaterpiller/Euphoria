import React, { useEffect, useRef } from 'react'
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { useDispatch, useSelector } from 'react-redux';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Typography } from '@mui/material';
import Metadata from '../Layout/Metadata';
import { useProcessPaymentMutation, clearError } from '../../features/Payment/paymentSlice'
import { clearCart } from '../../features/Cart/cartSlice';
import { useCreateOrderMutation } from '../../features/Orders/orderSlice';
import { useNavigate } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify'
import './Payment.css'

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"))
  const [processPayment] = useProcessPaymentMutation()
  const [createOrder, { isSuccess }] = useCreateOrderMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const stripe = useStripe()
  const elements = useElements()
  const payBtn = useRef(null)

  const { user } = useSelector(state => state.user)
  const { error } = useSelector(state => state.payment)

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  }

  useEffect(()=>{
    if(isSuccess){
      toast.success("Order Successfull", {
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
  },[isSuccess])

  useEffect(()=>{
    if(error){
      toast.error(error, {
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
      dispatch(clearError())
    }
  },[error, dispatch])


  const submitHandler = async (e) => {
    e.preventDefault()

    payBtn.current.disabled = true

    try {
      const { data } = await processPayment(paymentData)

      if(!stripe || !elements){
        return
      }
  
      const result = await stripe.confirmCardPayment(data, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: orderInfo.shippingInfo.street_address,
              city: orderInfo.shippingInfo.city,
              country: orderInfo.shippingInfo.country,
              postal_code: orderInfo.shippingInfo.postal_code
            }
          }
        }
      })
  
      if(result.error){
        payBtn.current.disabled = false
        toast.error(result.error.message, {
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
      } else {
        if (result.paymentIntent.status === "succeeded") {
          orderInfo.paymentInfo = JSON.stringify({
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          })

          orderInfo.shippingInfo = JSON.stringify(orderInfo.shippingInfo)
          orderInfo.orderItems = JSON.stringify(orderInfo.orderItems)
          
          await createOrder(orderInfo)
          dispatch(clearCart())

          navigate('/success')
        } else {
          toast.error("There's some issues while processing the payment, Please try again later", {
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
      }
    } catch (error) {
      payBtn.current.disabled = false
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
  }


  return (
    <>
    <Metadata title="Payment" />
    <div className="paymentContainer">
      <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
        <Typography>Card Info</Typography>
        <div>
          <CreditCardIcon />
          <CardNumberElement className="paymentInput" />
        </div>
        <div>
          <EventIcon />
          <CardExpiryElement className="paymentInput" />
        </div>
        <div>
          <VpnKeyIcon />
          <CardCvcElement className="paymentInput" />
        </div>

        <input
          type="submit"
          value={`Pay - $${orderInfo && orderInfo.totalPrice}`}
          ref={payBtn}
          className="paymentFormBtn"
        />
      </form>
    </div>
  </>
  )
}

export default Payment