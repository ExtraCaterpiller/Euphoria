import { NavLink } from 'react-router-dom'
import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Hamburger from './Hamburger'
import Logo from '../../../images/Logo.png'
import './Header.css'
import { useSelector } from 'react-redux';

const Header = () => {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useSelector(state => state.user)
    const [search, setSearch] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate(`/shop?keyword=${search}`)
        setSearch('')
    }
    
    return (
    <Fragment>
        <header className='header'>
            <div className='left'>
                <img src={Logo} alt="Euphoria" />
            </div>
            <div className='middle'>
                <NavLink to={'/'}  className={"link"}>Home</NavLink>
                <NavLink to={'/shop'}  className={"link"}>Shop</NavLink>
            </div>
            <div className='right'>
            <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" ></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <g> <rect width="24" height="24" fill="white"></rect> <circle cx="10.5" cy="10.5" r="6.5" stroke="#525252" ></circle> <path d="M19.6464 20.3536C19.8417 20.5488 20.1583 20.5488 20.3536 20.3536C20.5488 20.1583 20.5488 19.8417 20.3536 19.6464L19.6464 20.3536ZM20.3536 19.6464L15.3536 14.6464L14.6464 15.3536L19.6464 20.3536L20.3536 19.6464Z" fill="#525252"></path> </g> <defs> <clipPath id="clip0_15_152"> <rect width="24" height="24" fill="white"></rect> </clipPath> </defs> </g></svg>
                <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '20ch' },
                }}
                noValidate
                autoComplete="off"
                className='search'
                onSubmit={handleSubmit}
                >
                    <TextField 
                        id="outlined-basic" 
                        size='small' 
                        sx={{border: 'none',"& fieldset": { border: 'none' },}} 
                        label="Search"
                        value={search}
                        variant="outlined" 
                        onChange={(e)=>setSearch(e.target.value)}
                    />
                </Box>
                {isAuthenticated && user.role==='admin' && <DashboardIcon onClick={()=> navigate('/login?redirect=admin/dashboard')} className='dashboard'/>}
                <PersonOutlineOutlinedIcon onClick={()=>navigate('/account')} className='person'/>
                <ShoppingCartOutlinedIcon onClick={()=> navigate('/cart')} className='cart'  />
            </div>
        </header>
        <header className='mobile'>
            <div className='left-mobile'>
                <img src={Logo} alt="Euphoria" />
            </div>
            <div className='hamburger'>
                <Hamburger />
            </div>
        </header>
    </Fragment>
  )
}

export default Header