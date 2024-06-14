import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetUserInfoAdminMutation, useUpdateUserRoleAdminMutation, clearError } from '../../features/Users/userSlice'
import { toast, Bounce } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Layout/Loader/Loader'
import Metadata from '../Layout/Metadata'
import Sidebar from './Sidebar'
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import './UpdateUser.css'

const UpdateUser = () => {
    const {id} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [getUserInfoAdmin] = useGetUserInfoAdminMutation()
    const [updateUserRoleAdmin, { isSuccess }] = useUpdateUserRoleAdminMutation()

    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(false)
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

    useEffect(()=>{
      async function fetchData(){
        await getUserInfoAdmin(id).unwrap()
      }
      fetchData()
    },[getUserInfoAdmin, id])

    const { userInfo, error } = useSelector(state => state.user)

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

      if(isSuccess){
        toast.success(`User role changed to ${role}`, {
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
        navigate('/admin/users')
      }
    },[error, dispatch, isSuccess, navigate])

    if(!userInfo){
      return  <Loader />
    }

    const updateUserSubmitHandler = async (e) => {
      e.preventDefault()
      setLoading(true)
      const data = {
        id: id,
        role: role
      }

      try {
        await updateUserRoleAdmin(data)
      } catch (error) {
      
      }
      setLoading(false)
    }

  return (
    <>
      <Metadata title="Update User" />
      <div className="dashboard">
        <div className='board-desktop'>
          <Sidebar />
        </div>
        <div className={mobileFilterOpen ? 'board-mobile board-active': 'board-mobile'}>
          {mobileFilterOpen ? <div className='dashboard-menu'> <KeyboardArrowDownIcon onClick={()=> setMobileFilterOpen(false)} /> </div>: <div className='dashboard-menu'> <KeyboardArrowRightIcon onClick={()=> setMobileFilterOpen(true)} />Menu</div>}
          {mobileFilterOpen && <Sidebar />}
        </div>

        <div className="newProductContainer">
          <form
              className="update-user-form"
              onSubmit={updateUserSubmitHandler}
            >
              <h1 className='update-user-form-title'>Update User</h1>
              <img src={userInfo.avatar.url} alt="" />
              <div>
                <PersonIcon />
                {userInfo.name}
              </div>
              <div>
                <MailOutlineIcon />
                {userInfo.email}
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <button
                className='update-user-submit'
                type="submit"
                disabled={
                  loading ? true : false || role === "" ? true : false
                }
              >
                Update
              </button>
            </form>
        </div>
      </div>
    </>
  )
}

export default UpdateUser