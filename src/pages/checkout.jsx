import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
	useGetCardProductsQuery,
	useGetMeQuery,
	useSuccessOrderMutation,
	useUpdateUserMutation,
} from '@/service/api'
import { Image } from 'antd'
import { CreditCard, Loader2, MapPin, ShoppingBag, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
	// 📦 RTK Query hooklar
	const { data: user, isLoading: userLoading } = useGetMeQuery()
	const { data: cart = [], isLoading: cartLoading } = useGetCardProductsQuery()
	const [updateUser] = useUpdateUserMutation()
	const [createOrder, { isLoading: ordering }] = useSuccessOrderMutation()
	const navigate = useNavigate()

	// 🧍 Foydalanuvchi form holati
	const [userData, setUserData] = useState({
		first_name: '',
		last_name: '',
		phone_number: '',
		address: '',
	})
	const [paymentMethod, setPaymentMethod] = useState('naxt')

	// 🔁 Backenddan kelgan foydalanuvchi ma'lumotlarini forma ichiga joylash
	useEffect(() => {
		if (user) {
			setUserData({
				first_name: user.first_name || '',
				last_name: user.last_name || '',
				phone_number: user.phone_number || '',
				address: user.address || '',
			})
		}
	}, [user])

	// ✏️ Forma o'zgarishlarini boshqarish
	const handleChange = e => {
		setUserData({ ...userData, [e.target.name]: e.target.value })
	}

	// 💰 Savatchadagi jami summa
	const totalPrice = cart.reduce(
		(sum, item) => sum + Number.parseFloat(item.price) * item.quantity,
		0
	)

	// 🚀 Tasdiqlash (ham foydalanuvchini yangilaydi, ham buyurtma yaratadi)
	const handleSubmit = async e => {
		e.preventDefault()

		if (!userData.first_name || !userData.phone_number || !userData.address) {
			return toast.error("Iltimos, barcha maydonlarni to'ldiring!")
		}

		try {
			// 1️⃣ Avval foydalanuvchini yangilaymiz
			await updateUser(userData).unwrap()

			// 2️⃣ Keyin buyurtmani yaratamiz
			const orderPayload = {
				payment_method: paymentMethod,
				product_items: cart.map(item => ({
					product_id: item.product_id,
					quantity: item.quantity,
					color: item.color,
				})),
			}

			const res = await createOrder(orderPayload).unwrap()
			navigate('/buyurtmalar')
			window.location.reload()
			// 3️⃣ To\'lov turi bo\'yicha natija
			if (paymentMethod === 'karta' && res?.payment_link) {
				window.location.reload()
				window.location.href = res.payment_link
			} else {
				toast.success('Buyurtma muvaffaqiyatli yaratildi')
			}
		} catch (err) {
			console.error('❌ Xatolik:', err)
			toast.error("Xatolik yuz berdi, qayta urinib ko'ring!")
		}
	}

	// ⏳ Loader
	if (userLoading || cartLoading)
		return (
			<div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white'>
				<div className='flex flex-col items-center gap-3'>
					<Loader2 className='h-10 w-10 animate-spin text-blue-500' />
					<p className='text-sm text-muted-foreground'>Yuklanmoqda...</p>
				</div>
			</div>
		)

	console.log(cart)
	return (
		<div className='min-h-screen pb-30 bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8'>
			<Toaster
				position='top-center'
				toastOptions={{
					duration: 3000,
					style: {
						background: '#fff',
						color: '#000',
						borderRadius: '12px',
						padding: '16px',
					},
				}}
			/>

			<div className='mx-auto max-w-3xl'>
				{/* Header */}
				<div className='mb-8 text-center'>
					<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10'>
						<ShoppingBag className='h-8 w-8 text-blue-500' />
					</div>
					<h1 className='text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl'>
						Buyurtma berish
					</h1>
					<p className='mt-2 text-sm text-muted-foreground'>
						Ma'lumotlaringizni to'ldiring va buyurtmani tasdiqlang
					</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* 👤 Foydalanuvchi ma'lumotlari */}
					<Card className='border-gray-200 shadow-sm transition-shadow hover:shadow-md'>
						<CardHeader className='pb-4'>
							<CardTitle className='flex items-center gap-2 text-lg font-medium'>
								<User className='h-5 w-5 text-blue-500' />
								Shaxsiy ma'lumotlar
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid gap-4 sm:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='first_name' className='text-sm font-medium'>
										Ism <span className='text-red-500'>*</span>
									</Label>
									<Input
										id='first_name'
										type='text'
										name='first_name'
										value={userData.first_name}
										onChange={handleChange}
										placeholder='Ismingizni kiriting'
										className='h-11 border-gray-300 focus-visible:ring-blue-500'
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='last_name' className='text-sm font-medium'>
										Familiya
									</Label>
									<Input
										id='last_name'
										type='text'
										name='last_name'
										value={userData.last_name}
										onChange={handleChange}
										placeholder='Familiyangizni kiriting'
										className='h-11 border-gray-300 focus-visible:ring-blue-500'
									/>
								</div>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='phone_number' className='text-sm font-medium'>
									Telefon raqam <span className='text-red-500'>*</span>
								</Label>
								<Input
									id='phone_number'
									type='tel'
									name='phone_number'
									value={userData.phone_number}
									onChange={handleChange}
									placeholder='+998 90 123 45 67'
									className='h-11 border-gray-300 focus-visible:ring-blue-500'
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='address' className='text-sm font-medium'>
									<span className='flex items-center gap-2'>
										<MapPin className='h-4 w-4 text-blue-500' />
										Yetkazib berish manzili{' '}
										<span className='text-red-500'>*</span>
									</span>
								</Label>
								<Textarea
									id='address'
									name='address'
									value={userData.address}
									onChange={handleChange}
									placeholder="Shahar, ko'cha, uy raqami"
									rows={3}
									className='resize-none border-gray-300 focus-visible:ring-blue-500'
									required
								/>
							</div>
						</CardContent>
					</Card>

					{/* 🛍 Savatchadagi mahsulotlar */}
					<Card className='border-gray-200 shadow-sm transition-shadow hover:shadow-md'>
						<CardHeader className='pb-4'>
							<CardTitle className='flex items-center gap-2 text-lg font-medium'>
								<ShoppingBag className='h-5 w-5 text-blue-500' />
								Buyurtma tarkibi
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							{cart.length === 0 ? (
								<p className='py-8 text-center text-sm text-muted-foreground'>
									{"Savatchada mahsulot yo'q"}
								</p>
							) : (
								<>
									<div className='space-y-3'>
										{cart.map((item, idx) => (
											<div
												key={idx}
												className='flex items-center justify-between gap-5 rounded-lg border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50'
											>
												<Image
													src={item.image}
													alt={item.name}
													width={50}
													className='rounded-md'
												/>
												<div className='flex-1'>
													<p className='font-medium text-gray-900'>
														{item.name}
													</p>
													<div className='mt-1 flex items-center gap-3 text-sm text-muted-foreground'>
														<span>{item.quantity} dona</span>
														<span className='h-1 w-1 rounded-full bg-gray-300' />
														<span className='capitalize'>{item.color}</span>
													</div>
												</div>
												<p className='text-base font-semibold text-blue-500'>
													{(
														item.quantity * Number.parseFloat(item.price)
													).toLocaleString()}{' '}
													so'm
												</p>
											</div>
										))}
									</div>

									<div className='mt-6 flex items-center justify-between border-t border-gray-200 pt-4'>
										<p className='text-base font-medium text-gray-900'>
											Jami summa:
										</p>
										<p className='text-2xl font-semibold text-blue-500'>
											{totalPrice.toLocaleString()} so'm
										</p>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					{/* 💳 To'lov turi */}
					<Card className='border-gray-200 shadow-sm transition-shadow hover:shadow-md'>
						<CardHeader className='pb-4'>
							<CardTitle className='flex items-center gap-2 text-lg font-medium'>
								<CreditCard className='h-5 w-5 text-blue-500' />
								To'lov usuli
							</CardTitle>
						</CardHeader>
						<CardContent>
							<RadioGroup
								value={paymentMethod}
								onValueChange={setPaymentMethod}
								className='grid gap-3 sm:grid-cols-2'
							>
								<Label
									htmlFor='naxt'
									className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all ${
										paymentMethod === 'naxt'
											? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
											: 'border-gray-200 bg-white hover:border-gray-300'
									}`}
								>
									<div className='flex items-center gap-3'>
										<RadioGroupItem
											value='naxt'
											id='naxt'
											className='border-blue-500 text-blue-500'
										/>
										<div>
											<p className='font-medium text-gray-900'>Naqd pul</p>
											<p className='text-xs text-muted-foreground'>
												Yetkazib berishda to'lash
											</p>
										</div>
									</div>
								</Label>

								<Label
									htmlFor='karta'
									className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all ${
										paymentMethod === 'karta'
											? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
											: 'border-gray-200 bg-white hover:border-gray-300'
									}`}
								>
									<div className='flex items-center gap-3'>
										<RadioGroupItem
											value='karta'
											id='karta'
											className='border-blue-500 text-blue-500'
										/>
										<div>
											<p className='font-medium text-gray-900'>Bank kartasi</p>
											<p className='text-xs text-muted-foreground'>
												Onlayn to'lov
											</p>
										</div>
									</div>
								</Label>
							</RadioGroup>
						</CardContent>
					</Card>

					{/* ✅ Yakuniy tugma */}
					<div className='sticky bottom-4 z-10 text-white'>
						<Button
							type='submit'
							disabled={ordering || cart.length === 0}
							className='h-14 w-full rounded-xl bg-blue-500 text-base font-semibold shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none'
						>
							{ordering ? (
								<>
									<Loader2 className='mr-2 h-5 w-5 animate-spin' />
									Yuborilmoqda...
								</>
							) : (
								<>
									Buyurtmani tasdiqlash
									<span className='ml-2'>→</span>
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Checkout
