import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast, Bounce } from 'react-toastify'
import { clearError, useForgotPasswordMutation } from '../../features/Users/userSlice'
import { useNavigate } from 'react-router-dom'
import cover from '../../images/Forgot-Password.png'
import './ForgotPassword.css'
import Metadata from '../Layout/Metadata'

const ForgotPassword = () => {
    const { error } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [forgotPassword] = useForgotPasswordMutation()
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(false)

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
        }
        dispatch(clearError())
    },[error, dispatch])

    const handleSubmit = async () => {
        const data = new FormData()
        data.append('email', email)
        try {
            const res = await forgotPassword(data)
            toast.success(res.message, {
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
            setSuccess(true)
        } catch (error) {
            
        }
    }

  return (
    <>
    <Metadata title='Password Recovery' />
    <div className='recovery-page'>
      {/* Image */}
      <div className='recovery-image'>
          <img src={cover} alt="Reovery Page Cover" />
      </div>
        {
            success ? (
                <div className='recover-pass-after'>
                    <h1>Check Email</h1>
                    <p>Please check your email and click on the provided link to reset your password</p>
                    <p>Login <span onClick={()=>navigate('/login')} style={{cursor: 'pointer', textDecoration: 'Underline'}}>here</span></p>
                </div>
            ) : (
                <div className='recovery-form'>
                    <h1>Password Recovery</h1>
                    <div>
                        <div className='recovery-email'>
                            <p>Email address</p>
                            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        </div>
                        <div className='recovery-button'>
                            <button onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
    </>
  )
}

export default ForgotPassword