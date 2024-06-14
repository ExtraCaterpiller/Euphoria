import React, { useEffect, useState } from 'react'
import loginCover from '../../images/login-image.png'
import './Login.css'
import { useGetStripeKeyMutation } from '../../features/Payment/paymentSlice'
import { useLoginMutation, clearError } from '../../features/Users/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify'
import Metadata from '../Layout/Metadata'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {error, isAuthenticated }= useSelector(state=> state.user)

  const [login] = useLoginMutation()
  const [getStripeKey] = useGetStripeKeyMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const myForm = new FormData()
    myForm.set('email', email)
    myForm.set('password', password)

    try {
      await login(myForm)
    } catch (error) {
      
    }
  }

  const redirect = location.search ? `/${location.search.split('=')[1]}` : '/account'

  useEffect(()=>{
    if(isAuthenticated){
      getStripeKey()
      navigate(redirect)
    }
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
  },[error, isAuthenticated, navigate, redirect, dispatch, getStripeKey])

  return (
    <>
    <Metadata title='Login' />
    <div className='login-page'>
      {/* Image */}
      <div className='login-image'>
          <img src={loginCover} alt="" />
      </div>
      {/* Form */}
      <div className='login-form'>
        <button className='btn-login'>Login</button>
        <button onClick={()=>navigate('/register')} className='btn-register'>Sign Up</button>
        <h1>Sign In Page</h1>
        <div>
          <div className='login-email'>
            <p>Email address</p>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div className='login-pass'>
            <p>Password</p>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <div className='login-button'>
            <button onClick={handleSubmit}>Login</button>
          </div>
          <div className='login-des'>
            <p>Don't have an account? <span style={{cursor: 'pointer'}} onClick={()=>navigate('/register')}>Sign up</span></p>
            <p>Forgot your password? Click <span style={{cursor: 'pointer'}} onClick={()=>navigate('/password/forgot')}>here</span></p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login