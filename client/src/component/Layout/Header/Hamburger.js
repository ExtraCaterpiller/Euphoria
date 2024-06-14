import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom'
import './Header.css'

const Hamburger = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleSubmit = (e) => {
      e.preventDefault()
      navigate(`/shop?keyword=${search}`)
      setSearch('')
  }

  const handleClick = (path) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <div className='hamburger-menu'>
      <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '10ch' },
          }}
                noValidate
                autoComplete="off"
                className='search'
                onSubmit={handleSubmit}
                >
                  <TextField 
                      id="outlined-basic" 
                      size='small' 
                      sx={{border: 'none',"& fieldset": { border: 'none' }}} 
                      label="Search"
                      value={search}
                      variant="outlined" 
                      onChange={(e)=>setSearch(e.target.value)}
                  />
      </Box>
      <i onClick={()=>setOpen(!open)}>{open ? <CloseIcon />: <MenuIcon />}</i>
      {open && (
        <ul className={`menu ${open ? 'open' : ''}`}>
          <li onClick={()=>handleClick('/admin/dashboard')}><DashboardIcon /></li>
          <li onClick={()=>handleClick('/')}>Home</li>
          <li onClick={()=>handleClick('/shop')}>Shop</li>
          <li onClick={()=>handleClick('/account')}><PersonOutlineOutlinedIcon /></li>
          <li onClick={()=>handleClick('/cart')}><ShoppingCartOutlinedIcon /></li>
        </ul>
      )}
    </div> 
  )
}

export default Hamburger