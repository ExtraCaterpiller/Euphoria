import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems")
            ? JSON.parse(localStorage.getItem("cartItems")) 
            : []
    }
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCartItems: (state, action) => {
            let newCart = [...state.cart.cartItems]
            const existingItemIndex = state.cart.cartItems.findIndex(item => item.productId === action.payload.productId && item.size===action.payload.size)
            if(existingItemIndex !== -1){
                newCart[existingItemIndex] = action.payload;
            } else {
                newCart = [...newCart, action.payload]
            }
            state.cart.cartItems = newCart
            localStorage.setItem("cartItems", JSON.stringify(newCart))
        },
        deleteCartItem: (state, action) => {
            const index = action.payload
            const newCart = [...state.cart.cartItems]

            newCart.splice(index, 1)
            state.cart.cartItems = newCart
            localStorage.setItem("cartItems", JSON.stringify(newCart))
        },
        increaseCount: (state, action) => {
            const index = action.payload
            const newCart = [...state.cart.cartItems]

            newCart[index].quantity += 1
            state.cart.cartItems = newCart
            localStorage.setItem("cartItems", JSON.stringify(newCart))
        },
        decreaseCount: (state, action) => {
            const index = action.payload
            const newCart = [...state.cart.cartItems]

            if(newCart[index].quantity>1){
                newCart[index].quantity -= 1
            }
            state.cart.cartItems = newCart
            localStorage.setItem("cartItems", JSON.stringify(newCart))
        },
        clearCart: (state) => {
            state.cart.cartItems = []
            localStorage.removeItem("cartItems")
        }
    }
})

export const selectCartItems = (state) => state.cart.cart.cartItems


export const { addCartItems, clearCart, deleteCartItem, increaseCount, decreaseCount } = cartSlice.actions

export default cartSlice.reducer