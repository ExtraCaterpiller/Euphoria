import React, {Fragment} from 'react'
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PlayStore from '../../../images/playstore.png'
import AppStore from '../../../images/Appstore.png'
import './Footer.css'
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate()
  return (
    <Fragment>
      <footer className='footer'>
      <div className='info'>
        <div>
          <h1>Need Help</h1>
          <p onClick={()=>navigate('/soon')}>Contact Us</p>
          <p onClick={()=> navigate('/soon')}>Track Order</p>
          <p onClick={()=> navigate('/soon')}>FAQ's</p>
          <p onClick={()=> navigate('/soon')}>Career</p>
        </div>
        <div>
          <h1>Company</h1>
          <p onClick={()=> navigate('/soon')}>About Us</p>
          <p onClick={()=> navigate('/soon')}>Euphoria Blog</p>
          <p onClick={()=> navigate('/soon')}>Collaboration</p>
          <p onClick={()=> navigate('/soon')}>Media</p>
        </div>
        <div>
          <h1>More Info</h1>
          <p onClick={()=> navigate('/soon')}>Terms and Conditions</p>
          <p onClick={()=> navigate('/soon')}>Privacy Policy</p>
          <p onClick={()=> navigate('/soon')}>Shipping Policy</p>
        </div>
        <div>
          <h1>Location</h1>
          <h5>support@euphoria.com</h5>
          <h5>Banani, Dhaka, Bangladesh</h5>
        </div>
      </div>
      
      <div className='icons'>
        <div className='social'>
          <FacebookIcon fontSize='large' style={{cursor:'pointer'}} />
          <InstagramIcon fontSize='large' style={{cursor:'pointer'}} />
          <LinkedInIcon fontSize='large' style={{cursor:'pointer'}} />
        </div>
        <div className='download'>
          <h1>Download The App</h1>
          <img src={PlayStore} alt="playstore" style={{cursor:'pointer'}} />
          <img src={AppStore} alt="appstore" style={{cursor:'pointer'}} />
        </div>
      </div>
      <div className='copyright'><span>Copyright © 2024 Euphoria Ltd. All rights reserved</span></div>
      </footer>


      <footer className='mobile-footer'>
        <ul>
          <li onClick={()=> navigate('/soon')}>Terms and Conditions</li>
          <li onClick={()=> navigate('/soon')}>Privacy Policy</li>
          <li onClick={()=> navigate('/soon')}>Contact Us</li>
          <li onClick={()=> navigate('/soon')}>About Us</li>
          <li onClick={()=> navigate('/soon')}>Career</li>
          <li className='social-mobile'>
          <FacebookIcon fontSize='large' />
          <InstagramIcon fontSize='large' />
          <LinkedInIcon fontSize='large' />
          </li>
          <li className='copyright-mobile'><span>Copyright © 2024 Euphoria Ltd. All rights reserved</span></li>
        </ul>
      </footer>
    </Fragment>
  )
}

export default Footer