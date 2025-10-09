import { useAddQuantityMutation, useProductsDetailQuery } from '@/service/api'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast, Toaster } from 'sonner'

export default function ProductDetails() {
	const { id } = useParams() // routerdagi :id

	const {
		data: product,
		isLoading,
		isFetching,
		error,
	} = useProductsDetailQuery(id)
	const [addProducts, { isLoading: adding }] = useAddQuantityMutation()

	// UI state
	const [selectedImageIndex, setSelectedImageIndex] = useState(0)
	const [selectedColor, setSelectedColor] = useState(null)
	const [count, setCount] = useState(1)

	useEffect(() => {
		if (product) {
			setSelectedImageIndex(0)
			setSelectedColor(product.images?.[0]?.color ?? null)
			setCount(1)
		}
	}, [product])

	// Unique color options (kechikkan duplicate ranglarni olib tashlaymiz)
	const colorOptions = useMemo(() => {
		if (!product?.images) return []
		const map = new Map()
		product.images.forEach(img => {
			if (!map.has(img.color)) map.set(img.color, img)
		})
		return Array.from(map.values())
	}, [product])

	const displayedImage = product?.images?.[selectedImageIndex]?.image

	const handleSelectColor = color => {
		setSelectedColor(color)
		const idx = product.images.findIndex(i => i.color === color)
		if (idx >= 0) setSelectedImageIndex(idx)
	}

	const handleDecrease = () => setCount(prev => Math.max(1, prev - 1))
	const handleIncrease = () =>
		setCount(prev => Math.min(product?.quantity ?? 9999, prev + 1))

	const handleAddToCart = async () => {
		if (!product) return
		try {
			const payload = {
				product_id: product.id,
				quantity: count,
				color: selectedColor,
			}
			const res = await addProducts(payload).unwrap()
			toast.success('Mahsulot savatga qo`shildi')
		} catch (err) {
			toast.error(`Mahsulotni qo'shishda xatolik yuz berdi: ${err}`)
		}
	}

	if (isLoading || isFetching)
		return (
			<div className='flex justify-center items-center min-h-screen bg-gray-50'>
				<div className='animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full'></div>
			</div>
		)

	if (error)
		return (
			<div className='p-6 text-red-600'>
				Mahsulotni yuklashda xatolik yuz berdi.
			</div>
		)

	if (!product) return null

	const avgRating = parseFloat(product.average_rating || '0')

	return (
		<div className='max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-6 pb-25'>
			<Toaster position='top-center' richColors />
			<div className='md:col-span-6'>
				<div className='text-white'>
					<Link to={'/barcha-maxsulotlar'}>
						<button className='w-10 h-10 rounded-full bg-blue-500 flex justify-center items-center text-white'>
							<ArrowLeft />
						</button>
					</Link>
				</div>
				<div className='relative shadow-xl rounded-lg overflow-hidden mt-2'>
					{/* Main image / video */}
					{product.video_url ? (
						<video controls className='w-full h-96 object-contain bg-black'>
							<source src={product.video_url} />
							Your browser does not support the video tag.
						</video>
					) : (
						<img
							src={displayedImage}
							alt={product.name}
							className='w-full h-96 object-contain bg-gray-50'
						/>
					)}

					{/* Prev / Next arrows */}
					<button
						onClick={() => setSelectedImageIndex(i => Math.max(0, i - 1))}
						className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md'
					>
						&lt;
					</button>
					<button
						onClick={() =>
							setSelectedImageIndex(i =>
								Math.min((product.images?.length ?? 1) - 1, i + 1)
							)
						}
						className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md'
					>
						&gt;
					</button>
				</div>

				{/* Thumbnails */}
				<div className='mt-3 grid grid-cols-5 gap-2'>
					{product.images?.map((img, idx) => (
						<button
							key={img.id}
							onClick={() => setSelectedImageIndex(idx)}
							className={`border rounded-md p-1 hover:scale-105 transition ${
								selectedImageIndex === idx ? 'ring-2 ring-blue-400' : ''
							}`}
						>
							<img
								src={img.image}
								alt={`${product.name}-${idx}`}
								className='w-full h-16 object-contain'
							/>
						</button>
					))}
				</div>
			</div>
			{/* Info column */}
			<div className='md:col-span-6'>
				<h1 className='text-2xl font-semibold'>{product.name}</h1>
				<p className='text-sm text-gray-500 mt-1'>{product.category}</p>

				{/* Rating */}
				<div className='flex items-center mt-3 space-x-3'>
					<div className='flex items-center'>
						{[1, 2, 3, 4, 5].map(i => (
							<span key={i} className='mr-1'>
								<svg
									width='18'
									height='18'
									viewBox='0 0 24 24'
									fill={i <= Math.round(avgRating) ? 'currentColor' : 'none'}
									stroke='currentColor'
									strokeWidth='1.2'
									className={`inline-block ${
										i <= Math.round(avgRating)
											? 'text-yellow-400'
											: 'text-gray-300'
									}`}
								>
									<path d='M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.168L12 18.896 4.664 23.166l1.402-8.168L0.132 9.209l8.2-1.192z' />
								</svg>
							</span>
						))}
					</div>
					<div className='text-sm text-gray-600'>
						{product.average_rating} · {product.sold_count} sotilgan
					</div>
				</div>

				{/* Price */}
				<div className='mt-4 flex items-baseline space-x-3'>
					{product.discount > 0 ? (
						<>
							<span className='text-2xl font-bold'>
								{Number(product.discounted_price).toLocaleString('uz-UZ')} so'm
							</span>
							<span className='line-through text-gray-400'>
								{Number(product.price).toLocaleString('uz-UZ')} so'm
							</span>
							<span className='text-red-500'>{product.discount}%</span>
						</>
					) : (
						<span className='text-2xl font-bold'>
							{Number(product.price).toLocaleString('uz-UZ')} so'm
						</span>
					)}
				</div>

				{/* Short info */}
				<p className='mt-4 text-gray-700'>{product.description}</p>

				{/* Color select */}
				<div className='mt-4'>
					<h4 className='text-sm text-gray-600 mb-2'>Rangi</h4>
					<div className='flex gap-2'>
						{colorOptions.map(img => (
							<button
								key={img.id}
								onClick={() => handleSelectColor(img.color)}
								className={`border p-2 rounded-md flex items-center space-x-2 ${
									selectedColor === img.color ? 'ring-2 ring-blue-400' : ''
								}`}
							>
								<img
									src={img.image}
									alt={img.color}
									className='w-10 h-10 object-contain'
								/>
								<span className='text-sm'>{img.color}</span>
							</button>
						))}
					</div>
				</div>

				{/* Quantity & Add to cart */}
				<div className='mt-6 flex items-center gap-4'>
					<div className='flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm'>
						<button
							onClick={handleDecrease}
							className='px-4 py-2 text-xl font-semibold text-gray-600 hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-40'
							disabled={count <= 1}
						>
							–
						</button>

						<div className='px-5 min-w-[50px] text-center font-medium text-gray-800 select-none'>
							{count}
						</div>

						<button
							onClick={handleIncrease}
							className='px-4 py-2 text-xl font-semibold text-gray-600 hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-40'
							disabled={count >= product.quantity} // masalan, maksimal 10 ta
						>
							+
						</button>
					</div>

					<div className='text-white'>
						<button
							onClick={handleAddToCart}
							disabled={adding}
							className='bg-blue-600 text-white px-5 py-2 rounded-md disabled:opacity-60'
						>
							{adding ? 'Qo`shilmoqda...' : 'Savatga qo`shish'}
						</button>
					</div>
				</div>

				{/* Extra details */}
				<div className='mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600'>
					<div>
						<div className='font-medium'>Omborda</div>
						<div>{product.quantity} dona</div>
					</div>
					<div>
						<div className='font-medium'>Kategoriyasi</div>
						<div>{product.category}</div>
					</div>
				</div>

				{/* Reviews / Rating breakdown (agar mavjud bo'lsa) */}
				<div className='mt-8'>
					<h3 className='text-lg font-semibold'>Fikrlar</h3>
					{product.reviews?.length ? (
						<ul className='mt-3 space-y-3'>
							{product.reviews.map(r => (
								<li key={r.id} className='border p-3 rounded-md'>
									<div className='flex justify-between'>
										<div className='font-medium'>
											{r.user_name || 'Foydalanuvchi'}
										</div>
										<div className='text-sm text-gray-500'>{r.rating}★</div>
									</div>
									<p className='text-sm mt-2'>{r.comment}</p>
								</li>
							))}
						</ul>
					) : (
						<p className='mt-3 text-gray-500'>Hozircha fikrlar yo'q.</p>
					)}
				</div>
			</div>
		</div>
	)
}
