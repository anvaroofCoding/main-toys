import {
	useAddQuantityMutation,
	useGetCardProductsQuery,
	useNewProductsGetQuery,
} from '@/service/api'
import { motion } from 'framer-motion'
import { Loader2, ShoppingCart, Star } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'sonner'

const NewProducts = () => {
	const navigate = useNavigate()
	const [activeId, setActiveId] = useState(null)

	const { data: products, isFetching, isLoading } = useNewProductsGetQuery()
	const [addProduct, { isLoading: isAdding }] = useAddQuantityMutation()
	const { data: cartItems, isLoading: isCartLoading } =
		useGetCardProductsQuery()

	// 🛒 Mahsulotni savatga qo‘shish
	const handleAddToCart = async product => {
		try {
			setActiveId(product.id)

			const quantityData = {
				product_id: product.id,
				quantity: 1,
				color: product.images?.[0]?.color,
			}

			// Omborda yetarlimi, tekshiramiz
			const isAlreadyMaxed = cartItems?.some(
				item =>
					item.product_id === product.id &&
					item.quantity >= (product.images?.[0]?.quantity || 0)
			)

			if (isAlreadyMaxed) {
				toast.error(
					`Omborda ${product.images?.[0]?.quantity || 0} dona qolgan!`
				)
				return
			}

			await addProduct(quantityData).unwrap()
			toast.success('Mahsulot savatga qo‘shildi!')
		} catch (err) {
			console.error('🔴 Xatolik:', err)
			toast.error('Mahsulotni qo‘shishda xatolik yuz berdi!')
		} finally {
			setActiveId(null)
		}
	}

	// ⏳ YUKLANMOQDA
	if (isLoading || isCartLoading)
		return (
			<div className='flex flex-col w-full h-screen items-center gap-3'>
				<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
				<p className='text-sm text-muted-foreground'>Yuklanmoqda...</p>
			</div>
		)

	// 🟡 MAHSULOT YO‘Q BO‘LSA
	if (!products?.length)
		return (
			<div className='flex flex-col justify-center items-center min-h-screen text-gray-500'>
				<Star className='w-12 h-12 text-gray-300 animate-pulse mb-2' />
				<p>Yangi mahsulotlar topilmadi</p>
			</div>
		)

	// 🧱 ASOSIY RENDER
	return (
		<div>
			<Toaster position='top-center' richColors />

			<motion.div
				layout
				className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-3 transition-opacity duration-300 ${
					isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'
				}`}
			>
				{products.map(product => (
					<motion.div
						key={product.id}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.97 }}
						className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition hover:shadow-md duration-200'
					>
						{/* 🖼️ Image */}
						<div
							onClick={() => navigate(`/buyurtmalar/product/${product.id}`)}
							className='relative aspect-square w-full bg-gray-50 cursor-pointer'
						>
							<img
								src={product?.colors?.[0]?.images[0]}
								alt={product?.name}
								className='object-cover w-full h-full'
							/>
							{product?.discount > 0 && (
								<span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full'>
									-{product?.discount}%
								</span>
							)}
						</div>

						{/* 📄 Info */}
						<div className='p-3 flex flex-col justify-between h-[150px]'>
							<div
								onClick={() => navigate(`/buyurtmalar/product/${product.id}`)}
								className='cursor-pointer'
							>
								<h3
									className='text-sm font-semibold text-gray-800 truncate hover:text-blue-600 transition'
									title={product.name}
								>
									{product.name}
								</h3>
								<p
									className='text-[12px] text-gray-400 line-clamp-1'
									title={product.description}
								>
									{product.description || product.category}
								</p>
							</div>

							{/* ⭐ Rating */}
							<div className='flex items-center gap-1 mt-1'>
								<Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
								<span className='text-xs font-medium text-gray-600'>
									{product.average_rating || '0.0'}
								</span>
							</div>

							{/* 💰 Price & Cart */}
							<div className='mt-2 flex items-center justify-between'>
								<div className='flex flex-col'>
									<span className='text-base font-bold text-blue-600'>
										{Number(product.discounted_price).toLocaleString('uz-UZ')}{' '}
										so‘m
									</span>
									{product.discount > 0 && (
										<span className='text-xs line-through text-gray-400'>
											{Number(product.price).toLocaleString('uz-UZ')} so‘m
										</span>
									)}
								</div>

								<button
									onClick={() => handleAddToCart(product)}
									disabled={isFetching || (isAdding && activeId === product.id)}
									className={`flex items-center justify-center w-9 h-9 rounded-full transition ${
										isAdding && activeId === product.id
											? 'bg-gray-300'
											: 'bg-blue-500 hover:bg-blue-600 active:scale-95'
									}`}
								>
									{isAdding && activeId === product.id ? (
										<div className='animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full'></div>
									) : (
										<ShoppingCart className='w-5 h-5 text-white' />
									)}
								</button>
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>
		</div>
	)
}

export default NewProducts
