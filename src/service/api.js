import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://api.toysmars.uz',
		prepareHeaders: headers => {
			const token = localStorage.getItem('access_token')
			if (token) {
				headers.set('Authorization', `Bearer ${token}`)
			}
			return headers
		},
	}),
	tagTypes: ['Posts', 'Post'],
	endpoints: builder => ({
		NewProductsGet: builder.query({
			query: () => '/shop/new-products/',
		}),
		addPost: builder.mutation({
			query: newPost => ({
				url: 'posts',
				method: 'POST',
				body: newPost,
			}),
			invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
		}),
		deletePost: builder.mutation({
			query: id => ({
				url: `posts/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
		}),
		ProductsGet: builder.query({
			query: ({ page = 1, search = '', category = '' }) =>
				`/shop/products/?limit=12&page=${page}&category_id=${category}&search=${search}`,
		}),
		addLogin: builder.mutation({
			query: fullPhone => ({
				url: '/users/register/',
				method: 'POST',
				body: { phone_number: fullPhone },
			}),
		}),
		ProductsDetail: builder.query({
			query: id => `/shop/product-details/?product_id=${id}`,
		}),
		Categoriyes: builder.query({
			query: () => `/shop/categories`,
		}),
		addQuantity: builder.mutation({
			query: addQuant => ({
				url: '/shop/create-cart-product/',
				method: 'POST',
				body: addQuant,
			}),
			invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
		}),
		getCardProducts: builder.query({
			query: () => `/shop/get-cart-products/`,
		}),
		getMe: builder.query({
			query: () => `/users/profile/`,
			providesTags: ['User'],
		}),
		updateUser: builder.mutation({
			query: updatedData => ({
				url: `/users/update/`,
				method: 'PUT', // yoki PUT bo‘lishi mumkin, agar API talab qilsa
				body: updatedData,
			}),
			invalidatesTags: ['User'],
		}),
	}),
})

export const {
	useUpdateUserMutation,
	useGetMeQuery,
	useGetCardProductsQuery,
	useAddQuantityMutation,
	useCategoriyesQuery,
	useProductsDetailQuery,
	useAddLoginMutation,
	useProductsGetQuery,
	useGetPostsQuery,
	useAddPostMutation,
	useDeletePostMutation,
	useNewProductsGetQuery,
} = api
