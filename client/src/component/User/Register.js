import React, { useEffect, useState } from 'react'
import { toast, Bounce } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useRegisterUserMutation, clearError } from '../../features/Users/userSlice'
import cover from '../../images/Registration-cover.png'
import './Register.css'
import Metadata from '../Layout/Metadata'

const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated, error } = useSelector(state=> state.user)
    const [registerUser, { isSuccess }] = useRegisterUserMutation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [avatar, setAvatar] = useState('')

    useEffect(()=>{
      if(isAuthenticated){
        navigate('/account')
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
    },[isAuthenticated, error, dispatch, navigate])

    useEffect(()=>{
      if(isSuccess){
        toast.success("Registration successfull", {
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
    },[isSuccess])

    const handleSubmit = async (e) => {
      e.preventDefault()
      const data = new FormData()

      data.append('name', name)
      data.append('email', email)
      data.append('password', password)
      data.append('avatar', avatar)

      try {
        await registerUser(data)
      } catch (error) {
        
      }
    }

  return (
    <>
    <Metadata title='Register' />
    <div className='register-page'>
      {/* Image */}
      <div className='register-image'>
          <img src={cover} alt="Registration cover" />
      </div>
      {/* Form */}
      <div className='register-form'>
        <button onClick={()=>navigate('/login')} className='btn-register-1'>Login</button>
        <button className='btn-register-2'>Sign Up</button>
        <h1>Sign Up Page</h1>
        <form encType='multipart/form-data' onSubmit={handleSubmit}>
          <div className='register-name'>
            <p>Name</p>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
          </div>
          <div className='register-email'>
            <p>Email address</p>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div className='register-pass'>
            <p>Password</p>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <div className='register-avatar'>
            <p>Profile Picture</p>
            <input type="file" accept="image/*" onChange={(e)=>setAvatar(e.target.files[0])} />
          </div>
          <div className='register-button'>
            <button type='submit'>Register</button>
          </div>
          <div className='register-des'>
            <p>Already have an account? <span onClick={()=>navigate('/login')} style={{cursor: 'pointer'}}>Log In</span></p>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default Register