import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './component/Layout/Header/Header';
import Footer from './component/Layout/Footer/Footer';
import Home from './component/Home/Home';
import Products from './component/Product/Products';
import ProductDetails from './component/Product/ProductDetails';
import Cart from './component/Cart/Cart';
import Login from './component/User/Login';
import Account from './component/User/Account';
import ProtectedRoute from './component/Route/ProtectedRoute';
import { useGetUserDataMutation } from './features/Users/userSlice';
import { useGetStripeKeyMutation } from './features/Payment/paymentSlice'
import Dashboard from './component/Admin/Dashboard';
import Register from './component/User/Register';
import ForgotPassword from './component/User/ForgotPassword';
import ResetPassword from './component/User/ResetPassword';
import CheckOut from './component/Cart/CheckOut';
import Payment from './component/Cart/Payment';
import Success from './component/Cart/Success';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useSelector } from 'react-redux';
import NewProduct from './component/Admin/NewProduct';
import AllProducts from './component/Admin/AllProducts';
import UpdateProduct from './component/Admin/UpdateProduct';
import UsersList from './component/Admin/UsersList';
import UpdateUser from './component/Admin/UpdateUser';
import ProductReviews from './component/Admin/ProductReviews';
import OrdersList from './component/Admin/OrdersList';
import UpdateOrder from './component/Admin/UpdateOrder';
import Soon from './component/Layout/Soon'
import NotFound from './component/Layout/NotFound/NotFound';

function App() {
  const [getUserData] = useGetUserDataMutation()
  const [getStripeKey] = useGetStripeKeyMutation()
  const stripeApiKey = useSelector(state => state.payment.stripeapikey)
  
  useEffect(()=>{
      async function fetchUser (){
        try {
          await getUserData()
          await getStripeKey()
        } catch (error) {
  
        }
      }
      fetchUser()
  },[getStripeKey, getUserData])
  
  return (
    <Router>
      <Header />
        <Routes>
          {stripeApiKey &&  
            <Route exact path='/payment' element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <ProtectedRoute isAdmin={false} component={Payment} />
              </Elements>
            }/>
          }
          <Route exact path='/success' element={<Success />} />
          <Route exact path='/' element={<Home />}/>
          <Route exact path='/login' element={<Login />}/>
          <Route exact path='/register' element={<Register />}/>
          <Route exact path='/password/forgot' element={<ForgotPassword />}/>
          <Route exact path='/password/reset/:token' element={<ResetPassword />}/>
          <Route exact path='/account' element={<ProtectedRoute isAdmin={false} component={Account} />}/>
          <Route exact path='/shop' element={<Products />} />
          <Route exact path='/shop/:id' element={<ProductDetails />} />
          <Route exact path='/cart' element={<Cart />} />
          <Route exact path='/checkout' element={<ProtectedRoute isAdmin={false} component={CheckOut} />} />
          <Route exact path='/admin/dashboard' element={<ProtectedRoute isAdmin={true} component={Dashboard}/>} />
          <Route exact path='/admin/product/new' element={<ProtectedRoute isAdmin={true} component={NewProduct}/>} />
          <Route exact path='/admin/products' element={<ProtectedRoute isAdmin={true} component={AllProducts}/>} />
          <Route exact path='/admin/product/:id' element={<ProtectedRoute isAdmin={true} component={UpdateProduct}/>} />
          <Route exact path='/admin/users' element={<ProtectedRoute isAdmin={true} component={UsersList}/>} />
          <Route exact path='/admin/user/:id' element={<ProtectedRoute isAdmin={true} component={UpdateUser}/>} />
          <Route exact path='/admin/reviews' element={<ProtectedRoute isAdmin={true} component={ProductReviews}/>} />
          <Route exact path='/admin/orders' element={<ProtectedRoute isAdmin={true} component={OrdersList}/>} />
          <Route exact path='/admin/order/:id' element={<ProtectedRoute isAdmin={true} component={UpdateOrder}/>} />
          <Route exact path='/soon' element={<Soon />} />
          <Route exact path='/*' element={<NotFound />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;
