import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast, Bounce } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Layout/Loader/Loader'
import Metadata from '../Layout/Metadata'
import Sidebar from './Sidebar'
import { useGetSingleOrderMutation, useChnageOrderStatusMutation, clearError } from '../../features/Orders/orderSlice'
import { Typography } from '@mui/material'
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import './UpdateOrder.css'


const UpdateOrder = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {id} = useParams()
    const [getSingleOrder] = useGetSingleOrderMutation()
    const [chnageOrderStatus, { isSuccess }] = useChnageOrderStatusMutation()

    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(false)
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    
    useEffect(()=>{
      async function fetchData(){
        await getSingleOrder(id)
      }
      fetchData()
    },[getSingleOrder, id])

    const { singleOrder: order, error } = useSelector(state => state.order)

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

      if(isSuccess){
        toast.success("Order status chnaged successfully", {
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
        navigate('/admin/orders')
      }
    },[error, dispatch, isSuccess, navigate])

    if(!order){
      return <Loader />
    }

    const updateOrderSubmitHandler = async (e) => {
      e.preventDefault()
      setLoading(true)
      const data = {
        id: id,
        status: status
      }
      
      try {
        await chnageOrderStatus(data)
      } catch (error) {
        
      }
      setLoading(false)
    }
    
  return (
    <>
      <Metadata title="Process Order"/>
      <div className="dashboard">
        <div className='board-desktop'>
          <Sidebar />
        </div>
        <div className={mobileFilterOpen ? 'board-mobile board-active': 'board-mobile'}>
          {mobileFilterOpen ? <div className='dashboard-menu'> <KeyboardArrowDownIcon onClick={()=> setMobileFilterOpen(false)} /> </div>: <div className='dashboard-menu'> <KeyboardArrowRightIcon onClick={()=> setMobileFilterOpen(true)} />Menu</div>}
          {mobileFilterOpen && <Sidebar />}
        </div>

        <div className="order-status-container">
          <div>
            <Typography>Shipping Info:</Typography>
            <div>
                <div>Name:</div>
                <span>{order.user && order.user.name}</span>
            </div>
            <div>
                <div>Phone:</div>
                <span>
                  {order.shippingInfo && order.shippingInfo.phoneNo}
                </span>
            </div>
            <div>
              <div>Address:</div>
                <span>
                  {order.shippingInfo &&
                    `${order.shippingInfo.street_address}, ${order.shippingInfo.city}, ${order.shippingInfo.postal_code}, ${order.shippingInfo.country}`}
                </span>
            </div>
            <Typography>Payment:</Typography>
            <div>
              <div className={order.paymentInfo.status === "succeeded" ? "greenColor" : "redColor"}>
                {order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "PAID"
                          : "NOT PAID"}         
              </div>
            </div>
            <div>
              <div>Amount:</div>
              <span>${order.totalPrice && order.totalPrice}</span>
            </div>
            <Typography>Order Status:</Typography>
            <div>
              <div className={order.orderStatus === "Delivered" ? "greenColor" : "redColor"}>
                  {order.orderStatus && order.orderStatus}
              </div>
            </div>
            <Typography>Your Cart Items:</Typography>
            <div className='order-items-all'>
              {order.orderItems.map((item) => (
                  <div className='order-status-item-list' key={item.product}>
                    <img src={item.image} alt="Product" />
                    <div>
                      <div onClick={()=>{navigate(`/shop/${item.productId}`)}}>
                                {item.name}
                        </div>{" "}
                        <span>Size: {item.size}</span>
                        <span>
                              {item.quantity} X ${item.price} ={" "}
                            <b>${item.price * item.quantity}</b>
                        </span>
                      </div>
                  </div>
                ))}
            </div>
          </div>
          <div>
              <form className="updateOrderForm" onSubmit={updateOrderSubmitHandler}>
                  <h1>Process Order</h1>
                  <div>
                    <AccountTreeIcon />
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Choose Category</option>
                      {order.orderStatus === "Processing" && (
                        <>
                        <option value="Shipped">Shipped</option>
                        <option value="Cancelled">Cancelled</option>
                        </>
                      )}

                      {order.orderStatus === "Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>

                  <button
                    className='update-order-form-btn'
                    type="submit"
                    disabled={
                      loading ? true : false || status === "" ? true : false
                    }
                  >
                    Process
                  </button>
              </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateOrder