import { motion } from 'framer-motion'
import {
	ChevronLeft,
	ChevronRight,
	Loader2,
	Search,
	ShoppingCart,
	Star,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'sonner'
import {
	useAddQuantityMutation,
	useCategoriyesQuery,
	useGetCardProductsQuery,
	useProductsGetQuery,
} from '../service/api'
import NoData from './noData'

// ✅ Shadcn / Acentery UI elementlari

const ProductsPage = () => {
	const [page, setPage] = useState(1)
	const [isPageLoading, setIsPageLoading] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('')
	const navigate = useNavigate()
	const [activeId, setActiveId] = useState(null)

	const { data, isFetching, isLoading, error } = useProductsGetQuery({
		page,
		search: searchTerm,
		category: selectedCategory,
	})
	const { data: category, isLoading: catLoading } = useCategoriyesQuery()
	const [addProducts, { isLoading: loads }] = useAddQuantityMutation()
	const { data: getCardProd, isLoading: loadser } = useGetCardProductsQuery()

	const handleAddToCart = async item => {
		setActiveId(item.id)
		const quantityData = {
			product_id: item.id,
			quantity: 1,
			color: item.images[0].color,
		}
		const getCardFinded = getCardProd?.find(itemBox => {
			return (
				itemBox.product_id == item.id &&
				itemBox.quantity >= item.images[0].quantity
			)
		})
		console.log(getCardFinded)
		try {
			if (getCardFinded) {
				toast.error(`Omborda ${item.images[0].quantity} dona qolgan!`)
			} else {
				const response = await addProducts(quantityData).unwrap()
				console.log('🟢 Savatga qo‘shildi:', response)
				toast.success('Mahsulot savatga qo‘shildi!')
				setActiveId(null)
			}
		} catch (error) {
			console.error('🔴 Xatolik:', error)
			toast.error('Mahsulotni qo‘shishda xatolik yuz berdi!')
			setActiveId(null)
		}
	}

	if (isLoading || catLoading || loadser)
		return (
			<div className='flex justify-center items-center min-h-screen bg-gray-50'>
				<div className='animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full'></div>
			</div>
		)

	// 🔍 Qidiruvni faqat logda ko‘rsatamiz (keyin API bilan ulanadi)
	const handleSearch = e => {
		setSelectedCategory('')
		e.preventDefault()
		console.log('Search term:', searchTerm)
		console.log('Selected category:', selectedCategory)
	}

	console.log(selectedCategory)
	const handlePageChange = newPage => {
		setIsPageLoading(true)
		setPage(newPage)
		setTimeout(() => setIsPageLoading(false), 500)
	}

	console.log(data)
	return (
		<div className='min-h-screen bg-gray-50 pb-24 pt-3'>
			<Toaster position='top-center' richColors />
			<h1 className='text-3xl font-semibold text-center text-gray-800 mb-5'>
				Barcha mahsulotlar
			</h1>
			<form
				onSubmit={handleSearch}
				className='flex flex-col sm:flex-row justify-center items-center gap-3 px-4 mb-6'
			>
				{/* 🔍 Search input + button */}
				<div className='relative w-full sm:w-1/2'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />

					<input
						type='text'
						placeholder='Qidiruv...'
						value={searchTerm}
						onChange={e => {
							setSearchTerm(e.target.value)
							if (e.target.value.trim() !== '') setSelectedCategory('')
						}}
						className='pl-10 pr-[90px] py-2.5 w-full rounded-2xl bg-white border border-gray-200 shadow-sm
			focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
			placeholder:text-gray-400 text-gray-700 transition-all duration-200'
					/>

					{/* 🔘 Qidirish tugmasi input ichida */}
					<div className='text-white'>
						<button
							type='submit'
							disabled={!searchTerm.trim()}
							className='absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 
			bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600 
			disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 '
						>
							Qidirish
						</button>
					</div>
				</div>

				{/* 🧭 Category Select */}
				<select
					value={selectedCategory}
					onChange={e => {
						setSelectedCategory(e.target.value)
						if (e.target.value !== '') setSearchTerm('')
					}}
					className='w-full sm:w-[220px] py-2.5 px-4 rounded-2xl bg-white border border-gray-200 shadow-sm
		text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
		appearance-none cursor-pointer transition-all duration-200'
				>
					<option value=''>Kategoriyani tanlang</option>
					{category?.map(cat => (
						<option key={cat.id} value={cat.id}>
							{cat.name}
						</option>
					))}
				</select>
			</form>
			{/* 🧩 Product Grid */}
			{error ? (
				<div className='flex justify-center items-center h-full pt-10 bg-gray-50'>
					<NoData />
				</div>
			) : (
				<div>
					<motion.div
						layout
						className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-3 transition-opacity duration-300 ${
							isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'
						}`}
					>
						{data?.results?.map(product => (
							<motion.div
								key={product.id}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.97 }}
								className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition hover:shadow-md duration-200'
							>
								{/* Image */}
								<div
									onClick={() => navigate(`/buyurtmalar/product/${product.id}`)}
									className='relative aspect-square w-full bg-gray-50 cursor-pointer'
								>
									<img
										src={product.images?.[0]?.image}
										alt={product.name}
										className='object-cover w-full h-full'
									/>
									{product.discount > 0 && (
										<span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full'>
											-{product.discount}%
										</span>
									)}
								</div>

								{/* Info */}
								<div className='p-3 flex flex-col justify-between h-[150px]'>
									<div
										onClick={() =>
											navigate(`/buyurtmalar/product/${product.id}`)
										}
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

									{/* Rating */}
									<div className='flex items-center gap-1 mt-1'>
										<Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
										<span className='text-xs font-medium text-gray-600'>
											{product.average_rating || '0.0'}
										</span>
									</div>

									{/* Price & Cart */}
									<div className='mt-2 flex items-center justify-between'>
										<div className='flex flex-col'>
											<span className='text-base font-bold text-blue-600'>
												{Number(product.discounted_price).toLocaleString(
													'uz-UZ'
												)}{' '}
												so‘m
											</span>
											{product.discount > 0 && (
												<span className='text-xs line-through text-gray-400'>
													{Number(product.price).toLocaleString('uz-UZ')} so‘m
												</span>
											)}
										</div>

										<button
											disabled={
												isFetching || (loads && activeId === product.id)
											}
											className={`flex items-center justify-center w-9 h-9 rounded-full transition ${
												loads && activeId === product.id
													? 'bg-gray-300'
													: 'bg-blue-500 hover:bg-blue-600 active:scale-95'
											}`}
											onClick={() => handleAddToCart(product)}
										>
											{loads && activeId === product.id ? (
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

					{/* 📄 Pagination */}
					<div className='flex justify-center mt-8 gap-4 text-white'>
						{/* Oldingi */}
						<button
							disabled={!data?.previous || isPageLoading}
							onClick={() => handlePageChange(page - 1)}
							className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white transition-all duration-300 
			${
				!data?.previous || isPageLoading
					? 'bg-blue-300 cursor-not-allowed'
					: 'bg-blue-500 hover:bg-blue-600 active:scale-95 shadow-sm'
			}
		`}
						>
							{isPageLoading ? (
								<Loader2 className='animate-spin w-4 h-4 text-white' />
							) : (
								<>
									<ChevronLeft className='w-4 h-4' />
									<span>Oldingi</span>
								</>
							)}
						</button>

						{/* Keyingi */}
						<button
							disabled={!data?.next || isPageLoading}
							onClick={() => handlePageChange(page + 1)}
							className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white transition-all duration-300
			${
				!data?.next || isPageLoading
					? 'bg-blue-300 cursor-not-allowed'
					: 'bg-blue-500 hover:bg-blue-600 active:scale-95 shadow-sm'
			}
		`}
						>
							{isPageLoading ? (
								<Loader2 className='animate-spin w-4 h-4 text-white' />
							) : (
								<>
									<span>Keyingi</span>
									<ChevronRight className='w-4 h-4' />
								</>
							)}
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default ProductsPage
