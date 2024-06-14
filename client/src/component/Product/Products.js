import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { useGetProductsQuery } from '../../features/Products/productSlice'
import Loader from '../Layout/Loader/Loader'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import Pagination from '@mui/material/Pagination';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Stack from '@mui/material/Stack';
import { toast, Bounce } from 'react-toastify'
import { categories, styles } from '../../data/data';
import './Products.css'
import Metadata from '../Layout/Metadata';
import { useSearchParams } from 'react-router-dom';

const Products = () => {
    const [selectedCategory, setSelectedCategory] = useState('')
    const [priceRange, setPriceRange] = useState({ from: '', to: '' })
    const [selectedStyle, setSelectedStyle] = useState('')
    const [selectedGender, setSelectedGender] = useState('')
    const [currPage, setCurrPage] = useState(1)
    const [queryParams, setQueryParams] = useState('')
    const [header, setHeader] = useState('Shop')
    const [searchParams] = useSearchParams()
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

    const keyword = searchParams.get("keyword")

    const getQueryParams = () => {
        const params = new URLSearchParams()
    
        if (selectedCategory) params.append('category', selectedCategory)
        if (priceRange.from) params.append('price[gte]', priceRange.from)
        if (priceRange.to) params.append('price[lte]', priceRange.to)
        if (selectedStyle) params.append('style', selectedStyle)
        if (currPage) params.append('page', currPage)
        if (selectedGender) params.append('gender', selectedGender)
        if (keyword) params.append('keyword', keyword)

        return params.toString()
      }

      const applyFilters = () => {
        setCurrPage(1)
        setQueryParams(getQueryParams())
        let h = "Shop "
        if(selectedCategory){
            h = h+`/ ${selectedCategory} `
        }
        if(selectedGender){
            h = h+ `/ ${selectedGender} `
        }
        if(selectedStyle){
            h = h+`/ ${selectedStyle} `
        }
        setHeader(h)
        setMobileFilterOpen(false)
      }

      const {data, isLoading} = useGetProductsQuery(queryParams)
      
      useEffect(()=>{
        setQueryParams(getQueryParams())
      },[currPage, keyword])

      useEffect(()=>{
        if(data && data.filteredProductsCount<=0){
            toast.error("No product found", {
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
      },[data])

      if(isLoading){
        return <Loader />
      }

      const {filteredProductsCount} = data
      const totalPage = filteredProductsCount/8===1 ? Math.floor(filteredProductsCount/8) : Math.floor(filteredProductsCount/8)+1

      const ClearParams = () => {
        setSelectedCategory('')
        setSelectedStyle('')
        setPriceRange({from: '', to: ''})
        setSelectedGender('')
        const par = new URLSearchParams()
        par.append('page', currPage)
        setQueryParams(par.toString())
        setHeader('Shop')
      }

      const handlePageChange =(event, page) => {
        setCurrPage(page)
      }

  return (
    <>
    <Metadata title='Shop' />
    <section className='shop'>
        <div className='filter'>
            <div className='filter-title'>
                <h1>Filter</h1>
                {selectedCategory==='' && selectedStyle==='' && selectedGender==='' ? <FilterAltIcon /> : <FilterAltOffIcon style={{cursor:'pointer'}} onClick={()=>ClearParams()} />}
            </div>
            <ul className='category'>
                {categories.map(cat=><button key={cat} style={selectedCategory===cat ? {backgroundColor:'#8434E1', color: '#F6F6F6', textAlign:'center'}:{}} onClick={()=>setSelectedCategory(cat)}>{cat}</button>)}
            </ul>

            <h2>Price</h2>
            <div className='price'>
                <div>
                    <span>From:</span>
                    <input type="number" value={priceRange.from} onChange={(e)=>setPriceRange({...priceRange, from:e.target.value})}/>
                </div>
                <div>
                    <span>To:</span>
                    <input type="number" value={priceRange.to} onChange={(e)=>setPriceRange({...priceRange, to:e.target.value})}/>
                </div>
            </div>

            <h2>Gender</h2>
            <div>
                <select className='gender-select' value={selectedGender} onChange={(e)=>setSelectedGender(e.target.value)}>
                    <option value="" key="">Select Gender</option>
                    <option value="Male" key="male">Male</option>
                    <option value="Female" key="female">Female</option>
                </select>
            </div>

            <h2>Style</h2>
            <div>
                <ul className='style'>
                    {styles.map(st=><button key={st} onClick={()=>setSelectedStyle(st)} style={selectedStyle===st ? {backgroundColor:'#8434E1', color: '#F6F6F6', textAlign:'center'}:{}}>{st}</button>)}
                </ul>
            </div>
            <div className='button'>
                <button onClick={()=>applyFilters()}>Search</button>
                <button onClick={()=>ClearParams()}>Clear</button>
            </div>
        </div>
        <div className='filter-mobile'>
            <div  className='filter-title'>
                <h1>Filter</h1>
                <div onClick={()=>setMobileFilterOpen(!mobileFilterOpen)}>{mobileFilterOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowLeftIcon />}</div>
            </div>
            {
                mobileFilterOpen && <>
                <ul className='category'>
                {categories.map(cat=><button key={cat} style={selectedCategory===cat ? {backgroundColor:'#8434E1', color: '#F6F6F6', textAlign:'center'}:{}} onClick={()=>setSelectedCategory(cat)}>{cat}</button>)}
            </ul>

            <h2>Price</h2>
            <div className='price'>
                <div>
                    <span>From:</span>
                    <input type="number" value={priceRange.from} onChange={(e)=>setPriceRange({...priceRange, from:e.target.value})}/>
                </div>
                <div>
                    <span>To:</span>
                    <input type="number" value={priceRange.to} onChange={(e)=>setPriceRange({...priceRange, to:e.target.value})}/>
                </div>
            </div>

            <h2>Gender</h2>
            <div>
                <select className='gender-select' value={selectedGender} onChange={(e)=>setSelectedGender(e.target.value)}>
                    <option value="" key="">Select Gender</option>
                    <option value="Male" key="male">Male</option>
                    <option value="Female" key="female">Female</option>
                </select>
            </div>

            <h2>Style</h2>
            <div>
                <ul className='style'>
                    {styles.map(st=><button key={st} onClick={()=>setSelectedStyle(st)} style={selectedStyle===st ? {backgroundColor:'#8434E1', color: '#F6F6F6', textAlign:'center'}:{}}>{st}</button>)}
                </ul>
            </div>
            <div className='button'>
                <button onClick={()=>applyFilters()}>Search</button>
                <button onClick={()=>ClearParams()}>Clear</button>
            </div>
                </>
            }
        </div>
        <div className='grid-right'>
            <p>{header}</p>
            <div className='products'>
                {filteredProductsCount>0 && data.ids.map(id => <ProductCard key={id} product={data.entities[id]} />)}
            </div>

            {filteredProductsCount>0 ? (<div className='pagination'>
                <Stack spacing={2}>
                    <Pagination 
                        count={totalPage} 
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        shape="rounded" 
                        onChange={handlePageChange}
                    />
                </Stack>
            </div>) : <></>}
        </div>
    </section>
    </>
  )
}

export default Products