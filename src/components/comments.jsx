import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useAddCommentMutation, useGetCommentQuery } from '@/service/api'
import { MessageCircle, Star } from 'lucide-react'
import { useState } from 'react'

const Comments = ({ id }) => {
	const { data, isLoading } = useGetCommentQuery(id)
	const [addComment, { isLoading: isSubmitting }] = useAddCommentMutation()
	const [comment, setComment] = useState('')
	const [rating, setRating] = useState(5)
	const [hoveredRating, setHoveredRating] = useState(0)

	const handleSubmit = async e => {
		e.preventDefault()
		if (!comment.trim()) return

		try {
			await addComment({
				product_id: id,
				comment: comment,
				rating: rating,
			})
			setComment('')
			setRating(5)
		} catch (error) {
			console.error('Failed to add comment:', error)
		}
	}

	return (
		<div className='space-y-6 container'>
			<Card className='p-6'>
				<h3 className='font-semibold text-lg mb-4'>
					Mahsulot uchun izoh qoldiring
				</h3>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<Textarea
						placeholder='Izoh matni'
						value={comment}
						onChange={e => setComment(e.target.value)}
						disabled={isSubmitting}
						className='resize-none'
						rows={4}
					/>

					<div className='flex items-center gap-2 mt-5'>
						<span className='text-sm font-medium'>Rating:</span>
						<div className='flex gap-1'>
							{[1, 2, 3, 4, 5].map(star => (
								<button
									key={star}
									type='button'
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoveredRating(star)}
									onMouseLeave={() => setHoveredRating(0)}
									disabled={isSubmitting}
									className='transition-colors'
								>
									<Star
										size={20}
										className={
											star <= (hoveredRating || rating)
												? 'fill-yellow-400 text-yellow-400'
												: 'text-gray-300'
										}
									/>
								</button>
							))}
						</div>
						<span className='text-sm text-muted-foreground ml-2'>
							{rating} / 5
						</span>
					</div>

					<div className='text-white'>
						<Button
							type='submit'
							disabled={!comment.trim() || isSubmitting}
							className='w-full text-white'
						>
							{isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'} <MessageCircle />
						</Button>
					</div>
				</form>
			</Card>

			<div className='space-y-4'>
				<h3 className='font-semibold text-lg'>Izohlar</h3>

				{isLoading ? (
					<div className='space-y-3'>
						{[1, 2, 3].map(i => (
							<Card key={i} className='p-4'>
								<div className='space-y-3 animate-pulse'>
									<div className='flex items-center gap-3'>
										<div className='w-10 h-10 bg-muted rounded-full' />
										<div className='flex-1'>
											<div className='h-4 bg-muted rounded w-32' />
											<div className='h-3 bg-muted rounded w-24 mt-1' />
										</div>
									</div>
									<div className='h-4 bg-muted rounded w-full' />
									<div className='h-4 bg-muted rounded w-5/6' />
								</div>
							</Card>
						))}
					</div>
				) : !data || data.length === 0 ? (
					<div className='text-center py-8 text-muted-foreground'>
						Izohlar topilmadi!
					</div>
				) : (
					data.map(item => (
						<Card
							key={item.id}
							className='p-4 hover:shadow-md transition-shadow py-5 mb-10'
						>
							<div className='flex items-start gap-3'>
								<div className='flex-1'>
									<div className='flex items-center justify-between mb-2'>
										<h4 className='font-semibold'>{item.first_name}</h4>
										<div className='flex gap-0.5'>
											{[1, 2, 3, 4, 5].map(star => (
												<Star
													key={star}
													size={16}
													className={
														star <= item.rating
															? 'fill-yellow-400 text-yellow-400'
															: 'text-gray-300'
													}
												/>
											))}
										</div>
									</div>
									<p className='text-sm text-muted-foreground mb-2'>
										{new Date(item.created_at).toLocaleDateString()}
									</p>
									<p className='text-foreground'>{item.text}</p>
								</div>
							</div>
						</Card>
					))
				)}
			</div>
		</div>
	)
}

export default Comments
