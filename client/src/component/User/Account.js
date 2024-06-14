import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MyInfo from './MyInfo'
import MyOrders from './MyOrders'
import Loader from '../Layout/Loader/Loader'
import './Account.css'
import { useLogOutMutation, clearError } from '../../features/Users/userSlice'
import { toast, Bounce } from 'react-toastify'
import Metadata from '../Layout/Metadata'

const Account = () => {
  const dispatch = useDispatch()
    const [active, setActive] = useState(0)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const {isAuthenticated, user, error} = useSelector((state) => state.user)
    const [logOut] =  useLogOutMutation()

    useEffect(()=>{
        if(!isAuthenticated){
            navigate('/login')
        }
    },[isAuthenticated, navigate])

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
    },[error, dispatch])

    if(!user){
      return <Loader />
    }

    const handleSignOut = async () => {
      try {
        await logOut()
        navigate('/login')
        setOpen(false)
      } catch (error) {
        
      }
    }

    const handleClickOpen = () => {
      setOpen(true)
    }

    const handleClose = () => {
      setOpen(false)
    }
    
  return (
    <>
    <Metadata title='Account --Euphoria' />
    <div className='account'>
    {/* Left */}
      <div>
        {/* Name */}
        <div>
          <div className='line-container'>
              <button disabled={true} className='vertical-line'>Hello {user.name}</button>
              <p>Welcome to your account</p>
          </div>
          <div className='account-left'>
            <button onClick={()=>setActive(0)} className={active===0 ? 'isActive1' : 'notActive'}>My Info</button>
            <button onClick={()=>setActive(1)} className={active===1 ? 'isActive1' : 'notActive'}>My Orders</button>
            <button className='signout' onClick={handleClickOpen}>Sign Out</button>
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{textAlign: 'center'}}>
          SIGN OUT
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to sign out?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display:'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <Button onClick={handleClose}>Back</Button>
          <Button onClick={handleSignOut} autoFocus>
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>

      {/* Right */}
      <div className='account-right'>
          {
            active===0 ? (<MyInfo user={user} />) : (<MyOrders />)
          }
      </div>
    </div>
    </>
  )
}

export default Account