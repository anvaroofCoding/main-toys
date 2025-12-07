import {
	useAddQuantityMutation,
	useGetCardProductsQuery,
	useNewProductsGetQuery,
} from '@/service/api'
import { motion } from 'framer-motion'
import { Ban, Check, ShoppingCart, Star } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ProductSkeleton from './ProductSkeleton'

const NewProducts = () => {
	const navigate = useNavigate()
	const [activeId, setActiveId] = useState(null)

	const { data: products, isFetching, isLoading } = useNewProductsGetQuery()
	const [addProduct, { isLoading: isAdding, isError, error }] =
		useAddQuantityMutation()
	const { data: cartItems, isLoading: isCartLoading } =
		useGetCardProductsQuery()
	const handleAddToCart = async item => {
		setActiveId(item.id)
		try {
			const addQuant = {
				product_id: item?.id,
				quantity: 1,
			}
			await addProduct(addQuant).unwrap()
			setActiveId(null)
		} catch (error) {
			console.log(error)
		}
	}

	// ⏳ YUKLANMOQDA
	if (isLoading || isCartLoading) {
		return (
			<motion.div
				layout
				className='grid grid-cols-2 sm:grid-cols-3 xl:container mx-auto md:grid-cols-4 gap-3 px-3'
			>
				{Array.from({ length: 8 }).map((_, i) => (
					<ProductSkeleton key={i} />
				))}
			</motion.div>
		)
	}

	// 🟡 MAHSULOT YO‘Q BO‘LSA
	if (!products?.length)
		return (
			<div className='flex flex-col justify-center items-center min-h-screen text-gray-500'>
				<Star className='w-12 h-12 text-gray-300 animate-pulse mb-2' />
				<p>Yangi mahsulotlar topilmadi</p>
			</div>
		)

	if (isError) {
		console.error('🔴 Xatolik:', error)
	}

	// 🧱 ASOSIY RENDER
	return (
		<div>
			<motion.div
				layout
				className={`grid grid-cols-2 sm:grid-cols-3 xl:container mx-auto md:grid-cols-4 gap-3 px-3 transition-opacity duration-300 ${
					isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'
				}`}
			>
				{products.map(product => {
					const isInCart = cartItems?.some(
						item => item.product_id === product.id
					)

					return (
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
									src={product?.images[0]}
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

								{/* 💰 Price + Cart */}
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

									{/* 🛒 CART BUTTON */}
									{product?.quantity == 0 ? (
										<button
											onClick={() =>
												toast.info(
													"Omborda bu tavarda qolmagan olib keltirish uchun bizga bog'laning"
												)
											}
											className='flex items-center justify-center w-9 h-9 rounded-full bg-orange-500 transition'
										>
											<Ban className='w-5 h-5 text-white' />
										</button>
									) : (
										<>
											{isInCart ? (
												<button className='flex items-center justify-center w-9 h-9 rounded-full bg-green-500 transition'>
													<Check className='w-5 h-5 text-white' />
												</button>
											) : (
												<button
													onClick={e => {
														e.stopPropagation()
														handleAddToCart(product)
													}}
													disabled={isAdding && activeId === product.id}
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
											)}
										</>
									)}
								</div>
							</div>
						</motion.div>
					)
				})}
			</motion.div>
		</div>
	)
}

export default NewProducts
