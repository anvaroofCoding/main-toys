import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Asosiy baseQuery
const baseQuery = fetchBaseQuery({
	baseUrl: 'https://api.toysmars.uz',
	prepareHeaders: headers => {
		const token = localStorage.getItem('access_token')
		if (token) {
			headers.set('Authorization', `Bearer ${token}`)
		}
		return headers
	},
})

// 🔥 Faqat mutation (POST/PUT/DELETE) bo‘lganda 401 xatosini ushlovchi wrapper
const baseQueryWithAuth = async (args, api, extraOptions) => {
	const result = await baseQuery(args, api, extraOptions)

	// args.method tekshiruv (faqat mutationlar uchun)
	const method =
		typeof args === 'string' ? 'GET' : args?.method?.toUpperCase() || 'GET'

	// faqat mutation (POST, PUT, DELETE) va 401 bo‘lsa ishlaydi
	if (
		['POST', 'PUT', 'DELETE'].includes(method) &&
		result?.error?.status === 401
	) {
		localStorage.removeItem('access_token')
		alert(
			'Buyurtma berish uchun telefon raqamingiz orqali shaxsiy kabinetga kirib oling!'
		)
		window.location.href = '/shaxsiy-kabinet'
	}

	return result
}

// API yaratish
export const api = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithAuth,
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
		getMe: builder.query({
			query: () => `/users/profile/`,
			providesTags: ['User'],
		}),
		updateUser: builder.mutation({
			query: updatedData => ({
				url: `/users/update/`,
				method: 'PUT',
				body: updatedData,
			}),
			invalidatesTags: ['User'],
		}),
		getCardProducts: builder.query({
			query: () => `/shop/get-cart-products/`,
			providesTags: ['Posts', 'Post'],
		}),
		deleteQuantity: builder.mutation({
			query: addQuant => ({
				url: '/shop/delete-cart-products/',
				method: 'POST',
				body: addQuant,
			}),
			invalidatesTags: ['Posts', 'Post'],
		}),
		addQuantity: builder.mutation({
			query: addQuant => ({
				url: '/shop/create-cart-product/',
				method: 'POST',
				body: addQuant,
			}),
			invalidatesTags: ['Posts', 'Post'],
		}),
		SuccessOrder: builder.mutation({
			query: addQuant => ({
				url: '/shop/order-product/',
				method: 'POST',
				body: addQuant,
			}),
			invalidatesTags: ['Posts', 'Post'],
		}),
		MyOrder: builder.query({
			query: () => `/shop/order-history/`,
			providesTags: ['Posts', 'Post'],
		}),
		ClickLink: builder.mutation({
			query: order_id => ({
				url: '/shop/cancel-order/',
				method: 'POST',
				body: order_id,
			}),
			invalidatesTags: ['Posts', 'Post'],
		}),
	}),
})

export const {
	useClickLinkMutation,
	useMyOrderQuery,
	useSuccessOrderMutation,
	useDeleteQuantityMutation,
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
