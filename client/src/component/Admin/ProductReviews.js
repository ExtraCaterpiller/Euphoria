import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Metadata from '../Layout/Metadata.js';
import Sidebar from './Sidebar.js';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../Layout/Loader/Loader.js';
import { toast, Bounce } from 'react-toastify'
import { useGetAllReviewsMutation, useDeleteReviewAdminMutation, clearError } from '../../features/Products/productSlice.js';
import './ProductReviews.css'

const ProductReviews = () => {
    const dispatch = useDispatch()
    const [getAllReviews] = useGetAllReviewsMutation()
    const [deleteReviewAdmin, { isSuccess }] = useDeleteReviewAdminMutation()
    const [productId, setProductId] = useState('')
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const [columns, setColumns] = useState([])

    const { reviews, error } = useSelector(state => state.product)

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
      toast.success("Review Deleted Successfully", {
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
        if(window.innerWidth <= 840){
          setColumns([
            { field: "id", headerName: "Review ID", minWidth: 50, flex: 0.2 },
            { field: "user", headerName: "User", minWidth: 50, flex: 0.2 },
            { field: "comment", headerName: "Comment", minWidth: 50, flex: 0.2 },
            { 
              field: "rating", 
              headerName: "Rating", 
              type: 'number',
              minWidth: 40, 
              flex: 0.2,
              cellClassName: (params) => {
                return params.row.rating >= 3? "greenColor" : "redColor";
              },
            },
            {
              field: "actions",
              flex: 0.2,
              headerName: "Actions",
              minWidth: 50,
              type: "number",
              sortable: false,
              renderCell: (params) => {
                return (
                  <div>
                    <Button
                      onClick={() =>
                        deleteReviewHandler(params.row.id)
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
            { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },
    
            {
              field: "user",
              headerName: "User",
              minWidth: 200,
              flex: 0.6,
            },
        
            {
              field: "comment",
              headerName: "Comment",
              minWidth: 350,
              flex: 1,
            },
        
            {
              field: "rating",
              headerName: "Rating",
              type: "number",
              minWidth: 180,
              flex: 0.4,
              cellClassName: (params) => {
                return params.row.rating >= 3? "greenColor" : "redColor";
              },
            },
        
            {
              field: "actions",
              flex: 0.3,
              headerName: "Actions",
              minWidth: 150,
              type: "number",
              sortable: false,
              renderCell: (params) => {
                return (
                  <div>
                    <Button
                      onClick={() =>
                        deleteReviewHandler(params.row.id)
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

    if(loading){
        return <Loader />
    }

    const productIdSubmitHandler =async (e) => {
        e.preventDefault()
        setLoading(true)
        if(productId.length !== 24){
            toast.error("Incorrect Product ID", {
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
            setLoading(false)
            return
        }
        try {
          setSearched(true)
          await getAllReviews(productId)
        } catch (error) {
          
        }
        setLoading(false)
    }


    const deleteReviewHandler =async (id) => {
        const ids = {
            productId: productId,
            id: id
        }
        try {
            await deleteReviewAdmin(ids)
        } catch (error) {
        
        }
    }


      const rows = reviews ? reviews.map(rev => ({
        id: rev._id,
        rating: rev.rating,
        comment: rev.comment,
        user: rev.name,
      })) : []

  return (
    <>
        <Metadata title={`ALL REVIEWS - Admin`} />

        <div className="dashboard">
        <div className='board-desktop'>
          <Sidebar />
        </div>
        <div className={mobileFilterOpen ? 'board-mobile board-active': 'board-mobile'}>
          {mobileFilterOpen ? <div className='dashboard-menu'> <KeyboardArrowDownIcon onClick={()=> setMobileFilterOpen(false)} /> </div>: <div className='dashboard-menu'> <KeyboardArrowRightIcon onClick={()=> setMobileFilterOpen(true)} />Menu</div>}
          {mobileFilterOpen && <Sidebar />}
        </div>

        <div className="productReviewsContainer">
            <form
            className="productReviewsForm"
            onSubmit={productIdSubmitHandler}
            >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

            <div>
                <StarIcon />
                <input
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                />
            </div>

            <button
                className='review-search'
                type="submit"
                disabled={
                loading ? true : false || productId === "" ? true : false
                }
            >
                Search
            </button>
            </form>

            {reviews && reviews.length > 0 ? (
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                className="productListTable"
                autoHeight
            />
            ) : (
              searched && 
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
            )}
        </div>
        </div>
    </>
  )
}

export default ProductReviews