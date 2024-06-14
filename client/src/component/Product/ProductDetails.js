import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetSingleProductMutation, useAddReviewMutation, clearError } from '../../features/Products/productSlice'
import Loader from '../Layout/Loader/Loader'
import Rating from '@mui/material/Rating';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import MetaData from '../Layout/Metadata'
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ChatIcon from '@mui/icons-material/Chat';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import './ProductDetails.css'
import SimilarProducts from './SimilarProducts'
import { addCartItems } from '../../features/Cart/cartSlice' 
import { useDispatch, useSelector } from 'react-redux'
import { toast, Bounce } from 'react-toastify'
import ReviewCard from './ReviewCard'
import { sizes } from '../../data/data';

const ProductDetails = () => { 
    const {id} = useParams()
    const [ getSingleProduct ] = useGetSingleProductMutation()
    const [ addReview ] = useAddReviewMutation()
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [selectedSize, setSelectedSize] = useState('')
    const [activeStep, setActiveStep] = React.useState(0)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 840)
    const theme = useTheme()

    useEffect(()=>{
      async function fetchData(){
        await getSingleProduct(id)
      }
      fetchData()
    },[id, getSingleProduct])

    useEffect(()=>{
      const handleSize = () => {
        setIsMobile(window.innerWidth <= 840)
      }

      window.addEventListener('resize', handleSize)

      return () => {
        window.removeEventListener('resize', handleSize)
      }
    },[])

    const { singleProduct: product, error } = useSelector(state => state.product)

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

    if(!product){
        return <Loader />
    }

    const options = {
      size: "small",
      value: product.ratings,
      readOnly: true,
      precision: 0.5,
    }

    const increaseQuantity = () => {
      if(!selectedSize){
        toast.warn("Please Select a Size First", {
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
        return
      }
      if (Number(product.size[selectedSize]) <= quantity){
         return
      } else {
        const qty = quantity + 1
        setQuantity(qty);
      }
    }
  
    const decreaseQuantity = () => {
      if(!selectedSize){
        toast.warn("Please Select a Size First", {
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
        return
      }
      if (1 >= quantity) return;
  
      const qty = quantity - 1;
      setQuantity(qty);
    }

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

    const handleAddToCart = () => {
      if(!selectedSize){
        toast.warn("Please Select a Size", {
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
        return
      }

      const data = {
        productId: id,
        name: product.name,
        price: product.price,
        stock: product.size[selectedSize],
        size: selectedSize,
        image: product.images[0].url,
        quantity: quantity
      }

      dispatch(addCartItems(data))

      toast.success("Item added to the cart successfully", {
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

    const handleReviewSubmit = async (e) => {
      e.preventDefault()
      const form = {
        rating: rating,
        comment: comment,
        productId: id,
      }
      
      try {
        await addReview(form)
        setOpen(false)
        toast.success("Review Added Successfully", {
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
      } catch (error) {
        
      }
    }

    const images = []
    product.images.forEach(im => images.push(im.url))
    const maxSteps = images.length;

  return (
    <>
      <MetaData title={`${product.name} -- Euphoria`} />
      <div className="ProductDetails">
          <div className='carousel-price'>
            {/* Carousel */}
            <div className='carousel-container'>
              <Box sx={{ maxWidth: 400, flexGrow: 1, m: '0 auto' }}>
                <Paper
                  square
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 15,
                    pl: 2,
                    bgcolor: 'background.default',
                  }}
                >
                </Paper>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, overflow: 'hidden', p: 0 }} > {/* sx={{ height: 25, maxWidth: 40, width: '100%', p: 2 }} */}
                  <img className='image' style={{ maxHeight: '100%', maxWidth: '100%' }} src={images[activeStep]} alt="" />
                </Box>
                <MobileStepper
                  variant="dots"
                  steps={maxSteps}
                  position="static"
                  activeStep={activeStep}
                  sx={isMobile ? {display: 'flex', justifyContent: 'center', marginTop: '-2rem'} : {}}
                  nextButton={
                    <Button
                      size="small"
                      onClick={handleNext}
                      disabled={activeStep === maxSteps - 1}
                    >
                      {window.innerWidth > 840 && "Next"}
                      {theme.direction === 'rtl' ? (
                        <KeyboardArrowLeft />
                      ) : (
                        <KeyboardArrowRight />
                      )}
                    </Button>
                  }
                  backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                      {theme.direction === 'rtl' ? (
                        <KeyboardArrowRight />
                      ) : (
                        <KeyboardArrowLeft />
                      )}
                      {window.innerWidth > 840 && "Back"}
                    </Button>
                  }
                />
              </Box>
            </div>
            {/* Price and others */}
            <div>
                <div className="product-name">
                  <h2>{product.name}</h2>
                </div>
                <div className="product-rating">
                  <Rating {...options} />
                  <span style={{marginRight: '1rem'}}>{product.ratings}</span>
                  <span>
                    <ChatIcon sx={{fontSize: 'small'}} /> {product.reviews.length} Reviews
                  </span>
                </div>
                <div className='product-size'>
                  <p>Select Size -{`>`}</p>
                  {sizes.map(size=> product.size[size] >0 && <button onClick={()=>setSelectedSize(size)} key={size} style={selectedSize===size ? {backgroundColor:'#8434E1', color:'#F6F6F6', textAlign: 'center'}:{}}>{size}</button>)}
                </div>
                <div className="product-price">
                  <div className="product-details-buttons">
                    <div className="button-qnt">
                      <button onClick={decreaseQuantity}>-</button>
                      <input readOnly type="number" value={product.stock < 1 ? 0 : quantity} />
                      <button onClick={increaseQuantity}>+</button>
                    </div>
                    <div className='product-cart-price'>
                      <button className='cart-button'
                        onClick={handleAddToCart}
                        disabled={(product.stock < 1 || quantity<1) ? true : false}
                      >
                        <AddShoppingCartIcon sx={{fontSize: 'small', marginRight: '0.5rem' }}/>Add to Cart
                      </button>
                      <button className='price-button'>{product.stock>0 ? `$${product.price*quantity}` : 0}</button>
                    </div>
                  </div>

                  <p>
                    Status:
                    <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                      {product.stock < 1 ? " Out Of Stock" : " In Stock"}
                    </b>
                  </p>
              </div>
            </div>  
          </div>

          {/* Description and reviews */}
          <div className='product-des-mobile'>
            {/* Description */}
            <div>
              <div className="product-des">
                <div className='desc-1'>
                  <div className='vertical-line'></div>
                  Product Description :
                </div>
                <div className='desc-2'>
                  <p>{product.description}</p>
                  <p>Gender : {product.gender.toUpperCase()}</p>
                  <p>Style : {product.style.toUpperCase()}</p>
                </div>
              </div>
            </div>
            {/* Reviews */}
            <div>
                <div className='desc-1'>
                  <div className='vertical-line'></div>
                  Reviews :
                </div>
                <div className='product-review'>
                  {product.reviews.slice().reverse().map((rev)=> <ReviewCard key={rev._id} review={rev} />)}
                </div>
            </div>
          </div>

          <div className='product-review-diag'>
            <button onClick={()=>setOpen(!open)}>Add Review</button>
              <Dialog
              aria-labelledby="simple-dialog-title"
              open={open}
              onClose={()=>setOpen(false)}
              >
              <DialogTitle sx={{textAlign: 'center'}}>Submit Review</DialogTitle>
              <DialogContent className="submit-dialog">
                <Rating
                  onChange={(e) => setRating(e.target.value)}
                  value={rating}
                  size="large"
                />

                <textarea
                  className="submit-dialog-textarea"
                  cols="30"
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </DialogContent>
              <DialogActions  className='review-submit-buttons'>
                <Button onClick={()=>setOpen(false)} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleReviewSubmit} color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </div>

          <div className='product-similr-product-mobile'>
            {/* Similar Products */}
              <div className='desc-1'>
                  <div className='vertical-line'></div>
                  Similar Product :
              </div>
              <div className='similar-product'>
                  <SimilarProducts category={product.category} style={product.style} currentId={product._id}/>
              </div>
          </div>
          
      </div>
    </>
  )
}

export default ProductDetails