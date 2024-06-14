import React, { useEffect, useState } from 'react'
import { useGetAllProductsAdminMutation } from '../../features/Products/productSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Layout/Loader/Loader.js';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDeleteProductAdminMutation, clearError } from '../../features/Products/productSlice.js';
import Metadata from '../Layout/Metadata.js';
import Sidebar from './Sidebar.js';
import { toast, Bounce } from 'react-toastify'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import './AllProducts.css'

const AllProducts = () => {
    const dispatch = useDispatch()
    const [getAllProductsAdmin] = useGetAllProductsAdminMutation()
    const [deleteProductAdmin, { isSuccess }] = useDeleteProductAdminMutation()
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const [columns, setColumns] = useState([])

    useEffect(()=>{
      async function fetchData(){
        try {
          await getAllProductsAdmin()
        } catch (error) {
            
        }
      }
      fetchData()
    },[getAllProductsAdmin])

      const { products, error } = useSelector(state => state.product)

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
          toast.success("Product deleted", {
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


      useEffect(()=>{
        const handleResize = () => {
          if(window.innerWidth<=840){
            setColumns([
              { field: 'id', headerName: 'ID', minWidth: 50, flex: 0.2 },
              { field: 'name', headerName: 'Name', minWidth: 50, flex: 0.3 },
              { field: 'stock', headerName: 'Stock', minWidth: 40, flex: 0.2 },
              { 
                field: 'actions', 
                headerName: 'Actions', 
                minWidth: 40, 
                flex: 0.3,
                sortable: false,
                type: 'number',
                renderCell: (params) => {
                  const id = params.row.id
                  return (
                    <div className='buttons'>
                      <Link to={`/admin/product/${id}`}>
                        <EditIcon />
                      </Link>
          
                      <Button
                        onClick={() =>
                          deleteProductHandler(id)
                        }
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  );
                },
              },
            ])
          } else {
            setColumns([
              { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },
    
        {
          field: "name",
          headerName: "Name",
          minWidth: 350,
          flex: 1,
        },
        {
          field: "stock",
          headerName: "Stock",
          type: "number",
          minWidth: 150,
          flex: 0.3,
        },
    
        {
          field: "price",
          headerName: "Price",
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
              <div className='buttons'>
                <Link to={`/admin/product/${id}`}>
                  <EditIcon />
                </Link>
    
                <Button
                  onClick={() =>
                    deleteProductHandler(id)
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

      if(!products){
        return <Loader />
      }

      const deleteProductHandler = async (id) => {
        try {
            await deleteProductAdmin(id)
        } catch (error) {

        }
      }

      const rows = products.map(item => ({
        id: item._id,
        stock: item.stock,
        price: item.price,
        name: item.name,
      }))

  return (
    <>
        <Metadata title={`ALL PRODUCTS - Admin`} />

        <div className="dashboard">
          <div className='board-desktop'>
            <Sidebar />
          </div>
          <div className={mobileFilterOpen ? 'board-mobile board-active': 'board-mobile'}>
            {mobileFilterOpen ? <div className='dashboard-menu'> <KeyboardArrowDownIcon onClick={()=> setMobileFilterOpen(false)} /> </div>: <div className='dashboard-menu'> <KeyboardArrowRightIcon onClick={()=> setMobileFilterOpen(true)} />Menu</div>}
            {mobileFilterOpen && <Sidebar />}
          </div>

          <div className="productListContainer">
              <h1 id="productListHeading">ALL PRODUCTS</h1>

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

export default AllProducts