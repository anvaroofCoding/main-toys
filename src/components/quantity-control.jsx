import { useAddQuantityMutation, useUpdateCardMutation } from '@/service/api'
import { Loader, Minus, Plus } from 'lucide-react'
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
	const [filterData, setFilterData] = useState('')
	const [minusLoad, setMinusLoad] = useState(null)
	const [plusLoad, setplusLoad] = useState(null)

	const [addQuantity, { isLoading }] = useAddQuantityMutation()
	const [editCard] = useUpdateCardMutation()
	// ❗ Shu limitdan katta yoki teng bo‘lsa modal ochiladi
	const LIMIT_FOR_CONFIRM = 1

	const filteredData = data?.find(item => {
		const sum = item?.product_id == id
		return sum
	})
	useEffect(() => {
		setFilterData(filteredData?.quantity)
	}, [filteredData])

	useEffect(() => {
		if (!filterData) return
		const numValue = Number.parseInt(filterData, 10)
		if (isNaN(numValue) || numValue <= 0) return
		if (numValue > maxQuantity) {
			toast.warning(`Omborda faqat ${maxQuantity} ta bor`)
			setPendingValue(maxQuantity)
			setConfirmOpen(true)
		} else {
			const timer = setTimeout(() => {
				if (numValue >= LIMIT_FOR_CONFIRM) {
					setPendingValue(numValue)
					setConfirmOpen(true)
				}
			}, 2000)
			return () => clearTimeout(timer)
		}
	}, [value, maxQuantity])

	const handleConfirm = async () => {
		onQuantityChange(pendingValue)
		await editCard({ cart_id: filteredData?.id, quantity: pendingValue })
		setInputValue(String(pendingValue))
		setConfirmOpen(false)
		setPendingValue(null)
	}

	const handleCancel = () => {
		setInputValue(String(quantity))
		setConfirmOpen(false)
		setPendingValue(null)
	}

	const handleDecrease = async () => {
		await addQuantity({ product_id: id, quantity: -1 })
	}

	const handleIncrease = async () => {
		if (filteredData?.quantity > maxQuantity) {
			toast.warning('Omborda boshqa qolmadi!')
		} else {
			await addQuantity({ product_id: id, quantity: 1 })
		}
	}

	return (
		<>
			<div className='flex items-center gap-2'>
				<Button
					variant='outline'
					size='icon'
					onClick={handleDecrease}
					disabled={data?.quantity <= 1}
				>
					{isLoading ? (
						<Loader className='w-4 h-4 ' />
					) : (
						<Minus className='w-4 h-4' />
					)}
				</Button>

				<Input
					type='number'
					value={filterData ? filterData : 1}
					onChange={e => {
						setFilterData(e.target.value)
						setValue(e.target.value)
					}}
					min='1'
					max={maxQuantity}
					className='w-16 text-center border-1 border-gray-200'
					inputMode='numeric' // faqat raqamli klaviatura
					pattern='[0-9]*' // sonlarni kiritishga majbur qiladi
				/>

				<Button
					variant='outline'
					size='icon'
					onClick={handleIncrease}
					disabled={quantity >= maxQuantity}
				>
					{isLoading ? (
						<Loader className='w-4 h-4 ' />
					) : (
						<Plus className='w-4 h-4' />
					)}
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
						<Button onClick={handleConfirm} disabled={isLoading}>
							{isLoading ? 'Tastiqlanmoqda...' : 'Ha, tastiqlayman'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
