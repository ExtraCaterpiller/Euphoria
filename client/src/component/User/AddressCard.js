import React, { useState } from 'react'
import {Country, City} from 'country-state-city'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material'
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { toast, Bounce } from 'react-toastify'
import { useEditAddressMutation, useDeleteAddressMutation } from '../../features/Users/userSlice';

const AddressCard = ({ address }) => {
    const countryAddress = Country.getCountryByCode(address.country)
    const [ editAddress ] = useEditAddressMutation()
    const [ deleteAddress ] = useDeleteAddressMutation()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(address.name)
    const [phoneNo, setPhoneNo] = useState(address.phoneNo)
    const [country, setCountry] = useState(countryAddress.isoCode)
    const [city, setCity] = useState(address.city)
    const [postal, setPostal] = useState(address.postal_code)
    const [street, setStreet] = useState(address.street_address)

    const handleClickOpen = () => {
        setOpen(true)
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
        if(phoneNo.length !== 11){
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
        const newAddress = {
            name: name,
            phoneNo: phoneNo,
            country: country,
            city: city,
            postal_code: postal,
            street_address: street,
            id: address._id
        }

        await editAddress(newAddress)
        toast.success("Address Edited Successfully", {
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
        setOpen(false)
    }

    const handleRemove =async () => {
        await deleteAddress({id: address._id})
        toast.success("Address deleted Successfully", {
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

  return (
    <>
    <div>
    <div className='address-card'>
        <div className='address-card-name'>{address.name}</div>
        <div>{address.phoneNo}</div>
        <p>{address.street_address}, {address.postal_code}, {address.city}, {countryAddress.name}</p>
        <div className='address-card-btn'>
            <button onClick={handleClickOpen}>Edit</button>
            <button onClick={handleRemove}>Remove</button>
        </div>
    </div>
    
    <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle className='address-title'>ADD AN ADDRESS</DialogTitle>
            <DialogContent>

            
            <DialogContentText>Name</DialogContentText>
            <input cols="30" rows="1" defaultValue={name} onChange={(e)=>setName(e.target.value)} />
            <DialogContentText>Phone No</DialogContentText>
            <input cols="30" rows="1" type='Number' defaultValue={phoneNo} onChange={(e)=>setPhoneNo(e.target.value)} />
            <DialogContentText>Country</DialogContentText>
            <div>
                <select
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                >
                    <option value={countryAddress.isoCode}>{country}</option>
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
                  <option value={city}>{city}</option>
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
            <input cols="30" rows="1" type='Number' defaultValue={postal} onChange={(e)=>setPostal(e.target.value)} />
            <DialogContentText>Street Address</DialogContentText>
            <textarea cols="30" rows="3" defaultValue={street} onChange={(e)=>setStreet(e.target.value)}></textarea>
            </DialogContent>
            <DialogActions style={{justifyContent: 'center'}}>
                <Button onClick={handleClose}>CANCEL</Button>
                <Button onClick={handleSubmit}>ADD</Button>
            </DialogActions>
        </Dialog>
    </div>
    </>
  )
}

export default AddressCard