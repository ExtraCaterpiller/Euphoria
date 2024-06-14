import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast, Bounce } from 'react-toastify'
import { useResetPasswordMutation, clearError } from '../../features/Users/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import cover from '../../images/reset-cover.png'
import Metadata from '../Layout/Metadata'

const ResetPassword = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { token } = useParams()
    const { isAuthenticated, error } = useSelector(state=>state.user)
    const [resetPassword] = useResetPasswordMutation()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

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
        if(isAuthenticated){
            navigate('/account')
        }
    },[error, isAuthenticated, dispatch, navigate])

    const handleSubmit = async () => {
        const form = new FormData()
        form.append('password', password)
        form.append('confirmPassword', confirmPassword)

        const data = {
            token: token,
            form: form
        }

        try {
            await resetPassword(data).unwrap()
            toast.success("Password reset successfull", {
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


  return (
    <>
    <Metadata title='Password Recovery' />
    <div className='recovery-page'>
      {/* Image */}
      <div className='recovery-image'>
          <img src={cover} alt="Reovery Page Cover" />
      </div>
            <div className='recovery-form'>
                <h1>Password Recovery</h1>
                <div>
                    <div className='recovery-email'>
                        <p>Password</p>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                    <div className='recovery-email'>
                        <p>Password</p>
                        <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    </div>
                    <div className='recovery-button'>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
    </div>
    </>
  )
}

export default ResetPassword