import React, { useState, useEffect } from 'react'
import { Rating } from '@mui/material'
import Person2Icon from '@mui/icons-material/Person2';
import './ReviewCard.css'

const ReviewCard = ({review}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 840)

  useEffect(()=>{
    const handleSize = () => {
      setIsMobile(window.innerWidth <= 840)
    }

    window.addEventListener('resize', handleSize)

    return () => {
      window.removeEventListener('resize', handleSize)
    }
  },[])

    const options = {
        value: Number(review.rating),
        readOnly: true,
        precision: 0.5,
      }

  return (
    <div className="reviewCard">
        <div className='review-user'>
            <Person2Icon />
            <p>{review.name}</p>
        </div>
      <Rating {...options} size={isMobile ? 'small' : 'medium'} />
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  )
}

export default ReviewCard