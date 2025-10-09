'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAddQuantityMutation, useProductsDetailQuery } from '@/service/api'
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast, Toaster } from 'sonner'

export default function ProductDetails() {
	const { id } = useParams()

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

	// Unique color options
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
			<div className='flex justify-center items-center min-h-screen bg-background'>
				<div className='animate-spin w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full'></div>
			</div>
		)

	if (error)
		return (
			<div className='flex justify-center items-center min-h-screen p-6'>
				<Card className='p-6 max-w-md text-center'>
					<p className='text-destructive font-medium'>
						Mahsulotni yuklashda xatolik yuz berdi.
					</p>
				</Card>
			</div>
		)

	if (!product) return null

	const avgRating = Number.parseFloat(product.average_rating || '0')

	return (
		<div className='min-h-screen bg-background pb-20'>
			<Toaster position='top-center' richColors />

			<div className='sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<Link to='/barcha-maxsulotlar'>
						<Button
							variant='ghost'
							size='icon'
							className='rounded-full hover:bg-blue-500/10'
						>
							<ArrowLeft className='h-5 w-5 text-blue-500' />
						</Button>
					</Link>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16'>
					<div className='space-y-4'>
						<Card className='overflow-hidden border-0 shadow-lg'>
							<div className='relative aspect-square bg-muted/30'>
								{product.video_url ? (
									<video controls className='w-full h-full object-contain'>
										<source src={product.video_url} />
										Your browser does not support the video tag.
									</video>
								) : (
									<img
										src={displayedImage || '/placeholder.svg'}
										alt={product.name}
										className='w-full h-full object-contain p-8'
									/>
								)}

								{product.images?.length > 1 && (
									<>
										<Button
											onClick={() =>
												setSelectedImageIndex(i => Math.max(0, i - 1))
											}
											disabled={selectedImageIndex === 0}
											variant='secondary'
											size='icon'
											className='absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg disabled:opacity-30'
										>
											<ArrowLeft className='h-4 w-4' />
										</Button>
										<Button
											onClick={() =>
												setSelectedImageIndex(i =>
													Math.min((product.images?.length ?? 1) - 1, i + 1)
												)
											}
											disabled={
												selectedImageIndex === (product.images?.length ?? 1) - 1
											}
											variant='secondary'
											size='icon'
											className='absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg disabled:opacity-30'
										>
											<ArrowLeft className='h-4 w-4 rotate-180' />
										</Button>
									</>
								)}

								{product.images?.length > 1 && (
									<div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
										{product.images.map((_, idx) => (
											<button
												key={idx}
												onClick={() => setSelectedImageIndex(idx)}
												className={`h-2 rounded-full transition-all ${
													idx === selectedImageIndex
														? 'w-8 bg-blue-500'
														: 'w-2 bg-muted-foreground/30'
												}`}
											/>
										))}
									</div>
								)}
							</div>
						</Card>

						{product.images?.length > 1 && (
							<div className='hidden sm:grid grid-cols-5 gap-3'>
								{product.images.slice(0, 5).map((img, idx) => (
									<button
										key={img.id}
										onClick={() => setSelectedImageIndex(idx)}
										className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
											selectedImageIndex === idx
												? 'border-blue-500 ring-2 ring-blue-500/20'
												: 'border-transparent hover:border-muted-foreground/20'
										}`}
									>
										<img
											src={img.image || '/placeholder.svg'}
											alt={img.color}
											className='w-full h-full object-contain p-2 bg-muted/30'
										/>
									</button>
								))}
							</div>
						)}
					</div>

					<div className='space-y-6'>
						<div className='space-y-2'>
							<p className='text-sm font-medium text-blue-500 uppercase tracking-wide'>
								{product.category}
							</p>
							<h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-balance'>
								{product.name}
							</h1>
						</div>

						<div className='flex items-center gap-4 pb-6 border-b'>
							<div className='flex items-center gap-1'>
								{[1, 2, 3, 4, 5].map(i => (
									<svg
										key={i}
										width='20'
										height='20'
										viewBox='0 0 24 24'
										fill={i <= Math.round(avgRating) ? 'currentColor' : 'none'}
										stroke='currentColor'
										strokeWidth='1.5'
										className={`${
											i <= Math.round(avgRating)
												? 'text-yellow-500'
												: 'text-muted-foreground/30'
										}`}
									>
										<path d='M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.168L12 18.896 4.664 23.166l1.402-8.168L0.132 9.209l8.2-1.192z' />
									</svg>
								))}
							</div>
							<div className='text-sm text-muted-foreground'>
								<span className='font-semibold text-foreground'>
									{product.average_rating}
								</span>{' '}
								· {product.sold_count} sotilgan
							</div>
						</div>

						<div className='flex items-baseline gap-3 py-2'>
							{product.discount > 0 ? (
								<>
									<span className='text-4xl font-bold tracking-tight'>
										{Number(product.discounted_price).toLocaleString('uz-UZ')}{' '}
										so'm
									</span>
									<span className='text-xl line-through text-muted-foreground'>
										{Number(product.price).toLocaleString('uz-UZ')}
									</span>
									<span className='px-2.5 py-1 bg-red-500/10 text-red-600 text-sm font-semibold rounded-full'>
										-{product.discount}%
									</span>
								</>
							) : (
								<span className='text-4xl font-bold tracking-tight'>
									{Number(product.price).toLocaleString('uz-UZ')} so'm
								</span>
							)}
						</div>

						<p className='text-muted-foreground leading-relaxed'>
							{product.description}
						</p>

						<div className='space-y-3 py-4'>
							<h4 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
								Rangini tanlang
							</h4>
							<div className='flex flex-wrap gap-3'>
								{colorOptions.map(img => {
									const colorQuantity =
										product.images.find(i => i.color === img.color)?.quantity ??
										0
									return (
										<button
											key={img.id}
											onClick={() => handleSelectColor(img.color)}
											className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:shadow-md ${
												selectedColor === img.color
													? 'border-blue-500 bg-blue-500/5 shadow-md'
													: 'border-border hover:border-blue-500/50'
											}`}
										>
											<div className='w-16 h-16 rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center'>
												<img
													src={img.image || '/placeholder.svg'}
													alt={img.color}
													className='w-full h-full object-contain p-1'
												/>
											</div>
											<div className='text-center'>
												<span className='text-sm font-medium block'>
													{img.color}
												</span>
												<span className='text-xs text-muted-foreground'>
													{colorQuantity} dona
												</span>
											</div>
											{selectedColor === img.color && (
												<div className='absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center'>
													<svg
														className='w-3 h-3 text-white'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={3}
															d='M5 13l4 4L19 7'
														/>
													</svg>
												</div>
											)}
										</button>
									)
								})}
							</div>
						</div>

						<div className='flex flex-col sm:flex-row gap-4 '>
							<div className='flex items-center justify-center rounded-xl border-2 border-border overflow-hidden bg-muted/30'>
								<Button
									onClick={handleDecrease}
									disabled={count <= 1}
									variant='ghost'
									size='icon'
									className='h-10 w-10 rounded-none hover:bg-blue-500/10 hover:text-blue-500 disabled:opacity-30'
								>
									<Minus className='h-5 w-5' />
								</Button>

								<div className='px-6 min-w-[80px] text-center font-bold text-xl select-none'>
									{count}
								</div>

								<Button
									onClick={handleIncrease}
									disabled={count >= product.quantity}
									variant='ghost'
									size='icon'
									className='h-14 w-14 rounded-none hover:bg-blue-500/10 hover:text-blue-500 disabled:opacity-30'
								>
									<Plus className='h-5 w-5' />
								</Button>
							</div>

							<div className='text-white flex-1 w-full'>
								<Button
									onClick={handleAddToCart}
									disabled={adding}
									className='w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-60 py-4'
								>
									<ShoppingCart className='h-5 w-5 mr-2' />
									{adding ? 'Qo`shilmoqda...' : 'Savatga qo`shish'}
								</Button>
							</div>
						</div>

						<div className='pt-8 space-y-4'>
							<h3 className='text-xl font-bold'>Fikrlar</h3>
							{product.reviews?.length ? (
								<div className='space-y-3'>
									{product.reviews.map(r => (
										<Card
											key={r.id}
											className='p-4 hover:shadow-md transition-shadow'
										>
											<div className='flex justify-between items-start mb-2'>
												<div className='font-semibold'>
													{r.user_name || 'Foydalanuvchi'}
												</div>
												<div className='flex items-center gap-1 text-sm font-medium'>
													<svg
														width='16'
														height='16'
														viewBox='0 0 24 24'
														fill='currentColor'
														className='text-yellow-500'
													>
														<path d='M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.168L12 18.896 4.664 23.166l1.402-8.168L0.132 9.209l8.2-1.192z' />
													</svg>
													{r.rating}
												</div>
											</div>
											<p className='text-sm text-muted-foreground leading-relaxed'>
												{r.comment}
											</p>
										</Card>
									))}
								</div>
							) : (
								<Card className='p-8 text-center'>
									<p className='text-muted-foreground'>
										Hozircha fikrlar yo'q.
									</p>
								</Card>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
