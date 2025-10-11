import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
	useAddQuantityMutation,
	useDeleteQuantityMutation,
	useGetCardProductsQuery,
} from '@/service/api'
import { Image } from 'antd'
import {
	Loader2,
	Minus,
	Plus,
	ShoppingBag,
	ShoppingCart,
	Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'sonner'

export default function Order() {
	const { data = [], isLoading, refetch } = useGetCardProductsQuery()
	const [addQuantity] = useAddQuantityMutation()
	const [deleteQuantity, { isLoading: isDeleting }] =
		useDeleteQuantityMutation()
	const [selected, setSelected] = useState([])
	const [loadingId, setLoadingId] = useState(null)
	const navigate = useNavigate()

	// Loader
	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-background'>
				<div className='flex flex-col items-center gap-3'>
					<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
					<p className='text-sm text-muted-foreground'>Yuklanmoqda...</p>
				</div>
			</div>
		)
	}

	console.log(data)
	// Bo'sh savat
	if (data.length === 0) {
		return (
			<div className='flex min-h-screen flex-col items-center justify-center px-4'>
				<div className='flex flex-col items-center gap-4 text-center'>
					<div className='rounded-full bg-blue-50 p-6'>
						<ShoppingBag className='h-12 w-12 text-blue-500' />
					</div>
					<div className='space-y-2'>
						<h2 className='text-2xl font-semibold tracking-tight'>
							Savat bo'sh
						</h2>
						<p className='text-sm text-muted-foreground'>
							Hozircha hech narsa qo'shilmagan
						</p>
					</div>
					<Link to='/' className='text-white'>
						<Button className='mt-4 bg-blue-500 hover:bg-blue-600'>
							Xaridni davom etish
						</Button>
					</Link>
				</div>
			</div>
		)
	}

	// Qo'shish
	const handleIncrease = async item => {
		setLoadingId(item.id)
		try {
			if (item.quantity == item.sklad_quantity) {
				toast.warning(`Omborda ${item.sklad_quantity} dona qolgan`)
			} else {
				await addQuantity({
					product_id: item.product_id,
					color: item.color,
					quantity: 1,
				}).unwrap()
				refetch()
			}
		} catch (err) {
			console.error('Oshirishda xatolik:', err)
		} finally {
			setLoadingId(null)
		}
	}

	// Kamaytirish
	const handleDecrease = async item => {
		setLoadingId(item.id)
		try {
			if (item.quantity === 1) {
				await deleteQuantity([
					{ product_id: item.product_id, color: item.color },
				]).unwrap()
				window.location.reload()
			} else {
				await addQuantity({
					product_id: item.product_id,
					color: item.color,
					quantity: -1,
				}).unwrap()
			}
			refetch()
		} catch (err) {
			console.error('Kamaytirishda xatolik:', err)
		} finally {
			setLoadingId(null)
		}
	}

	// 1 mahsulotni o'chirish
	const handleDeleteOne = async item => {
		try {
			await deleteQuantity([
				{ product_id: item.product_id, color: item.color },
			]).unwrap()
			refetch()
			window.location.reload()
		} catch (err) {
			console.error("O'chirishda xatolik:", err)
		}
	}

	// Tanlash
	const toggleSelect = id => {
		setSelected(prev =>
			prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
		)
	}

	// Belgilanganlarni o'chirish
	const handleDeleteSelected = async () => {
		try {
			const itemsToDelete = data
				.filter(item => selected.includes(item.product_id))
				.map(item => ({
					product_id: item.product_id,
					color: item.color,
				}))

			if (itemsToDelete.length === 0) {
				alert('Hech narsa tanlanmagan!')
				return
			}
			await deleteQuantity(itemsToDelete).unwrap()
			refetch()
			window.location.reload()
			setSelected([])
		} catch (err) {
			console.error("O'chirishda xatolik:", err)
		}
	}

	// Jami summa
	const total = data.reduce(
		(sum, item) =>
			sum +
			(item.discounted_price
				? item.discounted_price * item.quantity
				: item.price * item.quantity),
		0
	)

	const handleOrder = () => navigate('/checkout')

	return (
		<div className='min-h-screen bg-background pb-10'>
			<Toaster position='top-center' richColors />
			{/* Header */}
			<div className='sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='mx-auto max-w-4xl px-4 py-4 sm:px-6'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='rounded-full bg-blue-50 p-2'>
								<ShoppingCart className='h-5 w-5 text-blue-500' />
							</div>
							<div>
								<h1 className='text-xl font-semibold tracking-tight sm:text-2xl'>
									Savat
								</h1>
								<p className='text-sm text-muted-foreground'>
									{data.length} mahsulot
								</p>
							</div>
						</div>
						{selected.length > 0 && (
							<Badge variant='secondary' className='bg-blue-50 text-blue-700'>
								{selected.length} tanlandi
							</Badge>
						)}
					</div>
				</div>
			</div>
			{/* Main Content */}
			<div className='mx-auto max-w-4xl px-4 py-6 sm:px-6'>
				<div className='space-y-3 py-5'>
					{data.map(item => (
						<Card
							key={item.id}
							className='overflow-hidden transition-all hover:shadow-md'
						>
							<div className='flex gap-4 px-4 sm:flex-row sm:items-center sm:gap-6'>
								{/* Checkbox & Image */}
								<div className='flex flex-col justify-between gap-5'>
									<Checkbox
										checked={selected.includes(item.product_id)}
										onCheckedChange={() => toggleSelect(item.product_id)}
										className='mt-1 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 sm:mt-0 w-7 h-7'
									/>
									<Link href={`/product/${item.product_id}`}>
										<div className='relative h-30 w-30 flex-shrink-0 overflow-hidden rounded-lg border bg-muted sm:h-24 sm:w-24'>
											<Image
												src={item.images[0] || '/placeholder.svg'}
												alt={item.name}
												className='h-full w-full object-contain p-2'
											/>
										</div>
									</Link>
								</div>

								{/* Product Info */}
								<div className='flex flex-1 flex-col justify-between '>
									<Link href={`/product/${item.product_id}`} className='flex-1'>
										<div className='space-y-1'>
											<h3 className='font-medium leading-tight line-clamp-2'>
												{item.name}
											</h3>
											<p className='text-sm text-muted-foreground'>
												{item.category}
											</p>
											<p className='text-xs font-semibold text-gray-500'>
												{item.color}
											</p>
											<p className='text-base font-semibold text-blue-500 sm:text-lg'>
												{(item.discounted_price || item.price).toLocaleString()}{' '}
												so'm
											</p>
										</div>
									</Link>

									{/* Controls */}
									<div className='flex w-full items-center justify-between gap-3 '>
										{/* Quantity Controls */}
										<div className='flex items-center gap-1 rounded-full border bg-muted/50 p-1'>
											<Button
												size='icon'
												variant='ghost'
												onClick={() => handleDecrease(item)}
												disabled={loadingId === item.id}
												className='h-8 w-8 rounded-full hover:bg-background'
											>
												{loadingId === item.id ? (
													<Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
												) : (
													<Minus className='h-4 w-4' />
												)}
											</Button>

											<span className='min-w-[2rem] text-center text-sm font-medium'>
												{item.quantity}
											</span>

											<Button
												size='icon'
												variant='ghost'
												onClick={() => handleIncrease(item)}
												disabled={loadingId === item.id}
												className='h-8 w-8 rounded-full hover:bg-background'
											>
												{loadingId === item.id ? (
													<Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
												) : (
													<Plus className='h-4 w-4' />
												)}
											</Button>
										</div>

										{/* Delete Button */}
										<Button
											size='icon'
											variant='ghost'
											onClick={() => handleDeleteOne(item)}
											className='h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive'
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>

				{/* Bottom Actions - Fixed on Mobile */}
				<div className='border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:relative sm:border-0 sm:bg-transparent sm:backdrop-blur-none'>
					<div className='mx-auto max-w-4xl px-4 py-4 sm:px-6'>
						<Card className='border-0 shadow-none sm:border sm:shadow-sm'>
							<div className='space-y-4 p-4 sm:p-6'>
								{/* Total */}
								<div className='flex items-center justify-between'>
									<span className='text-base text-muted-foreground sm:text-lg'>
										Jami summa:
									</span>
									<span className='text-xl font-bold text-blue-500 sm:text-2xl'>
										{total.toLocaleString()} so'm
									</span>
								</div>

								<Separator />

								{/* Action Buttons */}
								<div className='flex flex-col gap-3 sm:flex-row text-white'>
									<Button
										variant='destructive'
										onClick={handleDeleteSelected}
										disabled={isDeleting || selected.length === 0}
										className='flex-1 bg-red-600 hover:bg-red-700 text-white transition-colors'
									>
										{isDeleting ? (
											<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										) : (
											<Trash2 className='mr-2 h-4 w-4' />
										)}
										Tanlanganlarni o‘chirish
									</Button>

									<div className='flex-1 text-white'>
										<Button
											onClick={handleOrder}
											className='w-full bg-blue-500 hover:bg-blue-600 text-white'
										>
											<ShoppingCart className='mr-2 h-4 w-4' />
											Buyurtma berish
										</Button>
									</div>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
