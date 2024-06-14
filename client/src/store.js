import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './features/api/apiSlice'
import cartReducer from './features/Cart/cartSlice'
import userReducer from './features/Users/userSlice'
import productReducer from './features/Products/productSlice'
import paymentReducer from './features/Payment/paymentSlice'
import orderReducer from './features/Orders/orderSlice'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartReducer,
        user: userReducer,
        product: productReducer,
        payment: paymentReducer,
        order: orderReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})