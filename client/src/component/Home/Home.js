import React, { Fragment, useState } from 'react'
import ProductCard from '../Product/ProductCard'
import { useGetProductsQuery } from '../../features/Products/productSlice'
import Loader from '../Layout/Loader/Loader.js'
import cover1 from '../../images/cover-1.jpg'
import cover2 from '../../images/cover-2.jpg'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom'
import { toast, Bounce } from 'react-toastify'
import Metadata from '../Layout/Metadata.js'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()
  const covers = [cover1, cover2]
  const [currentIndex, setCurrentIndex] = useState(0)

  const params = new URLSearchParams()
  params.append('page', 1)

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? covers.length - 1 : prevIndex - 1
    )
  }

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === covers.length - 1 ? 0 : prevIndex + 1
    )
  }

  const {
    data,
    isLoading,
    isError,
    error
  } = useGetProductsQuery(params.toString())

  if(isLoading){
    return <Loader />
  }

  if(isError){
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
  }

  const content1 = (
    <>
        <p>T-Shirt / Tops</p>
        <h1>Summer</h1>
        <h1>Value Pack</h1>
        <span>cool / colorful / comfy</span>
        <button onClick={()=>navigate('/shop')} className='button1'>Shop Now</button>
    </>
  )
  const content2 = (
    <>
        <p>Low Price</p>
        <h1>High Coziness</h1>
        <span>UPTO 50% OFF</span>
        <p onClick={()=>navigate('/shop')}  className='button2'>Explore Items</p>
    </>
  )

  return (
    <Fragment>
      <Metadata title='Home' />
      <div className='cover-container'>
        <ArrowBackIosIcon className='arrow1' onClick={()=>handlePrevClick()} />
        <img src={covers[currentIndex]} className={currentIndex===0 ? 'img1':'img2'} alt="Cover" />
        <div className='img-tops'>
          {currentIndex===0 ? content1 : content2}
        </div>
        <ArrowForwardIosIcon className='arrow2' onClick={()=>handleNextClick()} />
      </div>
      <div className='featured'>Featured</div>
      <div className='products-container'>
        {data.ids.map((id)=><ProductCard key={id} product={data.entities[id]}/>)}
      </div>
      <div className='home-shop-btn'><button onClick={()=>{navigate('/shop')}}>GO TO SHOP</button></div>
    </Fragment>
  )
}

export default Home