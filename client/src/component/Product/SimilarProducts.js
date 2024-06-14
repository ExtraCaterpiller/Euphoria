import React, {useEffect, useState} from 'react'
import { useGetProductsQuery } from '../../features/Products/productSlice'
import ProductCard from './ProductCard'
import Loader from '../Layout/Loader/Loader'

const SimilarProducts = ({category, style, currentId}) => {
    const [products, setProducts] = useState([]);

  // Fetch products based on category
  const queryParams1 = new URLSearchParams();
  queryParams1.append('category', category);
  const { data: data1, isLoading: isLoading1 } = useGetProductsQuery(queryParams1.toString());

  // Fetch products based on style
  const queryParams2 = new URLSearchParams();
  queryParams2.append('style', style);
  const { data: data2, isLoading: isLoading2} = useGetProductsQuery(queryParams2.toString())

  useEffect(() => {
    if (!isLoading1 && data1) {
      const newProducts = Object.values(data1.entities).filter(({ id }) => id !== currentId)
      setProducts([...newProducts])
    }
  }, [isLoading1, data1, currentId])

  useEffect(() => {
    if (!isLoading2 && data2) {
      const newProducts = Object.values(data2.entities).filter(({ id }) => (id !== currentId && !products.includes(data2.entities[id])))
      setProducts(newProducts);
    }
  }, [isLoading2, data2, currentId])

  if (isLoading1 || isLoading2) {
    return <Loader />;
  }

  if(products.length<=0){
    return (
      <>
        <div style={{textAlign: 'center', marginTop: '1rem', marginBottom: '1rem'}}>Coming Soon</div>
      </>
    )
  }

    return (
    <>
        {products.map((p)=> p._id!==currentId && <ProductCard key={p._id} product={p} />)}
    </>
  )
}

export default SimilarProducts