import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import {
	ChevronLeft,
	ChevronRight,
	Loader2,
	Search,
	ShoppingCart,
	Star,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
	useAddQuantityMutation,
	useCategoriyesQuery,
	useGetCardProductsQuery,
	useProductsGetQuery,
} from '../service/api'
import NoData from './noData'
const ProductsPage = () => {
	const savedCat = localStorage.getItem('selectedCategory')
	const [page, setPage] = useState(1)
	const [isPageLoading, setIsPageLoading] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedCategory, setSelectedCategory] = useState(savedCat || '')
	const navigate = useNavigate()
	const [activeId, setActiveId] = useState(null)
	const location = useLocation()
	const inputRef = useRef()
	useEffect(() => {
		// 🔹 Agar boshqa sahifadan "openSearch" signali kelsa
		if (location.state?.openSearch) {
			inputRef.current?.focus() // inputni fokus qilamiz
		}
	}, [location.state])
	const { data, isFetching, isLoading, error } = useProductsGetQuery({
		page,
		search: searchTerm,
		category: selectedCategory,
	})
	const { data: category, isLoading: catLoading } = useCategoriyesQuery()
	const [addProducts, { isLoading: loads }] = useAddQuantityMutation()
	const { data: getCardProd, isLoading: loadser } = useGetCardProductsQuery()
	const handleAddToCart = async item => {
		console.log(item)
		try {
			setActiveId(item?.id)
			if (item?.colors[0]?.quantity == 0) {
				toast.warning('Mahsulot qolmagan!')
			} else {
				const getCardFinded = getCardProd?.find(itemBox => {
					return (
						itemBox?.product_id == item?.id &&
						itemBox?.quantity >= item?.colors[0].quantity
					)
				})
				if (getCardFinded) {
					toast.error(`Omborda ${item?.images[0]?.quantity} dona qolgan!`)
				} else {
					const quantityData = {
						product_id: item?.id,
						quantity: 1,
						color: item?.colors[0]?.color,
					}
					const response = await addProducts(quantityData).unwrap()
					console.log("🟢 Savatga qo'shildi:", response)
					toast.success("Mahsulot savatga qo'shildi!")
					setActiveId(null)
				}
			}
		} catch (error) {
			toast.warning('Omborda boshqa qolmadi!')
			console.log(error)
			setActiveId(null)
		}
	}
	if (isLoading || catLoading || loadser)
		return (
			<div className='min-h-screen pb-24 pt-3 '>
				<h1 className='text-3xl font-bold text-center text-gray-800 mb-5'>
					Barcha mahsulotlar
				</h1>
				<form className='flex flex-col sm:flex-row justify-center items-center gap-3 px-4 mb-6'>
					<div className='relative w-full sm:w-1/2'>
						<Skeleton className='w-full h-10 rounded-2xl' />
					</div>
					<Skeleton className='w-full sm:w-[220px] h-10 rounded-2xl' />
				</form>
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-3'>
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'
						>
							<Skeleton className='w-full aspect-square rounded-none' />
							<div className='p-3 flex flex-col justify-between h-[150px] gap-3'>
								<div className='space-y-2'>
									<Skeleton className='h-4 w-full rounded' />
									<Skeleton className='h-3 w-3/4 rounded' />
								</div>
								<Skeleton className='h-4 w-12 rounded' />
								<div className='flex items-center justify-between'>
									<Skeleton className='h-5 w-20 rounded' />
									<Skeleton className='w-9 h-9 rounded-full' />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		)

	const handleSearch = e => {
		localStorage.removeItem('selectedCategory')
		setSelectedCategory('')
		e.preventDefault()
	}

	const handlePageChange = newPage => {
		localStorage.removeItem('selectedCategory')
		setIsPageLoading(true)
		setPage(newPage)
		setTimeout(() => setIsPageLoading(false), 500)
	}

	return (
		<div className='min-h-screen pb-24 pt-3 xl:container mx-auto'>
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
						ref={inputRef}
						placeholder='Qidiruv...'
						value={searchTerm}
						onChange={e => {
							setSearchTerm(e.target.value)
							if (e.target.value.trim() !== '') setSelectedCategory('')
							localStorage.removeItem('selectedCategory')
						}}
						className='pl-10 pr-[90px] py-2.5 w-full rounded-2xl bg-white border border-gray-200 shadow-sm
			focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
			placeholder:text-gray-400 text-gray-700 transition-all duration-200'
					/>
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
				<div
					className='flex justify-center items-center h-full pt-10 
		'
				>
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
									className='relative aspect-square w-full
				  cursor-pointer'
								>
									<img
										src={product.colors[0]?.images[0] || '/placeholder.svg'}
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
												so'm
											</span>
											{product.discount > 0 && (
												<span className='text-xs line-through text-gray-400'>
													{Number(product.price).toLocaleString('uz-UZ')} so'm
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
