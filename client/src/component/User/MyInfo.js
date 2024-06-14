import React, { useEffect, useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material'
import { Country, City }  from 'country-state-city';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { toast, Bounce } from 'react-toastify'
import { useAddAddressMutation, useUpdateUserProfileMutation, useUpdatePasswordMutation, clearError } from '../../features/Users/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import './MyInfo.css'
import AddressCard from './AddressCard';

const MyInfo = ({ user }) => {
    const {error} = useSelector(state=> state.user)
    const dispatch = useDispatch()
    const [addAddress, { isSuccess: addAddressSuccess }] = useAddAddressMutation()
    const [updateUserProfile, { isSuccess: updateProfileSuccess }] = useUpdateUserProfileMutation()
    const [updatePassword, { isSuccess: UpdatePasswordSuccess }] = useUpdatePasswordMutation()
    const [open, setOpen] = useState(false)
    const [dOpen, setDOpen] = useState(false)
    const [pOpen, setPOpen] = useState(false)
    const [name, setName] = useState()
    const [phoneNo, setPhoneNo] = useState()
    const [country, setCountry] = useState()
    const [city, setCity] = useState()
    const [postal, setPostal] = useState()
    const [street, setStreet] = useState()
    const [userName, setUserName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [avatar, setAvatar] = useState()
    const [userPhoneNo, setUserPhoneNo] = useState(user.phone_no)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
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
        }
        dispatch(clearError())
    },[error, dispatch])

    useEffect(()=>{
        if(addAddressSuccess){
            toast.success("Address added successfully", {
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
        if(updateProfileSuccess){
            toast.success("Info updated successfully", {
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
        if(UpdatePasswordSuccess){
            toast.success("Password changed successfully", {
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
    },[UpdatePasswordSuccess, updateProfileSuccess, addAddressSuccess])

    const handleClickOpen = () => {
        setOpen(true)
    }
    
    const handleClose = () => {
        setOpen(false)
    }

    const handleDetailsOpen = () => {
        setDOpen(true)
    }

    const handleDetailsClose = () => {
        setDOpen(false)
    }

    const handlePOpen = () => {
        setPOpen(true)
    }

    const handlePClose = () => {
        setPOpen(false)
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
    }

    const handlePasswordSubmit = async () => {
        const data = new FormData()
        data.append('oldPassword', oldPassword)
        data.append('newPassword', newPassword)
        data.append('confirmPassword', confirmPassword)

        try {
            await updatePassword(data)
            setPOpen(false)
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error) {
    
        }
    }

      const handleSubmit = async () => {
        if(!country || !city || !postal || !street || !name || !phoneNo){
            toast.error("Please fill all the fields properly", {
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
                return
        }
        let p = phoneNo
        if(p.length !== 11){
            toast.error("Please provide a correct phone no", {
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
            return
        }
        const address = {
            name: name,
            phoneNo: phoneNo,
            country: country,
            city: city,
            postal_code: postal,
            street_address: street
        }
        await addAddress(address)
        setOpen(false)
      }


    const handleDetailsSubmit = async (e) => {
        e.preventDefault()

        if(userName.length <4){
            toast.error("Username should be at least 4 character", {
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
            return
        }
        let p = userPhoneNo
        if(p.length !== 11){
            toast.error("Please provide a correct Phone Number", {
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
            return
        }
    
        const data = new FormData()
        data.append('name', userName)
        data.append('email', email)
        data.append('phoneNo', userPhoneNo)
        if(avatar){
            data.append('avatar', avatar)
        }

        try {
            await updateUserProfile(data)
            setDOpen(false)
        } catch (error) {
            
        }
    }

  return (
    <div className='myinfo'>
        <h1>My Info</h1>
            <div className='info-avatar'>
                <h3>Avatar</h3>
                <img onClick={handleDetailsOpen} src={user.avatar.url} alt="" />
            </div>
        {/* Contact */}
        <div className='info-info'>
            <h2>Contact Details</h2>
            <div className='info-name'>
                <div>
                    <p className='info-user'>Your Name</p>
                    <p>{user.name}</p>
                </div>
                <button onClick={handleDetailsOpen} className='info-btn-change'>Change</button>
            </div>
            <div className='info-mail'>
                <div>
                    <p className='info-user'>Email Address</p>
                    <p>{user.email}</p>
                </div>
                <button onClick={handleDetailsOpen} className='info-btn-change'>Change</button>
            </div>
            <div className='info-num'>
                <div>
                    <p className='info-user'>Phone Number</p>
                    <p>{user.phone_no ? user.phone_no : <button onClick={handleDetailsOpen} className='info-btn-num'>Add phone number</button>}</p>
                </div>
                {user.phone_no ? <button onClick={handleDetailsOpen} className='info-btn-change'>Change</button> : <></>}
            </div>
            <div className='info-pass'>
                <div>
                    <p className='info-user'>Password</p>
                    <p>***********</p>
                </div>
                <button onClick={handlePOpen} className='info-btn-change'>Change</button>
            </div>
        </div>
        {/* Address */}
        <div className='info-address'>
            <h1>Address</h1>
            {user.addresses ? (
            <div className='info-address-map'>
                {user.addresses.map(addr => <AddressCard key={addr._id} address={addr}/>)}
            </div>) : <></>}
            <div className='address-btn-mobile'>
                <button onClick={handleClickOpen} className='address-btn'>Add address</button>
            </div>
        </div>
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle className='address-title'>ADD AN ADDRESS</DialogTitle>
            <DialogContent>

            
            <DialogContentText>Name</DialogContentText>
            <input cols="30" rows="1" placeholder={name} onChange={(e)=>setName(e.target.value)} />
            <DialogContentText>Phone No</DialogContentText>
            <input cols="30" rows="1" type='Number' placeholder={phoneNo} onChange={(e)=>setPhoneNo(e.target.value)} />
            <DialogContentText>Country</DialogContentText>
            <div>
                <select
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                >
                    <option value="">Country</option>
                    {Country &&
                    Country.getAllCountries().map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                        </option>
                    ))}
                </select>
            </div>
            
              {country && (
              <div>
                <DialogContentText>City</DialogContentText>
                <LocationCityIcon />

                <select
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">State</option>
                  {City &&
                    City.getCitiesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            <DialogContentText>Postal Code</DialogContentText>
            <input cols="30" rows="1" type='Number' placeholder={postal} onChange={(e)=>setPostal(e.target.value)} />
            <DialogContentText>Street Address</DialogContentText>
            <textarea cols="30" rows="3" placeholder={street} onChange={(e)=>setStreet(e.target.value)}></textarea>
            </DialogContent>
            <DialogActions style={{justifyContent: 'center'}}>
                <Button onClick={handleClose}>CANCEL</Button>
                <Button onClick={handleSubmit}>ADD</Button>
            </DialogActions>
        </Dialog>
        <Dialog
            open={dOpen}
            onClose={handleDetailsClose}
        >   
            <DialogContent>
            <DialogTitle className='info-edit-title'>EDIT INFO</DialogTitle>
            <form encType='' onSubmit={handleDetailsSubmit}>
                <h4 className='info-avatar-title'>Change Avatar</h4>
                <div className='placeholder'>
                    <input type="file" id='fileInput' onChange={(e)=>setAvatar(e.target.files[0])} style={{display: 'none'}} />
                    <label htmlFor='fileInput'>
                        <img
                            src={avatar ? URL.createObjectURL(avatar) : user.avatar.url}
                            alt="Placeholder"
                            style={{
                                width: '150px',
                                height: '150px',
                                border: '2px solid #ddd',
                                borderRadius: '50%',
                                cursor: 'pointer'
                            }}
                        />
                    </label>
                </div>

                <h4>Name</h4>
                <input type="text" defaultValue={user.name} onChange={(e)=>setUserName(e.target.value)} />

                <h4>Email</h4>
                <input type="text" defaultValue={user.email} onChange={(e)=>setEmail(e.target.value)} />

                <h4>Phone No</h4>
                <input type="number" defaultValue={user.phone_no} onChange={(e)=>setUserPhoneNo(e.target.value)} />
                <DialogActions style={{justifyContent: 'center'}}>
                    <Button onClick={handleDetailsClose}>CANCEL</Button>
                    <Button type='submit'>SUBMIT</Button>
                </DialogActions>
            </form>
            </DialogContent>
        </Dialog>

        <Dialog open={pOpen} onClose={handlePClose}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <div className='pass-change'>
                    <h4>Old Password:</h4>
                    <input type="password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} />
                </div>
                <div className='pass-change'>
                    <h4>New Password:</h4>
                    <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
                </div>
                <div className='pass-change'>
                    <h4>Confirm Password:</h4>
                    <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                </div>

                <DialogActions style={{justifyContent: 'center'}}>
                    <Button onClick={handlePClose}>CANCEL</Button>
                    <Button onClick={handlePasswordSubmit}>SUBMIT</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default MyInfo

