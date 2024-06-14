import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/backend',
        prepareHeaders: (headers) => {
            headers.set('Access-Control-Allow-Credentials', true)
            return headers
        }
    }),
    tagTypes: ['Product', 'User', 'Orders'],
    endpoints: (builder) => ({})
})