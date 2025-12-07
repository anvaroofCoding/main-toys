import { useAddQuantityMutation } from '@/service/api'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'

export default function QuantityControl({
	quantity,
	onQuantityChange,
	maxQuantity,
	id,
	data,
}) {
	const [inputValue, setInputValue] = useState(String(quantity))
	const [pendingValue, setPendingValue] = useState(null)
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [typingTimeout, setTypingTimeout] = useState(null)
	const [value, setValue] = useState(0)
	console.log(value)

	const [addQuantity, { isLoading }] = useAddQuantityMutation()
	console.log(maxQuantity)
	console.log(data)

	// ❗ Shu limitdan katta yoki teng bo‘lsa modal ochiladi
	const LIMIT_FOR_CONFIRM = 1

	const filteredData = data?.find(item => {
		return item?.product_id == id
	})
	useEffect(() => {
		if (!value) return

		const numValue = Number.parseInt(value, 10)
		if (isNaN(numValue) || numValue <= 0) return

		// Max quantity check
		if (numValue > maxQuantity) {
			toast.warning(`Omborda faqat ${maxQuantity} ta bor`)
			return
		}
		if (filteredData?.quantity == maxQuantity) {
			toast.error(
				`Siz ${maxQuantity} dona ombordagi barchasini xarid qildingiz!`
			)
		} else {
			const timer = setTimeout(() => {
				if (filteredData) {
					if (filteredData?.quantity + numValue == maxQuantity) {
						setPendingValue(numValue)
						setConfirmOpen(true)
					} else {
						const hisobKitob = maxQuantity - filteredData?.quantity
						toast.warning(
							`Siz oldin ${filteredData?.quantity} dona xarid qilgansiz. Yana ${hisobKitob} dona xarid qilishingiz mumkin`
						)
					}
				} else if (numValue >= LIMIT_FOR_CONFIRM) {
					setPendingValue(numValue)
					setConfirmOpen(true)
				}
			}, 2000)
			return () => clearTimeout(timer)
		}
	}, [value, maxQuantity])

	console.log(pendingValue)

	const handleConfirm = async () => {
		onQuantityChange(pendingValue)
		await addQuantity({ product_id: id, quantity: pendingValue })
		setInputValue(String(pendingValue))
		setConfirmOpen(false)
		setPendingValue(null)
	}

	const handleCancel = () => {
		setInputValue(String(quantity))
		setConfirmOpen(false)
		setPendingValue(null)
	}

	const handleDecrease = () => {
		if (quantity > 1) {
			const newQuantity = quantity - 1
			setInputValue(String(newQuantity))
			onQuantityChange(newQuantity)
		}
	}

	const handleIncrease = () => {
		if (quantity < maxQuantity) {
			const newQuantity = quantity + 1
			setInputValue(String(newQuantity))
			onQuantityChange(newQuantity)
		}
	}

	return (
		<>
			<div className='flex items-center gap-2'>
				<Button
					variant='outline'
					size='icon'
					onClick={handleDecrease}
					disabled={quantity <= 1}
				>
					<Minus className='w-4 h-4' />
				</Button>

				<Input
					type='number'
					value={value}
					onChange={e => {
						setValue(e.target.value)
					}}
					min='1'
					max={maxQuantity}
					className='w-16 text-center'
				/>

				<Button
					variant='outline'
					size='icon'
					onClick={handleIncrease}
					disabled={quantity >= maxQuantity}
				>
					<Plus className='w-4 h-4' />
				</Button>

				<span className='text-sm text-muted-foreground ml-2'>
					Max: {maxQuantity}
				</span>
			</div>

			{/* CONFIRM MODAL */}
			<Dialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				aria-describedby={undefined}
			>
				<DialogContent aria-describedby={undefined}>
					<DialogHeader>
						<DialogTitle>
							{pendingValue} ta mahsulot sotib olmoqchimisiz?
						</DialogTitle>
					</DialogHeader>

					<p className='text-sm text-muted-foreground'>
						Tasdiqlasangiz savatchadagi son o‘zgaradi.
					</p>

					<DialogFooter className='mt-4 text-white'>
						<Button
							variant='outline'
							className='bg-red-500 hover:bg-red-600 border-none'
							onClick={handleCancel}
						>
							Yo‘q
						</Button>
						<Button onClick={handleConfirm}>Ha, tasdiqlayman</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
