import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
	useAddQuantityMutation,
	useDeleteQuantityMutation,
	useGetCardProductsQuery,
	useUpdateCardMutation,
} from '@/service/api'
import { Image, Input } from 'antd'
import {
	ArrowRight,
	Loader,
	Loader2,
	Minus,
	Plus,
	ShoppingBag,
	ShoppingCart,
	Trash2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function Order() {
	const { data = [], isLoading, refetch } = useGetCardProductsQuery()
	const [addQuantity] = useAddQuantityMutation()
	const [deleteQuantity, { isDeleting }] = useDeleteQuantityMutation()
	const [selected, setSelected] = useState([])
	const [loadingId, setLoadingId] = useState(null)
	const navigate = useNavigate()

	const [localQuantity, setLocalQuantity] = useState({})
	const [pendingUpdates, setPendingUpdates] = useState({})
	const timerRef = useRef({})

	const [confirmDialog, setConfirmDialog] = useState({
		open: false,
		itemId: null,
		newQuantity: null,
		type: 'confirm', // 'confirm' or 'exceed'
		sklad: null,
	})

	const [editCard] = useUpdateCardMutation()

	useEffect(() => {
		const newLocalQuantity = {}
		data.forEach(item => {
			// Only set if we haven't already got a local value
			if (localQuantity[item.id] === undefined) {
				newLocalQuantity[item.id] = item.quantity
			}
		})
		if (Object.keys(newLocalQuantity).length > 0) {
			setLocalQuantity(prev => ({ ...prev, ...newLocalQuantity }))
		}
	}, [data])

	const scheduleQuantityUpdate = (item, newQuantity) => {
		// Validate input
		if (newQuantity === '' || newQuantity === null) return

		const qty = Number(newQuantity)
		if (qty < 1) {
			setLocalQuantity(prev => ({ ...prev, [item.id]: item.quantity }))
			return
		}

		// Check stock limit
		if (qty > item.sklad_quantity) {
			setConfirmDialog({
				open: true,
				itemId: item.id,
				newQuantity: qty,
				type: 'exceed',
				sklad: item.sklad_quantity,
			})
			return
		}

		// Clear existing timer
		if (timerRef.current[item.id]) {
			clearTimeout(timerRef.current[item.id])
		}

		// Set pending update indicator
		setPendingUpdates(prev => ({ ...prev, [item.id]: true }))

		// Schedule API call after 1 second of inactivity
		timerRef.current[item.id] = setTimeout(async () => {
			try {
				await editCard({
					cart_id: item.id,
					quantity: qty,
				}).unwrap()
				refetch()
				setPendingUpdates(prev => ({ ...prev, [item.id]: false }))
				toast.success('Savat yangilandi')
			} catch (err) {
				console.error('Xatolik:', err)
				// Revert to original quantity on error
				setLocalQuantity(prev => ({ ...prev, [item.id]: item.quantity }))
				setPendingUpdates(prev => ({ ...prev, [item.id]: false }))
				toast.error('Savat yangilanmadi')
			}
		}, 1000)
	}

	const handleQuantityChange = (item, value) => {
		// Allow empty string while typing
		if (value === '') {
			setLocalQuantity(prev => ({ ...prev, [item.id]: '' }))
			return
		}

		const qty = Number(value)

		// Only allow positive numbers
		if (isNaN(qty) || qty < 0) return

		// Update local state immediately for UI responsiveness
		setLocalQuantity(prev => ({ ...prev, [item.id]: qty }))

		// Schedule the API update
		scheduleQuantityUpdate(item, qty)
	}

	const handleIncrease = async item => {
		const currentQty = Number(localQuantity[item.id] ?? item.quantity)
		if (currentQty >= item.sklad_quantity) {
			toast.warning(`Omborda ${item.sklad_quantity} dona qolgan`)
			return
		}
		handleQuantityChange(item, currentQty + 1)
	}

	const handleDecrease = async item => {
		const currentQty = Number(localQuantity[item.id] ?? item.quantity)
		if (currentQty > 1) {
			handleQuantityChange(item, currentQty - 1)
		}
	}

	const handleConfirmDialog = async () => {
		const { itemId, newQuantity, type } = confirmDialog
		const item = data.find(d => d.id === itemId)

		if (!item) return

		if (type === 'exceed') {
			// Set to max available
			setLocalQuantity(prev => ({ ...prev, [itemId]: item.sklad_quantity }))
			scheduleQuantityUpdate(item, item.sklad_quantity)
		}
		setConfirmDialog({
			open: false,
			itemId: null,
			newQuantity: null,
			type: 'confirm',
		})
	}

	const handleDeleteOne = async item => {
		try {
			await deleteQuantity([{ product_id: item.product_id }]).unwrap()
			refetch()
			setLocalQuantity(prev => {
				const updated = { ...prev }
				delete updated[item.id]
				return updated
			})
		} catch (err) {
			console.error("O'chirishda xatolik:", err)
		}
	}

	const toggleSelect = id => {
		setSelected(prev =>
			prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
		)
	}

	const handleDeleteSelected = async () => {
		try {
			const itemsToDelete = data
				.filter(item => selected.includes(item.product_id))
				.map(item => ({
					product_id: item.product_id,
				}))

			if (itemsToDelete.length === 0) {
				alert('Hech narsa tanlanmagan!')
				return
			}
			await deleteQuantity(itemsToDelete).unwrap()
			refetch()
			setSelected([])
			setLocalQuantity({})
		} catch (err) {
			console.error("O'chirishda xatolik:", err)
		}
	}

	const total = data.reduce(
		(sum, item) =>
			sum +
			(item.discounted_price
				? item.discounted_price * item.quantity
				: item.price * item.quantity),
		0
	)

	const handleOrder = () => navigate('/checkout')

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
					<div className='flex xl:flex-row flex-col gap-3'>
						<Link to='/barcha-maxsulotlar' className='text-white'>
							<Button className='mt-4 bg-blue-500 hover:bg-blue-600'>
								Xaridni davom etish <ArrowRight />
							</Button>
						</Link>
						<Link to='/my-order' className='text-white'>
							<Button className='mt-4 bg-orange-500 hover:bg-orange-600'>
								Buyurtmalarni kuzatish <ShoppingCart />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background pb-10'>
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
				<Dialog
					open={confirmDialog.open}
					onOpenChange={open =>
						!open && setConfirmDialog({ ...confirmDialog, open: false })
					}
					aria-describedby={undefined}
				>
					<DialogContent aria-describedby={undefined}>
						<DialogHeader>
							<DialogTitle>
								{confirmDialog.type === 'exceed'
									? `Maksimum ${confirmDialog.sklad} ta mavjud`
									: 'Miqdorni tasdiqlang'}
							</DialogTitle>
							<p className='text-sm text-muted-foreground'>
								{confirmDialog.type === 'exceed'
									? `Kiritgan miqdor ${confirmDialog.sklad} tadan ko'p. Maksimum miqdorni o'rnatish kerakmi?`
									: "Savatchadagi miqdor o'zgartiriladi."}
							</p>
						</DialogHeader>
						<DialogFooter className='mt-4 flex flex-row items-center justify-center'>
							<Button
								variant='outline'
								onClick={() =>
									setConfirmDialog({
										open: false,
										itemId: null,
										newQuantity: null,
										type: 'confirm',
									})
								}
							>
								Bekor qilish
							</Button>
							<div className='text-white'>
								<Button onClick={handleConfirmDialog}>Tasdiqlash</Button>
							</div>
						</DialogFooter>
					</DialogContent>
				</Dialog>

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
												disabled={
													loadingId === item.id || pendingUpdates[item.id]
												}
												className='h-8 w-8 rounded-full hover:bg-background'
											>
												{pendingUpdates[item.id] ? (
													<Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
												) : (
													<Minus className='h-4 w-4' />
												)}
											</Button>

											<Input
												type='number'
												value={localQuantity[item.id] ?? item.quantity}
												onChange={e =>
													handleQuantityChange(item, e.target.value)
												}
												className='w-16 text-center border border-gray-200 
													[&::-webkit-inner-spin-button]:appearance-none 
													[&::-webkit-outer-spin-button]:appearance-none 
													[&::-moz-inner-spin-button]:appearance-none'
												inputMode='numeric'
												min='1'
												max={item.sklad_quantity}
											/>

											<Button
												size='icon'
												variant='ghost'
												onClick={() => handleIncrease(item)}
												disabled={
													loadingId === item.id || pendingUpdates[item.id]
												}
												className='h-8 w-8 rounded-full hover:bg-background'
											>
												{pendingUpdates[item.id] ? (
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
											{isDeleting ? (
												<Loader className='h-4 w-4' />
											) : (
												<Trash2 className='h-4 w-4' />
											)}
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
										Tanlanganlarni o'chirish
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
