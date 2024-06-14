import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartItems } from '../../features/Cart/cartSlice'
import { clearError } from '../../features/Users/userSlice'
import { toast, Bounce } from 'react-toastify'
import AddressCard from '../User/AddressCard'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material'
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { useAddAddressMutation } from '../../features/Users/userSlice'
import { Country, City }  from 'country-state-city';
import Metadata from '../Layout/Metadata'
import './CheckOut.css'

const CheckOut = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [addAddress, { isSuccess }] = useAddAddressMutation()
    const cartItems = useSelector(selectCartItems)
    const [address, setAddress] = useState('')
    const [open, setOpen] = useState(false)
    const [name, setName] = useState()
    const [phoneNo, setPhoneNo] = useState()
    const [country, setCountry] = useState()
    const [city, setCity] = useState()
    const [postal, setPostal] = useState()
    const [street, setStreet] = useState()

    const { user, error } = useSelector(state => state.user)

    const subtotal = cartItems.reduce((acc, item) => acc+Number(item.quantity) * Number(item.price), 0)

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

        if(isSuccess){
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
    },[error, isSuccess, dispatch])

    const handleProceed = async () => {
        if(!address){
            toast.error("Please select a shipping address", {
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

        const orderInfo = {
            shippingInfo: address,
            orderItems: cartItems,
            itemsPrice: subtotal,
            taxPrice: subtotal*0.1,
            shippingPrice: 15,
            totalPrice: subtotal+subtotal*0.1+15,
        }

        sessionStorage.setItem("orderInfo", JSON.stringify(orderInfo))
        navigate('/payment')
    }

    const handleClose = () => {
        setOpen(false)
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

    return (
        <>
        <Metadata title='CheckOut' />
        <div className='checkout'>
            {/* Address and order info */}
            <div className='checkout-upper'>
                <div>
                    <h3>Select a Shipping Address:</h3>
                    {user.addresses.length===0 && <div className='checkout-no-address'>No addresses found</div>}
                    {user.addresses.map(addr => <div key={addr._id} className={address._id===addr._id ? "selected addr" : "notselected addr"} onClick={()=>setAddress(addr)}> <AddressCard address={addr} /></div>)}
                    <button onClick={()=>setOpen(true)} className='checkout-add-address-btn'>Add a new Address</button>
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
                </div>
                <div>
                    <h3>Order Summary</h3>
                    {cartItems.map((item, index)=>(<div key={index} className='checkout-cart'>
                        <div>
                            <img src={item.image} alt="" />
                            <div>
                                <div>{item.name} * {item.quantity}</div>
                                <div>Size: {item.size}</div>
                            </div>
                        </div>
                        <div>Price:{item.price * item.quantity}</div>
                    </div>))}
                    <div className='checkout-prices'>
                        <div>Subtotal:  {subtotal}</div>
                        <div>Tax:  {subtotal*.1}</div>
                        <div>Shipping:  $15</div>
                        <div>Total:  {subtotal+15+subtotal*.1}</div>
                    </div>
                </div>
            </div>
            {/* Proceed to Payment */}
            <div className='checkout-lower'>
                <button onClick={handleProceed}>Proceed to Payment</button>
            </div>
        </div>
        </>
    )
}

export default CheckOut