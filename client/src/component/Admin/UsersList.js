import React, { useEffect, useState } from 'react'
import { useGetAllUsersAdminMutation, useDeleteUserAdminMutation, clearError } from '../../features/Users/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import Metadata from '../Layout/Metadata.js';
import Sidebar from './Sidebar.js';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Loader from '../Layout/Loader/Loader.js';
import { toast, Bounce } from 'react-toastify'
import './AllProducts.css'

const UsersList = () => {
    const dispatch = useDispatch()
    const [getAllUsersAdmin] = useGetAllUsersAdminMutation()
    const [deleteUserAdmin, { isSuccess }] = useDeleteUserAdminMutation()
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const [columns, setColumns] = useState([])

    useEffect(()=>{
        async function fetchData(){
          await getAllUsersAdmin()
        }
        fetchData()
    },[getAllUsersAdmin])

    const { users, user, error } = useSelector(state => state.user)

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
        toast.success("User Deleted Successfully", {
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
    },[error, dispatch, isSuccess])

    useEffect(()=>{
      const handleResize = () => {
        if(window.innerWidth<=840){
          setColumns([
            { field: 'id', headerName: 'User ID', minWidth: 50, flex: 0.2 },
            { field: 'email', headerName: 'Email', minWidth: 50, flex: 0.2 },
            { field: 'name', headerName: 'Name', minWidth: 50, flex: 0.2 },
            { 
              field: 'role', 
              headerName: 'Role', 
              minWidth: 40, 
              flex: 0.2,
              type: "number",
              cellClassName: (params) => {
                return params.row.role === "admin"? "greenColor" : "redColor";
              },
            },
            {
              field: "actions",
              flex: 0.2,
              headerName: "Actions",
              minWidth: 50,
              type: "number",
              sortable: false,
              renderCell: (params) => {
                const id = params.row.id
                return (
                  <div>
                    <Link to={`/admin/user/${id}`}>
                      <EditIcon />
                    </Link>
        
                    <Button onClick={() =>deleteUserHandler(id)}>
                      <DeleteIcon />
                    </Button>
                  </div>
                )
              },
            },
          ])
        } else {
          setColumns([
            { 
              field: "id", 
              headerName: "User ID", 
              minWidth: 180, 
              flex: 0.8,
            },
        
            {
              field: "email",
              headerName: "Email",
              minWidth: 200,
              flex: 1,
            },
            {
              field: "name",
              headerName: "Name",
              minWidth: 150,
              flex: 0.5,
            },
        
            {
              field: "role",
              headerName: "Role",
              type: "number",
              minWidth: 150,
              flex: 0.3,
              cellClassName: (params) => {
                return params.row.role === "admin"? "greenColor" : "redColor";
              },
            },
        
            {
              field: "actions",
              flex: 0.3,
              headerName: "Actions",
              minWidth: 150,
              type: "number",
              sortable: false,
              renderCell: (params) => {
                const id = params.row.id
                return (
                  <div>
                    <Link to={`/admin/user/${id}`}>
                      <EditIcon />
                    </Link>
        
                    <Button onClick={() =>deleteUserHandler(id)}>
                      <DeleteIcon />
                    </Button>
                  </div>
                )
              },
            },
          ])
        }
      }

      window.addEventListener('resize', handleResize)
      handleResize()

      return () => window.removeEventListener('resize', handleResize)
    },[])

    if(!users){
        return <Loader />
    }

    const deleteUserHandler =async (id) => {
        if(user._id===id){
            toast.error("You cannot delete yourself", {
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
        try {
            await deleteUserAdmin(id)
        } catch (error) {
        
        }
    }

      const rows = users.map(user => ({
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      }))

  return (
    <>
        <Metadata title={`ALL USERS - Admin`} />

        <div className="dashboard">
          <div className='board-desktop'>
            <Sidebar />
          </div>
          <div className={mobileFilterOpen ? 'board-mobile board-active': 'board-mobile'}>
            {mobileFilterOpen ? <div className='dashboard-menu'> <KeyboardArrowDownIcon onClick={()=> setMobileFilterOpen(false)} /> </div>: <div className='dashboard-menu'> <KeyboardArrowRightIcon onClick={()=> setMobileFilterOpen(true)} />Menu</div>}
            {mobileFilterOpen && <Sidebar />}
          </div>
        <div className="productListContainer">
            <h1 id="productListHeading">ALL USERS</h1>

            <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
            getRowClassName={(params)=> {
                return params.row.id === user._id ? 'self-user' : ''
            }}
            />
        </div>
        </div>
    </>
  )
}

export default UsersList