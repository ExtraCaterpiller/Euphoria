import React, { useState } from 'react'
import { useGetUserOrdersQuery } from '../../features/Orders/orderSlice'
import Loader from '../Layout/Loader/Loader'
import { useNavigate } from 'react-router-dom'
import { toast, Bounce } from 'react-toastify'
import './MyOrders.css'

const MyOrders = () => {
  const navigate = useNavigate()
  const {data, error, isLoading, isError} = useGetUserOrdersQuery()
  const [activetab, setActiveTab] = useState(0)

  if(isError){
    if(error){
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

  if(isLoading){
    return <Loader />
  }

  const { orders } = data
  const activeOrders = orders.filter(order => order.orderStatus==='Processing' || order.orderStatus==='Shipped')
  const completedOrders = orders.filter(order => order.orderStatus==='Delivered')
  const cancelledOrders = orders.filter(order => order.orderStatus==='Cancelled')

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

  return (
    <>
    <h2 className='myorder-title'>My Orders</h2>
    <div className='order-tabs'>
        <div className={activetab===0 ? 'activeTab tab' : 'tab'} onClick={()=>setActiveTab(0)}>Active</div>
        <div className={activetab===1 ? 'activeTab tab' : 'tab'} onClick={()=>setActiveTab(1)}>Completed</div>
        <div className={activetab===2 ? 'activeTab tab' : 'tab'} onClick={()=>setActiveTab(2)}>Cancelled</div>
    </div>
    <div>
        {
          activetab===0 && (
            <div>
              {activeOrders.length>0 ? activeOrders.map(order => {
                return (
                  <div className='order-container' key={order._id}>
                    <div className='order-info'>
                      <div>
                        <div className='order-no'>Order no: #{order._id}</div>
                        <div>Order date: {new Intl.DateTimeFormat('en-US', options).format(new Date(order.paidAt))}</div>
                      </div>
                      <div>
                        <div>Order Status: {order.orderStatus}</div>
                        <div>Payment Status: {order.paymentInfo.status}</div>
                      </div>
                    </div>
                    <div className='order-items-all'>
                      {order.orderItems.map(item => {
                        return (
                          <div className='order-items' key={item.productId}>
                            <div>
                              <img src={item.image} alt="OrderImage" />
                              <div>
                                <div>Quantity: {item.quantity}</div>
                                <div>Price: {item.price}</div>
                              </div>
                            </div>
                            <button onClick={()=>navigate(`/shop/${item.productId}`)}>View Detail</button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              }) : <div className='order-empty'>No Active Orders</div>}
            </div>
          )
        }

        {
          activetab===1 && (
            <div>
              {completedOrders.length>0 ? completedOrders.map(order => {
                return (
                  <div className='order-container' key={order._id}>
                    <div className='order-info'>
                      <div>
                        <div className='order-no'>Order no: #{order._id}</div>
                        <div>Order date: {new Intl.DateTimeFormat('en-US', options).format(new Date(order.paidAt))}</div>
                      </div>
                      <div>
                        <div>Order Status: {order.orderStatus}</div>
                        <div>Payment Status: {order.paymentInfo.status}</div>
                      </div>
                    </div>
                    <div>
                      {order.orderItems.map(item => {
                        return (
                          <div className='order-items' key={item.productId}>
                            <div>
                              <img src={item.image} alt="OrderImage" />
                              <div>
                                <div>Quantity: {item.quantity}</div>
                                <div>Price: {item.price}</div>
                              </div>
                            </div>
                            <button>View Detail</button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              }) : <div className='order-empty'>No Completed Orders</div>}
            </div>
          )
        }

        {
          activetab===2 && (
            <div>
              {cancelledOrders.length>0 ? cancelledOrders.map(order => {
                return (
                  <div className='order-container' key={order._id}>
                    <div className='order-info'>
                      <div>
                        <div className='order-no'>Order no: #{order._id}</div>
                        <div>Order date: {new Intl.DateTimeFormat('en-US', options).format(new Date(order.paidAt))}</div>
                      </div>
                      <div>
                        <div>Order Status: {order.orderStatus}</div>
                        <div>Payment Status: {order.paymentInfo.status}</div>
                      </div>
                    </div>
                    <div>
                      {order.orderItems.map(item => {
                        return (
                          <div className='order-items' key={item.productId}>
                            <div>
                              <img src={item.image} alt="OrderImage" />
                              <div>
                                <div>Quantity: {item.quantity}</div>
                                <div>Price: {item.price}</div>
                              </div>
                            </div>
                            <button>View Detail</button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              }) : <div className='order-empty'>No Cancelled Orders</div>}
            </div>
          )
        }
    </div>
    </>
  )
}

export default MyOrders