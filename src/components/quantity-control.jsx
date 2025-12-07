import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function QuantityControl({
	quantity,
	onQuantityChange,
	maxQuantity,
}) {
	const [inputValue, setInputValue] = useState(String(quantity))

	const handleInputChange = e => {
		const value = e.target.value
		setInputValue(value)

		// Only update if it's a valid number
		if (value === '') return

		const numValue = Number.parseInt(value, 10)
		if (!isNaN(numValue) && numValue > 0 && numValue <= maxQuantity) {
			onQuantityChange(numValue)
			console.log('Input quantity value:', numValue)
		}
	}

	const handleInputBlur = () => {
		// If input is empty or invalid, reset to current quantity
		if (inputValue === '' || isNaN(Number.parseInt(inputValue, 10))) {
			setInputValue(String(quantity))
		} else {
			const numValue = Math.min(
				Math.max(Number.parseInt(inputValue, 10), 1),
				maxQuantity
			)
			setInputValue(String(numValue))
			onQuantityChange(numValue)
		}
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
		<div className='flex items-center gap-2'>
			{/* Decrease Button */}
			<Button
				variant='outline'
				size='icon'
				onClick={handleDecrease}
				disabled={quantity <= 1}
				aria-label='Decrease quantity'
			>
				<Minus className='w-4 h-4' />
			</Button>

			{/* Quantity Input */}
			<Input
				type='number'
				value={inputValue}
				onChange={handleInputChange}
				onBlur={handleInputBlur}
				min='1'
				max={maxQuantity}
				className='w-16 text-center'
				aria-label='Quantity input'
			/>

			{/* Increase Button */}
			<Button
				variant='outline'
				size='icon'
				onClick={handleIncrease}
				disabled={quantity >= maxQuantity}
				aria-label='Increase quantity'
			>
				<Plus className='w-4 h-4' />
			</Button>

			{/* Max quantity info */}
			<span className='text-sm text-muted-foreground ml-2'>
				Max: {maxQuantity}
			</span>
		</div>
	)
}
