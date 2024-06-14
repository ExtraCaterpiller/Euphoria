import React from 'react'
import { Link } from 'react-router-dom'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import RateReviewIcon from '@mui/icons-material/RateReview';
import './Sidebar.css'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/admin/dashboard">
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>
      <div>
        <SimpleTreeView>
          <TreeItem itemId="1" label="Products" className='sidebar-tree'>
            <Link to="/admin/products">
                <PostAddIcon />
              <TreeItem itemId="2" label="All" />
            </Link>

            <Link to="/admin/product/new">
                <AddIcon />
              <TreeItem itemId="3" label="Create" />
            </Link>
          </TreeItem>
        </SimpleTreeView>
      </div>
      <Link to="/admin/orders">
        <p>
          <ListAltIcon />
          Orders
        </p>
      </Link>
      <Link to="/admin/users">
        <p>
          <PeopleIcon /> Users
        </p>
      </Link>
      <Link to="/admin/reviews">
        <p>
          <RateReviewIcon />
          Reviews
        </p>
      </Link>
    </div>
  )
}

export default Sidebar