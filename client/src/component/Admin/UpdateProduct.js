import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetSingleProductMutation, clearError, useUpdateProductAdminMutation } from '../../features/Products/productSlice'
import { toast, Bounce } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../Layout/Loader/Loader'
import Metadata from '../Layout/Metadata'
import Sidebar from './Sidebar'
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import StyleIcon from '@mui/icons-material/Style';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { FormGroup, FormLabel } from '@mui/material';
import { styles, categories, genders, sizes } from '../../data/data'

const UpdateProduct = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [images, setImages] = useState([])
    const [size, setSize] = useState({
      XXL: 0,
      XL: 0,
      L: 0,
      M: 0,
      S: 0,
      XS: 0,
    })
    const [style, setStyle] = useState('')
    const [gender, setGender] = useState('')
    const [imagesPreview, setImagesPreview] = useState([])
    const [loading, setLoading] = useState(false)
    const [isChanged, setIsChanged] = useState(false)
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const [getSingleProduct] = useGetSingleProductMutation()
    const [updateProductAdmin, { isSuccess }] = useUpdateProductAdminMutation()

    useEffect(()=>{
      async function fetchData(){
        await getSingleProduct(id)
      }
      fetchData()
    },[getSingleProduct, id])

    const { singleProduct: product, error } = useSelector(state => state.product)

    useEffect(()=>{
      if(product){
        setName(product.name)
        setPrice(product.price)
        setDescription(product.description)
        setCategory(product.category)
        setStyle(product.style)
        setGender(product.gender)
        Object.keys(product.size).map(k => setSize(prev => ({
          ...prev,
          [k] : Number(product.size[k])
        })))
        setImagesPreview(product.images.map(im => im.url))
      }
    },[product])

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
        toast.success("Product Updated Successfully", {
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
        navigate('/admin/products')
      }
    },[error, dispatch, isSuccess, navigate])

    if(!product){
      return <Loader />
    }

    const handleSizeChange = (e, sizeName) => {
      const {value} = e.target
      setSize((prev)=>({
        ...prev,
        [sizeName]: value,
      }))
    }

    const productImagesHandler = (e) => {
        const file = e.target.files[0]
        setImages((prev)=> [...prev, file])
        if(isChanged){
          const preview = URL.createObjectURL(file)
          setImagesPreview((prev)=>[...prev, preview])
        } else {
          const preview = URL.createObjectURL(file)
          setImagesPreview([preview])
          setIsChanged(true)
        }
    }

    const updateProductSubmitHandler = async (e) => {
      e.preventDefault()
      setLoading(true)
      if(!description || !category || !style || !gender || !name || !price){
          toast.error("Please fill in all the fields", {
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

      const stock = Object.keys(size).reduce((acc, s)=> acc+Number(size[s]), 0)

      const data = new FormData()
      data.append('name', name)
      data.append('description', description)
      data.append('price', price)
      data.append('category', category)
      data.append('stock', stock)
      data.append('size', JSON.stringify(size))
      data.append('style', style)
      data.append('gender', gender)

      if(images.length >0){
        images.forEach((image, index) => {
          data.append('images', image)
        })
      }

      const info = {
        data: data,
        id: id
      }

      try{
        await updateProductAdmin(info)
      } catch(error){

      }
      setLoading(false)
    }

  return (
    <>
      <Metadata title="Create Product" />
      <div className="dashboard">
        <div className='board-desktop'>
          <Sidebar />
        </div>
        <div className={mobileFilterOpen ? 'board-mobile board-active': 'board-mobile'}>
          {mobileFilterOpen ? <div className='dashboard-menu'> <KeyboardArrowDownIcon onClick={()=> setMobileFilterOpen(false)} /> </div>: <div className='dashboard-menu'> <KeyboardArrowRightIcon onClick={()=> setMobileFilterOpen(true)} />Menu</div>}
          {mobileFilterOpen && <Sidebar />}
        </div>

        <div className="newProductContainer">
            <h1 className='newProduct-title'>Update Product</h1>
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateProductSubmitHandler}
          >

            <div className='newProduct-div'>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='newProduct-div'>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Price"
                value={price}
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className='newProduct-div'>
              <DescriptionIcon />

              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            <div className='newProduct-div'>
              <AccountTreeIcon />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className='newProduct-div'>
              <StyleIcon />
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                <option value="">Select Style</option>
                {styles.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div className='newProduct-div'>
              <StyleIcon />
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                {genders.map((gn) => (
                  <option key={gn} value={gn}>
                    {gn}
                  </option>
                ))}
              </select>
            </div>

            <div>
                <FormLabel className='newProduct-select' component="legend">Input Sizes</FormLabel>
                <FormGroup row>
                    {
                        sizes.map(sizeName => (
                            <div className='newProduct-select-size'>
                              <label>{sizeName}:</label>
                              <input
                                type="number"
                                value={size[sizeName]}
                                onChange={(e)=>handleSizeChange(e, sizeName)}
                              />
                            </div>
                        ))
                    }
                </FormGroup>
            </div>

            <div id="productFormImage">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={productImagesHandler}
                multiple
              />
            </div>

            <div className='image-container'>
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading ? true : false}
              className='newProduct-btn'
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default UpdateProduct