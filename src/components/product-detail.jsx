import { Button } from '@/components/ui/button'
import { useProductsDetailQuery } from '@/service/api'
import { Skeleton } from 'antd'
import { Star } from 'lucide-react'
import { useState } from 'react'
import ImageCarousel from './image-carousel'
import QuantityControl from './quantity-control'

export default function ProductDetail({ id }) {
	const [quantity, setQuantity] = useState(1)
	const { data: product, isLoading } = useProductsDetailQuery(id)

	const handleQuantityChange = newQuantity => {
		if (newQuantity > 0) {
			setQuantity(newQuantity)
			console.log('Quantity updated:', newQuantity)
		}
	}

	if (isLoading) {
		return (
			<div className='w-full'>
				<div className='px-4 py-8 md:px-8'>
					<div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12'>
						{/* Image skeleton */}
						<div className='flex flex-col gap-4'>
							<Skeleton.Image active className='w-full h-96 rounded-lg' />
							<div className='flex gap-2 overflow-x-auto'>
								{[1, 2, 3].map((_, i) => (
									<Skeleton.Image
										key={i}
										active
										className='w-20 h-20 flex-shrink-0 rounded'
									/>
								))}
							</div>
						</div>

						{/* Details skeleton */}
						<div className='flex flex-col gap-4'>
							<Skeleton active paragraph={{ rows: 3 }} />
							<Skeleton active paragraph={{ rows: 2 }} />
							<Skeleton.Button
								active
								style={{ width: '100%', height: '40px' }}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (!product) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<p className='text-lg text-muted-foreground'>Product not found</p>
			</div>
		)
	}

	return (
		<div className='w-full px-4 py-8 md:px-8'>
			<div className='mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12'>
				{/* Image Gallery */}
				<div className='flex flex-col gap-4'>
					<ImageCarousel images={product.images} productName={product.name} />
				</div>

				{/* Product Details */}
				<div className='flex flex-col gap-6'>
					{/* Category and Rating */}
					<div className='flex items-center gap-4'>
						<span className='inline-block bg-muted px-3 py-1 rounded-full text-sm font-medium'>
							{product.category}
						</span>
						<div className='flex items-center gap-1'>
							<Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
							<span className='font-semibold'>{product.average_rating}</span>
							<span className='text-sm text-muted-foreground'>
								({product.sold_count} sold)
							</span>
						</div>
					</div>

					{/* Product Name */}
					<h1 className='text-3xl md:text-4xl font-bold text-foreground'>
						{product.name}
					</h1>

					{/* Price Section */}
					<div className='flex items-baseline gap-3'>
						<span className='text-3xl md:text-4xl font-bold text-primary'>
							${product.discounted_price}
						</span>
						{product.discount > 0 && (
							<>
								<span className='text-xl text-muted-foreground line-through'>
									${product.price}
								</span>
								<span className='bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-semibold'>
									-{product.discount}%
								</span>
							</>
						)}
					</div>

					{/* Description */}
					<p className='text-muted-foreground text-lg leading-relaxed'>
						{product.description}
					</p>

					{/* Stock Status */}
					<div className='py-4 border-t border-b border-border'>
						<p className='text-sm'>
							<span className='font-semibold'>Stock Available: </span>
							<span
								className={
									product.quantity > 0 ? 'text-green-600' : 'text-red-600'
								}
							>
								{product.quantity > 0
									? `${product.quantity} units`
									: 'Out of stock'}
							</span>
						</p>
					</div>

					{/* Quantity Control */}
					<div className='flex flex-col gap-4'>
						<div>
							<label className='text-sm font-semibold block mb-2'>
								Quantity
							</label>
							<QuantityControl
								quantity={quantity}
								onQuantityChange={handleQuantityChange}
								maxQuantity={product.quantity}
							/>
						</div>

						{/* Add to Cart Button */}
						<Button
							size='lg'
							className='w-full'
							disabled={product.quantity === 0}
						>
							Add to Cart
						</Button>

						{/* Additional Info */}
						<div className='grid grid-cols-2 gap-4 text-sm'>
							<div className='border border-border rounded-lg p-4 text-center'>
								<p className='font-semibold'>Fast Shipping</p>
								<p className='text-muted-foreground text-xs'>
									Quick delivery available
								</p>
							</div>
							<div className='border border-border rounded-lg p-4 text-center'>
								<p className='font-semibold'>Secure Payment</p>
								<p className='text-muted-foreground text-xs'>
									100% safe transactions
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
