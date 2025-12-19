import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Asosiy baseQuery
const baseQuery = fetchBaseQuery({
	baseUrl: 'https://api.toysmars.uz',
	prepareHeaders: headers => {
		// 1. URL dagi tokenni olish
		const urlParams = new URLSearchParams(window.location.search)
		const urlToken = urlParams.get('access_token')

		// 2. Agar URLda bo'lmasa – localStoragedan olish
		const localToken = localStorage.getItem('access_token')

		const finalToken = urlToken || localToken

		// 3. Headerga qo'yish
		if (finalToken) {
			headers.set('Authorization', `Bearer ${finalToken}`)
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
		window.location.href = '/login'
	}

	if (result?.error?.status === 401) {
		localStorage.removeItem('access_token')
		localStorage.removeItem('phone')
		localStorage.removeItem('refresh_token')
	}
	return result
}

// API yaratish
export const api = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithAuth,
	tagTypes: ['Posts'],
	endpoints: builder => ({
		NewProductsGet: builder.query({
			query: () => '/shop/new-products/',
			providesTags: ['Posts'],
		}),
		addPost: builder.mutation({
			query: newPost => ({
				url: 'posts',
				method: 'POST',
				body: newPost,
			}),
			invalidatesTags: ['Posts'],
		}),
		deletePost: builder.mutation({
			query: id => ({
				url: `posts/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Posts'],
		}),
		ProductsGet: builder.query({
			query: ({ page = 1, search = '', category = '' }) =>
				`/shop/products/?limit=12&page=${page}&category_id=${category}&search=${search}`,
			providesTags: ['Posts'],
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
			providesTags: ['Posts'],
		}),
		Categoriyes: builder.query({
			query: () => `/shop/categories`,
			providesTags: ['Posts'],
		}),
		getMe: builder.query({
			query: () => `/users/profile/`,
			providesTags: ['Posts'],
		}),
		updateUser: builder.mutation({
			query: updatedData => ({
				url: `/users/update/`,
				method: 'PUT',
				body: updatedData,
			}),
			invalidatesTags: ['Posts'],
		}),
		getCardProducts: builder.query({
			query: () => `/shop/get-cart-products/`,
			providesTags: ['Posts'],
		}),
		deleteQuantity: builder.mutation({
			query: addQuant => ({
				url: '/shop/delete-cart-products/',
				method: 'POST',
				body: addQuant,
			}),
			invalidatesTags: ['Posts'],
		}),
		addQuantity: builder.mutation({
			query: addQuant => ({
				url: '/shop/create-cart-product/',
				method: 'POST',
				body: addQuant,
			}),
			invalidatesTags: ['Posts'],
		}),
		SuccessOrder: builder.mutation({
			query: addQuant => ({
				url: '/shop/order-product/',
				method: 'POST',
				body: addQuant,
			}),
			invalidatesTags: ['Posts'],
		}),
		MyOrder: builder.query({
			query: () => `/shop/order-history/`,
			providesTags: ['Posts'],
		}),
		ClickLink: builder.mutation({
			query: order_id => ({
				url: '/shop/cancel-order/',
				method: 'POST',
				body: order_id,
			}),
			invalidatesTags: ['Posts'],
		}),
		AddComment: builder.mutation({
			query: formdata => ({
				url: '/shop/comment-create/',
				method: 'POST',
				body: formdata,
			}),
			invalidatesTags: ['Posts'],
		}),
		GetComment: builder.query({
			query: id => `/shop/product-comments/${id}/`,
			providesTags: ['Posts'],
		}),
		updateCard: builder.mutation({
			query: updatedData => ({
				url: `/shop/update-cart-product/`,
				method: 'PUT',
				body: updatedData,
			}),
			invalidatesTags: ['Posts'],
		}),
	}),
})

export const {
	useUpdateCardMutation,
	useGetCommentQuery,
	useAddCommentMutation,
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
