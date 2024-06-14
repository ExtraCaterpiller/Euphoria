import { apiSlice } from "../api/apiSlice";
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    stripeapikey: null,
    error: null
}

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setApiKey: (state, action) => {
            state.stripeapikey = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearError: (state) => {
            state.error = null
        }
    }
})

const paymentExtendedApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStripeKey: builder.mutation({
            query: () => ({
                url: '/pay/stripeapikey',
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                    const {data} = await queryFulfilled
                    dispatch(setApiKey(data.stripeApiKey))
                } catch (error) {
                    dispatch(setApiKey(''))
                  dispatch(setError(error.error.data?.message || "Failed to fetch stripe api key"))
                }
            }
        }),
        processPayment: builder.mutation({
            query: (paymentData) => ({
                url: '/pay/payment/process',
                method: 'POST',
                body: paymentData,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            transformResponse: res => {
                return res.client_secret
            },
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                    await queryFulfilled
                } catch (error) {
                  dispatch(setError(error.error.data?.message || "Failed to fetch client secret"))
                }
            }
        })
    })
})

export const { setApiKey, setError, clearError } = paymentSlice.actions

export const {
    useGetStripeKeyMutation,
    useProcessPaymentMutation
} = paymentExtendedApi

export default paymentSlice.reducer