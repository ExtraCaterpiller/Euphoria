import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const productAdapter = createEntityAdapter({
    selectId: (product) => product._id
})

const initialState = productAdapter.getInitialState({
    products: null,
    reviews: null,
    singleProduct: null,
    productsCount: 0,
    filteredProductsCount: 0,
    error: null,
})


const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setSingleProduct: (state, action) => {
            state.singleProduct = action.payload
        },
        setError(state, action){
            state.error = action.payload
        },
        clearError(state){
            state.error = null
        },
        setProducts(state, action) {
            state.products = action.payload
        },
        deleteProduct(state, action){
            const id = action.payload
            state.products = state.products.filter(p => p._id !== id)
        },
        setReviews(state, action){
            state.reviews = action.payload
        },
        deleteReview(state, action){
            const ids = action.payload
            state.reviews = state.reviews.filter(rev => rev._id !== ids.id)
        }
    }
})


export const extendedProductApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (queryparams) => `/products/products?${queryparams}`,
            transformResponse: (res) => {
                const { products, productsCount, filteredProductsCount } = res
                const productState = productAdapter.setAll(productAdapter.getInitialState(), products)
                return {
                    ...productState,
                    productsCount,
                    filteredProductsCount
                }
            },
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                  await queryFulfilled
                } catch (error) {
                  dispatch(setError(error.error.data?.message) || "Failed to fetch products")
                }
            },
            providesTags: (result, error, arg) =>
                result ? 
            [
                ...result.ids.map((id) => ({ type: 'Product', id })),
                { type: 'Product', id: 'LIST' },
            ] : [{ type: 'Product', id: 'LIST' }]
        }),
        getSingleProduct: builder.mutation({
            query: (id) => `/products/product/${id}`,
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                    const {data} = await queryFulfilled
                    dispatch(setSingleProduct(data.product))
                } catch (error) {
                    dispatch(setSingleProduct(''))
                    dispatch(setError(error.error.data?.message) || "Failed to retrieve product")
                }
            }
        }),
        addReview: builder.mutation({
            query: (form) => ({
                url: '/products/review',
                method: 'PUT',
                body: form,
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                },
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                  const {data} = await queryFulfilled
                  dispatch(setSingleProduct(data.product))
                } catch (error) {
                  dispatch(setError(error.error.data?.message) || "Failed to add review")
                }
            }
        }),
        getAllProductsAdmin: builder.mutation({
            query: () => ({
                url: '/products/admin/products',
                method: 'GET',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                },
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                  const {data} = await queryFulfilled
                  dispatch(setProducts(data.products))
                } catch (error) {
                  dispatch(setError(error.error.data?.message) || "Failed to fetch products")
                }
            }
        }),
        createProductAdmin: builder.mutation({
            query: (data) => ({
                url: '/products/admin/product/new',
                method: 'POST',
                body: data,
                credentials: 'include'
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                  await queryFulfilled
                } catch (error) {
                  dispatch(setError(error.error.data?.message) || "Failed to create product")
                }
            }
        }),
        deleteProductAdmin: builder.mutation({
            query: (id) => ({
                url: `/products/admin/product/${id}`,
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                    await queryFulfilled
                    dispatch(deleteProduct(arg))
                } catch (error) {
                    dispatch(setError(error.error.data?.message) || "Failed to delete product")
                }
            }
        }),
        getAllReviews: builder.mutation({
            query: (id) => ({
                url: `/products/reviews?productId=${id}`,
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                    const {data} = await queryFulfilled
                    dispatch(setReviews(data.reviews))
                } catch (error) {
                    dispatch(setReviews(''))
                    dispatch(setError(error.error.data?.message) || "Failed to get reviews")
                }
            }
        }),
        deleteReviewAdmin: builder.mutation({
            query: (ids) => ({
                url: `/products/reviews?productId=${ids.productId}&id=${ids.id}`,
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                    await queryFulfilled
                    dispatch(deleteReview(arg))
                } catch (error) {
                    dispatch(setError(error.error.data?.message) || "Failed to delete review")
                }
            }
        }),
        updateProductAdmin: builder.mutation({
            query: (info) => ({
                url: `/products/admin/product/${info.id}`,
                method: 'PUT',
                body: info.data,
                credentials: 'include',
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                try {
                    await queryFulfilled
                } catch (error) {
                    dispatch(setError(error.error.data?.message) || "Failed to update product")
                }
            }
        })
    })
})


export const { setSingleProduct, setError, clearError, setProducts, deleteProduct, setReviews, deleteReview } = productSlice.actions


export const {
    useGetProductsQuery,
    useGetSingleProductMutation,
    useAddReviewMutation,
    useGetAllProductsAdminMutation,
    useCreateProductAdminMutation,
    useDeleteProductAdminMutation,
    useGetAllReviewsMutation,
    useDeleteReviewAdminMutation,
    useUpdateProductAdminMutation
} = extendedProductApi

export default productSlice.reducer