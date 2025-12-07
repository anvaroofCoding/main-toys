import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'

export default function ImageCarousel({ images, productName }) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [touchStart, setTouchStart] = useState(0)
	const [touchEnd, setTouchEnd] = useState(0)
	const autoRotateTimer = useRef(null)

	// Auto-rotate images every 3 seconds on mount
	useEffect(() => {
		autoRotateTimer.current = setInterval(() => {
			setCurrentIndex(prev => (prev + 1) % images.length)
		}, 3000)

		return () => {
			if (autoRotateTimer.current) {
				clearInterval(autoRotateTimer.current)
			}
		}
	}, [images.length])

	// Reset timer when manually changing image
	const resetAutoRotate = () => {
		if (autoRotateTimer.current) {
			clearInterval(autoRotateTimer.current)
		}
		autoRotateTimer.current = setInterval(() => {
			setCurrentIndex(prev => (prev + 1) % images.length)
		}, 3000)
	}

	const goToPrevious = () => {
		setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
		resetAutoRotate()
	}

	const goToNext = () => {
		setCurrentIndex(prev => (prev + 1) % images.length)
		resetAutoRotate()
	}

	const goToImage = index => {
		setCurrentIndex(index)
		resetAutoRotate()
	}

	// Handle touch swipe on mobile
	const handleTouchStart = e => {
		setTouchStart(e.targetTouches[0].clientX)
	}

	const handleTouchEnd = e => {
		setTouchEnd(e.changedTouches[0].clientX)
		handleSwipe()
	}

	const handleSwipe = () => {
		if (!touchStart || !touchEnd) return

		const distance = touchStart - touchEnd
		const isLeftSwipe = distance > 50
		const isRightSwipe = distance < -50

		if (isLeftSwipe) {
			goToNext()
		} else if (isRightSwipe) {
			goToPrevious()
		}
	}

	if (images.length === 0) {
		return (
			<div className='w-full h-96 bg-muted rounded-lg flex items-center justify-center'>
				<p className='text-muted-foreground'>No images available</p>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-4'>
			{/* Main Image */}
			<div
				className='relative w-full bg-muted rounded-lg overflow-hidden group'
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				<div className='aspect-square relative'>
					<img
						src={images[currentIndex] || '/placeholder.svg'}
						alt={`${productName} - Image ${currentIndex + 1}`}
						className='w-full h-full object-cover'
					/>

					{/* Navigation Buttons - Desktop only */}
					<div className='absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity'>
						<Button
							variant='ghost'
							size='icon'
							onClick={goToPrevious}
							className='bg-white/80 hover:bg-white rounded-full'
							aria-label='Previous image'
						>
							<ChevronLeft className='w-6 h-6' />
						</Button>
						<Button
							variant='ghost'
							size='icon'
							onClick={goToNext}
							className='bg-white/80 hover:bg-white rounded-full'
							aria-label='Next image'
						>
							<ChevronRight className='w-6 h-6' />
						</Button>
					</div>

					{/* Image Counter */}
					<div className='absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
						{currentIndex + 1} / {images.length}
					</div>
				</div>
			</div>

			{/* Thumbnail Images */}
			{images.length > 1 && (
				<div className='flex gap-2 overflow-x-auto pb-2'>
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => goToImage(index)}
							className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
								index === currentIndex
									? 'border-primary'
									: 'border-border hover:border-muted-foreground'
							}`}
							aria-label={`View image ${index + 1}`}
						>
							<img
								src={image || '/placeholder.svg'}
								alt={productName}
								className='w-full h-full object-cover rounded-lg'
							/>
						</button>
					))}
				</div>
			)}
		</div>
	)
}
