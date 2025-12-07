import { useProductsDetailQuery } from '@/service/api'
import { Skeleton } from 'antd'
import {
	ChevronLeft,
	ChevronRight,
	Minus,
	Plus,
	ShoppingCart,
	Star,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function ProductDetail() {
	const { id } = useParams()
	const { data, isLoading } = useProductsDetailQuery(id)
	const [quantity, setQuantity] = useState(1)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const scrollContainerRef = useRef(null)
	const touchStartRef = useRef(0)
	const touchEndRef = useRef(0)

	const handleQuantityChange = value => {
		if (value >= 1 && value <= (data?.quantity || 1)) {
			setQuantity(value)
			console.log('[v0] Quantity updated to:', value)
		}
	}

	const handleAddToCart = () => {
		console.log(
			'[v0] Add to cart - Product ID:',
			data?.id,
			'Quantity:',
			quantity
		)
	}

	const scrollImages = direction => {
		if (!scrollContainerRef.current) return

		const container = scrollContainerRef.current
		const scrollAmount = 300

		if (direction === 'left') {
			container.scrollLeft -= scrollAmount
		} else {
			container.scrollLeft += scrollAmount
		}
	}

	const handleImageClick = index => {
		setCurrentImageIndex(index)
	}

	const handleSwipe = () => {
		const swipeThreshold = 50 // Minimum distance to trigger swipe
		const diff = touchStartRef.current - touchEndRef.current

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				// Swiped left - show next image
				setCurrentImageIndex(prev => (prev + 1) % (data?.images.length || 1))
			} else {
				// Swiped right - show previous image
				setCurrentImageIndex(
					prev =>
						(prev - 1 + (data?.images?.length || 1)) %
						(data?.images?.length || 1)
				)
			}
		}
	}

	const startX = useRef(0)
	const endX = useRef(0)

	const handleTouchStart = e => {
		startX.current = e.touches[0].clientX
	}

	const handleTouchEnd = e => {
		endX.current = e.changedTouches[0].clientX
		const distance = startX.current - endX.current

		if (Math.abs(distance) < 50) return

		if (distance > 0) {
			// next
			setCurrentImageIndex(prev =>
				prev < data.images.length - 1 ? prev + 1 : prev
			)
		} else {
			// prev
			setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev))
		}
	}

	if (isLoading) {
		return (
			<div className='grid grid-cols-1 gap-8 md:grid-cols-2 p-4 md:p-8 max-w-7xl mx-auto'>
				{/* Image Gallery Skeleton */}
				<div className='space-y-4'>
					<Skeleton.Avatar active size={400} shape='square' />
					<div className='flex gap-3 overflow-x-auto pb-4'>
						{[1, 2, 3, 4].map((_, i) => (
							<Skeleton.Avatar key={i} active size={80} shape='square' />
						))}
					</div>
				</div>

				{/* Product Info Skeleton */}
				<div className='space-y-6'>
					<Skeleton active paragraph={{ rows: 2 }} />
					<Skeleton active paragraph={{ rows: 1 }} />
					<Skeleton.Avatar active size='large' />
					<Skeleton active paragraph={{ rows: 3 }} />
					<Skeleton.Button active size='large' />
				</div>
			</div>
		)
	}

	if (!data) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<p className='text-lg text-muted-foreground'>Product not found</p>
			</div>
		)
	}

	const originalPrice = Number.parseFloat(data.price)
	const discountedPrice = Number.parseFloat(data.discounted_price)
	const discountPercent =
		originalPrice > discountedPrice
			? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
			: 0

	return (
		<div className='min-h-screen bg-background'>
			{/* Header */}
			<div className='sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b'>
				<div className='max-w-7xl mx-auto px-4 md:px-8 py-4'>
					<p className='text-sm text-muted-foreground'>{data.category}</p>
				</div>
			</div>

			{/* Main Content */}
			<div className='grid grid-cols-1 gap-8 md:grid-cols-2 p-4 md:p-8 max-w-7xl mx-auto'>
				{/* Image Gallery */}
				<div className='space-y-4'>
					{/* Main Image */}
					<div
						className='relative bg-card rounded-lg overflow-hidden aspect-square cursor-grab active:cursor-grabbing'
						onTouchStart={handleTouchStart}
						onTouchEnd={handleTouchEnd}
					>
						<img
							src={data.images[currentImageIndex] || '/placeholder.svg'}
							alt={data.name}
							className='object-cover w-full h-full'
						/>

						{discountPercent > 0 && (
							<div className='absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold'>
								-{discountPercent}%
							</div>
						)}
					</div>

					{/* Image Thumbnails Scroll */}
					{data.images.length > 1 && (
						<div className='relative'>
							{/* Left Arrow */}
							<button
								onClick={() => scrollImages('left')}
								className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background border rounded-full p-2 backdrop-blur'
								aria-label='Scroll images left'
							>
								<ChevronLeft className='w-5 h-5' />
							</button>

							{/* Scroll Container */}
							<div
								ref={scrollContainerRef}
								className='flex gap-3 overflow-x-auto pb-2 scroll-smooth scrollbar-hide'
							>
								{data.images.map((image, index) => (
									<button
										key={index}
										onClick={() => handleImageClick(index)}
										className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
											currentImageIndex === index
												? 'border-primary'
												: 'border-border hover:border-primary/50'
										}`}
									>
										<img
											src={image || '/placeholder.svg'}
											alt={`${data.name} ${index + 1}`}
											className='object-cover w-full h-full'
										/>
									</button>
								))}
							</div>

							{/* Right Arrow */}
							<button
								onClick={() => scrollImages('right')}
								className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background border rounded-full p-2 backdrop-blur'
								aria-label='Scroll images right'
							>
								<ChevronRight className='w-5 h-5' />
							</button>
						</div>
					)}
				</div>

				{/* Product Information */}
				<div className='space-y-6'>
					{/* Title */}
					<div>
						<h1 className='text-3xl md:text-4xl font-bold text-foreground mb-2'>
							{data.name}
						</h1>
						<p className='text-muted-foreground text-sm'>{data.category}</p>
					</div>

					{/* Rating */}
					<div className='flex items-center gap-2'>
						<div className='flex'>
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className='w-5 h-5 fill-yellow-400 text-yellow-400'
								/>
							))}
						</div>
						<span className='text-sm text-muted-foreground ml-2'>
							{data.average_rating} · {data.sold_count} sold
						</span>
					</div>

					{/* Price */}
					<div className='space-y-2'>
						<div className='flex items-baseline gap-3'>
							<span className='text-4xl font-bold text-foreground'>
								₹{discountedPrice.toLocaleString('en-IN')}
							</span>
							{discountPercent > 0 && (
								<span className='text-xl text-muted-foreground line-through'>
									₹{originalPrice.toLocaleString('en-IN')}
								</span>
							)}
						</div>
						{discountPercent > 0 && (
							<p className='text-sm font-semibold text-green-600'>
								Save ₹
								{Math.round(originalPrice - discountedPrice).toLocaleString(
									'en-IN'
								)}
							</p>
						)}
					</div>

					{/* Stock Status */}
					<div className='p-3 bg-muted rounded-lg'>
						<p className='text-sm'>
							<span className='font-semibold text-foreground'>
								{data.quantity > 0
									? `${data.quantity} in stock`
									: 'Out of stock'}
							</span>
							<span className='text-muted-foreground ml-2'>
								{data.quantity <= 5 && data.quantity > 0 && '⚠️ Limited stock'}
							</span>
						</p>
					</div>

					{/* Quantity Selector */}
					<div className='space-y-3'>
						<label className='text-sm font-semibold'>Quantity</label>
						<div className='flex items-center gap-4'>
							<div className='flex items-center border rounded-lg bg-card'>
								<button
									onClick={() => handleQuantityChange(quantity - 1)}
									disabled={quantity <= 1}
									className='p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
									aria-label='Decrease quantity'
								>
									<Minus className='w-4 h-4' />
								</button>
								<input
									type='number'
									value={quantity}
									onChange={e =>
										handleQuantityChange(Number.parseInt(e.target.value) || 1)
									}
									className='w-16 text-center border-0 bg-transparent font-semibold focus:outline-none'
									min='1'
									max={data.quantity}
								/>
								<button
									onClick={() => handleQuantityChange(quantity + 1)}
									disabled={quantity >= data.quantity}
									className='p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
									aria-label='Increase quantity'
								>
									<Plus className='w-4 h-4' />
								</button>
							</div>
							<span className='text-sm text-muted-foreground'>
								Max: {data.quantity}
							</span>
						</div>
					</div>

					{/* Add to Cart Button */}
					<button
						onClick={handleAddToCart}
						disabled={data.quantity <= 0}
						className='w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
					>
						<ShoppingCart className='w-5 h-5' />
						Add to Cart
					</button>

					{/* Description */}
					{data.description && (
						<div className='border-t pt-6'>
							<h3 className='font-semibold mb-2'>Description</h3>
							<p className='text-muted-foreground text-sm leading-relaxed'>
								{data.description ||
									'Premium quality remote control S.W.A.T car with music and lights. Perfect for kids and adults alike.'}
							</p>
						</div>
					)}

					{/* Features */}
					<div className='border-t pt-6'>
						<h3 className='font-semibold mb-4'>Features</h3>
						<ul className='space-y-2 text-sm'>
							<li className='flex gap-2'>
								<span className='text-primary'>✓</span>
								<span>Remote control S.W.A.T car</span>
							</li>
							<li className='flex gap-2'>
								<span className='text-primary'>✓</span>
								<span>Built-in music and LED lights</span>
							</li>
							<li className='flex gap-2'>
								<span className='text-primary'>✓</span>
								<span>High-speed performance</span>
							</li>
							<li className='flex gap-2'>
								<span className='text-primary'>✓</span>
								<span>Durable construction</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}
