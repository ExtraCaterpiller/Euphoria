import React from 'react'
import image from '../../images/order-confirmed.png'
import { useNavigate } from 'react-router-dom'
import './Success.css'
import Metadata from '../Layout/Metadata'

const Success = () => {
  const navigate = useNavigate()
  return (
    <>
    <Metadata title='Success' />
    <div className='order-success'>
      <img src={image} alt="" />
      <button onClick={()=>navigate('/shop')}>Continue Shopping</button>
    </div>
    </>
  )
}

export default Success