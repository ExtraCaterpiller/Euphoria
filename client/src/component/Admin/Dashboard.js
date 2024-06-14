import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import { Doughnut, Line } from 'react-chartjs-2'
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllOrdersAdminMutation, clearError as clearOrderError } from '../../features/Orders/orderSlice.js';
import { useGetAllProductsAdminMutation, clearError as clearProductError } from '../../features/Products/productSlice.js';
import { useGetAllUsersAdminMutation, clearError as clearUserError } from '../../features/Users/userSlice.js';
import Metadata from '../Layout/Metadata'
import Sidebar from './Sidebar.js'
import Loader from '../Layout/Loader/Loader.js'
import { toast, Bounce } from 'react-toastify'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import './Dashboard.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Dashboard = () => {
  const dispatch = useDispatch()
  const [getAllOrdersAdmin] = useGetAllOrdersAdminMutation()
  const [getAllProductsAdmin] = useGetAllProductsAdminMutation()
  const [getAllUsersAdmin] = useGetAllUsersAdminMutation()
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(()=>{
    async function fetchData(){
      try {
        await getAllOrdersAdmin()
        await getAllProductsAdmin()
        await getAllUsersAdmin()
      } catch (error) {
        
      }
    }
    fetchData()
  },[getAllOrdersAdmin, getAllProductsAdmin, getAllUsersAdmin])

  const { orders, error:orderError } = useSelector(state => state.order)
  const { products, error:productError } = useSelector(state => state.product)
  const { users, error:userError } = useSelector(state => state.user)

  useEffect(()=>{
    if(orderError){
      toast.error(orderError, {
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
      dispatch(clearOrderError())
    }
    if(productError){
      toast.error(productError, {
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
      dispatch(clearProductError())
    }
    if(userError){
      toast.error(userError, {
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
      dispatch(clearUserError())
    }
  },[orderError, productError, userError, dispatch])

  if(!orders || !products){
    return <Loader />
  }

  let outOfStock = 0;
  products && products.forEach((item) => {
      if (item.stock <= 0) {
        outOfStock += 1;
      }
    })

  let totalAmount = 0;
  orders && orders.forEach((item) => {
      totalAmount += item.totalPrice;
    })

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };
    
  return (
    <>
      <Metadata title="Dashboard - Admin Panel" />
      <div className="dashboard">
        <div className='board-desktop'>
          <Sidebar />
        </div>
        <div className={mobileFilterOpen ? 'board-mobile board-active': 'board-mobile'}>
          {mobileFilterOpen ? <div className='dashboard-menu'> <KeyboardArrowDownIcon onClick={()=> setMobileFilterOpen(false)} /> </div>: <div className='dashboard-menu'> <KeyboardArrowRightIcon onClick={()=> setMobileFilterOpen(true)} />Menu</div>}
          {mobileFilterOpen && <Sidebar />}
        </div>

      <div className="dashboard-container">
        <Typography>Dashboard</Typography>
        <div className="dashboard-summary-box1">
          <div>
            <p>
              Total Amount <br /> ${totalAmount}
            </p>
          </div>
          <div className="dashboard-summary-box2">
            <div className='box2'>
              <p>Products</p>
              <p>{products && products.length}</p>
            </div>
            <div className='box2'>
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </div>
            <div className='box2'>
              <p>Users</p>
              <p>{users && users.length}</p>
            </div>
          </div>
        </div>

        <div className='dashboard-charts'>
          <div className="dashboard-lineChart">
            <Line data={lineState} />
          </div>

          <div className="dashboard-doughnutChart">
            <Doughnut data={doughnutState} />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Dashboard