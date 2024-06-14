import { apiSlice } from "../api/apiSlice";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const orderAdapter = createEntityAdapter({
    selectId: (order) => order._id
})

const initialState = orderAdapter.getInitialState({
    orders: null,
    error: null,
    singleOrder: null,
})


const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrders: (state, action) => {
            const orders = action.payload
            state.orders = [...orders]
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearError: (state) => {
            state.error = null
        },
        deleteOrder: (state, action) => {
            const id = action.payload
            state.orders = state.orders.filter(order => order._id !== id)
        },
        setSingleOrder: (state, action) => {
            state.singleOrder = action.payload
        }
    }
})


const extendedOrderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderInfo) => ({
                url: '/orders/order/new',
                method: 'POST',
                body: orderInfo,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                    await queryFulfilled
                } catch (error) {
                  dispatch(setError(error.error.data?.message || "Failed to add new order"))
                }
            }
        }),
        getUserOrders: builder.query({
            query: () => ({
                url: '/orders/order/me',
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }),
        getAllOrdersAdmin: builder.mutation({
            query: () => ({
                url: '/orders/admin/orders',
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                    const {data} = await queryFulfilled
                    dispatch(setOrders(data.orders))
                } catch (error) {
                  dispatch(setError(error.error.data?.message || "Failed to fetch orders"))
                }
            }
        }),
        deleteOrderAdmin: builder.mutation({
            query: (id) => ({
                url: `/orders/admin/order/${id}`,
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                    await queryFulfilled
                    dispatch(deleteOrder(arg))
                } catch (error) {
                  dispatch(setError(error.error.data?.message || "Failed to delete order"))
                }
            }
        }),
        chnageOrderStatus: builder.mutation({
            query: (data) => ({
                url: `/orders/admin/order/${data.id}`,
                method: 'PUT',
                body: data,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                    await queryFulfilled
                } catch (error) {
                  dispatch(setError(error.error.data?.message || "Failed to change order status"))
                }
            }
        }),
        getSingleOrder: builder.mutation({
            query: (id) => ({
                url: `/orders/order/${id}`,
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                    const {data} = await queryFulfilled
                    dispatch(setSingleOrder(data.order))
                } catch (error) {
                  dispatch(setError(error.error.data?.message || "Failed to fetch order"))
                }
            }
        })
    })
})

export const { setOrders, setError, clearError, deleteOrder, setSingleOrder } = orderSlice.actions

export const {
    useCreateOrderMutation,
    useGetUserOrdersQuery,
    useGetAllOrdersAdminMutation,
    useDeleteOrderAdminMutation,
    useGetSingleOrderMutation,
    useChnageOrderStatusMutation
} = extendedOrderApi

export default orderSlice.reducer