import React, { useEffect, useState } from 'react'
import Loader from '../Layout/Loader/Loader.js';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useGetAllOrdersAdminMutation, useDeleteOrderAdminMutation, clearError } from '../../features/Orders/orderSlice'
import { toast, Bounce } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import Metadata from '../Layout/Metadata'
import Sidebar from './Sidebar'

const OrdersList = () => {
    const dispatch = useDispatch()
    const [getAllOrdersAdmin] = useGetAllOrdersAdminMutation()
    const [deleteOrderAdmin, { isSuccess }] = useDeleteOrderAdminMutation()
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const [columns, setColumns] = useState([])

    useEffect(()=>{
        async function fetchData(){
          await getAllOrdersAdmin()
        }
        fetchData()
    },[getAllOrdersAdmin])

    const { orders, error } = useSelector(state => state.order)

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
          toast.success("Order deleted successfully", {
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
    },[error, dispatch, isSuccess])


    useState(()=>{
      const handleResize = () => {
        if(window.innerWidth<=840){
          setColumns([
            { field: 'id', headerName: 'Order ID', minWidth: 50, flex: 0.2 },
            { 
              field: 'status', 
              headerName: 'Status', 
              minWidth: 50, 
              flex: 0.2,
              cellClassName: (params) => {
                return params.row.status === "Delivered"? "greenColor" : "redColor";
              },
            },
            { field: 'itemsQty', headerName: 'Items Qty', type: 'number', minWidth: 40, flex: 0.2 },
            { field: 'amount', headerName: 'Amount', type: 'number', minWidth: 40, flex: 0.2 },
            {
              field: "actions",
              flex: 0.2,
              headerName: "Actions",
              minWidth: 50,
              type: "number",
              sortable: false,
              renderCell: (params) => {
                const id = params.row.id
                return (
                  <div>
                    <Link to={`/admin/order/${id}`}>
                      <EditIcon />
                    </Link>
        
                    <Button
                      onClick={() =>
                        deleteOrderHandler(id)
                      }
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                )
              },
            },
          ])
        } else {
          setColumns([
            { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
    
            {
              field: "status",
              headerName: "Status",
              minWidth: 150,
              flex: 0.5,
              cellClassName: (params) => {
                return params.row.status === "Delivered"? "greenColor" : "redColor";
              },
            },
            {
              field: "itemsQty",
              headerName: "Items Qty",
              type: "number",
              minWidth: 150,
              flex: 0.4,
            },
        
            {
              field: "amount",
              headerName: "Amount",
              type: "number",
              minWidth: 270,
              flex: 0.5,
            },
        
            {
              field: "actions",
              flex: 0.3,
              headerName: "Actions",
              minWidth: 150,
              type: "number",
              sortable: false,
              renderCell: (params) => {
                const id = params.row.id
                return (
                  <div>
                    <Link to={`/admin/order/${id}`}>
                      <EditIcon />
                    </Link>
        
                    <Button
                      onClick={() =>
                        deleteOrderHandler(id)
                      }
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                )
              },
            },
          ])
        }
      }

      window.addEventListener('resize', handleResize)
      handleResize()

      return () => window.removeEventListener('resize', handleResize)
    },[])

    if(!orders){
        return <Loader />
    }

    const deleteOrderHandler = async (id) => {
        try {
          await deleteOrderAdmin(id)
        } catch (error) {

        }
    }

    const rows = orders.map(item => ({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
    }))

  return (
    <>
         <Metadata title={`ALL ORDERS - Admin`} />

        <div className="dashboard">
          <div className='board-desktop'>
            <Sidebar />
          </div>
          <div className={mobileFilterOpen ? 'board-mobile board-active': 'board-mobile'}>
            {mobileFilterOpen ? <div className='dashboard-menu'> <KeyboardArrowDownIcon onClick={()=> setMobileFilterOpen(false)} /> </div>: <div className='dashboard-menu'> <KeyboardArrowRightIcon onClick={()=> setMobileFilterOpen(true)} />Menu</div>}
            {mobileFilterOpen && <Sidebar />}
          </div>

        <div className="productListContainer">
            <h1 id="productListHeading">ALL ORDERS</h1>

            <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
            />
        </div>
        </div>
    </>
  )
}

export default OrdersList