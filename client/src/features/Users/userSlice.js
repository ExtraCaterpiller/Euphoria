import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";


const userAdapter = createEntityAdapter({
    selectId: (user) => user._id
})

const initialState = userAdapter.getInitialState({
    users: null,
    isAuthenticated: false,
    user: null,
    error: null,
    userInfo: null,
})


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            const user = action.payload
            if(user){
              state.isAuthenticated = true
              state.user = user
              state.error = null
            } else {
              state.isAuthenticated = false
            }
        },
        clearUser(state) {
          state.isAuthenticated = false
          state.user = null
        },
        setError(state, action){
          state.error = action.payload
        },
        clearError(state){
          state.error = null
        },
        updateUserDetails(state, action){
          const user = action.payload
          state.user = user
        },
        setUsers(state, action){
          state.users = action.payload
        },
        deleteUser(state, action) {
          const id = action.payload
          state.users = state.users.filter(us => us._id !== id)
        },
        setUserInfo(state, action){
          state.userInfo = action.payload
        }
    }
})

export const extendedUserApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (info) => ({
        url: "/users/login",
        method: "POST",
        body: info,
        credentials: 'include'
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
            const {data} = await queryFulfilled
            dispatch(setUser(data.user))
        } catch (error) {
          dispatch(setError(error.error.data?.message || 'Failed to log in, Please try again'))
        }
      }
    }),
    getUserData: builder.mutation({
      query: () => ({
        url: '/users/user',
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
            const {data} = await queryFulfilled
            dispatch(setUser(data.user))
        } catch (error) {
            //dispatch(setError(error.error.data?.message || 'Failed to fetch user data'))
        }
      }
    }),
    logOut: builder.mutation({
      query: () => ({
        url: '/users/logout',
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          await queryFulfilled
          dispatch(clearUser())
        } catch (error) {
          dispatch(setError(error.error.data?.message || 'Failed to log out'))
        }
      }
    }),
    addAddress: builder.mutation({
      query: (form) => ({
        url: '/users/user/address',
        method: 'PUT',
        body: form,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          const {data} = await queryFulfilled
          dispatch(updateUserDetails(data.user))
        } catch (error) {
          dispatch(setError(error.error.data?.message) || "Failed to add new address")
        }
      }
    }),
    editAddress: builder.mutation({
      query: (addr) => ({
        url: '/users/user/address/edit',
        method: 'PUT',
        body: addr,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          const {data} = await queryFulfilled
          dispatch(updateUserDetails(data.user))
        } catch (error) {
          dispatch(setError(error.error.data?.message) || "Failed to change address")
        }
      }
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: '/users/user/address/delete',
        method: 'DELETE',
        body: id,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          const {data} = await queryFulfilled
          dispatch(updateUserDetails(data.user))
        } catch (error) {
          dispatch(setError(error.error.data?.message) || "Failed to delete address")
        }
      }
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: '/users/register',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          const {data} = await queryFulfilled
          dispatch(setUser(data.user))
        } catch (error) {
          dispatch(setError(error.error?.data?.message) || "Failed to register, Please try again")
        }
      }
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: '/users/user/update',
        method: 'PUT',
        body: data,
        credentials: 'include'
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          const {data} = await queryFulfilled
          dispatch(updateUserDetails(data.user))
        } catch (error) {
          dispatch(setError(error.error.data?.message) || "Failed to update info, Please try again")
        }
      }
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: '/users/user/password',
        method: 'PUT',
        body: data,
        credentials: 'include'
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          const {data} = await queryFulfilled
          dispatch(updateUserDetails(data.user))
        } catch (error) {
          dispatch(setError(error.error?.data?.message) || "Failed to change password")
        }
      }
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/users/password/forgot',
        method: 'POST',
        body: data,
      }),
      transformResponse: res => {
        return res
      },
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(setError(error.error.data?.message) || "Failed to generate reset token, Please try again after some time")
        }
      }
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/users/password/reset/${data.token}`,
        method: 'PUT',
        body: data.form,
        credentials: 'include'
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          const {data} = await queryFulfilled
          dispatch(setUser(data.user))
        } catch (error) {
          dispatch(setError(error.error.data?.message) || "Failed to reset password")
        }
      }
    }),
    getAllUsersAdmin: builder.mutation({
      query: () => ({
        url: '/users/admin/users',
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          const {data} = await queryFulfilled
          dispatch(setUsers(data.users))
        } catch (error) {
          dispatch(setError(error.error.data?.message) || "Failed to fetch users")
        }
      }
    }),
    deleteUserAdmin: builder.mutation({
      query: (id) => ({
        url: `/users/admin/user/${id}`,
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          await queryFulfilled
          dispatch(deleteUser(arg))
        } catch (error) {
          dispatch(setError(error.error.data?.message) || "Failed to delete user")
        }
      }
    }),
    updateUserRoleAdmin: builder.mutation({
      query: (data) => ({
        url: `/users/admin/user/${data.id}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(setError(error.error.data?.message) || "Failed to change role")
        }
      }
    }),
    getUserInfoAdmin: builder.mutation({
      query: (id) => ({
        url: `/users/admin/user/${id}`,
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          const { data } =  await queryFulfilled
          dispatch(setUserInfo(data.user))
        } catch (error) {
          dispatch(setUserInfo(''))
          dispatch(setError(error.error.data?.message) || "Failed to fetch user")
        }
      }
    })
  }),
})

export const { setUser, clearUser, setError, clearError, updateUserDetails, setUsers, deleteUser, setUserInfo } = userSlice.actions

export const {
    useLoginMutation,
    useGetUserDataMutation,
    useLogOutMutation,
    useAddAddressMutation,
    useEditAddressMutation,
    useDeleteAddressMutation,
    useRegisterUserMutation,
    useUpdateUserProfileMutation,
    useUpdatePasswordMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useGetAllUsersAdminMutation,
    useDeleteUserAdminMutation,
    useGetUserInfoAdminMutation,
    useUpdateUserRoleAdminMutation,
} = extendedUserApi

export default userSlice.reducer