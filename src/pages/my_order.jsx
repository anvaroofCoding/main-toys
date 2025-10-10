import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useClickLinkMutation, useMyOrderQuery } from '@/service/api'
import { Image } from 'antd'
import {
	ArrowRight,
	CheckCircle2,
	Clock,
	CreditCard,
	Loader2,
	Package,
	XCircle,
} from 'lucide-react'

const MyOrder = () => {
	const { data = [], isLoading } = useMyOrderQuery()
	const [ClickLink, { isLoading: loads }] = useClickLinkMutation()

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<Loader2 className='h-10 w-10 text-blue-500 animate-spin' />
			</div>
		)
	}

	const handClick = async clickID => {
		const order_ids = { order_id: clickID }
		const res = await ClickLink(order_ids).unwrap()
		// if (res?.payment_link) {
		// 	window.location.href = res.payment_link
		// }
		console.log(res)
	}

	console.log(data)

	if (!data.length) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen px-4'>
				<div className='flex flex-col items-center max-w-md text-center space-y-4'>
					<div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center'>
						<Package className='h-10 w-10 text-muted-foreground' />
					</div>
					<h2 className='text-2xl font-semibold tracking-tight'>
						Buyurtmalar yo'q
					</h2>
					<p className='text-muted-foreground leading-relaxed'>
						Sizda hozircha hech qanday buyurtma yo'q. Birinchi buyurtmangizni
						joylashtiring.
					</p>
				</div>
			</div>
		)
	}

	const getStatusConfig = status => {
		switch (status) {
			case 'completed':
			case 'delivered':
				return {
					label: 'Yetkazildi',
					variant: 'default',
					icon: CheckCircle2,
					className: 'bg-blue-500 text-white hover:bg-blue-600',
				}
			case 'delivering':
				return {
					label: 'Yetkazilyapdi',
					variant: 'default',
					icon: CheckCircle2,
					className: 'bg-green-500 text-white hover:bg-green-600',
				}
			case 'pending':
				return {
					label: 'Kutilmoqda',
					variant: 'secondary',
					icon: Clock,
					className: 'bg-yellow-400 text-white',
				}
			case 'cancelled':
				return {
					label: 'Bekor qilindi',
					variant: 'destructive',
					icon: XCircle,
					className:
						'bg-destructive/10 text-destructive hover:bg-destructive/20',
				}
			default:
				return {
					label: "Noma'lum",
					variant: 'secondary',
					icon: Clock,
					className: 'bg-secondary text-secondary-foreground',
				}
		}
	}

	return (
		<div className='min-h-screen bg-background pb-20'>
			<div className='max-w-4xl mx-auto px-4 py-8 md:py-12 lg:py-16'>
				<div className='mb-8 md:mb-12'>
					<h1 className='text-3xl md:text-4xl font-semibold tracking-tight text-balance mb-2'>
						Mening buyurtmalarim
					</h1>
					<p className='text-muted-foreground text-base md:text-lg'>
						Barcha buyurtmalaringiz tarixi
					</p>
				</div>

				<div className='space-y-4 md:space-y-6'>
					{data.map((order, index) => {
						const statusConfig = getStatusConfig(order.status)
						const StatusIcon = statusConfig.icon

						return (
							<Card
								key={order.order_id || index}
								className='border border-border shadow-sm hover:shadow-md transition-shadow duration-200'
							>
								<CardHeader className='pb-4'>
									<div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
										<div className='space-y-1'>
											<div className='flex items-center w-full justify-between'>
												<h3 className='text-lg font-semibold tracking-tight'>
													Buyurtma №{order.order_id || index + 1}
												</h3>
												<p>
													{order.is_paid == true ? (
														<span className='bg-green-500 text-white p-2 rounded-md text-xs'>
															To'langan
														</span>
													) : (
														<span className='bg-red-500 text-white p-2 rounded-md text-xs'>
															To'lanmagan
														</span>
													)}
												</p>
											</div>
										</div>
										<div className=' w-full flex items-center justify-between'>
											<Badge
												variant={statusConfig.variant}
												className={`${statusConfig.className} flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium`}
											>
												<StatusIcon className='h-3.5 w-3.5' />
												{statusConfig.label}
											</Badge>
											{order.payment_method == 'naxt' ||
											order.is_paid == true ||
											order.status == 'cancelled' ? (
												''
											) : (
												<div className='text-white'>
													<Button
														onClick={() => handClick(order.order_id)}
														className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md px-4 py-2 rounded-xl'
													>
														<CreditCard className='w-4 h-4' />
														<span>Click bilan to'lash</span>
														<ArrowRight className='w-4 h-4' />
													</Button>
												</div>
											)}
										</div>
									</div>
								</CardHeader>

								<CardContent className='space-y-6'>
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
										<div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
											<div className='w-10 h-10 rounded-full bg-background flex items-center justify-center'>
												<CreditCard className='h-5 w-5 text-blue-500' />
											</div>
											<div>
												<p className='text-xs text-muted-foreground mb-0.5'>
													To'lov turi
												</p>
												<p className='text-sm font-medium'>
													{order.payment_method === 'naxt'
														? "Naqd to'lov"
														: 'Karta orqali'}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-3 p-3 rounded-lg bg-blue-500/5'>
											<div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center'>
												<Package className='h-5 w-5 text-white' />
											</div>
											<div>
												<p className='text-xs text-muted-foreground mb-0.5'>
													Jami summa
												</p>
												<p className='text-sm font-semibold text-blue-500'>
													{order.total_price
														? Number(order.total_price).toLocaleString('uz-UZ')
														: '0'}{' '}
													so'm
												</p>
											</div>
										</div>
									</div>

									<Separator />

									<div className='space-y-3'>
										<h4 className='text-sm font-semibold text-foreground'>
											Mahsulotlar
										</h4>
										<div className='space-y-2'>
											{order?.items?.map((item, idx) => (
												<div
													key={idx}
													className='flex items-start justify-between gap-4 p-4 rounded-lg bg-card border border-border hover:border-blue-500/30 transition-colors duration-200'
												>
													<Image
														src={item.image[0]}
														alt={item.product_name}
														width={100}
													/>
													<div className='flex-1 min-w-0'>
														<p className='text-sm font-medium text-foreground mb-1 line-clamp-2'>
															{item.product_name}
														</p>
														<p className='text-xs text-muted-foreground'>
															Rangi:{' '}
															<span className='font-medium'>
																{item.color || '—'}
															</span>
														</p>
														<div className='text-right shrink-0'>
															<p className='text-sm font-semibold text-foreground whitespace-nowrap'>
																{Number(item.price).toLocaleString('uz-UZ')}{' '}
																so'm
															</p>
															<p className='text-xs text-muted-foreground mt-0.5'>
																{item.quantity} dona
															</p>
														</div>
													</div>
												</div>
											))}
											{order.status == 'cancelled' ? (
												''
											) : (
												<div className='w-full flex justify-end text-white text-[11px]'>
													<Button
														className='bg-red-500 hover:bg-red-400 duration-300'
														onClick={() => {
															handClick(order.order_id)
														}}
													>
														{loads
															? 'Bekor qilinmoqda...'
															: 'Buyurtmani bekor qilish'}
													</Button>
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default MyOrder
