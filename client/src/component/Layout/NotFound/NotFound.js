import React from 'react'
import { useNavigate } from 'react-router-dom'
import im from '../../../images/Frame-404.png'
import Metadata from '../Metadata'
import './NotFOund.css'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <>
    <Metadata title='Error' />
    <div className='error-page'>
        <img src={im} alt="Not Found" />
        <button onClick={()=>navigate('/')}>Back To HomePage</button>
    </div>
    </>
  )
}

export default NotFound